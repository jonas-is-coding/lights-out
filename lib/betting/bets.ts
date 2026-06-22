import "server-only";
import { pool } from "@/db";
import {
  toNum,
  round2,
  type PlaceBetResult,
  type CashOutResult,
  type SettleResult,
} from "./types";
import { findSelection } from "./markets";
import { awardLoyaltyPoints } from "./loyalty";

const MIN_STAKE = 1;
const MAX_STAKE = 5000;

export async function placeBet({
  userId,
  marketKey,
  selectionKey,
  stake,
  useFreeBet = false,
}: {
  userId: number;
  marketKey: string;
  selectionKey: string;
  stake: number;
  useFreeBet?: boolean;
}): Promise<PlaceBetResult> {
  if (!Number.isFinite(stake)) {
    return { ok: false, error: "Ungültiger Einsatz." };
  }
  const amount = round2(stake);
  if (amount < MIN_STAKE) return { ok: false, error: `Mindesteinsatz ist ${MIN_STAKE} €.` };
  if (amount > MAX_STAKE) return { ok: false, error: `Höchsteinsatz ist ${MAX_STAKE} €.` };

  // Odds are resolved server-side — never trusted from the caller.
  const found = await findSelection(marketKey, selectionKey);
  if (!found) return { ok: false, error: "Markt nicht verfügbar." };

  const odds = round2(found.selection.odds);
  const potentialReturn = round2(amount * odds);
  const description = `${found.selection.label} – ${found.market.title}`;
  const eventLabel = found.market.event;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let freeBet = false;
    let bonusId: number | null = null;
    let balance: number;

    if (useFreeBet) {
      const bonusRes = await client.query(
        `SELECT id FROM bonuses
         WHERE "userId" = $1 AND type = 'free_bet' AND status = 'active' AND amount >= $2
         ORDER BY expires_at ASC NULLS LAST
         LIMIT 1
         FOR UPDATE`,
        [userId, amount]
      );
      if (bonusRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return { ok: false, error: "Keine passende Gratiswette." };
      }
      bonusId = bonusRes.rows[0].id as number;
      freeBet = true;
      await client.query(`UPDATE bonuses SET status = 'used' WHERE id = $1`, [bonusId]);

      const wRes = await client.query(
        `SELECT balance FROM wallet WHERE "userId" = $1`,
        [userId]
      );
      balance = wRes.rows.length ? toNum(wRes.rows[0].balance) : 0;
    } else {
      const wRes = await client.query(
        `SELECT balance FROM wallet WHERE "userId" = $1 FOR UPDATE`,
        [userId]
      );
      const current = wRes.rows.length ? toNum(wRes.rows[0].balance) : 0;
      if (current < amount) {
        await client.query("ROLLBACK");
        return { ok: false, error: "Guthaben nicht ausreichend." };
      }
      balance = round2(current - amount);
      await client.query(
        `UPDATE wallet SET balance = $2, updated_at = now() WHERE "userId" = $1`,
        [userId, balance]
      );
    }

    const betRes = await client.query(
      `INSERT INTO bets
         ("userId", description, stake, odds, potential_return, status,
          market_key, selection_key, event_label, free_bet, boosted, bonus_id)
       VALUES ($1, $2, $3, $4, $5, 'active', $6, $7, $8, $9, false, $10)
       RETURNING id`,
      [
        userId,
        description,
        amount,
        odds,
        potentialReturn,
        marketKey,
        selectionKey,
        eventLabel,
        freeBet,
        bonusId,
      ]
    );
    const betId = betRes.rows[0].id as number;

    if (freeBet) {
      await client.query(
        `INSERT INTO transactions ("userId", type, amount, balance_after, description, bet_id)
         VALUES ($1, 'bonus', 0, $2, $3, $4)`,
        [userId, balance, `Gratiswette eingesetzt: ${description}`, betId]
      );
    } else {
      await client.query(
        `INSERT INTO transactions ("userId", type, amount, balance_after, description, bet_id)
         VALUES ($1, 'bet_stake', $2, $3, $4, $5)`,
        [userId, -amount, balance, `Einsatz: ${description}`, betId]
      );
      await awardLoyaltyPoints(client, userId, Math.floor(amount));
    }

    await client.query("COMMIT");
    return { ok: true, betId, balance, potentialReturn };
  } catch {
    await client.query("ROLLBACK");
    return { ok: false, error: "Wette konnte nicht platziert werden. Bitte erneut versuchen." };
  } finally {
    client.release();
  }
}

export async function cashOutBet({
  userId,
  betId,
}: {
  userId: number;
  betId: number;
}): Promise<CashOutResult> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const betRes = await client.query(
      `SELECT id, stake, potential_return, status
       FROM bets WHERE id = $1 AND "userId" = $2 FOR UPDATE`,
      [betId, userId]
    );
    if (betRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return { ok: false, error: "Wette nicht gefunden." };
    }
    const bet = betRes.rows[0];
    if (bet.status !== "active") {
      await client.query("ROLLBACK");
      return { ok: false, error: "Wette ist nicht mehr aktiv." };
    }

    const stake = toNum(bet.stake);
    const potentialReturn = toNum(bet.potential_return);

    let value = round2(stake + (potentialReturn - stake) * 0.55);
    value = Math.min(value, potentialReturn);
    value = Math.max(value, round2(stake * 0.2));

    await client.query(
      `UPDATE bets SET status = 'cashed_out', cashout_value = $2, settled_at = now()
       WHERE id = $1`,
      [betId, value]
    );

    const wRes = await client.query(
      `SELECT balance FROM wallet WHERE "userId" = $1 FOR UPDATE`,
      [userId]
    );
    const current = wRes.rows.length ? toNum(wRes.rows[0].balance) : 0;
    const balance = round2(current + value);
    await client.query(
      `INSERT INTO wallet ("userId", balance, currency)
       VALUES ($1, $2, 'EUR')
       ON CONFLICT ("userId")
       DO UPDATE SET balance = $2, updated_at = now()`,
      [userId, balance]
    );

    await client.query(
      `INSERT INTO transactions ("userId", type, amount, balance_after, description, bet_id)
       VALUES ($1, 'cashout', $2, $3, $4, $5)`,
      [userId, value, balance, "Cash Out", betId]
    );

    await client.query("COMMIT");
    return { ok: true, value, balance };
  } catch {
    await client.query("ROLLBACK");
    return { ok: false, error: "Cash Out fehlgeschlagen. Bitte erneut versuchen." };
  } finally {
    client.release();
  }
}

// Demo settlement: resolves an active bet without real F1 results, using the
// implied probability from the odds (1/odds, capped). For showcasing the loop.
export async function simulateSettlement({
  userId,
  betId,
}: {
  userId: number;
  betId: number;
}): Promise<SettleResult> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const betRes = await client.query(
      `SELECT id, stake, odds, potential_return, status, free_bet
       FROM bets WHERE id = $1 AND "userId" = $2 FOR UPDATE`,
      [betId, userId]
    );
    if (betRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return { ok: false, error: "Wette nicht gefunden." };
    }
    const bet = betRes.rows[0];
    if (bet.status !== "active") {
      await client.query("ROLLBACK");
      return { ok: false, error: "Wette ist bereits abgerechnet." };
    }

    const stake = toNum(bet.stake);
    const odds = toNum(bet.odds);
    const potentialReturn = toNum(bet.potential_return);
    const isFreeBet = bet.free_bet === true;

    const winProb = Math.min(0.92, odds > 0 ? 1 / odds : 0);
    const won = Math.random() < winProb;

    if (won) {
      const payout = isFreeBet
        ? round2(potentialReturn - stake)
        : round2(potentialReturn);

      await client.query(
        `UPDATE bets SET status = 'won', settled_at = now() WHERE id = $1`,
        [betId]
      );

      const wRes = await client.query(
        `SELECT balance FROM wallet WHERE "userId" = $1 FOR UPDATE`,
        [userId]
      );
      const current = wRes.rows.length ? toNum(wRes.rows[0].balance) : 0;
      const balance = round2(current + payout);
      await client.query(
        `INSERT INTO wallet ("userId", balance, currency)
         VALUES ($1, $2, 'EUR')
         ON CONFLICT ("userId")
         DO UPDATE SET balance = $2, updated_at = now()`,
        [userId, balance]
      );

      await client.query(
        `INSERT INTO transactions ("userId", type, amount, balance_after, description, bet_id)
         VALUES ($1, 'bet_payout', $2, $3, $4, $5)`,
        [userId, payout, balance, "Gewinn", betId]
      );

      await client.query("COMMIT");
      return { ok: true, outcome: "won", balance };
    }

    await client.query(
      `UPDATE bets SET status = 'lost', settled_at = now() WHERE id = $1`,
      [betId]
    );

    const wRes = await client.query(
      `SELECT balance FROM wallet WHERE "userId" = $1`,
      [userId]
    );
    const balance = wRes.rows.length ? toNum(wRes.rows[0].balance) : 0;

    await client.query("COMMIT");
    return { ok: true, outcome: "lost", balance };
  } catch {
    await client.query("ROLLBACK");
    return { ok: false, error: "Abrechnung fehlgeschlagen. Bitte erneut versuchen." };
  } finally {
    client.release();
  }
}

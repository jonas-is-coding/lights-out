import "server-only";
import { pool } from "@/db";
import { getNextRace as getNextRaceInfo } from "@/lib/f1/nextRace";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Wallet {
  balance: number;
  currency: string;
  updated_at?: Date | null;
}

export interface Bet {
  id: number;
  userId: number;
  description: string;
  stake: number;
  odds: number;
  potential_return: number;
  status: "active" | "won" | "lost" | "cashed_out";
  placed_at: Date;
  settled_at: Date | null;
  market_key?: string | null;
  selection_key?: string | null;
  event_label?: string | null;
  free_bet?: boolean;
  cashout_value?: number | null;
}

export interface Transaction {
  id: number;
  type: "deposit" | "bet_stake" | "bet_payout" | "cashout" | "bonus" | "refund";
  amount: number;
  balance_after: number;
  description: string | null;
  created_at: Date;
}

export interface Bonus {
  id: number;
  userId: number;
  type: "free_bet" | "payout_boost" | "acca_insurance";
  label: string;
  amount: number;
  status: "active" | "used" | "expired";
  expires_at: Date | null;
}

export interface Loyalty {
  points: number;
  tier: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function toNum(value: unknown): number {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export async function getWallet(userId: number): Promise<Wallet> {
  const result = await pool.query(
    `SELECT balance, currency, updated_at FROM wallet WHERE "userId" = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return { balance: 0, currency: "EUR" };
  }

  const row = result.rows[0];
  return {
    balance: toNum(row.balance),
    currency: row.currency ?? "EUR",
    updated_at: row.updated_at ?? null,
  };
}

export async function getBets(
  userId: number
): Promise<{ bets: Bet[]; activeCount: number }> {
  const result = await pool.query(
    `SELECT id, "userId", description, stake, odds, potential_return,
            status, placed_at, settled_at,
            market_key, selection_key, event_label, free_bet, cashout_value
     FROM bets
     WHERE "userId" = $1
     ORDER BY placed_at DESC`,
    [userId]
  );

  const bets: Bet[] = result.rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    description: row.description,
    stake: toNum(row.stake),
    odds: toNum(row.odds),
    potential_return: toNum(row.potential_return),
    status: row.status,
    placed_at: row.placed_at,
    settled_at: row.settled_at ?? null,
    market_key: row.market_key ?? null,
    selection_key: row.selection_key ?? null,
    event_label: row.event_label ?? null,
    free_bet: row.free_bet ?? false,
    cashout_value: row.cashout_value !== null && row.cashout_value !== undefined
      ? toNum(row.cashout_value)
      : null,
  }));

  const activeCount = bets.filter((b) => b.status === "active").length;

  return { bets, activeCount };
}

export async function getBonuses(userId: number): Promise<Bonus[]> {
  const result = await pool.query(
    `SELECT id, "userId", type, label, amount, status, expires_at
     FROM bonuses
     WHERE "userId" = $1
     ORDER BY expires_at ASC NULLS LAST`,
    [userId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    type: row.type,
    label: row.label,
    amount: toNum(row.amount),
    status: row.status,
    expires_at: row.expires_at ?? null,
  }));
}

export async function getLoyalty(userId: number): Promise<Loyalty> {
  const result = await pool.query(
    `SELECT points, tier FROM loyalty WHERE "userId" = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return { points: 0, tier: "Starter Grid" };
  }

  const row = result.rows[0];
  return {
    points: toNum(row.points),
    tier: row.tier ?? "Starter Grid",
  };
}

export async function getUserCountry(
  userId: number
): Promise<string | null> {
  const result = await pool.query(
    `SELECT country FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) return null;
  return result.rows[0].country ?? null;
}

export interface DashboardStats {
  activeCount: number;
  settledCount: number;
  wonCount: number;
  winRate: number; // 0..1
  totalStaked: number;
  biggestWin: number;
  netProfit: number;
  bankroll: number[]; // chronological balance_after points for sparkline
}

export async function getDashboardStats(
  userId: number
): Promise<DashboardStats> {
  const [betAgg, txAgg, trend] = await Promise.all([
    pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'active')                       AS active,
         COUNT(*) FILTER (WHERE status IN ('won','lost','cashed_out'))   AS settled,
         COUNT(*) FILTER (WHERE status = 'won')                          AS won,
         COALESCE(SUM(stake), 0)                                         AS total_staked,
         COALESCE(MAX(potential_return) FILTER (WHERE status = 'won'), 0) AS biggest_win
       FROM bets WHERE "userId" = $1`,
      [userId]
    ),
    pool.query(
      `SELECT
         COALESCE(SUM(ABS(amount)) FILTER (WHERE type IN ('bet_payout','cashout')), 0) AS returns,
         COALESCE(SUM(ABS(amount)) FILTER (WHERE type = 'bet_stake'), 0)               AS staked_cash
       FROM transactions WHERE "userId" = $1`,
      [userId]
    ),
    pool.query(
      `SELECT balance_after FROM transactions
       WHERE "userId" = $1
       ORDER BY created_at ASC, id ASC
       LIMIT 60`,
      [userId]
    ),
  ]);

  const b = betAgg.rows[0] ?? {};
  const t = txAgg.rows[0] ?? {};
  const settled = toNum(b.settled);
  const won = toNum(b.won);

  return {
    activeCount: toNum(b.active),
    settledCount: settled,
    wonCount: won,
    winRate: settled > 0 ? won / settled : 0,
    totalStaked: toNum(b.total_staked),
    biggestWin: toNum(b.biggest_win),
    netProfit: toNum(t.returns) - toNum(t.staked_cash),
    bankroll: trend.rows.map((r) => toNum(r.balance_after)),
  };
}

export interface NextRace {
  raceName: string;
  circuitName: string;
  locality: string;
  country: string;
  round: string;
  season: string;
  startsAt: string | null; // ISO datetime
}

export async function getNextRace(): Promise<NextRace> {
  const r = await getNextRaceInfo();
  const startsAt = r.date
    ? `${r.date}T${r.time && r.time.length >= 8 ? r.time : "13:00:00Z"}`
    : null;

  return {
    raceName: r.raceName,
    circuitName: r.circuitName,
    locality: r.locality,
    country: r.country,
    round: r.round,
    season: r.season,
    startsAt,
  };
}

export async function getTransactions(
  userId: number,
  limit = 10
): Promise<Transaction[]> {
  const result = await pool.query(
    `SELECT id, type, amount, balance_after, description, created_at
     FROM transactions
     WHERE "userId" = $1
     ORDER BY created_at DESC, id DESC
     LIMIT $2`,
    [userId, limit]
  );

  return result.rows.map((row) => ({
    id: row.id,
    type: row.type,
    amount: toNum(row.amount),
    balance_after: toNum(row.balance_after),
    description: row.description ?? null,
    created_at: row.created_at,
  }));
}

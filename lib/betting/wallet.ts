import "server-only";
import { pool } from "@/db";
import { toNum, round2, type DepositResult } from "./types";

export async function getBalance(userId: number): Promise<number> {
  const result = await pool.query(
    `SELECT balance FROM wallet WHERE "userId" = $1`,
    [userId]
  );
  if (result.rows.length === 0) return 0;
  return toNum(result.rows[0].balance);
}

export async function deposit({
  userId,
  amount,
}: {
  userId: number;
  amount: number;
}): Promise<DepositResult> {
  if (!Number.isFinite(amount)) {
    return { ok: false, error: "Ungültiger Betrag." };
  }
  const value = round2(amount);
  if (value < 1) return { ok: false, error: "Mindestbetrag ist 1 €." };
  if (value > 10000) return { ok: false, error: "Höchstbetrag ist 10.000 €." };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const res = await client.query(
      `INSERT INTO wallet ("userId", balance, currency)
       VALUES ($1, $2, 'EUR')
       ON CONFLICT ("userId")
       DO UPDATE SET balance = wallet.balance + EXCLUDED.balance, updated_at = now()
       RETURNING balance`,
      [userId, value]
    );
    const balance = toNum(res.rows[0].balance);

    await client.query(
      `INSERT INTO transactions ("userId", type, amount, balance_after, description)
       VALUES ($1, 'deposit', $2, $3, $4)`,
      [userId, value, balance, "Einzahlung"]
    );

    await client.query("COMMIT");
    return { ok: true, balance };
  } catch {
    await client.query("ROLLBACK");
    return { ok: false, error: "Einzahlung fehlgeschlagen. Bitte erneut versuchen." };
  } finally {
    client.release();
  }
}

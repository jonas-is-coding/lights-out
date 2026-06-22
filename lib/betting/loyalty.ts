import "server-only";
import type { PoolClient } from "@neondatabase/serverless";
import { toNum } from "./types";

export function tierForPoints(points: number): string {
  if (points >= 2000) return "Champion";
  if (points >= 500) return "Pole Position";
  return "Starter Grid";
}

// Adds loyalty points within an existing transaction (shares the bet's client).
export async function awardLoyaltyPoints(
  client: PoolClient,
  userId: number,
  points: number
): Promise<void> {
  if (points <= 0) return;

  const res = await client.query(
    `INSERT INTO loyalty ("userId", points, tier)
     VALUES ($1, $2, $3)
     ON CONFLICT ("userId")
     DO UPDATE SET points = loyalty.points + EXCLUDED.points
     RETURNING points`,
    [userId, points, tierForPoints(points)]
  );

  const total = toNum(res.rows[0].points);
  await client.query(`UPDATE loyalty SET tier = $2 WHERE "userId" = $1`, [
    userId,
    tierForPoints(total),
  ]);
}

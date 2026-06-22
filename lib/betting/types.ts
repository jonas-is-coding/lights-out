// Shared domain types for the betting feature.

export type MarketKey =
  | "race_winner"
  | "podium"
  | "pole"
  | "fastest_lap"
  | "constructor_champion";

export interface Selection {
  key: string;
  label: string;
  sub?: string;
  odds: number;
  image?: string; // optional koala portrait, e.g. /drivers/verstappen.png
}

export interface Market {
  key: MarketKey;
  title: string;
  event: string;
  selections: Selection[];
}

export type PlaceBetResult =
  | { ok: true; betId: number; balance: number; potentialReturn: number }
  | { ok: false; error: string };

export type DepositResult =
  | { ok: true; balance: number }
  | { ok: false; error: string };

export type CashOutResult =
  | { ok: true; value: number; balance: number }
  | { ok: false; error: string };

export type SettleResult =
  | { ok: true; outcome: "won" | "lost"; balance: number }
  | { ok: false; error: string };

// Numeric helpers shared across the domain modules.
export function toNum(value: unknown): number {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

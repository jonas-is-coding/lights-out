"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { deposit } from "@/lib/betting/wallet";
import { placeBet, cashOutBet, simulateSettlement } from "@/lib/betting/bets";
import type {
  DepositResult,
  PlaceBetResult,
  CashOutResult,
  SettleResult,
} from "@/lib/betting/types";

async function currentUserId(): Promise<number | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const id = parseInt(session.user.id, 10);
  return Number.isFinite(id) ? id : null;
}

function revalidateDashboard() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bets");
  revalidatePath("/dashboard/markets");
  revalidatePath("/dashboard/account");
}

export async function depositAction(amount: number): Promise<DepositResult> {
  const userId = await currentUserId();
  if (userId === null) return { ok: false, error: "Nicht angemeldet." };

  const result = await deposit({ userId, amount });
  if (result.ok) revalidateDashboard();
  return result;
}

export async function placeBetAction(input: {
  marketKey: string;
  selectionKey: string;
  stake: number;
  useFreeBet?: boolean;
}): Promise<PlaceBetResult> {
  const userId = await currentUserId();
  if (userId === null) return { ok: false, error: "Nicht angemeldet." };

  const result = await placeBet({ userId, ...input });
  if (result.ok) revalidateDashboard();
  return result;
}

export async function cashOutAction(betId: number): Promise<CashOutResult> {
  const userId = await currentUserId();
  if (userId === null) return { ok: false, error: "Nicht angemeldet." };

  const result = await cashOutBet({ userId, betId });
  if (result.ok) revalidateDashboard();
  return result;
}

export async function simulateSettlementAction(
  betId: number
): Promise<SettleResult> {
  const userId = await currentUserId();
  if (userId === null) return { ok: false, error: "Nicht angemeldet." };

  const result = await simulateSettlement({ userId, betId });
  if (result.ok) revalidateDashboard();
  return result;
}

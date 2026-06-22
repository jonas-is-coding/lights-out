"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cashOutAction, simulateSettlementAction } from "@/app/actions/betting";
import styles from "../Dashboard.module.css";

interface BetActionsProps {
  betId: number;
}

export function BetActions({ betId }: BetActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [isWon, setIsWon] = useState<boolean | null>(null);

  function handleCashOut() {
    setResultMsg(null);
    startTransition(async () => {
      const result = await cashOutAction(betId);
      if (result.ok) {
        setResultMsg(`Cash Out: €${result.value.toFixed(2)}`);
        setIsWon(true);
        router.refresh();
      } else {
        setResultMsg(result.error);
        setIsWon(false);
      }
    });
  }

  function handleSimulate() {
    setResultMsg(null);
    startTransition(async () => {
      const result = await simulateSettlementAction(betId);
      if (result.ok) {
        if (result.outcome === "won") {
          setResultMsg("Gewonnen!");
          setIsWon(true);
        } else {
          setResultMsg("Verloren");
          setIsWon(false);
        }
        router.refresh();
      } else {
        setResultMsg(result.error);
        setIsWon(false);
      }
    });
  }

  if (resultMsg) {
    return (
      <span
        className={
          isWon ? styles.betResultWon : styles.betResultLost
        }
      >
        {resultMsg}
      </span>
    );
  }

  return (
    <div className={styles.betActionsWrap}>
      <button
        type="button"
        className={styles.betActionBtn}
        onClick={handleCashOut}
        disabled={isPending}
        title="Wette jetzt auszahlen"
      >
        {isPending ? "..." : "Cash Out"}
      </button>
      <button
        type="button"
        className={`${styles.betActionBtn} ${styles.betActionBtnSecondary}`}
        onClick={handleSimulate}
        disabled={isPending}
        title="Ergebnis simulieren"
      >
        {isPending ? "..." : "Simulieren"}
      </button>
    </div>
  );
}

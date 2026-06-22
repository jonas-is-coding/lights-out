"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { depositAction } from "@/app/actions/betting";
import styles from "./Dashboard.module.css";

export function DepositForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const amountNum = parseFloat(amount) || 0;

  function handleQuick(value: number) {
    setAmount(String(value));
    setSuccessMsg(null);
    setErrorMsg(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (amountNum < 1) {
      setErrorMsg("Mindestbetrag ist €1,00.");
      return;
    }

    startTransition(async () => {
      const result = await depositAction(amountNum);
      if (result.ok) {
        setSuccessMsg(`Einzahlung erfolgreich! Neues Guthaben: €${result.balance.toFixed(2)}`);
        setAmount("");
        router.refresh();
      } else {
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <div className={styles.depositCard}>
      <p className={styles.depositCardTitle}>Schnell einzahlen</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.depositQuick}>
          {[10, 25, 50, 100].map((val) => (
            <button
              key={val}
              type="button"
              className={
                amountNum === val
                  ? `${styles.depositQuickBtn} ${styles.depositQuickBtnActive}`
                  : styles.depositQuickBtn
              }
              onClick={() => handleQuick(val)}
              disabled={isPending}
            >
              €{val}
            </button>
          ))}
        </div>

        <div className={styles.depositInputWrap}>
          <span className={styles.depositPrefix}>€</span>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Eigener Betrag"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSuccessMsg(null);
              setErrorMsg(null);
            }}
            disabled={isPending}
            className={styles.depositInput}
          />
        </div>

        {successMsg && <p className={styles.depositSuccess}>{successMsg}</p>}
        {errorMsg && <p className={styles.depositError}>{errorMsg}</p>}

        <button
          type="submit"
          className={styles.depositBtn}
          disabled={isPending || amountNum < 1}
        >
          {isPending ? "Wird einzahlt..." : "Einzahlen"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { placeBetAction } from "@/app/actions/betting";
import type { Market } from "@/lib/betting/types";
import styles from "./Markets.module.css";

interface BetSlipProps {
  markets: Market[];
  balance: number;
  freeBetCount: number;
}

export function BetSlip({ markets, balance, freeBetCount }: BetSlipProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeMarketKey, setActiveMarketKey] = useState<string>(
    markets[0]?.key ?? ""
  );
  const [selectedSelectionKey, setSelectedSelectionKey] = useState<string>("");
  const [stake, setStake] = useState<string>("");
  const [useFreeBet, setUseFreeBet] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeMarket = markets.find((m) => m.key === activeMarketKey) ?? markets[0];
  const selectedSelection = activeMarket?.selections.find(
    (s) => s.key === selectedSelectionKey
  );

  const stakeNum = parseFloat(stake) || 0;
  const potentialReturn =
    selectedSelection && stakeNum > 0
      ? stakeNum * selectedSelection.odds
      : 0;

  function handleMarketChange(key: string) {
    setActiveMarketKey(key);
    setSelectedSelectionKey("");
    setSuccessMsg(null);
    setErrorMsg(null);
  }

  function handleQuickStake(amount: number) {
    setStake(String(amount));
    setSuccessMsg(null);
    setErrorMsg(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!selectedSelection) {
      setErrorMsg("Bitte wähle eine Auswahl aus.");
      return;
    }
    if (stakeNum < 1) {
      setErrorMsg("Mindesteinsatz ist €1,00.");
      return;
    }
    if (!useFreeBet && stakeNum > balance) {
      setErrorMsg("Dein Guthaben reicht nicht aus.");
      return;
    }

    startTransition(async () => {
      const result = await placeBetAction({
        marketKey: activeMarket.key,
        selectionKey: selectedSelection.key,
        stake: stakeNum,
        useFreeBet,
      });

      if (result.ok) {
        setSuccessMsg(
          `Wette platziert! Möglicher Gewinn €${result.potentialReturn.toFixed(2)}`
        );
        setStake("");
        setSelectedSelectionKey("");
        setUseFreeBet(false);
        router.refresh();
      } else {
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <div className={styles.layout}>
      {/* Left: Market selection + selections */}
      <div className={styles.marketPanel}>
        {/* Market tabs */}
        <div className={styles.marketTabs}>
          {markets.map((m) => (
            <button
              key={m.key}
              type="button"
              className={
                m.key === activeMarketKey
                  ? `${styles.marketTab} ${styles.marketTabActive}`
                  : styles.marketTab
              }
              onClick={() => handleMarketChange(m.key)}
            >
              {m.title}
            </button>
          ))}
        </div>

        {/* Event label */}
        {activeMarket && (
          <p className={styles.eventLabel}>{activeMarket.event}</p>
        )}

        {/* Selections */}
        <div className={styles.selectionsGrid}>
          {activeMarket?.selections.map((sel) => (
            <button
              key={sel.key}
              type="button"
              className={
                sel.key === selectedSelectionKey
                  ? `${styles.selectionBtn} ${styles.selectionBtnActive}`
                  : styles.selectionBtn
              }
              onClick={() => {
                setSelectedSelectionKey(
                  sel.key === selectedSelectionKey ? "" : sel.key
                );
                setSuccessMsg(null);
                setErrorMsg(null);
              }}
            >
              <span className={styles.selectionLabel}>{sel.label}</span>
              {sel.sub && (
                <span className={styles.selectionSub}>{sel.sub}</span>
              )}
              <span className={styles.selectionOdds}>{sel.odds.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Bet slip panel */}
      <div className={styles.slipPanel}>
        <div className={styles.slipCard}>
          <h2 className={styles.slipTitle}>Wettschein</h2>

          {/* Selected pick summary */}
          {selectedSelection ? (
            <div className={styles.slipPick}>
              <div className={styles.slipPickInfo}>
                <span className={styles.slipPickLabel}>
                  {selectedSelection.label}
                </span>
                <span className={styles.slipPickMarket}>
                  {activeMarket?.title}
                </span>
              </div>
              <span className={styles.slipPickOdds}>
                {selectedSelection.odds.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className={styles.slipEmpty}>
              <Image
                src="/Wettschein.png"
                alt=""
                width={1402}
                height={1122}
                className={styles.slipEmptyImage}
              />
              <p>Wähle links eine Auswahl aus, um deine Wette aufzubauen.</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Quick amounts */}
            <div className={styles.quickAmounts}>
              {[5, 10, 25, 50].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={
                    stakeNum === amt
                      ? `${styles.quickAmtBtn} ${styles.quickAmtBtnActive}`
                      : styles.quickAmtBtn
                  }
                  onClick={() => handleQuickStake(amt)}
                  disabled={isPending}
                >
                  €{amt}
                </button>
              ))}
            </div>

            {/* Stake input */}
            <label className={styles.stakeLabel}>
              <span className={styles.stakeLabelText}>Einsatz (€)</span>
              <div className={styles.stakeInputWrap}>
                <span className={styles.stakePrefix}>€</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0,00"
                  value={stake}
                  onChange={(e) => {
                    setStake(e.target.value);
                    setSuccessMsg(null);
                    setErrorMsg(null);
                  }}
                  disabled={isPending}
                  className={styles.stakeInput}
                />
              </div>
            </label>

            {/* Potential return */}
            <div className={styles.returnRow}>
              <span className={styles.returnLabel}>Möglicher Gewinn</span>
              <span className={styles.returnValue}>
                {potentialReturn > 0
                  ? `€${potentialReturn.toFixed(2)}`
                  : "—"}
              </span>
            </div>

            {/* Balance info */}
            <div className={styles.balanceRow}>
              <span className={styles.returnLabel}>Dein Guthaben</span>
              <span className={styles.balanceValue}>
                €{balance.toFixed(2)}
              </span>
            </div>

            {/* Free bet checkbox */}
            {freeBetCount > 0 && (
              <label className={styles.freeBetLabel}>
                <input
                  type="checkbox"
                  checked={useFreeBet}
                  onChange={(e) => setUseFreeBet(e.target.checked)}
                  disabled={isPending}
                  className={styles.freeBetCheckbox}
                />
                <span>
                  Gratiswette verwenden ({freeBetCount}{" "}
                  {freeBetCount === 1 ? "verfügbar" : "verfügbar"})
                </span>
              </label>
            )}

            {/* Messages */}
            {successMsg && (
              <div className={styles.successMsg}>
                <Image
                  src="/erfolg.png"
                  alt=""
                  width={1122}
                  height={1402}
                  className={styles.successImage}
                />
                <p>{successMsg}</p>
              </div>
            )}
            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

            {/* Submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isPending || !selectedSelection || stakeNum < 1}
            >
              {isPending ? "Wird platziert..." : "Wette platzieren"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getWallet,
  getBets,
  getBonuses,
  getLoyalty,
  getTransactions,
  getDashboardStats,
  getNextRace,
} from "./queries";
import { DepositForm } from "./DepositForm";
import { NextRaceCard } from "./NextRaceCard";
import styles from "./Dashboard.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | LIGHTS OUT",
  description: "Dein LIGHTS OUT Rennwetten-Dashboard.",
};

const fmt = (amount: number): string => `€${amount.toFixed(2)}`;
const signed = (amount: number): string =>
  `${amount >= 0 ? "+" : "−"}€${Math.abs(amount).toFixed(2)}`;

// Treue-Stufen — Schwellen identisch zum öffentlichen Treueprogramm.
const TIERS = [
  { name: "Starter Grid", min: 0, next: 500 },
  { name: "Pole Position", min: 500, next: 2000 },
  { name: "Champion", min: 2000, next: null as number | null },
];

// Mini-SVG-Verlauf des Guthabens (kein JS nötig — rein serverseitig gerendert).
function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const w = 240;
  const h = 56;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = h - 6 - ((p - min) / span) * (h - 12);
    return [x, y] as const;
  });
  const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} ${w},${h} 0,${h}`;
  const up = points[points.length - 1] >= points[0];
  const stroke = up ? "var(--app-pos)" : "var(--app-accent)";

  return (
    <svg className={styles.spark} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      <polygon points={area} fill={up ? "var(--app-pos-soft)" : "var(--app-accent-soft)"} />
      <polyline points={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = parseInt(session.user.id, 10);

  const [wallet, { bets }, bonuses, loyalty, recentTxs, stats, nextRace] =
    await Promise.all([
      getWallet(userId),
      getBets(userId),
      getBonuses(userId),
      getLoyalty(userId),
      getTransactions(userId, 6),
      getDashboardStats(userId),
      getNextRace(),
    ]);

  const freeBetsTotal = bonuses
    .filter((b) => b.type === "free_bet" && b.status === "active")
    .reduce((sum, b) => sum + b.amount, 0);

  const openBets = bets.filter((b) => b.status === "active").slice(0, 3);

  const firstName =
    session.user.name?.split(" ")[0] ?? session.user.name ?? "Racer";

  // Treue-Fortschritt berechnen
  const tierIdx = Math.max(
    0,
    TIERS.map((t) => loyalty.points >= t.min).lastIndexOf(true)
  );
  const tier = TIERS[tierIdx];
  const tierProgress =
    tier.next === null
      ? 1
      : Math.min(1, (loyalty.points - tier.min) / (tier.next - tier.min));
  const pointsToNext = tier.next === null ? 0 : tier.next - loyalty.points;

  return (
    <main className={styles.main}>
      <div className="container">
        {/* Greeting */}
        <div className={styles.greeting}>
          <p className={styles.greetingEyebrow}>Fahrer-Dashboard</p>
          <h1 className={styles.greetingTitle}>
            Willkommen zurück,
            <br />
            {firstName}
          </h1>
        </div>

        {/* Top row: Wallet + Next race countdown */}
        <div className={styles.topGrid}>
          <div className={styles.walletCard}>
            <div>
              <p className={styles.walletLabel}>Guthaben</p>
              <div className={styles.walletBalance}>{fmt(wallet.balance)}</div>
              <p className={styles.walletCurrency}>{wallet.currency} Konto</p>
              {freeBetsTotal > 0 && (
                <span className={styles.walletFreeBet}>
                  + {fmt(freeBetsTotal)} Gratiswetten
                </span>
              )}
            </div>
            <Link href="/dashboard/markets" className={styles.ctaBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12h8M12 8v8" />
              </svg>
              Wette platzieren
            </Link>
          </div>

          <NextRaceCard
            raceName={nextRace?.raceName ?? "Wird geladen…"}
            location={
              nextRace
                ? [nextRace.locality, nextRace.country].filter(Boolean).join(", ")
                : ""
            }
            startsAt={nextRace?.startsAt ?? null}
          />
        </div>

        {/* Performance stats */}
        <div className={styles.perfGrid}>
          <div className={styles.statCell}>
            <p className={styles.statLabel}>Aktive Wetten</p>
            <p className={styles.statValue}>{stats.activeCount}</p>
          </div>
          <div className={styles.statCell}>
            <p className={styles.statLabel}>Netto G/V</p>
            <p
              className={`${styles.statValue} ${
                stats.netProfit > 0
                  ? styles.statPos
                  : stats.netProfit < 0
                  ? styles.statNeg
                  : ""
              }`}
            >
              {signed(stats.netProfit)}
            </p>
          </div>
          <div className={styles.statCell}>
            <p className={styles.statLabel}>Trefferquote</p>
            <p className={styles.statValue}>
              {Math.round(stats.winRate * 100)}
              <span className={styles.statUnit}>%</span>
            </p>
            <p className={styles.statSub}>
              {stats.wonCount}/{stats.settledCount} gewonnen
            </p>
          </div>
          <div className={styles.statCell}>
            <p className={styles.statLabel}>Gesamteinsatz</p>
            <p className={styles.statValue}>{fmt(stats.totalStaked)}</p>
            {stats.biggestWin > 0 && (
              <p className={styles.statSub}>
                Höchster Gewinn {fmt(stats.biggestWin)}
              </p>
            )}
          </div>
        </div>

        {/* Mid row: open positions + bankroll trend */}
        <div className={styles.midGrid}>
          <div className={styles.panelCard}>
            <div className={styles.panelHead}>
              <p className={styles.panelTitle}>Offene Wetten</p>
              <Link href="/dashboard/bets" className={styles.panelLink}>
                Alle ansehen →
              </Link>
            </div>

            {openBets.length > 0 ? (
              <ul className={styles.openList}>
                {openBets.map((bet) => (
                  <li key={bet.id} className={styles.openRow}>
                    <div className={styles.openInfo}>
                      <span className={styles.openDesc}>{bet.description}</span>
                      <span className={styles.openMeta}>
                        {fmt(bet.stake)} · Quote {bet.odds.toFixed(2)}
                        {bet.free_bet && (
                          <span className={styles.badgeFreeBet}>Gratis</span>
                        )}
                      </span>
                    </div>
                    <span className={styles.openReturn}>
                      {fmt(bet.potential_return)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.panelEmpty}>
                <p>Noch keine offenen Wetten.</p>
                <Link href="/dashboard/markets" className={styles.panelLink}>
                  Jetzt platzieren →
                </Link>
              </div>
            )}
          </div>

          <div className={styles.panelCard}>
            <div className={styles.panelHead}>
              <p className={styles.panelTitle}>Guthaben-Verlauf</p>
              <span className={styles.panelBalance}>{fmt(wallet.balance)}</span>
            </div>
            {stats.bankroll.length >= 2 ? (
              <Sparkline points={stats.bankroll} />
            ) : (
              <div className={styles.panelEmpty}>
                <p>Verlauf erscheint, sobald du erste Transaktionen hast.</p>
              </div>
            )}
          </div>
        </div>

        {/* Loyalty progress */}
        <div className={styles.loyaltyCard}>
          <div className={styles.loyaltyTop}>
            <div>
              <p className={styles.statLabel}>Treue-Stufe</p>
              <p className={styles.loyaltyTier}>{loyalty.tier}</p>
            </div>
            <div className={styles.loyaltyPoints}>
              <span className={styles.loyaltyPointsVal}>{loyalty.points}</span>
              <span className={styles.statSub}>Rennpunkte</span>
            </div>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.round(tierProgress * 100)}%` }}
            />
          </div>
          <p className={styles.statSub}>
            {tier.next === null
              ? "Höchste Stufe erreicht — Champion."
              : `Noch ${pointsToNext} Punkte bis ${TIERS[tierIdx + 1].name}.`}
          </p>
        </div>

        {/* Bottom row: Deposit + Recent transactions */}
        <div className={styles.bottomGrid}>
          <DepositForm />

          <div className={styles.recentTxCard}>
            <p className={styles.depositCardTitle}>Letzte Transaktionen</p>
            {recentTxs.length > 0 ? (
              <ul className={styles.txList}>
                {recentTxs.map((tx) => {
                  const txLabelMap: Record<string, string> = {
                    deposit: "Einzahlung",
                    bet_stake: "Wette",
                    bet_payout: "Gewinn",
                    cashout: "Cash Out",
                    bonus: "Bonus",
                    refund: "Rückerstattung",
                  };
                  const isPositive = ["deposit", "bet_payout", "cashout", "bonus", "refund"].includes(tx.type);
                  return (
                    <li key={tx.id} className={styles.txRow}>
                      <span className={styles.txLabel}>
                        {tx.description ?? txLabelMap[tx.type] ?? tx.type}
                      </span>
                      <span className={isPositive ? styles.txAmtPos : styles.txAmtNeg}>
                        {isPositive ? "+" : "-"}€{Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className={styles.panelEmpty}>
                <p>Noch keine Transaktionen.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

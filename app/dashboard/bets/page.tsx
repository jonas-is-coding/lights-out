import type { Metadata } from "next";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBets } from "../queries";
import type { Bet } from "../queries";
import { BetActions } from "./BetActions";
import styles from "../Dashboard.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meine Wetten | LIGHTS OUT",
  description: "Deine vollständige Wett-Historie auf LIGHTS OUT.",
};

function formatCurrency(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: Bet["status"] }) {
  const classMap: Record<Bet["status"], string> = {
    active: styles.badgeActive,
    won: styles.badgeWon,
    lost: styles.badgeLost,
    cashed_out: styles.badgeCashedOut,
  };

  const labelMap: Record<Bet["status"], string> = {
    active: "Aktiv",
    won: "Gewonnen",
    lost: "Verloren",
    cashed_out: "Ausgezahlt",
  };

  return (
    <span className={`${styles.badge} ${classMap[status]}`}>
      {labelMap[status]}
    </span>
  );
}

export default async function BetsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = parseInt(session.user.id, 10);
  const { bets } = await getBets(userId);

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageEyebrow}>Renn-Historie</p>
          <h1 className={styles.pageTitle}>Meine Wetten</h1>
        </div>

        {bets.length === 0 ? (
          <div className={styles.empty}>
            <Image
              src="/leerer-zustand.png"
              alt=""
              width={1402}
              height={1122}
              className={styles.emptyImage}
            />
            <p className={styles.emptyLabel}>Noch keine Wetten</p>
            <p className={styles.emptyText}>
              Deine platzierten Wetten erscheinen hier nach deinem ersten Einsatz auf einem Formel-1-Markt.
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Markt</th>
                <th>Einsatz</th>
                <th>Quote</th>
                <th>Möglicher Gewinn</th>
                <th>Platziert</th>
                <th>Status</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {bets.map((bet) => (
                <tr key={bet.id}>
                  <td className={styles.betDesc}>
                    {bet.description}
                    {bet.free_bet && (
                      <span className={styles.badgeFreeBet}>Gratis</span>
                    )}
                  </td>
                  <td>{formatCurrency(bet.stake)}</td>
                  <td>{bet.odds.toFixed(2)}</td>
                  <td>
                    {bet.status === "cashed_out" && bet.cashout_value !== null && bet.cashout_value !== undefined
                      ? formatCurrency(bet.cashout_value)
                      : formatCurrency(bet.potential_return)}
                  </td>
                  <td>{formatDate(bet.placed_at)}</td>
                  <td>
                    <StatusBadge status={bet.status} />
                  </td>
                  <td>
                    {bet.status === "active" ? (
                      <BetActions betId={bet.id} />
                    ) : (
                      <span className={styles.txAmtNeg}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

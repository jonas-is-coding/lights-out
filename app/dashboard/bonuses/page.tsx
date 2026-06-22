import type { Metadata } from "next";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBonuses } from "../queries";
import type { Bonus } from "../queries";
import styles from "../Dashboard.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Boni | LIGHTS OUT",
  description: "Deine aktiven Boni und Gratiswetten auf LIGHTS OUT.",
};

function formatCurrency(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

function formatDate(date: Date | null): string {
  if (!date) return "Kein Ablauf";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function typeLabel(type: Bonus["type"]): string {
  const map: Record<Bonus["type"], string> = {
    free_bet: "Gratiswette",
    payout_boost: "Auszahlungs-Boost",
    acca_insurance: "Kombi-Versicherung",
  };
  return map[type];
}

function StatusBadge({ status }: { status: Bonus["status"] }) {
  const classMap: Record<Bonus["status"], string> = {
    active: styles.badgeActive,
    used: styles.badgeLost,
    expired: styles.badgeLost,
  };

  const labelMap: Record<Bonus["status"], string> = {
    active: "Aktiv",
    used: "Eingelöst",
    expired: "Abgelaufen",
  };

  return (
    <span className={`${styles.badge} ${classMap[status]}`}>
      {labelMap[status]}
    </span>
  );
}

export default async function BonusesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = parseInt(session.user.id, 10);
  const bonuses = await getBonuses(userId);

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageEyebrow}>Aktionen</p>
          <h1 className={styles.pageTitle}>Boni &amp; Gratiswetten</h1>
        </div>

        {bonuses.length === 0 ? (
          <div className={styles.empty}>
            <Image
              src="/leerer-zustand.png"
              alt=""
              width={1402}
              height={1122}
              className={styles.emptyImage}
            />
            <p className={styles.emptyLabel}>Keine Boni</p>
            <p className={styles.emptyText}>
              Aktive Gratiswetten, Auszahlungs-Boosts und Kombi-Versicherungs-Boni werden hier angezeigt, wenn sie vergeben werden.
            </p>
          </div>
        ) : (
          <div className={styles.bonusGrid}>
            {bonuses.map((bonus) => (
              <div key={bonus.id} className={styles.bonusCard}>
                <p className={styles.bonusType}>{typeLabel(bonus.type)}</p>
                <p className={styles.bonusLabel}>{bonus.label}</p>
                <p className={styles.bonusAmount}>
                  {formatCurrency(bonus.amount)}
                </p>
                <div className={styles.bonusMeta}>
                  <StatusBadge status={bonus.status} />
                  <span className={styles.bonusExpiry}>
                    Läuft ab: {formatDate(bonus.expires_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

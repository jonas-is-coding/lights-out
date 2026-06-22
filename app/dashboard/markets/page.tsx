import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMarkets } from "@/lib/betting/markets";
import { getWallet, getBonuses } from "@/app/dashboard/queries";
import { BetSlip } from "./BetSlip";
import styles from "../Dashboard.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Märkte | LIGHTS OUT",
  description: "Formel-1-Wettmärkte – platziere deine Wetten auf LIGHTS OUT.",
};

export default async function MarketsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = parseInt(session.user.id, 10);

  const [markets, wallet, bonuses] = await Promise.all([
    getMarkets(),
    getWallet(userId),
    getBonuses(userId),
  ]);

  const freeBetCount = bonuses.filter(
    (b) => b.type === "free_bet" && b.status === "active"
  ).length;

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageEyebrow}>Märkte</p>
          <h1 className={styles.pageTitle}>Wette platzieren</h1>
        </div>

        <BetSlip
          markets={markets}
          balance={wallet.balance}
          freeBetCount={freeBetCount}
        />
      </div>
    </main>
  );
}

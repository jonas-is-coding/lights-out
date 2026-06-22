import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLoyalty, getUserCountry } from "../queries";
import { logout } from "@/app/actions/auth";
import styles from "../Dashboard.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account | LIGHTS OUT",
  description: "Verwalte dein LIGHTS OUT Kontoprofil.",
};

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = parseInt(session.user.id, 10);

  const [loyalty, country] = await Promise.all([
    getLoyalty(userId),
    getUserCountry(userId),
  ]);

  const name = session.user.name ?? "—";
  const email = session.user.email ?? "—";

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageEyebrow}>Fahrer-Profil</p>
          <h1 className={styles.pageTitle}>Konto</h1>
        </div>

        <div className={styles.profileGrid}>
          {/* Personal info */}
          <div className={styles.profileCard}>
            <p className={styles.profileCardTitle}>Persönliche Daten</p>
            <div className={styles.profileRow}>
              <span className={styles.profileRowKey}>Name</span>
              <span className={styles.profileRowValue}>{name}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileRowKey}>E-Mail</span>
              <span className={styles.profileRowValue}>{email}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileRowKey}>Land</span>
              <span className={styles.profileRowValue}>{country ?? "—"}</span>
            </div>
          </div>

          {/* Membership */}
          <div className={styles.profileCard}>
            <p className={styles.profileCardTitle}>Mitgliedschaft</p>
            <div className={styles.profileRow}>
              <span className={styles.profileRowKey}>Treue-Stufe</span>
              <span className={styles.profileRowValue}>{loyalty.tier}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileRowKey}>Punkte</span>
              <span className={styles.profileRowValue}>
                {loyalty.points.toLocaleString()}
              </span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileRowKey}>Mitglied seit</span>
              <span className={styles.profileRowValue}>
                {formatDate(session.user.email ? new Date() : null)}
              </span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className={styles.logoutWrapper}>
          <p className={styles.logoutTitle}>Sitzung</p>
          <form action={logout}>
            <button type="submit" className={styles.logoutBtn}>
              Abmelden
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { logout } from "@/app/actions/auth";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Gratiswetten", href: "/free-bets" },
  { label: "Cash Out", href: "/cash-out" },
  { label: "Auszahlungs-Boost", href: "/payout-boost" },
  { label: "Kombi-Versicherung", href: "/acca-insurance" },
  { label: "Treueprogramm", href: "/loyalty" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated" && !!session?.user;
  const pathname = usePathname() ?? "/";

  // The signed-in dashboard and the docs page use their own header instead.
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/docs")) return null;

  return (
    <header className={`${styles.nav} ${styles.navLight}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.logoText}>
            LIGHTS<span className={styles.logoRed}>OUT</span>
          </span>
        </Link>

        <nav className={styles.links}>
          {navLinks.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.link} ${active ? styles.linkActive : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.right}>
          {isAuthed ? (
            <>
              <Link href="/dashboard" className={styles.account}>
                {session.user?.name ?? "Dashboard"}
              </Link>
              <form action={logout}>
                <button type="submit" className={styles.ghostBtn}>
                  Abmelden
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.account}>
                Anmelden
              </Link>
              <Link href="/register" className={styles.solidBtn}>
                Konto erstellen
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

const cols = [
  {
    title: "Wetten",
    links: [
      { label: "Live-Wetten", href: "/live-betting" },
      { label: "Rennsieger", href: "/race-winner" },
      { label: "Podium", href: "/podium" },
      { label: "Außenseiter", href: "/underdogs" },
      { label: "Schnellste Runde", href: "/fastest-lap" },
    ],
  },
  {
    title: "Aktionen",
    links: [
      { label: "Gratiswetten", href: "/free-bets" },
      { label: "Cash Out", href: "/cash-out" },
      { label: "Auszahlungs-Boost", href: "/payout-boost" },
      { label: "Kombi-Versicherung", href: "/acca-insurance" },
      { label: "Treueprogramm", href: "/loyalty" },
    ],
  },
  {
    title: "Hilfe",
    links: [
      { label: "Support", href: "/support" },
      { label: "Verantwortungsvolles Spielen", href: "/responsible-gaming" },
      { label: "Selbstausschluss", href: "/self-exclusion" },
      { label: "Zahlungsmethoden", href: "/payment-methods" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span /><span /><span /><span /><span />
            </div>
            <h3 className={styles.brandName}>
              LIGHTS<span className={styles.red}>OUT</span>
            </h3>
            <p className={styles.tagline}>
              Fünf rote Lichter. Ein grünes. Deine Wette ist aktiv.<br />
              Jedes Rennen. Jede Runde. Jeder Markt — live.
            </p>
            <form className={styles.newsletter} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="du@beispiel.de"
                className={styles.input}
              />
              <button className={styles.submit}>
                Gratiswette
                <span className={styles.arrow}>→</span>
              </button>
            </form>
          </div>

          <div className={styles.cols}>
            {cols.map((c) => (
              <div key={c.title} className={styles.col}>
                <span className={styles.colTitle}>{c.title}</span>
                <ul className={styles.list}>
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className={styles.link}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.meta}>© 2026 LIGHTS OUT SPORTSBOOK · 18+ · Spiele verantwortungsvoll</span>
          <span className={styles.meta}>
            3D model by{" "}
            <a
              href="https://instagram.com/peterkissdesign"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.metaLink}
            >
              Peter Kiss
            </a>
            {" "}· CC BY-NC-SA
          </span>
          <span className={styles.meta}>Nicht verbunden mit Formel 1®</span>
          <div className={styles.legal}>
            <a href="#">Datenschutz</a>
            <a href="#">Nutzungsbedingungen</a>
            <a href="#">Presse</a>
            <a href="#">Kontakt</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

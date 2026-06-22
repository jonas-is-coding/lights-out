import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import styles from "./LoyaltyPage.module.css";

export const metadata: Metadata = {
  title: "Treueprogramm | LIGHTS OUT",
  description:
    "Sammle Rennpunkte, entsperre Stufen und löse Belohnungen mit dem LIGHTS OUT Treueprogramm ein.",
};

const tiers = [
  {
    tier: "Starter Grid",
    points: "0-499 Pkt.",
    desc: "Einstiegsstufe mit wöchentlichen kostenlosen Spin-Drops und Renntag-Boost-Aktivierung.",
  },
  {
    tier: "Pole Position",
    points: "500-1.999 Pkt.",
    desc: "Höhere Quoten-Boosts, frühzeitiger Zugang zu hervorgehobenen Fahrermarkten und schnellerer Support.",
  },
  {
    tier: "Champion",
    points: "2.000+ Pkt.",
    desc: "Premium-Vorteile einschließlich exklusiver Auszahlungs-Boosts und monatlicher Cashback-Belohnungen.",
  },
];

export default function LoyaltyPage() {
  return (
    <div className={`${styles.page} lightApp`}>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.top}>
            <Link href="/" className={styles.back}>
              Zurück zur Startseite
            </Link>
            <span className={styles.status}>Treueprogramm · Aktiv</span>
          </div>

          <section className={styles.hero}>
            <div>
              <p className="eyebrow">Verdiene während du wettst</p>
              <h1 className={styles.title}>
                Treueprogramm das
                <br />
                jede Runde belohnt
              </h1>
              <p className={styles.subtitle}>
                Jede Qualifikations-, Sprint- und Grand-Prix-Wette verdient Punkte. Klettere durch Stufen, entsperre stärkere Rennwochenend-Boni und löse Belohnungen wann immer du möchtest ein.
              </p>
            </div>
            <Image
              src="/champion.png"
              alt=""
              width={1122}
              height={1402}
              priority
              className={styles.mascot}
            />
          </section>

          <section className={styles.grid}>
            {tiers.map((item) => (
              <article key={item.tier} className={styles.card}>
                <span className={styles.tier}>{item.tier}</span>
                <strong className={styles.points}>{item.points}</strong>
                <p className={styles.desc}>{item.desc}</p>
              </article>
            ))}
          </section>

          <section className={styles.info}>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>So funktionieren Punkte</h2>
              <ul className={styles.list}>
                <li>1 Punkt pro €1 abgerechneter Einsatz auf Vor-Rennstart- und Live-Märkten.</li>
                <li>2x Punkte auf ausgewählten Rennen, die als Doppel-Runden-Events gekennzeichnet sind.</li>
                <li>Stufenstatus wird automatisch nach jedem abgerechneten Wochenende aktualisiert.</li>
              </ul>
            </div>

            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Einlöse-Regeln</h2>
              <p className={styles.note}>
                Treuepunkte können in Gratiswetten-Guthaben umgewandelt werden. Belohnungen werden verfügbar, sobald ein Markt abgerechnet wird. Missbrauchsvorbeugungs- und regionale Berechtigungsprüfungen gelten.
              </p>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

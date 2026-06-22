import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import styles from "./FreeBetsPage.module.css";

export const metadata: Metadata = {
  title: "Gratiswetten | LIGHTS OUT",
  description:
    "Beanspruche und nutze Gratiswetten auf ausgewählten Formula-1-Märkten während Rennwochenenden.",
};

export default function FreeBetsPage() {
  return (
    <div className={`${styles.page} lightApp`}>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.top}>
            <Link href="/" className={styles.back}>
              Zurück zur Startseite
            </Link>
            <span className={styles.badge}>Promo-Wallet · Aktiv</span>
          </div>

          <section className={styles.hero}>
            <div>
              <p className="eyebrow">Rennwochenend-Belohnungen</p>
              <h1 className={styles.title}>
                Gratiswetten
                <br />
                Einsatzbereit
              </h1>
              <p className={styles.subtitle}>
                Nutze Gratiswetten-Guthaben auf ausgewählten Vor-Rennstart- und Live-Märkten. Promotionen sind auf Rennwochenenden, hervorgehobene Fahrer und Treueprogramm-Status zugeschnitten.
              </p>
            </div>
            <Image
              src="/erfolg.png"
              alt=""
              width={1122}
              height={1402}
              priority
              className={styles.mascot}
            />
          </section>

          <section className={styles.cards}>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>Willkommensangebot</h2>
              <strong className={styles.cardValue}>€20</strong>
              <p className={styles.cardText}>Aufgeteilt in zwei €10-Token nach Abrechnung der ersten Qualifizierungswette.</p>
            </article>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>Renn-Booster</h2>
              <strong className={styles.cardValue}>€5</strong>
              <p className={styles.cardText}>Zusätzliche Token-Drops für ausgewählte Grand-Prix-Rennen und Sprint-Wochenenden.</p>
            </article>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>Treueprogramm-Bonus</h2>
              <strong className={styles.cardValue}>Bis zu €30</strong>
              <p className={styles.cardText}>Mitglieder höherer Stufen schalten größere regelmäßige Gratiswetten-Guthaben frei.</p>
            </article>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Nutzungsregeln</h2>
            <ul className={styles.list}>
              <li>Der Einsatz von Gratiswetten wird nicht mit Gewinnen zurückgegeben, es sei denn, es ist ausdrücklich angegeben.</li>
              <li>Mindestquoten und Marktbeschränkungen gelten für jeden Token.</li>
              <li>Nicht verwendete Guthaben verfallen automatisch am Promotionsstichtag.</li>
              <li>Die Berechtigung kann je nach Region, Kontoverlauf und Verantwortungsspiel-Kontrollen variieren.</li>
            </ul>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

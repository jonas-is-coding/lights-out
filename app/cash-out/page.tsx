import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import styles from "./CashOutPage.module.css";

export const metadata: Metadata = {
  title: "Cash Out | LIGHTS OUT",
  description:
    "Begleiche Wetten früh mit Cash Out und sichere Gewinne oder reduziere Risiko während das Rennen live läuft.",
};

export default function CashOutPage() {
  return (
    <div className={`${styles.page} lightApp`}>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.top}>
            <Link href="/" className={styles.back}>
              Zurück zur Startseite
            </Link>
            <span className={styles.badge}>Live-Abrechnung · Aktiv</span>
          </div>

          <section className={styles.hero}>
            <div>
              <p className="eyebrow">Kontrolliere deine Position</p>
              <h1 className={styles.title}>
                Cash Out
                <br />
                Vor dem Zielstrich
              </h1>
              <p className={styles.subtitle}>
                Entscheide in Echtzeit, ob du Gewinne sicherst oder Verluste begrenzt. Cash-Out-Werte aktualisieren sich live, wenn sich Rennbedingungen ändern, einschließlich Sicherheitsautos, Zwischenfälle und Positionswechsel.
              </p>
            </div>
            <Image
              src="/cashout.png"
              alt=""
              width={1122}
              height={1402}
              priority
              className={styles.mascot}
            />
          </section>

          <section className={styles.columns}>
            <article className={styles.panel}>
              <h2 className={styles.panelTitle}>So funktioniert es</h2>
              <ul className={styles.list}>
                <li>Öffne deinen aktiven Wetttip während eines Live- oder ungeklärten Events.</li>
                <li>Falls verfügbar, drücke Cash Out, um den angezeigten Abwicklungswert zu akzeptieren.</li>
                <li>Teilweiser Cash Out kann auf ausgewählten Einzelwetten und Kombinationswetten angeboten werden.</li>
                <li>Nach Bestätigung wird die Wette sofort abgewickelt und kann nicht rückgängig gemacht werden.</li>
              </ul>
            </article>

            <aside>
              <div className={styles.highlight}>
                <span className={styles.highlightLabel}>Aktualisierungsgeschwindigkeit</span>
                <strong className={styles.highlightValue}>Live</strong>
                <p className={styles.note}>Kurse werden kontinuierlich mit der Marktbewegung aktualisiert.</p>
              </div>
              <div className={styles.highlight}>
                <span className={styles.highlightLabel}>Teilwetten-Funktion</span>
                <strong className={styles.highlightValue}>Verfügbar</strong>
                <p className={styles.note}>Begleiche einen Teil eines Einsatzes und behalte den Rest im Spiel.</p>
              </div>
              <div className={styles.highlight}>
                <span className={styles.highlightLabel}>Verfügbarkeit</span>
                <strong className={styles.highlightValue}>Marktabhängig</strong>
                <p className={styles.note}>Kann während schneller Zwischenfälle vorübergehend ausgesetzt werden.</p>
              </div>
            </aside>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

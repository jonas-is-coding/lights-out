import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import styles from "./AccaInsurancePage.module.css";

export const metadata: Metadata = {
  title: "Kombi-Versicherung | LIGHTS OUT",
  description:
    "Schütze deine Kombinationswette mit Kombi-Versicherung und erhalte Deckung, wenn ein Leg fehlschlägt.",
};

export default function AccaInsurancePage() {
  return (
    <div className={`${styles.page} lightApp`}>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.top}>
            <Link href="/" className={styles.back}>
              Zurück zur Startseite
            </Link>
            <span className={styles.badge}>Promo-Schutz · Aktiv</span>
          </div>

          <section className={styles.hero}>
            <div>
              <p className="eyebrow">Mehrfach-Wetten-Schutz</p>
              <h1 className={styles.title}>
                Kombi-Versicherung
                <br />
                Für Rennwochenenden
              </h1>
              <p className={styles.subtitle}>
                Erstelle deine Kombinationswette mit Vertrauen. Wenn genau eine Auswahl verliert, kann dein Einsatz als Gratiswetten-Guthaben unter den aktiven Kampagnenbedingungen zurückgegeben werden.
              </p>
            </div>
            <Image
              src="/versicherung.png"
              alt=""
              width={1370}
              height={1148}
              preload
              sizes="(max-width: 900px) 78vw, 340px"
              className={styles.mascot}
            />
          </section>

          <section className={styles.cards}>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>Wie man sich qualifiziert</h2>
              <p className={styles.cardBody}>
                Platziere eine Kombinationswette mit den erforderlichen Mindestlegs und dem Schwellenwert für Quoten, die in deiner Promotions-Lobby angezeigt werden.
              </p>
            </article>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>Deckungsauslöser</h2>
              <p className={styles.cardBody}>
                Versicherung gilt, wenn ein Leg fehlschlägt und alle anderen Auswahlen als Gewinner in derselben Wettschein abgerechnet werden.
              </p>
            </article>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>Auszahlungsformat</h2>
              <p className={styles.cardBody}>
                Berechtigte Rückerstattungen werden als Gratiswetten-Guthaben ausgegeben und treffen normalerweise innerhalb von 24 Stunden nach endgültiger Abrechnung ein.
              </p>
            </article>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Wesentliche Bedingungen</h2>
            <ul className={styles.list}>
              <li>Opt-in kann in Promotionen erforderlich sein, bevor die Wette platziert wird.</li>
              <li>Maximaler versicherter Einsatz und Mindestquoten-Limits gelten pro Kampagne.</li>
              <li>Ungültige oder ausgezahlte Auswahlen zählen nicht zur versicherten Struktur.</li>
              <li>Die Berechtigung kann je nach Region und Kontostatus variieren.</li>
            </ul>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

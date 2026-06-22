import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import styles from "./PayoutBoostPage.module.css";

export const metadata: Metadata = {
  title: "Auszahlungs-Boost | LIGHTS OUT",
  description:
    "Erhöhe potenzielle Renditen auf ausgewählten Rennmärkten mit dynamischen Auszahlungs-Boost-Angeboten.",
};

export default function PayoutBoostPage() {
  return (
    <div className={`${styles.page} lightApp`}>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.top}>
            <Link href="/" className={styles.back}>
              Zurück zur Startseite
            </Link>
            <span className={styles.badge}>Boost-Engine · Live</span>
          </div>

          <section className={styles.hero}>
            <div>
              <p className="eyebrow">Intelligentere Rendite-Multiplikatoren</p>
              <h1 className={styles.title}>
                Auszahlungs-Boost
                <br />
                Auf ausgewählten Märkten
              </h1>
              <p className={styles.subtitle}>
                Aktiviere einen Boost-Token vor Spielbeginn und erhöhe deine potenzielle Auszahlung auf hervorgehobenen Wetten. Boost-Werte variieren je nach Markttyp, Quotenbereich und aktuellem Kampagnenniveau.
              </p>
            </div>
            <Image
              src="/boost.png"
              alt=""
              width={1402}
              height={1122}
              preload
              sizes="(max-width: 900px) 78vw, 340px"
              className={styles.mascot}
            />
          </section>

          <section className={styles.grid}>
            <article className={styles.panel}>
              <h2 className={styles.panelTitle}>So funktioniert es</h2>
              <ul className={styles.list}>
                <li>Wähle eine Wette mit dem Auszahlungs-Boost-Abzeichen aus.</li>
                <li>Wende einen verfügbaren Boost-Token in deinem Wetttip vor dem Platzieren an.</li>
                <li>Deine angepasste Rendite wird sofort vor der Bestätigung angezeigt.</li>
                <li>Nach Verwendung verfallen oder aktualisieren sich Token basierend auf Promotionsregeln.</li>
              </ul>
            </article>

            <aside className={styles.kpis}>
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>Max. Boost</span>
                <strong className={styles.kpiValue}>+30%</strong>
                <p className={styles.kpiNote}>Top-Kampagnen-Multiplikator auf ausgewählten Rennen.</p>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>Wöchentliche Token</span>
                <strong className={styles.kpiValue}>3</strong>
                <p className={styles.kpiNote}>Basis-Token-Zuteilung für berechtigte Konten.</p>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>Abwicklungszeit</span>
                <strong className={styles.kpiValue}>Sofort</strong>
                <p className={styles.kpiNote}>Erhöhte Auszahlung wird mit normaler Abwicklung verarbeitet.</p>
              </div>
            </aside>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

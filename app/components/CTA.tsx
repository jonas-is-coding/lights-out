import Link from "next/link";
import styles from "./CTA.module.css";

export default function CTA() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <h2 className={styles.title}>
            Platziere deine <span className={styles.accent}>Wette</span>.
          </h2>
          <p className={styles.lead}>
            Fünf rote Lichter, eine grüne Flagge — und dein Einsatz ist gesperrt. Melde dich jetzt an, schnapp dir eine €100 risikofreie Wette für das nächste Rennen und mache jederzeit Cash Out über alle Märkte, die wir anbieten.
          </p>
          <div className={styles.buttons}>
            <Link href="/register" className={styles.btnPrimary}>
              Hole dir €100 Gratiswette
            </Link>
            <Link href="/free-bets" className={styles.btnGhost}>
              Märkte entdecken
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

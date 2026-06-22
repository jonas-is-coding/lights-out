import Image from "next/image";
import styles from "./Faq.module.css";

const faqItems = [
  {
    q: "Wie werden die Title-Race-Odds berechnet?",
    a: "Die Odds kombinieren aktuelle Konstrukteurs-Punkte, Position im Klassement und Momentum aus den letzten Rennen. Mit jedem Weekend werden sie automatisch neu gewichtet.",
  },
  {
    q: "Warum ändern sich Odds während des Rennwochenendes?",
    a: "Freie Trainings, Qualifying und Strafen verändern die Einschätzung der Team-Performance. Deshalb aktualisieren sich Märkte bis zum Rennstart laufend.",
  },
  {
    q: "Sind die angezeigten Werte live und bindend?",
    a: "Die Werte auf dieser Seite sind ein Live-Feed zur Orientierung. Für verbindliche Wettabgaben gelten immer die finalen Quoten im jeweiligen Wettmarkt.",
  },
  {
    q: "Warum fehlen manchmal Teams oder Fahrer?",
    a: "Wenn ein externer Datenfeed verzögert ist, zeigen wir kurzfristig Fallback-Daten. Sobald der Feed wieder stabil ist, werden alle Teams automatisch ergänzt.",
  },
  {
    q: "Was bedeutet Responsible Gaming?",
    a: "Setze dir Limits für Zeit und Einsatz, spiele nie unter Druck und hole Unterstützung, wenn Wetten sich nicht mehr kontrollierbar anfühlen.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>Support · Regeln · Verantwortungsvolles Spielen</span>
          <h2 className={styles.title}>Häufig gestellte Fragen</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.list}>
            {faqItems.map((item) => (
              <details key={item.q} className={styles.item}>
                <summary className={styles.question}>
                  {item.q}
                  <span className={styles.icon} aria-hidden />
                </summary>
                <p className={styles.answer}>{item.a}</p>
              </details>
            ))}
          </div>

          <Image
            src="/faq.png"
            alt=""
            width={1402}
            height={1122}
            sizes="(max-width: 900px) 78vw, 340px"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}

import styles from "./StatsGrid.module.css";
import { formatMarketsOpenLabel, type NextRaceInfo } from "@/lib/f1/nextRace";

type StatsGridProps = {
  nextRace: NextRaceInfo;
};

export default function StatsGrid({ nextRace }: StatsGridProps) {
  const stats = [
    { value: "146", label: "Live-Märkte", sub: formatMarketsOpenLabel(nextRace) },
    { value: "2,4 Mio. €", label: "Letztes Rennen ausgezahlt", sub: "Abgerechnet in 60s" },
    { value: "92%", label: "Durchschn. Auszahlung", sub: "Über 12k Wetten" },
    { value: "18x", label: "Max Multiplikator", sub: "Kombi · 6 Tipps" },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>Wettbüro · Echte Zahlen</span>
          <h2 className={styles.title}>
            Wo das kluge Geld <span className={styles.accent}>spielt</span>.
          </h2>
        </div>

        <div className={styles.grid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.card}>
              <div className={styles.value}>{s.value}</div>
              <div className={styles.label}>{s.label}</div>
              <div className={styles.sub}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

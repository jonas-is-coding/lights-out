import Link from "next/link";
import styles from "./Hero.module.css";
import { formatHeroRaceLabel, type NextRaceInfo } from "@/lib/f1/nextRace";

type HeroProps = {
  nextRace: NextRaceInfo;
};

export default function Hero({ nextRace }: HeroProps) {
  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>
              <span className={styles.dot} />
              {formatHeroRaceLabel(nextRace)}
            </span>

            <h1 className={styles.title}>
              Fünf rote Lichter. Ein grünes.
              <br />
              <span className={styles.accent}>Deine Wette ist aktiv.</span>
            </h1>

            <p className={styles.lead}>
              Das ultimative Formel-1-Wettbüro. Vor- und Live-Märkte, erhöhte Auszahlungen und sofortiger Cash Out — über jedes Rennwochenende.
            </p>

            <div className={styles.actions}>
              <Link href="/register" className={styles.primary}>
                Konto erstellen
              </Link>
              <Link href="/free-bets" className={styles.secondary}>
                Märkte entdecken
              </Link>
            </div>

            <div className={styles.trust}>
              <span className={styles.trustNum}>146 Live-Märkte</span>
              <span className={styles.trustDivider} />
              <span>Abgerechnet in unter 60s</span>
            </div>
          </div>

          <div className={styles.filmWrap}>
            <iframe
              src="/lights-out-imagefilm.html?v=2"
              title="LIGHTS OUT Imagefilm"
              className={styles.film}
              loading="eager"
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

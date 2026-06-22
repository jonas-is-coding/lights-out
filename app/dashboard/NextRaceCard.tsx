"use client";

import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

type Props = {
  raceName: string;
  location: string;
  startsAt: string | null;
};

function diff(target: number, now: number) {
  const ms = target - now;
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    mins: Math.floor((ms / 60_000) % 60),
    secs: Math.floor((ms / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function NextRaceCard({ raceName, location, startsAt }: Props) {
  const target = startsAt ? new Date(startsAt).getTime() : NaN;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const hasTarget = Number.isFinite(target);
  const time = hasTarget && now !== null ? diff(target, now) : null;
  const live = hasTarget && now !== null && time === null;

  return (
    <div className={styles.raceCard}>
      <div className={styles.raceHeader}>
        <span className={styles.raceLights} aria-hidden>
          <i /><i /><i /><i /><i />
        </span>
        <span className={styles.raceEyebrow}>Nächstes Rennen</span>
      </div>

      <p className={styles.raceName}>{raceName}</p>
      {location && <p className={styles.raceLoc}>{location}</p>}

      {live ? (
        <p className={styles.raceLive}>Lights out — es läuft!</p>
      ) : (
        <div className={styles.countdown} suppressHydrationWarning>
          {[
            { v: time?.days, l: "Tage" },
            { v: time?.hours, l: "Std" },
            { v: time?.mins, l: "Min" },
            { v: time?.secs, l: "Sek" },
          ].map((u) => (
            <div key={u.l} className={styles.countUnit}>
              <span className={styles.countVal}>
                {u.v === undefined ? "--" : pad(u.v)}
              </span>
              <span className={styles.countLabel}>{u.l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

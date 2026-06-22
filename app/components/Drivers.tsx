"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Drivers.module.css";

type Driver = {
  driverId: string;
  number: string;
  first: string;
  last: string;
  team: string;
  country: string;
  flag: string;
  raceWinner: string;
  podium: string;
  pole: string;
  fastestLap: string;
  accent: string;
  helmetImage: string;
};

const baseDrivers: Driver[] = [
  {
    driverId: "hamilton",
    number: "44",
    first: "Lewis",
    last: "Hamilton",
    team: "Scuderia Ferrari",
    country: "United Kingdom",
    flag: "GBR",
    raceWinner: "3.20",
    podium: "1.40",
    pole: "2.75",
    fastestLap: "4.50",
    accent: "#e10600",
    helmetImage: "/helmets/hamilton.png",
  },
  {
    driverId: "verstappen",
    number: "1",
    first: "Max",
    last: "Verstappen",
    team: "Oracle Red Bull",
    country: "Netherlands",
    flag: "NED",
    raceWinner: "1.75",
    podium: "1.12",
    pole: "1.85",
    fastestLap: "3.50",
    accent: "#0a2d6b",
    helmetImage: "/helmets/verstappen.png",
  },
  {
    driverId: "leclerc",
    number: "16",
    first: "Charles",
    last: "Leclerc",
    team: "Scuderia Ferrari",
    country: "Monaco",
    flag: "MON",
    raceWinner: "4.50",
    podium: "1.65",
    pole: "3.50",
    fastestLap: "6.00",
    accent: "#e10600",
    helmetImage: "/helmets/leclerc.png",
  },
  {
    driverId: "norris",
    number: "4",
    first: "Lando",
    last: "Norris",
    team: "McLaren",
    country: "United Kingdom",
    flag: "GBR",
    raceWinner: "5.00",
    podium: "1.85",
    pole: "4.00",
    fastestLap: "4.00",
    accent: "#ff8000",
    helmetImage: "/helmets/norris.png",
  },
];

type LiveDriver = {
  driverId: string;
  number: string;
  first: string;
  last: string;
  team: string;
  country: string;
  flag: string;
  raceWinner: string;
  podium: string;
  pole: string;
  fastestLap: string;
};

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(baseDrivers);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let canceled = false;

    const loadLiveDrivers = async () => {
      try {
        const res = await fetch("/api/f1/featured-drivers", { cache: "no-store" });
        if (!res.ok) return;

        const payload = (await res.json()) as { drivers?: LiveDriver[] };
        const liveDrivers = payload.drivers ?? [];
        if (liveDrivers.length === 0 || canceled) return;

        const liveMap = new Map(liveDrivers.map((d) => [d.driverId, d]));
        const merged = baseDrivers.map((base) => {
          const live = liveMap.get(base.driverId);
          if (!live) return base;
          return {
            ...base,
            number: live.number || base.number,
            first: live.first || base.first,
            last: live.last || base.last,
            team: live.team || base.team,
            country: live.country || base.country,
            flag: live.flag || base.flag,
            raceWinner: live.raceWinner || base.raceWinner,
            podium: live.podium || base.podium,
            pole: live.pole || base.pole,
            fastestLap: live.fastestLap || base.fastestLap,
          };
        });

        setDrivers(merged);
      } catch {
        // keep static fallback if API is unavailable
      }
    };

    void loadLiveDrivers();

    return () => {
      canceled = true;
    };
  }, []);

  const d = drivers[active];

  const oddsRows = [
    { label: "Rennsieger", value: d.raceWinner },
    { label: "Podium", value: d.podium },
    { label: "Pole-Position", value: d.pole },
    { label: "Schnellste Runde", value: d.fastestLap },
  ];

  return (
    <section id="drivers" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>Ausgewählte Märkte · Rennsieger-Quoten</span>
          <h2 className={styles.title}>
            Setze auf die <span className={styles.accent}>Favoriten</span>.
          </h2>
        </div>

        <div className={styles.layout}>
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <div>
                <div className={styles.country}>
                  <span className={styles.flag}>{d.flag}</span>
                  {d.country}
                </div>
                <h3 className={styles.driverName}>
                  {d.first} <span className={styles.lastName}>{d.last}</span>
                </h3>
                <div className={styles.teamRow}>
                  <span className={styles.teamDot} style={{ background: d.accent }} />
                  {d.team}
                </div>
              </div>
              <div className={styles.helmet}>
                <Image
                  src={d.helmetImage}
                  alt={`${d.first} ${d.last} helmet`}
                  fill
                  sizes="(max-width: 768px) 40vw, 200px"
                  className={styles.helmetImage}
                  priority={active === 0}
                />
              </div>
            </div>

            <div className={styles.oddsGrid}>
              {oddsRows.map((o) => (
                <div key={o.label} className={styles.oddsCell}>
                  <span className={styles.oddsLabel}>{o.label}</span>
                  <span className={styles.oddsValue}>{o.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.selector}>
            {drivers.map((dr, i) => (
              <button
                key={dr.driverId}
                onClick={() => setActive(i)}
                className={`${styles.selectorBtn} ${i === active ? styles.selectorActive : ""}`}
                aria-label={`Wähle ${dr.first} ${dr.last}`}
              >
                <span className={styles.selectorNum}>{dr.number}</span>
                <span className={styles.selectorName}>{dr.last}</span>
                <span className={styles.selectorOdds}>{dr.raceWinner}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import styles from "./Standings.module.css";

type Row = {
  pos: number;
  constructorId: string;
  team: string;
  drivers: string;
  points: number;
  odds: string;
  color: string;
};

const fallbackRows: Row[] = [
  { pos: 1, constructorId: "red_bull", team: "Oracle Red Bull Racing", drivers: "Verstappen / Pérez", points: 612, odds: "1.30", color: "#0a2d6b" },
  { pos: 2, constructorId: "ferrari", team: "Scuderia Ferrari", drivers: "Hamilton / Leclerc", points: 587, odds: "4.50", color: "#e10600" },
  { pos: 3, constructorId: "mclaren", team: "McLaren F1 Team", drivers: "Norris / Piastri", points: 521, odds: "7.00", color: "#ff8000" },
  { pos: 4, constructorId: "mercedes", team: "Mercedes-AMG Petronas", drivers: "Russell / Antonelli", points: 412, odds: "26.00", color: "#00d2be" },
  { pos: 5, constructorId: "aston_martin", team: "Aston Martin Aramco", drivers: "Alonso / Stroll", points: 289, odds: "101.00", color: "#006f62" },
  { pos: 6, constructorId: "williams", team: "Williams Racing", drivers: "Albon / Sainz", points: 174, odds: "251.00", color: "#005aff" },
  { pos: 7, constructorId: "rb", team: "Visa Cash App RB", drivers: "Tsunoda / Lawson", points: 98, odds: "501.00", color: "#1660ad" },
  { pos: 8, constructorId: "sauber", team: "Stake F1 Sauber", drivers: "Bottas / Zhou", points: 32, odds: "1001.00", color: "#52e252" },
  { pos: 9, constructorId: "alpine", team: "BWT Alpine F1 Team", drivers: "Gasly / Colapinto", points: 21, odds: "1001.00", color: "#0090ff" },
  { pos: 10, constructorId: "haas", team: "MoneyGram Haas F1 Team", drivers: "Ocon / Bearman", points: 12, odds: "1001.00", color: "#c4c4c4" },
  { pos: 11, constructorId: "cadillac", team: "Cadillac Formula 1 Team", drivers: "Pérez / Bottas", points: 0, odds: "1001.00", color: "#1d4ed8" },
];

export default function Standings() {
  const [rows, setRows] = useState<Row[]>(fallbackRows);

  useEffect(() => {
    let canceled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/f1/constructor-odds", { cache: "no-store" });
        if (!res.ok) return;
        const payload = (await res.json()) as { rows?: Row[] };
        if (canceled) return;
        if (!payload.rows || payload.rows.length === 0) return;
        setRows(payload.rows);
      } catch {
        // keep fallback rows
      }
    };

    void load();

    return () => {
      canceled = true;
    };
  }, []);

  const maxPoints = Math.max(...rows.map((r) => r.points), 1);

  return (
    <section id="standings" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>2026 Konstrukteure · Outright Champion · Live-Quoten</span>
          <h2 className={styles.title}>
            Titelkampf <span className={styles.accent}>Quoten</span>
          </h2>
        </div>

        <div className={styles.table}>
          <div className={styles.headerRow}>
            <span>Pos</span>
            <span>Konstrukteur</span>
            <span className={styles.colDrivers}>Fahrer</span>
            <span className={styles.headerNum}>Punkte</span>
            <span className={styles.headerNum}>Titelquoten</span>
          </div>

          {rows.map((r) => (
            <div key={r.constructorId} className={styles.row}>
              <span className={styles.pos}>{String(r.pos).padStart(2, "0")}</span>
              <span className={styles.team}>
                <span className={styles.teamBar} style={{ background: r.color }} />
                {r.team}
              </span>
              <span className={styles.drivers}>{r.drivers}</span>
              <span className={styles.pointsCol}>
                <span className={styles.pointsBar}>
                  <span
                    className={styles.pointsFill}
                    style={{
                      background: r.color,
                      width: `${(r.points / maxPoints) * 100}%`,
                    }}
                  />
                </span>
                <span className={styles.pointsNum}>{r.points}</span>
              </span>
              <span className={styles.odds}>{r.odds}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

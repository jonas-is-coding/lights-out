"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./Telemetry.module.css";

// Pre-generated speed profile (km/h sampled across one lap)
const SPEED_PROFILE = [
  90, 110, 145, 180, 220, 260, 290, 310, 320, 285, 240, 195, 165, 140, 120,
  105, 130, 175, 220, 260, 285, 305, 320, 325, 330, 295, 250, 200, 160, 130,
  110, 95, 105, 135, 180, 220, 255, 285, 305, 315, 320, 290, 245, 195, 155,
  125, 105, 90, 110, 150, 195, 240, 275, 300, 315, 325, 330, 320, 280, 235,
  185, 145, 115, 95, 100, 130, 170, 215, 255, 285, 305, 315, 320, 295, 250,
  200, 160, 130, 110, 95,
];
const MAX_SPEED = 340;
const W = 1000;
const H = 220;

function buildPath(values: number[]) {
  const step = W / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = H - (v / MAX_SPEED) * H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function buildAreaPath(values: number[]) {
  const step = W / (values.length - 1);
  const top = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(H - (v / MAX_SPEED) * H).toFixed(1)}`)
    .join(" ");
  return `${top} L${W},${H} L0,${H} Z`;
}

const path = buildPath(SPEED_PROFILE);
const area = buildAreaPath(SPEED_PROFILE);

export default function Telemetry() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const drawProgress = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);
  const cursorProgress = useTransform(scrollYProgress, [0.2, 0.85], [0, 1]);

  const [cursor, setCursor] = useState({ x: 0, speed: SPEED_PROFILE[0] });

  useEffect(() => {
    return cursorProgress.on("change", (v) => {
      const idx = Math.min(SPEED_PROFILE.length - 1, Math.max(0, Math.floor(v * (SPEED_PROFILE.length - 1))));
      const x = (idx / (SPEED_PROFILE.length - 1)) * W;
      setCursor({ x, speed: SPEED_PROFILE[idx] });
    });
  }, [cursorProgress]);

  return (
    <section id="telemetry" ref={ref} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">Live Race · Odds Shift · Lap 24 / 78</span>
          <h2 className={`display ${styles.title}`}>
            Every <span className={styles.red}>odd</span>
            <br />
            shifts.
          </h2>
          <p className={styles.lead}>
            Live odds move with every sector. Speed, gear and throttle from the leader&apos;s car
            translated into raw betting markets — cash out at 320 km/h or hold for the chequered
            flag. The race never stops, and neither do the markets.
          </p>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelHeadLeft}>
              <span className={styles.tag}>HAM</span>
              <span className={styles.driverName}>L. HAMILTON · #44</span>
            </div>
            <div className={styles.panelHeadRight}>
              <span className={styles.kpi}>
                <span className={styles.kpiLabel}>Speed</span>
                <span className={styles.kpiValue}>{cursor.speed}<small>km/h</small></span>
              </span>
              <span className={styles.kpi}>
                <span className={styles.kpiLabel}>Throttle</span>
                <span className={styles.kpiValue}>{Math.round(cursor.speed / 3.4)}<small>%</small></span>
              </span>
              <span className={styles.kpi}>
                <span className={styles.kpiLabel}>Gear</span>
                <span className={styles.kpiValue}>{Math.min(8, Math.max(1, Math.round(cursor.speed / 42)))}</span>
              </span>
            </div>
          </div>

          <div className={styles.chartWrap}>
            <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart} preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e10600" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#e10600" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e10600" />
                </linearGradient>
              </defs>

              {/* Grid */}
              {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <line
                  key={p}
                  x1="0"
                  x2={W}
                  y1={H * p}
                  y2={H * p}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}

              {/* Area */}
              <motion.path
                d={area}
                fill="url(#areaGrad)"
                style={{ opacity: drawProgress }}
              />

              {/* Line */}
              <motion.path
                d={path}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="2.5"
                style={{ pathLength: drawProgress }}
              />

              {/* Cursor */}
              <motion.g style={{ opacity: drawProgress }}>
                <line
                  x1={cursor.x}
                  x2={cursor.x}
                  y1={0}
                  y2={H}
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />
                <circle
                  cx={cursor.x}
                  cy={H - (cursor.speed / MAX_SPEED) * H}
                  r="6"
                  fill="#ffffff"
                />
                <circle
                  cx={cursor.x}
                  cy={H - (cursor.speed / MAX_SPEED) * H}
                  r="12"
                  fill="rgba(225,6,0,0.35)"
                />
              </motion.g>
            </svg>
            <div className={styles.scale}>
              <span>0</span><span>340 km/h</span>
            </div>
          </div>

          <div className={styles.metrics}>
            {[
              { l: "Race Winner", v: "1.75", sub: "VERSTAPPEN" },
              { l: "Podium HAM", v: "1.20", sub: "LOCKED" },
              { l: "Fastest Lap", v: "4.50", sub: "OPEN" },
              { l: "Pole Bet", v: "3.20", sub: "SETTLED" },
              { l: "Live Stake", v: "€240K", sub: "THIS LAP" },
              { l: "Cash Out", v: "+€85", sub: "NOW" },
            ].map((m, i) => (
              <motion.div
                key={m.l}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className={styles.metric}
              >
                <span className={styles.metricLabel}>{m.l}</span>
                <span className={styles.metricValue}>{m.v}</span>
                <span className={styles.metricSub}>{m.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

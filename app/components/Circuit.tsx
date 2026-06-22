"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./Circuit.module.css";

type LayoutPayload = {
  race: {
    round: string;
    raceName: string;
    circuitName: string;
    circuitId: string;
  } | null;
  layout: {
    viewBox: string;
    fullPath: string;
    startPoint: { x: number; y: number };
  } | null;
};

const circuitFacts: Record<string, { length: string; laps: string; distance: string; lapRecord: string; lapRecordBy: string }> = {
  monaco: { length: "3.337", laps: "78", distance: "260.286", lapRecord: "1:12.909", lapRecordBy: "Hamilton" },
  silverstone: { length: "5.891", laps: "52", distance: "306.198", lapRecord: "1:27.097", lapRecordBy: "Verstappen" },
  spa: { length: "7.004", laps: "44", distance: "308.052", lapRecord: "1:46.286", lapRecordBy: "Bottas" },
  monza: { length: "5.793", laps: "53", distance: "306.720", lapRecord: "1:21.046", lapRecordBy: "Barrichello" },
  suzuka: { length: "5.807", laps: "53", distance: "307.471", lapRecord: "1:30.983", lapRecordBy: "Hamilton" },
  villeneuve: { length: "4.361", laps: "70", distance: "305.270", lapRecord: "1:13.078", lapRecordBy: "Bottas" },
  interlagos: { length: "4.309", laps: "71", distance: "305.909", lapRecord: "1:10.540", lapRecordBy: "Bottas" },
};

export default function Circuit() {
  const [data, setData] = useState<LayoutPayload | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/f1/circuit-layout", { cache: "no-store" });
        if (!res.ok) return;
        const payload = (await res.json()) as LayoutPayload;
        if (!canceled) setData(payload);
      } catch {
        // keep null
      }
    };
    void load();
    return () => {
      canceled = true;
    };
  }, []);

  const drawProgress = useTransform(scrollYProgress, [0.42, 0.66], [0, 1]);
  const circuitName = data?.race?.circuitName || "Next Circuit";
  const round = data?.race?.round || "--";
  const facts = circuitFacts[data?.race?.circuitId || ""] ?? circuitFacts.monaco;

  return (
    <section id="circuit" ref={ref} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">Round {round} · Live Track Data · Bets Open</span>
          <h2 className={`display ${styles.title}`}>
            Bet the most
            <br />
            <span className={styles.red}>iconic</span> circuit
          </h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.trackBox}>
            <div className={styles.trackHeader}>
              <span className={styles.trackLabel}>{circuitName}</span>
              <span className={styles.trackId}>TRACK · #{round}</span>
            </div>

            {data?.layout ? (
              <svg className={styles.svg} viewBox={data.layout.viewBox} preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="trackGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ff554d" />
                    <stop offset="50%" stopColor="#ff2d1f" />
                    <stop offset="100%" stopColor="#b30000" />
                  </linearGradient>
                  <filter id="trackGlow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path d={data.layout.fullPath} className={styles.trackBase} />
                <motion.path
                  d={data.layout.fullPath}
                  className={styles.trackMain}
                  filter="url(#trackGlow)"
                  style={{ pathLength: drawProgress }}
                />
                <g>
                  <circle cx={data.layout.startPoint.x} cy={data.layout.startPoint.y} r="7" className={styles.startDot} />
                  <text x={data.layout.startPoint.x + 14} y={data.layout.startPoint.y - 10} className={styles.startLabel}>
                    START
                  </text>
                </g>
              </svg>
            ) : (
              <div className={styles.loading}>Loading live track layout…</div>
            )}

            <div className={styles.trackFooter}>
              <span>S/F</span>
              <span className={styles.trackBar} />
              <span>{data?.race?.raceName || "Next Race"}</span>
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>Length</span>
              <span className={styles.infoValue}>{facts.length}<small>km</small></span>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>Laps</span>
              <span className={styles.infoValue}>{facts.laps}</span>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>Distance</span>
              <span className={styles.infoValue}>{facts.distance}<small>km</small></span>
            </div>
            <div className={`${styles.infoCard} ${styles.infoRed}`}>
              <span className={styles.infoLabel}>Lap Record</span>
              <span className={styles.infoValue}>{facts.lapRecord}</span>
              <span className={styles.infoSub}>{facts.lapRecordBy}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "@react-three/drei";
import styles from "./LoadingIntro.module.css";

type Stage =
  | "idle"      // nothing lit yet (very first frame)
  | "lighting"  // one or more panels lit
  | "out"       // all panels turned off — the "lights out" moment
  | "gone";     // overlay removed

const LIGHT_DELAY_MS = 800;
const LIGHT_COUNT = 5;
const MIN_DURATION_MS = LIGHT_COUNT * LIGHT_DELAY_MS + 400; // ~4.4s

export default function LoadingIntro() {
  const [lit, setLit] = useState(0);
  const [stage, setStage] = useState<Stage>("lighting");
  const [minDone, setMinDone] = useState(false);
  const { active, progress } = useProgress();

  // Drive the lights sequence with a single rAF loop based on elapsed time
  // (avoids the staircase of setTimeouts the linter flags as set-in-effect).
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      const next = Math.min(LIGHT_COUNT, Math.floor(elapsed / LIGHT_DELAY_MS));
      setLit((prev) => (prev === next ? prev : next));
      if (elapsed >= MIN_DURATION_MS) {
        setMinDone((prev) => prev || true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Dismiss once minimum time has passed AND no asset loading is active
  useEffect(() => {
    if (!minDone) return;
    if (active) return; // still loading
    const t1 = setTimeout(() => setStage("out"), 250);
    const t2 = setTimeout(() => setStage("gone"), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [minDone, active]);

  // Lock body scroll while overlay is up
  useEffect(() => {
    if (stage === "gone") {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [stage]);

  const lightsOn = stage === "lighting";

  return (
    <AnimatePresence>
      {stage !== "gone" && (
        <motion.div
          key="intro"
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
        >
          <div className={styles.bgFlare} />
          <div className="grid-overlay" />

          <div className={styles.top}>
            <motion.div
              className={styles.brand}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className={styles.brandText}>
                LIGHTS<span className={styles.brandRed}>OUT</span>
              </span>
              <span className={styles.brandSub}>SEASON 2026 · MARKETS LOADING</span>
            </motion.div>
          </div>

          <div className={styles.center}>
            <motion.div
              className={styles.rig}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {Array.from({ length: LIGHT_COUNT }).map((_, i) => {
                const idx = i + 1;
                const on = lightsOn && lit >= idx;
                return (
                  <div key={i} className={`${styles.col} ${on ? styles.on : ""}`}>
                    <span className={styles.bulb} />
                    <span className={styles.bulb} />
                  </div>
                );
              })}
            </motion.div>

            <motion.div
              className={styles.status}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className={styles.statusLabel}>
                {stage === "out" ? "BET!" : active ? "Loading Markets" : "Odds Sync"}
              </span>
              <span className={styles.statusDot} />
              <span className={styles.statusValue}>
                {stage === "out"
                  ? "100%"
                  : `${Math.min(99, Math.max(Math.round(progress), Math.round((lit / LIGHT_COUNT) * 80)))}%`}
              </span>
            </motion.div>

            <div className={styles.bar}>
              <motion.span
                className={styles.barFill}
                initial={{ width: "0%" }}
                animate={{
                  width:
                    stage === "out"
                      ? "100%"
                      : `${Math.min(100, Math.max(progress, (lit / LIGHT_COUNT) * 80))}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className={styles.bottom}>
            <span className={styles.meta}>ODDS: LIVE</span>
            <span className={styles.meta}>MARKETS: 146</span>
            <span className={styles.meta}>KYC: VERIFIED</span>
            <span className={styles.meta}>TRACK: MONACO</span>
          </div>

          <AnimatePresence>
            {stage === "out" && (
              <motion.div
                className={styles.flash}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

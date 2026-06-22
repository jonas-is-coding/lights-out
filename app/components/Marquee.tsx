"use client";

import { motion } from "framer-motion";
import styles from "./Marquee.module.css";

const items = [
  "VERSTAPPEN · 1.75",
  "HAMILTON · 3.20",
  "LECLERC · 4.50",
  "NORRIS · 5.00",
  "+50% PAYOUT BOOST",
  "146 LIVE MARKETS",
  "LIVE BETTING OPEN",
  "RACE WINNER",
  "PODIUM FINISH",
  "FASTEST LAP",
  "POLE POSITION",
  "CASH OUT ANY TIME",
  "ACCA INSURANCE",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className={styles.wrap} aria-hidden>
      <motion.div
        className={styles.row}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {row.map((t, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.dot} />
            {t}
          </span>
        ))}
      </motion.div>
      <motion.div
        className={`${styles.row} ${styles.rowReverse}`}
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 55, ease: "linear", repeat: Infinity }}
      >
        {row.map((t, i) => (
          <span key={i} className={`${styles.item} ${styles.itemAlt}`}>
            {t}
            <span className={styles.slash}>/</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

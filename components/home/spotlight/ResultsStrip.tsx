"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Result {
  num: string;
  label: string;
}

const RESULTS: Result[] = [
  { num: "+86%", label: "Garden City" },
  { num: "+81%", label: "Buffalo Jewelry" },
  { num: "+71%", label: "Axel's Pawn" },
  { num: "5 reviews", label: "in 2 hours · Marshall" },
];

export function ResultsStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="rstrip"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {RESULTS.map((r, i) => (
        <span key={r.label} className="rstrip__item">
          <span className="rstrip__num">{r.num}</span>
          <span className="rstrip__label">{r.label}</span>
          {i < RESULTS.length - 1 && <span className="rstrip__sep" aria-hidden="true">·</span>}
        </span>
      ))}
    </motion.div>
  );
}

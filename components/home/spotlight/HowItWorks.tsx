"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Hand, Smartphone, Star } from "lucide-react";

interface Step {
  num: string;
  Icon: typeof Hand;
  label: string;
  sub: string;
}

const STEPS: Step[] = [
  {
    num: "1",
    Icon: Hand,
    label: "Hand the card",
    sub: "Each crew member keeps one. Hand it over after a transaction.",
  },
  {
    num: "2",
    Icon: Smartphone,
    label: "Customer taps",
    sub: "Tap their phone to the card. Their browser opens instantly.",
  },
  {
    num: "3",
    Icon: Star,
    label: "Review opens",
    sub: "Your Google review page, ready to fill in. Done.",
  },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="how">
      {STEPS.map((step, i) => (
        <motion.div
          key={step.num}
          className="how__step"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.3, delay: i * 0.08, ease: "easeOut" }}
        >
          <div className="how__num">{step.num}</div>
          <div className="how__card">
            <step.Icon className="how__icon" style={{ width: 22, height: 22 }} />
            <h4 className="how__label">{step.label}</h4>
            <p className="how__sub">{step.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

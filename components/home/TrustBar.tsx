"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Home, Ban, Smartphone, Boxes } from "lucide-react";

interface TrustItem {
  Icon: typeof Home;
  title: string;
  sub: string;
}

const ITEMS: TrustItem[] = [
  {
    Icon: Home,
    title: "Made for Main Street",
    sub: "Built for local US shops",
  },
  {
    Icon: Ban,
    title: "No subscription on cards",
    sub: "One-time purchase, yours forever",
  },
  {
    Icon: Smartphone,
    title: "Works on any phone",
    sub: "iPhone XS+, Android 5.0+",
  },
  {
    Icon: Boxes,
    title: "One family, four tools",
    sub: "Reviews, contacts, links, reputation",
  },
];

export function TrustBar() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="trustbar"
      aria-label="Why crews choose Shmocard"
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="trustbar__inner">
        {ITEMS.map(({ Icon, title, sub }) => (
          <div key={title} className="trustbar__item">
            <span className="trustbar__icon">
              <Icon style={{ width: 18, height: 18 }} />
            </span>
            <span>
              <span className="trustbar__title">{title}</span>
              <br />
              <span className="trustbar__sub">{sub}</span>
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

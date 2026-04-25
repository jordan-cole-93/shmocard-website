"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SpotlightHeader() {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.3, delay, ease: "easeOut" as const },
  });

  return (
    <div className="hsection__head">
      <div>
        <motion.div className="hsection__eyebrow" {...fadeUp(0)}>
          Spotlight: Shmo Review
        </motion.div>
        <motion.h2 className="hsection__title" {...fadeUp(0.05)}>
          One tap. One <em>five-star</em> review.
        </motion.h2>
      </div>
      <motion.p className="hsection__lede" {...fadeUp(0.1)}>
        Cards that send your happiest customers straight to your Google review
        page. No app. No login. One tap.
      </motion.p>
    </div>
  );
}

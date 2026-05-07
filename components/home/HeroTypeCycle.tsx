"use client";

// components/home/HeroTypeCycle.tsx
// Cycles between accent words for the locked hero headline:
//   "The toolkit your crew's been [missing | asking for]."
// No layout shift — reserves min-width via the longest alternative.
// Crossfade via framer-motion AnimatePresence, 150ms (--motion-fast).

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  words: string[];
  intervalMs?: number;
};

export default function HeroTypeCycle({ words, intervalMs = 2500 }: Props) {
  const [idx, setIdx] = useState(0);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [reservedWidth, setReservedWidth] = useState<number | null>(null);

  // Pick the longest word so it reserves enough width.
  const longest = useMemo(() => {
    return words.reduce((a, b) => (b.length > a.length ? b : a), words[0] ?? "");
  }, [words]);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  // Measure the longest word's rendered width once mounted.
  useEffect(() => {
    if (measureRef.current) {
      const w = measureRef.current.getBoundingClientRect().width;
      if (w > 0) setReservedWidth(Math.ceil(w));
    }
  }, [longest]);

  const current = words[idx] ?? "";

  return (
    <span
      className="home-hero__cycle"
      style={{
        minWidth: reservedWidth ? `${reservedWidth}px` : undefined,
        position: "relative",
      }}
    >
      {/* Hidden width-reserver — keeps layout stable on first paint. */}
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{
          visibility: "hidden",
          position: "absolute",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {longest}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ display: "inline-block" }}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

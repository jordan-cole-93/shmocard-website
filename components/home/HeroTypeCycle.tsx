"use client";

// components/home/HeroTypeCycle.tsx
// Cycles between accent words for the locked hero headline:
//   "The toolkit your" / "crew's been [missing | asking for]."
// Typewriter animation with a blinking caret. Sentence period lives
// inside the cycle so it stays glued to the caret as text types/deletes.
// Min-width is reserved for the longest fully-typed state so line 2's
// total width never reflows mid-cycle. Falls back to instant text on
// prefers-reduced-motion.

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  words: string[];
  pauseAtFullMs?: number;
  typeSpeedMs?: number;
  deleteSpeedMs?: number;
};

type Phase = "typing" | "pausing" | "deleting";

// Width of the caret + period block beyond the typed word. caret has
// margin-left:6 + width:2; period adds ~10-12px in Bricolage Grotesque
// at display size. 22px is a small over-reserve that keeps min-width >=
// any rendered state.
const CARET_AND_PERIOD_BUFFER_PX = 22;

export default function HeroTypeCycle({
  words,
  pauseAtFullMs = 1600,
  typeSpeedMs = 70,
  deleteSpeedMs = 40,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [wordIdx, setWordIdx] = useState(0);
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [reservedWidth, setReservedWidth] = useState<number | null>(null);

  const longest = useMemo(() => {
    return words.reduce((a, b) => (b.length > a.length ? b : a), words[0] ?? "");
  }, [words]);

  useEffect(() => {
    if (measureRef.current) {
      const w = measureRef.current.getBoundingClientRect().width;
      if (w > 0) setReservedWidth(Math.ceil(w) + CARET_AND_PERIOD_BUFFER_PX);
    }
  }, [longest]);

  useEffect(() => {
    const target = words[wordIdx] ?? "";

    if (reduceMotion) {
      if (shown !== target) setShown(target);
      const id = window.setTimeout(() => {
        setWordIdx((i) => (i + 1) % words.length);
      }, pauseAtFullMs * 2);
      return () => window.clearTimeout(id);
    }

    let id: number | undefined;

    if (phase === "typing") {
      if (shown.length < target.length) {
        id = window.setTimeout(() => {
          setShown(target.slice(0, shown.length + 1));
        }, typeSpeedMs);
      } else {
        setPhase("pausing");
      }
    } else if (phase === "pausing") {
      id = window.setTimeout(() => setPhase("deleting"), pauseAtFullMs);
    } else if (phase === "deleting") {
      if (shown.length > 0) {
        id = window.setTimeout(() => {
          setShown(target.slice(0, shown.length - 1));
        }, deleteSpeedMs);
      } else {
        setWordIdx((i) => (i + 1) % words.length);
        setPhase("typing");
      }
    }

    return () => {
      if (id !== undefined) window.clearTimeout(id);
    };
  }, [phase, shown, wordIdx, words, pauseAtFullMs, typeSpeedMs, deleteSpeedMs, reduceMotion]);

  return (
    <span
      className="home-hero__cycle"
      style={{
        minWidth: reservedWidth ? `${reservedWidth}px` : undefined,
        position: "relative",
      }}
    >
      <span
        ref={measureRef}
        aria-hidden="true"
        className="home-hero__cycle-measure"
      >
        {longest}
      </span>
      <span className="home-hero__cycle-text">{shown}</span>
      <span className="home-hero__cycle-caret" aria-hidden="true" />
      <span className="home-hero__cycle-period">.</span>
    </span>
  );
}

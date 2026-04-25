"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";

interface CrewTile {
  id: string;
  client: string;
  surface: "cream" | "honey" | "graham" | "blush" | "snow" | "peach";
}

const CREWS: CrewTile[] = [
  { id: "garden", client: "Garden City", surface: "cream" },
  { id: "buffalo", client: "Buffalo Jewelry", surface: "honey" },
  { id: "axels", client: "Axel's Pawn", surface: "blush" },
  { id: "cc", client: "CC Pawn", surface: "graham" },
  { id: "granters", client: "Granters", surface: "snow" },
  { id: "allan", client: "Allan Macias", surface: "peach" },
];

export function RealResults() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="results" className="results">
      <div className="results__inner">
        <div className="results__head">
          <span className="results__eyebrow">Crews using Shmocard</span>
          <h2 className="results__title">
            Real shops, real <em>tap</em> moments.
          </h2>
          <p className="results__lede">
            Six Main Street crews handing Shmocards across the counter today.
            Tap to leave a review — no app, no login, no friction.
          </p>
        </div>

        <div className="results__strip">
          {CREWS.map((c, i) => (
            <motion.figure
              key={c.id}
              className={`crew-tile crew-tile--${c.surface}`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.32, delay: i * 0.05, ease: "easeOut" }}
            >
              <Placeholder
                className="crew-tile__photo"
                label={`${c.client} shop photo`}
                aspect="1 / 1"
              />
              <figcaption className="crew-tile__caption">{c.client}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

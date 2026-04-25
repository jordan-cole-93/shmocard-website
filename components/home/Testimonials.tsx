"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  brand: string;
  duration: string;
  surface: "choc-deep" | "chocolate" | "ember";
  pending?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "carly-1",
    quote:
      "Got 14 in the first week. Marshall's already gotten five today and we've been open for an hour and a half.",
    author: "Carly",
    role: "Owner, Axel's Pawn",
    brand: "Axel's",
    duration: "1:42",
    surface: "choc-deep",
  },
  {
    id: "carly-2",
    quote:
      "He got five Google reviews in less than two hours of being open.",
    author: "Carly",
    role: "Owner, Axel's Pawn",
    brand: "Axel's",
    duration: "0:58",
    surface: "chocolate",
  },
  {
    id: "joey",
    quote: "More five-star moments incoming.",
    author: "Joey",
    role: "Quote pending",
    brand: "—",
    duration: "",
    surface: "ember",
    pending: true,
  },
];

export function Testimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="testimonials" className="testimonials">
      <div className="testimonials__inner">
        <div className="testimonials__head">
          <span className="testimonials__eyebrow">What crews say</span>
          <h2 className="testimonials__title">
            Real crews, real <em>five-star</em> moments.
          </h2>
          <p className="testimonials__lede">
            Short stories from owner-operators who put Shmocards on their teams.
            No script, no vague metrics — just what changed.
          </p>
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={t.id}
              className={`testimonial testimonial--${t.surface} ${t.pending ? "testimonial--pending" : ""}`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.36, delay: i * 0.08, ease: "easeOut" }}
            >
              <div className="testimonial__media">
                {t.duration && (
                  <span className="testimonial__duration" aria-hidden="true">
                    {t.duration}
                  </span>
                )}
                {!t.pending && (
                  <span className="testimonial__play" aria-hidden="true">
                    <Play style={{ width: 22, height: 22, marginLeft: 3 }} fill="currentColor" />
                  </span>
                )}
                {t.pending && (
                  <span className="testimonial__pending-badge" aria-hidden="true">
                    Coming soon
                  </span>
                )}
                <blockquote className="testimonial__quote">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <footer className="testimonial__footer">
                <div className="testimonial__author">
                  <span className="testimonial__name">{t.author}</span>
                  <span className="testimonial__role">{t.role}</span>
                </div>
                <span className="testimonial__brand">{t.brand}</span>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

// components/shmo-review/NumbersWall.tsx — Shmo Review numbers wall.
// Phase 7. Ported 1:1 from
// .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/review-parts.jsx:328-381
// + review.css:674-725 + REVIEW_NUMBERS data from review-data.jsx:84-94.
//
// 8 verified shop %-increases as horizontal bars on marsh. The bars
// reveal from 0 → target width with a staggered IntersectionObserver
// trigger once the section scrolls into view.
//
// Deviation from reference: the reference bar-fill uses
// `linear-gradient(honey → ember)`. Per Jordan + the design-system
// rule "No gradients", we use a flat `--color-ember` fill instead.
//
// Client component (needs IntersectionObserver + useState).

import { useEffect, useRef, useState } from "react";

import Section from "@/components/layout/Section";

const REVIEW_NUMBERS = [
  { shop: "Garden City",      owner: "Thomas",    inc: "+86%", note: "Roofing co · Atlanta" },
  { shop: "Buffalo Jewelry",  owner: "Joey",      inc: "+81%", note: "Pawn & loan · Buffalo" },
  { shop: "Axel's Pawn",      owner: "Carly",     inc: "+71%", note: "Pawn shop · Minneapolis" },
  { shop: "CC Pawn",          owner: "Claiborne", inc: "+71%", note: "Pawn shop · Mobile" },
  { shop: "Granters",         owner: "Vito",      inc: "+60%", note: "Auto repair · Phoenix" },
  { shop: "Cashco",           owner: "Morris",    inc: "+47%", note: "Pawn & loan · Houston" },
  { shop: "The Pawn Shop",    owner: "Chase",     inc: "+43%", note: "Pawn shop · Tampa" },
  { shop: "Smyrna",           owner: "Jason",     inc: "+41%", note: "Auto detail · Smyrna" },
];

const BAR_MAX = 100;

export default function NumbersWall() {
  const [revealed, setRevealed] = useState(false);
  const wallRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wallRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Section
      bg="marsh"
      nextBg="cocoa"
      waveSize="lg"
      className="numbers-wall"
      id="numbers"
      ariaLabel="Verified review-volume increases"
    >
      <div ref={wallRef}>
        <div className="shm-section-head">
          <span className="shm-eyebrow">Verified · across 8 shops · 8 industries</span>
          <h2 className="shm-h2">
            Real shops. Real <em>review-volume</em> increases.
          </h2>
          <p className="shm-lede">
            Reported by Shmo Review customers in their first 90 days. The shop with the lowest lift
            still doubled their monthly review pace.
          </p>
        </div>

        <div className="numbers-list">
          {REVIEW_NUMBERS.map((n, i) => {
            const pct = parseInt(n.inc.replace(/[^0-9]/g, ""), 10);
            const width = revealed ? `${(pct / BAR_MAX) * 100}%` : "0%";
            return (
              <div className="numbers-row" key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="numbers-row__shop">
                  <span className="numbers-row__name">{n.shop}</span>
                  <span className="numbers-row__owner">
                    {n.owner} · {n.note}
                  </span>
                </div>
                <div className="numbers-row__bar">
                  <div
                    className="numbers-row__bar-fill"
                    style={{ width, transitionDelay: `${i * 80}ms` }}
                  />
                </div>
                <div className="numbers-row__inc">{n.inc}</div>
              </div>
            );
          })}
        </div>
        <p className="numbers-foot">
          Verified review-volume increases reported by Shmo Review customers · first 90 days
          post-install.
        </p>
      </div>
    </Section>
  );
}

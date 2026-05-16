"use client";

// components/shmo-review/Faq.tsx — Shmo Review FAQ accordion.
// Phase 10. Ported 1:1 from
// .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/review-parts.jsx:461–494
// + REVIEW_FAQ data from review-data.jsx:124–149.
//
// 6 questions ported verbatim from the reference.
// Uses .shm-faq-list (soft hairline default). NOT --hard / --featured-card.
// Replaces StandoutMoments as the last section on /shmo-review.
//
// Client component — needs useState for accordion open/close.

import { useState } from "react";
import Section from "@/components/layout/Section";

const REVIEW_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "How does the card work?",
    a: "Every Shmo Review card has an NFC chip programmed with your Google review URL. When a customer taps the back of their phone to the card, their browser opens that URL directly — no app, no login, no QR-code gymnastics. iPhone XS and newer (2018+) and Android 5+ have NFC built in.",
  },
  {
    q: "Do I have to set anything up?",
    a: "No. Send us your Google review link at checkout and we program every card before it ships. If you change your business name or move locations later, you can reprogram from the dashboard at no extra cost.",
  },
  {
    q: "How fast does it ship?",
    a: "Orders placed by Tuesday 5pm CT ship Friday. Standard shipping is 3 days. Bulk orders (10+) ship free expedited.",
  },
  {
    q: "What if a customer's phone can't tap?",
    a: "Every card has a QR code on the back as a fallback. Same destination, same flow — just a scan instead of a tap. Covers any phone that can't NFC.",
  },
  {
    q: "Is the card branded with my shop?",
    a: "Yes. Every order is custom-printed with your logo, name, and color treatment. Send us your assets at checkout and we'll mock it up before printing.",
  },
  {
    q: "What's the return policy?",
    a: "60-day no-questions returns. If your crew hates it, box it back up and we refund the full amount. We also reprogram for life — change your destination URL whenever you want.",
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <Section bg="cream" nextBg="ember" className="review-faq" ariaLabel="FAQ">
      <div className="shm-section-head">
        <span className="shm-eyebrow">FAQ</span>
        <h2 className="shm-h2">
          Questions, answered <em>plainly</em>.
        </h2>
      </div>
      <div className="review-faq__wrap">
        <ul className="shm-faq-list">
          {REVIEW_FAQ.map((item, i) => (
            <li
              className={`shm-faq-item${openIdx === i ? " shm-faq-item--open" : ""}`}
              key={i}
            >
              <button
                className="shm-faq-trigger"
                aria-expanded={openIdx === i}
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              >
                <span className="shm-faq-question">{item.q}</span>
                <span className="shm-faq-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              {openIdx === i && (
                <div className="shm-faq-answer">{item.a}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

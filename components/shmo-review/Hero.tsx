// components/shmo-review/Hero.tsx — Shmo Review hero.
// Phase 1. Ported 1:1 from
// .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/review-parts.jsx:11-60.
//
// Hero is NOT a standard .shm-section. The reference uses a custom
// .review-hero class with its own grid-textured marshmallow background.
// We render the <section> directly and emit the wave as a sibling per this
// repo's convention.
//
// Server component.

import type { CSSProperties } from "react";

const STARS = [0, 1, 2, 3, 4];

export default function Hero() {
  return (
    <>
      <section className="review-hero" aria-label="Shmo Review hero">
        <div className="shm-container review-hero__inner">
          <div className="review-hero__copy">
            <span className="shm-eyebrow">Shmo Review · NFC tap cards</span>
            <h1 className="shm-display review-hero__h">
              Built for crews.
              <br />
              Priced for <em>bulk</em>
              <img
                src="/mascot/mascot-holding-card.png"
                alt=""
                className="review-hero__sticker"
                style={{ "--mascot-fit-ratio": 1.1 } as CSSProperties}
              />
              .
            </h1>
            <p className="shm-lede review-hero__lede">
              Pre-programmed NFC review cards, signs, and discs. Hand one over after every
              transaction — your customer taps, leaves a five-star review, and you climb the
              rankings. No app, no login, no friction.
            </p>
            <div className="review-hero__cta-row">
              <a className="shm-btn shm-btn--primary shm-btn--lg" href="#buybox">
                Shop the cards →
              </a>
              <a className="shm-btn shm-btn--ghost shm-btn--lg" href="#how">
                See how it works
              </a>
            </div>
            <div className="review-hero__meta">
              <span className="shm-rating">
                <span className="shm-rating__stars">
                  {STARS.map((i) => (
                    <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" />
                    </svg>
                  ))}
                </span>
                <span className="shm-rating__num">4.9</span>
                <span className="shm-rating__count">· 87 verified reviews</span>
              </span>
              <span className="review-hero__dot" aria-hidden="true" />
              <span>Ships in 3 days · 60-day return</span>
            </div>
          </div>

          <div className="review-hero__media">
            <img
              src="/shmo-review/hero-image-2.png"
              alt="Shmo Review cards, sign, and plate with Big Dog Pawn proof callouts"
              className="review-hero__image"
            />
          </div>
        </div>
      </section>
      <div className="shm-wave shm-wave--graham review-hero__wave" aria-hidden="true" />
    </>
  );
}

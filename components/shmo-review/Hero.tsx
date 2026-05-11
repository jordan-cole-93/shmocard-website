// components/shmo-review/Hero.tsx
// Hero for /shmo-review. Server component.
//
// Locked content (mirrors Claude Design review-parts.jsx::ReviewHero):
//   Eyebrow: "Shmo Review · NFC tap cards"
//   Headline: "Built for crews. Priced for <em>bulk</em>"
//   Mascot sticker: holding-card pose, .shm-sticker--md (76px) + .shm-tilt-l
//   CTAs: primary "Shop the cards →" (jumps to embedded buybox) +
//         ghost "See how it works" (jumps to HowItWorksSticky)
//   Meta: "Ships in 3 days · 60-day return" (verified in marketing.md FAQ)
//
// No fabricated rating: Claude Design output had "4.9 · 87 verified
// reviews" but marketing.md has no such claim. Sales-page social proof
// must be verifiable — omitted until Jordan confirms a real number.

export default function Hero() {
  return (
    <div className="rev-hero rev-hero__inner">
      <span className="shm-eyebrow">Shmo Review · NFC tap cards</span>
      <h1 className="shm-display rev-hero__h">
        Built for crews.
        <br />
        Priced for <em>bulk</em>
        <img
          src="/mascot/mascot-holding-card.png"
          alt=""
          aria-hidden="true"
          className="shm-sticker shm-sticker--md shm-tilt-l rev-hero__sticker"
          style={{ ["--mascot-fit-ratio" as string]: 1.1 }}
        />
        .
      </h1>
      <p className="shm-lede rev-hero__lede">
        Pre-programmed NFC review cards, signs, and discs. Hand one over
        after every transaction — your customer taps, leaves a five-star
        review, and you climb the rankings. No app, no login, no friction.
      </p>
      <div className="rev-hero__cta-row">
        <a className="shm-btn shm-btn--primary shm-btn--lg" href="#buybox">
          Shop the cards →
        </a>
        <a className="shm-btn shm-btn--ghost shm-btn--lg" href="#how">
          See how it works
        </a>
      </div>
      <div className="rev-hero__meta">
        <span>Ships in 3 days · 60-day return</span>
      </div>
    </div>
  );
}

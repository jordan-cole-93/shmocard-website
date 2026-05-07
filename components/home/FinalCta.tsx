// components/home/FinalCta.tsx
// Server component. Single high-emphasis ember band — no nextBg
// (footer follows directly).

import "./home.css";
import Section from "@/components/layout/Section";

export default function FinalCta() {
  return (
    <Section bg="ember" ariaLabel="Final call to action">
      <div className="final-cta">
        <span className="shm-eyebrow">Ready to ship</span>
        <h2 className="shm-h2">Pick a card, pick a kit, or build your own.</h2>
        <p className="final-cta__lede">
          Orders placed by Tuesday ship Friday — your crew taps for five-stars by next Monday.
        </p>
        <div className="final-cta__row">
          <a className="shm-btn shm-btn--cream shm-btn--lg" href="/shmo-review">
            Shop the cards
          </a>
          <a className="shm-btn shm-btn--ghost shm-btn--lg on-dark" href="/shmo-review">
            Browse formats
          </a>
        </div>
      </div>
    </Section>
  );
}

// components/shmo-review/cr-80/Proof.tsx
// 03-03 — Proof section for the CR-80 PDP.
// Verified metrics grid (left) + verbatim testimonial (right).
// Server component — no interactivity.

import { Section } from "@/components/layout/Section";

const metrics = [
  { owner: "Chase", shop: "The Pawn Shop", pct: "+43%" },
  { owner: "Vito", shop: "Granters", pct: "+60%" },
  { owner: "Carly", shop: "Axel's Pawn", pct: "+71%" },
  { owner: "Joey", shop: "Buffalo Jewelry & Loan", pct: "+81%" },
] as const;

// Five filled stars — inline SVG, currentColor (honey via .shm-rating__stars).
function StarIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ width: 16, height: 16, fill: "currentColor" }}
    >
      <path d="M8 1.25l1.83 3.71 4.09.6-2.96 2.88.7 4.07L8 10.52l-3.66 1.99.7-4.07L2.08 5.56l4.09-.6L8 1.25z" />
    </svg>
  );
}

export function Proof() {
  return (
    <Section bg="cream" nextBg="marsh">
      <div className="proof-section__inner">
        {/* Section header */}
        <div className="proof-section__head">
          <span className="shm-eyebrow">Real shops · real numbers</span>
          <h2 className="shm-h2">
            The math <em>only</em> works when the crew taps.
          </h2>
        </div>

        {/* Two-column body */}
        <div className="proof-section__cols">
          {/* Left — metrics grid */}
          <div className="proof-section__metrics">
            {metrics.map((m) => (
              <div key={m.owner} className="shm-card proof-section__metric-card">
                <p className="proof-section__metric-shop shm-eyebrow">
                  {m.shop}
                </p>
                <p className="shm-h1 proof-section__metric-num" aria-label={`${m.pct} more reviews`}>
                  {m.pct}
                </p>
                <p className="proof-section__metric-label">
                  more reviews in 60 days
                </p>
                <p className="proof-section__metric-owner">{m.owner}</p>
              </div>
            ))}
          </div>

          {/* Right — testimonial */}
          <div className="shm-review proof-section__testimonial">
            {/* Rating row */}
            <div className="shm-rating">
              <span className="shm-rating__stars" aria-label="5 stars">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </span>
            </div>

            {/* Verbatim quote — exclamation marks removed per rule */}
            <blockquote className="shm-review__body proof-section__quote">
              "We've gotten 5 Google Reviews just today now that our NFC cards
              are up and running. It makes it so much easier to get customers to
              follow through."
            </blockquote>

            {/* Attribution */}
            <footer className="proof-section__attr">
              <span className="proof-section__attr-name">Carli Karlson</span>
              <span className="proof-section__attr-meta">
                Axel's Pawn · Facebook post, Nov 2025
              </span>
            </footer>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Proof;

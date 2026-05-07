// components/home/Proof.tsx
// Server component. Two-column: testimonial quotes (left) + grid of
// shop cards with verified review-volume metrics (right).
// HARD RULE: shop names + owner first names + metric only. No agency attribution.

import "./home.css";
import Section from "@/components/layout/Section";
import { QUOTES, SHOPS } from "./home-data";

export default function Proof() {
  return (
    <Section bg="marsh" nextBg="marsh" ariaLabel="Proof — what shops say">
      <div className="shm-section-head">
        <span className="shm-eyebrow">Real shops, real numbers</span>
        <h2 className="shm-h2">Built for crews. Priced for <em>bulk</em>.</h2>
        <p className="shm-lede">
          One card behind the counter captures ~2 reviews a week. One per employee captures ~15.
          Single units don&apos;t move the needle. Crews do.
        </p>
      </div>

      <div className="proof-grid">
        <div className="proof-quotes">
          {QUOTES.map((q, i) => (
            <figure key={i} className="shm-card proof-quote">
              <blockquote className="proof-quote__body">&ldquo;{q.body}&rdquo;</blockquote>
              <figcaption className="proof-quote__attr">
                <span className="proof-quote__avatar">{q.initials}</span>
                <span>
                  <b>{q.author}</b>
                  {q.shop}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="proof-shops">
          {SHOPS.map((s) => (
            <div key={s.name} className="shm-card proof-shop">
              <div className="proof-shop__name">{s.name}</div>
              <div className="proof-shop__owner">{s.owner}</div>
              <div className="proof-shop__inc">{s.inc}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="proof-foot">Verified review-volume increases. Aggregate, not promised per shop.</p>
    </Section>
  );
}

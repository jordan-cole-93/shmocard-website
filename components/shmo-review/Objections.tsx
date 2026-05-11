// components/shmo-review/Objections.tsx
// 4-card Q&A grid on cocoa section background. Server component.
//
// Composes `.shm-card --chocolate` — a tonal card one shade lighter than
// the surrounding `.shm-bg-cocoa` section, which lets each Q&A read as a
// raised tile against the dark section. Marshmallow text + soft hairline
// outline come from the primitive. Page CSS owns layout only.
//
// Content from data.ts::REVIEW_OBJECTIONS.

import { REVIEW_OBJECTIONS } from "./data";

export default function Objections() {
  return (
    <>
      <div className="shm-section-head">
        <span className="shm-eyebrow">Objections, answered</span>
        <h2 className="shm-h2">
          &ldquo;But we already <em>ask</em>.&rdquo;
        </h2>
        <p className="shm-lede">Every objection we hear, in the order we hear it.</p>
      </div>
      <div className="rev-objections-grid">
        {REVIEW_OBJECTIONS.map((objection, i) => (
          <article
            key={objection.q}
            className="shm-card shm-card--chocolate rev-objection-card"
          >
            <div className="rev-objection-card__num">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="rev-objection-card__q">{objection.q}</h3>
            <p className="rev-objection-card__a">{objection.a}</p>
          </article>
        ))}
      </div>
    </>
  );
}

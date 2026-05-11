// components/shmo-review/StandoutMoments.tsx
// 3 hero stat cards on tone-tinted surfaces. Server component.
//
// Composes `.shm-card --hard --ember/--cocoa/--honey` — high-emphasis
// "when it counts" moment (audit H5 promoted from soft hairline). Each
// card surfaces a stat, metric label, quote, and attribution. The
// surrounding section stays on the locked four-color rotation
// (marsh/graham/ember/cocoa) — only card surfaces use tonal variants.
//
// Content from data.ts::REVIEW_STANDOUT (verified against marketing.md).
// M2 fix: <figcaption> now lives inside <figure>.

import { REVIEW_STANDOUT } from "./data";

export default function StandoutMoments() {
  return (
    <>
      <div className="shm-section-head">
        <span className="shm-eyebrow">Standout moments</span>
        <h2 className="shm-h2">
          What happens when crews <em>actually</em> hand them over.
        </h2>
        <p className="shm-lede">
          Three weeks. Three crews. Three numbers we couldn&rsquo;t have predicted.
        </p>
      </div>
      <div className="rev-standout-grid">
        {REVIEW_STANDOUT.map((moment) => (
          <figure
            key={moment.person + moment.big}
            className={`shm-card shm-card--hard shm-card--${moment.tone} rev-standout-card`}
          >
            <div className="rev-standout-card__big">{moment.big}</div>
            <div className="rev-standout-card__metric">{moment.metric}</div>
            <blockquote className="rev-standout-card__quote">
              &ldquo;{moment.quote}&rdquo;
            </blockquote>
            <figcaption className="rev-standout-card__attr">
              <b>{moment.person}</b>
              <span>{moment.shop}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

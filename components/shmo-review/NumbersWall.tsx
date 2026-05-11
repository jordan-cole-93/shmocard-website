// components/shmo-review/NumbersWall.tsx
// 8-row table of verified shop review-volume increases with inline bar
// chart. Server component — bars render at final width on first paint.
// (Claude Design output used IntersectionObserver-driven reveal animation;
// trading that for SSR-friendliness. Wave 7 may reintroduce CSS-only entry
// transitions if Jordan wants the animation back.)
//
// Bar widths normalized to a 100% max (matching the design intent that
// the highest entry, +86%, fills the track).

import { REVIEW_NUMBERS } from "./data";

const MAX_PCT = 100;

function parsePct(inc: string): number {
  const n = parseInt(inc.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export default function NumbersWall() {
  return (
    <>
      <div className="shm-section-head">
        <span className="shm-eyebrow">Verified · across 8 shops · 8 industries</span>
        <h2 className="shm-h2">
          Real shops. Real <em>review-volume</em> increases.
        </h2>
        <p className="shm-lede">
          Reported by Shmo Review customers in their first 90 days. The shop
          with the lowest lift still doubled their monthly review pace.
        </p>
      </div>
      <div className="rev-numbers-list">
        {REVIEW_NUMBERS.map((row) => {
          const width = `${(parsePct(row.inc) / MAX_PCT) * 100}%`;
          return (
            <div key={row.shop} className="rev-numbers-row">
              <div className="rev-numbers-row__shop">
                <span className="rev-numbers-row__name">{row.shop}</span>
                <span className="rev-numbers-row__owner">
                  {row.owner} · {row.note}
                </span>
              </div>
              <div
                className="rev-numbers-row__bar"
                role="img"
                aria-label={`${row.shop}: ${row.inc} review-volume increase`}
              >
                <div className="rev-numbers-row__bar-fill" style={{ width }} />
              </div>
              <div className="rev-numbers-row__inc">{row.inc}</div>
            </div>
          );
        })}
      </div>
      <p className="rev-numbers-foot">
        Verified review-volume increases reported by Shmo Review customers ·
        first 90 days post-install.
      </p>
    </>
  );
}

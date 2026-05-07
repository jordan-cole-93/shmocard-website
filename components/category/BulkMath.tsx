// components/category/BulkMath.tsx
// The bulk-math argument visualized as a tier grid. Server component.
//
// No prices. The numbers in BULK_MATH_TIERS are illustrative review-volume
// ranges sourced from marketing.md. Pricing lives in Shopify and is shown
// only on the PDPs (03-05/06/07).

import { BULK_MATH_TIERS } from "./category-data";

export default function BulkMath() {
  return (
    <div id="bulk-math">
      <div className="cat-bulk__head">
        <span className="shm-eyebrow">The math</span>
        <h2 className="shm-h2">One per employee. The math is brutal.</h2>
        <p className="shm-lede">
          Behind the counter: roughly 2 reviews a week. In every employee's
          pocket: roughly 15. A 7× swing. Bulk solves the problem; single
          units do not.
        </p>
      </div>

      <div className="cat-bulk__grid">
        {BULK_MATH_TIERS.map((tier) => (
          <div key={tier.crew} className="shm-card cat-bulk__tier">
            <span className="shm-eyebrow">
              {tier.crew === 1 ? "1 employee" : `${tier.crew} employees`}
            </span>
            <div className="cat-bulk__crew">
              <span className="shm-h2">{tier.cards}</span>
              <span className="shm-lede">
                {tier.cards === 1 ? "card" : "cards"}
              </span>
            </div>
            <div className="cat-bulk__divider" aria-hidden="true" />
            <div className="cat-bulk__row">
              <span className="shm-meta">Per shift</span>
              <span className="shm-body">{tier.tapsPerShift}</span>
            </div>
            <div className="cat-bulk__row">
              <span className="shm-meta">Per month</span>
              <span className="shm-body">{tier.reviewsPerMonth}</span>
            </div>
            <p className="shm-meta">{tier.note}</p>
          </div>
        ))}
      </div>

      <p className="shm-meta cat-bulk__footnote">
        Illustrative volume ranges, extrapolated from real client results.
        See current pricing on each format below.
      </p>
    </div>
  );
}

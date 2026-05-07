// components/category/CategoryHero.tsx
// Hero for /shmo-review. Server component.
//
// Locked content (do not edit without updating context/general/marketing.md):
//   - Headline: "One tap. One five-star review."
//   - Tagline:  "Built for crews. Priced for bulk."
// Layout: layout in components/category/category.css; visuals via .shm-* primitives.

import Link from "next/link";

export default function CategoryHero() {
  return (
    <div className="cat-hero">
      <span className="shm-eyebrow">Shmo Review</span>
      <h1 className="shm-display">One tap. One five-star review.</h1>
      <p className="shm-hand shm-hand--lg">Built for crews. Priced for bulk.</p>
      <p className="shm-lede">
        An NFC card, sign or disc that opens your Google review page the
        moment a customer taps it. No app. No login. No QR-code gymnastics.
        Pre-programmed before it ships, reprogrammable for life.
      </p>
      <div className="cat-hero__cta-row">
        <Link href="#formats" className="shm-btn shm-btn--primary">
          See formats
        </Link>
        <Link href="#bulk-math" className="shm-btn shm-btn--ghost">
          See the math
        </Link>
      </div>
    </div>
  );
}

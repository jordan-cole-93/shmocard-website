// components/pdp/PdpBuyboxColumn.tsx
// Server orchestrator for the right column.
//
// Composes the leaf primitives in the locked order from Buybox.html:
//   rating -> heading -> description -> rule -> checklist -> pack selector
//   -> callout -> qty -> google input -> add-to-cart -> meta
//
// Client interactions (pack, qty, google url, add-to-cart) consume
// PdpBuyboxContext, which is provided by the parent <PdpBuybox /> wrapper.

import type { ShopifyProduct } from "@/lib/shopify/types";
import { bullets, subline, type PdpSlug } from "./pdp-copy";
import PdpHeading from "./PdpHeading";
import PdpChecklist from "./PdpChecklist";
import PdpCallout from "./PdpCallout";
import PdpPackSelector from "./PdpPackSelector";
import PdpQtyStepper from "./PdpQtyStepper";
import PdpGoogleInput from "./PdpGoogleInput";
import PdpAddToCart from "./PdpAddToCart";

type Props = {
  product: ShopifyProduct;
  slug: PdpSlug;
};

function ShmRating() {
  // Static "social proof" rating bar. Real review count comes later
  // when the review platform is wired (out of scope this phase).
  return (
    <div className="shm-rating">
      <span className="shm-rating__stars" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} viewBox="0 0 24 24">
            <path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" />
          </svg>
        ))}
      </span>
      <span className="shm-rating__num">4.9</span>
      <span className="shm-rating__count">· based on owner feedback</span>
    </div>
  );
}

export default function PdpBuyboxColumn({ product, slug }: Props) {
  return (
    <div className="pdp-bb">
      <ShmRating />

      <PdpHeading title={product.title} sub={subline(slug)} />

      {product.description ? (
        <p className="pdp-bb__desc">{product.description}</p>
      ) : null}

      <hr className="pdp-bb__rule" />

      <PdpChecklist items={bullets(slug)} />

      <PdpPackSelector variants={product.variants.nodes} />

      <PdpCallout />

      <PdpQtyStepper />

      <PdpGoogleInput />

      <PdpAddToCart product={product} />

      <div className="pdp-bb__meta">
        <span>60-day return</span>
        <span>Ships in 3 days</span>
      </div>
    </div>
  );
}

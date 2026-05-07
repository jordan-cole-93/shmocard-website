// components/pdp/PdpBuybox.tsx
// Top-level PDP orchestrator. Server component.
//
// Receives the Shopify product (already fetched by the route), derives the
// default variant, wraps the tree in <PdpBuyboxProvider> for shared client
// state, and lays out: gallery (left) | buybox column (right).
//
// PdpStickyBar + PdpFaq mount in Task 2 of 03-05.

import "./pdp.css";

import type { ShopifyProduct } from "@/lib/shopify/types";
import { PdpBuyboxProvider } from "./PdpBuyboxContext";
import PdpGallery from "./PdpGallery";
import PdpBuyboxColumn from "./PdpBuyboxColumn";
import PdpStickyBar from "./PdpStickyBar";
import PdpFaq from "./PdpFaq";
import { pdpFaqFor, type PdpSlug } from "./pdp-copy";

type Props = {
  product: ShopifyProduct;
  slug: PdpSlug;
};

function pickDefaultVariantId(product: ShopifyProduct): string | null {
  const variants = product.variants.nodes;
  if (!variants || variants.length === 0) return null;
  // Pick the first available variant; fall back to the first if all sold out
  // so the UI still has a price displayed.
  const firstAvailable = variants.find((v) => v.availableForSale);
  return (firstAvailable ?? variants[0]).id;
}

export default function PdpBuybox({ product, slug }: Props) {
  const defaultVariantId = pickDefaultVariantId(product);

  return (
    <PdpBuyboxProvider defaultVariantId={defaultVariantId}>
      <PdpStickyBar product={product} />
      <section className="pdp-buybox" aria-label={product.title}>
        <PdpGallery
          images={product.images.nodes}
          productTitle={product.title}
        />
        <div>
          <PdpBuyboxColumn product={product} slug={slug} />
          <PdpFaq items={pdpFaqFor(slug)} />
        </div>
      </section>
    </PdpBuyboxProvider>
  );
}

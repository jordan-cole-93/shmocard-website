import "server-only";

import type { ShopifyProduct } from "./types";
import type { BuyboxGalleryImage, BuyboxPack, BuyboxProduct, BuyboxProps } from "@/components/shmo-review/Buybox";
import { DEFAULT_BUYBOX_GALLERY } from "@/components/shmo-review/Buybox";
import { mapVariantToPack, parseQty } from "./buybox-mapping";

// Static config for the offer page — overrides the standard PACK_STATIC table
// from buybox-mapping.ts. Differences from CR-80:
//   qty 1 = the FREE offer (ember tier, "$7 shipping" note).
//   qty 2/5/10 = premium upsells (slightly elevated pricing vs the public PDP).
const OFFER_PACK_STATIC: Record<
  number,
  Pick<BuyboxPack, "save" | "note" | "pop" | "tier" | "tierTone">
> = {
  1:  { save: null, note: "+ $7 shipping",          pop: true,  tier: "FREE",      tierTone: "ember" },
  2:  { save: null, note: "Standard shipping",      pop: false, tier: "Pair",      tierTone: "cream" },
  5:  { save: null, note: "Free shipping included", pop: false, tier: "Crew",      tierTone: "honey" },
  10: { save: null, note: "Free shipping included", pop: false, tier: "Full crew", tierTone: "ember" },
};

/**
 * Map the free-card Shopify product to OfferBuybox props.
 *
 * Reuses mapVariantToPack from buybox-mapping.ts for the per-variant price /
 * qty / compare math, then overrides note/tier/tierTone via OFFER_PACK_STATIC.
 *
 * The $0 variant gets a "FREE" tier label and the "+ $7 shipping" note;
 * the 2/5/10 packs get standard upsell labels.
 *
 * Returns Partial<BuyboxProps> — the page.tsx fills in `sub` (marketing copy)
 * and any other page-level overrides.
 */
export function mapProductToOfferBuyboxProps(product: ShopifyProduct): Partial<BuyboxProps> {
  const buyboxProduct: BuyboxProduct = {
    handle: product.handle,
    title: product.title,
    sub: "", // page.tsx owns the marketing sub-copy
  };

  const gallery: BuyboxGalleryImage[] =
    product.images.nodes.length > 0
      ? product.images.nodes.map((img) => ({
          src: img.url,
          alt: img.altText ?? product.title,
        }))
      : DEFAULT_BUYBOX_GALLERY;

  // Sort variants by qty ascending so the FREE row appears first.
  const sorted = [...product.variants.nodes].sort((a, b) => {
    const qa = parseQty(a.title) ?? 0;
    const qb = parseQty(b.title) ?? 0;
    return qa - qb;
  });

  const packs: BuyboxPack[] = sorted
    .map((v, i) => {
      const base = mapVariantToPack(v, sorted[i - 1]);
      const qty = base.qty;
      const offerStatic = OFFER_PACK_STATIC[qty];
      if (offerStatic) {
        return { ...base, ...offerStatic };
      }
      return base;
    })
    .filter((p) => p.qty > 0);

  return {
    product: buyboxProduct,
    gallery,
    packs,
  };
}

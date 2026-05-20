import "server-only";

import type { ShopifyProduct, ShopifyVariant } from "./types";
import type { BuyboxGalleryImage, BuyboxPack, BuyboxProduct, BuyboxProps } from "@/components/shmo-review/Buybox";
import { DEFAULT_BUYBOX_GALLERY } from "@/components/shmo-review/Buybox";

// ---------------------------------------------------------------------------
// Static pack config (D-01: variant metafields out of scope for Phase 8)
// ---------------------------------------------------------------------------

const PACK_STATIC: Record<number, Pick<BuyboxPack, "save" | "note" | "pop">> = {
  1:  { save: null,  note: null,                     pop: false },
  2:  { save: null,  note: null,                     pop: false },
  5:  { save: "20%", note: "Free shipping included", pop: false },
  10: { save: "27%", note: "Free shipping included", pop: true  },
};

const PACK_STATIC_FALLBACK: Pick<BuyboxPack, "save" | "note" | "pop"> = {
  save: null,
  note: null,
  pop: false,
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

/**
 * Extract the first integer from a variant title string.
 * Returns null if no integer is found.
 *
 * Examples:
 *   "10 Pack"  → 10
 *   "5-Pack"   → 5
 *   "Single"   → null
 */
export function parseQty(variantTitle: string): number | null {
  const match = variantTitle.match(/\d+/);
  if (!match) return null;
  return parseInt(match[0], 10);
}

/**
 * Map a single Shopify variant to a BuyboxPack.
 * Pass the previous variant (lower tier) to compute the compare price.
 */
export function mapVariantToPack(variant: ShopifyVariant, prevVariant?: ShopifyVariant): BuyboxPack {
  const qty = parseQty(variant.title) ?? 1;
  const price = parseFloat(variant.price.amount);
  const perCard = Math.round((price / qty) * 100) / 100;

  let compare: number | null = null;
  if (prevVariant) {
    const prevQty = parseQty(prevVariant.title) ?? 1;
    const prevPrice = parseFloat(prevVariant.price.amount);
    const prevPerCard = prevPrice / prevQty;
    compare = Math.round(prevPerCard * qty * 100) / 100;
  }

  const staticConfig = PACK_STATIC[qty] ?? PACK_STATIC_FALLBACK;

  return {
    qty,
    price,
    perCard,
    compare,
    ...staticConfig,
    variantId: variant.id,
    availableForSale: variant.availableForSale,
  };
}

/**
 * Map a full ShopifyProduct to the Partial<BuyboxProps> shape consumed by
 * components/shmo-review/Buybox.tsx.
 *
 * page.tsx owns marketing sub-copy — `sub` is left empty here.
 * Gallery falls back to DEFAULT_BUYBOX_GALLERY if Shopify returns no images.
 */
export function mapProductToBuyboxProps(product: ShopifyProduct): Partial<BuyboxProps> {
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

  const packs: BuyboxPack[] = product.variants.nodes.length > 0
    ? product.variants.nodes
        .map((v, i, arr) => mapVariantToPack(v, arr[i - 1]))
        .filter((p) => p.qty > 0)
    : [];

  return {
    product: buyboxProduct,
    gallery,
    packs,
  };
}

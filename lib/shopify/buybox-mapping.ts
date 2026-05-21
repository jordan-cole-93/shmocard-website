import "server-only";

import type { ShopifyProduct, ShopifyVariant } from "./types";
import type { BuyboxColor, BuyboxGalleryImage, BuyboxPack, BuyboxProduct, BuyboxProps } from "@/components/shmo-review/Buybox";
import { DEFAULT_BUYBOX_GALLERY } from "@/components/shmo-review/Buybox";

// ---------------------------------------------------------------------------
// Color swatch helpers
// ---------------------------------------------------------------------------

/**
 * Map a Shopify color option value to a CSS color string for the swatch.
 * Case-insensitive. Falls back to a neutral token string for unknown names
 * so the swatch still renders with the text label as the primary cue.
 */
export function cssColorFor(name: string): string {
  const n = name.toLowerCase().trim();
  if (n === "white")                        return "#FFFFFF";
  if (n === "black")                        return "#1A1A1A";
  if (n === "cream")                        return "#F5E6D3";
  if (n === "tan" || n === "beige")         return "#D6BCA0";
  if (n === "brown")                        return "#6B4423";
  if (n === "red")                          return "#C0392B";
  if (n === "blue")                         return "#3B82F6";
  if (n === "green")                        return "#16A34A";
  if (n === "gold" || n === "yellow")       return "#E89A1A";
  if (n === "pink")                         return "#F472B6";
  if (n === "gray" || n === "grey")         return "#9CA3AF";
  // Unknown color: neutral fallback — swatch still renders, name is the cue
  return "#E5E5E5";
}

// ---------------------------------------------------------------------------
// Static pack config (D-01: variant metafields out of scope for Phase 8)
// ---------------------------------------------------------------------------

const PACK_STATIC: Record<number, Pick<BuyboxPack, "save" | "note" | "pop" | "tier" | "tierTone">> = {
  1:  { save: null,  note: "Free shipping at 5+ packs", pop: false, tier: "Try",       tierTone: "cream" },
  2:  { save: null,  note: "Free shipping at 5+ packs", pop: false, tier: "Pair",      tierTone: "cream" },
  5:  { save: "20%", note: "Free shipping included",    pop: false, tier: "Crew",      tierTone: "honey" },
  10: { save: "27%", note: "Free shipping included",    pop: true,  tier: "Full crew", tierTone: "ember" },
};

const PACK_STATIC_FALLBACK: Pick<BuyboxPack, "save" | "note" | "pop" | "tier" | "tierTone"> = {
  save: null,
  note: null,
  pop: false,
  tier: undefined,
  tierTone: undefined,
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
 *
 * Multi-option products (e.g. L-Sign with Color × Pack Qty):
 *   Returns `colors`, `packsByColor`, and `packs` (= first color's packs for
 *   backward-compat). Single-option products return only `packs` as before.
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

  // Detect Color option (case-insensitive)
  const colorOpt = product.options.find(
    (o) => o.name.toLowerCase() === "color"
  );

  if (colorOpt && colorOpt.values.length > 0) {
    // --- Multi-option path (e.g. L-Sign: Color × Pack Qty) ---
    const colors: BuyboxColor[] = colorOpt.values.map((v) => {
      const variantWithImage = product.variants.nodes.find(
        (variant) =>
          variant.image &&
          variant.selectedOptions.some(
            (o) => o.name.toLowerCase() === "color" && o.value === v
          )
      );
      return {
        name: v,
        cssColor: cssColorFor(v),
        imageSrc: variantWithImage?.image?.url,
        imageAlt: variantWithImage?.image?.altText ?? v,
      };
    });

    // Group variants by color, sorted by qty ascending within each group
    const packsByColor: Record<string, BuyboxPack[]> = {};
    for (const color of colors) {
      const colorVariants = product.variants.nodes.filter((v) => {
        const variantColor = v.selectedOptions.find(
          (o) => o.name.toLowerCase() === "color"
        )?.value;
        return variantColor === color.name;
      });

      // Sort by qty ascending so prevVariant pricing math is correct per-color
      const sorted = [...colorVariants].sort((a, b) => {
        const qa = parseQty(a.title) ?? 0;
        const qb = parseQty(b.title) ?? 0;
        return qa - qb;
      });

      packsByColor[color.name] = sorted
        .map((v, i) => mapVariantToPack(v, sorted[i - 1]))
        .filter((p) => p.qty > 0);
    }

    // `packs` = first color's packs for backward-compat (code reading .packs still works)
    const firstColorPacks = packsByColor[colors[0].name] ?? [];

    return {
      product: buyboxProduct,
      gallery,
      packs: firstColorPacks,
      colors,
      packsByColor,
    };
  }

  // --- Single-option path (CR-80, Square Card) — unchanged behavior ---
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

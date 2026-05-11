// components/shmo-review/BuyboxSection.tsx
// Server orchestrator for the embedded CR-80 buybox on /shmo-review.
// Picks the default variant from Shopify and hands the product to a single
// client component that handles all interactivity (gallery thumb switch,
// pack selection, qty stepper, google config, add-to-cart).
//
// SHOPIFY DATA DISCIPLINE: product title / variants / prices / images all
// come from Shopify. Marketing copy (subline, checklist bullets, optional
// config hint, meta strip) lives in code below.
//
// LIVE-STORE-PROTECTION: read-only Storefront fetch upstream; cart
// mutation goes through addLineToCart Server Action (httpOnly cookie cart).

import type { ShopifyProduct } from "@/lib/shopify/types";
import BuyboxClient from "./BuyboxClient";

// Locked marketing copy. Lives in the component since it never changes
// per product (this section only renders CR-80) — single point of edit.
const CR80_COPY = {
  // Short subtitle shown directly below the H1 (Shopify-side description
  // is intentionally NOT rendered — design calls for one tight subline).
  subline: "The countertop tap that turns happy crews into five-star reviews.",
  bullets: [
    "Hand-printed in Minneapolis on premium PVC stock",
    "Pre-programmed to your Google review link before shipping",
    "Works on every modern phone — no app, no download",
    "60-day reprogramming + return guarantee",
  ],
  rating: {
    score: "4.9",
    // Real number per Jordan 2026-05-11. If this is sourced from a live
    // platform later (Trustpilot, Google), wire it in.
    countLabel: "87 verified reviews",
  },
  meta: ["60-day return", "Ships in 3 days"],
} as const;

type Props = {
  product: ShopifyProduct | null;
};

function parseQty(title: string, options: { name: string; value: string }[]): number {
  for (const opt of options ?? []) {
    const m = opt.value.match(/^(\d+)/);
    if (m) return parseInt(m[1], 10);
  }
  const m = title.match(/(\d+)\s*[-\s]?cards?|pack\s*of\s*(\d+)|(\d+)\s*[-\s]?pack/i);
  if (m) return parseInt(m[1] ?? m[2] ?? m[3], 10);
  const fb = title.match(/(\d+)/);
  return fb ? parseInt(fb[1], 10) : 1;
}

// Pick the "most popular" (highest-quantity available) variant by default —
// matches the reference design and is conversion-positive.
function pickDefaultVariantId(product: ShopifyProduct): string | null {
  const variants = product.variants.nodes;
  if (!variants || variants.length === 0) return null;
  const sorted = [...variants].sort(
    (a, b) =>
      parseQty(b.title, b.selectedOptions) -
      parseQty(a.title, a.selectedOptions),
  );
  const firstAvailable = sorted.find((v) => v.availableForSale);
  return (firstAvailable ?? sorted[0]).id;
}

export default function BuyboxSection({ product }: Props) {
  if (!product) return null;
  const defaultVariantId = pickDefaultVariantId(product);

  return (
    <BuyboxClient
      product={product}
      defaultVariantId={defaultVariantId}
      copy={CR80_COPY}
    />
  );
}

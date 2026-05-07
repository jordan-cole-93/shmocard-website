// app/shmo-review/[handle]/page.tsx
// Dynamic PDP route — server component.
//
// URL slugs: /shmo-review/cr-80, /shmo-review/l-sign, /shmo-review/square-card.
// Each maps to a Shopify product handle via HANDLE_MAP (T-03-05-01 — never
// pass user input directly to getProductByHandle; allowlist only).
//
// REQ-03 / REQ-06: product data fetched from Shopify Storefront API per
// request. No hardcoded title / price / images.

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductByHandle } from "@/lib/shopify/queries";
import PdpBuybox from "@/components/pdp/PdpBuybox";
import { isPdpSlug, type PdpSlug } from "@/components/pdp/pdp-copy";

// URL slug -> Shopify product handle (allowlist). Source: product.md.
const HANDLE_MAP: Record<PdpSlug, string> = {
  "cr-80": "google-reviews-nfc-tap-card-cr80",
  "l-sign": "google-review-nfc-tap-card-l-sign",
  "square-card": "google-review-plaque",
};

// Per-slug fallback metadata used when Shopify is unreachable or the
// product is missing the description field.
const FALLBACK_META: Record<PdpSlug, { title: string; description: string }> = {
  "cr-80": {
    title: "Shmo Review CR-80 Card — Built for crews. Priced for bulk.",
    description:
      "The classic NFC review card. Slips in a wallet, clips to a lanyard, lives in a back pocket. Pre-programmed to your Google review link before shipping.",
  },
  "l-sign": {
    title: "Shmo Review L-Sign — One tap. One five-star review.",
    description:
      "Acrylic 4×6 tabletop standee. Lives next to the register. Customers tap on their way out — no staff prompt needed.",
  },
  "square-card": {
    title: "Shmo Review Square Card — Sticks anywhere a counter doesn't exist.",
    description:
      "2.25-inch adhesive disc. Sticks to a door, window, dashboard, or service van. Built for mobile crews.",
  },
};

type RouteParams = { handle: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { handle: urlSlug } = await params;
  if (!isPdpSlug(urlSlug)) return {};

  const fallback = FALLBACK_META[urlSlug];
  try {
    const product = await getProductByHandle(HANDLE_MAP[urlSlug]);
    if (!product) return fallback;
    return {
      title: `${product.title} — Shmocard`,
      description: product.description?.slice(0, 200) || fallback.description,
    };
  } catch {
    return fallback;
  }
}

export default async function PdpPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { handle: urlSlug } = await params;

  if (!isPdpSlug(urlSlug)) notFound();

  const product = await getProductByHandle(HANDLE_MAP[urlSlug]);
  if (!product) notFound();

  return (
    <main>
      <PdpBuybox product={product} slug={urlSlug} />
    </main>
  );
}

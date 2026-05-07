"use client";

// components/pdp/PdpAddToCart.tsx
// Add-to-cart button. Client component.
// (Task 1 scaffold — full Server Action wiring + Zustand sync lands in
//  Task 2 of plan 03-05.)

import type { ShopifyProduct } from "@/lib/shopify/types";
import { usePdpBuybox } from "./PdpBuyboxContext";

type Props = {
  product: ShopifyProduct;
};

function formatMoney(amount: string, currencyCode: string): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${amount} ${currencyCode}`;
  if (currencyCode === "USD") return `$${n.toFixed(2)}`;
  return `${n.toFixed(2)} ${currencyCode}`;
}

export default function PdpAddToCart({ product }: Props) {
  const { selectedVariantId } = usePdpBuybox();

  const variants = product.variants.nodes;
  const selected =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null;

  const disabled = !selected || !selected.availableForSale;
  const priceLabel = selected
    ? formatMoney(selected.price.amount, selected.price.currencyCode)
    : "";

  return (
    <button
      type="button"
      className="pdp-bb__cta shm-btn shm-btn--primary shm-btn--xl"
      disabled={disabled}
    >
      {disabled
        ? "Sold out"
        : `Add to cart${priceLabel ? ` — ${priceLabel}` : ""}`}
    </button>
  );
}

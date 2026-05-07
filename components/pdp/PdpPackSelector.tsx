"use client";

// components/pdp/PdpPackSelector.tsx
// Variant / pack selector. Client component.
//
// Renders one .shm-pack-row per Shopify ProductVariant. Variant title is
// the pack label (e.g. "1 Card", "5 Cards", "10 Cards"). Price comes from
// the variant's `price.amount`.
//
// Selection lifts to PdpBuyboxContext so PdpAddToCart + PdpStickyBar can
// react. Default selection comes from the provider's defaultVariantId
// (set by PdpBuyboxColumn from the first available variant).

import { useId } from "react";
import type { ShopifyVariant } from "@/lib/shopify/types";
import { usePdpBuybox } from "./PdpBuyboxContext";

type Props = {
  variants: ShopifyVariant[];
};

function formatMoney(amount: string, currencyCode: string): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${amount} ${currencyCode}`;
  // USD only for v1 — if multi-currency lands later, swap to Intl.NumberFormat
  // keyed on currencyCode.
  if (currencyCode === "USD") return `$${n.toFixed(2)}`;
  return `${n.toFixed(2)} ${currencyCode}`;
}

export default function PdpPackSelector({ variants }: Props) {
  const groupName = useId();
  const { selectedVariantId, setSelectedVariantId } = usePdpBuybox();

  if (!variants || variants.length === 0) {
    return null;
  }

  // Single variant — no selector needed; provider already auto-selected it.
  if (variants.length === 1) {
    return null;
  }

  return (
    <fieldset className="shm-pack-rows">
      <legend className="shm-pack-rows__label">Choose your pack</legend>
      {variants.map((v) => {
        const checked = v.id === selectedVariantId;
        const disabled = !v.availableForSale;
        return (
          <label
            key={v.id}
            className="shm-pack-row"
            data-selected={checked ? "true" : "false"}
            aria-disabled={disabled || undefined}
          >
            <span className="shm-pack-row__main">
              <span className="shm-pack-row__name">
                {v.title}
                {disabled ? (
                  <span className="shm-badge shm-badge--muted">Sold out</span>
                ) : null}
              </span>
            </span>
            <span className="shm-pack-row__price">
              <span className="shm-pack-row__price-now">
                {formatMoney(v.price.amount, v.price.currencyCode)}
              </span>
            </span>
            <input
              type="radio"
              name={groupName}
              value={v.id}
              checked={checked}
              disabled={disabled}
              onChange={() => setSelectedVariantId(v.id)}
            />
          </label>
        );
      })}
    </fieldset>
  );
}

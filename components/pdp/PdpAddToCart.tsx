"use client";

// components/pdp/PdpAddToCart.tsx
// Add-to-cart button. Client component.
//
// On click:
//   1. Pre-validate selectedVariantId starts with gid://shopify/ProductVariant/
//      (server action also enforces — defense in depth, T-03-05-03)
//   2. Pre-validate qty 1..99
//   3. Call addLineToCart Server Action with optional Google review URL
//      attached as a cart-line attribute (key: 'google_review_url')
//   4. Hydrate Zustand cart store with the returned cart (cartId,
//      checkoutUrl, lines) — keeps the drawer in sync without a roundtrip
//   5. Open the cart drawer (already wired in 03-08)
//
// Errors surface inline via aria-live; the button itself shows a busy
// state while the Server Action is pending.

import { useTransition, useState } from "react";

import {
  addLineToCart,
  type CartLineAttribute,
} from "@/components/cart/actions";
import { useCartStore } from "@/components/cart/store";
import type { CartLine } from "@/components/cart/types";
import type { ShopifyProduct, ShopifyCart } from "@/lib/shopify/types";

import { usePdpBuybox } from "./PdpBuyboxContext";

type Props = {
  product: ShopifyProduct;
};

const VARIANT_GID_PREFIX = "gid://shopify/ProductVariant/";

function formatMoney(amount: string, currencyCode: string): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${amount} ${currencyCode}`;
  if (currencyCode === "USD") return `$${n.toFixed(2)}`;
  return `${n.toFixed(2)} ${currencyCode}`;
}

// Map a Shopify cart returned by the Server Action into the local
// Zustand CartLine shape (already used by the drawer in 03-08).
function shopifyCartToLines(cart: ShopifyCart): CartLine[] {
  return cart.lines.nodes.map((node) => ({
    id: node.id,
    merchandiseId: node.merchandise.id,
    productHandle: node.merchandise.product.handle,
    title: node.merchandise.product.title,
    variantTitle: node.merchandise.title,
    price: node.merchandise.price.amount,
    currencyCode: node.merchandise.price.currencyCode,
    imageUrl: node.merchandise.image?.url ?? "",
    imageAlt: node.merchandise.image?.altText ?? "",
    quantity: node.quantity,
  }));
}

export default function PdpAddToCart({ product }: Props) {
  const { selectedVariantId, qty, googleUrl } = usePdpBuybox();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const setCart = useCartStore((s) => s.setCart);
  const openDrawer = useCartStore((s) => s.open);

  const variants = product.variants.nodes;
  const selected =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null;

  const disabled =
    !selected || !selected.availableForSale || pending;

  const priceLabel = selected
    ? formatMoney(selected.price.amount, selected.price.currencyCode)
    : "";

  function handleClick() {
    setError(null);

    if (!selected) {
      setError("No variant available");
      return;
    }
    if (!selected.id.startsWith(VARIANT_GID_PREFIX)) {
      setError("Invalid variant id");
      return;
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      setError("Quantity must be 1–99");
      return;
    }

    const trimmedUrl = googleUrl.trim();
    const attributes: CartLineAttribute[] | undefined = trimmedUrl
      ? [{ key: "google_review_url", value: trimmedUrl }]
      : undefined;

    startTransition(async () => {
      try {
        const cart = await addLineToCart(selected.id, qty, attributes);
        setCart(cart.id, cart.checkoutUrl, shopifyCartToLines(cart));
        openDrawer();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to add to cart";
        setError(msg);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        className="pdp-bb__cta shm-btn shm-btn--primary shm-btn--xl"
        disabled={disabled}
        onClick={handleClick}
      >
        {pending
          ? "Adding…"
          : disabled && !pending
            ? "Sold out"
            : `Add to cart${priceLabel ? ` — ${priceLabel}` : ""}`}
      </button>
      {error ? (
        <p
          className="pdp-config__hint"
          role="alert"
          aria-live="polite"
          style={{ color: "var(--color-ember)" }}
        >
          {error}
        </p>
      ) : null}
    </>
  );
}

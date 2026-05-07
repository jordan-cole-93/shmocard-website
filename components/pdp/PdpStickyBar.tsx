"use client";

// components/pdp/PdpStickyBar.tsx
// Sticky buybox bar — slides DOWN from top once the gallery exits the
// viewport. Pure system primitive (.shm-buybox-sticky from
// components.css handles transform + transition); JS only flips
// data-visible on an IntersectionObserver.
//
// ANTI-PATTERN GUARD: do NOT add `position: fixed; bottom: 0`. The
// .shm-buybox-sticky primitive already does the right thing —
// translateY(-100%) by default, translateY(0) when [data-visible="true"].
//
// Reference: Buybox.html lines 148–161 + 386–394.

import { useEffect, useRef, useState, useTransition } from "react";

import {
  addLineToCart,
  type CartLineAttribute,
} from "@/components/cart/actions";
import { useCartStore } from "@/components/cart/store";
import type { CartLine } from "@/components/cart/types";
import type { ShopifyCart, ShopifyProduct } from "@/lib/shopify/types";

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

export default function PdpStickyBar({ product }: Props) {
  const { selectedVariantId, qty, googleUrl } = usePdpBuybox();
  const [visible, setVisible] = useState(false);
  const [pending, startTransition] = useTransition();
  const barRef = useRef<HTMLDivElement | null>(null);

  const setCart = useCartStore((s) => s.setCart);
  const openDrawer = useCartStore((s) => s.open);

  // Watch the gallery; when it exits the viewport from above, show the bar.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const gallery = document.getElementById("pdp-gallery");
    if (!gallery) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const past =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setVisible(past);
      },
      { threshold: 0 },
    );
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  const variants = product.variants.nodes;
  const selected =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null;

  const featured = product.featuredImage ?? product.images.nodes[0] ?? null;
  const priceLabel = selected
    ? formatMoney(selected.price.amount, selected.price.currencyCode)
    : "";
  const disabled =
    !selected || !selected.availableForSale || pending;

  function handleClick() {
    if (!selected) return;
    if (!selected.id.startsWith(VARIANT_GID_PREFIX)) return;
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) return;

    const trimmedUrl = googleUrl.trim();
    const attributes: CartLineAttribute[] | undefined = trimmedUrl
      ? [{ key: "google_review_url", value: trimmedUrl }]
      : undefined;

    startTransition(async () => {
      try {
        const cart = await addLineToCart(selected.id, qty, attributes);
        setCart(cart.id, cart.checkoutUrl, shopifyCartToLines(cart));
        openDrawer();
      } catch {
        // Sticky bar is the secondary CTA — silent fail here, the user
        // can scroll back to the primary CTA which surfaces errors.
      }
    });
  }

  return (
    <div
      ref={barRef}
      className="shm-buybox-sticky"
      data-visible={visible ? "true" : "false"}
      aria-hidden={visible ? "false" : "true"}
    >
      <div className="shm-container shm-buybox-sticky__inner">
        {featured?.url ? (
          <span className="shm-buybox-sticky__thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.url} alt="" />
          </span>
        ) : null}
        <span className="pdp-sticky__meta-line">
          <span className="shm-buybox-sticky__title">{product.title}</span>
          <span className="shm-buybox-sticky__meta">
            {selected
              ? `${selected.title} · ${priceLabel}`
              : "Choose a pack"}
          </span>
        </span>
        <button
          type="button"
          className="shm-buybox-sticky__cta shm-btn shm-btn--primary"
          disabled={disabled}
          onClick={handleClick}
        >
          {pending ? "Adding…" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

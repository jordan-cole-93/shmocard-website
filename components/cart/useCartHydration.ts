"use client";

// useCartHydration — first-mount cart sync from cookie → Zustand store.
//
// Cart Persistence Trap mitigation (RESEARCH.md Pitfall 6):
//   The httpOnly `shm-cart-id` cookie is the source of truth. On first
//   client mount we ask the server (via `getCartFromCookie` Server Action)
//   for the live Storefront cart and dispatch its identity + lines into
//   Zustand. The store's `partialize` only persists UI state (`isOpen`),
//   so there is nothing stale to clear — but we still call `clear()` to
//   guarantee a clean baseline before applying the server snapshot in
//   case a previous version of the app left lines in localStorage.
//
// Runs exactly ONCE per page lifecycle. Subsequent cart mutations route
// through Server Actions that return the live cart, and components call
// `setCart` with that response — this hook does NOT re-fetch on its own.

import { useEffect, useRef } from "react";

import { getCartFromCookie } from "./actions";
import { useCartStore } from "./store";
import type { CartLine } from "./types";
import type { ShopifyCart, ShopifyCartLine } from "@/lib/shopify/types";

function mapShopifyLine(line: ShopifyCartLine): CartLine {
  const m = line.merchandise;
  return {
    id: line.id,
    merchandiseId: m.id,
    productHandle: m.product.handle,
    title: m.product.title,
    variantTitle: m.title === "Default Title" ? "" : m.title,
    price: m.price.amount,
    currencyCode: m.price.currencyCode,
    imageUrl: m.image?.url ?? "",
    imageAlt: m.image?.altText ?? m.product.title,
    quantity: line.quantity,
  };
}

export function mapShopifyCartLines(cart: ShopifyCart): CartLine[] {
  return cart.lines.nodes.map(mapShopifyLine);
}

export function useCartHydration(): void {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    // Wipe any localStorage entries from a previous version of the
    // store that DID persist cart data (Cart Persistence Trap defense
    // in depth — even though current store no longer uses persist).
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("shm-cart");
        localStorage.removeItem("shm-cart-ui");
      }
    } catch {
      /* ignore */
    }

    let cancelled = false;

    (async () => {
      try {
        const cart = await getCartFromCookie();
        if (cancelled) return;

        if (!cart) {
          // No cookie OR Shopify expired the cart — start clean.
          useCartStore.getState().setCart(null, null, []);
          return;
        }

        const lines = mapShopifyCartLines(cart);
        useCartStore
          .getState()
          .setCart(cart.id, cart.checkoutUrl, lines);
      } catch {
        // Silent: hydration failure shouldn't block the page render.
        // The user can still browse; cart actions will surface errors.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
}

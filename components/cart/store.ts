// Cart store — Zustand + localStorage persist (D-01).
//
// Local source of truth for the cart drawer. Holds line items and the
// Shopify cart GID once a cart has been created via Storefront API
// (set in the 3-Shopify stage). All mutations are optimistic —
// the cart drawer reads from this store, then a separate sync layer
// (TBD in 3-Shopify) reconciles to the Shopify cart.
//
// SSR note: Next.js App Router renders server-side first. The persist
// middleware reads localStorage on mount, so consumers must guard
// against hydration mismatch. Use a `useHydrated()` hook (added with
// the cart drawer) or `useStore.persist.hasHydrated()` before reading
// `lines` in render.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine } from "./types";

type CartState = {
  /** Shopify cart GID. Null until the first line is added. */
  cartId: string | null;
  /** Shopify-hosted checkout URL. Null until cart is created. */
  checkoutUrl: string | null;
  lines: CartLine[];
};

type CartActions = {
  setCart: (cartId: string, checkoutUrl: string) => void;
  addLine: (line: CartLine) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
};

type CartStore = CartState & CartActions;

const INITIAL_STATE: CartState = {
  cartId: null,
  checkoutUrl: null,
  lines: [],
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setCart: (cartId, checkoutUrl) => set({ cartId, checkoutUrl }),

      addLine: (line) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.merchandiseId === line.merchandiseId,
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.id === existing.id
                  ? { ...l, quantity: l.quantity + line.quantity }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, line] };
        }),

      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.id !== lineId)
              : state.lines.map((l) =>
                  l.id === lineId ? { ...l, quantity } : l,
                ),
        })),

      removeLine: (lineId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.id !== lineId),
        })),

      clear: () => set(INITIAL_STATE),
    }),
    {
      name: "shm-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        lines: state.lines,
      }),
    },
  ),
);

// Selectors — keep render-time reads cheap by subscribing to a slice.
export const selectLineCount = (s: CartStore): number =>
  s.lines.reduce((n, l) => n + l.quantity, 0);

export const selectSubtotal = (s: CartStore): number =>
  s.lines.reduce((n, l) => n + Number(l.price) * l.quantity, 0);

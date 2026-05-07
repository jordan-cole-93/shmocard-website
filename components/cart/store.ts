// Cart store — Zustand for presentational + UI state ONLY (D-01 + Pitfall 6).
//
// SOURCE OF TRUTH:
//   - `cartId` lives in the httpOnly `shm-cart-id` cookie set by Server
//     Actions in `components/cart/actions.ts`. The browser never sees it.
//   - `lines` come from the Storefront `cart` query on every fresh mount
//     via `useCartHydration` → `getCartFromCookie`.
//
// THIS STORE:
//   - Presentational mirror of `lines` (so the drawer can render
//     optimistically without round-tripping every interaction).
//   - UI state: `isOpen` (drawer drawer animation), nothing else worth
//     persisting across reloads.
//
// CART PERSISTENCE TRAP MITIGATION (RESEARCH.md Pitfall 6):
//   - `partialize` returns ONLY `{ isOpen }` — never `lines`, never
//     `cartId`, never `checkoutUrl`. Stale display data rehydrating
//     before the cookie hydration fires would silently leak prices /
//     variants that no longer match Shopify reality.
//   - `cartId` and `checkoutUrl` live in-memory only — they get
//     populated by `useCartHydration` on first client mount via the
//     server cart query, and replaced on every cart mutation.
//
// Reference: RESEARCH.md Pitfall 6, plan 03-08 task 1.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine } from "./types";

/** Free-shipping unlock threshold in USD. Configurable in one place. */
export const FREE_SHIP_THRESHOLD_USD = 50;

type CartState = {
  /** Shopify cart GID. Hydrated from server on mount; not persisted. */
  cartId: string | null;
  /** Shopify-hosted checkout URL. Hydrated from server on mount; not persisted. */
  checkoutUrl: string | null;
  /** Cart line items. Hydrated from server on mount; not persisted. */
  lines: CartLine[];
  /** Drawer open/closed. Persisted across reloads. */
  isOpen: boolean;
};

type CartActions = {
  /** Replace cart identity + lines wholesale (post-mutation reconcile). */
  setCart: (
    cartId: string | null,
    checkoutUrl: string | null,
    lines?: CartLine[],
  ) => void;
  /** Replace just the line list — used by hydration + after mutations. */
  replaceLines: (lines: CartLine[]) => void;
  addLine: (line: CartLine) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  /** Drawer controls. */
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Wipe everything — used when cookie disappears server-side. */
  clear: () => void;
};

type CartStore = CartState & CartActions;

const INITIAL_STATE: CartState = {
  cartId: null,
  checkoutUrl: null,
  lines: [],
  isOpen: false,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setCart: (cartId, checkoutUrl, lines) =>
        set((state) => ({
          cartId,
          checkoutUrl,
          lines: lines ?? state.lines,
        })),

      replaceLines: (lines) => set({ lines }),

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

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      clear: () => set(INITIAL_STATE),
    }),
    {
      name: "shm-cart-ui",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      // ⚠ Cart Persistence Trap mitigation:
      //   ONLY UI state survives reloads. cartId/checkoutUrl/lines come
      //   from the server (cookie + Storefront) on every fresh mount.
      partialize: (state) => ({
        isOpen: state.isOpen,
      }),
    },
  ),
);

// Convenience hooks — components should subscribe to the slice they need.
export const useCart = useCartStore;

// Selectors — keep render-time reads cheap by subscribing to a slice.
export const selectLineCount = (s: CartStore): number =>
  s.lines.reduce((n, l) => n + l.quantity, 0);

export const selectSubtotal = (s: CartStore): number =>
  s.lines.reduce((n, l) => n + Number(l.price) * l.quantity, 0);

export const selectIsOpen = (s: CartStore): boolean => s.isOpen;

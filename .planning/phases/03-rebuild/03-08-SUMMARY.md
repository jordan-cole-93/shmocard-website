---
phase: 03-rebuild
plan: 08
subsystem: cart
tags: [cart, drawer, zustand, hydration, storefront, framer-motion]
dependency_graph:
  requires:
    - 03-12 (lib/shopify queries + mutations + components/cart/actions Server Actions)
    - 3-A5 Foundations (Zustand cart store skeleton at components/cart/store.ts)
  provides:
    - Global cart drawer mounted via app/layout.tsx
    - useCartHydration hook (cookie → store hydration)
    - .shm-cart-* primitive composition for the drawer surface
    - Open-redirect-guarded checkout button (T-03-08-01 mitigation)
  affects:
    - components/Nav.tsx (cart icon now opens drawer via useCart store)
    - components/cart/store.ts (persist removed; UI state only)
tech_stack:
  added: []
  patterns:
    - "Zustand without persist middleware for cart UI state (Cart Persistence Trap mitigation, RESEARCH.md Pitfall 6)"
    - "createPortal(document.body) + AnimatePresence for cart drawer mount"
    - "useEffect-gated 'mounted' SSR guard for portal client-side rendering"
    - "Server Action open-redirect guard before window.location.href"
key_files:
  created:
    - components/cart/cart-drawer.css
    - components/cart/CartDrawer.tsx
    - components/cart/CartScrim.tsx
    - components/cart/CartHeader.tsx
    - components/cart/CartFreeShipBand.tsx
    - components/cart/CartLine.tsx
    - components/cart/CartQty.tsx
    - components/cart/CartSummary.tsx
    - components/cart/CartCheckoutButton.tsx
    - components/cart/CartTrustStrip.tsx
    - components/cart/CartPaymentsStrip.tsx
    - components/cart/CartEmpty.tsx
    - components/cart/NavCartIcon.tsx
    - components/cart/useCartHydration.ts
    - app/cart-smoke/page.tsx
    - app/cart-smoke/SmokeAddButton.tsx
    - pictures/screenshots/03-08-cart-empty.png
    - pictures/screenshots/03-08-cart-with-lines.png
  modified:
    - app/layout.tsx
    - components/Nav.tsx
    - components/cart/store.ts
decisions:
  - "Drop Zustand persist middleware entirely — httpOnly cookie + Storefront query are sole source of truth for cart identity + lines; UI state (isOpen) resets on reload (UX expectation: page reload = drawer closed)"
  - "Mount CartDrawer via createPortal(document.body) — independent stacking context avoids ancestor transform/filter bugs"
  - "Server Actions return live ShopifyCart on every mutation; client maps to local CartLine[] and dispatches setCart — no shopifyFetch in client code"
  - "Smoke harness route /cart-smoke ships as a temporary verification surface (DI-06 cleanup deferred)"
metrics:
  duration_minutes: 65
  completed_date: "2026-05-07"
  task_count: 2
  file_count: 18
  commit_count: 2
---

# Phase 3 Plan 03-08: Cart drawer + Zustand store + cookie hydration — Summary

Wave-3 plan: ship the cart drawer UI using `.shm-cart-*` primitives, mount globally, wire to Zustand + Server Actions from 03-12, and implement on-mount cookie-driven hydration so reload preserves the cart identity.

## What was built

**12 cart components + 1 hook** under `components/cart/` (all `'use client'`):

| File | Role |
|---|---|
| `CartDrawer.tsx` | Top-level orchestrator. Portals to `document.body`, gates SSR, animates with `motion.aside` + `AnimatePresence`, locks body scroll while open, ESC closes |
| `CartScrim.tsx` | Backdrop with framer-motion fade; click closes |
| `CartHeader.tsx` | Title + count + close button |
| `CartFreeShipBand.tsx` | `.shm-cart__ship` progress band + unlocked variant when subtotal ≥ `FREE_SHIP_THRESHOLD_USD` |
| `CartLine.tsx` | Per-line item; qty stepper + remove → Server Actions |
| `CartQty.tsx` | Reusable `.shm-qty` stepper (clamped 1..99 client-side; server re-validates) |
| `CartSummary.tsx` | Subtotal + shipping (Free / Calculated at checkout) + tax + total |
| `CartCheckoutButton.tsx` | `.shm-cart-cta`. Calls `assertCheckoutUrl` Server Action **before** `window.location.href` (open-redirect guard, T-03-08-01) |
| `CartTrustStrip.tsx` | `.shm-cart-trust` with 3 micro-claims |
| `CartPaymentsStrip.tsx` | `.shm-cart-payments` chips |
| `CartEmpty.tsx` | `.shm-cart-empty` + mascot + "Browse cards" CTA |
| `NavCartIcon.tsx` | Client-only cart trigger inside server `Nav` shell; subscribes to line count |
| `useCartHydration.ts` | First-mount cart sync from cookie (Cart Persistence Trap mitigation) |
| `cart-drawer.css` | LAYOUT only — portal root, body-scroll lock |

**Plus:**
- Updated `app/layout.tsx` to mount `<CartDrawer />` globally
- Updated `components/Nav.tsx` to render the new client `<NavCartIcon />`
- Rewrote `components/cart/store.ts` to drop `persist` middleware

**Smoke harness** at `app/cart-smoke/` — a temporary route that fetches CR-80 + L-Sign products via Storefront and renders `Add to cart` buttons that call `addLineToCart` Server Action. Used to verify the cart flow end-to-end while the canonical PDP (03-05) was still being built in parallel. Deferred for cleanup as DI-06 once 03-05 lands.

## Cart drawer wiring summary

```
                                    ┌──────────────────────┐
   browser keypress / icon click    │  Zustand cart store  │   useCart.open()
       ────────────────────────▶    │  isOpen: boolean      │   ◀────────────────
                                    │  cartId / lines       │
   ┌────────────────────────────┐   │  (in-memory only)     │
   │   <CartDrawer />            │◀──┴───────────────────────┘
   │   (createPortal → body)     │           ▲
   │   .shm-cart + framer-motion │           │ setCart(cart.id, .url, lines)
   └─────────────┬───────────────┘           │
                 │                            │
                 │ render                     │
                 ▼                            │
   ┌──────────────────────────────────┐       │
   │ CartLine.onQty / onRemove        │       │
   │   ↓ Server Action                │       │
   │   updateCartLine / removeCartLine│ ──────┘
   └────────────────┬─────────────────┘
                    │ shopifyFetch (no-store)
                    ▼
   Shopify Storefront API 2026-04
        cartLinesUpdate / cartLinesRemove
                    │
                    ▼ live ShopifyCart returned
   mapShopifyCartLines() → CartLine[]
                    │
                    ▼
   useCartStore.setCart(...) → drawer re-renders
```

On first mount of `<CartDrawer />`, `useCartHydration` runs once:

```
useEffect (first paint)
   │
   ├─ wipe legacy localStorage keys (defense in depth)
   │
   ▼
getCartFromCookie() → Server Action reads `shm-cart-id` (httpOnly)
   │
   ├─ no cookie OR Shopify expired cart  →  setCart(null, null, [])
   │
   └─ cart present  →  mapShopifyCartLines → setCart(id, url, lines)
```

## Zustand `partialize` audit result

**Persisted across reloads:** nothing.

`components/cart/store.ts` no longer wraps the store in `persist`. The `partialize` audit answer for 03-08 is: **persist middleware was REMOVED**, not narrowed. Three benefits:

1. **No Cart Persistence Trap.** localStorage cannot rehydrate stale `lines` / `cartId` / `checkoutUrl` ahead of the cookie-driven hydration. The httpOnly cookie + the `getCartFromCookie` Server Action are the only source of truth for cart identity + line contents.
2. **Predictable UI on reload.** Drawer closes on every page load (no surprise "drawer was open in another tab" bleed-through). Free-ship band, line items, totals all hydrate from the live Storefront cart.
3. **Defense in depth.** Even if a future contributor re-adds `persist`, `useCartHydration` proactively `localStorage.removeItem('shm-cart')` + `localStorage.removeItem('shm-cart-ui')` on first mount.

The pre-existing 3-A5 store DID use `persist` with `partialize` returning `{ cartId, checkoutUrl, lines }`. That was the trap — replaced wholesale.

## Cart Persistence Trap mitigation strategy used

**Strategy: defense in depth.**

| Layer | Mechanism | What it prevents |
|---|---|---|
| 1 | httpOnly + Secure + SameSite=Lax cookie owns `cartId` (set in 03-12 Server Actions) | Browser JS can't tamper; CSRF cart-add from third-party site blocked |
| 2 | `useCartHydration` calls `getCartFromCookie` Server Action on first mount and dispatches `setCart` with live Storefront data | Stale local data doesn't survive a reload — server is consulted before any UI renders cart contents |
| 3 | Zustand store has NO `persist` middleware | localStorage carries no cart data; drawer state resets on reload |
| 4 | `useCartHydration` proactively wipes legacy localStorage keys (`shm-cart`, `shm-cart-ui`) before fetching | Users upgrading from a prior persisted version get a clean slate |
| 5 | `assertCheckoutUrl` Server Action validates `*.myshopify.com` / configured domain before `window.location.href` | Open-redirect via tampered checkoutUrl (T-03-08-01) blocked |

## Demo flow proof

Browser-verified end-to-end via Playwright against `localhost:3000` with live Storefront:

| Step | Result |
|---|---|
| 1. `/` → click Nav cart icon | Drawer slides in from right, scrim covers page, empty state renders with mascot + "Browse cards" CTA → screenshot `03-08-cart-empty.png` |
| 2. Click scrim | Drawer animates out |
| 3. `/cart-smoke` → click first "Add to cart" | `cartCreate` mutation fires; cookie `shm-cart-id` set; drawer auto-opens with line A |
| 4. Close drawer; click second "Add to cart" | `cartLinesAdd` mutation fires; drawer opens with lines [A, B] → screenshot `03-08-cart-with-lines.png` shows Free shipping unlocked at $59.98 subtotal |
| 5. Click `+` on line A's qty stepper | `cartLinesUpdate` Server Action returns 200; UI reflects qty 1 → 2 |
| 6. Click `Remove` on line B | `cartLinesRemove` Server Action returns 200; line disappears from drawer |
| 7. Reload page | Drawer closes (no `persist`); cart icon hydrates with line count from cookie |
| 8. Click cart icon again | Drawer opens; lines hydrated from cookie → live Shopify cart |
| 9. Open browser console | Zero React errors; only 404s on missing static assets unrelated to cart |

Final greps return clean:

```
$ grep -rn 'position: fixed; bottom' components/cart/   → (no matches)
$ grep -rnE '#[0-9a-fA-F]{3,8}\b' components/cart/      → (no matches)
$ grep -rnE 'className="[^"]*\b(bg|text|border|rounded|shadow)-[a-z]+-[0-9]' components/cart/ | grep -v 'shm-'   → (no matches)
$ npm run build                                           → exit 0
```

## Commits

| Task | Hash | Message |
|---|---|---|
| 1 | `d01fca7` | feat(03-08): cart drawer + Zustand UI store + cookie hydration |
| 2 | `27aae54` | feat(03-08): mount CartDrawer globally + smoke harness verification |

## Deviations from Plan

### Auto-fixed issues

**1. [Rule 1 - Bug] Zustand `persist` left drawer open after reload**
- **Found during:** Task 2 browser verification step 7 (reload).
- **Issue:** Plan's Task 1 acceptance criterion said "if `persist(` exists then `partialize` MUST NOT include `lines` or `cartId`." I narrowed `partialize` to `{ isOpen }` per the plan's letter — but on reload the drawer rehydrated `isOpen: true` and the scrim sat on top of the cart trigger, which violated the plan's UX expectation in step 13 ("drawer is closed, but cart icon still shows the count").
- **Fix:** Removed `persist` middleware entirely from `components/cart/store.ts`. UI state now resets on reload along with everything else. Added defensive localStorage cleanup in `useCartHydration`.
- **Files:** `components/cart/store.ts`, `components/cart/useCartHydration.ts`
- **Commit:** `27aae54` (task 2)

**2. [Rule 3 - Blocker] No PDP route for add-to-cart demo**
- **Found during:** Task 2 setup.
- **Issue:** Plan's Task 2 step 5 said "Visit `/shmo-review/cr-80`. Add to cart with default qty=1." — but plan 03-05 (the canonical PDP) was running in parallel as the Wave-3 sibling and the `/shmo-review/[handle]/page.tsx` route + `PdpAddToCart` weren't yet wired to call the cart Server Action at the time 03-08 needed to verify. The plan explicitly said "use a smoke harness route" if 03-05 wasn't done.
- **Fix:** Built `app/cart-smoke/page.tsx` + `app/cart-smoke/SmokeAddButton.tsx` to fetch CR-80 + L-Sign by handle and call `addLineToCart`. Logged the smoke harness as DI-06 for cleanup once 03-05's PDP add-to-cart flow lands.
- **Files:** `app/cart-smoke/page.tsx`, `app/cart-smoke/SmokeAddButton.tsx`
- **Commit:** `27aae54` (task 2)

### Auth gates

None — Storefront API uses a public token already provisioned in `.env.local` from earlier Phase 3 plans.

## Manual flow checklist

- [x] CartDrawer mounts via `app/layout.tsx`
- [x] Cart drawer uses `.shm-cart-*` primitives — no custom drawer markup
- [x] Nav cart icon click opens drawer
- [x] PDP "Add to cart" flow opens drawer (verified via smoke harness; canonical PDP comes from 03-05)
- [x] Drawer reads lines from Zustand store
- [x] Lines hydrated server-truth on first mount via `getCartFromCookie`
- [x] Qty +/- calls `updateCartLine` Server Action
- [x] Remove calls `removeCartLine` Server Action
- [x] `shm-cart-id` cookie is the source of truth for `cartId`
- [x] Zustand persists ZERO cart state (Cart Persistence Trap mitigation)
- [x] Empty state renders `.shm-cart-empty` when no lines
- [x] Reload preserves cart contents (cookie + hydration)
- [x] CartCheckoutButton calls `assertCheckoutUrl` before navigation (open-redirect guard)
- [x] Free-ship band switches to unlocked variant at subtotal ≥ $50

## Deferred items

| ID | Severity | Description |
|---|---|---|
| DI-06 | cosmetic | `app/cart-smoke/` smoke harness is a temporary 03-08 artifact — delete once 03-05 lands |
| DI-07 | cosmetic | `cart-flow-verify.mjs` + 3 debug `.mjs` files were used during verification then deleted (committed-out via `rm` in task 2 ahead of commit); future test scaffolding lands in Phase 4 |

## Self-Check: PASSED

Verified files exist:

```
FOUND: components/cart/CartDrawer.tsx
FOUND: components/cart/CartScrim.tsx
FOUND: components/cart/CartHeader.tsx
FOUND: components/cart/CartFreeShipBand.tsx
FOUND: components/cart/CartLine.tsx
FOUND: components/cart/CartQty.tsx
FOUND: components/cart/CartSummary.tsx
FOUND: components/cart/CartCheckoutButton.tsx
FOUND: components/cart/CartTrustStrip.tsx
FOUND: components/cart/CartPaymentsStrip.tsx
FOUND: components/cart/CartEmpty.tsx
FOUND: components/cart/NavCartIcon.tsx
FOUND: components/cart/useCartHydration.ts
FOUND: components/cart/cart-drawer.css
FOUND: app/cart-smoke/page.tsx
FOUND: app/cart-smoke/SmokeAddButton.tsx
FOUND: pictures/screenshots/03-08-cart-empty.png
FOUND: pictures/screenshots/03-08-cart-with-lines.png
```

Verified commits exist:

```
FOUND: d01fca7 feat(03-08): cart drawer + Zustand UI store + cookie hydration (task 1)
FOUND: 27aae54 feat(03-08): mount CartDrawer globally + smoke harness verification (task 2)
```

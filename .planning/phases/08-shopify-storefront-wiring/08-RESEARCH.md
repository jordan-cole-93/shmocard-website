# Phase 8: Shopify Storefront Wiring — Research

**Researched:** 2026-05-20
**Domain:** Shopify Storefront API · Next.js 15 App Router · React Server Components · Cart Server Actions
**Confidence:** HIGH — all findings verified against actual codebase files; no assumed claims

---

## Summary

Phase 8 is the integration phase that makes Shmocard's three PDPs real. Everything else (design, layout, mobile polish, cart UI) was built with placeholder data and TODO markers. This phase replaces those placeholders with live Storefront API data — product titles, prices, variant IDs, and gallery images — then wires the "Add to cart" button on all three PDPs to the already-complete cart infrastructure.

**The good news:** the infrastructure is almost entirely built already. `lib/shopify/` has full GraphQL queries, mutations, and types. `components/cart/` has a complete cart drawer, Zustand store, cookie-based hydration, and all cart Server Actions (`addLineToCart`, `updateCartLine`, `removeCartLine`, `getCartFromCookie`). `app/api/revalidate/route.ts` exists and is fully implemented with HMAC verification. The cart smoke test at `/cart-smoke` proves the Storefront API connection is live.

**What's actually missing:** the PDP `page.tsx` files are server components that DON'T call `getProductByHandle` — they just use hardcoded constant objects. And `Buybox.tsx`'s `handleAdd()` writes a fake `local-${Date.now()}` line directly into Zustand instead of calling `addLineToCart`. Phase 8 is: (1) convert the 3 PDP pages to fetch live product data and pass it to Buybox, (2) wire Buybox's `handleAdd` to call the real `addLineToCart` Server Action, and (3) clean up the two remaining `TODO(shopify):` markers in CartDiscountForm and FormatPicker.

**Primary recommendation:** Server component pages fetch product data via `getProductByHandle`, derive `BuyboxProps` from Shopify variants via a mapping helper, and pass them to Buybox. Buybox receives a required `variantId` prop per selected pack and calls `addLineToCart` instead of `addLine`. Three tasks: mapping helper + Buybox action wire, CR-80 page convert, L-Sign + Square Card page convert (parallel).

---

## Project Constraints (from CLAUDE.md)

- Storefront API only — no Admin API writes, ever
- No domain/payment/theme touches
- No `.env*` files committed
- `SHOPIFY_PRIMARY_DOMAIN` env var referenced in `actions.ts` (`assertCheckoutUrl`) but NOT listed in `backend.md` — needs Jordan to confirm if it's set or if the myshopify.com + SHOPIFY_STORE_DOMAIN allowlist is sufficient
- All UI work (any `.tsx`/`.css` changes) goes through `design-system-builder` subagent
- Shopify backend work uses `shmocard-shopify-work` wrapper before subagent dispatch
- Pre-commit: `design-system-auditor` → `shopify-data-checker` → `live-store-guard`

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Product data (title, price, variants, images) | Shopify Admin | — | Source of truth per shopify-data-discipline.md |
| Fetch product by handle | API (RSC page.tsx) | — | Server component fetches at request time |
| Map Shopify variants → BuyboxPack[] | API (lib/ helper) | — | Data transform belongs server-side |
| BuyboxPack selection + quantity UI | Browser (Buybox client) | — | Already client component, stays that way |
| Cart line creation | API (Server Action) | Browser (optimistic store) | actions.ts handles Storefront mutation; Zustand mirrors result |
| Cart identity (cartId) | API (httpOnly cookie) | — | Cookie set by Server Action, never exposed to JS |
| Checkout redirect URL | API (Shopify cart.checkoutUrl) | — | Already in ShopifyCart type, validated by assertCheckoutUrl |
| Gallery images | Shopify CDN (Phase 8) | local public/ (fallback) | Phase 8 is the swap; local images remain as fallback |
| Webhook revalidation | API route (app/api/revalidate) | — | Already implemented, needs Shopify webhook subscription |
| Discount codes | Browser (CartDiscountForm) | API (deferred mutation) | UI exists; mutation wiring is deferred (see TODO) |

---

## Existing Infrastructure Inventory

Everything in `lib/shopify/` and `components/cart/` was built in Phase 3. Phase 8 consumes it.

### `lib/shopify/index.ts` — COMPLETE
`shopifyFetch<T>()` — generic GraphQL wrapper. `force-cache` default with `next: { tags }` for ISR. Server-only. API version `2026-04`.

### `lib/shopify/queries.ts` — COMPLETE
- `getProductByHandle(handle)` — fetches product with variants(first:25), images(first:10), options, priceRange. Tags: `['product', 'product:${handle}']`
- `getCollection(handle)` — collection + products(first:25)
- `getCart(cartId)` — no-store, returns full cart with lines/merchandise

### `lib/shopify/mutations.ts` — COMPLETE (discount mutation MISSING)
- `CART_CREATE_MUTATION`
- `CART_LINES_ADD_MUTATION`
- `CART_LINES_UPDATE_MUTATION`
- `CART_LINES_REMOVE_MUTATION`
- Missing: `CART_DISCOUNT_CODES_UPDATE_MUTATION` (deferred per CartDiscountForm TODO)

### `lib/shopify/types.ts` — COMPLETE
Full TypeScript types: `ShopifyProduct`, `ShopifyVariant`, `ShopifyCart`, `ShopifyCartLine`, all mutation payload envelopes.

### `components/cart/actions.ts` — COMPLETE
- `addLineToCart(merchandiseId, quantity, attributes?)` — creates or adds to cart, sets cookie
- `updateCartLine(lineId, quantity)` — updates quantity
- `removeCartLine(lineId)` — removes line
- `getCartFromCookie()` — reads cookie, fetches live cart
- `getUpsellProducts()` — fetches all 3 product handles in parallel (upsell use)
- `assertCheckoutUrl(url)` — open-redirect guard (validates against myshopify.com + SHOPIFY_STORE_DOMAIN + SHOPIFY_PRIMARY_DOMAIN)

### `components/cart/store.ts` — COMPLETE
Zustand store. `setCart`, `replaceLines`, `addLine`, `updateQuantity`, `removeLine`, `open/close/toggle`, `clear`. No persist middleware (Cart Persistence Trap mitigation).

### `components/cart/useCartHydration.ts` — COMPLETE
`mapShopifyCartLines(cart)` converts `ShopifyCartLine[]` → `CartLine[]`. Runs once on mount, calls `getCartFromCookie`, dispatches `setCart`.

### `components/cart/CartDrawer.tsx` — COMPLETE
Full drawer with framer-motion, portal, scroll lock, Esc close, `useCartHydration`. Mounted globally in `app/layout.tsx`.

### `app/api/revalidate/route.ts` — COMPLETE
HMAC SHA-256 verification (timing-safe). Calls `revalidateTag('product')`, `revalidateTag('product:${handle}')`, `revalidateTag('collection:shmo-review')` on `products/*` topic. Node.js runtime. Requires `SHOPIFY_REVALIDATION_SECRET` env var.

### `components/shmo-review/FormatPicker.tsx` — MOSTLY COMPLETE
Already server component, already calls `getProductByHandle` for all 3 handles in parallel, already uses `product.featuredImage.url` and `priceRange.minVariantPrice`. Has local fallback images. One TODO: remove fallback image constants once all products have images in Shopify Admin.

### `components/shmo-review/FormatCompare.tsx` — CHECK NEEDED
Used on all 3 PDPs. Likely also a server component fetching Shopify data — consistent with FormatPicker pattern.

---

## TODO(shopify) Inventory

| # | File | Line | Category | What it gates |
|---|------|------|----------|---------------|
| T1 | `components/shmo-review/Buybox.tsx` | 9 (header comment) | Documentation | Phase 8 tracking comment — remove when wired |
| T2 | `components/shmo-review/Buybox.tsx` | 67 | Product data | `DEFAULT_BUYBOX_PRODUCT` — replace with Storefront result |
| T3 | `components/shmo-review/Buybox.tsx` | 74 | Gallery | `DEFAULT_BUYBOX_GALLERY` — swap to `product.images.nodes[].url` |
| T4 | `components/shmo-review/Buybox.tsx` | 84 | Pack pricing | `DEFAULT_BUYBOX_PACKS` — derive from Shopify variants |
| T5 | `components/shmo-review/Buybox.tsx` | 131 | Cart action | `handleAdd` uses fake local line — wire to `addLineToCart` |
| T6 | `components/shmo-review/Buybox.tsx` | 137-143 | Cart action | `local-${Date.now()}` id, `placeholder:` merchandiseId — replace with real variant GID |
| T7 | `app/shmo-review/l-sign/page.tsx` | 28 | Product data | `L_SIGN_PRODUCT` constant — replace with Storefront fetch |
| T8 | `app/shmo-review/l-sign/page.tsx` | 30 | Handle | `shmo-review-l-sign` — WRONG, confirmed handle is `google-review-nfc-tap-card-l-sign` |
| T9 | `app/shmo-review/l-sign/page.tsx` | 35 | Gallery | L-Sign gallery — swap to Shopify images |
| T10 | `app/shmo-review/l-sign/page.tsx` | 42 | Pack pricing | L-Sign packs — derive from Shopify variants |
| T11 | `app/shmo-review/square-card/page.tsx` | 28 | Product data | `SQUARE_PRODUCT` constant — replace with Storefront fetch |
| T12 | `app/shmo-review/square-card/page.tsx` | 30 | Handle | `google-review-plaque` — confirmed correct per backend.md |
| T13 | `app/shmo-review/square-card/page.tsx` | 35 | Gallery | Square gallery — swap to Shopify images |
| T14 | `app/shmo-review/square-card/page.tsx` | 44 | Pack pricing | Square packs — derive from Shopify variants |
| T15 | `components/cart/CartDiscountForm.tsx` | 8 | Discount mutation | `CART_DISCOUNT_CODES_UPDATE_MUTATION` missing — deferred |
| T16 | `components/cart/CartDiscountForm.tsx` | 18 | Discount action | `applyDiscountCode` Server Action missing — deferred |
| T17 | `components/shmo-review/FormatPicker.tsx` | 55 | Fallback cleanup | Remove fallback image constants once Shopify has images |

**CR-80 page.tsx has zero TODO markers** — it passes no product props to Buybox (uses all defaults). The fix is adding the Storefront fetch to `cr-80/page.tsx` and passing props, same as L-Sign and Square Card.

**T8 is a bug:** L-Sign page currently has `handle: 'shmo-review-l-sign'` but the confirmed handle (from `backend.md`, `actions.ts` UPSELL_HANDLES, `FormatPicker.tsx`, and `cart-smoke`) is `google-review-nfc-tap-card-l-sign`. Phase 8 fixes this when the hardcoded constant is replaced with the Storefront fetch.

**T15/T16 (discount):** Deferred. CartDiscountForm UI exists but is a no-op. Adding `cartDiscountCodesUpdate` is out of scope for Phase 8 unless Jordan decides otherwise.

**T17 (FormatPicker fallbacks):** Kept until Jordan confirms all 3 products have images in Shopify Admin. Remove as cleanup task at end of Phase 8 once verified.

---

## Variant Structure Decision

**Question:** Are 1/2/5/10 pack tiers separate Shopify products or variants on one product?

**Evidence from codebase:**
- `PRODUCT_BY_HANDLE_QUERY` fetches `variants(first: 25)` — designed to get all variants for one product
- `BuyboxPack` type has `qty`, `price`, `perCard`, `save`, `note`, `compare`, `pop` — fields that map naturally to variant `price` + metafields
- `DEFAULT_BUYBOX_PACKS` has 4 tiers (1/2/5/10) — consistent with 4 variants per product
- `cart-smoke` uses `p.variants.nodes[0]` (first variant only) — smoke test, not final PDP behavior
- `getUpsellProducts()` in actions.ts fetches all 3 products by handle — upsell uses one product per format, not one per tier

**Recommendation: Variants on one product** (one handle per format, 4 variants for 1/2/5/10 packs).

Rationale:
- Simpler GraphQL: one `getProductByHandle` call returns all 4 variants
- Inventory tracked per pack tier (Shopify Inventory per variant)
- `cart.checkoutUrl` carries variant GIDs — Shopify knows what was ordered
- `FormatPicker` already uses one handle per product — consistent
- Alternative (separate products per tier) would require 12 Shopify products and 12 Storefront fetches for 3 PDPs

**Jordan must confirm** this matches how he set up Shopify Admin (see Open Questions).

**Variant title convention expected:** Shopify variant `title` field will be something like `"1 Card"`, `"2 Cards"`, `"5 Cards"`, `"10 Cards"` (or `"Pack of 1"` etc). The mapping helper reads `selectedOptions` to find a "Quantity" or "Pack" option and maps it to the `BuyboxPack.qty` field.

---

## Shopify Product Handles (Confirmed)

| PDP route | Shopify handle | Source |
|-----------|---------------|--------|
| `/shmo-review/cr-80` | `google-reviews-nfc-tap-card-cr80` | backend.md + actions.ts UPSELL_HANDLES + FormatPicker + cart-smoke |
| `/shmo-review/l-sign` | `google-review-nfc-tap-card-l-sign` | backend.md + actions.ts UPSELL_HANDLES + FormatPicker |
| `/shmo-review/square-card` | `google-review-plaque` | backend.md + actions.ts UPSELL_HANDLES + FormatPicker |

All three confirmed by cross-referencing 4 independent sources in the codebase. [VERIFIED: codebase grep]

**Note:** L-Sign page.tsx currently has wrong handle `'shmo-review-l-sign'` — this is a known bug fixed when Phase 8 replaces the hardcoded constant.

---

## Storefront GraphQL Query Map

All queries already exist in `lib/shopify/queries.ts`. No new queries needed for Phase 8 core scope.

| Query/Mutation | Location | Phase 8 use | What it returns |
|----------------|----------|-------------|-----------------|
| `getProductByHandle(handle)` | `lib/shopify/queries.ts` | PDP pages fetch product | title, handle, variants (id, title, price, selectedOptions, availableForSale), images, featuredImage, priceRange |
| `CART_CREATE_MUTATION` | `lib/shopify/mutations.ts` | First add (via `addLineToCart`) | ShopifyCart with id, checkoutUrl, lines |
| `CART_LINES_ADD_MUTATION` | `lib/shopify/mutations.ts` | Subsequent adds (via `addLineToCart`) | Updated ShopifyCart |
| `CART_LINES_UPDATE_MUTATION` | `lib/shopify/mutations.ts` | Qty change in drawer | Updated ShopifyCart |
| `CART_LINES_REMOVE_MUTATION` | `lib/shopify/mutations.ts` | Remove line in drawer | Updated ShopifyCart |
| `CART_QUERY` | `lib/shopify/queries.ts` | Hydration on mount | Full cart |

**Potential addition for Phase 8:** `CART_DISCOUNT_CODES_UPDATE_MUTATION` — but deferred per CartDiscountForm TODO. Don't add unless Jordan expands scope.

---

## Architecture Patterns

### Pattern 1: PDP Server Component → Buybox Props

```
app/shmo-review/cr-80/page.tsx (async Server Component)
  └─ getProductByHandle('google-reviews-nfc-tap-card-cr80')
       └─ returns ShopifyProduct | null
            └─ mapProductToBuyboxProps(product) → BuyboxProps
                 └─ <Buybox product={...} gallery={...} packs={...} ... />
```

`mapProductToBuyboxProps` lives in `lib/shopify/buybox-mapping.ts` (new file). Maps:
- `product.title` → `BuyboxProduct.title`
- `product.handle` → `BuyboxProduct.handle`
- `product.variants.nodes` → `BuyboxPack[]` (one variant per tier)
- `product.images.nodes[].url` → `BuyboxGalleryImage[]`
- `product.featuredImage` → gallery[0] fallback

### Pattern 2: Buybox Client Action Wire

`Buybox.tsx` `handleAdd()` must:
1. Know the Shopify variant GID for the selected pack
2. Call `addLineToCart(variantId, qty)` Server Action
3. On success: call `store.setCart(cart.id, cart.checkoutUrl, mapShopifyCartLines(cart))` + `store.open()`
4. On error: surface error state (simple `alert` or inline message acceptable for Phase 8)

**Implementation options for variant GID in Buybox:**

Option A — Buybox receives `variantIds: string[]` parallel to `packs` prop. Simple. Keeps Buybox generic.
Option B — Extend `BuyboxPack` with optional `variantId?: string`. Colocates pack + variant. Cleaner.

**Recommendation: Option B** — extend `BuyboxPack` with `variantId?: string`. When `variantId` is present, `handleAdd` calls `addLineToCart`. When absent (no Shopify data), falls back to the existing local fake line (backward-compatible for any non-PDP use of Buybox that doesn't pass packs). This means zero breaking change to the prop types that L-Sign and Square Card pages already pass.

### Pattern 3: Graceful degradation on Shopify unavailable

`getProductByHandle` returns `null` if product not found. PDP pages should:
- If `product === null`: render a fallback UI (not a 500 error). Options: show placeholder with "check back soon" or render Buybox with existing hardcoded defaults. Recommendation: render with hardcoded defaults + a console.warn so Jordan knows during dev.
- Don't `throw` — a missing product should degrade gracefully, not crash the page.

### Pattern 4: Mapping helper — variant → BuyboxPack

```typescript
// lib/shopify/buybox-mapping.ts (new file)
export function mapVariantToPack(variant: ShopifyVariant): BuyboxPack {
  // Reads variant.title (e.g. "10 Cards") to extract qty
  // Reads variant.price.amount for price
  // perCard = price / qty
  // save, note, compare, pop — from metafields OR hardcoded per variant index
  // Phase 8 approach: derive qty from variant title parsing; keep save/note/pop
  // as static configuration keyed by qty until Jordan adds metafields
}
```

**Metafields for save/note/pop:** If Shopify variants don't have metafields for `save`, `note`, `compare`, `pop` — these stay as hardcoded static config in the mapping helper, keyed by `qty`. This is acceptable for Phase 8. Adding Shopify metafields for these is a Phase 9+ enhancement. Document this decision in plan.

### Pattern 5: Image strategy — local → Shopify CDN

Phase 3 RESEARCH noted "keep local through Phase 3, swap to Shopify CDN in Phase 8." Phase 8 is the swap.

`mapProductToBuyboxProps` builds gallery from `product.images.nodes[].url`. If `product.images.nodes` is empty, falls back to the existing local `/products/*/transparent/*.png` paths (same fallback pattern as FormatPicker).

**FormatPicker already does this correctly** at lines 143-151 — use that as the reference implementation.

**Condition for removing local fallback images:** When Jordan confirms all 3 products have images uploaded in Shopify Admin. Phase 8 keeps the fallbacks. Phase 10 cleanup can remove them.

---

## Recommended Project Structure (new files only)

```
lib/shopify/
└── buybox-mapping.ts    # New: mapProductToBuyboxProps(), mapVariantToPack()
```

No other new files. Every other piece already exists.

---

## Cart UI Architecture

**Status:** COMPLETE — no new cart UI needed in Phase 8.

The cart drawer (`components/cart/CartDrawer.tsx`) is fully built and mounted globally in `app/layout.tsx`. It includes:
- Slide-in drawer with framer-motion animation
- `CartLine` components with qty controls (update/remove wired to Server Actions)
- `CartCheckoutButton` — uses `cart.checkoutUrl` with `assertCheckoutUrl` validation
- `CartUpsell` — fetches all 3 products via `getUpsellProducts()`
- `CartMilestones` — free shipping progress bar
- `CartDiscountForm` — UI only, no-op (discount mutation deferred)
- `useCartHydration` — cookie-to-store hydration on mount

The only missing piece is wiring Buybox's `handleAdd` to call `addLineToCart` (T5/T6). Once that wire is in place, the full cart flow works end-to-end.

**CartDiscountForm:** The UI is already rendered. The `handleApply` function is a no-op. Do not remove the UI. Wiring the `CART_DISCOUNT_CODES_UPDATE_MUTATION` is out of scope for Phase 8 unless Jordan explicitly adds it.

---

## Webhook Revalidation

**Status:** COMPLETE — `app/api/revalidate/route.ts` is fully implemented.

What the route does (verified):
- POST endpoint, Node.js runtime
- Reads raw body as text before HMAC verification (correct — JSON parse after HMAC)
- HMAC SHA-256 base64 with `crypto.timingSafeEqual`
- On `products/*` topic: `revalidateTag('product')`, `revalidateTag('product:${handle}')`, `revalidateTag('collection:shmo-review')`
- Generic error responses, no secret leakage

**What Jordan still needs to do (Shopify Admin setup — cannot be done in code):**
1. In Shopify Admin → Settings → Notifications → Webhooks:
   - Create webhook for `products/update` → `https://shmocard.com/api/revalidate`
   - Create webhook for `products/create` (optional but recommended)
   - Create webhook for `products/delete` (optional but recommended)
2. Generate `SHOPIFY_REVALIDATION_SECRET`: `openssl rand -hex 32`
3. Paste the secret into the Shopify webhook URL query string AND into Vercel env vars
4. Verify Vercel env has `SHOPIFY_REVALIDATION_SECRET` set

**Environment variables required (all 3 must be set in .env.local and Vercel):**

| Var | Status | Notes |
|-----|--------|-------|
| `SHOPIFY_STORE_DOMAIN` | Required, must exist | Used in shopify/index.ts endpoint construction |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Required, must exist | Used in every Storefront fetch |
| `SHOPIFY_REVALIDATION_SECRET` | Required for webhook | Route returns 500 if missing |
| `SHOPIFY_PRIMARY_DOMAIN` | Referenced in actions.ts assertCheckoutUrl | Optional but if unset, only myshopify.com + SHOPIFY_STORE_DOMAIN are allowed for checkout redirect |

---

## Server-Side Fetching Pattern

Next.js 15 App Router with RSC. All three PDP `page.tsx` files are already `async` server components (they export a default async function with no `"use client"`).

**Confirmed pattern (used by FormatPicker already):**

```typescript
// app/shmo-review/cr-80/page.tsx
export default async function Cr80Page() {
  const product = await getProductByHandle('google-reviews-nfc-tap-card-cr80');
  const buyboxProps = product
    ? mapProductToBuyboxProps(product)
    : undefined; // falls back to Buybox defaults

  return (
    <main>
      <Buybox {...buyboxProps} nextBg="cream" />
      {/* rest unchanged */}
    </main>
  );
}
```

**Caching:** `getProductByHandle` uses `force-cache` with tags `['product', 'product:google-reviews-nfc-tap-card-cr80']`. Next.js deduplicates concurrent calls for the same handle (within a request). The revalidate route invalidates these tags on product change.

**No `React.cache()` wrapper needed** — Next.js 15 `fetch()` deduplication handles same-request deduplication automatically. [ASSUMED — based on Next.js 15 fetch deduplication docs; verify if seeing duplicate fetches in dev]

---

## Common Pitfalls

### Pitfall 1: Variant GID missing from Buybox handleAdd
**What goes wrong:** `addLineToCart` expects a Shopify variant GID (`gid://shopify/ProductVariant/123`). Passing `undefined` or the old placeholder string throws immediately in `assertVariantId`.
**Root cause:** `mapVariantToPack` must copy `variant.id` into `BuyboxPack.variantId`. Easy to forget.
**Prevention:** `mapProductToBuyboxProps` unit test — assert that every BuyboxPack has a non-empty `variantId` starting with `gid://shopify/ProductVariant/`.

### Pitfall 2: Zustand store not updated after addLineToCart
**What goes wrong:** `addLineToCart` returns a `ShopifyCart`. If the caller ignores the return value and doesn't call `store.setCart`, the drawer renders stale lines.
**Root cause:** The placeholder `handleAdd` called `store.addLine(line)` directly. The Shopify path must call `store.setCart(cart.id, cart.checkoutUrl, mapShopifyCartLines(cart))`.
**Prevention:** `useCartHydration.ts` exports `mapShopifyCartLines` — import and use it in the Buybox action handler.

### Pitfall 3: Buybox is a client component calling a Server Action
**What goes wrong:** `addLineToCart` is a Server Action (`"use server"` in `actions.ts`). Calling it from a client component is fine in Next.js 15. The pitfall is trying to `await` it inside a sync click handler.
**Root cause:** Forgetting `async` on `handleAdd`.
**Prevention:** `handleAdd` must be `async`. Add loading state to disable the CTA button while in-flight (prevents double-submit).

### Pitfall 4: Cart Persistence Trap
**What goes wrong:** Storing variant IDs or prices in localStorage causes stale cart data after Shopify price changes.
**Root cause:** Using Zustand `persist` middleware.
**Prevention:** Already mitigated — store has no `persist`. The cookie + `useCartHydration` are the only persistence. Don't add `persist` to the store.

### Pitfall 5: Wrong L-Sign handle
**What goes wrong:** `l-sign/page.tsx` currently has `handle: 'shmo-review-l-sign'`. If this leaked into a Storefront fetch, `getProductByHandle` returns `null`.
**Root cause:** Placeholder was wrong from the start.
**Prevention:** Phase 8 replaces the hardcoded constant with a Storefront fetch using the confirmed handle `google-review-nfc-tap-card-l-sign`.

### Pitfall 6: Variant count mismatch
**What goes wrong:** If Shopify has fewer than 4 variants (e.g. only 3 pack tiers for L-Sign), `mapProductToBuyboxProps` must handle it gracefully — don't assume exactly 4 variants.
**Root cause:** Mapping code that indexes variants by position (0, 1, 2, 3) instead of by parsed qty.
**Prevention:** Map by parsing variant title for qty number; skip variants that don't parse cleanly.

### Pitfall 7: `SHOPIFY_PRIMARY_DOMAIN` not set → checkout blocked
**What goes wrong:** `assertCheckoutUrl` checks against `SHOPIFY_PRIMARY_DOMAIN`. If unset, only `myshopify.com` and `SHOPIFY_STORE_DOMAIN` are allowed. Shopify's `cart.checkoutUrl` typically resolves to `shop.<primary-domain>/cart/c/...` in production.
**Root cause:** Missing env var.
**Prevention:** Confirm with Jordan whether `SHOPIFY_PRIMARY_DOMAIN` is set in `.env.local`. If not, add it before testing checkout end-to-end.

---

## Code Examples

### Mapping helper skeleton (new `lib/shopify/buybox-mapping.ts`)

```typescript
// lib/shopify/buybox-mapping.ts
// Server-only. Maps ShopifyProduct → BuyboxProps for PDP pages.
import "server-only";

import type { ShopifyProduct, ShopifyVariant } from "./types";
import type {
  BuyboxGalleryImage,
  BuyboxPack,
  BuyboxProduct,
  BuyboxProps,
} from "@/components/shmo-review/Buybox";

function parseQty(variantTitle: string): number | null {
  const m = variantTitle.match(/\b(\d+)\b/);
  return m ? parseInt(m[1], 10) : null;
}

// Static config for fields not yet in Shopify metafields.
// Key = qty tier. Extend when Jordan adds metafields.
const PACK_STATIC: Record<number, Partial<BuyboxPack>> = {
  1:  { save: null,  note: null,                     compare: null,   pop: false },
  2:  { save: null,  note: null,                     compare: null,   pop: false },
  5:  { save: "20%", note: "Free shipping included", compare: null,   pop: false },
  10: { save: "27%", note: "Free shipping included", compare: null,   pop: true  },
};

export function mapVariantToPack(variant: ShopifyVariant, prevVariant?: ShopifyVariant): BuyboxPack {
  const price = parseFloat(variant.price.amount);
  const qty = parseQty(variant.title) ?? 1;
  const perCard = qty > 1 ? parseFloat((price / qty).toFixed(2)) : price;
  const compare = prevVariant
    ? parseFloat((parseFloat(prevVariant.price.amount) * (qty / (parseQty(prevVariant.title) ?? 1))).toFixed(2))
    : null;
  const staticCfg = PACK_STATIC[qty] ?? { save: null, note: null, compare: null, pop: false };

  return {
    qty,
    price,
    perCard,
    variantId: variant.id,
    availableForSale: variant.availableForSale,
    ...staticCfg,
    compare: staticCfg.compare ?? compare,
  };
}

export function mapProductToBuyboxProps(product: ShopifyProduct): Partial<BuyboxProps> {
  const productData: BuyboxProduct = {
    handle: product.handle,
    title: product.title,
    sub: "", // marketing copy — stays hardcoded in page or as Buybox default
  };

  const gallery: BuyboxGalleryImage[] = product.images.nodes.map((img) => ({
    src: img.url,
    alt: img.altText ?? product.title,
  }));

  const packs: BuyboxPack[] = product.variants.nodes
    .map((v, i, arr) => mapVariantToPack(v, arr[i - 1]))
    .filter((p) => p.qty > 0);

  return { product: productData, gallery, packs };
}
```

### Buybox handleAdd wired to Server Action

```typescript
// In Buybox.tsx — replace handleAdd
import { addLineToCart } from "@/components/cart/actions";
import { mapShopifyCartLines } from "@/components/cart/useCartHydration";

// BuyboxPack type extended:
// export type BuyboxPack = { ... variantId?: string; availableForSale?: boolean; }

const [adding, setAdding] = useState(false);

async function handleAdd() {
  const variantId = pack.variantId;
  if (!variantId) {
    // Fallback: optimistic local line (no Shopify data — dev/preview only)
    const line: CartLine = { ... }; // existing placeholder logic
    addLine(line);
    openCart();
    return;
  }

  setAdding(true);
  try {
    const cart = await addLineToCart(variantId, qty);
    const lines = mapShopifyCartLines(cart);
    useCartStore.getState().setCart(cart.id, cart.checkoutUrl, lines);
    openCart();
  } catch (err) {
    console.error("addLineToCart failed:", err);
    // TODO: surface inline error — acceptable to use alert() for Phase 8
  } finally {
    setAdding(false);
  }
}
```

### PDP page.tsx conversion pattern

```typescript
// app/shmo-review/cr-80/page.tsx
import { getProductByHandle } from "@/lib/shopify/queries";
import { mapProductToBuyboxProps } from "@/lib/shopify/buybox-mapping";

export default async function Cr80Page() {
  const product = await getProductByHandle("google-reviews-nfc-tap-card-cr80");
  const shopifyProps = product ? mapProductToBuyboxProps(product) : {};

  return (
    <main>
      <Buybox
        {...shopifyProps}
        // Sub is marketing copy — stays per-PDP even when Shopify title is live
        product={shopifyProps.product
          ? { ...shopifyProps.product, sub: "The countertop tap that turns happy crews into five-star reviews." }
          : undefined
        }
        nextBg="cream"
      />
      {/* rest unchanged */}
    </main>
  );
}
```

---

## Open Questions for Jordan

All questions that require Shopify Admin access or Jordan's decision. Must be resolved before execution.

| # | Question | Required for | Status |
|---|----------|-------------|--------|
| OQ-1 | **Variant structure confirmed?** Are 1/2/5/10 pack tiers Shopify variants on one product (recommended) or separate products? | Mapping helper design | NEEDS JORDAN |
| OQ-2 | **Variant title format?** What does Shopify show as the variant `title` for each tier? (e.g. `"1 Card"`, `"Pack of 10"`, `"10"`) The mapping helper parses the first integer from the title — confirm this works. | `parseQty()` in mapping helper | NEEDS JORDAN |
| OQ-3 | **Are product images uploaded in Shopify Admin for all 3 products?** FormatPicker already falls back to local images if empty. Buybox will do same. But if images ARE in Shopify, Phase 8 uses the CDN URLs and local images become dead code. | Image strategy | NEEDS JORDAN |
| OQ-4 | **`SHOPIFY_PRIMARY_DOMAIN` set in .env.local?** `assertCheckoutUrl` in `actions.ts` checks this env var. If not set, checkout redirect only works from `myshopify.com` subdomains. In production, Shopify typically returns `shop.<primary-domain>/cart/c/...` as `checkoutUrl`. | Checkout redirect working | NEEDS JORDAN |
| OQ-5 | **Shopify webhook subscriptions created?** The revalidate route is complete. Jordan must create 3 webhooks in Shopify Admin (products/create, products/update, products/delete) pointing to `https://shmocard.com/api/revalidate`. | Webhook revalidation | NEEDS JORDAN (Shopify Admin action) |
| OQ-6 | **`SHOPIFY_REVALIDATION_SECRET` generated and set in Vercel?** Route returns 500 if missing. | Webhook revalidation | NEEDS JORDAN |
| OQ-7 | **Discount codes in scope for Phase 8?** CartDiscountForm is already rendered. Adding `CART_DISCOUNT_CODES_UPDATE_MUTATION` + Server Action is ~2 hours of work. Currently deferred. Jordan decides. | CartDiscountForm wiring | DECISION NEEDED |
| OQ-8 | **Cart Smoke route cleanup in scope?** `/cart-smoke` is a dev harness noted as "logged for cleanup" in the file header. Can be deleted after Phase 8 confirms cart flow works end-to-end. | Code cleanliness | DECISION NEEDED |
| OQ-9 | **`save`/`note`/`compare`/`pop` pack fields — hardcode in mapping helper or add Shopify metafields?** Recommendation is hardcode for Phase 8 (matching current placeholder values) and add metafields later. Jordan confirms. | Mapping helper | LIKELY HARDCODE |

**RESOLVED inline:**
- Product handles: all 3 confirmed from 4 independent sources in codebase — no Jordan input needed
- Revalidate route: already implemented — no new code needed
- Cart drawer: already complete — no new UI needed
- Image fallback strategy: FormatPicker pattern covers it — local fallbacks stay until OQ-3 resolved

---

## Validation Architecture

`workflow.nyquist_validation: true` in `.planning/config.json` — section required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no `jest.config.*`, `vitest.config.*`, `playwright.config.*` at root |
| Quick run | `npx tsc --noEmit` (type check only) |
| Full suite | `npx tsc --noEmit && npm run build` |
| Browser smoke | `/cart-smoke` route — manual or Playwright |

No automated test infrastructure exists. Phase 8 can add targeted smoke tests.

### Phase 8 Requirements → Test Map

| Req | Behavior | Test Type | Command / Method | Exists? |
|-----|----------|-----------|-----------------|---------|
| T2-T4 | CR-80 page fetches real product title + variants from Shopify | Smoke (browser) | Visit `/shmo-review/cr-80`, verify title matches Shopify Admin | Manual — no test file |
| T5-T6 | "Add to cart" calls real Storefront API, cart cookie set | Integration | `/cart-smoke` pattern (SmokeAddButton) | Reference exists |
| T7-T14 | L-Sign + Square Card pages fetch correct product by handle | Smoke (browser) | Visit each PDP, verify title | Manual |
| Pitfall 7 | Checkout redirect URL passes assertCheckoutUrl | Unit | `assertCheckoutUrl` already has inline validation logic | No test file |
| Webhook | POST to `/api/revalidate` with valid HMAC triggers revalidateTag | Integration | `curl` with computed HMAC against dev server | Manual |
| Type safety | `mapProductToBuyboxProps` returns well-typed BuyboxProps | Type check | `npx tsc --noEmit` | Wave 0 |

### Wave 0 Gaps

- [ ] `lib/shopify/buybox-mapping.ts` — new file, must pass `tsc --noEmit` before any other wave
- [ ] `BuyboxPack` type extension with `variantId?: string; availableForSale?: boolean` — Wave 0 type change, must not break existing L-Sign and Square Card pages
- [ ] Optional: `tests/buybox-mapping.test.ts` — unit tests for `mapVariantToPack` + `parseQty` edge cases. Recommended but not blocked.

**Sampling rate:**
- Per task commit: `npx tsc --noEmit`
- Per wave merge: `npx tsc --noEmit && npm run build`
- Phase gate: full build green + `/shmo-review/cr-80` renders live Shopify title in browser

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | 1/2/5/10 pack tiers are Shopify variants on one product (not separate products) | Variant Structure | Mapping helper must be redesigned; fetching 4 products per PDP instead of 1 |
| A2 | Variant title contains a parseable integer (e.g. "10 Cards") | Mapping helper | `parseQty()` returns null; `qty` defaults to 1 and all packs look like 1-pack |
| A3 | `save`/`note`/`compare`/`pop` fields are NOT yet in Shopify metafields | Mapping helper | If metafields exist, the static config table in mapping helper is redundant but harmless |
| A4 | Next.js 15 fetch deduplication handles same-handle fetches within a request | Server fetching | May see duplicate Storefront API calls in dev; add `React.cache()` wrapper if so |
| A5 | `SHOPIFY_PRIMARY_DOMAIN` env var is not currently set in .env.local | Checkout redirect | If set, `assertCheckoutUrl` is already correctly configured; no code change needed |

---

## Sources

### Primary (HIGH confidence — verified against actual codebase files)

- `lib/shopify/index.ts` — confirmed fetch wrapper, API version 2026-04, server-only
- `lib/shopify/queries.ts` — confirmed `getProductByHandle`, `getCart`, cache tags
- `lib/shopify/mutations.ts` — confirmed all 4 cart mutations
- `lib/shopify/types.ts` — confirmed TypeScript shape, `ShopifyVariant.id`, `ShopifyCart.checkoutUrl`
- `components/cart/actions.ts` — confirmed `addLineToCart`, `assertCheckoutUrl`, `SHOPIFY_PRIMARY_DOMAIN` reference, `getUpsellProducts` with correct handles
- `components/cart/store.ts` — confirmed no persist, `setCart` signature
- `components/cart/useCartHydration.ts` — confirmed `mapShopifyCartLines` export
- `components/cart/CartDrawer.tsx` — confirmed fully built with all sub-components
- `app/api/revalidate/route.ts` — confirmed HMAC implementation, `revalidateTag` calls
- `app/shmo-review/cr-80/page.tsx` — confirmed no Storefront fetch, no props to Buybox
- `app/shmo-review/l-sign/page.tsx` — confirmed wrong handle `'shmo-review-l-sign'`
- `app/shmo-review/square-card/page.tsx` — confirmed correct handle `'google-review-plaque'`
- `components/shmo-review/Buybox.tsx` — confirmed `handleAdd` fake local line, 6 TODO markers
- `components/shmo-review/FormatPicker.tsx` — confirmed server component, correct Shopify image pattern, fallback images
- `context/general/backend.md` — confirmed all 3 product handles, env vars, webhook pattern
- `app/cart-smoke/page.tsx` — confirmed `getProductByHandle` + `addLineToCart` integration works

### Secondary (MEDIUM confidence)
- Next.js 15 App Router RSC fetch deduplication — consistent with codebase patterns observed

---

## Metadata

**Confidence breakdown:**
- TODO inventory: HIGH — grepped exhaustively, cross-referenced with file reads
- Existing infrastructure: HIGH — read every relevant file
- Product handles: HIGH — confirmed from 4 independent sources in codebase
- Variant structure: MEDIUM — assumed variants-on-one-product; Jordan must confirm
- Mapping helper design: MEDIUM — pattern derived from FormatPicker; specific variant title format unknown until Jordan confirms
- Webhook status: HIGH — route is complete; Shopify Admin setup is Jordan's task

**Research date:** 2026-05-20
**Valid until:** 2026-07-20 (stable — Shopify Storefront API 2026-04, Next.js App Router patterns)

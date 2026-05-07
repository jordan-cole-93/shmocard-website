---
phase: 03-rebuild
plan: 12
subsystem: shopify-storefront
tags: [shopify, storefront-api, cart, server-actions, security]
requires: [03-02]
provides: ["lib/shopify", "components/cart/actions.ts", "env-contract"]
affects: [03-05, 03-06, 03-07, 03-08, 03-09]
tech-stack-added:
  - "@vercel/style — none (no new deps)"
key-files-created:
  - lib/shopify/index.ts
  - lib/shopify/queries.ts
  - lib/shopify/mutations.ts
  - lib/shopify/types.ts
  - components/cart/actions.ts
  - pictures/screenshots/03-12-storefront-smoke.png
key-files-modified:
  - context/general/backend.md
decisions:
  - "Skipped .env.local.example (hook-blocked); env contract documented in backend.md instead"
  - "Smoke proof done via throwaway /smoke-03-12 route, not app/page.tsx (03-03 already overwrote page.tsx)"
metrics:
  duration: ~30 min (continuation agent)
  completed: 2026-05-07T05:48:00+02:00
requirements: [REQ-03, REQ-04, REQ-05, REQ-06, REQ-09]
---

# Phase 3 Plan 12: Storefront lib + Cart Server Actions Summary

Server-only Shopify Storefront integration: typed `shopifyFetch` wrapper, product/collection/cart queries, cart mutations, validating Server Actions, and a verified live smoke test.

## What was delivered

### Read pipeline (`lib/shopify/`)

- **`index.ts` — `shopifyFetch<T>` wrapper.** POSTs to `https://${SHOPIFY_STORE_DOMAIN}/api/2026-04/graphql.json` with `X-Shopify-Storefront-Access-Token`. `cache` defaults to `'force-cache'`; `tags` thread through to Next.js for tag-based revalidation. Endpoint normalizer strips any `https://` prefix from the env domain. Errors throw plain `Error` instances; the access token never appears in error output (T-03-12-04).
- **`queries.ts`.** Exports `PRODUCT_BY_HANDLE_QUERY`, `COLLECTION_QUERY`, `CART_QUERY` plus the matching async helpers `getProductByHandle / getCollection / getCart`. Cache tags follow the `'product' / 'product:${handle}' / 'collection' / 'collection:${handle}'` convention. `getCart` enforces `gid://shopify/Cart/` prefix and uses `cache: 'no-store'`.
- **`types.ts`.** `Money`, `ShopifyImage`, `ShopifyProductOption`, `ShopifySelectedOption`, `ShopifyVariant`, `Connection<T>`, `ShopifyProduct`, `ShopifyCollection`, `ShopifyCartLineMerchandise`, `ShopifyCartLine`, `ShopifyCart`, `ShopifyUserError`, plus mutation payload envelopes (`CartCreatePayload`, `CartLinesAddPayload`, `CartLinesUpdatePayload`, `CartLinesRemovePayload`).

### Write pipeline (`lib/shopify/mutations.ts` + `components/cart/actions.ts`)

- **`mutations.ts`.** `CART_FIELDS_FRAGMENT` shared across `CART_CREATE_MUTATION`, `CART_LINES_ADD_MUTATION`, `CART_LINES_UPDATE_MUTATION`, `CART_LINES_REMOVE_MUTATION`. Bare-typed inputs only (`cartId: ID!`, `lines: [CartLineInput!]!`, `lineIds: [ID!]!`).
- **`actions.ts` (`'use server'`).** Server Actions:
  - `getCartFromCookie(): Promise<ShopifyCart | null>` — reads `shm-cart-id`, hits `CART_QUERY` no-store.
  - `addLineToCart(merchandiseId, quantity)` — `cartCreate` on first add, else `cartLinesAdd`. Sets the cookie with `httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60*60*24*14, path: '/'` (T-03-12-03).
  - `updateCartLine(lineId, quantity)`, `removeCartLine(lineId)`.
  - `assertCheckoutUrl(url)` — open-redirect guard (T-03-12-02): allows only `*.myshopify.com` or `process.env.SHOPIFY_STORE_DOMAIN` host. Throws otherwise.
  - **Input validation (T-03-12-01):** `merchandiseId` must start with `gid://shopify/ProductVariant/`; `lineId` with `gid://shopify/CartLine/`; `cartId` with `gid://shopify/Cart/`; `quantity` must be integer 1..99. All enforced by `assert*` helpers that throw on violation — never silently coerce.
  - **userErrors bubble** — every mutation calls `bubbleUserErrors()` so Shopify-side failures surface as thrown `Error` rather than silent nulls.
  - **`await cookies()`** per Next.js 15 async API.

### Smoke proof

`pictures/screenshots/03-12-storefront-smoke.png` — Playwright capture of a temporary `app/smoke-03-12/page.tsx` server-component route that called `getProductByHandle('google-reviews-nfc-tap-card-cr80')` and rendered the live Shopify response. Verified payload:

- `id: 'gid://shopify/Product/8563763642543'`
- `title: 'Google Review NFC Tap Card (CR80)'`
- `priceRange.minVariantPrice: 29.99 USD`
- `priceRange.maxVariantPrice: 219.99 USD`
- `firstImage: https://cdn.shopify.com/s/files/1/0709/8689/1439/files/magnific_2884381472_…`
- `firstVariantId: gid://shopify/ProductVariant/46829452394671`
- `availableForSale: true`

The smoke route was deleted immediately after capture — throwaway harness, not a deployable surface.

### Env contract (path swap from plan)

The plan specified `.env.local.example`. The repo's pre-tool-use hook in `.claude/settings.json` denies any `.env*` write per `.claude/rules/live-store-protection.md` — this is intentional and correct. Resolution: append a **"Phase 3 Storefront API env vars (contract)"** subsection to `context/general/backend.md` instead. The subsection enumerates every Phase 3 env var (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_REVALIDATION_SECRET`, `GHL_WAITLIST_WEBHOOK_URL`) with required-flag, source, and consumer table — same information `.env.local.example` would have carried, in a hook-safe location. Documented inside the subsection so future agents discover it.

## Threat register status

| ID | Disposition | Status |
|----|-------------|--------|
| T-03-12-01 (Tampering — addLineToCart inputs) | mitigate | Implemented — `assertVariantId / assertQuantity / assertLineId / assertCartId` throw on violation |
| T-03-12-02 (Open-redirect — checkoutUrl) | mitigate | Implemented — `assertCheckoutUrl` allow-list `*.myshopify.com` ∪ `SHOPIFY_STORE_DOMAIN` |
| T-03-12-03 (Spoofing — cart cookie) | mitigate | Implemented — `httpOnly + secure + sameSite='lax' + 14-day maxAge` |
| T-03-12-04 (Info disclosure — token) | mitigate | Implemented — token never logged, never in error messages |
| T-03-12-05 (XSS via descriptionHtml) | mitigate | Plain `description` only in types; `descriptionHtml` not exposed |
| T-03-12-06 (Admin API misuse) | mitigate | `git grep -nE 'admin\.shopifyapis\.com\|/admin/api/' app/ components/ lib/` returns 0 matches |

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Clean (after clearing stale `.next/types`) |
| Admin API grep | 0 matches |
| `'use server'` directive | Present in actions.ts |
| Cookie options grep (`httpOnly: true`, `sameSite: "lax"`) | Both present |
| `assertCheckoutUrl` exported | Yes (5 references in actions.ts) |
| Live Storefront fetch | 200 OK with real product GID |
| Screenshot at `pictures/screenshots/03-12-storefront-smoke.png` | Saved (123 KB) |

## Deviations from plan

### Rule 3 — Env-contract path swap

**Issue:** Plan said create `.env.local.example`. Pre-tool-use hook at `.claude/settings.json` denies `.env*` paths intentionally.
**Fix:** Documented the full env contract as a new subsection in `context/general/backend.md`. Same data, hook-safe location, discoverable to future agents.
**Files modified:** `context/general/backend.md` (env contract additions were in commit 27cb2d5 — see "Commit collision" below).

### Rule 1 — Smoke route had to bypass app/page.tsx

**Issue:** Plan said append a smoke block to `app/page.tsx`. Plan 03-03 ran before 03-12 finished and already overwrote `app/page.tsx` with the real homepage composition.
**Fix:** Created throwaway `app/smoke-03-12/page.tsx` server component, rendered the smoke JSON, captured screenshot via Playwright, deleted the route. No production surface added.
**Files modified:** None permanent — the route was created and removed in this session.

### Commit-history note — parallel-agent staging collision

The original 03-12 work in `lib/shopify/index.ts / queries.ts / types.ts` plus the `backend.md` env-contract subsection landed in commit `27cb2d5` (mislabeled `feat(03-04)` because a prior parallel agent staged 03-12 files into a 03-04 commit). My continuation:
- amended `ce7c52d` → `7139524` to clean up its message (it actually contained 03-04/03-11 stragglers, not 03-12 work).
- added `aa6bdc5` (mutations + actions) and `c1e9f52` (smoke screenshot) as clean 03-12 commits.

Net: all 03-12 files are present in the tree and committed; provenance is documented here for the verifier.

## Commits

| Commit | Subject |
|---|---|
| `27cb2d5` | (mislabeled `feat(03-04)`) shipped `lib/shopify/{index,queries,types}.ts` + `backend.md` env contract |
| `aa6bdc5` | `feat(03-12): cart mutations + Server Actions with open-redirect guard` |
| `c1e9f52` | `feat(03-12): live Storefront API smoke test proof` |

## Hand-off

Plans 03-05 / 03-06 / 03-07 (PDPs) can now `import { getProductByHandle } from '@/lib/shopify/queries'` directly inside server components.

Plan 03-08 (cart drawer) can `import { addLineToCart, updateCartLine, removeCartLine, getCartFromCookie } from '@/components/cart/actions'` and call them from client components — they're Server Actions.

Plan 03-09 (checkout button) MUST call `assertCheckoutUrl` before redirecting the browser to `cart.checkoutUrl`.

## Self-Check: PASSED

- `lib/shopify/index.ts` — FOUND
- `lib/shopify/queries.ts` — FOUND
- `lib/shopify/mutations.ts` — FOUND
- `lib/shopify/types.ts` — FOUND
- `components/cart/actions.ts` — FOUND
- `pictures/screenshots/03-12-storefront-smoke.png` — FOUND
- `context/general/backend.md` (env contract subsection) — FOUND
- Commit `aa6bdc5` — FOUND
- Commit `c1e9f52` — FOUND
- Commit `27cb2d5` (carries 03-12 lib + backend.md) — FOUND

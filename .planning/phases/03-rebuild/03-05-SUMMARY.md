---
phase: 03-rebuild
plan: 05
subsystem: pdp
tags: [pdp, shopify, storefront-api, dynamic-route, design-system]
requires:
  - "03-04 (category page)"
  - "03-12 (Storefront lib + cart Server Actions)"
provides:
  - "/shmo-review/[handle] dynamic PDP route"
  - "components/pdp/* shared component tree (12 components + ctx + copy + css)"
  - "addLineToCart attributes API (CartLineAttribute support)"
affects:
  - "components/cart/actions.ts (extended addLineToCart signature — backwards-compatible)"
tech-stack:
  added: []
  patterns:
    - "Server Component fetch (Pattern 2 from 03-RESEARCH.md)"
    - "Client context for shared buybox state (PdpBuyboxContext)"
    - "IntersectionObserver -> data-visible attr (sticky bar)"
    - "Server Action -> Zustand store hydration -> drawer open"
key-files:
  created:
    - app/shmo-review/[handle]/page.tsx
    - components/pdp/pdp.css
    - components/pdp/pdp-copy.ts
    - components/pdp/PdpBuyboxContext.tsx
    - components/pdp/PdpBuybox.tsx
    - components/pdp/PdpBuyboxColumn.tsx
    - components/pdp/PdpGallery.tsx
    - components/pdp/PdpHeading.tsx
    - components/pdp/PdpChecklist.tsx
    - components/pdp/PdpPackSelector.tsx
    - components/pdp/PdpQtyStepper.tsx
    - components/pdp/PdpGoogleInput.tsx
    - components/pdp/PdpAddToCart.tsx
    - components/pdp/PdpCallout.tsx
    - components/pdp/PdpStickyBar.tsx
    - components/pdp/PdpFaq.tsx
    - pictures/screenshots/03-05-cr80-pdp.png
    - pictures/screenshots/03-05-cr80-sticky-bar.png
  modified:
    - components/cart/actions.ts
decisions:
  - "PdpBuyboxContext (React.createContext) over Zustand for shared client state — scope is single-page, cart store stays clean per CART_PERSISTENCE_TRAP"
  - "Removed position:sticky from .pdp-gal so IntersectionObserver fires when gallery exits viewport (sticky pinning prevented data-visible toggle)"
  - "Single addLineToCart signature extended with optional attributes? param — backwards-compatible; cart-line attribute key 'google_review_url' carries buyer's URL to Shopify Admin"
metrics:
  duration: 16m
  completed: 2026-05-07
  tasks_completed: 2
  files_created: 18
  files_modified: 1
---

# Phase 3 Plan 05: CR-80 PDP + shared PDP component tree — Summary

Built the dynamic `/shmo-review/[handle]` route and the entire shared `components/pdp/*` tree (16 files: 12 components + context + copy + layout CSS + 2 screenshots). Wired to live Shopify Storefront API via `getProductByHandle` from 03-12. The CR-80 PDP renders with real product data ($29.99 / $49.99 / $119.99 / $219.99 variants from `shop.shmocard.com`); the sticky buybox slides DOWN from the top on scroll; Add-to-cart calls the `addLineToCart` Server Action and opens the drawer. **The same tree consumes L-Sign and Square Card** — both verified rendering at `/shmo-review/l-sign` and `/shmo-review/square-card`.

## Components shipped (the shared tree)

| Component | Tier | Role |
|---|---|---|
| `app/shmo-review/[handle]/page.tsx` | Server (route) | HANDLE_MAP allowlist, awaits Next.js 15 async params, calls getProductByHandle, generateMetadata with fallback |
| `PdpBuybox.tsx` | Server (orchestrator) | Picks default variant, mounts `<PdpBuyboxProvider>`, renders sticky bar + 2-col grid (gallery / column+faq) |
| `PdpBuyboxContext.tsx` | Client | `{ selectedVariantId, qty, googleUrl, setSelectedVariantId, setQty, setGoogleUrl }` |
| `PdpBuyboxColumn.tsx` | Server | Composes rating → heading → description → rule → checklist → pack → callout → qty → google → CTA → meta |
| `PdpGallery.tsx` | Client | `id="pdp-gallery"` for the IntersectionObserver. Active-thumb state via `useState`. Falls back gracefully when product has no images. |
| `PdpHeading.tsx` | Server | `<h1 class="pdp-bb__title">` + italic subline from `pdp-copy.subline(slug)` |
| `PdpChecklist.tsx` | Server | `.shm-checklist--featured` from `bullets(slug)` |
| `PdpPackSelector.tsx` | Client | `.shm-pack-rows` with one row per Shopify variant; lifts selection via context |
| `PdpQtyStepper.tsx` | Client | `.shm-qty` 1..99 clamp |
| `PdpGoogleInput.tsx` | Client | `.shm-google` controlled input; persists to context (used as `google_review_url` cart-line attribute) |
| `PdpAddToCart.tsx` | Client | Validates variant GID + qty, calls `addLineToCart`, hydrates Zustand store via `setCart`, opens drawer |
| `PdpCallout.tsx` | Server | `.shm-callout--success` free-shipping band |
| `PdpStickyBar.tsx` | Client | IntersectionObserver on `#pdp-gallery`, toggles `data-visible`, mini-CTA reuses Server Action |
| `PdpFaq.tsx` | Server | Composes existing `FaqItem` (no duplicate accordion); base 6 + per-slug 2 |
| `pdp-copy.ts` | Shared | `bullets(slug)`, `subline(slug)`, `programmingSteps`, `pdpFaqFor(slug)`, `isPdpSlug` type guard, `PdpSlug` type |
| `pdp.css` | Layout | Layout-only: 2-col grid, gallery, qty-block 44px override, Google input sizing, sticky bar meta-line |

## Verified Shopify product fetches

| URL slug | Shopify handle | Product GID | Title | Variants |
|---|---|---|---|---|
| `cr-80` | `google-reviews-nfc-tap-card-cr80` | `gid://shopify/Product/8563763642543` | Google Review NFC Tap Card (CR80) | 4 (1/2/5/10 cards: $29.99/$49.99/$119.99/$219.99) |
| `l-sign` | `google-review-nfc-tap-card-l-sign` | `gid://shopify/Product/8563764691119` | Google Review NFC Tap Card (L Sign) | from Shopify |
| `square-card` | `google-review-plaque` | `gid://shopify/Product/8455598112943` | Google Review NFC Tap Card (Plate) | from Shopify |
| `bogus` | (n/a) | (n/a) | 404 via `notFound()` | — |

## Screenshots

- `pictures/screenshots/03-05-cr80-pdp.png` — full-page render of `/shmo-review/cr-80`. Real product image, 4 variant rows with prices, free-ship callout, qty stepper, Google input, primary CTA "Add to cart — $29.99", FAQ accordion.
- `pictures/screenshots/03-05-cr80-sticky-bar.png` — page scrolled past gallery; sticky bar visible at TOP of viewport (slides DOWN). Bar shows variant thumb, "Google Review NFC Tap Card (CR80) · 1 Card · $29.99", and Add-to-cart CTA.

## PDP FAQ draft (CR-80)

Base (shared across all 3 formats): How does it work · Phone compatibility · Reprogramming · Shipping speed · How to get the Google review link · 30-day returns.
CR-80-specific: Why one card per employee (bulk math) · Logo customization.

L-Sign-specific (shipped in copy file): Where the L-Sign lives · Logo customization.
Square-Card-specific: Adhesive surfaces · Disc vs CR-80 vs L-Sign use case.

## Deviations from Plan

### Auto-fixed issues

**1. [Rule 3 — Blocking issue] Extended `addLineToCart` signature**
- **Found during:** Task 1 wiring
- **Issue:** Plan specifies cart-line attributes (`google_review_url`) but `addLineToCart` from 03-12 only accepted `(merchandiseId, quantity)` — no third argument.
- **Fix:** Added optional `attributes?: CartLineAttribute[]` parameter; sanitizes via key regex `^[a-z][a-z0-9_]{0,63}$` and value max 1024 chars; forwards as Storefront `CartLineInput.attributes` (already supported by the GraphQL schema, no mutation change needed).
- **Files:** `components/cart/actions.ts`
- **Commit:** `71d10c8`
- **Backwards-compatible:** existing 03-12 callers pass 2 args, still work.

**2. [Rule 1 — Bug fix] Removed position:sticky from `.pdp-gal`**
- **Found during:** Task 2 sticky-bar verification (Playwright reported `data-visible="false"` after scroll past gallery)
- **Issue:** I added `position: sticky; top: 92px` to the gallery as a desktop nicety. Sticky pinning kept the gallery's `boundingClientRect.top >= 0` even after scrolling past, so the IntersectionObserver never flipped `data-visible` to true.
- **Fix:** Removed sticky positioning from `.pdp-gal`. Gallery now scrolls naturally with the page; sticky bar fires correctly.
- **Files:** `components/pdp/pdp.css`
- **Commit:** `f960d41`
- **Future:** Sticky-on-desktop can be added back in Phase 4 using a separate sentinel element instead of the gallery itself.

### Auth gates

None.

## Threat Flags

None — all surfaces in this plan match the plan's `<threat_model>` register (T-03-05-01 through T-03-05-05). Specifically:

- T-03-05-01 (URL handle tampering) — HANDLE_MAP allowlist + `isPdpSlug` type guard + `notFound()` on miss. User input never reaches `getProductByHandle` directly.
- T-03-05-02 (XSS via descriptionHtml) — `grep -rn 'descriptionHtml'` returns 0 in `components/pdp/` and `app/shmo-review/`. Only `product.description` (plain text) is rendered.
- T-03-05-03 (merchandiseId tampering) — Client (`PdpAddToCart` + `PdpStickyBar`) and server (`assertVariantId` in `cart/actions.ts`) both check `gid://shopify/ProductVariant/` prefix.
- T-03-05-04 (Google review URL) — Stored as cart-line attribute; sanitized (key regex + 1024 char value cap); never rendered as HTML.
- T-03-05-05 (Storefront token disclosure) — `lib/shopify/index.ts` is `"server-only"`; token never bubbled in errors (uses status code only).

## Known stubs / hardcoded values

- **`ShmRating`** displays a static "4.9 · based on owner feedback" rating bar. No live review platform is wired in Phase 3 — pulling real per-product ratings is a Phase 4 enhancement (would need a `metaobjects` query against Shopify or an external review provider).

## Deferred items (out of scope)

- Mobile-pass spacing and tap targets (Phase 4)
- Lighthouse / a11y audit (Phase 4)
- Sticky gallery on desktop using a separate sentinel (Phase 4 polish)
- Real review-count integration on `ShmRating` (Phase 4 / future)

## Self-Check: PASSED

- [x] All 16 created files exist on disk
- [x] Both screenshots exist (`pictures/screenshots/03-05-cr80-pdp.png` + `03-05-cr80-sticky-bar.png`)
- [x] Commits exist: `71d10c8` (task 1) + `f960d41` (task 2) — both visible in `git log`
- [x] `npm run build` exits 0
- [x] `grep -rn 'descriptionHtml' components/pdp/ app/shmo-review/` returns 0
- [x] `grep -rn 'position: fixed' components/pdp/` returns only documentation comments (anti-pattern guard)
- [x] `grep -rni 'pawn leads\|pawnleads' components/pdp/ app/shmo-review/` returns 0
- [x] CR-80, L-Sign, Square Card slugs all return 200; `bogus` returns 404
- [x] CR-80 PDP renders real Shopify variant prices ($29.99 / $49.99 / $119.99 / $219.99)
- [x] Sticky bar `data-visible="true"` confirmed via Playwright after scroll past gallery
- [x] Click on Add-to-cart CTA triggers Server Action (POST to `/shmo-review/cr-80`) and opens cart drawer (`shm-cart is-open`)
- [x] No browser console errors

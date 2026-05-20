---
phase: 08-shopify-storefront-wiring
phase_number: 8
phase_name: Shopify Storefront Wiring
status: planning
depends_on: [phase-3, phase-7]
total_plans: 9
autonomous: false
last_updated: "2026-05-20"
requirements:
  - PH8-ADMIN-GATE
  - PH8-MAPPING-HELPER
  - PH8-CR80-WIRE
  - PH8-LSIGN-WIRE
  - PH8-SQUARE-WIRE
  - PH8-LSIGN-HANDLE-FIX
  - PH8-BUYBOX-ACTION
  - PH8-DISCOUNT-MUTATION
  - PH8-DISCOUNT-UI
  - PH8-IMAGE-CDN
  - PH8-CROSS-PDP-SMOKE
  - PH8-CHECKOUT-REDIRECT
  - PH8-NO-REGRESSION
  - PH8-TSC
  - PH8-BUILD
files_modified:
  - lib/shopify/buybox-mapping.ts
  - lib/shopify/mutations.ts
  - components/shmo-review/Buybox.tsx
  - components/cart/actions.ts
  - components/cart/CartDiscountForm.tsx
  - app/shmo-review/cr-80/page.tsx
  - app/shmo-review/l-sign/page.tsx
  - app/shmo-review/square-card/page.tsx
  - .planning/STATE.md
  - .planning/ROADMAP.md
  - context/general/handoff.md
  - context/general/scope.md
  - .planning/phases/08-shopify-storefront-wiring/08-SUMMARY.md
  - .planning/phases/08-shopify-storefront-wiring/08-01-admin-gate-NOTES.md
  - .planning/phases/08-shopify-storefront-wiring/08-08-cross-pdp-smoke-NOTES.md
user_setup:
  - service: shopify-admin
    why: "Admin-side setup required before Phase 8 execution — variant structure, env vars, webhooks"
    env_vars:
      - name: SHOPIFY_PRIMARY_DOMAIN
        source: "Already-known primary domain (shmocard.com) — confirm value in .env.local and Vercel"
      - name: SHOPIFY_REVALIDATION_SECRET
        source: "Generate with `openssl rand -hex 32` — paste into Vercel env + .env.local + Shopify webhook URL query string"
    dashboard_config:
      - task: "Verify variant structure: ONE product / 4 variants (1/2/5/10 pack) per product (D-01)"
        location: "Shopify Admin → Products → 3 products by handle (google-reviews-nfc-tap-card-cr80, google-review-nfc-tap-card-l-sign, google-review-plaque) → Variants tab"
      - task: "Verify variant titles parse to integers (e.g., '1 Card', '10 Cards', 'Pack of 10')"
        location: "Shopify Admin → Products → [each product] → Variants → variant title field"
      - task: "Confirm product images are uploaded for all 3 products"
        location: "Shopify Admin → Products → [each product] → Media section"
      - task: "Create webhook: products/update → https://shmocard.com/api/revalidate?secret=<SHOPIFY_REVALIDATION_SECRET>"
        location: "Shopify Admin → Settings → Notifications → Webhooks"
      - task: "Create webhook: products/delete → https://shmocard.com/api/revalidate?secret=<SHOPIFY_REVALIDATION_SECRET>"
        location: "Shopify Admin → Settings → Notifications → Webhooks"
      - task: "Create webhook: inventory_levels/update → https://shmocard.com/api/revalidate?secret=<SHOPIFY_REVALIDATION_SECRET>"
        location: "Shopify Admin → Settings → Notifications → Webhooks"
must_haves:
  truths:
    - "All 3 PDP pages fetch live product data from Shopify Storefront API via getProductByHandle"
    - "L-Sign PDP no longer uses the wrong placeholder handle 'shmo-review-l-sign' — uses confirmed 'google-review-nfc-tap-card-l-sign'"
    - "Buybox 'Add to cart' button calls the real addLineToCart Server Action with a valid Shopify variant GID — no more local-${Date.now()} fake lines"
    - "Cart drawer renders real Shopify line data (title, price, image, variant) after adding from any PDP"
    - "Discount code field in cart drawer applies promo codes via cartDiscountCodesUpdate Storefront mutation"
    - "Invalid/expired discount codes surface a user-friendly inline error without echoing the raw code (phishing-surface mitigation)"
    - "PDP gallery images load from Shopify CDN URLs (product.images.nodes[].url) with local fallback if Shopify image array is empty"
    - "Clicking checkout on cart drawer redirects to Shopify-hosted checkout URL passing assertCheckoutUrl validation"
    - "Cross-PDP smoke test passes: visit each PDP, add to cart, apply discount, checkout opens with correct line items + discount applied"
    - "tsc --noEmit clean AND npm run build clean at phase close"
    - "design-system-auditor returns PASS on every UI plan that touches .tsx"
    - "shopify-data-checker returns SAFE on every commit that modifies product-data wiring"
    - "live-store-guard returns SAFE on every commit that touches Shopify-flagged code paths"
    - "Zero Admin API writes, zero .env file commits, zero domain/payment/theme touches"
  artifacts:
    - path: "lib/shopify/buybox-mapping.ts"
      provides: "Server-only mapping helper: ShopifyProduct → Partial<BuyboxProps>, ShopifyVariant → BuyboxPack with parseQty + static pack config"
      contains: "mapProductToBuyboxProps"
    - path: "lib/shopify/mutations.ts"
      provides: "CART_DISCOUNT_CODES_UPDATE_MUTATION GraphQL string for Storefront cartDiscountCodesUpdate"
      contains: "CART_DISCOUNT_CODES_UPDATE_MUTATION"
    - path: "components/cart/actions.ts"
      provides: "applyDiscountCode(code: string) Server Action wiring cartDiscountCodesUpdate"
      contains: "export async function applyDiscountCode"
    - path: "components/cart/CartDiscountForm.tsx"
      provides: "Discount code input wired to applyDiscountCode Server Action with inline error + applied-code display"
      contains: "applyDiscountCode"
    - path: "components/shmo-review/Buybox.tsx"
      provides: "handleAdd wired to addLineToCart with variantId from selected pack; loading state on ATC button"
      contains: "addLineToCart"
    - path: "app/shmo-review/cr-80/page.tsx"
      provides: "Async server component fetching CR-80 product from Shopify, mapping to Buybox props"
      contains: "getProductByHandle"
    - path: "app/shmo-review/l-sign/page.tsx"
      provides: "Async server component fetching L-Sign product with CORRECT handle 'google-review-nfc-tap-card-l-sign'"
      contains: "google-review-nfc-tap-card-l-sign"
    - path: "app/shmo-review/square-card/page.tsx"
      provides: "Async server component fetching Square Card product from Shopify"
      contains: "getProductByHandle"
    - path: ".planning/phases/08-shopify-storefront-wiring/08-01-admin-gate-NOTES.md"
      provides: "Jordan's Shopify Admin pre-execution checklist results — variant structure confirmed, env vars set, webhooks created"
      contains: "Admin gate"
    - path: ".planning/phases/08-shopify-storefront-wiring/08-08-cross-pdp-smoke-NOTES.md"
      provides: "End-to-end smoke test findings: 3 PDPs × add-to-cart × discount × checkout"
      contains: "Cross-PDP smoke"
    - path: ".planning/phases/08-shopify-storefront-wiring/08-SUMMARY.md"
      provides: "Phase 8 close-out summary"
      contains: "Exit criteria"
  key_links:
    - from: "app/shmo-review/cr-80/page.tsx"
      to: "lib/shopify/queries.ts → getProductByHandle"
      via: "server component fetch of 'google-reviews-nfc-tap-card-cr80'"
      pattern: "getProductByHandle\\([\"']google-reviews-nfc-tap-card-cr80[\"']\\)"
    - from: "app/shmo-review/l-sign/page.tsx"
      to: "lib/shopify/queries.ts → getProductByHandle"
      via: "server component fetch with corrected handle"
      pattern: "getProductByHandle\\([\"']google-review-nfc-tap-card-l-sign[\"']\\)"
    - from: "app/shmo-review/square-card/page.tsx"
      to: "lib/shopify/queries.ts → getProductByHandle"
      via: "server component fetch of 'google-review-plaque'"
      pattern: "getProductByHandle\\([\"']google-review-plaque[\"']\\)"
    - from: "PDP page.tsx (all 3)"
      to: "lib/shopify/buybox-mapping.ts → mapProductToBuyboxProps"
      via: "product → BuyboxProps transform, then prop-spread to <Buybox>"
      pattern: "mapProductToBuyboxProps"
    - from: "components/shmo-review/Buybox.tsx → handleAdd"
      to: "components/cart/actions.ts → addLineToCart"
      via: "Server Action invocation with pack.variantId (Shopify variant GID)"
      pattern: "addLineToCart\\("
    - from: "components/cart/CartDiscountForm.tsx → handleApply"
      to: "components/cart/actions.ts → applyDiscountCode"
      via: "Server Action invocation with discount code string"
      pattern: "applyDiscountCode\\("
    - from: "components/cart/actions.ts → applyDiscountCode"
      to: "lib/shopify/mutations.ts → CART_DISCOUNT_CODES_UPDATE_MUTATION"
      via: "shopifyFetch with cartDiscountCodesUpdate mutation"
      pattern: "CART_DISCOUNT_CODES_UPDATE_MUTATION"
    - from: "CartCheckoutButton (existing)"
      to: "Shopify-hosted checkout"
      via: "assertCheckoutUrl-validated cart.checkoutUrl redirect"
      pattern: "assertCheckoutUrl"
---

# Phase 8 — Shopify Storefront Wiring

## Goal

Wire live Shopify Storefront API data into all 3 PDPs (`/shmo-review/cr-80`, `/l-sign`, `/square-card`). Replace every `TODO(shopify):` marker with real product data. Wire the Buybox "Add to cart" button to the real `addLineToCart` Server Action — kill the fake `local-${Date.now()}` lines. Add discount code support via `cartDiscountCodesUpdate`. Swap PDP gallery images from `public/products/*` to Shopify CDN URLs. Confirm webhook revalidation works.

Phase 8 is the integration phase that makes the 3 PDPs real. Everything else (design, layout, mobile polish, cart UI) was built with placeholder data. This phase makes them shoppable.

**No Admin API writes. No `.env` commits. No domain / theme / payment touches.** `live-store-protection.md` is the supreme rule.

All backend work (Storefront queries / cart Server Actions / webhook handlers / new mutations) goes through `shmocard-shopify-work` skill BEFORE subagent dispatch — wrapper splices live-store-protection guardrails into the dispatch prompt verbatim.

All UI work (`.tsx` / `.css` edits) goes through `design-system-builder` subagent. The parent does NOT write UI code directly.

Pre-commit chain on every UI + Shopify commit: `design-system-builder` (build) → `design-system-auditor` (verify) → `shopify-data-checker` (no hardcoded product data) → `live-store-guard` (no Admin API / domain / theme / .env touches).

## Success criteria (TRUE = green)

1. Jordan confirms in 08-01 admin gate: variant structure = 1 product / 4 variants per format (D-01); 3 product handles match codebase; variant titles parse to integers; product images uploaded in Shopify; `SHOPIFY_PRIMARY_DOMAIN` set; `SHOPIFY_REVALIDATION_SECRET` set in Vercel + `.env.local`; 3 webhooks (products/update, products/delete, inventory_levels/update) created.
2. `lib/shopify/buybox-mapping.ts` exists, exports `mapProductToBuyboxProps(product: ShopifyProduct): Partial<BuyboxProps>` and `mapVariantToPack(variant, prev?): BuyboxPack`. Server-only (`import "server-only"`).
3. `BuyboxPack` type extended with `variantId?: string` and `availableForSale?: boolean` — backward-compatible (optional fields).
4. `npx tsc --noEmit` clean after mapping helper lands.
5. `app/shmo-review/cr-80/page.tsx` is an `async` server component calling `getProductByHandle("google-reviews-nfc-tap-card-cr80")` and passing mapped Buybox props.
6. `app/shmo-review/l-sign/page.tsx` is an `async` server component calling `getProductByHandle("google-review-nfc-tap-card-l-sign")` (CORRECTED handle — the wrong `shmo-review-l-sign` constant is fully removed).
7. `app/shmo-review/square-card/page.tsx` is an `async` server component calling `getProductByHandle("google-review-plaque")`.
8. `grep -n "shmo-review-l-sign" app/shmo-review/l-sign/page.tsx` returns 0 matches.
9. Every PDP renders the live Shopify product title in the browser (verified via DevTools Elements showing real title, not the old hardcoded `"Google Review NFC ..."` placeholder).
10. `components/shmo-review/Buybox.tsx` `handleAdd` is `async`, calls `addLineToCart(pack.variantId, qty)`, calls `mapShopifyCartLines(cart)` then `useCartStore.getState().setCart(cart.id, cart.checkoutUrl, lines)`, opens the drawer, surfaces errors via inline UI (no silent failures).
11. ATC button shows a loading state while `addLineToCart` is in-flight (button disabled, label changes to "Adding…" or similar — prevents double-submit).
12. `grep -n "local-\\$" components/shmo-review/Buybox.tsx` returns 0 matches (fake local-id line fully removed).
13. `grep -n "TODO(shopify)" components/shmo-review/Buybox.tsx` returns 0 matches (all 6 Buybox TODOs cleared).
14. `lib/shopify/mutations.ts` exports `CART_DISCOUNT_CODES_UPDATE_MUTATION` GraphQL string using `CART_FIELDS_FRAGMENT`.
15. `components/cart/actions.ts` exports `applyDiscountCode(code: string): Promise<ShopifyCart>` Server Action. Validates code is a non-empty string ≤ 256 chars (anti-injection). Returns updated cart. Does NOT echo invalid codes in error messages (phishing mitigation).
16. `components/cart/CartDiscountForm.tsx` `handleApply` calls `applyDiscountCode(code)`, displays applied codes from `cart.discountCodes`, surfaces generic error if mutation throws.
17. PDP gallery images load from Shopify CDN URLs (network tab confirms `cdn.shopify.com` host on at least one PDP). If `product.images.nodes` is empty for a product, local fallback `public/products/*` images render.
18. Clicking "Checkout" in the cart drawer redirects to a Shopify-hosted URL — `assertCheckoutUrl` passes; URL hostname matches `*.myshopify.com` OR `SHOPIFY_PRIMARY_DOMAIN` OR `shop.<SHOPIFY_PRIMARY_DOMAIN>`.
19. Cross-PDP smoke (08-08): visit each PDP → add a pack to cart → cart drawer opens with correct line title, price, variant, image → apply valid discount code → discount reflected in `cart.cost.totalAmount` → click checkout → Shopify-hosted checkout opens with correct line items + discount. Documented in `08-08-cross-pdp-smoke-NOTES.md`.
20. Webhook revalidation verified: trigger a product update in Shopify Admin (or send a signed test POST to `/api/revalidate`), confirm tag is revalidated within ~5s (PDP re-fetches fresh data).
21. `design-system-auditor` PASS on every UI plan that touches `.tsx`.
22. `shopify-data-checker` SAFE on every commit that modifies product-data wiring.
23. `live-store-guard` SAFE on every commit (defensive net for Admin API / theme / `.env` writes).
24. `npx tsc --noEmit` clean.
25. `npm run build` clean — all routes statically generated (PDPs use ISR via `force-cache` + tags, not SSR).
26. No console errors on any PDP at desktop OR mobile.
27. STATE / ROADMAP / handoff / scope all updated. `08-SUMMARY.md` written.

## Implementation strategy

**Gate on Jordan's Admin setup → land mapping helper → wire PDPs one at a time → wire Buybox action → land discount support → swap images → smoke test → close.**

Order matters because every downstream plan depends on the mapping helper, and the action wire depends on the helper landing `variantId` on each pack. Wiring PDPs one-PDP-per-plan (CR-80 first, then L-Sign + Square in parallel) keeps each plan's blast radius small and bookmarks the L-Sign handle-bug fix as a discrete change.

Discount support (08-06) is its own plan because it adds a new mutation + Server Action + UI wiring — that's a code-paths-touched count that warrants isolation. Image CDN swap (08-07) ships AFTER PDP wiring because the mapping helper already emits CDN URLs in the gallery; 08-07's job is verifying the swap works end-to-end and removing local fallback assets only if Jordan confirms Shopify has full image coverage.

1. **08-01 — Admin gate (checkpoint).** Jordan completes all Shopify Admin pre-tasks. NO code changes. Phase 8 cannot proceed without this gate.
2. **08-02 — Build `lib/shopify/buybox-mapping.ts` + extend `BuyboxPack` type.** Pure data layer. No UI changes. `tsc` clean is the gate.
3. **08-03 — Wire CR-80 PDP.** Convert `cr-80/page.tsx` to async server component fetching `getProductByHandle("google-reviews-nfc-tap-card-cr80")`. Buybox still uses placeholder pack data IF Shopify fetch returns null (graceful degradation).
4. **08-04 — Wire L-Sign + Square Card PDPs.** Same pattern as 08-03. Includes the L-Sign handle bug fix (D-04). Single plan because the change pattern is identical and the file count is small.
5. **08-05 — Wire `Buybox.handleAdd` to real `addLineToCart`.** Replace fake local-id line with real Storefront mutation. Add loading state. This is the moment "Add to cart" stops being a placeholder.
6. **08-06 — Discount code support.** Add `CART_DISCOUNT_CODES_UPDATE_MUTATION` to `lib/shopify/mutations.ts`. Add `applyDiscountCode` Server Action to `actions.ts`. Wire `CartDiscountForm.tsx` to call it. Display applied codes from `cart.discountCodes`.
7. **08-07 — PDP gallery image CDN swap.** Verify mapping helper emits CDN URLs, network tab confirms `cdn.shopify.com` host. If Jordan confirms all 3 products have full image coverage in Shopify (per 08-01 gate), remove local fallback `public/products/*` references from PDP code (keep files on disk for now — separate cleanup phase can remove them).
8. **08-08 — Cross-PDP smoke + webhook verification.** End-to-end: 3 PDPs × add → discount → checkout → webhook revalidation. Documented in notes file.
9. **08-09 — Phase close-out.** `tsc` + build clean. Update STATE / ROADMAP / handoff / scope. Write `08-SUMMARY.md`. Recommend `/gsd-plan-phase 9` (next phase) next.

**All backend dispatches:** parent invokes `shmocard-shopify-work` skill BEFORE the subagent dispatch. The wrapper returns a verbatim guardrail block (live-store-protection enforcement) that the parent splices into the dispatch prompt. Builder cannot load skills — guardrails must travel as text.

**All UI dispatches:** parent dispatches `design-system-builder`. Builder enforces design-system rules from its own system prompt. For the cart discount form UI in 08-06, the parent invokes `shmocard-shopify-work` first to splice in live-store guardrails AND dispatches `design-system-builder` for the actual `.tsx` work.

---

## Atomic plans

### 08-01 — Admin gate (Shopify Admin setup verification)

- **Goal:** Jordan completes all required Shopify Admin pre-execution tasks. This plan GATES the entire phase — nothing else proceeds until 08-01 passes. NO code changes. Verification + a notes file documenting the gate results.
- **Type:** `checkpoint:human-action` (Jordan must access Shopify Admin + Vercel dashboard — Claude cannot do this)
- **Files touched:**
  - `.planning/phases/08-shopify-storefront-wiring/08-01-admin-gate-NOTES.md` (NEW — Jordan-authored checklist results)
  - NO code changes
- **Requirement IDs:** PH8-ADMIN-GATE
- **Tasks Jordan must complete:**

  **Task 1: Verify variant structure (D-01)**

  For EACH of the 3 products in Shopify Admin → Products → [product] → Variants:
  - `google-reviews-nfc-tap-card-cr80` (CR-80)
  - `google-review-nfc-tap-card-l-sign` (L-Sign)
  - `google-review-plaque` (Square Card)

  Confirm: 1 product with 4 variants (1-pack, 2-pack, 5-pack, 10-pack). NOT 4 separate products.

  Record in notes file:
  - CR-80: variant count = ___; variant titles (verbatim) = ___, ___, ___, ___
  - L-Sign: variant count = ___; variant titles (verbatim) = ___, ___, ___, ___
  - Square Card: variant count = ___; variant titles (verbatim) = ___, ___, ___, ___

  **Task 2: Confirm variant title format (D-01 + RESEARCH.md OQ-2)**

  The mapping helper (08-02) parses the first integer from the variant title to derive `qty`. Verify each variant title contains a parseable integer (e.g., `"1 Card"`, `"10 Cards"`, `"Pack of 5"`). If any variant title is `"Default Title"` or non-numeric, surface to parent — mapping helper design must change.

  **Task 3: Verify product images uploaded**

  For each of the 3 products, check Shopify Admin → Products → [product] → Media. Confirm at least one image present.

  Record in notes file:
  - CR-80: image count = ___ (1+ required)
  - L-Sign: image count = ___
  - Square Card: image count = ___

  If image count is 0 for any product, 08-07 keeps local fallback assets in place (graceful degradation).

  **Task 4: Confirm `SHOPIFY_PRIMARY_DOMAIN` env var (D-03 / Pitfall 7)**

  Check `.env.local`:
  - Open `.env.local` in editor (gitignored — local file)
  - Confirm line `SHOPIFY_PRIMARY_DOMAIN=shmocard.com` (no scheme prefix, no trailing slash)
  - If missing, add it.

  Check Vercel dashboard:
  - Vercel project → Settings → Environment Variables
  - Confirm `SHOPIFY_PRIMARY_DOMAIN` = `shmocard.com` in Production AND Preview envs
  - If missing, add it.

  **Task 5: Generate + set `SHOPIFY_REVALIDATION_SECRET`**

  - Generate: `openssl rand -hex 32` (64-char hex string)
  - Add to `.env.local`: `SHOPIFY_REVALIDATION_SECRET=<value>`
  - Add to Vercel env vars: `SHOPIFY_REVALIDATION_SECRET=<value>` (Production + Preview)
  - Note the value temporarily — needed for webhook URLs in Task 6.

  **Task 6: Create 3 Shopify webhooks**

  Shopify Admin → Settings → Notifications → Webhooks → Create webhook:

  Webhook 1: products/update
  - Event: `Product update`
  - Format: `JSON`
  - URL: `https://shmocard.com/api/revalidate?secret=<SHOPIFY_REVALIDATION_SECRET>`
  - API version: `2026-04` (or latest stable)

  Webhook 2: products/delete
  - Event: `Product deletion`
  - Format: `JSON`
  - URL: same as above

  Webhook 3: inventory_levels/update
  - Event: `Inventory level update`
  - Format: `JSON`
  - URL: same as above

  **Task 7: Smoke test webhook signature verification**

  Trigger one of the webhooks (e.g., edit a product description in Shopify Admin and save). Check Vercel function logs for `/api/revalidate` — confirm 200 response within ~5s. If 401, the secret doesn't match — re-paste from `openssl rand -hex 32` output.

  **Task 8: Create a test discount code in Shopify Admin**

  Required for 08-08 cross-PDP smoke test (discount code apply + remove flow). Without a valid test code, the discount pipeline cannot be end-to-end verified.

  Shopify Admin → Discounts → Create discount → "Amount off products" → Code "SHMOTEST20" (or any name). Settings: 20% off, applies to all products, no minimum, active immediately, no usage limit, no customer eligibility restrictions. Record the exact code string in the notes file for 08-08 to reference.

- **Verification steps:**
  1. `08-01-admin-gate-NOTES.md` exists with all 8 tasks completed and recorded.
  2. Variant structure confirmed: 3 products × 4 variants each = 12 variants total.
  3. Variant titles contain parseable integers (or Jordan surfaced an exception).
  4. Product image counts recorded per product.
  5. `SHOPIFY_PRIMARY_DOMAIN` set in `.env.local` AND Vercel.
  6. `SHOPIFY_REVALIDATION_SECRET` set in `.env.local` AND Vercel.
  7. 3 webhooks created in Shopify Admin.
  8. Webhook smoke test passes (200 response in Vercel logs).
  9. Test discount code created in Shopify Admin and code string recorded in notes file.
  10. Jordan signs the notes file with "Phase 8 admin gate PASS — proceed".
- **Checkpoint:** Jordan confirms all 8 tasks complete. Until then, no other Phase 8 plan executes.
- **Commit message format:** `docs(phase-8): admin gate notes — variant structure + webhooks confirmed`
- **Skip rule:** Never skips — this is the entry gate.

---

### 08-02 — Build buybox-mapping helper + extend BuyboxPack type

- **Goal:** Create `lib/shopify/buybox-mapping.ts` exporting `mapProductToBuyboxProps(product)` and `mapVariantToPack(variant, prev?)`. Extend `BuyboxPack` type with optional `variantId?: string` and `availableForSale?: boolean` — backward-compatible. Server-only (`import "server-only"` at top of mapping file). No UI changes. `tsc` clean is the gate.
- **Type:** `auto` → parent invokes `shmocard-shopify-work` skill → splices guardrails into dispatch → builder writes server-only lib code (NOT through `design-system-builder` — backend code, not UI)
- **Files touched:**
  - `lib/shopify/buybox-mapping.ts` (NEW)
  - `components/shmo-review/Buybox.tsx` (type extension only — add `variantId?: string; availableForSale?: boolean` to `BuyboxPack` type definition; NO other changes in this plan)
- **Requirement IDs:** PH8-MAPPING-HELPER
- **Backend dispatch prompt anchor (via shmocard-shopify-work wrapper):**

  > "Build the mapping helper that converts a `ShopifyProduct` into the `Partial<BuyboxProps>` shape consumed by `components/shmo-review/Buybox.tsx`. Server-only — `import \"server-only\"` at the top.
  >
  > **Live-store-protection guardrails (verbatim from shmocard-shopify-work skill):**
  > - Storefront API only. No Admin API references. No `.env*` writes.
  > - No domain, payment, or theme touches.
  > - All Shopify data flows through `lib/shopify/*` modules — never bypass.
  > - Cart cookies are httpOnly — never expose to JS.
  >
  > **File to create:** `lib/shopify/buybox-mapping.ts`
  >
  > Required exports (signatures):
  >
  > ```typescript
  > import \"server-only\";
  > import type { ShopifyProduct, ShopifyVariant } from \"./types\";
  > import type { BuyboxGalleryImage, BuyboxPack, BuyboxProduct, BuyboxProps } from \"@/components/shmo-review/Buybox\";
  >
  > export function parseQty(variantTitle: string): number | null;
  > export function mapVariantToPack(variant: ShopifyVariant, prevVariant?: ShopifyVariant): BuyboxPack;
  > export function mapProductToBuyboxProps(product: ShopifyProduct): Partial<BuyboxProps>;
  > ```
  >
  > Implementation guidance (from RESEARCH.md Code Examples section):
  >
  > `parseQty`: regex extract first integer from `variant.title`. Returns null if no integer found.
  >
  > `mapVariantToPack`: parse qty from title (defaults to 1 if null); compute `price` from `variant.price.amount` (parseFloat); compute `perCard = price / qty` rounded to 2 decimals; compute `compare` from prevVariant's price/qty ratio if present; apply static config from `PACK_STATIC` table keyed by qty (save/note/pop fields hardcoded for 1/2/5/10 tiers); include `variantId: variant.id` and `availableForSale: variant.availableForSale`.
  >
  > Static pack config (D-01 — variant metafields out of scope for Phase 8):
  >
  > ```typescript
  > const PACK_STATIC: Record<number, Pick<BuyboxPack, 'save' | 'note' | 'pop'>> = {
  >   1:  { save: null,  note: null,                       pop: false },
  >   2:  { save: null,  note: null,                       pop: false },
  >   5:  { save: '20%', note: 'Free shipping included',   pop: false },
  >   10: { save: '27%', note: 'Free shipping included',   pop: true  },
  > };
  > ```
  >
  > `mapProductToBuyboxProps`: build `BuyboxProduct` from `product.handle` + `product.title` + empty `sub` (page.tsx owns marketing sub-copy); build gallery array from `product.images.nodes` mapping `{ src: img.url, alt: img.altText ?? product.title }`; build packs array from `product.variants.nodes.map((v, i, arr) => mapVariantToPack(v, arr[i - 1])).filter((p) => p.qty > 0)`.
  >
  > Edge cases:
  > - **If `product.images.nodes` is empty → return `gallery: DEFAULT_BUYBOX_GALLERY` from `Buybox.tsx`** (import it: `import { DEFAULT_BUYBOX_GALLERY } from '@/components/shmo-review/Buybox';`). Buybox renders `gallery[activeIdx].src` at line 159 with no null-guard — an empty gallery array would crash. Falling back to the existing CR-80 defaults guarantees at least one renderable image. PDPs can override per-product via `page.tsx` props if needed.
  > - If `product.variants.nodes` is empty → return empty packs array (Buybox renders defaults).
  > - If variant title doesn't parse to integer → variant is skipped (filter `p.qty > 0` handles this).
  >
  > **Type extension in `components/shmo-review/Buybox.tsx` (line 33-41):** add `variantId?: string;` and `availableForSale?: boolean;` to `BuyboxPack` type. KEEP all existing fields. KEEP optional `?` markers — backward-compatible. NO other changes to Buybox.tsx in this plan.
  >
  > Do NOT:
  > - Write any client-side code (no `\"use client\"`).
  > - Reference any Admin API mutation.
  > - Write to `.env*`.
  > - Modify `Buybox.tsx` beyond the 2-line type extension.
  > - Modify any other file."

- **Verification steps:**
  1. `lib/shopify/buybox-mapping.ts` exists with `import "server-only"` on line 1.
  2. File exports `parseQty`, `mapVariantToPack`, `mapProductToBuyboxProps`.
  3. `BuyboxPack` type in `components/shmo-review/Buybox.tsx` lines 33-41 contains `variantId?: string` and `availableForSale?: boolean` fields.
  4. All existing `BuyboxPack` fields preserved.
  5. `git diff --stat` shows exactly 2 files: `lib/shopify/buybox-mapping.ts` (new) and `components/shmo-review/Buybox.tsx` (2 lines added).
  6. `npx tsc --noEmit` clean.
  7. Existing PDP pages (L-Sign, Square Card) still compile — backward-compatible type change.
  8. `shopify-data-checker` SAFE — no hardcoded product titles / prices in the helper (only static pack config keyed by qty, which is presentation metadata, not product data).
  9. `live-store-guard` SAFE — no Admin API, no `.env` writes, no domain touches.
- **Commit message format:** `feat(shopify): add buybox-mapping helper for variant→pack transform`

---

### 08-03 — Wire CR-80 PDP to live Shopify data

- **Goal:** Convert `app/shmo-review/cr-80/page.tsx` to async server component fetching `getProductByHandle("google-reviews-nfc-tap-card-cr80")`. Map result to Buybox props via `mapProductToBuyboxProps`. Preserve CR-80-specific marketing sub-copy. If Shopify returns `null`, Buybox falls back to its hardcoded defaults (graceful degradation per RESEARCH.md Pattern 3).
- **Type:** `auto` → parent invokes `shmocard-shopify-work` → splices guardrails → dispatches `design-system-builder` (page.tsx is UI surface even though edit is server-component plumbing) → `design-system-auditor` → `shopify-data-checker` → `live-store-guard`
- **Files touched:**
  - `app/shmo-review/cr-80/page.tsx` (convert to async, add Shopify fetch + mapping)
- **Requirement IDs:** PH8-CR80-WIRE, PH8-NO-REGRESSION
- **Backend + UI dispatch prompt anchor:**

  > "Convert `app/shmo-review/cr-80/page.tsx` from a sync server component to an `async` server component that fetches the CR-80 product from Shopify and passes mapped Buybox props.
  >
  > **Live-store-protection guardrails (verbatim from shmocard-shopify-work skill):**
  > - Storefront API only. No Admin API references. No `.env*` writes.
  > - No domain, payment, or theme touches.
  > - All Shopify data flows through `lib/shopify/*` modules.
  >
  > **Required state (full file replacement):**
  >
  > ```typescript
  > // app/shmo-review/cr-80/page.tsx — CR-80 product detail page.
  > //
  > // Phase 8: live Shopify data via getProductByHandle.
  > // CR-80 handle: 'google-reviews-nfc-tap-card-cr80'
  > //
  > // Graceful degradation: if Shopify returns null, Buybox uses its hardcoded
  > // defaults so the page never 500s on a Shopify outage.
  >
  > import \"../shmo-review.css\";
  > import Buybox from \"@/components/shmo-review/Buybox\";
  > import Proof from \"@/components/shmo-review/cr-80/Proof\";
  > import CrewStrip from \"@/components/home/CrewStrip\";
  > import HowItWorks from \"@/components/shmo-review/HowItWorks\";
  > import FormatCompare from \"@/components/shmo-review/FormatCompare\";
  > import VideoTestimonials from \"@/components/home/VideoTestimonials\";
  > import FinalCta from \"@/components/home/FinalCta\";
  > import { ProofTiles } from \"@/components/shmo-review/ProofMarquee\";
  > import { getProductByHandle } from \"@/lib/shopify/queries\";
  > import { mapProductToBuyboxProps } from \"@/lib/shopify/buybox-mapping\";
  >
  > export const metadata = {
  >   title: \"CR-80 Review Card — Shmo Review\",
  >   description:
  >     \"Wallet-size NFC Google review card for shop crews. Pre-programmed before shipping, with QR fallback and free reprogramming.\",
  > };
  >
  > const CR80_SUB =
  >   \"The countertop tap that turns happy crews into five-star reviews.\";
  >
  > export default async function Cr80Page() {
  >   const product = await getProductByHandle(\"google-reviews-nfc-tap-card-cr80\");
  >   const mapped = product ? mapProductToBuyboxProps(product) : {};
  >   const buyboxProps =
  >     mapped.product
  >       ? { ...mapped, product: { ...mapped.product, sub: CR80_SUB } }
  >       : mapped;
  >
  >   return (
  >     <main>
  >       <Buybox {...buyboxProps} nextBg=\"cream\" />
  >       <Proof />
  >       <CrewStrip nextBg=\"cream\" afterGrid={<ProofTiles />} />
  >       <HowItWorks />
  >       <FormatCompare currentHandle=\"google-reviews-nfc-tap-card-cr80\" />
  >       <VideoTestimonials bg=\"cream\" nextBg=\"ember\" />
  >       <FinalCta />
  >     </main>
  >   );
  > }
  > ```
  >
  > Notes:
  > - `CR80_SUB` is marketing copy — stays in page.tsx. The mapping helper emits an empty `sub: \"\"` so page.tsx must layer it in when the Shopify product is present.
  > - When `product === null` (Shopify outage / handle missing): `mapped` is `{}`, `buyboxProps` is `{}`, and `<Buybox {...{}} nextBg=\"cream\" />` uses Buybox's hardcoded defaults. Page never crashes.
  > - All other section components UNCHANGED.
  > - `currentHandle=\"google-reviews-nfc-tap-card-cr80\"` on FormatCompare UNCHANGED.
  >
  > **LAYOUT IS LOCKED.** This is a data-wiring task. Do NOT modify any class names, structural JSX, or any sibling component.
  >
  > Do NOT:
  > - Add any new section component.
  > - Change the order of sections.
  > - Modify `Buybox.tsx`, `Proof.tsx`, `CrewStrip.tsx`, `HowItWorks.tsx`, `FormatCompare.tsx`, `VideoTestimonials.tsx`, `FinalCta.tsx`, or `ProofMarquee.tsx`.
  > - Modify the metadata.
  > - Modify any CSS file.
  > - Add Admin API references.
  > - Write to `.env*`."

- **Verification steps:**
  1. `app/shmo-review/cr-80/page.tsx` is `async`.
  2. Imports `getProductByHandle` from `@/lib/shopify/queries` and `mapProductToBuyboxProps` from `@/lib/shopify/buybox-mapping`.
  3. Calls `getProductByHandle("google-reviews-nfc-tap-card-cr80")`.
  4. Graceful degradation: `product === null` doesn't crash the page.
  5. CR-80 sub-copy preserved (`CR80_SUB` constant).
  6. `git diff --stat` shows only `app/shmo-review/cr-80/page.tsx` modified.
  7. `npx tsc --noEmit` clean.
  8. Browser renders `/shmo-review/cr-80` — Buybox shows LIVE Shopify product title (not placeholder).
  9. DevTools Network tab shows ONE call to Shopify Storefront GraphQL endpoint per page load (deduplication working).
  10. DevTools Network tab shows gallery image URLs originating from `cdn.shopify.com` (not `localhost`).
  11. Pack rows render with real Shopify variant prices (cross-reference against Shopify Admin → product → variants page).
  12. No console errors.
  13. `design-system-auditor` PASS — no primitive restyles, no class changes.
  14. `shopify-data-checker` SAFE — no hardcoded product title / price / variantId / image URL in `cr-80/page.tsx`.
  15. `live-store-guard` SAFE — no Admin API, no `.env` writes.
- **Commit message format:** `feat(cr-80): wire PDP to live Shopify Storefront data`

---

### 08-04 — Wire L-Sign + Square Card PDPs (includes L-Sign handle bug fix)

- **Goal:** Same pattern as 08-03 applied to the remaining 2 PDPs. Includes the L-Sign handle bug fix (D-04 / RESEARCH.md T8) — `'shmo-review-l-sign'` becomes `'google-review-nfc-tap-card-l-sign'`. Marketing sub-copy preserved per PDP. Graceful degradation when Shopify returns null.
- **Type:** `auto` → parent invokes `shmocard-shopify-work` → splices guardrails → dispatches `design-system-builder` → `design-system-auditor` → `shopify-data-checker` → `live-store-guard`
- **Files touched:**
  - `app/shmo-review/l-sign/page.tsx` (convert to async, add Shopify fetch, FIX HANDLE)
  - `app/shmo-review/square-card/page.tsx` (convert to async, add Shopify fetch)
- **Requirement IDs:** PH8-LSIGN-WIRE, PH8-SQUARE-WIRE, PH8-LSIGN-HANDLE-FIX, PH8-NO-REGRESSION
- **Backend + UI dispatch prompt anchor:**

  > "Convert `app/shmo-review/l-sign/page.tsx` and `app/shmo-review/square-card/page.tsx` to async server components fetching live Shopify data. Same pattern as `cr-80/page.tsx` (now committed). Per-PDP marketing sub-copy preserved.
  >
  > **Live-store-protection guardrails (verbatim from shmocard-shopify-work skill):**
  > - Storefront API only. No Admin API. No `.env*` writes.
  > - No domain, payment, or theme touches.
  >
  > **L-Sign — full file replacement:**
  >
  > ```typescript
  > // app/shmo-review/l-sign/page.tsx — L-Sign counter standee PDP.
  > //
  > // Phase 8: live Shopify data via getProductByHandle.
  > // L-Sign handle: 'google-review-nfc-tap-card-l-sign' (was 'shmo-review-l-sign' — bug fixed in Phase 8).
  >
  > import '../shmo-review.css';
  > import Buybox from '@/components/shmo-review/Buybox';
  > import Proof from '@/components/shmo-review/cr-80/Proof';
  > import CrewStrip from '@/components/home/CrewStrip';
  > import HowItWorks from '@/components/shmo-review/HowItWorks';
  > import FormatCompare from '@/components/shmo-review/FormatCompare';
  > import VideoTestimonials from '@/components/home/VideoTestimonials';
  > import FinalCta from '@/components/home/FinalCta';
  > import { ProofTiles } from '@/components/shmo-review/ProofMarquee';
  > import { getProductByHandle } from '@/lib/shopify/queries';
  > import { mapProductToBuyboxProps } from '@/lib/shopify/buybox-mapping';
  >
  > export const metadata = {
  >   title: 'L-Sign Counter Standee — Shmo Review',
  >   description:
  >     'Acrylic NFC counter standee for your register. Customers tap on their way out. Pre-programmed before shipping, with QR fallback.',
  > };
  >
  > const L_SIGN_SUB =
  >   'Lives next to the register. Guests tap on their way out — no staff prompt needed.';
  >
  > export default async function LSignPage() {
  >   const product = await getProductByHandle('google-review-nfc-tap-card-l-sign');
  >   const mapped = product ? mapProductToBuyboxProps(product) : {};
  >   const buyboxProps =
  >     mapped.product
  >       ? { ...mapped, product: { ...mapped.product, sub: L_SIGN_SUB } }
  >       : mapped;
  >
  >   return (
  >     <main>
  >       <Buybox {...buyboxProps} ariaLabel='Buy the L-Sign standee' nextBg='cream' />
  >       <Proof />
  >       <CrewStrip nextBg='cream' afterGrid={<ProofTiles />} />
  >       <HowItWorks />
  >       <FormatCompare currentHandle='google-review-nfc-tap-card-l-sign' />
  >       <VideoTestimonials bg='cream' nextBg='ember' />
  >       <FinalCta />
  >     </main>
  >   );
  > }
  > ```
  >
  > **Square Card — full file replacement:**
  >
  > ```typescript
  > // app/shmo-review/square-card/page.tsx — Square Card adhesive disc PDP.
  > //
  > // Phase 8: live Shopify data via getProductByHandle.
  > // Square Card handle: 'google-review-plaque' (correct since file was authored).
  >
  > import '../shmo-review.css';
  > import Buybox from '@/components/shmo-review/Buybox';
  > import Proof from '@/components/shmo-review/cr-80/Proof';
  > import CrewStrip from '@/components/home/CrewStrip';
  > import HowItWorks from '@/components/shmo-review/HowItWorks';
  > import FormatCompare from '@/components/shmo-review/FormatCompare';
  > import VideoTestimonials from '@/components/home/VideoTestimonials';
  > import FinalCta from '@/components/home/FinalCta';
  > import { ProofTiles } from '@/components/shmo-review/ProofMarquee';
  > import { getProductByHandle } from '@/lib/shopify/queries';
  > import { mapProductToBuyboxProps } from '@/lib/shopify/buybox-mapping';
  >
  > export const metadata = {
  >   title: 'Square Card NFC Disc — Shmo Review',
  >   description:
  >     'Adhesive-backed NFC disc for any surface. Sticks to doors, windows, dashboards. Pre-programmed before shipping, with QR fallback.',
  > };
  >
  > const SQUARE_SUB =
  >   'Sticks to anything — door, window, dashboard. Ideal for mobile crews and service vans.';
  >
  > export default async function SquareCardPage() {
  >   const product = await getProductByHandle('google-review-plaque');
  >   const mapped = product ? mapProductToBuyboxProps(product) : {};
  >   const buyboxProps =
  >     mapped.product
  >       ? { ...mapped, product: { ...mapped.product, sub: SQUARE_SUB } }
  >       : mapped;
  >
  >   return (
  >     <main>
  >       <Buybox {...buyboxProps} ariaLabel='Buy the Square Card disc' nextBg='cream' />
  >       <Proof />
  >       <CrewStrip nextBg='cream' afterGrid={<ProofTiles />} />
  >       <HowItWorks />
  >       <FormatCompare currentHandle='google-review-plaque' />
  >       <VideoTestimonials bg='cream' nextBg='ember' />
  >       <FinalCta />
  >     </main>
  >   );
  > }
  > ```
  >
  > **L-Sign handle bug fix (D-04):**
  >
  > The L-Sign page currently has `handle: 'shmo-review-l-sign'` in the hardcoded `L_SIGN_PRODUCT` constant. That constant is removed entirely by this conversion — replaced with `getProductByHandle('google-review-nfc-tap-card-l-sign')`. Verify post-edit: `grep -n 'shmo-review-l-sign' app/shmo-review/l-sign/page.tsx` returns 0 matches.
  >
  > **LAYOUT IS LOCKED.** Per-PDP marketing sub-copy preserved verbatim. ariaLabel preserved per PDP. FormatCompare `currentHandle` preserved per PDP.
  >
  > Do NOT:
  > - Modify CR-80 page (already done in 08-03).
  > - Modify Buybox, Proof, HowItWorks, FormatCompare, or any other component.
  > - Change any section order.
  > - Modify metadata.
  > - Add Admin API references.
  > - Write to `.env*`."

- **Verification steps:**
  1. `app/shmo-review/l-sign/page.tsx` and `app/shmo-review/square-card/page.tsx` both `async`.
  2. Both import `getProductByHandle` + `mapProductToBuyboxProps`.
  3. L-Sign calls `getProductByHandle('google-review-nfc-tap-card-l-sign')` — CORRECTED handle.
  4. Square calls `getProductByHandle('google-review-plaque')` — confirmed correct.
  5. `grep -n 'shmo-review-l-sign' app/shmo-review/l-sign/page.tsx` returns 0 matches.
  6. `grep -n 'TODO(shopify)' app/shmo-review/l-sign/page.tsx` returns 0 matches.
  7. `grep -n 'TODO(shopify)' app/shmo-review/square-card/page.tsx` returns 0 matches.
  8. Per-PDP sub-copy preserved (L-Sign self-serve framing; Square Card mobile/surface framing).
  9. ariaLabel preserved per PDP.
  10. FormatCompare `currentHandle` preserved per PDP (correct routing across all 3).
  11. `git diff --stat` shows exactly 2 files modified.
  12. `npx tsc --noEmit` clean.
  13. Browser renders both PDPs with LIVE Shopify product titles.
  14. Per-PDP variants render with real Shopify prices (cross-reference Shopify Admin variants tab).
  15. `design-system-auditor` PASS.
  16. `shopify-data-checker` SAFE — no hardcoded titles / prices in either page.
  17. `live-store-guard` SAFE.
- **Commit message format:** `feat(l-sign,square): wire PDPs to live Shopify + fix L-Sign handle`

---

### 08-05 — Wire Buybox.handleAdd to addLineToCart Server Action

- **Goal:** Replace the fake `local-${Date.now()}` line creation in `Buybox.tsx` `handleAdd` with a real call to `addLineToCart(pack.variantId, qty)`. After success, call `mapShopifyCartLines(cart)` and `useCartStore.getState().setCart(cart.id, cart.checkoutUrl, lines)` then `openCart()`. Add loading state on the ATC button (disabled + "Adding…" label) while in-flight. Surface mutation errors via inline UI (simple `alert` is acceptable for Phase 8 per RESEARCH.md). Fall back to the existing local-line logic ONLY if `pack.variantId` is missing (Shopify outage edge case).
- **Type:** `auto` → parent invokes `shmocard-shopify-work` → splices guardrails → dispatches `design-system-builder` (Buybox.tsx is UI surface) → `design-system-auditor` → `shopify-data-checker` → `live-store-guard`
- **Files touched:**
  - `components/shmo-review/Buybox.tsx` (handleAdd rewrite + add loading state + remove all TODO(shopify) markers)
- **Requirement IDs:** PH8-BUYBOX-ACTION, PH8-NO-REGRESSION
- **Backend + UI dispatch prompt anchor:**

  > "Replace the placeholder `handleAdd` in `components/shmo-review/Buybox.tsx` (lines 130-150) with a real `addLineToCart` Server Action call. Add a loading state on the ATC button.
  >
  > **Live-store-protection guardrails (verbatim from shmocard-shopify-work skill):**
  > - Storefront API only. No Admin API.
  > - All cart mutations via `components/cart/actions.ts` (never bypass).
  > - Cart cookie is httpOnly — never exposed to JS.
  >
  > **Required changes in `components/shmo-review/Buybox.tsx`:**
  >
  > 1. **Imports (add):**
  > ```typescript
  > import { useState } from \"react\"; // already imported — confirm
  > import { addLineToCart } from \"@/components/cart/actions\";
  > import { mapShopifyCartLines } from \"@/components/cart/useCartHydration\";
  > ```
  >
  > 2. **State (add inside component):**
  > ```typescript
  > const [adding, setAdding] = useState(false);
  > const [addError, setAddError] = useState<string | null>(null);
  > ```
  >
  > 3. **handleAdd rewrite (full replacement of current lines 130-150):**
  > ```typescript
  > async function handleAdd() {
  >   const variantId = pack.variantId;
  >
  >   // Graceful degradation: if no variantId (Shopify outage / missing data),
  >   // do NOT attempt the mutation. Surface a soft error to the user.
  >   if (!variantId) {
  >     setAddError(\"Couldn't load product details. Refresh and try again.\");
  >     return;
  >   }
  >
  >   setAdding(true);
  >   setAddError(null);
  >   try {
  >     const cart = await addLineToCart(variantId, qty);
  >     const lines = mapShopifyCartLines(cart);
  >     useCartStore.getState().setCart(cart.id, cart.checkoutUrl, lines);
  >     openCart();
  >   } catch (err) {
  >     // Generic error — never echo Shopify's userErrors verbatim (phishing-surface)
  >     setAddError(\"Couldn't add to cart. Please try again.\");
  >     // Log to console for dev debugging — production logs surface in Vercel
  >     console.error(\"addLineToCart failed\", err);
  >   } finally {
  >     setAdding(false);
  >   }
  > }
  > ```
  >
  > 4. **ATC button loading state (replace existing ATC button at line 304):**
  > ```tsx
  > <button
  >   className=\"bb__cta shm-btn shm-btn--primary shm-btn--xl\"
  >   onClick={handleAdd}
  >   disabled={adding}
  >   aria-busy={adding}
  > >
  >   {adding ? \"Adding…\" : `Add to cart — $${lineTotal}`}
  > </button>
  > {addError && (
  >   <p className=\"bb__add-error\" role=\"alert\">{addError}</p>
  > )}
  > ```
  >
  > 5. **Remove the now-unused fake local line code path entirely.** Keep `addLine` and `openCart` imports (still used elsewhere if needed; if not, remove unused imports).
  >
  > 6. **Remove ALL `// TODO(shopify):` markers from `Buybox.tsx`.** Including the header comment block lines 7-14 (rewrite header to describe the wired state). The 6 inline TODO markers at lines 67, 74, 84, 131, 137-143 all clear in this plan.
  >
  > 7. **Add inline error message styling note:** the `bb__add-error` class needs minimal styling in `app/shmo-review/shmo-review.css` (or page-level CSS). Use design-system tokens:
  > ```css
  > .bb__add-error {
  >   margin-top: var(--space-2);
  >   color: var(--color-ember);
  >   font-family: var(--font-body);
  >   font-size: 0.875rem;
  > }
  > ```
  > Add to the existing `app/shmo-review/shmo-review.css` page-level file (layout-only CSS). Do NOT touch `.claude/skills/shmocard-design-system/components.css` (primitive CSS — separate scope).
  >
  > Constraints:
  > - `pack.variantId` is OPTIONAL on `BuyboxPack` type (added in 08-02). Handle null gracefully.
  > - Loading state must be accessible: `disabled` HTML attribute + `aria-busy`.
  > - Never echo raw Shopify errors to the UI. Generic message only.
  > - LAYOUT IS LOCKED — only the ATC button label + the new error paragraph change visually.
  > - Do NOT modify any other component.
  > - Do NOT modify any primitive CSS.
  > - Do NOT modify any page.tsx file.
  > - Do NOT add new dependencies.
  >
  > Verification target: after this plan ships, clicking ATC on any PDP triggers a real Shopify Storefront `cartLinesAdd` mutation, the cart cookie is set, the drawer opens with the real line."

- **Verification steps:**
  1. `grep -n "local-\\$" components/shmo-review/Buybox.tsx` returns 0 matches.
  2. `grep -n "TODO(shopify)" components/shmo-review/Buybox.tsx` returns 0 matches (all 6 cleared).
  3. `grep -n "addLineToCart" components/shmo-review/Buybox.tsx` returns 1+ matches (import + invocation).
  4. `grep -n "mapShopifyCartLines" components/shmo-review/Buybox.tsx` returns 1+ matches.
  5. `handleAdd` is `async`.
  6. ATC button shows `disabled={adding}` and `aria-busy={adding}`.
  7. ATC button label conditionally renders "Adding…" or "Add to cart — $X".
  8. Inline error paragraph with `role="alert"` renders when `addError` is set.
  9. `addError` message is generic — never includes Shopify's `userErrors` verbatim.
  10. `git diff --stat` shows `components/shmo-review/Buybox.tsx` + `app/shmo-review/shmo-review.css` modified (no other files).
  11. `npx tsc --noEmit` clean.
  12. Browser smoke: visit `/shmo-review/cr-80`, click ATC → DevTools Network tab shows POST to Shopify Storefront with `cartLinesAdd` mutation → response includes `cart.id` matching `gid://shopify/Cart/` prefix.
  13. Cart drawer opens with the real line (real product title, real Shopify variant title, real price, real CDN image URL).
  14. Cart cookie `shm-cart-id` set with `gid://shopify/Cart/...` value (DevTools → Application → Cookies).
  15. Cookie is `HttpOnly`, `Secure`, `SameSite=Lax`.
  16. ATC button briefly shows "Adding…" + disabled while mutation in-flight (~200ms — slow Network throttle to confirm).
  17. Repeat with L-Sign + Square Card PDPs — same behavior, different variant.
  18. Force a failure: temporarily break the variantId (e.g., set network throttle to offline) → click ATC → inline error renders, button re-enables, no console crash.
  19. `design-system-auditor` PASS — no primitive restyles; the new `.bb__add-error` is page-level (layout-only) per design-system rules.
  20. `shopify-data-checker` SAFE — Buybox no longer hardcodes product data (data comes from Shopify via page.tsx props).
  21. `live-store-guard` SAFE.
- **Commit message format:** `feat(buybox): wire handleAdd to real Storefront cartLinesAdd`

---

### 08-06 — Discount code support (mutation + Server Action + UI wire)

- **Goal:** Add `CART_DISCOUNT_CODES_UPDATE_MUTATION` to `lib/shopify/mutations.ts`. Add `applyDiscountCode(code: string): Promise<ShopifyCart>` Server Action to `components/cart/actions.ts`. Wire `CartDiscountForm.tsx` to call it. Display applied codes from `cart.discountCodes`. Surface inline errors for invalid/expired codes WITHOUT echoing the raw code (phishing-surface mitigation per security threat model). LOCKED in scope per D-02.
- **Type:** `auto` → parent invokes `shmocard-shopify-work` → splices guardrails → dispatches `design-system-builder` (CartDiscountForm.tsx is UI surface) → `design-system-auditor` → `shopify-data-checker` → `live-store-guard`
- **Files touched:**
  - `lib/shopify/mutations.ts` (add `CART_DISCOUNT_CODES_UPDATE_MUTATION`)
  - `lib/shopify/types.ts` (add `CartDiscountCodesUpdatePayload` + extend `ShopifyCart` with `discountCodes` field if not present)
  - `lib/shopify/queries.ts` (extend `CART_QUERY` + `CART_FIELDS_FRAGMENT` to include `discountCodes { code applicable }` if not already present)
  - `components/cart/actions.ts` (add `applyDiscountCode` Server Action)
  - `components/cart/CartDiscountForm.tsx` (wire handleApply, display applied codes, surface errors)
  - `components/cart/cart-drawer.css` (minor styling for applied-code chips + error message — page-level layout only)
- **Requirement IDs:** PH8-DISCOUNT-MUTATION, PH8-DISCOUNT-UI
- **Backend + UI dispatch prompt anchor:**

  > "Add discount code support to the cart. New mutation, new Server Action, UI wiring on the existing CartDiscountForm. Per D-02 (LOCKED): discount codes are in scope for Phase 8.
  >
  > **Live-store-protection guardrails (verbatim from shmocard-shopify-work skill):**
  > - Storefront API only. No Admin API.
  > - All cart mutations via `components/cart/actions.ts`.
  > - Cart cookie is httpOnly.
  >
  > **Security threat model — phishing-surface mitigation:**
  > Discount codes are user input. If the user enters `<script>alert(1)</script>` and Shopify rejects it, NEVER echo the rejected code verbatim in the error UI. Generic error message only.
  >
  > **⚠ MANDATORY IMPLEMENTATION ORDER (per plan-checker BLOCKER fix):**
  >
  > Implement steps in this EXACT sequence — DO NOT reorder. Each step's data contract is the prerequisite for the next. Run `npx tsc --noEmit` between Step 3 and Step 4 to verify the type plumbing before any component code runs against it:
  >
  > 1. **Step 1** — mutation (GraphQL definition)
  > 2. **Step 2** — types: add `ShopifyDiscountCode` AND extend `ShopifyCart` with `discountCodes: ShopifyDiscountCode[]` (REQUIRED, NOT OPTIONAL — making it required turns a missing fragment into a `tsc` compile error rather than a silent runtime `undefined`).
  > 3. **Step 3** — `CART_FIELDS_FRAGMENT`: add `discountCodes { code applicable }` to the GraphQL fragment so it's fetched on every cart query. **Run `npx tsc --noEmit` here — must be clean before continuing.**
  > 4. **Step 4** — Server Actions: `applyDiscountCode` + `clearDiscountCodes` in `components/cart/actions.ts`.
  > 5. **Step 6** — Zustand store: extend `setCart` to accept `discountCodes` as the 4th parameter, store on state. (Step 6 BEFORE Step 5 — store signature must exist before any component calls it with the new arg.)
  > 6. **Step 7** — `useCartHydration.ts`: pass `cart.discountCodes` to `setCart` on every hydration call. (Step 7 BEFORE Step 5 — hydration must populate the store so the form sees applied codes on mount.)
  > 7. **Step 5** — UI: `CartDiscountForm.tsx` component + integrate into `CartDrawer`. (LAST — depends on all above.)
  > 8. **Step 8** — Final `tsc --noEmit` clean across all touched files.
  >
  > Step numbers in the body below match the dispatch numbering (Step 1, 2, 3, 4, 5, 6, 7, 8) but the IMPLEMENTATION ORDER above overrides — Step 6 + 7 implement BEFORE Step 5.
  >
  > **Step 1: Update `lib/shopify/mutations.ts`** — add at the end of the file (preserve CART_FIELDS_FRAGMENT import + existing mutations):
  >
  > ```typescript
  > export const CART_DISCOUNT_CODES_UPDATE_MUTATION = /* GraphQL */ \`
  >   ${CART_FIELDS_FRAGMENT}
  >   mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
  >     cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
  >       cart { ...CartFields }
  >       userErrors { field message }
  >     }
  >   }
  > \`;
  > ```
  >
  > **Step 2: Update `lib/shopify/types.ts`** — add (preserve existing exports):
  >
  > ```typescript
  > export type ShopifyDiscountCode = {
  >   code: string;
  >   applicable: boolean;
  > };
  >
  > // Extend ShopifyCart with discountCodes — REQUIRED, not optional.
  > // Making this REQUIRED ensures a missing CART_FIELDS_FRAGMENT update is a
  > // compile-time `tsc` error, not a silent runtime undefined (per plan-checker BLOCKER fix).
  > // export type ShopifyCart = { ...; discountCodes: ShopifyDiscountCode[]; ... }
  >
  > export type CartDiscountCodesUpdatePayload = {
  >   cartDiscountCodesUpdate: {
  >     cart: ShopifyCart | null;
  >     userErrors: ShopifyUserError[];
  >   };
  > };
  > ```
  >
  > **Step 3: Update `lib/shopify/queries.ts` and `lib/shopify/mutations.ts` CART_FIELDS_FRAGMENT** — add `discountCodes { code applicable }` to the cart fragment so every cart mutation/query returns applied codes. This ensures `addLineToCart` / `updateCartLine` / `removeCartLine` results also surface the current discount state.
  >
  > **Step 4: Add `applyDiscountCode` Server Action to `components/cart/actions.ts`:**
  >
  > ```typescript
  > // Add to the export block, after removeCartLine.
  >
  > const DISCOUNT_CODE_MAX_LENGTH = 256;
  >
  > function sanitizeDiscountCode(code: string): string {
  >   if (typeof code !== \"string\") throw new Error(\"Invalid discount code\");
  >   const trimmed = code.trim();
  >   if (trimmed.length === 0) throw new Error(\"Discount code is empty\");
  >   if (trimmed.length > DISCOUNT_CODE_MAX_LENGTH) {
  >     throw new Error(\"Discount code too long\");
  >   }
  >   return trimmed;
  > }
  >
  > /**
  >  * Applies a discount code to the current cart. If no cart exists, throws.
  >  * To replace all applied codes, pass an empty string (Storefront accepts
  >  *   an empty array to clear codes).
  >  *
  >  * Storefront validates the code itself; we forward it raw (sanitized for
  >  * length/type) and let Shopify decide if it's valid. Invalid codes return
  >  * via userErrors — we bubble a GENERIC error message to avoid echoing
  >  * the raw code in UI (phishing-surface mitigation).
  >  */
  > export async function applyDiscountCode(code: string): Promise<ShopifyCart> {
  >   const safe = sanitizeDiscountCode(code);
  >
  >   const cartId = await readCartCookie();
  >   if (!cartId) throw new Error(\"applyDiscountCode: no cart cookie\");
  >   assertCartId(cartId);
  >
  >   const { data } = await shopifyFetch<CartDiscountCodesUpdatePayload>({
  >     query: CART_DISCOUNT_CODES_UPDATE_MUTATION,
  >     variables: {
  >       cartId,
  >       discountCodes: [safe],
  >     },
  >     cache: \"no-store\",
  >   });
  >   bubbleUserErrors(data.cartDiscountCodesUpdate.userErrors);
  >   const cart = data.cartDiscountCodesUpdate.cart;
  >   if (!cart) throw new Error(\"cartDiscountCodesUpdate returned null cart\");
  >   return cart;
  > }
  >
  > /**
  >  * Clears all applied discount codes from the cart.
  >  */
  > export async function clearDiscountCodes(): Promise<ShopifyCart> {
  >   const cartId = await readCartCookie();
  >   if (!cartId) throw new Error(\"clearDiscountCodes: no cart cookie\");
  >   assertCartId(cartId);
  >
  >   const { data } = await shopifyFetch<CartDiscountCodesUpdatePayload>({
  >     query: CART_DISCOUNT_CODES_UPDATE_MUTATION,
  >     variables: { cartId, discountCodes: [] },
  >     cache: \"no-store\",
  >   });
  >   bubbleUserErrors(data.cartDiscountCodesUpdate.userErrors);
  >   const cart = data.cartDiscountCodesUpdate.cart;
  >   if (!cart) throw new Error(\"cartDiscountCodesUpdate returned null cart\");
  >   return cart;
  > }
  > ```
  >
  > Don't forget to import `CART_DISCOUNT_CODES_UPDATE_MUTATION` and `CartDiscountCodesUpdatePayload` at the top of `actions.ts`.
  >
  > **Step 5: Wire `components/cart/CartDiscountForm.tsx`** — full rewrite:
  >
  > ```typescript
  > \"use client\";
  >
  > // CartDiscountForm — discount code input. Calls applyDiscountCode Server Action.
  > // Displays currently-applied codes (from cart.discountCodes) above the input.
  > // Surfaces generic error messages — never echoes the rejected code (phishing surface).
  >
  > import { useRef, useState, useTransition } from \"react\";
  >
  > import { applyDiscountCode, clearDiscountCodes } from \"@/components/cart/actions\";
  > import { useCartStore } from \"@/components/cart/store\";
  > import { mapShopifyCartLines } from \"@/components/cart/useCartHydration\";
  >
  > export default function CartDiscountForm() {
  >   const inputRef = useRef<HTMLInputElement>(null);
  >   const [error, setError] = useState<string | null>(null);
  >   const [pending, startTransition] = useTransition();
  >   const appliedCodes = useCartStore((s) => s.discountCodes ?? []);
  >
  >   const handleApply = () => {
  >     const code = inputRef.current?.value ?? \"\";
  >     if (!code.trim()) {
  >       setError(\"Enter a code\");
  >       return;
  >     }
  >     setError(null);
  >     startTransition(async () => {
  >       try {
  >         const cart = await applyDiscountCode(code);
  >         const lines = mapShopifyCartLines(cart);
  >         useCartStore.getState().setCart(cart.id, cart.checkoutUrl, lines, cart.discountCodes);
  >         if (inputRef.current) inputRef.current.value = \"\";
  >         // If Shopify accepted the code but marked it not-applicable, surface gently
  >         const justApplied = cart.discountCodes.find((dc) => !dc.applicable);
  >         if (justApplied) setError(\"That code isn't applicable to this cart.\");
  >       } catch {
  >         // Generic error — never echo the user's input
  >         setError(\"That code isn't valid.\");
  >       }
  >     });
  >   };
  >
  >   const handleRemove = (code: string) => {
  >     setError(null);
  >     startTransition(async () => {
  >       try {
  >         const cart = await clearDiscountCodes();
  >         const lines = mapShopifyCartLines(cart);
  >         useCartStore.getState().setCart(cart.id, cart.checkoutUrl, lines, cart.discountCodes);
  >       } catch {
  >         setError(\"Couldn't remove code. Try again.\");
  >       }
  >     });
  >   };
  >
  >   return (
  >     <details className=\"shm-cart-discount\" open={appliedCodes.length > 0}>
  >       <summary>Have a code?</summary>
  >       {appliedCodes.length > 0 && (
  >         <ul className=\"shm-cart-discount__applied\" aria-label=\"Applied codes\">
  >           {appliedCodes.map((dc) => (
  >             <li key={dc.code} className=\"shm-cart-discount__chip\">
  >               <span>{dc.code}</span>
  >               <button
  >                 type=\"button\"
  >                 onClick={() => handleRemove(dc.code)}
  >                 aria-label={`Remove ${dc.code}`}
  >                 disabled={pending}
  >               >
  >                 ×
  >               </button>
  >             </li>
  >           ))}
  >         </ul>
  >       )}
  >       <div className=\"shm-cart-discount__row\">
  >         <input
  >           ref={inputRef}
  >           type=\"text\"
  >           placeholder=\"Discount code\"
  >           defaultValue=\"\"
  >           disabled={pending}
  >           maxLength={256}
  >         />
  >         <button type=\"button\" onClick={handleApply} disabled={pending}>
  >           {pending ? \"…\" : \"Apply\"}
  >         </button>
  >       </div>
  >       {error && <p className=\"shm-cart-discount__error\" role=\"alert\">{error}</p>}
  >     </details>
  >   );
  > }
  > ```
  >
  > **Step 6: Update `components/cart/store.ts`** — extend Zustand store with `discountCodes` field and update `setCart` signature to accept the 4th `discountCodes` argument. Backward-compatible (default to empty array if not passed).
  >
  > **Step 7: Update `components/cart/useCartHydration.ts`** — when hydrating from `getCartFromCookie`, pass `cart.discountCodes ?? []` to `setCart`.
  >
  > **Step 8: Add minimal styling to `components/cart/cart-drawer.css`** for `.shm-cart-discount__applied`, `.shm-cart-discount__chip`, `.shm-cart-discount__error`. Use design-system tokens (`--color-cream`, `--color-cocoa-deep`, `--color-ember` for error state, `--space-2`, `--radius-sm`). Page-level layout CSS only — do NOT touch primitive CSS in `.claude/skills/shmocard-design-system/components.css`.
  >
  > LAYOUT IS LOCKED for the cart drawer's overall structure. The discount form already lives in the cart footer — only its internal content changes (chip list above the input + error message below).
  >
  > Do NOT:
  > - Echo the user's discount code in any error message.
  > - Log discount codes to the console in production.
  > - Add Admin API references.
  > - Write to `.env*`.
  > - Modify Buybox or any PDP page."

- **Verification steps:**
  1. `CART_DISCOUNT_CODES_UPDATE_MUTATION` exported from `lib/shopify/mutations.ts`.
  2. `lib/shopify/types.ts` includes `ShopifyDiscountCode` + `CartDiscountCodesUpdatePayload` exports.
  3. `ShopifyCart` type includes `discountCodes: ShopifyDiscountCode[]`.
  4. `CART_FIELDS_FRAGMENT` includes `discountCodes { code applicable }`.
  5. `applyDiscountCode` and `clearDiscountCodes` exported from `components/cart/actions.ts`.
  6. `sanitizeDiscountCode` validates type, non-empty, ≤ 256 chars.
  7. `bubbleUserErrors` is called on `data.cartDiscountCodesUpdate.userErrors` — invalid codes throw (caught in CartDiscountForm and converted to generic error).
  8. `CartDiscountForm.tsx` calls `applyDiscountCode` via `useTransition`, never echoes the user's input in any error message.
  9. Cart drawer shows applied code chips above input when `appliedCodes.length > 0`.
  10. Each chip has a remove button calling `clearDiscountCodes`.
  11. Input is `maxLength={256}` and `disabled` during pending.
  12. `git diff --stat` shows the 6 expected files modified.
  13. `npx tsc --noEmit` clean.
  14. Browser smoke (against a real Shopify discount code from Jordan's admin):
      - Add a CR-80 pack to cart → drawer opens
      - Click "Have a code?" → enter the valid code → click Apply → chip appears, total reduces
      - Click ×on the chip → chip disappears, total restores
      - Enter `INVALID-CODE` → generic error "That code isn't valid." renders → input clears or retains depending on choice → no echo of the user's input
      - Enter `<script>alert(1)</script>` → maxLength + sanitization apply → error message is GENERIC, never renders the user input
  15. Network tab confirms `cartDiscountCodesUpdate` mutation called with sanitized code.
  16. No console errors. No XSS surface — error messages are static strings.
  17. `design-system-auditor` PASS — chip + error styling uses design-system tokens, no primitive restyles.
  18. `shopify-data-checker` SAFE.
  19. `live-store-guard` SAFE.
- **Commit message format:** `feat(cart): wire discount code support via cartDiscountCodesUpdate`

---

### 08-07 — PDP gallery image CDN swap verification + local fallback cleanup

- **Goal:** Verify mapping helper emits Shopify CDN URLs (the helper already builds gallery from `product.images.nodes[].url` — confirmation step). Network tab inspection on all 3 PDPs confirms `cdn.shopify.com` host. If Jordan confirms in 08-01 that all 3 products have full Shopify image coverage, remove the local fallback `public/products/*` paths from any remaining code references (likely none after 08-03/08-04, but verify). If image coverage is partial, KEEP the fallback assets (graceful degradation). Local `public/products/*` files stay on disk regardless — separate cleanup phase can delete them.
- **Type:** `auto` → parent invokes `shmocard-shopify-work` → splices guardrails → dispatches `design-system-builder` if any UI cleanup needed; otherwise verification-only via parent
- **Files touched (conditional):**
  - `components/shmo-review/FormatPicker.tsx` (only if Jordan confirms full image coverage in 08-01 → remove fallback image constants per T17)
  - `.planning/phases/08-shopify-storefront-wiring/08-07-image-cdn-NOTES.md` (NEW — verification log)
  - NO changes to `public/products/*` files (kept on disk for now)
- **Requirement IDs:** PH8-IMAGE-CDN
- **Dispatch prompt anchor (audit-first, conditional cleanup):**

  > "Verify Phase 8's PDP gallery image swap to Shopify CDN URLs is working end-to-end. Conditional cleanup if Jordan confirms full image coverage.
  >
  > **Live-store-protection guardrails (verbatim from shmocard-shopify-work skill):**
  > - Storefront API only.
  > - No domain, payment, or theme touches.
  >
  > **Verification phase (always runs):**
  >
  > 1. Visit `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card` in browser.
  > 2. DevTools → Network tab → filter `img`.
  > 3. Confirm the Buybox gallery images on each PDP load from `cdn.shopify.com` (NOT `localhost/products/*`).
  > 4. Record per-PDP results in `.planning/phases/08-shopify-storefront-wiring/08-07-image-cdn-NOTES.md`:
  >    - CR-80: main + thumbnail image hosts (all should be cdn.shopify.com if Shopify has images)
  >    - L-Sign: same
  >    - Square Card: same
  > 5. If ANY image still loads from `localhost/products/*` — that's the graceful fallback firing. Record which product is using fallback.
  >
  > **Conditional cleanup (only if 08-01 confirmed full image coverage):**
  >
  > Read `.planning/phases/08-shopify-storefront-wiring/08-01-admin-gate-NOTES.md`. If ALL 3 products have image_count ≥ 1 (Task 3 results), the local fallback is dead code on the PDPs and can be removed from `FormatPicker.tsx` (T17).
  >
  > In `components/shmo-review/FormatPicker.tsx` (around line 55), find the local fallback image constants and the conditional that uses them when `product.featuredImage` is null. Remove the constants. Update the conditional to render a generic placeholder or empty state if `product.featuredImage` is null (Shopify failed). LAYOUT IS LOCKED — only remove dead code, don't restructure the FormatPicker layout.
  >
  > If image coverage is partial (any product image_count is 0), SKIP the cleanup. Document in notes file: \"Local fallback assets retained — Shopify image coverage partial.\"
  >
  > **Files NOT touched in this plan:**
  > - `public/products/*` (assets stay on disk — separate cleanup phase removes them)
  > - `Buybox.tsx` (no local fallback there — already entirely Shopify-driven post-08-05)
  > - Any page.tsx
  >
  > Do NOT:
  > - Delete files from `public/products/*`.
  > - Modify Shopify product images via Admin API.
  > - Touch primitive CSS."

- **Verification steps:**
  1. `08-07-image-cdn-NOTES.md` exists with per-PDP image host findings.
  2. On at least 1 PDP (probably all 3 if 08-01 confirmed full image coverage), main gallery + thumbnail images load from `cdn.shopify.com`.
  3. If any PDP still loads from `localhost/products/*`, that's documented as fallback behavior with which product is affected.
  4. `npx tsc --noEmit` clean.
  5. `npm run build` clean.
  6. `design-system-auditor` PASS if FormatPicker.tsx was modified; SKIP if no UI changes.
  7. `shopify-data-checker` SAFE.
  8. `live-store-guard` SAFE.
- **Commit message format:** `feat(pdp): verify Shopify CDN image swap (+ optional fallback cleanup)`
- **Skip rule:** Verification always runs. FormatPicker cleanup runs ONLY if 08-01 confirmed full image coverage.

---

### 08-08 — Cross-PDP end-to-end smoke + webhook verification

- **Goal:** End-to-end smoke test across all 3 PDPs. Verify: add to cart → cart drawer renders correctly → discount code applies → checkout URL redirects to Shopify-hosted checkout with correct line items + discount → webhook revalidation works on a product update. Documented in `08-08-cross-pdp-smoke-NOTES.md`. No code changes expected — if a regression surfaces, this plan is the catch.
- **Type:** `auto` → parent invokes `shmocard-shopify-work` → splices guardrails → dispatches `design-system-builder` (audit-only) → no auditor required (no UI edits expected)
- **Files touched:**
  - `.planning/phases/08-shopify-storefront-wiring/08-08-cross-pdp-smoke-NOTES.md` (NEW)
  - NO code changes in this plan
- **Requirement IDs:** PH8-CROSS-PDP-SMOKE, PH8-CHECKOUT-REDIRECT, PH8-NO-REGRESSION
- **Dispatch prompt anchor:**

  > "Cross-PDP end-to-end smoke test. NO CODE CHANGES IN THIS PLAN. Pure verification + findings file. If issues found, surface to parent — do NOT fix inline; parent will route to a targeted polish plan.
  >
  > **Live-store-protection guardrails (verbatim from shmocard-shopify-work skill):**
  > - Read-only verification. No mutations to Shopify Admin. No domain / payment / theme touches.
  >
  > **Smoke test matrix:**
  >
  > For each PDP (`/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`):
  >
  > 1. Visit PDP at desktop (1280px). Verify Buybox renders LIVE Shopify title (DevTools Elements → confirm `<h2 className=\"bb__title\">` contains the Shopify product title, not the placeholder \"Google Review NFC ...\").
  > 2. Verify pack rows render real Shopify variant prices (cross-reference Shopify Admin variants page).
  > 3. Verify gallery main image + thumbnails load from `cdn.shopify.com` (Network tab).
  > 4. Click \"Add to cart\" on the 10-pack (Most Popular) row.
  >    - Network tab: POST to Shopify Storefront GraphQL with `cartLinesAdd` mutation (or `cartCreate` on first add).
  >    - Cart cookie `shm-cart-id` set with `gid://shopify/Cart/...` value (Application → Cookies).
  >    - Cookie attributes: HttpOnly, Secure, SameSite=Lax.
  >    - Cart drawer opens.
  > 5. Verify drawer line:
  >    - Title matches Shopify Admin product title.
  >    - Variant title matches Shopify Admin variant title (e.g., \"10 Cards\").
  >    - Price matches Shopify variant price × 1 (quantity).
  >    - Image loads from cdn.shopify.com.
  > 6. Close drawer, navigate to next PDP, add another pack. Verify drawer now shows 2 lines (cookie carries cart identity across navigation).
  > 7. After all 3 PDPs visited:
  >    - Drawer shows 3 lines (CR-80, L-Sign, Square Card).
  >    - Subtotal matches sum of line prices.
  > 8. Apply a discount code:
  >    - Open \"Have a code?\" details element.
  >    - Enter a valid discount code (Jordan provides one — e.g., a test code from Shopify Admin → Discounts).
  >    - Click Apply.
  >    - Network tab: `cartDiscountCodesUpdate` mutation called.
  >    - Chip appears with the code; total reduces.
  > 9. Click checkout button:
  >    - Network tab: assertion on `cart.checkoutUrl` (no network call — client-side redirect).
  >    - Browser redirects to Shopify-hosted checkout (host: `shop.shmocard.com` OR `<store>.myshopify.com`).
  >    - Checkout page shows all 3 line items.
  >    - Checkout page shows the discount applied (\"Promo: TESTCODE\" with reduction).
  >
  > **Webhook revalidation smoke:**
  >
  > 1. In Shopify Admin → Products → CR-80 product, edit the title (e.g., append \" v2\") and save.
  > 2. Wait ~5 seconds.
  > 3. Hard-refresh `/shmo-review/cr-80` (Cmd+Shift+R on Mac).
  > 4. Verify Buybox title now shows \" v2\" suffix.
  > 5. REVERT the title in Shopify Admin (remove the \" v2\" suffix).
  > 6. Hard-refresh `/shmo-review/cr-80`, verify title reverts.
  >
  > **Error path smoke:**
  >
  > 1. Apply an invalid discount code (e.g., `BOGUS123`).
  > 2. Verify inline error renders generic text: \"That code isn't valid.\" (NOT echoing `BOGUS123`).
  > 3. Verify the user's input is preserved or cleared per UX choice — but the REJECTED code never appears in the rendered error.
  >
  > **Negative test — Shopify outage simulation:**
  >
  > 1. Block `cdn.shopify.com` via DevTools → Network → Request blocking (or hosts file).
  > 2. Refresh a PDP.
  > 3. Verify graceful degradation: page renders, falls back to local images if available OR renders empty gallery without 500.
  > 4. Unblock and re-verify normal load.
  >
  > Document all results in `.planning/phases/08-shopify-storefront-wiring/08-08-cross-pdp-smoke-NOTES.md` using a per-PDP × per-step pass/fail table. Final line: 'phase 8 ready to close' OR 'issues surfaced: [list]'.
  >
  > Do NOT:
  > - Edit any `.tsx` or `.css` file.
  > - Edit any page.tsx.
  > - Modify any Shopify Admin setting except the temporary CR-80 title edit (which gets REVERTED in step 5).
  > - Place a real order at checkout (use the checkout-loaded page as the end of the test; do not enter payment details). To exit checkout, just close the tab."

- **Verification steps:**
  1. `08-08-cross-pdp-smoke-NOTES.md` exists with all 4 test sections (smoke matrix, webhook, error path, outage simulation) completed.
  2. All 3 PDPs pass the add-to-cart → drawer → checkout flow.
  3. Discount code applied + cleared successfully.
  4. Checkout URL passes `assertCheckoutUrl` (no thrown error in console).
  5. Webhook revalidation confirmed: title edit in Shopify Admin reflects on PDP within ~5s.
  6. Invalid discount code surfaces generic error without echoing input.
  7. Outage simulation passes: graceful degradation, no 500.
  8. CR-80 product title REVERTED in Shopify Admin (no leftover " v2" suffix).
  9. Notes file's final line is either "phase 8 ready to close" or "issues surfaced: [list]".
- **Commit message format:** `docs(phase-8): cross-PDP end-to-end smoke notes`
- **Skip rule:** Never skips — this is the exit gate.

---

### 08-09 — Phase close-out

- **Goal:** Final sweep. `tsc` + `npm run build` clean. Update STATE / ROADMAP / handoff / scope / write SUMMARY. Phase 8 closed. Recommend next phase (`/gsd-plan-phase 9` — likely launch readiness / a11y polish per ROADMAP).
- **Type:** `checkpoint:human-verify` (close-out)
- **Files touched:**
  - `.planning/STATE.md` (status update — Phase 8 complete)
  - `.planning/ROADMAP.md` (mark Phase 8 `[x] complete`, add completion date)
  - `context/general/handoff.md` (Phase 8 close summary)
  - `context/general/scope.md` (update live punch list — Phase 8 done, next phase ready)
  - `.planning/phases/08-shopify-storefront-wiring/08-SUMMARY.md` (NEW — phase close)
- **Requirement IDs:** PH8-TSC, PH8-BUILD, PH8-NO-REGRESSION
- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `npm run build` clean — all routes build successfully.
  3. Build output shows 3 PDPs as dynamic / ISR routes (using `force-cache` + tags from `getProductByHandle`).
  4. Dev server smoke: `/`, `/shmo-review`, `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card` all load without console errors.
  5. All 3 PDPs show LIVE Shopify product titles + prices + CDN images.
  6. Add to cart on each PDP succeeds, drawer opens with real Shopify line data.
  7. Discount code field functional on cart drawer.
  8. Checkout button redirects to Shopify-hosted checkout.
  9. Webhook revalidation confirmed working (per 08-08).
  10. Update `.planning/STATE.md` → "Phase 8 complete. Shopify Storefront fully wired. Site is shoppable. Phase 9 (launch readiness) ready."
  11. Update `.planning/ROADMAP.md` → mark Phase 8 `[x] complete`, add completion date `2026-05-20` (or actual completion date).
  12. Update `context/general/handoff.md` with Phase 8 close summary: 3 PDPs wired to Shopify, Buybox.handleAdd calls addLineToCart, discount codes supported, image CDN swap verified, webhooks confirmed.
  13. Update `context/general/scope.md` punch-list: Phase 8 → done. Note site is technically shoppable but Vercel deploy / DNS cutover still gated on full design approval (MEMORY rule).
  14. Write `.planning/phases/08-shopify-storefront-wiring/08-SUMMARY.md` with: what shipped (mapping helper, 3 PDPs wired, Buybox action wire, discount support, CDN swap, smoke test), what didn't ship (variant metafields for save/note/pop — deferred), atomic plan status table (08-01 through 08-09 with commit hashes), exit criteria check.
- **Checkpoint:** Jordan confirms phase exit criteria pass. Phase 8 closed. Recommend next phase planning.
- **Commit message format:** `chore(phase-8): close out Shopify Storefront wiring phase`

---

## Open decisions

Locked decisions from the user (2026-05-20) are baked in and not re-litigable:

1. ✅ **D-01 — Variant structure: 1 product / 4 variants per format** — LOCKED. Standard Shopify pattern. 08-01 admin gate is the first verification step. If Shopify has a different structure, 08-01 surfaces it BEFORE any code changes.
2. ✅ **D-02 — Discount/promo codes IN SCOPE for Phase 8** — LOCKED. 08-06 delivers the mutation + Server Action + UI wire.
3. ✅ **D-03 — Storefront API only (read-only Admin)** — LOCKED. No Admin API writes. No domain / theme / payment touches. `live-store-protection.md` is supreme.
4. ✅ **D-04 — L-Sign handle bug fix in Phase 8** — LOCKED. `'shmo-review-l-sign'` → `'google-review-nfc-tap-card-l-sign'`. Happens in 08-04 when the hardcoded constant is removed entirely.
5. ✅ **D-05 — Images swap from `public/products/` to Shopify CDN** — LOCKED. Mapping helper emits CDN URLs from `product.images.nodes`. Local fallback retained for graceful degradation if Shopify image coverage is partial.
6. ✅ **D-06 — Next.js 15 App Router server components + `cache()` + `fetch` with `next.revalidate` tag** — LOCKED. `getProductByHandle` already uses `force-cache` + tags. No `React.cache()` wrapper needed (Next.js 15 fetch deduplication handles same-request dedup).
7. ✅ **D-07 — Backend work via `shmocard-shopify-work` skill wrapper** — LOCKED per `.claude/rules/subagent-dispatch.md`. Parent invokes the wrapper BEFORE every backend dispatch, splices the live-store-protection guardrails into the dispatch prompt verbatim.
8. ✅ **D-08 — UI surfaces via `design-system-builder`** — LOCKED. Cart drawer + discount form UI in 08-06 dispatches via design-system-builder PLUS shmocard-shopify-work for the data-layer guardrails.

Unresolved items resolved in execution (not Jordan-blocking):

9. **Variant title format** — Verified in 08-01 Task 2. If variants are titled `"Default Title"` or non-numeric, 08-01 surfaces this and mapping helper design must change. Default assumption: variants are titled `"<integer> Card(s)"` or similar parseable format.
10. **Image coverage per product** — Verified in 08-01 Task 3. Drives 08-07's conditional fallback cleanup. Default assumption: full coverage (all 3 products have images).
11. **Pack `save`/`note`/`pop` metadata source** — Hardcoded in mapping helper's `PACK_STATIC` table keyed by qty (1/2/5/10). Phase 9+ can add Shopify metafields if Jordan wants merchant-editable badge text.
12. **Cart-smoke route cleanup** — `/cart-smoke` is dev harness from Phase 3. Stays through Phase 8 (still useful for debugging). Separate cleanup phase deletes it.

---

## Risks

1. **08-01 admin gate fails — variant structure wrong.** If Shopify variants are separate products instead of one-product-per-format, mapping helper must be redesigned. Mitigation: 08-01 is the entry gate; surfaces this BEFORE 08-02 starts.
2. **08-01 admin gate fails — variant title format wrong.** If variants are titled `"Default Title"`, `parseQty` returns null and packs filter to empty. Mitigation: 08-01 Task 2 records actual variant titles; mapping helper updated if needed. Worst case: fallback to position-based qty mapping (variant[0] = 1-pack, variant[1] = 2-pack, etc).
3. **`SHOPIFY_PRIMARY_DOMAIN` not set in Vercel — checkout redirect 401s in production.** Mitigation: 08-01 Task 4 explicitly verifies. Also: `assertCheckoutUrl` allow-list includes `*.myshopify.com` so dev / preview still works without it.
4. **Webhook signature verification fails — revalidation broken.** Mitigation: 08-01 Task 7 smoke tests the webhook before 08-02 starts. Vercel function logs show HMAC mismatch as a 401.
5. **Cart cookie not setting in dev (sameSite=lax + httpOnly + secure on localhost).** Already mitigated in Phase 3 — cookie works on localhost in dev. If regression, network tab Set-Cookie header confirms.
6. **`addLineToCart` throws because variant ID is missing.** RESEARCH.md Pitfall 1. Mitigation: 08-05 explicit guard — if `pack.variantId` is null/undefined, show inline error instead of throwing.
7. **`mapShopifyCartLines` shape doesn't match `setCart` signature after 08-06's `discountCodes` field added.** Mitigation: 08-06 Step 6/7 updates store + hydration signature in lockstep. `tsc --noEmit` catches type mismatch.
8. **Discount code throws phishing-surface bug — error UI echoes user input.** Security threat T-08-03. Mitigation: 08-06 prompt is explicit about generic error messages; 08-08 includes XSS test (`<script>` payload) verifying NO echo.
9. **Discount code reduces price but checkout doesn't honor it.** Mitigation: 08-08 Step 9 confirms checkout reflects the applied discount. If Shopify allows the code in API but blocks at checkout, surface to Jordan — likely an admin-side discount config issue, not a code bug.
10. **Live Shopify product titles overflow Buybox h2 layout.** This is the kind of regression Phase 7 wanted to land before Phase 8 to AVOID — but Phase 7 ran with placeholder strings. If real Shopify titles are longer/shorter than placeholders, Buybox layout may shift. Mitigation: 08-08 smoke at desktop + mobile catches this. If it shifts, surface as a Phase 8.1 polish plan, do NOT fix inline. Per MEMORY rule: LAYOUT IS LOCKED unless explicit polish task.
11. **Webhook hits production URL during local dev — revalidates production unexpectedly.** Mitigation: 08-01 webhook URLs are `https://shmocard.com/api/revalidate` only (no dev URL configured). Local dev doesn't receive webhooks. Production revalidation only fires from production Shopify Admin edits.
12. **Cart drawer's CartDiscountForm renders before `discountCodes` field added to Zustand store — runtime error.** Mitigation: 08-06 Step 6 updates store FIRST in commit order; CartDiscountForm.tsx changes commit AFTER store extension. Single plan but logical sub-order.
13. **Existing `/cart-smoke` route breaks after store signature change in 08-06.** Mitigation: cart-smoke is a dev harness — if it breaks, fix or delete in 08-09 close-out. Not a blocker; not customer-facing.
14. **Builder restructures Buybox layout while wiring handleAdd in 08-05.** MEMORY rule: LAYOUT IS LOCKED. The 08-05 dispatch prompt carries the explicit flag. `design-system-auditor` verifies no structural HTML changes.
15. **Pre-commit chain (auditor → shopify-data-checker → live-store-guard) blocks commits unexpectedly.** Mitigation: each plan's verification steps mirror what the auditors check. If a check fails, the plan's prompt enumerates the fix needed (e.g., "Do not hardcode product title").
16. **Phase scope creep — variant metafields for save/note/pop.** RESEARCH.md OQ-9. Mitigation: 08-02 hardcodes via `PACK_STATIC` table. Metafields are out of scope for Phase 8 per locked decision. If Jordan asks mid-phase, push to Phase 9+.
17. **Open-redirect via cart.checkoutUrl.** Already mitigated by `assertCheckoutUrl` in `components/cart/actions.ts`. 08-08 Step 9 confirms the validator fires on the actual checkout URL Shopify returns.

---

## Threat model

**Trust boundaries:**

| Boundary | Description |
|---|---|
| Browser → Server Action | User clicks ATC / Apply Discount / Remove Discount in client component. Variant ID, quantity, discount code travel from client to Server Action. Variant ID validated against GID prefix (`assertVariantId`); quantity validated as integer 1..99 (`assertQuantity`); discount code sanitized (`sanitizeDiscountCode`). |
| Server Action → Shopify Storefront | All Shopify mutations via `shopifyFetch` in `lib/shopify/index.ts`. Storefront access token in `SHOPIFY_STOREFRONT_ACCESS_TOKEN` env var — never exposed to client (server-only file). |
| Shopify Storefront → Server Action response | `cart.checkoutUrl` validated against allowlist by `assertCheckoutUrl` before browser redirect. `userErrors` bubble as thrown Errors — caught by client and rendered as GENERIC messages (no verbatim echo). |
| Shopify Admin → Webhook → /api/revalidate | HMAC SHA-256 base64 signature verified against `SHOPIFY_REVALIDATION_SECRET` (timing-safe compare). Raw body read before JSON parse. Already implemented in `app/api/revalidate/route.ts`. |
| `.env.local` → runtime | Storefront token, revalidation secret, primary domain live in `.env.local` (gitignored) + Vercel env. Server-only access. Pre-tool-use hook in `.claude/settings.json` blocks any `.env*` write. |
| User → Discount code input | User-supplied string. Sanitized (type, non-empty, ≤ 256 chars) before mutation. Rejected codes never echoed in error UI (phishing-surface mitigation). |
| Cart cookie → Server Action | `shm-cart-id` cookie. HttpOnly, Secure, SameSite=Lax, 14-day max-age. JS cannot read. Server Actions read via `cookies()` from `next/headers`. Validated against `gid://shopify/Cart/` prefix (`assertCartId`). |

**STRIDE register (ASVS L1, project default = block on `high` only):**

| Threat ID | Category | Component | Disposition | Mitigation |
|---|---|---|---|---|
| T-08-01 | Tampering (cart mutation injection) | `addLineToCart` Server Action | mitigate | `assertVariantId` checks GID prefix `gid://shopify/ProductVariant/`. `assertQuantity` checks integer 1..99. Variant ID comes from `mapVariantToPack(variant).variantId` — server-derived from the same Storefront fetch that delivered the variant. Client cannot supply arbitrary variant IDs. |
| T-08-02 | Tampering (discount code injection) | `applyDiscountCode` Server Action | mitigate | `sanitizeDiscountCode` rejects non-string, empty, or >256 chars input. Storefront validates code itself; we forward raw (sanitized) and let Shopify decide. `userErrors` bubble as thrown Errors. |
| T-08-03 | Spoofing / Phishing (discount code error echoes user input) | `CartDiscountForm.tsx` error rendering | mitigate | Error UI renders GENERIC static strings only: "That code isn't valid." / "Enter a code". Never inserts the user's input into rendered text. 08-06 prompt explicitly enforces; 08-08 includes XSS payload smoke test. |
| T-08-04 | Spoofing / Open redirect (cart.checkoutUrl) | `CartCheckoutButton` → `assertCheckoutUrl` | mitigate | Already implemented in `components/cart/actions.ts`. Validates against allowlist (`*.myshopify.com`, `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_PRIMARY_DOMAIN`, `shop.<both>`). Rejects non-https, embedded credentials, non-allowlisted hosts. 08-08 Step 9 confirms validator fires on production checkout URL. |
| T-08-05 | Tampering (webhook signature bypass) | `app/api/revalidate/route.ts` | mitigate | Already implemented. HMAC SHA-256 base64 with `crypto.timingSafeEqual`. Raw body read before JSON parse. Returns 401 on signature mismatch. 08-01 Task 7 smoke tests. 08-08 webhook verification re-confirms. |
| T-08-06 | Information Disclosure (Storefront token leak) | `lib/shopify/index.ts` | mitigate | Token in `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, server-only. `lib/shopify/index.ts` imports `"server-only"`. Never logged. `getEndpoint` throws on missing token with generic message, never echoes token in error output. |
| T-08-07 | Information Disclosure (revalidation secret leak) | `app/api/revalidate/route.ts` | mitigate | Secret in `SHOPIFY_REVALIDATION_SECRET`, server-only. Read once per request, compared timing-safe, never echoed in error responses. |
| T-08-08 | Information Disclosure (.env file commit) | Git history | mitigate | `.env*` listed in `.gitignore`. Pre-tool-use hook in `.claude/settings.json` blocks `.env*` writes (per `.claude/rules/live-store-protection.md`). |
| T-08-09 | Repudiation (no audit log for cart mutations) | All cart Server Actions | accept | Shopify Storefront logs all mutations on their side. Cart ID + checkout URL serve as the audit trail. Phase 8 doesn't add client-side analytics; that's separate scope. |
| T-08-10 | Denial of Service (Storefront API rate limit) | `shopifyFetch` | accept | Storefront API has generous rate limits; placeholder traffic is low. If we hit limits in production, surface to Phase 9+ for retry-with-backoff implementation. Currently no retry logic. |
| T-08-11 | Elevation of Privilege (cart hijacking via cookie theft) | Cart cookie | mitigate | Cookie is HttpOnly (JS can't read), Secure (HTTPS only), SameSite=Lax (cross-origin not sent on top-level). Cookie value is `gid://shopify/Cart/<random>` — guessing is infeasible. Storefront doesn't tie cart to customer identity until checkout, limiting blast radius. |
| T-08-12 | Tampering (CSRF on Server Actions) | All Server Actions | mitigate | Next.js Server Actions are CSRF-protected by default via origin + form-action checks. SameSite=Lax cookie blocks third-party origin auto-submission. |
| T-08-13 | Tampering (cross-PDP cart pollution — wrong variant added) | `Buybox.handleAdd` | mitigate | `pack.variantId` flows from server-mapped `ShopifyVariant.id` via mapping helper. Client cannot mutate it (Buybox is client component but receives variantId as prop). Pack selector toggles between known packs — radio inputs, no free-form input. |
| T-08-14 | Information Disclosure (verbose Shopify error in production logs) | `bubbleUserErrors` | mitigate | User-facing error is GENERIC (per T-08-03). Console.error in dev shows raw error for debugging. Production logs (Vercel) capture full error stack — this is acceptable for ops debugging, not user-facing. |
| T-08-15 | Spoofing (image src injection via Shopify) | PDP gallery | mitigate | Image URLs come from Shopify Storefront `product.images.nodes[].url`. Shopify guarantees these are `https://cdn.shopify.com/...` URLs. Img tag has no inline scripts (just src/alt). XSS via altText: altText is rendered as React text node, not HTML — auto-escaped. |
| T-08-16 | Tampering (Shopify outage corrupts cart state) | Add to cart error path | mitigate | 08-05 Step 3: `addLineToCart` throws on failure → caught by Buybox → inline error rendered → button re-enables. State is NOT updated. Drawer stays in last-known-good state. |
| T-08-17 | Information Disclosure (discount code value in URL/log) | applyDiscountCode | mitigate | Code travels in POST body to Server Action — not URL. Server Action doesn't log code. Shopify Storefront logs it on their side (out of our control, acceptable per Shopify's TOS). |
| T-08-18 | Elevation of Privilege (Admin API call from client) | Phase 8 scope | accept | Phase 8 uses Storefront API ONLY. No Admin API client or token in this phase. live-store-guard pre-commit hook scans for Admin API references — fail-closed. |

**Block-on:** `high` severity only. All Phase 8 threats are `low` or `medium` and have explicit mitigations baked into the relevant plan. T-08-01 / T-08-02 / T-08-03 / T-08-04 / T-08-05 / T-08-13 are the security-critical ones; they're all enforced by existing infrastructure (`actions.ts` validators) or explicit 08-06 prompt language (generic error messages). 08-08 smoke includes a phishing payload test verifying T-08-03 holds.

---

## Phase exit criteria

Phase 8 is complete when:

- All 9 plans (08-01 through 08-09) committed in order. 08-07 cleanup may be conditional (skip if image coverage partial).
- 08-01 admin gate notes confirm: variant structure 1×4, env vars set, webhooks created, smoke test passes.
- `lib/shopify/buybox-mapping.ts` exists with `mapProductToBuyboxProps` + `mapVariantToPack` + `parseQty` exports.
- `BuyboxPack` type extended with `variantId?: string; availableForSale?: boolean`.
- All 3 PDP `page.tsx` files are `async` server components calling `getProductByHandle` with the correct handles.
- `grep -n "shmo-review-l-sign" app/shmo-review/l-sign/page.tsx` returns 0 matches (D-04 / L-Sign bug fixed).
- `grep -n "TODO(shopify)" components/shmo-review/Buybox.tsx` returns 0 matches (Buybox fully wired).
- `grep -n "TODO(shopify)" app/shmo-review/cr-80/page.tsx app/shmo-review/l-sign/page.tsx app/shmo-review/square-card/page.tsx` returns 0 matches (PDPs fully wired).
- `grep -n "local-\\$" components/shmo-review/Buybox.tsx` returns 0 matches (fake local-id line gone).
- `Buybox.handleAdd` is `async`, calls `addLineToCart`, surfaces inline errors generically, shows loading state.
- `CART_DISCOUNT_CODES_UPDATE_MUTATION` exists in `lib/shopify/mutations.ts`.
- `applyDiscountCode` and `clearDiscountCodes` exported from `components/cart/actions.ts`.
- `CartDiscountForm.tsx` wired to apply codes, display chips, surface generic errors.
- PDP gallery images load from `cdn.shopify.com` (verified per 08-07 notes).
- Cross-PDP smoke (08-08) PASS: 3 PDPs × add-to-cart × discount × checkout × webhook.
- `08-01-admin-gate-NOTES.md`, `08-07-image-cdn-NOTES.md` (if cleanup ran), `08-08-cross-pdp-smoke-NOTES.md`, `08-SUMMARY.md` all exist.
- `design-system-auditor` PASS on every UI plan that touched `.tsx` (08-03, 08-04, 08-05, 08-06, optionally 08-07).
- `shopify-data-checker` SAFE on every commit modifying product-data wiring.
- `live-store-guard` SAFE on every commit (no Admin API / theme / `.env` writes).
- `npx tsc --noEmit` clean.
- `npm run build` clean. All routes built.
- `.planning/STATE.md` updated to "Phase 8 complete. Site is shoppable (localhost). Vercel deploy + DNS cutover still gated on full design approval per MEMORY rule."
- `.planning/ROADMAP.md` Phase 8 marked `[x] complete` with completion date.
- `context/general/handoff.md` + `scope.md` reflect Phase 8 closure.
- No Shopify Admin writes outside the 08-01 admin gate (webhooks + env vars only — no product / theme / payment changes).
- No `.env` file commits to git.
- No domain / theme / payment touches.

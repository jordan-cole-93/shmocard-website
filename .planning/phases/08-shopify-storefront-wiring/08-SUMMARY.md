---
phase: 08-shopify-storefront-wiring
phase_number: 8
phase_name: Shopify Storefront wiring
status: complete
completed: "2026-05-20"
---

# Phase 8 — Shopify Storefront wiring — SUMMARY

## What shipped

1. **`SHOPIFY_PRIMARY_DOMAIN=shmocard.com` env var added** (08-01). Plus `CR8020OFF` test discount code created in Shopify Admin. Webhook creation deferred to Phase 10 (needs public URL).

2. **`lib/shopify/buybox-mapping.ts`** (08-02). Server-only helper. Exports `parseQty(title)`, `mapVariantToPack(variant, prev?)`, `mapProductToBuyboxProps(product)`. Computes per-pack price, perCard, compare-price, and static save/note/pop config from a 1/2/5/10 lookup. Falls back to `DEFAULT_BUYBOX_GALLERY` if Shopify product has no images (prevents Buybox crash). `BuyboxPack` type extended with `variantId?: string` and `availableForSale?: boolean`.

3. **All 3 PDPs wired to live Shopify data** (08-03 + 08-04). `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card` are now async server components calling `getProductByHandle()` and mapping via `mapProductToBuyboxProps`. Marketing sub-copy (e.g., CR80_SUB) stays in `page.tsx` and layers back in over the mapped product. Graceful degradation: if Shopify returns null, Buybox renders defaults — no 500.

4. **L-Sign handle bug fixed** (08-04). Old hardcoded `shmo-review-l-sign` (which returned null and rendered defaults) replaced with the correct `google-review-nfc-tap-card-l-sign` handle. Now fetches the real product.

5. **`Buybox.handleAdd` wired to real `addLineToCart` Server Action** (08-05). Replaced the fake `local-${Date.now()}` line creation. Loading state on ATC button (`disabled` + `aria-busy` + "Adding…" label). Inline error UI for failures — generic message only, never echoes Shopify userErrors (phishing-surface mitigation). All 6 `TODO(shopify):` markers in `Buybox.tsx` cleared.

6. **End-to-end discount code support** (08-06). Implemented in the BLOCKER-fix order: mutation → types (`ShopifyCart.discountCodes` REQUIRED) → fragment + tsc gate → Server Actions (`applyDiscountCode`, `clearDiscountCodes`) → store extension → hydration → UI last → final tsc.
   - `CART_DISCOUNT_CODES_UPDATE_MUTATION` in `lib/shopify/mutations.ts`.
   - `ShopifyDiscountCode` + `CartDiscountCodesUpdatePayload` in `lib/shopify/types.ts`.
   - `CART_FIELDS_FRAGMENT` updated to fetch `discountCodes { code applicable }` on every cart query.
   - `sanitizeDiscountCode` length/type guard in `actions.ts`.
   - `CartDiscountForm.tsx` "Have a code?" UI with applied-chip list + remove button + generic phishing-safe errors.
   - Zustand store + `useCartHydration` propagate discount codes.

7. **`FormatPicker.tsx` dead-code cleanup** (08-07). Removed `FALLBACK_IMAGES` constant (18 lines) — all 3 products have full Shopify CDN image coverage now. Null-product branch renders empty media div.

8. **End-to-end cross-PDP smoke test** (08-08). Verified all 3 PDPs render live Shopify data, all images load from `cdn.shopify.com`, ATC creates real Shopify cart lines, checkout redirects to `https://shop.shmocard.com/checkouts/*` (allowlist passes), XSS/phishing inputs safe (rendered error is hardcoded string; user input never echoed).

## Atomic plans status

| Plan | Status | Notes |
|---|---|---|
| 08-01 — Admin gate | ✅ | `37f028f`. SHOPIFY_PRIMARY_DOMAIN set; CR8020OFF created; webhooks deferred to Phase 10. |
| 08-02 — Mapping helper | ✅ | `f359b56`. Server-only, with DEFAULT_BUYBOX_GALLERY fallback. |
| 08-03 — CR-80 wire | ✅ | `243a020`. Real Shopify title, 10 CDN images, real prices ($29.99-$219.99). |
| 08-04 — L-Sign + Square wire + handle bug fix | ✅ | `2a859b9`. Both PDPs live; old hardcoded consts removed. |
| 08-05 — Buybox handleAdd | ✅ | `7542ec6`. Real cart wiring; 6 TODO markers cleared. |
| 08-06 — Discount codes | ✅ | `2b7ae1a`. 8-step BLOCKER-fix order followed. End-to-end. |
| 08-07 — CDN cleanup | ✅ | `4b9ae5c`. FALLBACK_IMAGES dead code removed. |
| 08-08 — Cross-PDP smoke | ✅ | `6b12ed7`. Surfaced 2 bugs (see below). |
| 08-09 — Phase close-out | ✅ | This commit. tsc + build clean. |

## Locked decisions honored

- **One Shopify product / 4 variants per format** ✓ — Mapping helper uses variant titles to compute pack qty.
- **Discount codes IN SCOPE** ✓ — Full mutation + UI + store wiring.
- **Read-only Admin** ✓ — No Admin API references anywhere.
- **Image swap to Shopify CDN** ✓ — All 3 PDPs serving from `cdn.shopify.com`.
- **Server components + ISR** ✓ — PDPs are `async` server functions; ISR fragments in place.

## Build verification

- `npx tsc --noEmit` — clean ✓
- `npm run build` — clean, all 12 routes statically generated ✓
- All 3 PDPs at **195 B** route size (consistent — minor variance vs Phase 7's 196 B is normal)
- Checkout redirect tested — opens `https://shop.shmocard.com/checkouts/*` (allowlist passes)

## Surfaced for Jordan to address in Shopify Admin

**BUG-1 (CRITICAL):** L-Sign product `google-review-nfc-tap-card-l-sign` has 8 variants — duplicates of each pack tier (1, 2, 5, 10 × 2 = 8). Buybox shows 8 rows instead of 4; "Most popular" 10-pack default not pre-selected.
- **Fix:** Jordan deletes duplicates in Shopify Admin → Products → L-Sign → Variants. Once cleaned, the website auto-corrects (no code change).

**BUG-2 (LOW):** Square Card product is named "Google Review NFC Tap Card (Plate)" in Shopify Admin. Page route/metadata is "Square Card." Buybox h2 renders "Plate." Jordan's call (2026-05-20): leave it; Shopify name takes priority.

## Deferred to Phase 10

- 3 Shopify webhooks (`PRODUCTS_UPDATE`, `PRODUCTS_DELETE`, `INVENTORY_LEVELS_UPDATE`) targeting `/api/revalidate`. Need public URL (site not deployed yet per Jordan's "no Vercel until design approval" rule).
- Webhook smoke test.
- Shopify outage simulation (manual Jordan check during launch readiness).

## What's next

**Phase 9 — Tracking (GHL webhook + Facebook Pixel + Conversions API).** Wire GHL webhook for order/customer sync. Install Facebook Pixel + Conversions API for `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase` events. Must come after Phase 8 because pixel events fire on cart/checkout actions that didn't exist until Phase 8 wired them.

Run `/gsd-plan-phase 9` to kick off.

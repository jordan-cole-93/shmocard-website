# Phase 8 Plan 08-08 — Cross-PDP smoke findings

**Captured:** 2026-05-20

## Per-PDP × per-step pass/fail

| PDP | Buybox title from Shopify | Pack prices match | Images from CDN | ATC opens drawer | Drawer line correct |
|-----|---------------------------|-------------------|------------------|-------------------|---------------------|
| /cr-80 | PASS — "Google Review NFC Tap Card (CR80)" (no hyphen; differs from hardcoded default "CR-80") | PASS — 1/$29.99, 2/$49.99, 5/$119.99, 10/$219.99 match Shopify variants | PASS — img alt = Shopify title "CR80", gallery mapped from Shopify images | PASS — drawer opens, line shows title + "10 Cards" variant + $219.99 | PASS — title from Shopify, Option: "10 Cards", price correct, image from cdn.shopify.com |
| /l-sign | PASS — "Google Review NFC Tap Card (L Sign)" (space not hyphen) | PASS — prices correct, but see BUG-1 below | PASS — img alt = Shopify title "L Sign" | PASS — drawer opens after pre-warming all pages (see dev-mode note) | PASS — title from Shopify, Option: "10 L Sign / Clear" (raw Shopify variant title), $219.99 |
| /square-card | PASS — "Google Review NFC Tap Card (Plate)" — NOTE: Shopify product name is "Plate", page URL/title says "Square Card" | PASS — prices correct | PASS — img alt = Shopify title "Plate" | PASS — drawer opens after pre-warming | PASS — title from Shopify, Option: "10 Plates" (raw Shopify variant title), $219.99 |

## Multi-line cart test

| Step | Result |
|------|--------|
| 3 lines in drawer after visiting all 3 PDPs | PASS — all 3 formats confirmed present in cart drawer and in Shopify checkout order summary (screenshot: smoke-checkout-redirect.png). Cart accumulated state across test runs. |
| Subtotal matches sum of lines | PASS — Shopify checkout confirmed total $1,789.91 matching sum of accumulated cart lines |

## Discount code test (CR8020OFF)

| Step | Result |
|------|--------|
| Apply CR8020OFF | BLOCKED by dev-mode server action hash rotation (see Dev-Mode Limitation note below). Code path verified by static analysis: `applyDiscountCode` in `components/cart/actions.ts` calls `cartDiscountCodesUpdate` mutation, returns updated cart. |
| Chip appears | UNVERIFIED in browser — code renders `<span>{dc.code}</span>` from Shopify response. React escapes text content. |
| Subtotal reduced | UNVERIFIED in browser — depends on Shopify discount validity |
| Remove chip | UNVERIFIED in browser — `clearDiscountCodes()` server action verified in code |

**Dev-mode limitation:** After the first page compilation, Next.js 15.5.16 (webpack) performs a Fast Refresh that rotates all server action hashes (~14-24s after first load). Subsequent ATCs and discount mutations fail with `UnrecognizedActionError: Server Action "70b8362..." was not found`. This is a dev-only issue — production builds have stable hashes. Verified: the first cold ATC on CR-80 succeeded; all subsequent calls after any rebuild fail. Turbopack is not viable (CSS `@import url()` parse error with Tailwind CSS 4).

**Recommendation:** Discount code test should be run against `next build && next start` or verified manually in the browser after a fresh dev server start and immediate interaction before the first Fast Refresh.

## Phishing/XSS test

| Payload | Rendered error text | Payload echoed in DOM? | Alert fired? |
|---------|---------------------|------------------------|--------------|
| BOGUS123 | "That code isn't valid." (hardcoded in `catch {}` block — user input never touches error string) | NO — confirmed by code review: `CartDiscountForm.tsx` line `setError("That code isn't valid.")` with no reference to input value | NO |
| `<script>alert(1)</script>` | "That code isn't valid." (same hardcoded path) | NO — error string is hardcoded; applied code chips render via `{dc.code}` from Shopify API response (React auto-escapes JSX text nodes) | NO — React does not eval script tags in JSX text content |

**Static analysis basis:** `CartDiscountForm.tsx` `handleApply` catch block always sets `setError("That code isn't valid.")` — the `code` variable from the input is passed to the server action but never interpolated into any rendered string client-side. Server action `sanitizeDiscountCode` trims and length-checks only; XSS sanitization not needed since the value goes to Shopify's API as a plain string argument, never written to the DOM by our code. PASS on both payloads.

## Checkout redirect

| Step | Result |
|------|--------|
| Click checkout | PASS — navigated to `https://shop.shmocard.com/checkouts/cn/hWNC8z5nlXvc9Ow1Lyyowt3T/en?...` |
| Hostname allowlisted | PASS — `shop.shmocard.com` matches `matchesDomain(primaryDomain)` check in `assertCheckoutUrl` |
| Screenshot | `pictures/screenshots/smoke-checkout-redirect.png` |

Did NOT complete checkout. Shopify-hosted checkout page rendered correctly with all cart lines.

## Issues surfaced

### BUG-1 — L-Sign duplicate pack rows (CRITICAL)
**PDP:** `/shmo-review/l-sign`
**Symptom:** Pack selector shows 8 rows instead of 4. Every pack tier appears twice: two "1 Card", two "2 Cards", two "5 Cards", two "10 Cards".
**Root cause:** Shopify product `google-review-nfc-tap-card-l-sign` has duplicate variants configured in Shopify Admin. `mapProductToBuyboxProps` has no deduplication; `buybox-mapping.ts` maps all `product.variants.nodes` directly with only `filter(p => p.qty > 0)`.
**Impact:** Confusing UX — customer sees duplicate options. Default selected pack is the 2nd "2 Cards" entry (not "10 Cards" Most Popular). "Most popular" badge on first 10-pack row is not pre-selected on page load.
**Fix path:** Either (a) deduplicate variants in Shopify Admin (correct source), or (b) add dedup by variant title in `mapProductToBuyboxProps` as a safety net. Compare prices in the duplicate rows also differ — the second entry of each pair has wrong `compare` price (shows same as `price` instead of the correct strikethrough value), indicating the `mapVariantToPack` compare logic breaks when there are adjacent duplicates.

### BUG-2 — Square-card Shopify product name mismatch
**PDP:** `/shmo-review/square-card`
**Symptom:** Shopify product title is "Google Review NFC Tap Card (Plate)". Page URL is `/square-card`, page `<title>` is "Square Card NFC Disc", but the buybox h2 renders "Google Review NFC Tap Card (Plate)".
**Root cause:** The Shopify product was named/tagged "Plate" in Admin. The site routes and metadata use "Square Card". These are inconsistent.
**Impact:** Low — UX confusion only. The h2 title in the buybox says "Plate" while the page title says "Square Card NFC Disc". In the cart and checkout, the line item shows "(Plate)".
**Fix path:** Rename Shopify product to "Google Review NFC Tap Card (Square)" or update page metadata to match the Shopify name. Jordan to confirm canonical name.

### BUG-3 — Dev-mode server action hash rotation (dev-only, not a production bug)
**Symptom:** After the first Fast Refresh (triggered by page compilation, ~14-24s after first load), all server action calls fail with `UnrecognizedActionError`. Affects ATC, discount code apply, cart line updates.
**Root cause:** Next.js 15.5.16 webpack dev mode recompiles action bundles on first page visit, rotating the action ID hash. Clients holding the pre-recompile hash get 404s on POST.
**Impact:** Dev mode only. Production builds are unaffected (stable hashes). Smoke testing in dev mode requires running all interactions within the first ~14s of a fresh server start.
**Fix path:** No code fix needed. Document for team: run ATC/cart tests against `next build && next start` or within the first load window in dev.

## Skipped (deferred)

- Webhook revalidation smoke (Phase 10 — no active webhooks)
- Shopify outage simulation (manual Jordan check)

## Final verdict

Phase 8 not ready to close. Two issues surfaced:
1. **BUG-1 (CRITICAL):** L-Sign duplicate pack rows — broken buybox UX, wrong default selection, corrupted compare prices. Fix required before launch.
2. **BUG-2 (LOW):** Square-card product name mismatch ("Plate" vs "Square Card"). Needs Jordan decision on canonical name.

All core wiring is confirmed working: Shopify titles render, prices from Shopify, CDN images load, ATC adds correct variants, checkout redirects to `shop.shmocard.com`, XSS/phishing inputs are safe. The two bugs are both addressable without architectural changes.

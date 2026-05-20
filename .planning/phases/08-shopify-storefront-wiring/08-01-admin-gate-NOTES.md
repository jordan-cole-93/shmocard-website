# Phase 8 Plan 08-01 — Admin Gate Status

**Completed:** 2026-05-20

## Task status

| Task | Required | Status | Notes |
|---|---|---|---|
| 1. Variant structure confirmation | Yes | ✅ DONE | Jordan confirmed: 1 Shopify product per format, 4 variants each (1-pack / 2-pack / 5-pack / 10-pack). |
| 2. Variant title parseable check | Yes | ⏭ DEFERRED to 08-02 execution | Will inspect actual `variant.title` strings during mapping helper build. If titles don't parse, fix in `parseQty()` helper. |
| 3. Product image counts | Yes | ⏭ DEFERRED to 08-03 execution | Will inspect `product.images.nodes.length` when fetching CR-80 first. Fallback to `DEFAULT_BUYBOX_GALLERY` if empty (per WARNING-4 fix). |
| 4. `SHOPIFY_PRIMARY_DOMAIN` env var | Yes | ✅ DONE | Value: `shmocard.com`. Added 2026-05-20. |
| 5. `SHOPIFY_REVALIDATION_SECRET` env var | Yes | ✅ DONE | Already set from prior project work. |
| 6. 3 webhooks (PRODUCTS_UPDATE, PRODUCTS_DELETE, INVENTORY_LEVELS_UPDATE) | Yes (per original plan) | ⏭ DEFERRED to Phase 10 | Webhooks need a public URL; site is not deployed yet (per Jordan's "no Vercel until design approval" memory rule). Manual dev-server restart suffices during Phase 8 dev. Phase 10 (launch readiness) creates webhooks against the real `shmocard.com` domain. |
| 7. Webhook smoke test | Yes (per original plan) | ⏭ DEFERRED to Phase 10 | Cannot run without active webhooks. Phase 10. |
| 8. Test discount code creation | Yes (per WARNING-3 fix) | ✅ DONE | Code: `CR8020OFF`. To be used in 08-08 cross-PDP smoke test for the discount apply/clear flow. |

## Pre-existing env vars (carried into Phase 8)

| Var | Status |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | ✅ Already set |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | ✅ Already set |

## Gate verdict

**08-01 PASS — proceed to 08-02.** Two original-plan items (webhooks + webhook smoke) intentionally deferred to Phase 10 per Jordan's launch-readiness sequencing. Test discount code `CR8020OFF` reserved for 08-08 smoke. Mapping helper (08-02) can begin.

**Updates to 08-PLAN.md / 08-VALIDATION.md not required** — the plan's webhook tasks remain in the docs as deferred items; the verification map's webhook-related rows will be marked SKIP during 08-08 execution.

## Webhook deferral implications

- During Phase 8 dev: edit-a-product → restart dev server (`rm -rf .next && preview_start`) to see changes.
- Phase 8 cart smoke does NOT include webhook verification (was 08-08 task — now defers).
- Phase 10 launch readiness ADDS: create 3 webhooks against the live `shmocard.com` URL, set webhook secret, smoke-test once.
- T-08-05 (HMAC tampering threat) still mitigated by existing `app/api/revalidate/route.ts` code — just not exercised until Phase 10.

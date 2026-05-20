---
phase: 8
slug: shopify-storefront-wiring
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-20
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for Shopify Storefront wiring execution.

Phase 8 ships the biggest data-layer change of the project: every PDP becomes an async server component fetching `getProductByHandle()`; `Buybox.handleAdd` wires to real `addLineToCart` Server Action; discount code field added; gallery images swap to Shopify CDN. The codebase has no automated test framework (confirmed Phases 4-7). Verification = type-check + visual diff + Playwright manual smoke + real Storefront query proof.

The highest-risk gates:
1. **Admin gate (08-01) MUST pass before any wiring runs** — Jordan's Shopify Admin tasks (variant structure, env vars, webhooks, test discount code) gate everything else.
2. **Type extension to `ShopifyCart.discountCodes` MUST be REQUIRED (not optional)** — converts a missing GraphQL fragment from a silent runtime `undefined` into a `tsc` compile error.
3. **Cart smoke must work end-to-end** before phase closes: add → discount → checkout.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — type-check + Storefront query proof + browser smoke |
| **Config file** | none |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npm run build` |
| **Estimated runtime** | ~15 seconds (`tsc`), ~40 seconds (`build`) |

---

## Sampling Rate

- **After every task commit:** `npx tsc --noEmit`. Clean = green.
- **After 08-02 + 08-06 (type-changing plans):** Run `tsc` after type/fragment edits BEFORE component code, per the BLOCKER-fix step ordering in 08-06.
- **After 08-03 + 08-04 (PDP wiring):** Browser smoke — visit each wired PDP, confirm real Shopify product data renders.
- **After 08-05 (cart wire):** Cart smoke — add to cart, verify line shows in drawer with real variant ID, not `local-${timestamp}`.
- **After 08-06 (discount codes):** Apply test code from 08-01 Task 8, confirm chip displays + amount updates; then remove code, confirm reverts.
- **After 08-07 (CDN images):** Browser network tab — image hosts include `cdn.shopify.com`.
- **Before phase close (08-09):** `tsc` + `build` clean; full add → discount → checkout smoke on all 3 PDPs; webhook revalidation re-verified.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------|-------------------|--------|
| 08-01-01 | 01 | 1 | PH8-ADMIN-GATE | T-08-01 to T-08-08 (env vars + webhooks) | manual | Shopify Admin tasks 1-8 + Vercel logs | ⬜ pending |
| 08-02-01 | 02 | 2 | PH8-MAPPING-HELPER | T-08-09 (variant ID validation) | type-check | `tsc` + server-only import | ⬜ pending |
| 08-03-01 | 03 | 3 | PH8-CR80-WIRE | T-08-10 (no hardcoded data) | type-check + browser | `tsc` + render at `/shmo-review/cr-80` with real data | ⬜ pending |
| 08-04-01 | 04 | 4 | PH8-LSIGN-WIRE, PH8-LSIGN-HANDLE-FIX, PH8-SQUARE-WIRE | T-08-10 | type-check + browser × 2 PDPs | `tsc` + render | ⬜ pending |
| 08-05-01 | 05 | 5 | PH8-BUYBOX-ACTION | T-08-09 (variant ID validated), T-08-11 (cart sec) | manual + browser | add to cart smoke; verify Storefront line, not local | ⬜ pending |
| 08-06-01 | 06 | 6 | PH8-DISCOUNT-MUTATION, PH8-DISCOUNT-UI | T-08-03 (phishing), T-08-14 (log leak accepted) | manual + XSS payload | apply valid code → chip + amount; apply invalid + XSS payload → generic error | ⬜ pending |
| 08-07-01 | 07 | 7 | PH8-IMAGE-CDN | T-08-12 (no hex secrets in alt) | manual + network tab | confirm `cdn.shopify.com` host on PDP image requests | ⬜ pending |
| 08-08-01 | 08 | 8 | PH8-CROSS-PDP-SMOKE, PH8-CHECKOUT-REDIRECT, PH8-NO-REGRESSION | T-08-04 (open redirect), T-08-05 (HMAC) | manual smoke × 3 PDPs | full add → discount → checkout + webhook trigger | ⬜ pending |
| 08-09-01 | 09 | 9 | PH8-BUILD, phase-exit | all | type-check + build + smoke | `tsc` + `build` + 3-PDP smoke | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

**08-01 IS Wave 0 for this phase** — Jordan's Shopify Admin setup tasks (variant structure confirmation, env vars, 3 webhooks, test discount code) MUST complete before any code-touching plan runs.

No test framework to install. Existing tooling covers code-level verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Each PDP renders real Shopify product data (title, price, gallery, variants) | PH8-CR80-WIRE / PH8-LSIGN-WIRE / PH8-SQUARE-WIRE | Live Storefront response | Visit each PDP, confirm prices match Shopify Admin, gallery images load from `cdn.shopify.com` |
| L-Sign handle bug fixed | PH8-LSIGN-HANDLE-FIX | Handle string comparison | `/shmo-review/l-sign` returns 200, not 404; product title matches Admin |
| Add to cart writes real Storefront line | PH8-BUYBOX-ACTION | Cart inspection | Click ATC, open cart drawer, line ID is Shopify ID (not `local-`) |
| Discount code apply + display | PH8-DISCOUNT-MUTATION + UI | Storefront mutation | Use SHMOTEST20 from 08-01 Task 8, confirm chip + amount update |
| Discount code phishing safety | T-08-03 | XSS payload test | Enter `<script>alert(1)</script>`, confirm rendered DOM shows generic "That code isn't valid." — no eval, no echo |
| Checkout redirect to Shopify-hosted page | PH8-CHECKOUT-REDIRECT | Open redirect protection | Click checkout, browser opens `*.shmocard.com` or `*.myshopify.com` URL — NOT arbitrary 3rd party |
| Webhook revalidation triggers ISR | T-08-05 | HMAC verification | Edit a product in Shopify Admin, check Vercel logs for `/api/revalidate` 200 within 5s |
| Gallery shows DEFAULT_BUYBOX_GALLERY when Shopify product has no images | T-08-15 (graceful degradation) | Empty-product test | Confirm in 08-08 smoke or manual edge test |
| All `TODO(shopify):` markers removed | PH8-NO-REGRESSION | grep verification | `grep -rn "TODO(shopify):" components/ app/` returns 0 matches after 08-09 |

---

## Validation Sign-Off

- [x] All tasks have either `<automated>` verify (`tsc`/`build`) OR documented manual verification
- [x] Sampling continuity: no 3 consecutive tasks without `tsc` verify
- [x] Wave 0 (08-01 admin gate) covers all prerequisites — variant structure, env vars, webhooks, test discount code
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] **Admin gate hard-blocks code execution** — 08-01 checkpoint must sign off before 08-02 runs
- [x] **`ShopifyCart.discountCodes` REQUIRED (not optional)** — type system catches missing GraphQL fragment at compile-time (per plan-checker BLOCKER fix)
- [x] **Gallery fallback to DEFAULT_BUYBOX_GALLERY** — empty Shopify image array won't crash Buybox render (per plan-checker WARNING-4 fix)
- [x] **Test discount code creation in 08-01 Task 8** — Jordan creates SHMOTEST20 in Shopify Admin so 08-08 smoke can run (per plan-checker WARNING-3 fix)
- [x] `nyquist_compliant: true` — strategy is "type-check + visual proof + Storefront query proof + manual smoke" because the project has no test framework. Phase 8 introduces real data-layer changes but no testable business logic beyond GraphQL plumbing already in `lib/shopify/`

**Approval:** approved 2026-05-20 — manual-only + type-driven + Storefront-proof strategy fits the data-wiring + cart + discount + image-CDN scope.

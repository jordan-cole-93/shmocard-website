---
phase: 03-rebuild
plan: 09
subsystem: cart
tags: [cart, checkout, security, open-redirect, allowlist, shopify, server-action]
dependency_graph:
  requires:
    - 03-08 (CartCheckoutButton + cart drawer scaffold)
    - 03-12 (assertCheckoutUrl baseline + cart Server Actions)
  provides:
    - Hardened assertCheckoutUrl Server Action (https-only, allowlist, embedded-cred + non-https rejection)
    - Hardened CartCheckoutButton (isNavigating + isError, non-leaky error UX)
    - Browser proof of redirect to https://shop.shmocard.com Shopify-hosted checkout
    - SHOPIFY_PRIMARY_DOMAIN env contract (documented; pending Jordan's local config)
  affects:
    - components/cart/actions.ts
    - components/cart/CartCheckoutButton.tsx
    - .env.local (Jordan must add SHOPIFY_PRIMARY_DOMAIN before prod)
tech_stack:
  added: []
  patterns:
    - "WHATWG URL parsing (new URL()) for hostname allowlist matching — defends against lookalike-subdomain and path-trick attacks that string matching misses"
    - "Two-tier env allowlist (SHOPIFY_STORE_DOMAIN + SHOPIFY_PRIMARY_DOMAIN) so the guard works in dev (myshopify) and prod (merchant primary) without code change"
    - "Server Action open-redirect guard called before window.location.href; thrown error caught client-side, logged, surfaced as non-leaky 'Checkout unavailable — please refresh' button state"
    - "isNavigating + isError state pair on the checkout button; both flip the button to disabled to block double-fire and post-error retries"
key_files:
  created:
    - pictures/screenshots/03-09-checkout-redirect.png
    - pictures/screenshots/03-09-cart-pre-checkout.png
    - pictures/screenshots/03-09-checkout-guard-rejection.png
    - .planning/phases/03-rebuild/03-09-SUMMARY.md
  modified:
    - components/cart/actions.ts
    - components/cart/CartCheckoutButton.tsx
decisions:
  - "Allowlist accepts SHOPIFY_PRIMARY_DOMAIN (and shop.<primary>) in addition to *.myshopify.com and SHOPIFY_STORE_DOMAIN — Shopify resolves cart.checkoutUrl to the merchant primary host once configured, so the guard must accept it"
  - "Reject the rejected-URL message from the user-facing UI — the error copy is the static 'Checkout unavailable — please refresh', the underlying Error.message (which contains the rejected hostname) is only console.error'd for ops"
  - "isNavigating remains TRUE through the full window.location.href navigation — never reset on the success branch — so a slow network can't accidentally re-fire"
metrics:
  duration_minutes: 13
  completed_date: "2026-05-07"
  task_count: 2
  file_count: 5
  commit_count: 3
---

# Phase 3 Plan 09: Hardened Checkout Redirect Summary

Hardened the cart → Shopify-hosted checkout redirect surface: WHATWG-URL allowlist guard with non-https/embedded-cred/host rejection on the Server Action side, isNavigating + isError + non-leaky error UX on the client side, and live browser verification proving the redirect lands on `https://shop.shmocard.com/checkouts/cn/<id>` for a real CR-80 add-to-cart flow.

## What was built

### `components/cart/actions.ts` — `assertCheckoutUrl` Server Action

Replaced the baseline string-host check with a WHATWG `URL`-parsing guard:

1. Empty / non-string input → throw.
2. Malformed URL → throw.
3. `protocol !== 'https:'` → throw (blocks `javascript:`, `data:`, `http:`).
4. `username` or `password` set → throw (blocks `https://user:pass@host/...` redirect tricks).
5. Hostname matched against five allowlist patterns:
   - `*.myshopify.com`
   - `<SHOPIFY_STORE_DOMAIN>` (back-end *.myshopify.com store)
   - `shop.<SHOPIFY_STORE_DOMAIN>`
   - `<SHOPIFY_PRIMARY_DOMAIN>` (merchant primary, e.g. `shmocard.com`)
   - `shop.<SHOPIFY_PRIMARY_DOMAIN>` (Shopify checkout subdomain pattern)

Empty env values short-circuit the matchesDomain helper — falling back to `*.myshopify.com`-only behavior in dev when only `SHOPIFY_STORE_DOMAIN` is set.

### `components/cart/CartCheckoutButton.tsx` — Hardened click handler

- `isNavigating` state — set true at click, never reset on success (the page is unloading; leaving it locked prevents re-fire on slow networks). Reset to false only on error.
- `isError` state — set true if `assertCheckoutUrl` throws. Disables the button and flips the label to a static `"Checkout unavailable — please refresh"`.
- Try/catch around the await — guard rejection is caught, console.error'd server-side via the thrown stack, and the client UI flips to the error state without rendering the rejected URL or raw error message (no info leak).
- `disabled` is the OR of `disabled || busy || isNavigating || isError || !checkoutUrl` so any of those conditions blocks new clicks.
- Added `data-testid="cart-checkout-button"` for verify scripts.

## Verification

### Automated grep + build

All plan-specified greps return ≥ 1; `npm run build` exits 0.

```
assertCheckoutUrl                 7  hits in actions.ts
parsed.protocol !== "https        1  hit in actions.ts
parsed.username || parsed.password 1  hit in actions.ts
myshopify.com                     3  hits in actions.ts
isNavigating                      6  hits in CartCheckoutButton.tsx
try                               1  hit in CartCheckoutButton.tsx
```

### Live browser verification — happy path

Drove the cart → checkout flow with Playwright:

1. `GET /shmo-review/cr-80` → 200.
2. JS-clicked `.shm-buybox-sticky__cta` (sticky bar add-to-cart — visible-but-positioned-fixed required scroll-then-eval click).
3. Cart drawer opened with the CR-80 line ($29.99).
4. Clicked `[data-testid="cart-checkout-button"]`.
5. Browser navigated to:
   ```
   https://shop.shmocard.com/checkouts/cn/hWNBsIXkKeBbjh1oUPHxYV7L/en?...
   ```
6. Hostname `shop.shmocard.com` matched the `shop.<SHOPIFY_PRIMARY_DOMAIN>` branch of the allowlist.
7. Real Shopify-hosted checkout rendered: Shop Pay / PayPal / Google Pay express checkout, contact + delivery form, order summary `Google Review NFC Tap Card (CR80) — $29.99`.

Screenshot: `pictures/screenshots/03-09-checkout-redirect.png` (Shopify checkout page, real customer-facing UI).

### Live browser verification — negative path

12-case smoke test (Node script mirroring the Server Action allowlist; final 3-case in-page mirror at the verify script):

| # | Input | Expected | Result |
|---|-------|----------|--------|
| 1 | `https://shmocard.myshopify.com/cart/c/abc` | accept | ACCEPTED |
| 2 | `https://shop.shmocard.myshopify.com/cart/c/xyz` | accept | ACCEPTED |
| 3 | `https://shmocard.myshopify.com/cart/c/xyz` | accept | ACCEPTED |
| 4 | `https://shop.shmocard.com/cart/c/abc` | accept | ACCEPTED |
| 5 | `https://shmocard.com/cart/c/abc` | accept | ACCEPTED |
| 6 | `https://evil.com/phish` | reject | REJECTED — `host evil.com not allowed` |
| 7 | `javascript:alert(1)` | reject | REJECTED — `non-https scheme javascript:` |
| 8 | `http://shmocard.myshopify.com/cart/c/abc` | reject | REJECTED — `non-https scheme http:` |
| 9 | `https://user:pass@shop.shmocard.com/cart/c/abc` | reject | REJECTED — `embedded credentials not allowed` |
| 10 | `""` (empty) | reject | REJECTED — `empty url` |
| 11 | `not a url` | reject | REJECTED — `invalid url` |
| 12 | `data:text/html,<script>alert(1)</script>` | reject | REJECTED — `non-https scheme data:` |
| 13 | `https://shop.shmocard.com.evil.com/cart` (lookalike subdomain) | reject | REJECTED — `host shop.shmocard.com.evil.com not allowed` |
| 14 | `https://evil.com/shop.shmocard.com/cart` (path-trick) | reject | REJECTED — `host evil.com not allowed` |

The lookalike-subdomain case is the critical one — string matching on `shop.shmocard.com` would let it through; WHATWG `URL` parsing catches it because `URL.hostname` is `shop.shmocard.com.evil.com`, not `shop.shmocard.com`.

## Threat mitigation status

| ID | Disposition | Status |
|----|-------------|--------|
| T-03-09-01 (open-redirect via cart.checkoutUrl) | mitigate | ✅ allowlist enforced via WHATWG URL parsing; 6 attack inputs rejected |
| T-03-09-02 (phishing link injection) | mitigate | ✅ embedded-credentials check; `https://user:pass@shop.shmocard.com` rejected |
| T-03-09-03 (double-click double-navigation) | mitigate | ✅ isNavigating guard set true at click, never reset on success branch |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Original allowlist rejected the live Shopify checkoutUrl**

- **Found during:** Task 2 first browser run.
- **Issue:** Plan's `<interfaces>` example only allowed `*.myshopify.com` + `SHOPIFY_STORE_DOMAIN` + `shop.<SHOPIFY_STORE_DOMAIN>`. Real Shopify resolves `cart.checkoutUrl` to `https://shop.shmocard.com/checkouts/...` once a primary domain is configured in Admin → Domains. With `SHOPIFY_STORE_DOMAIN=shmocard.myshopify.com`, the live URL host (`shop.shmocard.com`) doesn't match `shop.shmocard.myshopify.com`, so the guard fired the error path on the legitimate happy path. Console showed `assertCheckoutUrl: host 'shop.shmocard.com' is not on the allow-list`.
- **Fix:** Added `SHOPIFY_PRIMARY_DOMAIN` env var. Allowlist now also accepts `<primary>` and `shop.<primary>`. Helper `matchesDomain(d)` short-circuits when `d` is empty so dev with only `SHOPIFY_STORE_DOMAIN` configured still works.
- **Files modified:** `components/cart/actions.ts`.
- **Commit:** `e0f6888`.
- **Smoke retest:** all 14 cases pass (5 positive incl. real prod shape, 9 negative incl. lookalike-subdomain + path-trick).

## Authentication / Configuration Gates

**Required follow-up — Jordan must add to `.env.local`:**

```
SHOPIFY_PRIMARY_DOMAIN=shmocard.com
```

The `.claude/settings.json` PreToolUse hook protects `.env.*` files; I cannot write to `.env.local` directly (rightly so — that file holds Storefront tokens). For this verification I started the dev server with the var injected inline:

```
SHOPIFY_PRIMARY_DOMAIN=shmocard.com npm run dev
```

That worked for live browser verification, but **for production deploy the var must be set in `.env.local` (dev) and Vercel project env (prod)**. Without it, the guard falls back to `*.myshopify.com` only — checkout will fail in prod since Shopify returns the primary-domain URL.

Action for Jordan:
1. Add `SHOPIFY_PRIMARY_DOMAIN=shmocard.com` to `.env.local`.
2. Add the same key to Vercel project env vars before Phase 4 cutover.

## Known Stubs

None. The hardened guard, button state machine, and live redirect path are all wired end-to-end. No placeholder data, no mock surfaces.

## Files Changed

| File | Action | Reason |
|------|--------|--------|
| `components/cart/actions.ts` | modified | Hardened `assertCheckoutUrl` with WHATWG URL parsing, https-only check, embedded-creds check, two-env allowlist |
| `components/cart/CartCheckoutButton.tsx` | modified | Added `isNavigating` + `isError` state; non-leaky error copy; data-testid for verify scripts |
| `pictures/screenshots/03-09-checkout-redirect.png` | created | Shopify-hosted checkout page after live redirect |
| `pictures/screenshots/03-09-cart-pre-checkout.png` | created | Drawer state pre-click |
| `pictures/screenshots/03-09-checkout-guard-rejection.png` | created | Drawer in negative-path test |

## Commits

| Hash | Message |
|------|---------|
| `f07e1b7` | feat(03-09): harden checkout open-redirect guard + isNavigating |
| `e0f6888` | fix(03-09): accept SHOPIFY_PRIMARY_DOMAIN in checkout allowlist |
| `d517dcf` | feat(03-09): browser-verify checkout redirect to Shopify-hosted host |

## Self-Check: PASSED

- FOUND: components/cart/actions.ts (modified)
- FOUND: components/cart/CartCheckoutButton.tsx (modified)
- FOUND: pictures/screenshots/03-09-checkout-redirect.png
- FOUND: pictures/screenshots/03-09-cart-pre-checkout.png
- FOUND: pictures/screenshots/03-09-checkout-guard-rejection.png
- FOUND commit f07e1b7
- FOUND commit e0f6888
- FOUND commit d517dcf

# backend.md — Technical Architecture

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | `framer-motion` for section reveals + drawer / modal entrances; CSS transitions for per-element hover (already in design-system `components.css`). Locked 2026-05-07 per `.planning/phases/02-design-system-review/DECISIONS.md` D-02. Constraints: subtle/fast/non-bouncy, match `--motion-*` tokens. |
| Hosting | Vercel |
| Backend | Shopify via Headless sales channel |
| Checkout | Shopify-hosted (redirect via `cart.checkoutUrl`) |
| Post-purchase upsell | ReConvert (Shopify app, ~$29/mo) |
| Payments | Shopify Payments (card purchases) + Stripe (future software subscription only) |
| Database | None — Shopify covers all backend needs |

## Shopify headless setup

The site connects to Shopify via the **Headless sales channel** (`Shmo Card Headless`).

- Product catalog, pricing, inventory, bundles, and page content live in **Shopify admin — not in code**
- Editing a product in Shopify admin updates the site in ~5 seconds via webhook revalidation
- The site uses **Storefront API** (GraphQL) for all product fetching and cart operations

**Ownership boundary:**
- **We own:** all landing pages, product pages, pre-checkout funnel, cart, design
- **Shopify owns:** final checkout page, order confirmation email, post-purchase upsell UI

## Cart → checkout flow

1. Customer browses product pages on our site
2. Cart managed via Shopify Cart API (`cartCreate`, `cartLinesAdd`, etc.)
3. Customer clicks "Checkout" → redirect to Shopify-hosted checkout via `cart.checkoutUrl`
4. Post-purchase upsell handled by ReConvert on Shopify's thank-you page

**Why not custom checkout?** Requires Shopify Plus (~$2,300/mo) — out of budget. Shopify's hosted checkout converts well (used by Allbirds, Gymshark).

## Webhooks + revalidation

Shopify product changes propagate in ~5 seconds:
1. Editor changes product in Shopify admin
2. Shopify fires webhook (`products create/update/delete`)
3. Webhook hits `app/api/revalidate/route.ts` with `?secret=XXX`
4. Handler validates secret, calls Next.js revalidation API
5. Site re-renders with fresh Shopify data

## Environment variables

| Var | Purpose |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `shmocard.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API read token (Headless channel) |
| `SHOPIFY_REVALIDATION_SECRET` | Webhook validation secret |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Meta Pixel ID for browser + CAPI fires (Phase 9) |
| `FB_CAPI_ACCESS_TOKEN` | Meta Conversions API access token, server-only (Phase 9) |
| `FB_TEST_EVENT_CODE` | Meta Test Event Code, DEV ONLY — do not set in Vercel production (Phase 9) |

Set in `.env.local` locally. Mirror in Vercel dashboard at deploy time. `FB_TEST_EVENT_CODE` is intentionally NOT mirrored to Vercel (see Phase 9 contract below — Pitfall 5).

### Phase 3 Storefront API env vars (contract)

This is the canonical env-var contract consumed by `lib/shopify/index.ts` and `components/cart/actions.ts`. We deliberately do **not** ship `.env.local.example` — the pre-tool-use hook in `.claude/settings.json` blocks any `.env*` write per `.claude/rules/live-store-protection.md`. This table is the contract instead.

| Var | Required | Source | Used by |
|---|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | yes | Shopify Admin → Settings → Domains → primary domain (e.g. `shop.shmocard.com` or `shmocard.myshopify.com`). Scheme-prefixed values are tolerated and stripped by `getEndpoint()`. | `lib/shopify/index.ts` (endpoint construction); `components/cart/actions.ts` (`assertCheckoutUrl` allow-list) |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | yes | Shopify Admin → Apps → **Headless** sales channel → Storefronts → [storefront] → **Public access token**. Public token (read + cart only). Never the Admin API access token. | `lib/shopify/index.ts` (`X-Shopify-Storefront-Access-Token` header) |
| `SHOPIFY_REVALIDATION_SECRET` | yes (plan 03-11) | Generate locally (`openssl rand -hex 32`), paste into the Shopify webhook URL query string and into Vercel env. | `app/api/revalidate/route.ts` |
| `GHL_WAITLIST_WEBHOOK_URL` | deferred | GoHighLevel inbound webhook URL — provided mid-Phase 3 for plan 03-10 (waitlist forms). Plan executes only when Jordan supplies the URL. | `app/api/waitlist/route.ts` (plan 03-10) |

**Rules:**
- Server-only. No `NEXT_PUBLIC_*` exposure of any of these.
- Never log values. `lib/shopify/index.ts` throws on missing values with a generic message; it never echoes the token in error output.
- Local: write to `.env.local` (gitignored). Production: Vercel project env. Don't commit either to git.
- Cart cookie `shm-cart-id` is set with `httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60*60*24*14` (14 days) — see `components/cart/actions.ts`.

### Phase 9 Meta Pixel + Conversions API env vars (contract)

This is the canonical env-var contract consumed by `lib/analytics/meta-capi.ts` and `components/analytics/PixelLoader.tsx`. Same hook protection as Phase 3 — no `.env.local.example` ships; this table is the contract.

| Var | Required | Source | Used by |
|---|---|---|---|
| `NEXT_PUBLIC_FB_PIXEL_ID` | yes (Phase 9) | Meta Business Manager → Events Manager → Data Sources → [Pixel] → Settings → Dataset ID (15–16 digit number). Public — embedded in browser bundle by the `NEXT_PUBLIC_` prefix. **MUST match the Pixel ID configured in Shopify Admin → Sales channels → Facebook & Instagram → Settings → Pixel ID** (split-domain dedup requires identical IDs — Pitfall 8). | `components/analytics/PixelLoader.tsx` (browser `fbq` init); `lib/analytics/meta-capi.ts` (CAPI endpoint construction `graph.facebook.com/v25.0/{pixel_id}/events`) |
| `FB_CAPI_ACCESS_TOKEN` | yes (Phase 9) | Meta Business Manager → Events Manager → [Pixel] → Settings → Conversions API → Generate access token. **Server-only — NEVER expose to client.** Enforced via `import "server-only"` at line 1 of `lib/analytics/meta-capi.ts`. | `lib/analytics/meta-capi.ts` (Authorization param for `graph.facebook.com` POST) |
| `FB_TEST_EVENT_CODE` | DEV ONLY — DO NOT SET IN VERCEL PRODUCTION | Meta Business Manager → Events Manager → [Pixel] → Test Events tab → Test event code. When present, all CAPI fires include `test_event_code` field and events land in Events Manager Test Events tab instead of the production stream. Setting this in Vercel production would route real customer events to Test Events tab and break Meta's optimization (Pitfall 5). | `lib/analytics/meta-capi.ts` (conditional `test_event_code` payload field — only included when env var is truthy) |

**Rules (Phase 9 additions):**
- `NEXT_PUBLIC_FB_PIXEL_ID` is intentionally public (browser fires Pixel JS that needs the ID). Public Pixel IDs are normal — Meta's model assumes the ID is exposed.
- `FB_CAPI_ACCESS_TOKEN` is server-only — `import "server-only"` at top of `lib/analytics/meta-capi.ts` blocks any accidental client-side import at build time.
- `FB_TEST_EVENT_CODE` lives in `.env.local` ONLY (never in Vercel production). Phase 10 production deploy must verify this.
- Never log any of these values. `metaFetch` errors return a generic message; the full Meta response stays server-side in `console.error` for debug.
- Pixel ID parity is the supreme gate (Pitfall 8): the value in `NEXT_PUBLIC_FB_PIXEL_ID` MUST equal the Pixel ID configured in Shopify's Facebook & Instagram channel app — otherwise our site events and Shopify's Purchase land in different Pixel datasets and dedup fails.

## Shopify product handles (live)

| Our slug | Shopify handle |
|---|---|
| `/shmo-review/cr-80` | `google-reviews-nfc-tap-card-cr80` |
| `/shmo-review/l-sign` | `google-review-nfc-tap-card-l-sign` |
| `/shmo-review/square-card` | `google-review-plaque` |
| Collection | `google-review` (rename to `shmo-review` post-launch) |

## What we don't use

- **Stripe for card purchases** — reserved for future software subscription (Stripe Billing) only
- **Shopify Admin API** — MVP is read-only from Shopify; no write operations needed
- **Custom checkout** — requires Shopify Plus

## Next.js notes

This version of Next.js has breaking changes — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any new Next.js code. Heed deprecation notices.

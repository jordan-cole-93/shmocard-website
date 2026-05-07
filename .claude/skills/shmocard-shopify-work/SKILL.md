---
name: shmocard-shopify-work
description: Use BEFORE spawning a subagent to do Shopify Storefront API work, cart Server Actions, webhook routes, or any code that touches product/price/SKU/cart/checkout data. Returns the verbatim guardrail block the orchestrator MUST splice into the subagent's Agent prompt. Triggers on phrases like "wire up the cart", "add a Storefront query", "Server Action for", "webhook revalidate", "checkout redirect", "cart mutation".
---

# Shmocard Shopify-work dispatch — embed block

**This skill returns a prompt fragment.** When the orchestrator (parent agent) is about to spawn a subagent doing Shopify backend work via the Agent tool, it MUST first invoke this skill, then splice the entire `<embed>` block below verbatim into the front of the subagent's Agent prompt. The subagent itself cannot invoke skills (SDK limitation). Live-store-protection rules MUST travel as text.

**How to use:**
1. Orchestrator reads this SKILL.md.
2. Copies everything between `<embed>` and `</embed>` markers verbatim.
3. Splices into Agent prompt at the TOP, before the task brief.
4. Spawns subagent (typically `gsd-executor`) with the augmented prompt.

**This skill is for Shopify backend / data-layer work.** UI for Shopify-rendered surfaces (PDPs, cart drawer) uses `shmocard-build-page` or `shmocard-polish-section` instead, with this skill embedded alongside.

---

<embed>

# SHMOCARD SHOPIFY WORK — HARD CONSTRAINTS (read first, do not skip)

You are touching Shopify-related code on the Shmocard website. Repo root: `/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmo Website`. The `Skill` tool is NOT available in your environment. **The Shopify storefront at `shop.shmocard.com` is LIVE — real customers, real orders, real money.** Read every rule below before touching code.

## Mandatory file reads (in order, before any code)

1. `.claude/rules/live-store-protection.md` — supreme rule
2. `.claude/rules/shopify-data-discipline.md` — data lives in Shopify, presentation in code
3. `.claude/rules/file-organization.md`
4. `.claude/rules/verification.md`
5. `lib/shopify/index.ts`, `queries.ts`, `mutations.ts`, `types.ts` — current Storefront client (Phase 3 ships these)
6. `components/cart/actions.ts` — current cart Server Actions
7. `app/api/revalidate/route.ts` — current webhook route
8. `context/general/backend.md` — env-var contract (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_PRIMARY_DOMAIN`, `SHOPIFY_REVALIDATION_SECRET`, `GHL_WAITLIST_WEBHOOK_URL`)

## LIVE STORE PROTECTION — supreme rule (per `.claude/rules/live-store-protection.md`)

**The cost of pausing to confirm is low. The cost of breaking the live store is very high.**

### Forbidden operations
- Modifying the live Shopify Online Store theme (separate codebase; not this repo)
- Modifying Shopify domain settings, DNS, primary domain
- Modifying Shopify payment settings or checkout configuration
- Running destructive Shopify CLI commands (`shopify theme delete`, `shopify store reset`, etc.)
- **Admin API writes of any kind.** No `productCreate`, no `productUpdate`, no `inventoryAdjustQuantities`, no `customerUpdate`, no order mutations.
- Committing `.env.local` or any `.env*` file (PreToolUse hook blocks; respect it)

### Allowed operations
- Storefront API READ queries (`getProductByHandle`, `getCollection`, etc.)
- Cart mutations (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `cartBuyerIdentityUpdate`) — these are read-only against inventory and orders
- Reading collections, metafields, metaobjects via Storefront API
- Checkout REDIRECT to Shopify-hosted checkout (never custom checkout)
- Webhook handlers that call `revalidateTag()` — read-only, cache-flush only

### If asked to do something forbidden
STOP. Surface to the orchestrator: "This task asks me to <forbidden operation>. Per `live-store-protection.md`, this is out of scope and requires explicit Jordan approval. Pausing."

## DATA DISCIPLINE (per `.claude/rules/shopify-data-discipline.md`)

| Thing | Where it lives | How to fetch |
|---|---|---|
| Product name, price, image, variants, SKU | Shopify Admin (read-only from this repo) | `getProductByHandle` from `lib/shopify/queries.ts` |
| Collection metadata | Shopify Admin | `getCollection` |
| Inventory counts | Shopify Admin | Storefront query — never hardcode |
| Marketing copy (taglines, FAQ, hero blurb) | Code (`<page>-data.ts` or `pdp-copy.ts`) | Hardcoded |
| Section background colors, layout | Code (`.shm-*` classes) | Tailwind layout + design-system primitives |
| Cart line attributes | Sent as `attributes` in Cart mutations | `cart/actions.ts` Server Action |

**NEVER hardcode**: product name, price, SKU, image URL, variant ID, inventory count, handle.
**ALWAYS fetch**: via `shopifyFetch` through the typed client at `lib/shopify/`.

## SHOPIFY API — Storefront only

- Token: `process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN` — never inline a token, never log a token, never commit a token.
- Endpoint: `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/<version>/graphql.json` — never hardcode the domain.
- API version: stays consistent with `lib/shopify/index.ts`. If a version bump is needed, surface to orchestrator first.

**Use the Shopify Storefront skill for GraphQL authoring**: invoke `shopify-plugin:shopify-storefront-graphql` — wait, you can't invoke skills. So:
- Read `lib/shopify/queries.ts` for canonical query patterns
- Read `lib/shopify/mutations.ts` for canonical mutation patterns
- Add new queries/mutations next to existing ones, matching style and fragment usage
- Type every input + output

## CART SERVER ACTIONS

- Cart ID lives in an httpOnly cookie set via `cookies().set()` with:
  - `httpOnly: true`
  - `secure: true`
  - `sameSite: 'lax'`
  - Path = `/`
- Server Actions in `components/cart/actions.ts` are the ONLY way clients mutate the cart. Never call `shopifyFetch` from a `'use client'` component.
- `addLineToCart`, `updateLineQuantity`, `removeLine`, `getCartFromCookie`, `getCheckoutUrl` are the canonical action names.

## OPEN-REDIRECT GUARD on checkout

- `assertCheckoutUrl` in `components/cart/actions.ts` validates the Storefront-returned `cart.checkoutUrl` before redirecting.
- Allowlist: `*.myshopify.com`, `<SHOPIFY_STORE_DOMAIN>`, `shop.<SHOPIFY_STORE_DOMAIN>`, `<SHOPIFY_PRIMARY_DOMAIN>`, `shop.<SHOPIFY_PRIMARY_DOMAIN>`.
- Reject: non-https, embedded credentials (`user:pass@host`), unknown hostnames, lookalike subdomains.
- DO NOT relax this guard. If a domain isn't in the allowlist and you think it should be, surface to orchestrator with the env-var name to add.

## WEBHOOK SECURITY (revalidate route)

- HMAC SHA-256 + `crypto.timingSafeEqual` for signature verification (`x-shopify-hmac-sha256` header against raw body).
- Read raw body via `req.text()` BEFORE any parse.
- 401 on signature mismatch. 200 on valid. Empty for unknown topics.
- `revalidateTag` ONLY for the specific product/collection in the payload. Never wildcard.
- Never log raw signing secret. Never log full payloads (PII risk).

## VALIDATION

- Validate every input that crosses a trust boundary:
  - Variant IDs match `gid://shopify/ProductVariant/...` pattern
  - Cart IDs match `gid://shopify/Cart/...` pattern
  - Email addresses pass RFC 5322 regex
  - Product handle matches `^[a-z0-9][a-z0-9-]*$` (lowercase + hyphens)
- Reject malformed input with 400 + generic error message (no token, no PII, no internal detail).

## LOGGING

- Server-side `console.error` for unexpected errors — fine.
- Server-side `console.log` for happy-path activity — fine, but never log:
  - Storefront access token
  - Webhook signing secret
  - Customer email (PII unless aggregated)
  - Full webhook payload (PII)
- Client-side: no logging of cart contents or anything tied to a real user.

## ENV VARS

- All env vars listed in `context/general/backend.md` "Phase 3 Storefront API env vars (contract)" subsection.
- Never write to `.env.local`, `.env`, or `.env.local.example` — PreToolUse hook blocks.
- If a new env var is needed, document it in `context/general/backend.md` and surface to orchestrator. Do NOT add to `.env*`.

## VERIFICATION (per `.claude/rules/verification.md`)

- Live smoke test against real Storefront API mandatory for new queries/mutations:
  - Fetch a real product handle, confirm typed response
  - Create a real test cart (carts are sandboxed — safe), confirm `checkoutUrl` returned
  - For webhook routes: send signed test payload (200) and unsigned payload (401), screenshot both
- Save proof to `pictures/screenshots/<descriptive-name>.png`.
- `npx tsc --noEmit` must pass clean.
- `git grep -nE 'admin\.shopifyapis\.com|/admin/api/' app/ components/ lib/` must return 0 matches.

## ATOMIC COMMITS

One commit per logical unit. Stage only that unit's files. Commit message format:
```
feat(<plan-id>): <what changed>
```

## When to stop and ask

- Any forbidden operation requested → STOP, surface
- Token / secret would need to be inline → STOP
- A new env var is needed → log to backend.md, surface to orchestrator
- Allowlist needs a new domain → STOP, surface
- API version bump needed → STOP, surface
- Webhook needs new topic → log, surface

</embed>

---

## End of embed block

**Reminder to orchestrator:** the subagent does NOT have the Skill tool. Splice the block above verbatim. Live-store rules are non-negotiable.

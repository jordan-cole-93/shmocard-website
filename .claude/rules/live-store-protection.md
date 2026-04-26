# Live Store Protection

**This rule supersedes everything else.** When in doubt, stop and ask Jordan.

## What's live

- **`shop.shmocard.com`** — the production Shopify store. Real customers, real payments.
- **`shmocard.com`** — the marketing site this repo builds.

The headless integration is **READ-ONLY** from this repo's perspective. Product data, prices, inventory, and orders are managed in Shopify Admin — not in code.

## Hard rules

1. **Never modify the live Shopify Online Store theme.** This repo is a Next.js front-end; the live theme is separate. Don't touch it.
2. **Never modify Shopify domain settings.** Don't change DNS, primary domain, or domain mappings.
3. **Never modify Shopify payment settings or checkout configuration.** Stripe Connect, payment providers, tax — leave alone.
4. **Never run destructive Shopify CLI commands.** No `shopify theme delete`, no `shopify store reset`, no destructive Admin API mutations.
5. **Storefront API only — no Admin API writes.** This repo uses the Storefront API (read + cart). Admin API writes (create/update/delete products, orders, customers) are out of scope and require explicit Jordan approval.
6. **No production secrets in code.** Storefront API tokens go in `.env.local`. Never commit `.env*` files.

## What's safe

- Read product data via Storefront API (queries, not mutations).
- Cart mutations (`cartCreate`, `cartLinesAdd`, etc.) — these don't write to inventory or orders.
- Reading collections, metafields, metaobjects.
- Checkout redirect to Shopify-hosted checkout (not custom).

## Enforcement

- A pre-tool-use hook in `.claude/settings.json` evaluates Shopify-related Bash commands and asks Claude to verify safety before execution.
- A pre-tool-use hook blocks edits to `.env*` files.

## When in doubt

Stop. Ask Jordan. The cost of pausing is low; the cost of breaking the live store is very high.

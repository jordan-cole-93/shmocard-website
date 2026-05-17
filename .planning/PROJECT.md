# Project: Shmocard Website

## What

Brand website for Shmocard at `shmocard.com`. Retail front door — not an ad funnel. Showcases the four sub-brands (Shmo Review, Shmo Biz, Shmo Link, Shmo Reputation) and sells the Shmo Review NFC review card line.

## Stack

Next.js (App Router) + TypeScript · Tailwind CSS 4 · Vercel · Shopify Headless (Storefront API, pending wire-up). Full details: `context/general/backend.md`.

## Source-of-truth docs

| Need | Read |
|---|---|
| Build status & roadmap | `context/general/scope.md` |
| Last session context | `handoff.md` |
| Tech stack details | `context/general/backend.md` |
| Business context | `context/general/context.md` |
| Voice, copy, headlines | `context/general/marketing.md` |
| Product catalog, formats | `context/general/product.md` |
| Design system | `.claude/skills/shmocard-design-system/` |

## Architecture lock (2026-05-16)

`/shmo-review` is the **category / family homepage** for all Shmo Review formats. Each format also gets its own **PDP**:

- `/shmo-review/cr-80` — CR-80 wallet card (Phase 3, active)
- `/shmo-review/l-sign` — L-sign (future)
- `/shmo-review/square-card` — Square card (future)

This supersedes the 2026-05-11 "single-page-with-anchors" decision recorded in `scope.md:26`. PDPs are not abandoned.

## The one rule that supersedes everything

Don't break the live store at `shop.shmocard.com`. See `.claude/rules/live-store-protection.md`.

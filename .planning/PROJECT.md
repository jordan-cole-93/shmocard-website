# Shmocard Website

## What This Is

Brand website for Shmocard at `shmocard.com` — the retail front door for a family of NFC tools sold to local business owners worldwide. Built on Next.js (App Router) + TypeScript + Tailwind 4, integrating with Shopify Headless for product data, cart, and checkout. Not an ad funnel; a peer-trusted destination where buyers confirm in 30 seconds that this is real, sold by people who understand local shops, and will solve their review problem.

## Core Value

A first-time visitor leaves understanding the parent brand and either buys (Shmo Review) or joins a waitlist (Shmo Biz / Shmo Link / Shmo Reputation) — without ever feeling pitched to.

## Requirements

### Validated

(None yet — site is a bare Next.js + Tailwind shell post-design-wipe.)

### Active

- [ ] **REQ-01** Homepage at `/` introduces the parent brand + 4 sub-products with equal weight. Locked headline: "The toolkit your crew's been missing."
- [ ] **REQ-02** Category page at `/shmo-review` sells the Shmo Review category, surfaces bulk math, routes to the right format. Locked headline: "One tap. One five-star review." Tagline: "Built for crews. Priced for bulk."
- [ ] **REQ-03** PDP at `/shmo-review/cr-80` (flagship CR-80 wallet card) — converts decided buyer, surfaces bulk math, accommodates Shopify-driven buybox.
- [ ] **REQ-04** PDP at `/shmo-review/l-sign` (counter standee).
- [ ] **REQ-05** PDP at `/shmo-review/square-card` (plate format, Shopify handle `google-review-plaque`).
- [ ] **REQ-06** Shopify Storefront API wiring — product fetch, cart mutations (`cartCreate`, `cartLinesAdd`, `cartLinesRemove`), checkout redirect via `cart.checkoutUrl`.
- [ ] **REQ-07** Webhook revalidation route at `app/api/revalidate/route.ts` — Shopify product changes propagate in ~5 seconds.
- [ ] **REQ-08** Waitlist capture for Shmo Biz / Shmo Link / Shmo Reputation — email captured to GHL webhook.
- [ ] **REQ-09** Design system from `.claude/skills/shmocard-design-system/` audited and wired in — tokens to `app/globals.css`, fonts mounted in `app/layout.tsx`, primitives composed into React components without restyling.
- [ ] **REQ-10** Mobile + a11y pass on every page; Vercel env mirrored from `.env.local`; DNS cutover for `shmocard.com`.

### Out of Scope

- **Custom checkout** — requires Shopify Plus (~$2,300/mo). Use Shopify-hosted checkout via `cart.checkoutUrl`.
- **Shopify Admin API writes** — read-only from this repo. No product/order/customer mutations.
- **Stripe for card purchases** — reserved for future software subscription only (Stripe Billing).
- **Modifying the live `shop.shmocard.com` Online Store theme, payment settings, or DNS** — production store is read-only from this repo.
- **Custom CSS frameworks beyond Tailwind 4 + the `.shm-*` design system** — no Bootstrap, no Material, no separate component libs.
- **Lucide / Heroicons / 1.5px-stroke icons** — design system mandates hand-drawn 2.4–2.6px stroke iconography.
- **Animation library beyond what the design system locks** — `framer-motion` was removed during the wipe; re-introduction requires explicit decision.

## Context

- **Live store untouched**: `shop.shmocard.com` runs on Shopify, serves real customers, has its own theme. This repo builds a separate Next.js front-end that consumes Shopify data via Storefront API. Hard separation enforced by `.claude/rules/live-store-protection.md`.
- **Design wipe (2026-05-06)**: every previous design artifact was deleted because the prior design pass failed quality bar. The new design system landed at `.claude/skills/shmocard-design-system/` on 2026-05-07 — a substantial, well-specified soft-neobrutalism system with locked `.shm-*` utility prefix, 4-color section rotation, soft-by-default cards, hand-drawn iconography, s'more mascot used as a sticker.
- **Headless integration**: connects via the "Shmo Card Headless" sales channel. Product catalog, pricing, inventory live in Shopify Admin, not code. Webhook revalidation drives ~5-second propagation.
- **Audience**: local business owners (pawn shops, barbers, mechanics, jewelers, roofers, salons, retailers, cafés, mobile crews). Non-technical, peer-driven trust, tired of slick pitches. Site does not need to convince a stranger they have a review problem — it needs to convince someone who already knows.
- **Brand voice**: warm, direct, crew-first. No exclamation marks. No emoji as decoration. Locked headlines per `context/general/marketing.md`.

## Constraints

- **Tech stack**: Next.js (App Router) + TypeScript, Tailwind 4, Vercel hosting, Shopify Storefront API. No alternatives without explicit decision.
- **Live store protection**: Storefront API only — no Admin API writes. Hard rule.
- **Shopify data discipline**: product attributes (name, price, SKU, image, variants) come from Shopify at runtime. No hardcoded product data in components.
- **Design system fidelity**: every utility class is `.shm-` prefixed. No restyling primitives. No gradients. No left-border accent stripes. Wave dividers only. Section rotation = 4 colors only (`marsh / graham / ember / cocoa`). Per `.claude/skills/shmocard-design-system/CLAUDE.md`.
- **File layout locked** per `.claude/rules/file-organization.md`. No new top-level folders without approval.
- **Vault separation**: Jordan's Obsidian vault at `Jordan's Brain/Projects/Shmocard/` is read-only from this repo's perspective. Use `vault-sync` skill for writes.
- **No `.env*` commits**: enforced by pre-tool-use hook.
- **No git history yet**: repo not initialized as of 2026-05-07. Initialize before first commit.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Headless Shopify (Storefront API) over native Shopify theme | Decoupled front-end gives full control over UX and design system; native theme too constrained | ✓ Good — locked |
| Shopify-hosted checkout via `cart.checkoutUrl` over custom checkout | Custom checkout requires Shopify Plus (~$2,300/mo); hosted checkout converts well (Allbirds, Gymshark) | ✓ Good — locked |
| Total design wipe on 2026-05-06 | Prior design failed quality bar; Claude was hallucinating tokens; cleaner to restart than refactor | ✓ Good — locked |
| New design system arrives as standalone folder, audited before wiring | Prevents the same hallucination problem from prior pass; folder review = forced quality gate | — Pending (Phase 2) |
| Project-level `gsd-shmocard` skill over global `/gsd-ingest-docs` | Repo doesn't use ADR/PRD/SPEC convention; global skill returned 0 docs and stalled | ✓ Good — locked 2026-05-07 |
| Live store stays read-only from this repo | Production safety; mistakes break paying customers | ✓ Good — LOCKED |
| Product data in Shopify, presentation in code | Single source of truth; pricing changes don't require deploys; multi-currency safe | ✓ Good — LOCKED |
| Folder rename `context/design system/` → `.claude/skills/shmocard-design-system/` | Kebab-case fixes shell escaping + import paths; stays inside `context/` | ✓ Good — locked 2026-05-07 (Phase 2 / 02-02) |
| Design-system rules → `.claude/rules/design-system.md` (single CLAUDE.md hierarchy) | Eliminates two-CLAUDE.md drift; matches existing rule pattern; rule applies to all UI work | ✓ Good — locked 2026-05-07 (Phase 2 / 02-02) |
| Tailwind 4 ↔ `.shm-*` coexistence: direct CSS `@import`, no `@theme` copy | Preserves CSS-as-source-of-truth invariant; zero drift risk; design system's `.shm-bg-*` flip machinery preserved | ✓ Good — locked 2026-05-07 (Phase 2 / 02-04) |
| Cart state via Zustand + localStorage middleware | Standard headless-commerce pattern; persists for free; small bundle; less boilerplate | ✓ Good — locked 2026-05-07 (Phase 2 / D-01) |
| `framer-motion` for section reveals + drawer / modal entrances; CSS for hover | Premium feel; design-system motion constraints (subtle/fast/non-bouncy) preserved | ✓ Good — locked 2026-05-07 (Phase 2 / D-02) |
| Assets in `public/` (Next.js convention), not in design-system folder | Design system stays code-only; clean source vs runtime asset separation | ✓ Good — locked 2026-05-07 (Phase 2 / D-03) |
| Delete 83 redundant static Bricolage font cuts | Variable font covers same range (200–800, 12–96pt opsz); ~25 MB repo savings | ✓ Good — locked 2026-05-07 (Phase 2 / D-05) |
| GHL webhook URL for waitlist | Deferred; Jordan provides mid-Phase 3 when forms wire up | — Pending (Phase 2 / D-04) |

---
*Last updated: 2026-05-07 after Phase 2 close-out (commit landing this update).*

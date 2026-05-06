# scope.md — Project State & Roadmap

**Last updated:** 2026-05-07

Brand website for Shmocard at `shmocard.com`. Retail front door, headless Shopify + Next.js. Live store at `shop.shmocard.com` is untouched and stays untouched.

---

## Where we are right now

The repo is a **bare Next.js + Tailwind shell**. Every previous design artifact was wiped on 2026-05-06 because the prior design pass failed quality bar and Claude was hallucinating tokens. We are starting the design pass over from scratch.

What still exists:
- `app/` skeleton (bare `layout.tsx` + `page.tsx`, `globals.css` reduced to `@import "tailwindcss";`)
- Project meta-context under `context/general/` (this file, `handoff.md`, `backend.md`, `tools.md`, `context.md`, `marketing.md`, `product.md`)
- Empty per-page brainstorm files under `context/brainstorming/` (homepage-shmocard, homepage-shmoreview, product-page-cr80, product-page-l-sign, product-page-plate)
- `.claude/` rules, hooks, commands, skills, settings
- `pictures/` reference folder

What does **not** exist yet:
- No `components/`, no `lib/`, no `public/`
- No design system folder, no `DESIGN.md`, no `PATTERNS.md`, no design tokens
- No mascot or illustration assets
- No `framer-motion`, `lucide-react`, or `react-icons` in `package.json`
- No Shopify Storefront wiring

---

## What changed vs the prior design pass

The **product, marketing, and backend stay the same**. The only thing being redone is the visual system — colors, type, layout language, motion, components. Locked headlines and product facts in `marketing.md` / `product.md` carry over unchanged.

---

## Phases

### Phase 1 — Docs refresh (in progress, 2026-05-07)

Bring every `.md` file in line with the post-wipe reality.

- [x] Refresh `CLAUDE.md` (point at `context/general/`, drop stale design-system references)
- [x] Refresh `.claude/rules/file-organization.md` (new `context/` layout)
- [x] Rewrite `scope.md` (this file)
- [x] Refresh `handoff.md` to 2026-05-07
- [x] Stub `tools.md` to current state of skills / commands / hooks / MCPs
- [x] Adjust `backend.md` (Framer Motion row → pending new design system)
- [ ] Leave `product.md`, `marketing.md`, `context.md` untouched per instruction
- [ ] Leave `context/brainstorming/*.md` empty until design system lands

### Phase 2 — Design system review

Jordan drops the new design system folder into the repo. Before any code uses it:

- [ ] Audit folder structure for clarity (tokens, type, color, motion, components, examples, docs)
- [ ] Identify messy / redundant / under-specified parts
- [ ] Propose a clean target structure and any rename / consolidation moves
- [ ] Lock `DESIGN.md` + `PATTERNS.md` as the single source of truth
- [ ] Wire tokens into `app/globals.css` and `tailwind.config` (whatever Tailwind 4 calls it)
- [ ] Mount fonts in `app/layout.tsx`

### Phase 3 — Rebuild

Build out the site from the new design system, in order of leverage:

- [ ] Base layout shell (nav, footer, page chrome)
- [ ] Homepage — parent brand doorway, all four sub-brands with equal weight, locked headline "The toolkit your crew's been missing."
- [ ] `/shmo-review` category page, locked headline "One tap. One five-star review.", tagline "Built for crews. Priced for bulk."
- [ ] `/shmo-review/cr-80` — flagship PDP
- [ ] `/shmo-review/l-sign` — counter standee PDP
- [ ] `/shmo-review/square-card` — plate format PDP (Shopify handle: `google-review-plaque`)
- [ ] Cart UI + Shopify Cart API wiring (`cartCreate`, `cartLinesAdd`, `cartLinesRemove`)
- [ ] Checkout redirect via `cart.checkoutUrl`
- [ ] Waitlist capture for Shmo Biz / Shmo Link / Shmo Reputation (GHL webhook)
- [ ] Shopify Storefront API queries — product fetching for all PDPs and the category page
- [ ] Webhook revalidation route (`app/api/revalidate/route.ts`)

### Phase 4 — Launch readiness

- [ ] Mobile pass on every page
- [ ] Lighthouse / a11y pass
- [ ] Vercel env vars mirrored from `.env.local`
- [ ] DNS cutover plan agreed with Jordan (`shmocard.com` → Vercel)
- [ ] Final live-store-protection sanity check

---

## Open decisions

- Whole new design system — **everything** visual is pending the folder Jordan is preparing.
- GHL webhook URL for waitlist captures.
- Final Shopify pricing tiers / SKU naming.
- Whether to bring back `framer-motion` or use a different motion approach.

---

## Hard constraints (do not violate)

- `shop.shmocard.com` is live. Don't touch the Online Store theme, payment settings, or domain config. See `.claude/rules/live-store-protection.md`.
- Product data lives in Shopify, not in code. See `.claude/rules/shopify-data-discipline.md`.
- Don't invent design decisions while Phase 2 is pending. If a UI prompt comes in before the new system lands, surface that to Jordan and pause.
- Don't restructure folders without approval. See `.claude/rules/file-organization.md`.

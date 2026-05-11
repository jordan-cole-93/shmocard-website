# scope.md — Project State & Roadmap

**Last updated:** 2026-05-11

Brand website for Shmocard at `shmocard.com`. Retail front door, headless Shopify + Next.js. Live store at `shop.shmocard.com` is untouched and stays untouched.

---

## Where we are right now

Homepage is built and through a Phase 4-A mobile pass. `/shmo-review` was rebuilt on design-system primitives (commit `44cb1c4`), then **fully deleted on 2026-05-11** ahead of a from-scratch rebuild. Cart smoke-test route exists.

What exists in the codebase:
- `app/page.tsx` — homepage (Hero, sub-brand spotlights for Biz/Link/Reputation, FAQ, FinalCta) — desktop + mobile passes complete
- `app/cart-smoke/page.tsx` — Shopify cart wiring smoke test
- `app/layout.tsx`, `app/globals.css` — base shell
- `components/` — Nav (with mobile hamburger), Footer, Section primitive, home page components, cart components, modals/WaitlistModal, layout primitives
- `lib/` — Shopify Storefront helpers, cart utilities, waitlist
- `.claude/skills/shmocard-design-system/` — operator's manual, primitives, reference pages, fonts
- `public/` — illustrations, mascot poses, sub-brand artwork
- `pictures/screenshots/mobile-audit-2026-05-09/` — 25 mobile verification screenshots

What does **not** exist:
- **`/shmo-review` route** — deleted 2026-05-11, scheduled for from-scratch rebuild
- **`components/shmo-review/`** — deleted 2026-05-11
- PDP sub-routes (`/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`) — **abandoned in favor of single-page-with-anchors architecture** (decision confirmed 2026-05-11)
- Webhook revalidation route
- GHL waitlist webhook URL (deferred until forms get wired)

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

### Phase 2 — Design system review (✅ complete 2026-05-07)

Design system landed on 2026-05-07 (later relocated to `.claude/skills/shmocard-design-system/`). Full audit + integration plan + translation plan + locked decisions.

- [x] Audit folder structure (step 02-01 — see `.planning/phases/02-design-system-review/AUDIT.md` — 8 issues surfaced)
- [x] Structural moves executed (step 02-02 — folder renamed kebab; design-system rules moved to `.claude/rules/design-system.md`; SKILL.md frontmatter stripped; 02-03 collapsed in)
- [x] Tailwind 4 ↔ `.shm-*` coexistence locked (step 02-04 — `INTEGRATION.md` — Option A direct CSS import; Tailwind for layout only; `.shm-*` for everything visual)
- [x] Reference-page translation plan locked (step 02-05 — `TRANSLATION.md` — homepage/PDP/cart drawer mapped to ~54 .tsx files; server-component-first; framer-motion usage map)
- [x] 5 decisions locked (step 02-06 — `DECISIONS.md` — Zustand cart, framer-motion, public/ assets, GHL deferred, 83 static font cuts deleted)
- [x] Phase 2 close-out (step 02-07 — this commit)

### Phase 3 — Rebuild

Build out the site from the new design system, in order of leverage:

- [x] Base layout shell (nav, footer, page chrome) — Nav has mobile hamburger; Footer links to `/shmo-review` anchors
- [x] Homepage — parent brand doorway, all four sub-brands with equal weight, locked headline "The toolkit your crew's been missing."
- [ ] **`/shmo-review` — single page with anchored sections** (rebuild from scratch, locked 2026-05-11):
  - Locked headline: "One tap. One five-star review."
  - Locked tagline: "Built for crews. Priced for bulk."
  - All three formats (CR-80, L-Sign, Square Card) live on this one page via a format picker that drives an anchored buybox (`#buybox`). No PDP sub-routes.
  - Footer + home format-card links already point at `/shmo-review#buybox` and `/shmo-review#formats` — wiring is in place, just need the route.
- [x] Cart UI + Shopify Cart API wiring (`cartCreate`, `cartLinesAdd`, `cartLinesRemove`) — smoke-test route at `/cart-smoke`
- [ ] Checkout redirect via `cart.checkoutUrl` — verify end-to-end during `/shmo-review` rebuild
- [ ] Waitlist capture for Shmo Biz / Shmo Link / Shmo Reputation (GHL webhook URL pending)
- [ ] Shopify Storefront API queries — finalize product fetching for the three `/shmo-review` formats
- [ ] Webhook revalidation route (`app/api/revalidate/route.ts`)

### Phase 4 — Launch readiness

- [x] Mobile pass on homepage (Phase 4-A complete 2026-05-11, commits `6fa19ae` → `dd64876`)
- [ ] Mobile pass on `/shmo-review` (after rebuild)
- [ ] Mobile pass on cart drawer
- [ ] Lighthouse / a11y pass
- [ ] Vercel env vars mirrored from `.env.local`
- [ ] DNS cutover plan agreed with Jordan (`shmocard.com` → Vercel)
- [ ] Final live-store-protection sanity check

---

## Open decisions

- ✅ Design system — landed 2026-05-07; Phase 2 audit + integration + translation plans complete.
- ✅ Motion library — `framer-motion` locked 2026-05-07 (Phase 2 D-02).
- ✅ Cart state — Zustand + localStorage locked 2026-05-07 (Phase 2 D-01).
- ✅ Asset location — `public/` locked 2026-05-07 (Phase 2 D-03).
- ✅ Static font cuts — deleted 2026-05-07 (Phase 2 D-05). Variable font covers same range.
- GHL webhook URL — deferred to mid-Phase 3 (when waitlist forms get wired).
- Final Shopify pricing tiers / SKU naming — Jordan handles in Shopify Admin during Phase 3.

---

## Hard constraints (do not violate)

- `shop.shmocard.com` is live. Don't touch the Online Store theme, payment settings, or domain config. See `.claude/rules/live-store-protection.md`.
- Product data lives in Shopify, not in code. See `.claude/rules/shopify-data-discipline.md`.
- Don't invent design decisions while Phase 2 is pending. If a UI prompt comes in before the new system lands, surface that to Jordan and pause.
- Don't restructure folders without approval. See `.claude/rules/file-organization.md`.

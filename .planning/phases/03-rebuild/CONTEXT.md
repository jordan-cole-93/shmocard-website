# Phase 3: Rebuild — Context

**Gathered:** 2026-05-07
**Status:** Ready for planning
**Source:** `/gsd-discuss-phase 3` (manual run since `gsd-sdk` binary unavailable; same workflow content + AskUserQuestion-style picker collapsed to inline Q&A with Jordan)

<domain>
## Phase Boundary

Phase 3 is the **rebuild** — wire the design system at `.claude/skills/shmocard-design-system/` into a working Next.js 15 App Router site. Build the foundations (globals, fonts, nav, footer, base layout primitive) first; then homepage; then `/shmo-review` category page; then 3 PDPs (CR-80, L-Sign, Square Card); then cart UI + Shopify Storefront API + checkout redirect + waitlist webhook.

Output: a deployable site at `shmocard.com` (DNS cutover happens in Phase 4).

**In scope:** every requirement REQ-01 through REQ-09 plus the webhook revalidation route. Asset migration `pictures/` → `public/`. ~54 new component files per `TRANSLATION.md`.

**Out of scope:** mobile / a11y polish (Phase 4), DNS cutover (Phase 4), launch readiness checks (Phase 4), Lighthouse / performance pass (Phase 4), Vercel env mirroring (Phase 4 although `.env.local` setup happens here for dev).

</domain>

<decisions>
## Implementation Decisions (LOCKED)

### Build order — A1 sequential (LOCKED)

Foundations first, vertical slices NOT used. Order:

1. **3-Foundations** — `app/globals.css` (imports tailwindcss + design-system CSS), `app/layout.tsx` (mounts fonts, renders `<Nav />` + `<Footer />` + `<CartDrawer />` + `{children}`), `components/Nav.tsx`, `components/Footer.tsx`, `components/Mascot.tsx`, `components/Sticker.tsx`. Asset migration `pictures/` → `public/`. Cart store (Zustand) skeleton at `components/cart/store.ts`.
2. **3-Homepage** — `app/page.tsx` + 11 home section components per `TRANSLATION.md` (Hero, AudienceStrip, Proof, 4× SubBrandSpotlight, CrewStrip, HowItWorks, VideoTestimonials, Compatibility, HomeFaq, FinalCta).
3. **3-ShmoReview** — `app/shmo-review/page.tsx` (category page).
4. **3-PDPs** — `app/shmo-review/[handle]/page.tsx` + ~14 PDP components (PdpGallery, PdpBuyboxColumn, PdpStickyBar, etc.). Server-fetches product by handle via Shopify Storefront API.
5. **3-Cart** — Cart drawer + line item + qty + summary + free-ship band + checkout button. Wired to Storefront API mutations.
6. **3-Shopify** — Storefront API queries + cart mutations + checkout redirect + webhook revalidation route at `app/api/revalidate/route.ts`.
7. **3-Waitlist** — modal + Server Action posting to GHL webhook (env var; URL provided mid-Phase 3 by Jordan).

### Content / copy decisions

#### B1 — Hero `<em>` type-cycle (LOCKED)

Locked headline: **"The toolkit your crew's been [missing | asking for]."**

Two-word cycle on the END of the headline. Words alternate every ~2.5s with crossfade (CSS or `framer-motion` `AnimatePresence` + 150ms ease-standard).

**Implementation:** the `<em>` accent wraps the cycling word(s). One token visible at a time. No layout shift — reserve max width via `min-width` based on the longer alternative ("asking for" wider than "missing").

#### B2 — Audience marquee (LOCKED)

Keep the mock 10 audiences in source order:

> Barbers · Pawn shops · Auto shops · Jewelers · Roofers · Salons · Cafés · Restaurants · Mobile crews · Independent retailers

CSS keyframe scroll-left, 38s duration, paused on hover.

#### B3 — Proof section data (LOCKED — HARD RULE)

Use **real Pawn Leads client data** for shop names + metrics in the proof section.

**HARD RULE — NEVER mention "Pawn Leads" anywhere on the Shmocard site.** Brand separation: Pawn Leads is Jordan's services agency; Shmocard is the product brand. The two never co-brand on the public site. Use the client shop names directly with no agency attribution.

Phase 3 implementation:
- I draft proof section copy using real shop names + real metrics from Pawn Leads client data (Jordan provides the source list when this section gets built).
- No string "Pawn Leads" / "PawnLeads" / "@pawnleads" / etc. appears in any rendered HTML, alt text, image filename, OR comment.
- A grep check pre-deploy confirms zero hits.

#### B4 — HOW IT WORKS (LOCKED)

Keep the mock 6 steps (from `home-data.jsx`):

1. You order
2. We program
3. Crew hands it over
4. Customer taps
5. Five stars, one sentence
6. QR fallback

Layout: 3-column grid, 2 rows.

#### B5 — FAQ (DEFERRED — Jordan will review at build time)

Phase 3 Homepage stage: I draft new FAQ Qs + answers from `marketing.md` + `product.md` + `context/general/context.md` content. Jordan reviews and edits when the FAQ section is being built (not now).

Mock FAQ in `home-data.jsx` is reference for **format only** — the 6 Qs there get replaced with fresh draft.

#### B6 — Sub-brand spotlight order (LOCKED)

Mock order kept: **Review → Biz → Link → Reputation**.

Section bg rotation per spotlight (preserves the 4-color rule):
- Review: `shm-bg-marsh`
- Biz: `shm-bg-graham`
- Link: `shm-bg-marsh`
- Reputation: `shm-bg-cocoa`

Crew strip inserts directly after Review per `home.css`.

#### B7 — Footer (LOCKED)

Keep mock 4-column structure: brand+social, products, shop, help. Final link list to be confirmed at build time (mock has placeholder hrefs).

### Asset readiness

| Category | Status | Source | Target |
|---|---|---|---|
| Mascot PNGs | ✅ Ready (13 emotions present) | `pictures/mascot/` | `public/mascot/` |
| CR-80 product photos | ✅ Ready (carousel + transparent) | `pictures/cr80/` | `public/products/cr80/` |
| L-Sign product photos | ✅ Ready (color + black + transparent) | `pictures/l-sign/` | `public/products/l-sign/` |
| Plate (Square Card) photos | ✅ Ready (carousel + transparent) | `pictures/plate/` | `public/products/plate/` |
| Logo lockup | ✅ Ready | `pictures/logo/Logo-Mascot.png` | `public/logo/` |
| Hero shmo-review image | ✅ Ready | `pictures/shmo-review/Hero Image 2 - Shmo Review.png` | `public/hero/` |
| Crew photos (homepage CrewStrip) | ❌ Pending | — | Use `<Placeholder />` component or stock muted gray rectangles |
| Video testimonials | ❌ Pending | — | Use `<Placeholder />` component for tiles; video URL fields stubbed |

Filenames keep `mascot-*` prefix as-is (e.g., `public/mascot/mascot-holding-card.png`) to avoid mass-rename pain. Mock data (`SUB_BRANDS` in `home-data.jsx`) gets path-rewritten during translation.

### Sub-brand waitlist UX (LOCKED — D1)

"Notify me" CTA on Biz / Link / Reputation spotlights → **opens modal** (mock pattern preserved).

Modal: `components/modals/WaitlistModal.tsx`. Triggered via Zustand or local context. Form posts to GHL webhook via Server Action.

### GHL webhook URL (DEFERRED — D2)

Jordan provides webhook URL mid-Phase 3, when the waitlist plan stub is being built. Phase 3 scaffold uses `process.env.GHL_WAITLIST_WEBHOOK_URL` with placeholder commented in `.env.local`. The waitlist plan blocks until URL is provided.

### Claude's Discretion

Implementation details Jordan does NOT need to weigh in on (per discuss-phase guardrails):

- React component prop types and internal hook usage
- Tailwind utility choices (within INTEGRATION.md's "layout only" constraint)
- File naming for individual components (TRANSLATION.md provides target paths)
- TypeScript types for Shopify Storefront API responses
- Server vs client component boundaries (TRANSLATION.md provides defaults; deviations get justified)
- CSS layout specifics inside page-level CSS files (`home.css`, `pdp.css`, `cart-drawer.css`)
- Test scaffolding (defer; Phase 4 may add tests)
- Bundle optimization choices (Vercel handles automatically)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (planner, executor) MUST read these before implementing.**

### Phase 3 inputs (Phase 2 outputs)

- `.planning/phases/02-design-system-review/AUDIT.md` — design system folder inventory
- `.planning/phases/02-design-system-review/INTEGRATION.md` — Tailwind 4 ↔ `.shm-*` strategy + ready `app/globals.css` skeleton
- `.planning/phases/02-design-system-review/TRANSLATION.md` — section-by-section component map (~54 files)
- `.planning/phases/02-design-system-review/DECISIONS.md` — 5 architectural decisions (Zustand, framer-motion, public/, GHL deferred, font cuts)

### Repo-level rules

- `.claude/rules/design-system.md` — auto-applied for any UI work; `.shm-*` prefix mandatory; section rotation; mascot sticker rule; type stack
- `.claude/rules/live-store-protection.md` — Storefront API only; no Admin API writes; live store untouched
- `.claude/rules/shopify-data-discipline.md` — product data in Shopify; presentation in code
- `.claude/rules/file-organization.md` — folder structure (LOCKED)
- `.claude/rules/verification.md` — browser proof before claiming done

### Repo-level project context

- `CLAUDE.md` — pointer table + auto-trigger skill routing
- `context/general/context.md` — business + audience + page intents
- `context/general/marketing.md` — locked headlines + voice rules
- `context/general/product.md` — catalog (CR-80, L-Sign, Square Card specs)
- `context/general/backend.md` — Shopify integration, env vars, webhook revalidation, Animation = framer-motion
- `context/general/scope.md` — phase punch list

### Design system source-of-truth

- `.claude/skills/shmocard-design-system/SKILL.md` — operator's manual + primitive table
- `.claude/skills/shmocard-design-system/PRIMITIVES.md` — canonical primitive index
- `.claude/skills/shmocard-design-system/colors_and_type.css` — every token + type ramp + section bg flips
- `.claude/skills/shmocard-design-system/components.css` — every primitive
- `.claude/skills/shmocard-design-system/ui_kits/website/homepage/Shmocard Homepage.html` + `home.css` — canonical marketing page
- `.claude/skills/shmocard-design-system/ui_kits/website/Buybox.html` — canonical PDP + sticky bar
- `.claude/skills/shmocard-design-system/ui_kits/website/Cart Drawer.html` — canonical cart drawer
- `.claude/skills/shmocard-design-system/ui_kits/website/homepage/home-data.jsx` — mock content shape (used as REFERENCE; final copy gets rewritten in Phase 3)

### Asset source

- `pictures/mascot/` — 13 mascot PNGs ready
- `pictures/cr80/`, `pictures/l-sign/`, `pictures/plate/` — product photography ready
- `pictures/logo/Logo-Mascot.png` — logo lockup
- `pictures/shmo-review/Hero Image 2 - Shmo Review.png` — Shmo Review hero

### GSD planning artifacts

- `.planning/PROJECT.md` — locked decisions + constraints
- `.planning/REQUIREMENTS.md` — REQ-01 through REQ-10
- `.planning/ROADMAP.md` — Phase 3 plan stubs (12 stubs)

</canonical_refs>

<specifics>
## Phase-Specific Notes

- **Verification standard:** every Phase 3 plan stub ends with browser verification per `verification.md`. Not "tsc compiles" — "feature renders and works in dev server, screenshot saved to `pictures/screenshots/`".
- **Atomic commits per plan stub.** Phase 3 is the largest phase; each plan stub commits independently so reverts stay surgical.
- **Live store protection still in force.** No Shopify Admin API. No DNS changes. No theme edits.
- **`pictures/` migration.** Files copy/move from `pictures/` to `public/` during the 3-Foundations stage. After migration, `pictures/` keeps screenshots + future mockup raw assets per `file-organization.md`.
- **Pawn Leads brand separation.** Re-stated for emphasis: NEVER write "Pawn Leads" in any file Phase 3 produces. Pre-commit grep check + final pre-deploy grep check enforce this.
- **Multi-session.** Phase 3 is the largest phase by far. Expect to span multiple sessions. STATE.md updates after each plan stub.

</specifics>

<deferred_ideas>
## Deferred Ideas (out of Phase 3 scope)

These came up implicitly or were preserved from REQUIREMENTS.md "Out of Scope":

- Mobile / a11y polish (Phase 4)
- Lighthouse / performance pass (Phase 4)
- DNS cutover (Phase 4)
- Search / filtering on category page (out, ever — only 3 formats)
- Login / accounts on marketing site (out — Shopify-hosted checkout handles auth)
- Blog / CMS (out for v1)
- Multi-currency / multi-region (deferred to future milestone via Shopify Markets)
- Custom checkout (out — requires Shopify Plus)
- Tests (defer; Phase 4 may add for critical surfaces)
- Crew photos + video testimonials — placeholders for Phase 3, real assets when available

</deferred_ideas>

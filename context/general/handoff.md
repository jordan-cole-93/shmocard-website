# handoff.md — Session Handoff

**Last session:** 2026-05-11 evening — orientation + clean slate for the next `/shmo-review` rebuild. Confirmed the **single-page-with-anchors** architecture, deleted the prior `/shmo-review` route and its component folder, and brought `scope.md` + this file back in sync with reality.

---

## Project phase

Phase 3 (Rebuild) is **partially complete**: homepage built + mobile pass landed, Nav + Footer + cart smoke-test wired, design system locked under `.claude/skills/shmocard-design-system/`. The next Phase 3 chunk is `/shmo-review` — a from-scratch rebuild on top of the design-system primitives.

Phase 4-A (homepage mobile pass) shipped earlier on 2026-05-11. The Wave 2 (polish) + Wave 3 (systematize breakpoints into tokens) items in `.planning/phases/04-mobile-pass/PLAN.md` are still open but not blocking the `/shmo-review` work.

---

## What was done this session

- **Inventoried the routes** — only `/`, `/shmo-review`, and `/cart-smoke` exist. PDP sub-routes were intentionally deleted on 2026-05-11 earlier-session per commit `44cb1c4`.
- **Deleted `/shmo-review`** — both `app/shmo-review/` and `components/shmo-review/` (14 component files) removed. No orphan imports anywhere in the codebase. Stale `.next/` cache will clear on next dev/build.
- **Left shared route links intact.** Per explicit decision: `/shmo-review` links in `components/Nav.tsx` (2), `components/Footer.tsx` (5), `components/home/Hero.tsx` (2), `components/home/FinalCta.tsx` (2), `components/home/home-data.ts` (4 format cards), `components/cart/CartEmpty.tsx` (1) are **untouched**. They'll resolve once the new route lands. No re-wiring needed during rebuild.
- **Locked the `/shmo-review` architecture for the rebuild:** one route, no PDP sub-routes. Format picker drives an anchored buybox (`#buybox`). Footer/home/format-card links already point at this structure.
- **Updated `context/general/scope.md`** — Phase 3 list collapsed from "category page + 3 PDPs" to "single page with anchored sections." Marked homepage + base layout + cart smoke as complete. Updated "what exists / does not exist" section to reflect actual repo state.
- **Updated this file** — replaced the prior mobile-pass entry (now archived in commits `551ddf8` + the 13 mobile commits before it) with the current orientation + deletion summary.

### Files modified this session

- `context/general/scope.md` — Phase 3 + state section updated
- `context/general/handoff.md` — this file (rewrite)

### Files deleted this session

- `app/shmo-review/page.tsx`
- `components/shmo-review/` (14 files: `Hero.tsx`, `BuyboxSection.tsx`, `BuyboxClient.tsx`, `FormatPicker.tsx`, `StandoutMoments.tsx`, `HowItWorksSticky.tsx`, `NumbersWall.tsx`, `BulletStrip.tsx`, `Objections.tsx`, `ShipReturns.tsx`, `ReviewFaq.tsx`, `FinalCta.tsx`, `data.ts`, `index.ts`, `shmo-review.css`)

### Commits landed this session

None yet — the deletion + doc updates above are uncommitted at session close. Stage and commit before the rebuild starts to keep the rebuild branch clean.

---

## What's next

**Rebuild `/shmo-review` from scratch on the design system.**

Locked direction:
- **Headline:** "One tap. One five-star review."
- **Tagline:** "Built for crews. Priced for bulk."
- **Architecture:** single page, anchored buybox at `#buybox`, format picker scrolls user there.
- **Three formats:** CR-80 (flagship), L-Sign (counter standee), Square Card (Shopify handle `google-review-plaque`).
- **Product data from Shopify Storefront API** — no hardcoded names/prices/SKUs/images. See `.claude/rules/shopify-data-discipline.md`.
- **Design system is the authority.** Load the `shmocard-design-system` skill first. Compose `.shm-*` primitives. No primitive restyles. Four-bg section rotation (marsh → graham → ember → cocoa). Wave dividers as SIBLINGS of sections, never children.

Open architectural choices for the rebuild kickoff:
- **Section list / wireframe** — `context/brainstorming/homepage-shmoreview.md` is currently empty. Worth a wireframe pass before code, or jump straight to composition from the design-system reference (`Shmocard Homepage.html` + `Buybox.html`)?
- **Buybox composition** — the deleted `BuyboxClient.tsx` had quantity + variant logic working. If we want that pattern back, reference the git history at `44cb1c4` rather than rebuilding the cart-line mapping cold.

---

## Open decisions (carried)

- **Phase 4 routing** — A polish / B visual-redesign / C launch-readiness. The mobile-pass session committed to A in practice but `ROADMAP.md` still doesn't reflect it.
- **Wave 2 polish + Wave 3 breakpoint tokens** on the homepage — paused. Not blocking `/shmo-review`.
- **GHL webhook URL** — deferred to whenever waitlist forms get wired.
- **Avatar photo compression** (John 2.9 MB / Cindy 9.4 MB committed uncompressed) — still pending.
- **Joey video status** — still pending.
- **Hero copy divergences** — eyebrow "A toolkit, not a card" vs canonical "A toolkit for local crews"; second CTA label.

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Read the locked direction in `scope.md` Phase 3 — single-page `/shmo-review` with anchored buybox.
4. **Before any UI work:** invoke the `shmocard-design-system` Skill tool per `.claude/rules/skill-routing.md`. Then read `.claude/rules/design-system.md`.
5. Ask Jordan: **"Wireframe first in `context/brainstorming/homepage-shmoreview.md`, or compose straight from the design-system reference pages?"**
6. **Don't bulk-dispatch UI subagents.** One section/page at a time per the locked feedback memory. Invoke `frontend-design` first when starting any UI work.
7. **Patterns from prior `/shmo-review` work worth reusing:**
   - Buybox cart-line mapping used the `lib/cart` hydration utility — don't rebuild the mapping cold (memory 794–795).
   - Format picker data structure used a `tone` field that maps directly to `.shm-card` variants (memory 822).
   - When sections don't compress at mobile, the `:has()` + parallel `*Mobile` component pattern from the homepage spotlight illustrations is the right tool.

# handoff.md — Session Handoff

**Last session:** 2026-05-16 — Codex setup/reconciliation started. Created safety branch `codex-reconcile-shmo-review-state`, identified stale docs vs actual disk state, and began aligning project docs/config for Codex while preserving all existing dirty website work.

---

## Project phase

Phase 3 (per scope.md) — single-page `/shmo-review` rebuild on design-system primitives, currently in workspace reconciliation before more feature work.

The older section-by-section plan is documented in `context/brainstorming/shmo-review.md`, but actual disk state has drifted beyond that plan. Current `app/shmo-review/page.tsx` renders: Hero → BulletStrip → Buybox → ProofMarquee → CrewStrip → HowItWorks → FormatPicker → VideoTestimonials → Faq → FinalCta.

---

## What was done before this reconciliation

- **Phase 0 — Scaffolding** (commit `3e14a79`): created `app/shmo-review/page.tsx`, `app/shmo-review/shmo-review.css` (page-scoped wave overrides 56/88/120px), `components/shmo-review/` folder, `components/NavLink.tsx` client component for active-state nav, `.linkActive` style in `components/Nav.module.css`. Also fixed a pre-existing bug from the 2026-05-11 mobile-pass commit where `<details>` wrapping hid every nav link at desktop — set `<details open>` as default in `components/Nav.tsx`.

- **Phase 1 — Hero** (commit `c7de17d`): server component `components/shmo-review/Hero.tsx`. Custom `.review-hero` section with grid-textured marshmallow bg, centered eyebrow + headline with em accent + holding-card mascot sticker, lede, dual CTAs, stars/ships meta, placeholder hero strip. Wave sibling into graham.

- **Phase 2 — BulletStrip** (commit `8d6eefe`): `components/shmo-review/BulletStrip.tsx` on graham. Four ember stats `0 / 3s / 100% / 60d` with vertical hairline dividers between cells.

- **Phase 3 — Buybox** (commit `eb900a8`): the big one. `components/shmo-review/Buybox.tsx` client component composing `.shm-rating`, `.shm-checklist--featured`, `.shm-pack-rows`, `.shm-callout--success`, `.shm-qty`, `.shm-google`, `.shm-btn--xl`, `.shm-faq-list` primitives. Gallery + thumbs use existing `/public/products/cr80/transparent/*.png`. Pack picker defaults to 10-pack with "Most popular" ember badge. Add-to-cart wires through to the existing Zustand `useCartStore` and opens the cart drawer with a placeholder Shopify-shaped `CartLine`. Every product field tagged with `// TODO(shopify):` for the future Storefront wiring phase.

- **Phase 4 — FormatPicker** (commit `b2b3ae3`, refactored in `bdc0d35`): initial port shipped on hand-rolled `.format-card`. Later in the session Jordan flagged it wasn't respecting the design system; audit confirmed `.shm-product` (components.css:1011-1109) is the dedicated primitive. Rebuilt entirely on `.shm-product` + tones moved to the badge (ember/honey/soft). Dropped 100+ lines of `.format-card` CSS; page-level CSS now owns layout only (`.format-grid`, `.format-blurb`, `.format-price-meta`).

- **Phase 5 — HowItWorks** (commit `db3bc24`, then `f89c5d7`, then `cf84077`, then `7b2c78f`): the most-iterated section.
  - Initial port (`db3bc24`): sticky phone with IntersectionObserver scroll-spy on 4 steps and per-step opacity fade. 4 phone-screen variants (handoff card-tilt, tap ring-pulse, review star-pop, submitted check-pop) with their own keyframes.
  - Bug fix #1 (`f89c5d7`): the phone scrolled off-screen mid-section. Root cause: `align-items: start` on `.how-stage` left the phone column at its natural 745px while the steps column stretched to 1910px, so sticky's containing block ran out. Removed the rule.
  - Rework (`cf84077`): Jordan asked for all 4 step texts visible at once. Switched from per-step IntersectionObserver to a dual-sticky pattern with `.how-stage { min-height: 200vh }` and a scroll-progress listener.
  - Fix #2 (`7b2c78f`): the 200vh min-height left a huge empty marsh band at the bottom of the section. Diagnosed and presented 3 options to Jordan; he picked Option A. Dropped the min-height, kept steps in normal flow, kept phone sticky, switched the scroll-progress formula to the full visibility window (section entering bottom → exiting top).

- **Phase 6 — StandoutMoments** (commit `6f15874`): three hero stat cards Allan 80+ (ember), Carly 14 (cocoa), Marshall 5 (honey) with 96px display numbers, blockquotes, hairline-divided attribution.

- **Phase 7 — NumbersWall** (commit `5c3ba64`, polish `48892d8`): 8 verified shop bars with IntersectionObserver-staggered reveal (60-80ms per index). Per Jordan + design-system "No gradients" rule, the reference's `linear-gradient(honey → ember)` bar fill was swapped for flat `var(--color-ember)`. Polish: shuffled rows out of monotonic descending order into a zig-zag (71 → 86 → 47 → 81 → 41 → 71 → 60 → 43).

- **Homepage section reuse** (commits `6ff36d9`, `2184037`): Jordan asked to splice "For the people on the floor" (CrewStrip) and "Crews on camera" (VideoTestimonials) into `/shmo-review`. Refactored both `components/home/CrewStrip.tsx` and `components/home/VideoTestimonials.tsx` to accept optional `bg` / `nextBg` props (defaults preserve homepage usage). Then in `2184037`, moved CrewStrip directly under Buybox per his updated spec.

- **Polish commits**:
  - `14cb77f` — tightened buybox→format-picker spacing (216px → 120px).
  - `8f2fb04` — tightened format-picker→how-it-works spacing same way.

### Files created

- `app/shmo-review/page.tsx`
- `app/shmo-review/shmo-review.css`
- `components/NavLink.tsx`
- `components/shmo-review/Hero.tsx`
- `components/shmo-review/BulletStrip.tsx`
- `components/shmo-review/Buybox.tsx`
- `components/shmo-review/FormatPicker.tsx`
- `components/shmo-review/HowItWorks.tsx`
- `components/shmo-review/StandoutMoments.tsx`
- `components/shmo-review/NumbersWall.tsx`
- `context/brainstorming/shmo-review.md`

### Files modified

- `components/Nav.tsx` — `<details open>` default + NavLink for `/shmo-review`
- `components/Nav.module.css` — `.linkActive` style
- `components/home/CrewStrip.tsx` — optional `bg` / `nextBg` props
- `components/home/VideoTestimonials.tsx` — optional `bg` / `nextBg` props

### Last committed section order before drift

1. Hero (custom bg, grid texture, marshmallow)
2. BulletStrip (graham)
3. Buybox (marsh)
4. **CrewStrip** — "For the people on the floor" (marsh)
5. **HowItWorks** — "From handoff to five stars, in one tap." (marsh)
6. **FormatPicker** — "Pick the shape that fits your shop." (graham island)
7. **VideoTestimonials** — "Crews on camera" (marsh)
8. **StandoutMoments** — "What happens when crews actually hand them over." (marsh)
9. **NumbersWall** — "Real shops. Real review-volume increases." (marsh → cocoa wave)

Actual current disk order has since changed to the order listed at the top of this file.

---

## Codex reconciliation status

Current branch: `codex-reconcile-shmo-review-state`.

Current buckets:

- **Codex setup:** `AGENTS.md`, `.codex/`, `.agents/skills/`.
- **Legacy/reference still present:** `.claude/` skills, agents, and rules.
- **Website work in progress:** `/shmo-review`, design-system primitive updates, home section props, cart drawer additions.
- **Verification artifacts:** untracked screenshots under `pictures/screenshots/`.

Important config fix already made: Codex agent configs now point to `.agents/skills/...` and `.claude/rules/...` instead of the non-existent `.Codex/...` paths.

## What's next

Do not immediately continue to the older Phase 8 plan. First finish reconciliation:

1. Verify whether the current `/shmo-review` tail order is intentional.
2. Decide whether the untracked screenshots should be committed as proof artifacts or left local.
3. Make a setup/docs commit for the Codex migration.
4. Then make a separate website/cart commit only after browser verification.

Older reference for the next possible section remains: **Phase 8 — Objections (cocoa)** per `context/brainstorming/shmo-review.md`.

---

## Open decisions

- **Section rotation tail.** Current disk order ends `…VideoTestimonials → Faq → FinalCta`, with `ProofMarquee` replacing the old NumbersWall slot. Confirm whether to keep that direction or return to Objections/ShipReturns from the old plan.
- **Shopify wiring.** Every product field in Buybox + FormatPicker carries a `// TODO(shopify):` marker. The plan defers this to a dedicated future phase via the `shmocard-shopify-work` wrapper. Not blocking the current rebuild.
- **Buybox sticky bar.** The reference's `.shm-buybox-sticky` slide-down-on-scroll bar is not yet wired up on `/shmo-review`. Plan doc has it as part of Phase 3 — verify with Jordan whether he wants it added retroactively before continuing to Phase 8, or after the page is fully built out.
- **Mobile nav UX.** The `<details open>` fix in Phase 0 means the mobile dropdown is visible by default on first load. Acceptable trade-off, but a future iteration to a CSS-only checkbox-hack would give mobile-default-closed cleanly.

---

## How to start next session

1. Read this file.
2. Read `AGENTS.md`, `CLAUDE.md`, and `context/general/scope.md`.
3. Run `git status --short`.
4. Verify `/shmo-review` in browser before editing more UI.
5. Ask Jordan whether to keep the current `ProofMarquee → ... → Faq → FinalCta` tail or return to the older Objections/ShipReturns plan.

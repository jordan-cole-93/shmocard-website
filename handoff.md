# handoff.md — Session Handoff

**Last session:** 2026-05-12 — rebuilt /shmo-review from scratch through Phase 7 (9 of 11 sections live), reused two homepage sections, and refactored the FormatPicker onto the `.shm-product` primitive after a design-system audit.

---

## Project phase

Phase 3 (per scope.md) — single-page `/shmo-review` rebuild on design-system primitives.

Section-by-section plan is documented in `context/brainstorming/shmo-review.md`. Through this session: **Phases 0 → 7 complete + 2 homepage sections reused**. Phases 8–11 (Objections / ShipReturns / FAQ / FinalCta) still to do.

---

## What was done this session

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

### Current section order (matches Jordan's 2026-05-12 spec)

1. Hero (custom bg, grid texture, marshmallow)
2. BulletStrip (graham)
3. Buybox (marsh)
4. **CrewStrip** — "For the people on the floor" (marsh)
5. **HowItWorks** — "From handoff to five stars, in one tap." (marsh)
6. **FormatPicker** — "Pick the shape that fits your shop." (graham island)
7. **VideoTestimonials** — "Crews on camera" (marsh)
8. **StandoutMoments** — "What happens when crews actually hand them over." (marsh)
9. **NumbersWall** — "Real shops. Real review-volume increases." (marsh → cocoa wave)

---

## What's next

**Phase 8 — Objections (cocoa)** per `context/brainstorming/shmo-review.md`. First dark section on the page — `.shm-` prefix utilities will auto-flip text from cocoa-deep to marshmallow. Reference: `review-parts.jsx:386-413` + matching CSS at `review.css:727+` in `.claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/`.

Order of remaining phases per the plan doc:

- **Phase 8 — Objections** (cocoa, 4-card answers to "but we already ask for reviews…" objections)
- **Phase 9 — ShipReturns** (graham)
- **Phase 10 — FAQ** (marsh)
- **Phase 11 — FinalCta** (ember)

Concrete next actions at the start of next session:

1. Read `context/brainstorming/shmo-review.md` for the locked section rotation.
2. Read this `handoff.md` for current state.
3. Read the reference component + CSS for Objections (lines noted above).
4. Port → wire into `page.tsx` between `NumbersWall` and the not-yet-built `ShipReturns` → screenshot → commit.

---

## Open decisions

- **Section rotation tail.** Current end of page is `…NumbersWall (marsh → cocoa wave)`. The plan doc says Objections is the cocoa section. No conflict — proceed as planned. Just confirm with Jordan if he wants to reshuffle anything else like he did with CrewStrip.
- **Shopify wiring.** Every product field in Buybox + FormatPicker carries a `// TODO(shopify):` marker. The plan defers this to a dedicated future phase via the `shmocard-shopify-work` wrapper. Not blocking the current rebuild.
- **Buybox sticky bar.** The reference's `.shm-buybox-sticky` slide-down-on-scroll bar is not yet wired up on `/shmo-review`. Plan doc has it as part of Phase 3 — verify with Jordan whether he wants it added retroactively before continuing to Phase 8, or after the page is fully built out.
- **Mobile nav UX.** The `<details open>` fix in Phase 0 means the mobile dropdown is visible by default on first load. Acceptable trade-off, but a future iteration to a CSS-only checkbox-hack would give mobile-default-closed cleanly.

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Read `context/brainstorming/shmo-review.md`.
4. Ask Jordan: "Green light for Phase 8 — Objections on cocoa, or want to refine anything in phases 0–7 first?"
5. Invoke the `shmocard-design-system` skill before touching any UI code (per `.claude/rules/skill-routing.md`).

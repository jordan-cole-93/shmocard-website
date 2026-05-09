# Phase 4-A — Homepage Mobile Pass

**Scope:** homepage only, viewport 320–600px. The 600–960 tablet band already renders cleanly per audit.

**Audit baseline:** 2026-05-09. Live render at 375×812 caught 4 layout breaks + 8 polish issues + structural drift in the breakpoint set. Reference screenshots not persisted (real-time inspection via preview tools).

**Out of scope here:** other pages (cart, PDP, /shmo-review), accessibility audit, Vercel env / DNS cutover. Those land in the broader Phase 4 launch-readiness directory when it opens.

---

## Wave 1 — Layout breaks (must-fix, atomic commits)

Each task is one commit. Run dev preview at 375 after each, screenshot in `pictures/screenshots/mobile-audit-2026-05-09/`, confirm before moving to the next.

### 1.1 — Hero sub-brand tile wordmark overflow
**File:** `components/home/home.css`
**Symptom:** at 375, tile = 127px wide. `.home-hero__tile-name` set at 22px Cherry Bomb One. `ShmoReputation` clips the right edge.
**Fix:** add `<600` rule on `.home-hero__tile-name`: `font-size: clamp(15px, 4vw, 18px); letter-spacing: -0.01em`.
**Verify:** all four wordmarks fit inside the tile box at 320, 375, 414.

### 1.2 — Shmo Reputation MacBook dashboard simplification
**Files:** `components/home/SubBrandIllustration.tsx`, `components/home/home.css`
**Symptom:** fixed-pixel dashboard interior gets clipped right edge at 375. Sidebar + 4-metric grid + recent activity rows all compete for horizontal space they don't have.
**Fix:** under `<720`, hide the dashboard sidebar (`.reputation-dashboard__sidebar { display: none }`) and the two right-side metric tiles (Avg rating, Reply rate). Keep: header, Total reviews + This week, Review volume bar chart, two recent activity cards. MacBook chassis stays.
**Verify:** dashboard fits inside the chassis with no overflow at 320, 375, 414. No horizontal scroll on `<main>`.

### 1.3 — Shmo Link callout overflow
**Files:** `components/home/SubBrandIllustration.tsx`, `components/home/home.css`
**Symptom:** orange dashed connectors + 4 floating mini-cards (Instagram, video, $-prices, message) absolute-positioned to spread right of the phone. At 375 they crowd into the section edge.
**Fix:** under `<720`, hide all 4 floating callouts and connectors (`.link-illustration__callouts { display: none }` or equivalent). Phone-only at mobile.
**Verify:** Cindy Doe profile phone renders centered with no overflow. The audience understands "link in bio" from the phone alone.

### 1.4 — FAQ headline + mascot collision
**Files:** `components/home/HomeFaq.tsx` (or wherever the section-head + mascot live), `components/home/home.css`
**Symptom:** mascot sticker absolute top-right overlaps the third word of "Quick answers, no fluff" headline.
**Fix:** under `<600`, either (a) reorder grid so mascot drops below the headline + lede, or (b) shrink mascot from `--supporting` (140px) to `--accent` (96px) and pull off the headline so they no longer overlap. Pick (a) — cleaner stack. Confirm via preview before committing.
**Verify:** headline reads in full with no element overlapping it at 320, 375, 414.

---

## Wave 2 — Polish (after Wave 1 lands)

One commit per task or one bundled commit if all changes touch only `home.css` — Jordan's call.

### 2.1 — Hero hand-note stack
At `<520`, drop the · separator and split into two lines: hand-script "Live now — Shmo Review" line one, plain "3 more tools coming this year" line two.

### 2.2 — Hero CTA buttons full-width
At `<520`, both `.shm-btn` in `.home-hero__cta-row` get `width: 100%`. More decisive on mobile.

### 2.3 — CR-80 pill in Shmo Review art
Add `white-space: nowrap` to `.subbrand-art__format-pill` so "CR-80 CARD" stays one line. Let the row wrap below.

### 2.4 — Testimonial quote type ramp
At `<600`, `.proof-card__quote` (or whatever the primitive is) ramps from current size down to ~18px. Less shouty.

### 2.5 — How-it-works step card padding
At `<600`, `.how-step` card padding drops from current generous values to a tighter `24px 20px`. Each card currently ~480px tall — should land closer to ~280px.

### 2.6 — Crew strip 1-column
At `<480`, `.crew-strip` `grid-template-columns: 1fr`. 2-col at 480+ stays.

### 2.7 — Sticky nav scrim
`.shm-nav` background opacity bump (likely from 0.85 → 0.95) plus `backdrop-filter: blur(12px) saturate(1.1)`. Verify against ember and cocoa-deep sections.

### 2.8 — Section padding asymmetry
Trace `.shm-section` mobile padding (currently 64/24 top/bottom). Confirm intentional vs stale override. If stale, rebalance to symmetric `--section-py-d` values.

---

## Wave 3 — Systematize (after Wave 2 lands)

Goal: stop scattering responsive logic across `home.css`. Move to a token-driven, primitive-aware system.

### 3.1 — Define canonical breakpoint tokens
In `colors_and_type.css`:
```css
:root {
  --bp-mobile: 600px;   /* below = single-column / minimal */
  --bp-tablet: 960px;   /* below = compact, simplified */
  --bp-desktop: 1200px; /* above = full layout */
}
```
Document in `PRIMITIVES.md`.

### 3.2 — Refactor `home.css` queries onto the token set
Current query set: 1100, 1000, 880, 720, 600. Collapse to: 960 (tablet), 600 (mobile). Document why each rule fires at its breakpoint.

### 3.3 — Promote primitive-level responsive behavior
Per design rule "page CSS owns LAYOUT only, not appearance":
- `.shm-btn` — full-width variant `--block` for mobile-stack scenarios
- `.shm-card` — type ramp built-in
- `.shm-section` — symmetric mobile padding
Move these out of `home.css` into `components.css` next to the primitive definitions.

### 3.4 — Update SKILL.md + PRIMITIVES.md
Document the breakpoint system and which primitives have built-in responsive variants.

---

## Verification protocol per wave

1. Run dev server (`preview_start`).
2. After each fix: resize to 375, scroll the section, screenshot to `pictures/screenshots/mobile-audit-2026-05-09/<NN>-<slug>.png`.
3. Verify at 320, 375, 414, 768. No horizontal overflow at any width.
4. Commit with `mobile(home): <subject>` prefix. No `--no-verify`.
5. Post-Wave 1: stop and have Jordan eyeball before Wave 2.

## Out-of-scope notes (do NOT touch this phase)

- Layout structure (grid columns, element ordering, tile size ratios) — LAYOUT IS LOCKED on polish.
- Section background rotation — already correct.
- Wave-divider placement — already canonical (sibling of section).
- Copy / headline text — separate decision.

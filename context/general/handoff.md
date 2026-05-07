# handoff.md — Session Handoff

**Last session:** 2026-05-07 — Polished the homepage 4-up sub-brand tile block (Hero `home-hero__toolkit`). Five atomic commits landed: tile name alignment, mascot↔title breathing room, deterministic art sizing, Review-tile mascot swap, and a 140 px sticker bump. No new phase work.

---

## Project phase

Phase 3 (Rebuild) reads as **complete** in the SDK init (12/12 plans). STATE.md last-activity is stale (predates 03-07/08/09/10 commits) but `gsd-sdk query init.progress` confirms `completed_count: 3`, `next_phase: launch-readiness`.

Today's session was **polish only** on the Hero block. No formal Phase 4 directory exists. ROADMAP still calls Phase 4 "launch-readiness." Earlier-in-day memory notes a user reframe to "visual-redesign" but that work was rolled back to commit `b33a0aa` before this session opened, so the reframe is not yet reflected in `.planning/`.

Open routing question carried over from the start of this session (user said "I'm gonna load my own skills, do nothing" then went directly to the polish task without resolving):

- A) keep doing freeform polish on the homepage
- B) formalize Phase 4 = visual-redesign in ROADMAP and run `/gsd-plan-phase 4`
- C) skip polish, move to launch-readiness (mobile / a11y / Vercel env)

---

## What was done this session

- **Critique pass on `home-hero__toolkit`** (impeccable critique). Compared live `components/home/home.css` against canonical `.claude/skills/shmocard-design-system/ui_kits/website/homepage/home.css`. Identified four canonical-rule deltas + several composition issues (titles not aligned, mascot collisions with badge, sub-text length variance, art mismatch).
- **Title baseline alignment fix** (commit `f4db003`). Added `tileSub` field on `SubBrand` in `components/home/home-data.ts` with tuned ~60-char copy per sub-brand. Updated `components/home/Hero.tsx` to render `sb.tileSub` instead of slicing `lede`. Locked `.home-hero__tile-sub` to `min-height: 2lh` + `line-clamp: 2` so all sub blocks render uniform 38 px tall. Names now share name_top = 209 px (was 169 / 188 / 208 / 188).
- **Mascot ↔ title gap** (commit `a9a8ee4`). Reserved bottom 36 % of tile for text via `inset` on `.home-hero__tile-art`. Removed the canonical `translateY(-12 %)` hack since the inset already pinned art to the upper region. Gaps moved from -12…+8 px to 33-48 px.
- **Deterministic art sizing** (commit `93c7a55`). Discovered `max-height: 100%` was not binding inside the grid art container — image was respecting only `max-width`, so tall mascots ballooned to natural-aspect height and crashed into the corner badge. Switched art container to `top: 56px; height: 120px` (fixed pixels) and clamped image to `max-height: 110px`. Predictable across all four tiles regardless of natural aspect.
- **Review tile asset swap** (commit `68cd229`). Replaced the CR-80 product photo (`/products/cr80/transparent/magnific_2884306972.png`) with `/mascot/mascot-tap-moment.png` so all four tiles share one mascot sticker treatment. Asset already existed in `public/mascot/`, no copy step needed. Tile 1 no longer reads as a different visual category.
- **Mascot scale bump** (commit `b31d803`). Jordan flagged the 110 px sticker as "way too small." Pushed art container to `height: 150px` starting `top: 50px`, image `max-height: 140px` (design-system sticker cap), `max-width: 86%` (megaphone modifier `100%`). All four mascots now uniform 140 px tall, widths varying 149-183 px by natural aspect. `gap_badge_to_img = 5 px`, `gap_img_to_name = 14 px`.
- **No structural changes.** Polish only — grid columns, tile ordering, aspect-ratio, and HTML structure all locked per `feedback_layout_is_locked`.

### Files modified

- `components/home/home.css` — `.home-hero__tile-art` + `.home-hero__tile-art img` rules, `.home-hero__tile-art--megaphone img` modifier, `.home-hero__tile-sub` line-clamp + min-height
- `components/home/home-data.ts` — added `tileSub` field on `SubBrand`, populated for all 4 entries
- `components/home/Hero.tsx` — uses `sb.tileSub`; `TILE_ART.review.src` → `/mascot/mascot-tap-moment.png`

### Decisions left explicitly deferred

- Tile envelope direction — keep floating with more `gap`, or add hairline border? (P2 from critique, not picked up)
- Em-accent on tile name (`.hero-toolkit__name em { color: ember }` from canonical — not implemented; needs which words to emphasize)
- CR-80 transparent PNG asset content offset — moot now that Review uses the mascot art
- "Soon" badge for Shmo Link sits next to the heart-hands hearts. Visible touch but not strictly an overlap. Untouched this session.

---

## What's next

**Decision needed first** (open routing question above). Then one of:

1. **If staying in polish mode (A):** continue page-by-page on the homepage. Next obvious targets per memory `S86`: hero CTAs / meta strip spacing, Proof section primitives, SubBrand spotlights (memory `296` flagged spotlight mascot sizing as design-system non-compliant). When dispatching a subagent, hand-author layout-lock + design-system guardrails into the Agent prompt directly (read `.claude/rules/design-system.md` first).
2. **If formalizing Phase 4 (B):** run `/gsd-phase` to rename Phase 4 in `ROADMAP.md` from "launch-readiness" → "visual-redesign" and push launch-readiness to Phase 5. Then `/gsd-plan-phase 4` to write a clean polish plan. STATE.md will need a `last_updated` refresh either way.
3. **If skipping to launch-readiness (C):** start the Phase 4 directory with `/gsd-plan-phase 4` against the existing ROADMAP entry. Mobile pass / a11y / Vercel env / DNS — but only AFTER Jordan signs off on the current visual state.

Independent of the routing call: STATE.md `last_activity` and `progress` block are stale relative to git. Should refresh once the next phase begins.

---

## Open decisions

- **Routing question** — A vs B vs C above.
- **Tile envelope** — bordered vs floating? (Affects all 4-up grids on the site, not just hero.)
- **Em-accent on tile names** — does Jordan want any tile name to use the canonical ember `em` color? If so, which word per tile?
- **Heart-hands badge nudge** — "Soon" badge on Shmo Link still touches the heart props on the mascot. Acceptable or move badge / shrink that mascot specifically?
- **Phase 4 reframe** — memory observations 287-294 + S80 reflect a user reframe to visual-redesign that never made it into ROADMAP.md or `.planning/phases/`. Confirm the reframe is still wanted before formalizing.

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Ask Jordan: **"Polish more sections (A), formalize Phase 4 = visual-redesign in ROADMAP (B), or move on to launch-readiness (C)?"**
4. Whichever path: BEFORE dispatching any subagent, hand-author the relevant guardrails (layout-lock + design-system + live-store-protection where applicable) into the Agent prompt directly. Subagents structurally cannot access the Skill tool, so guardrails must travel as text inside the prompt. For Shopify backend dispatch, `shmocard-shopify-work` is still available as a project-local wrapper skill that returns a verbatim guardrail block. UI dispatch has no wrapper — read `.claude/rules/design-system.md` first and inline its hard rules. Skipping guardrails is what produced the rolled-back 04-01 commits earlier today.
5. Run `/gsd-progress` to see the up-to-date roadmap state before committing to a path.

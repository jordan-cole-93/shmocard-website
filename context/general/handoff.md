# handoff.md — Session Handoff

**Last session:** 2026-05-20 — Phase 4 (Link hygiene & Coming Soon stubs) shipped end-to-end. Built shared `<ComingSoon>` component + 5 stub routes (Shmo Biz / Link / Reputation, L-Sign, Square Card) + upgraded 11 hrefs across NavMenu / Footer / FormatPicker. Also reconciled planning docs (ROADMAP restructured 7 → 10 phases, scope.md + handoff.md aligned, Phase 3 closed out with SUMMARY.md). Five atomic commits this session — `7ccca06`, `db1b14e`, `d4fba9f`, `d75aab4`, `ecb2e08`, plus phase close-out commit.

---

## Project phase

**Phase 4 — Link hygiene & Coming Soon stubs ✅ complete 2026-05-20.** Shared `<ComingSoon>` server component shipped + 5 stub routes mounted + 11 hrefs upgraded across nav/footer/format-picker. tsc + build clean. See `.planning/phases/04-link-hygiene-coming-soon-stubs/04-SUMMARY.md`.

**Next phase: Phase 5 — L-Sign PDP.** Build `/shmo-review/l-sign` product detail page using the CR-80 PDP pattern from Phase 3. Replaces the Phase 4 Coming Soon stub at that route. Run `/gsd-plan-phase 5` to kick off.

**Project progress:** 5 of 10 phases complete (50%). Phases 1, 2, 3a, 3, 4 done. Remaining: 5 (L-Sign PDP), 6 (Square Card PDP), 7 (Cross-PDP mobile polish), 8 (Shopify Storefront wiring), 9 (Tracking — GHL + FB Pixel), 10 (Launch readiness — DNS cutover).

---

## What was done this session

**Phase 4 execution + planning hygiene:**

- **Closed Phase 3 (CR-80 PDP).** Wrote `03-cr-80-pdp/SUMMARY.md`, flipped ROADMAP checkbox to `[x]`.
- **Restructured ROADMAP from 7 → 10 phases.** Inserted Phase 4 (Link hygiene & Coming Soon), Phase 7 (Cross-PDP mobile polish), Phase 9 (Tracking) — covers Jordan's launch-readiness items that were missing from the old roadmap.
- **Reconciled `scope.md` + `handoff.md`** against new ROADMAP and current per-product PDP architecture. Removed stale "PDPs abandoned" line; documented all 10 phases.
- **Generated config.json** via `gsd-health --repair` (was missing, single blocker on health check).
- **Phase 4 RESEARCH.md + PLAN.md + VALIDATION.md** generated via gsd-phase-researcher → gsd-planner → gsd-plan-checker pipeline. Plan-checker found 2 blockers + 3 warnings, all surgically addressed before execution.
- **Built `<ComingSoon>` server component** at `components/ComingSoon.tsx` — Section + section-head + eyebrow + h1 + lede + disabled email-capture form + 140 px mascot sticker. Inline polish during 04-02 review: mascot reordered between section-head and field, form-card constrained ~520 px centered on desktop. One bug fix: `.shm-mascot--supporting` was missing the base `.shm-mascot` class, builder follow-up dispatch added it.
- **Shipped 5 Coming Soon stub routes** — `/shmo-biz` (holding-card), `/shmo-link` (heart-hands), `/shmo-reputation` (megaphone), `/shmo-review/l-sign` (pointing), `/shmo-review/square-card` (thumbs-up). Each ~12 lines, composes `<ComingSoon>` with sub-brand props.
- **Upgraded 11 hrefs across NavMenu / Footer / FormatPicker.** 10 planned + 1 follow-up (Footer "CR-80 Card" → `/shmo-review/cr-80` PDP). NavMenu and Footer internal-route links upgraded from bare `<a>` to Next.js `<Link>`.
- **Build verification.** `npx tsc --noEmit` clean, `npm run build` clean. All 12 routes statically generated, 5 Coming Soon routes at 138 B each.

**Earlier this session (pre-Phase 4):**

- **Section-head removed above CR-80 gallery.** Deleted the `<div className="shm-section-head shm-section-head--start">` block (eyebrow + h2) in `components/shmo-review/Buybox.tsx` — gallery now starts the section directly.

- **Buybox top spacing tightened.** Reduced `.review-buybox.shm-section` `padding-top` from `90px` → `var(--section-py-d)` (40 px), removed orphan `.pdp-buybox` `margin-top: 40px`, deleted dead `.shm-section-head--start` rule. Nav-to-gallery gap dropped from 130 px → 40 px.

- **Free-shipping callout + Configure (Google input) blocks removed** from the Buybox column. Deleted both JSX blocks plus `gInput`/`setGInput` state and stale primitive references in the file-header comment.

- **HowItWorks restructured.** Replaced single sticky-stack section with **4 separate full-width sections** alternating cream → marsh → cream → marsh, divided by wave dividers. Removed all framer-motion (`motion.article`, `useScroll`, `useTransform`, `--stack-offset`), removed `.shm-card`/`.shm-card--cream`/`.shm-card--hard` from step containers, preserved `is-reverse` alternation + phone visuals. Also flipped `CrewStrip nextBg` from `"marsh"` → `"cream"` in `page.tsx` so the entry wave matches.

- **Neo-brutalist border applied then reverted on HowItWorks.** Added `.shm-card--hard` to step cards as an intermediate state; removed when Jordan changed direction toward the 4-section layout. Net state: no `.shm-card--hard` on HowItWorks.

- **Pack-row selector mobile polish — 5 iterations to landing.** Sequence:
  1. Moved SAVE % badge OUT of `.shm-pack-row__name` (where it wrapped under "10 Cards" at mobile) INTO `.shm-pack-row__price`.
  2. Hid `.shm-pack-row__note` + `.shm-pack-row__price .shm-badge` at `@media (max-width: 640px)` to equalize heights at 88 px — Jordan flagged that hiding the badge killed the highest-CRO signal.
  3. Reverted the badge hide; SAVE visible again on mobile, rows became unequal (88 / 88 / 112 / 112).
  4. Locked all rows to **uniform 116 px** on mobile via `min-height` bump.
  5. Moved the SAVE badge JSX from `.shm-pack-row__price` to `.shm-pack-row__main` so it sits **directly under** the pack name text — added a small `.shm-pack-row__main .shm-badge { align-self: flex-start; margin-top: 2px; }` helper so the badge stays pill-sized.
  6. Tightened to **96 px uniform** by dropping the mobile `min-height` from 116 → 96 and adding `padding-top: 12px; padding-bottom: 12px` to the row override.

  **Final state at 390 px mobile:** 4 rows × 96 px each, SAVE badge under pack name (rows 2 + 3), shipping note hidden, "Most popular" overlay pill on row 4 still anchored.

- **Dev infrastructure.** Killed orphan Next.js server on port 3001 (PID 81321) from a prior Claude Desktop session. Restarted preview MCP server mid-session to clear a Claude Desktop preview-pane glitch (Jordan couldn't see mobile view — server was healthy, restart was client-side workaround).

- **Paid-traffic CRO research plan.** Dispatched `researcher` agent. Delivered `context/brainstorming/cr-80-buybox-cro-plan.md` (188 lines, sources cited). Top 3 HIGH-priority: message-match H1, CTA above checklist, sticky mobile bottom CTA bar.

- **Competitor selector teardown.** Jordan shared a French competitor's pack-selector screenshot. Wrote `context/brainstorming/cr-80-competitor-selector-teardown.md` — element-by-element analysis + 9 recommendations grouped Wave 1 / Wave 2 / Wave 3. Top 5: drop to 3 tiers, restore mobile SAVE %, bonus gifts on higher tiers, inflate compare-price MSRP, "Most popular" as corner ribbon.

### Files modified this session

- `components/shmo-review/Buybox.tsx`
- `components/shmo-review/HowItWorks.tsx`
- `app/shmo-review/shmo-review.css`
- `app/shmo-review/cr-80/page.tsx`
- `context/general/handoff.md` (this file)

### Files created this session

- `context/brainstorming/cr-80-buybox-cro-plan.md`
- `context/brainstorming/cr-80-competitor-selector-teardown.md`
- Screenshots in `pictures/screenshots/`:
  - `buybox-blocks-removed.png`
  - `how-it-works-new-sections.png` · `how-it-works-all-steps.png` · `how-it-works-mobile.png`
  - `pack-rows-mobile-390.png` · `pack-rows-desktop-1280.png` · `pack-rows-mobile-390-uniform-height.png` · `pack-rows-mobile-390-tightened.png`
  - `pack-rows-save-badge-mobile-390-final.png` · `pack-rows-save-badge-desktop-1280-final.png`
  - `save-badge-restored-mobile-390.png` · `save-badge-desktop-1280-no-regression.png`

### Commits landed this session

1. `7ccca06` — `docs(planning): close Phase 3, restructure ROADMAP to 10 phases, plan Phase 4`
2. `db1b14e` — `feat(coming-soon): add ComingSoon component + /shmo-biz stub (04-01)`
3. `d4fba9f` — `feat(coming-soon): stub 4 remaining sub-brand routes (04-03)`
4. `d75aab4` — `fix(links): upgrade anchor stubs to real Coming Soon routes (04-04)`
5. `ecb2e08` — `fix(links): point Footer CR-80 Card to /shmo-review/cr-80 PDP`
6. Phase 4 close-out commit (this commit) — `chore(phase-4): close out link hygiene + Coming Soon phase`

---

## What's next

**Phase 4 — Link hygiene & Coming Soon stubs** is up next per the new 10-phase ROADMAP.

Concrete next actions in order:

1. **Run `/gsd-plan-phase 4`.** Breaks Phase 4 into atomic plans: `<ComingSoon>` component, 5 route stubs, link audit across `/`, `/shmo-review`, `/shmo-review/cr-80`.

2. **Resolve open decisions (CR-80 carry-overs)** in parallel with Phase 4 — they unblock CRO wave choices and inform Phase 8 (Shopify wiring):
   - Drop 1-card SKU on CR-80 PDP?
   - Inflate compare-price MSRP for stronger anchoring?
   - Bonus gifts available for 5-pack / 10-pack tiers?

3. **CRO wave choice — defer until L-Sign + Square ship.** The two research deliverables remain on tap:
   - `context/brainstorming/cr-80-buybox-cro-plan.md` (paid-traffic CRO — message-match H1, CTA above checklist, sticky mobile bottom CTA bar)
   - `context/brainstorming/cr-80-competitor-selector-teardown.md` (louder selected state, "Most popular" corner ribbon)
   Best to run CRO experiments after Phase 7 (cross-PDP mobile polish) so changes apply across all 3 PDPs in one pass.

4. **Phase 5 + 6** — L-Sign and Square Card PDPs. Pattern locked from CR-80; should be faster.

5. **Phase 8 — Shopify wiring.** Invoke `shmocard-shopify-work` skill before dispatching the build. Replaces all `TODO(shopify):` placeholders + wires cart + checkout redirect + webhook revalidation route.

6. **Phase 9 — Tracking.** GHL webhook + Facebook Pixel + Conversions API. Must come after Phase 8 because pixel events fire on cart/checkout actions that don't exist until wiring is live.

7. **Phase 10 — Launch readiness.** DNS cutover — last phase.

---

## Open decisions

- ✅ **`scope.md` reconciled 2026-05-20.** Now matches the per-product PDP architecture + new 10-phase ROADMAP.
- **Drop the 1-card SKU on the CR-80 PDP?** Competitor sells 1 / 2 / 5 tiers; we have 1 / 2 / 5 / 10. Cutting 1-card lifts AOV floor for ad traffic.
- **Inflate compare-price MSRP for stronger anchoring?** Current 27 % off vs competitor's 60 % off. DTC standard tactic.
- **Bonus gifts available?** 5-pack "+ Setup Guide", 10-pack "+ Setup Guide + spare card". Need confirmation what exists or can be authored.
- **L-Sign + Square Card PDP scope** — same buybox composition or different per format?
- **GHL webhook URL for waitlist forms** — still deferred until mid-Phase 3.
- **Avatar photo compression** (carried) — John 2.9 MB, Cindy 9.4 MB uncompressed.
- **Joey video status** (carried) — still pending.

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Read both research deliverables:
   - `context/brainstorming/cr-80-buybox-cro-plan.md`
   - `context/brainstorming/cr-80-competitor-selector-teardown.md`
4. **Before any UI work:** invoke the `shmocard-design-system` Skill per `.claude/rules/skill-routing.md`. Then read `.claude/rules/design-system.md`.
5. **Don't write UI code in the parent agent.** Dispatch the `design-system-builder` subagent for any `.tsx` / `.css` change (per `.claude/rules/subagent-dispatch.md`). Only carve-out: pure copy/text edits with zero class/styling changes.
6. Ask Jordan: **"Ready to kick off Phase 5 (L-Sign PDP) with `/gsd-plan-phase 5`, or want to resolve CR-80 open decisions (drop 1-card SKU / inflate MSRP / bonus gifts) before building more PDPs?"**
7. The dev server may be down at session start — check with `lsof -iTCP:3000` and `preview_list`. If nothing's running, `preview_start name=next-dev`.

# handoff.md — Session Handoff

**Last session:** 2026-05-20 — Heavy CR-80 PDP polish: buybox cleanup, HowItWorks restructured from sticky-stack to 4 alternating sections, pack-row mobile selector iterated through 5+ builder dispatches to final layout (SAVE badge under pack name, 96 px uniform rows), and 2 CRO research deliverables shipped to inform next-wave changes.

---

## Project phase

**Phase 3 — Rebuild**, mid-iteration on the CR-80 PDP. Homepage + cart smoke-test + base layout are done. CR-80 page mounted with all sections (Buybox → Proof → CrewStrip + ProofTiles → HowItWorks → VideoTestimonials → FinalCta). Currently in polish-and-CRO mode before paid ads start running.

**Sync issue:** `scope.md` still describes the deleted single-page-anchors architecture. The repo reversed to per-product PDP routes May 17 (memory 1097). Reconcile before next major dispatch.

---

## What was done this session

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

None. All work uncommitted.

---

## What's next

**Phase 3 — Rebuild** continues per scope.md.

Concrete next actions in order:

1. **Reconcile `scope.md` + `handoff.md` against current architecture.** Both still describe the deleted single-page-anchors approach; actual state is per-product PDPs at `/shmo-review/cr-80` (with L-Sign + Square Card pending).

2. **Pick a wave from the two CRO source docs.** Both files exist:
   - `context/brainstorming/cr-80-buybox-cro-plan.md` (paid-traffic CRO)
   - `context/brainstorming/cr-80-competitor-selector-teardown.md` (competitor-specific selector changes)

   The pack-row selector is already mostly aligned to Wave 1 of the competitor teardown after the badge reposition. Remaining low-risk Wave 1 items: louder selected state (ember bg fill + 3 px border), "Most popular" as corner ribbon (not floating overlay).

   The above-the-fold CRO plan changes are higher-leverage: message-match H1, reorder so CTA sits above the checklist, sticky mobile bottom CTA bar.

3. **Resolve open decisions** (see below) so Wave 2 can run.

4. **Build remaining PDPs** — L-Sign (`/shmo-review/l-sign`) and Square Card (`/shmo-review/square-card`). Both still missing.

5. **Wire Shopify Storefront API** for product fetching on the three `/shmo-review` PDPs. Today the Buybox component has hardcoded PLACEHOLDER product data with `TODO(shopify):` markers — invoke `shmocard-shopify-work` skill before dispatching the build.

---

## Open decisions

- **`scope.md` + previous `handoff.md` (replaced by this file) describe the wrong architecture.** Update scope.md when next phase touches it.
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
6. Ask Jordan: **"Want to keep iterating the selector (louder selected state + corner ribbon), tackle the bigger CRO levers (message-match H1, CTA above checklist, sticky mobile bar), or reconcile `scope.md` first?"**
7. The dev server may be down at session start — check with `lsof -iTCP:3000` and `preview_list`. If nothing's running, `preview_start name=next-dev`.

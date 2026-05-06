# Phase 2: Design System Review — Plan

**Created:** 2026-05-07
**Status:** Ready for execution
**Source:** Direct authoring (gsd-sdk + global gsd-planner subagent unavailable in this repo as of 2026-05-07; plan derived from `CONTEXT.md` + ROADMAP.md Phase 2 stubs)

## Goal

Audit the design system at `context/design system/`, surface structural / naming / consistency issues, decide integration strategy with Next.js + Tailwind 4, resolve open questions with Jordan, and lock the canonical files Phase 3 will consume. **No code changes in this phase** — output is decision artifacts only.

## Success criteria

1. Every file in `context/design system/` accounted for in the audit doc.
2. Folder/naming/structural issues surfaced with concrete recommendations.
3. Tailwind 4 ↔ `.shm-*` coexistence locked (token import path decided).
4. Two `CLAUDE.md` files reconciled — cross-references added, no conflicting rules.
5. Reference page translation strategy locked (Babel JSX → Next.js `.tsx`).
6. Open questions answered by Jordan and recorded.
7. Locked decision artifacts written and referenced from `CLAUDE.md` pointer table.

## Plans

### 02-01: Folder audit (read every file)

**Goal:** Comprehensive inventory of `context/design system/`. Every file read, every concern flagged.

**Tasks:**
1. Read top-level docs: `CLAUDE.md`, `SKILL.md`, `README.md`, `PRIMITIVES.md`.
2. Read full CSS source: `colors_and_type.css` (375 lines), `components.css` (1875 lines).
3. Read reference pages: `Shmocard Homepage.html`, `Buybox.html`, `Cart Drawer.html`, `homepage/home.css`, `homepage/home-bundle.jsx`, `homepage/home-app.jsx`, `homepage/home-parts.jsx`, `homepage/home-modals.jsx`, `homepage/home-data.jsx`.
4. Sample 5 representative preview files from `preview/`.
5. Confirm font inventory: Bricolage Grotesque variants + Cherry Bomb One only.
6. Note state files: `.design-canvas.state.json`, `.image-slots.state.json` (ignore in audit; runtime artifacts).

**Deliverable:** `.planning/phases/02-design-system-review/AUDIT.md` — file-by-file inventory + flags.

**Verification:** Audit covers every non-DS_Store / non-state-json file. Jordan reads.

---

### 02-02: Structural diagnosis + proposed moves

**Goal:** Translate audit findings into concrete structural recommendations.

**Tasks:**
1. **Folder location:** propose final location for the design system folder. Options:
   - Keep at `context/design system/` (rename to kebab → `context/design-system/`)
   - Move to repo root → `design-system/`
   - Move to `app/(design-system)/` (Next.js route group)
   - Recommendation + tradeoffs.
2. **`ui_kits/website/` cleanup:** loose HTML at root (`Buybox.html`, `Cart Drawer.html` with space) vs nested `homepage/` subfolder. Propose: nest each reference page in its own subfolder (`buybox/`, `cart-drawer/`, `homepage/`) for consistency.
3. **`home-*.jsx` fragmentation:** 5 files. Propose: keep as-is in the design system as a Babel-loaded reference, but document the Phase 3 translation approach (each becomes a real `components/home/<piece>.tsx`).
4. **`SKILL.md` registration decision:** strip the skill frontmatter (it's a doc, not a registered skill) OR register as a project-local skill at `.claude/skills/shmocard-design/`. Recommend with rationale.
5. **State JSON files:** add to `.gitignore` once git is initialized.

**Deliverable:** Append `## Proposed Moves` section to `AUDIT.md` with concrete rename / relocate / consolidate operations.

**Verification:** Jordan reviews, approves or revises.

---

### 02-03: Reconcile root CLAUDE.md with design-system CLAUDE.md

**Goal:** Two `CLAUDE.md` files coexist without conflict. Each references the other.

**Tasks:**
1. Add a section to root `CLAUDE.md` linking to `context/design system/CLAUDE.md` as the design-system-scoped ruleset (when working in that subtree).
2. Add a section to `context/design system/CLAUDE.md` linking back to root `CLAUDE.md` for repo-level rules (file organization, live-store protection, Shopify data discipline).
3. Cross-check for rule conflicts. Resolve any in favor of:
   - **Design-system rules win** for visual / typography / mascot / section-rotation / icon stroke / utility-class-prefix.
   - **Repo rules win** for file organization, Shopify data discipline, live-store protection, vault conventions.
4. If a conflict can't be resolved, surface to Jordan.

**Deliverable:** Two updated `CLAUDE.md` files with cross-references and zero conflicts.

**Verification:** Run `grep` for conflicting rules across both files. Read each end-to-end. Jordan signs off.

---

### 02-04: Tailwind 4 ↔ `.shm-*` coexistence decision

**Goal:** Lock how the design system's CSS coexists with Tailwind 4 inside `app/globals.css`.

**Tasks:**
1. Read Tailwind 4's `@theme` documentation (via context7 MCP).
2. Read `colors_and_type.css` to understand existing token shape.
3. Decide approach. Two real options:
   - **A: Direct CSS import.** `app/globals.css` does `@import "tailwindcss"; @import "../context/design system/colors_and_type.css"; @import "../context/design system/components.css";`. CSS stays the source of truth. Tailwind 4 utilities used only for layout (grid, flex, padding, gap) — never for color, type, radius, shadow.
   - **B: Transcribe tokens into Tailwind 4 `@theme`.** All design tokens become Tailwind 4 theme variables. Risk: drift between source CSS and Tailwind config; double-source-of-truth violates the design system's "CSS wins" rule.
4. Recommend Option A (preserves CSS-as-source-of-truth invariant) with explicit rules: never use Tailwind utilities for design-token concerns; use `.shm-*` classes only.
5. Document the decision in a new `INTEGRATION.md` inside the phase dir.

**Deliverable:** `.planning/phases/02-design-system-review/INTEGRATION.md` with the locked decision + concrete `app/globals.css` skeleton ready for Phase 3.

**Verification:** Jordan agrees with choice. The skeleton compiles in a minimal mental walkthrough (no actual code written this phase).

---

### 02-05: Reference-page translation plan

**Goal:** Lock how the three reference pages (`Shmocard Homepage.html`, `Buybox.html`, `Cart Drawer.html`) become real Next.js components in Phase 3.

**Tasks:**
1. For each reference page, identify:
   - Section breakdown (matches `home.css` header guide)
   - State management surface (modals, qty, variant selection, cart)
   - Image slot inventory (mascot moments, product photography placeholders)
   - Animation / interaction surface (sticky buybox slide-down, cart drawer slide-in, hero type-cycle)
2. Map each section to a target `components/<area>/<piece>.tsx` filename.
3. Decide state management approach (React state, Zustand, Server Components only?). Stay minimal — homepage is largely static, cart needs persistence.
4. Decide animation approach (CSS transitions only? Re-add `framer-motion`? View Transitions?). Default to CSS transitions; revisit if a section demands more.
5. Mascot rendering: how `--mascot-fit-ratio` overrides translate to React props.

**Deliverable:** `.planning/phases/02-design-system-review/TRANSLATION.md` — section-by-section translation map for each reference page.

**Verification:** Translation map covers every section in the source HTML files (cross-check section count). Jordan reads, agrees.

---

### 02-06: Open question resolution

**Goal:** Get Jordan to answer the open questions surfaced in `CONTEXT.md` and STATE.md.

**Questions to resolve:**
1. Folder rename — keep `context/design system/` (with space) or rename to kebab?
2. Folder location — stay under `context/`, move to repo root, or move to `app/`?
3. `SKILL.md` — strip frontmatter or register as project-local skill?
4. Motion library — CSS only, re-add `framer-motion`, or use View Transitions?
5. GHL webhook URL for waitlist (Phase 3 dependency, but worth surfacing now).

**Tasks:**
1. Present each question with recommendation + tradeoff.
2. Capture answers in `.planning/phases/02-design-system-review/DECISIONS.md`.
3. Update PROJECT.md Key Decisions table with each answer.

**Deliverable:** `.planning/phases/02-design-system-review/DECISIONS.md` — Q+A log.

**Verification:** Every question has an answer. Each answer has rationale. PROJECT.md updated.

---

### 02-07: Lock canonical files

**Goal:** The design system folder is "official" and Phase 3 has clear pointers.

**Tasks:**
1. Update root `CLAUDE.md` "Where to find things" table:
   - Replace "Design system: _Pending — folder not yet dropped..._" with concrete paths to `context/design system/CLAUDE.md`, `SKILL.md`, `PRIMITIVES.md`, `colors_and_type.css`, `components.css`.
   - Reference the AUDIT.md, INTEGRATION.md, TRANSLATION.md, DECISIONS.md from this phase.
2. Update `context/general/scope.md`:
   - Mark Phase 2 plans as `[x]`.
   - Update status line to "Phase 2 complete, ready for Phase 3".
3. Update `context/general/handoff.md`:
   - Date stamp the Phase 2 completion.
   - Summarize what changed.
4. Decide on `DESIGN.md` / `PATTERNS.md` at repo root:
   - **Recommendation:** do NOT create root-level `DESIGN.md` / `PATTERNS.md`. The design system folder already provides `CLAUDE.md` + `SKILL.md` + `README.md` + `PRIMITIVES.md` which are equivalent. Adding root-level duplicates creates drift.
   - If Jordan disagrees, write minimal pointer files at root that say "see `context/design system/CLAUDE.md`".

**Deliverable:** Updated CLAUDE.md, scope.md, handoff.md. Phase 2 complete.

**Verification:** Run the same drift-check grep from Phase 1 verification. All references resolve. Jordan signs off.

## Plan dependencies

- 02-01 → 02-02 (audit must run before recommendations)
- 02-02 → 02-03 (recommendations inform what gets reconciled)
- 02-04 → 02-05 (token strategy informs translation)
- 02-01..05 → 02-06 (questions emerge during audit/translation)
- 02-06 → 02-07 (decisions must be locked before final updates)

Plans 02-01, 02-04, 02-05 can run in parallel after 02-01 finishes (they read from the audit independently). Plans 02-02, 02-03 are sequential after 02-01.

## Out of scope

- Writing any production component, page, or route (Phase 3).
- Modifying the design system's visual rules (Jordan owns those).
- Wiring Shopify Storefront API (Phase 3).
- Mobile / a11y passes (Phase 4).
- Initializing git (parallel concern, surfaced separately).

## Risks

- **Folder rename ripple effect.** If we rename `context/design system/` → `context/design-system/`, every internal CSS path / HTML reference inside the design system itself needs updating (relative `fonts/...` paths, `<link rel="stylesheet" href="...">`, etc.). Mitigation: confirm all internal refs are relative-to-folder-root before renaming; do rename + ref update in a single atomic step.
- **Two-CLAUDE.md drift.** Adding cross-references between root and design-system CLAUDE.md introduces a new place where rules can drift apart. Mitigation: explicit "rules win" hierarchy in 02-03; periodic re-audit.
- **Tailwind 4 import quirks.** Tailwind 4's CSS-first config + `@theme` can collide with `@import` order. Mitigation: research before committing in 02-04; provide a small test fixture if uncertain.
- **Reference page translation underestimate.** The Babel-loaded JSX bundles may have non-trivial state logic that doesn't surface in a glance read. Mitigation: 02-05 reads every `home-*.jsx` end-to-end.

## Estimated effort

- 02-01: ~30 min (lots of files but mostly skim)
- 02-02: ~20 min
- 02-03: ~15 min
- 02-04: ~30 min (research + decision)
- 02-05: ~45 min (most demanding)
- 02-06: ~15 min (sync with Jordan)
- 02-07: ~15 min

Total: ~3 hours of focused work.

## Notes

- Phase 2 is **decisions, not code**. If a task here ends with a code change, it's drifted into Phase 3.
- All artifacts under `.planning/phases/02-design-system-review/` are designed to be re-read by Phase 3 plans without further translation.
- If Jordan tweaks the design system folder mid-phase, re-run 02-01 (audit) — downstream plans should still apply since they reference principles, not specific files.

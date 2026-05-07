---
phase: 260507-dyh
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - context/design-system/  # entire tree (git mv)
  - .claude/skills/shmocard-design-system/SKILL.md
  - .claude/rules/file-organization.md
  - .claude/rules/design-system.md
  - .claude/rules/skill-routing.md
  - .claude/rules/subagent-dispatch.md
  - .claude/skills/shopify-data-discipline/SKILL.md
  - app/globals.css
  - components/home/home.css
  - components/Nav.module.css
  - components/Footer.module.css
  - components/cart/cart-drawer.css
  - components/pdp/pdp.css
  - components/layout/Section.tsx
  - components/layout/Container.tsx
  - next.config.ts
  - tsconfig.json
  - CLAUDE.md
  - context/general/scope.md
  - handoff.md
  - .planning/PROJECT.md
  - .planning/REQUIREMENTS.md
  - .planning/ROADMAP.md
  - .planning/STATE.md
  - .planning/phases/02-design-system-review/*.md
  - .planning/phases/03-rebuild/*.md
autonomous: true
requirements: []
must_haves:
  truths:
    - "context/design-system/ no longer exists"
    - ".claude/skills/shmocard-design-system/ exists with full bundle (SKILL.md, README.md, PRIMITIVES.md, CLAUDE.md, colors_and_type.css, components.css, fonts/, preview/, ui_kits/, .design-canvas.state.json)"
    - "New SKILL.md starts with YAML frontmatter (name: Shmocard)"
    - "Zero references to 'context/design-system' anywhere in the repo outside .planning/quick/ history"
    - "git history for moved files preserved (git log --follow returns commits prior to move)"
    - "app/globals.css imports resolve to new location"
    - ".claude/rules/file-organization.md no longer lists context/design-system/ under context/ table; documents the new .claude/skills/shmocard-design-system/ location"
  artifacts:
    - path: ".claude/skills/shmocard-design-system/SKILL.md"
      provides: "Skill manifest with YAML frontmatter (name: Shmocard, description: ...)"
      contains: "name: Shmocard"
    - path: ".claude/skills/shmocard-design-system/colors_and_type.css"
      provides: "design tokens"
    - path: ".claude/skills/shmocard-design-system/components.css"
      provides: "primitives"
    - path: ".claude/skills/shmocard-design-system/fonts/"
      provides: "bundled font files"
    - path: ".claude/skills/shmocard-design-system/ui_kits/website/homepage/Shmocard Homepage.html"
      provides: "canonical homepage reference"
    - path: ".claude/rules/file-organization.md"
      provides: "updated repo layout rule reflecting new design-system location"
  key_links:
    - from: "app/globals.css"
      to: ".claude/skills/shmocard-design-system/colors_and_type.css"
      via: "@import"
      pattern: '@import "\.\./\.claude/skills/shmocard-design-system/colors_and_type\.css"'
    - from: "app/globals.css"
      to: ".claude/skills/shmocard-design-system/components.css"
      via: "@import"
      pattern: '@import "\.\./\.claude/skills/shmocard-design-system/components\.css"'
---

<objective>
Relocate the Shmocard design system from `context/design-system/` to `.claude/skills/shmocard-design-system/` so Claude Code auto-discovers it as a registered skill, replace the stripped SKILL.md with the frontmatter-bearing version from `/Users/jordancole/Downloads/Design System/SKILL.md`, and update every path reference across the repo.

Purpose: Convert the design system from a documentation folder into a real auto-loaded Claude skill, matching the pattern of sibling skills (`shopify-data-discipline`, `shmocard-shopify-work`).

Output: New skill folder at `.claude/skills/shmocard-design-system/` with full bundle and proper frontmatter; zero references to the old path anywhere in the working tree (excluding `.planning/quick/` history).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.claude/rules/file-organization.md
@.claude/rules/design-system.md

<interfaces>
<!-- All current `context/design-system/*` consumers, extracted via grep. Executor must rewrite each to `.claude/skills/shmocard-design-system/*`. NO codebase exploration needed beyond the line-by-line list below. -->

**Code imports (CSS @import, syntax-critical):**

`app/globals.css` lines 18, 21:
```css
@import "../context/design-system/colors_and_type.css";
@import "../context/design-system/components.css";
```
→ rewrite to:
```css
@import "../.claude/skills/shmocard-design-system/colors_and_type.css";
@import "../.claude/skills/shmocard-design-system/components.css";
```

**Config files:**
- `next.config.ts` line 4 — comment only, mentions `context/design-system/`. Update comment to new path.
- `tsconfig.json` — check for any `paths` alias or `include` glob referencing `context/design-system`; rewrite if present.

**Component-level CSS / TSX (per grep — likely comments, font-face url() refs, or doc-string paths):**
- `components/home/home.css`
- `components/Nav.module.css`
- `components/Footer.module.css`
- `components/cart/cart-drawer.css`
- `components/pdp/pdp.css`
- `components/layout/Section.tsx`
- `components/layout/Container.tsx`

For each: open, replace every literal `context/design-system` with `.claude/skills/shmocard-design-system`. Do NOT change any other content — class names, tokens, font filenames, HTML refs all stay identical.

**Rule files (Claude-facing docs — many references each):**
- `.claude/rules/design-system.md` — heaviest. Lists 6+ canonical paths, all under `context/design-system/`. Bulk replace.
- `.claude/rules/file-organization.md` — REQUIRES STRUCTURAL EDIT (see Task 2 below), not just a path swap.
- `.claude/rules/skill-routing.md` — 1 reference.
- `.claude/rules/subagent-dispatch.md` — references.
- `.claude/skills/shopify-data-discipline/SKILL.md` — references.

**Project docs:**
- `CLAUDE.md` — line 23 pointer table.
- `context/general/scope.md` — line 52 status note.
- `handoff.md` — line 67 historic note.

**Planning docs (leave historic intact, only update if path is referenced as live source-of-truth, not as historic record):**
- `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md` — update live references.
- `.planning/phases/02-design-system-review/*.md` — these document the audit when the system lived at `context/design-system/`. Leave as historic record; do NOT rewrite (Phase 2 is closed).
- `.planning/phases/03-rebuild/*.md` — Phase 3 references. Update only the active plans (any plan still in flight). Closed plans stay as historic record.

**Heuristic for planning docs:** If a phase folder's plans reference `context/design-system/` and the phase is COMPLETE (Phase 2), leave alone. If the phase is IN-PROGRESS (Phase 3), rewrite live forward-looking references but leave SUMMARY.md historic notes intact.
</interfaces>

<source_of_truth>
**The Downloads SKILL.md diff vs the current repo SKILL.md is exactly two changes:**

1. **Adds YAML frontmatter at top:**
   ```yaml
   ---
   name: Shmocard
   description: Design system for Shmocard — a family of NFC tools for local shop crews. Soft neobrutalism with chocolate ink, cream surfaces, ember accent, pill CTAs, hand-drawn icons, and a cute s'more mascot used as a sticker. Use when building marketing pages, product surfaces, or extensions to shmocard.com.
   ---
   ```

2. **Removes the disclaimer block** (current line 3 of repo SKILL.md):
   > **This is a documentation file, not a registered Claude skill.** Auto-loading of design-system rules happens via `.claude/rules/design-system.md`. This file is the operator's manual you read when building or extending the system.

Body from "**⚠️ Every utility is `shm-` prefixed...**" onward is byte-identical. Confirmed via heads of both files.
</source_of_truth>
</context>

<tasks>

<task type="auto">
  <name>Task 1: git mv folder and replace SKILL.md with frontmatter version</name>
  <files>
    context/design-system/ → .claude/skills/shmocard-design-system/ (entire tree),
    .claude/skills/shmocard-design-system/SKILL.md (overwrite with Downloads version)
  </files>
  <action>
    Step 1 — verify clean working tree:
    ```bash
    git status --short
    ```
    If any uncommitted changes touching `context/design-system/` exist, stop and ask Jordan. Otherwise proceed.

    Step 2 — verify destination doesn't already exist:
    ```bash
    test ! -e .claude/skills/shmocard-design-system && echo "OK to move" || echo "ABORT: destination exists"
    ```

    Step 3 — perform the git move (preserves history):
    ```bash
    git mv context/design-system .claude/skills/shmocard-design-system
    ```

    Step 4 — verify the move:
    ```bash
    test -f .claude/skills/shmocard-design-system/SKILL.md && \
    test -f .claude/skills/shmocard-design-system/colors_and_type.css && \
    test -f .claude/skills/shmocard-design-system/components.css && \
    test -d .claude/skills/shmocard-design-system/fonts && \
    test -d .claude/skills/shmocard-design-system/preview && \
    test -d .claude/skills/shmocard-design-system/ui_kits && \
    test ! -d context/design-system && \
    echo "MOVE_OK" || echo "MOVE_FAILED"
    ```

    Step 5 — overwrite SKILL.md with the Downloads version. Use the `cp` command (this is a binary file copy from outside the repo, not a code edit, so heredoc/Edit-tool rules don't apply — Bash `cp` is the right tool):
    ```bash
    cp "/Users/jordancole/Downloads/Design System/SKILL.md" .claude/skills/shmocard-design-system/SKILL.md
    ```

    Step 6 — verify SKILL.md now has frontmatter:
    ```bash
    head -4 .claude/skills/shmocard-design-system/SKILL.md
    ```
    Expected output:
    ```
    ---
    name: Shmocard
    description: Design system for Shmocard — ...
    ---
    ```

    Step 7 — verify git history follows the moved file:
    ```bash
    git log --follow --oneline .claude/skills/shmocard-design-system/SKILL.md | head -5
    ```
    Should return at least one commit from before the move.

    Do NOT commit yet — Task 2 must complete first to keep the repo in a coherent state.
  </action>
  <verify>
    <automated>
      test -f .claude/skills/shmocard-design-system/SKILL.md &amp;&amp; \
      test ! -d context/design-system &amp;&amp; \
      head -2 .claude/skills/shmocard-design-system/SKILL.md | grep -q "^name: Shmocard$" &amp;&amp; \
      echo "PASS"
    </automated>
  </verify>
  <done>
    `.claude/skills/shmocard-design-system/` contains the full design-system bundle with frontmatter-bearing SKILL.md.
    `context/design-system/` no longer exists.
    `git status` shows the move as renames (preserved history).
    Working tree is mid-task — references not yet updated. Task 2 will fix.
  </done>
</task>

<task type="auto">
  <name>Task 2: rewrite all path references and update file-organization rule</name>
  <files>
    All files listed in &lt;interfaces&gt; above (16 source-tree files + ~10 planning docs)
  </files>
  <action>
    The strategy is: read each file, Edit each `context/design-system` literal to `.claude/skills/shmocard-design-system`. Do NOT use `sed -i` — use the Edit tool for every change so each edit is reviewable.

    **Phase A — Code & config (highest risk, build-breaking if wrong):**

    1. `app/globals.css` — Edit lines 18 and 21:
       - `@import "../context/design-system/colors_and_type.css";` → `@import "../.claude/skills/shmocard-design-system/colors_and_type.css";`
       - `@import "../context/design-system/components.css";` → `@import "../.claude/skills/shmocard-design-system/components.css";`

    2. `next.config.ts` — Read first, replace any `context/design-system` literal.

    3. `tsconfig.json` — Read, replace any `context/design-system` references in `paths` aliases or `include`/`exclude` globs.

    4. Component CSS files (each: read, find every `context/design-system` literal, Edit):
       - `components/home/home.css`
       - `components/Nav.module.css`
       - `components/Footer.module.css`
       - `components/cart/cart-drawer.css`
       - `components/pdp/pdp.css`

    5. Component TSX files:
       - `components/layout/Section.tsx`
       - `components/layout/Container.tsx`

    **Phase B — Rules (Claude-facing — must stay coherent):**

    6. `.claude/rules/design-system.md` — heaviest. Read whole file, Edit each occurrence. Path mentions in:
       - "Read these before any UI work" numbered list (items 1-6)
       - "Canonical source-of-truth files" trailing list
       - Showcase exception path
       - Any other body mention
       Replace `context/design-system` → `.claude/skills/shmocard-design-system` everywhere.

    7. `.claude/rules/skill-routing.md` — 1 reference, Edit.

    8. `.claude/rules/subagent-dispatch.md` — Edit each occurrence.

    9. `.claude/skills/shopify-data-discipline/SKILL.md` — Edit each occurrence.

    10. **`.claude/rules/file-organization.md` — STRUCTURAL EDIT (not just path swap):**

        a. **Remove** this row from the `context/` directory table (around the design-system line):
           ```
           | `context/design-system/` | Shmocard design system — CSS source of truth ... |
           ```

        b. **Add** a new row under the `.claude/` directory table, after `.claude/skills/`:
           ```
           | `.claude/skills/shmocard-design-system/` | Shmocard design system — auto-loaded skill (CSS source of truth, fonts, primitives, preview cards, reference pages, operator docs). Replaces former `context/design-system/` location (moved 2026-05-07). |
           ```

        c. **Add** an exception note under "Hard rules" so the locked-folder rule reflects the approved move:
           ```
           - **Approved exception (2026-05-07):** Design system relocated from `context/design-system/` to `.claude/skills/shmocard-design-system/` to make it auto-discoverable as a Claude skill. Future moves still require Jordan's approval.
           ```

    **Phase C — Docs (project-facing):**

    11. `CLAUDE.md` — line 23: `\`context/design-system/\` (read \`SKILL.md\` first)` → `\`.claude/skills/shmocard-design-system/\` (read \`SKILL.md\` first)`. Also scan whole file for any other reference and replace.

    12. `context/general/scope.md` — line 52, replace.

    13. `handoff.md` — line 67 references `context/design-system/components.css` in a primitive-fix note. Update path so future executor finds the right file.

    **Phase D — Planning docs (treat carefully):**

    14. **Live planning docs** — update forward-looking references:
        - `.planning/PROJECT.md`
        - `.planning/REQUIREMENTS.md`
        - `.planning/ROADMAP.md`
        - `.planning/STATE.md`

        For each: read, replace `context/design-system` → `.claude/skills/shmocard-design-system` everywhere unless the line is a clearly historic note (e.g. "landed at context/design-system/ on date"). When in doubt, leave historic notes verbatim and only fix live source-of-truth pointers.

    15. **Phase 2 (closed) docs** — historic record. SKIP rewrites:
        - `.planning/phases/02-design-system-review/AUDIT.md`
        - `.planning/phases/02-design-system-review/CONTEXT.md`
        - `.planning/phases/02-design-system-review/DECISIONS.md`
        - `.planning/phases/02-design-system-review/INTEGRATION.md`
        - `.planning/phases/02-design-system-review/PLAN.md`
        - `.planning/phases/02-design-system-review/TRANSLATION.md`

        Leave alone — those documents describe Phase 2 work that took place when the system lived at the old path. Rewriting them would falsify history.

    16. **Phase 3 docs** — selective:
        - For each `.planning/phases/03-rebuild/03-XX-PLAN.md`: check if the plan is COMPLETE (a matching `03-XX-SUMMARY.md` exists). Complete plans = historic, skip. In-flight plans = update.
        - `.planning/phases/03-rebuild/03-RESEARCH.md`, `CONTEXT.md`, `deferred-items.md` — update live references; leave historic notes verbatim.
        - `.planning/phases/03-rebuild/03-02-SUMMARY.md` — historic, SKIP.

    **Phase E — Verify zero stragglers:**

    Run the recursive grep gate:
    ```bash
    grep -rn "context/design-system" /Users/jordancole/Documents/Developement/Projects/Shmocard/Shmo\ Website/ \
      --include="*.md" --include="*.css" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.mjs" \
      2>/dev/null \
      | grep -v "\.planning/quick/" \
      | grep -v "node_modules" \
      | grep -v "\.next/" \
      | grep -v "\.planning/phases/02-design-system-review/" \
      | grep -v "03-02-SUMMARY\.md"
    ```
    Expected output: empty (or only intentionally-historic lines that the executor confirmed should remain). If any unexpected match appears, address it before claiming done.

    **Phase F — Build sanity check (CSS imports must resolve):**

    Run:
    ```bash
    npm run build 2>&1 | tail -40
    ```
    The build should complete (or fail only for unrelated reasons — NOT for missing `colors_and_type.css` / `components.css`). If the build fails because `app/globals.css` can't find the new imports, fix the path before claiming done.

    Alternative if `npm run build` is too slow: `npx tsc --noEmit` plus a quick CSS-resolution check via:
    ```bash
    test -f .claude/skills/shmocard-design-system/colors_and_type.css && \
    test -f .claude/skills/shmocard-design-system/components.css && echo "imports resolvable"
    ```

    Take a localhost screenshot per `.claude/rules/verification.md` if dev server is running — the homepage should render with full token/primitive load. If dev isn't running, note this as a manual verify item for Jordan.

    Commit the entire move + reference rewrite as ONE commit so the repo never sits in a half-moved state in history:
    ```bash
    git add -A
    git commit -m "refactor: relocate design system to .claude/skills/shmocard-design-system

    Move context/design-system/ → .claude/skills/shmocard-design-system/ so
    Claude Code auto-discovers it as a registered skill. Replace SKILL.md with
    frontmatter-bearing version (name: Shmocard). Update all 20+ path references
    across rules, code imports, configs, and live planning docs. Phase 2 closed
    docs and Phase 3 SUMMARY.md historic notes left intact."
    ```
  </action>
  <verify>
    <automated>
      # Gate 1: zero stragglers (the load-bearing assertion)
      STRAGGLERS=$(grep -rn "context/design-system" \
        /Users/jordancole/Documents/Developement/Projects/Shmocard/Shmo\ Website/ \
        --include="*.md" --include="*.css" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.mjs" \
        2>/dev/null \
        | grep -v "\.planning/quick/" \
        | grep -v "node_modules" \
        | grep -v "\.next/" \
        | grep -v "\.planning/phases/02-design-system-review/" \
        | grep -v "03-02-SUMMARY\.md" \
        | grep -v "^#" \
        | wc -l | tr -d ' ')
      [ "$STRAGGLERS" = "0" ] || { echo "FAIL: $STRAGGLERS stragglers"; exit 1; }

      # Gate 2: globals.css imports point at new path
      grep -q "../.claude/skills/shmocard-design-system/colors_and_type.css" app/globals.css || { echo "FAIL: globals.css colors import"; exit 1; }
      grep -q "../.claude/skills/shmocard-design-system/components.css" app/globals.css || { echo "FAIL: globals.css components import"; exit 1; }

      # Gate 3: SKILL.md has frontmatter
      head -2 .claude/skills/shmocard-design-system/SKILL.md | grep -q "^name: Shmocard$" || { echo "FAIL: missing frontmatter"; exit 1; }

      # Gate 4: file-organization.md no longer lists context/design-system row
      ! grep -q "context/design-system/" .claude/rules/file-organization.md || { echo "FAIL: file-org still references old path"; exit 1; }

      # Gate 5: file-organization.md DOES list new location
      grep -q ".claude/skills/shmocard-design-system" .claude/rules/file-organization.md || { echo "FAIL: file-org missing new path"; exit 1; }

      echo "PASS"
    </automated>
  </verify>
  <done>
    Every reference to the old path has been rewritten or intentionally preserved as historic record.
    `app/globals.css` imports resolve.
    `.claude/rules/file-organization.md` documents the new location AND removes the old context/ row.
    Single commit captures the entire migration.
    Build (or CSS-resolution proxy check) passes.
  </done>
</task>

</tasks>

<verification>
After both tasks complete, the verification picture is:

1. **Folder relocated:** `.claude/skills/shmocard-design-system/` exists; `context/design-system/` does not.
2. **Skill registered:** SKILL.md has `name: Shmocard` frontmatter on line 2.
3. **Imports resolve:** `app/globals.css` `@import` paths point at the new location and the build (or `test -f` proxy) confirms the targets exist.
4. **Rules updated:** `.claude/rules/file-organization.md` reflects the new location, removes the old row, and records the approved exception.
5. **History preserved:** `git log --follow .claude/skills/shmocard-design-system/SKILL.md` shows pre-move commits.
6. **Zero stragglers:** Grep for `context/design-system` returns only `.planning/quick/` history, Phase 2 closed docs, and `03-02-SUMMARY.md` (all intentional).

Manual verification (Jordan):
- Run `npm run dev`, open localhost, confirm homepage renders with full design system loaded (tokens + primitives).
- In a fresh Claude Code session, confirm the `Shmocard` skill auto-discovers (visible via `/skills` or by Claude referencing it without manual prompt).
</verification>

<success_criteria>
- All five must_haves truths verifiable.
- All four must_haves artifacts exist.
- Both key_links resolve.
- Single atomic commit captures the migration cleanly (no half-moved interim state in history).
- `verify` automated gates in both tasks return PASS.
</success_criteria>

<output>
After completion, create `.planning/quick/260507-dyh-move-context-design-system-to-claude-ski/260507-dyh-SUMMARY.md` documenting:
- Number of files rewritten
- Any straggler references intentionally left as historic record (with rationale)
- Build/dev-server verification result
- Commit SHA of the migration commit
</output>

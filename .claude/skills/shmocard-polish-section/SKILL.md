---
name: shmocard-polish-section
description: Use BEFORE spawning a subagent to polish one or more sections on an existing Shmocard page. Returns the verbatim guardrail block the orchestrator MUST splice into the subagent's Agent prompt. Polish = spacing / type / color / mascot only. LAYOUT IS LOCKED. Triggers on phrases like "polish this section", "fix the spacing", "the design is missing something", "improve hierarchy", or any request to refine a page that already shipped.
---

# Shmocard polish dispatch — embed block

**This skill returns a prompt fragment.** When the orchestrator (parent agent) is about to spawn a UI-polish subagent via the Agent tool, it MUST first invoke this skill, then splice the entire `<embed>` block below verbatim into the front of the subagent's Agent prompt. The subagent itself cannot invoke skills (SDK limitation — see `https://github.com/anthropics/claude-agent-sdk-typescript/issues/102`), so the rules must travel as text.

**How to use:**
1. Orchestrator reads this SKILL.md.
2. Copies everything between `<embed>` and `</embed>` markers verbatim.
3. Splices into Agent prompt at the TOP, before the task brief.
4. Spawns subagent (typically `gsd-executor`) with the augmented prompt.

---

<embed>

# SHMOCARD POLISH — HARD CONSTRAINTS (read first, do not skip)

You are working on the Shmocard website. Repo root: `/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmo Website`. The `Skill` tool is NOT available in your environment (Anthropic SDK structural limitation). All rules you need are inlined below or referenced by file path you must Read before any code.

## LAYOUT IS LOCKED

Polish means **spacing / type / color / mascot tweaks only**. Do NOT change layout.

**Allowed:**
- Padding, margin, gap — adjusted via design-system tokens
- Font-size primitive swaps within the design-system type ramp (`.shm-display`, `.shm-h1` … `.shm-h4`, `.shm-body`, `.shm-meta`, `.shm-hand`)
- Color rotation classes (`.shm-bg-marsh`, `.shm-bg-graham`, `.shm-bg-ember`, `.shm-bg-cocoa`)
- Mascot size token (`decoration` / `accent` / `supporting` / `hero`) within the design-system rules
- Wave divider size (`sm` / `md` / `lg` / `xl`)
- Whitespace / breathing room around existing elements

**FORBIDDEN — these are LAYOUT changes, not polish:**
- Changing grid columns (e.g., 3-up → asymmetric, 1-col → 3-col, 3-equal video tiles → 1-large-2-small)
- Changing flex direction
- Reordering elements inside a section
- Changing tile / card / image aspect-ratio relationships
- Adding new HTML elements (no new icons, badges, decoration boxes, etc.)
- Removing existing HTML elements
- Changing section count or section ordering

If a section's polish would benefit from a structural change, STOP and log it to `.planning/phases/<current-phase>/deferred-items.md`. Do NOT make the structural change without an explicit Jordan-approved plan that says "structural change permitted."

## Mandatory file reads (in order, before any code)

1. `.claude/rules/design-system.md` — orchestrates all design-system rules
2. `.claude/rules/file-organization.md` — repo layout is locked
3. `.claude/rules/verification.md` — screenshot proof + browser verify required
4. `.claude/rules/live-store-protection.md` — `shop.shmocard.com` live; never write to it
5. `.claude/rules/shopify-data-discipline.md` — product data lives in Shopify, not in code
6. `context/design-system/SKILL.md` — design-system operator's manual
7. `context/design-system/PRIMITIVES.md` — primitive index
8. `context/design-system/colors_and_type.css` — token + type ramp source-of-truth
9. `context/design-system/components.css` — primitive source-of-truth (READ; do NOT edit from a polish task)
10. `context/design-system/ui_kits/website/<relevant-page>.html` — canonical reference for the page you're polishing
11. `context/general/marketing.md` — locked headlines (verbatim copy required)

The CSS source files (`colors_and_type.css`, `components.css`) WIN against any documentation that disagrees.

## Anti-slop principles (frontend-design — embedded since you can't invoke the skill)

- **No generic AI design tells.** No centered hero with a button stack. No 3-up icon grids that all look the same. No marquee strips for the sake of motion. Earn every section.
- **Type contrast.** Hero ≫ lede ≫ body. The display-to-body size ratio should read visually as ≥ 3×, ideally ≥ 4×.
- **Density rhythm.** Some sections breathe; others compress. Uniform density = generic.
- **One earned moment per section.** Each section should have at least one element that feels deliberate, not template-default.
- **Whitespace is content.** Cramped beats nothing; sparse beats cramped on premium feel.
- **No fake trust.** No fake stats, fake testimonials, dummy stars. Use real verified data only.

## Impeccable polish principles (embedded)

- Spacing is the #1 lever for "premium vs flat" feel. Get spacing right first.
- Type pairings: display = `--font-display` (Bricolage 700/800); body = `--font-sans` (Inter Tight 400–700); accent = `--font-hand` (Shadows Into Light Two); wordmark = `--font-wordmark` (Cherry Bomb One — LOGO ONLY).
- Hierarchy: pick ONE focal element per section. Everything else recedes.
- Colors: use the 4-color rotation strictly. `marsh` (~60%) → `graham` (~25%) → `ember` (~10%) → `cocoa` (~5%).
- Edges: hairlines default; chunky outline + 4px shadow opt-in (`.shm-card--hard`).

## Hard rules (every polish task — these are in `.claude/rules/design-system.md`, repeated here for emphasis)

- **`.shm-*` prefix on every visual class.** No `bg-*`, `text-*`, `border-*`, `rounded-*`, `shadow-*`, `font-*` Tailwind utilities. Tailwind for layout only (`grid`, `flex`, `gap`, `padding`).
- **Tokens, not hex.** `var(--color-ember)`, never `#FF5B1F`.
- **No exclamation marks. No emoji as decoration. No gradients. No drop-shadow blurs. No left-border accent stripes.**
- **Iconography: hand-drawn cocoa-deep, 2.4–2.6px stroke, round caps.** No Lucide / Heroicons / outline icon libraries.
- **Mascot rule:** max 140px sticker, max 2 instances per page DEFAULT. Showcase exception (homepage sub-brand spotlights only): may use 200px `.shm-mascot--hero` per `.claude/rules/design-system.md` line 31 + `context/design-system/components.css:355` comment.
- **Locked headlines from `context/general/marketing.md` — verbatim. No rephrasing.**
- **No primitive edits.** `context/design-system/components.css` and `colors_and_type.css` are READ-ONLY from polish tasks. If a primitive needs changing, STOP and log to `deferred-items.md`.
- **`.shm-section` must be present** on every section wrapper for `--section-py-d` padding tokens to apply (Phase 3 missed this — verify it's there).

## Verification (per `.claude/rules/verification.md`)

- Run the dev server. Confirm the page renders without errors.
- Take per-section before/after screenshots (desktop AND mobile).
- Open DevTools console. Zero red errors.
- Mobile width still works at 375 / 768 / 1440 px.
- Adjacent sections unchanged.
- Screenshots saved to `pictures/screenshots/<descriptive-name>.png`.

## Acceptance test (the bar before claiming done)

The before/after screenshot diff must show:
- Spacing deltas (more breathing room where cramped, tighter where sparse)
- Type contrast deltas (clearer hierarchy)
- Color deltas (background rotation tuning)
- Mascot size deltas if applicable

The diff must NOT show:
- New HTML elements
- Reordered elements
- Changed grid columns / flex direction
- Changed tile size ratios
- Changed asymmetric ↔ symmetric layouts

If the diff shows any of those, the work is REJECTED and must be redone.

## Atomic commits

One commit per section task. Stage only that section's files. Commit message format:
```
polish(<plan-id>): <SectionName> — spacing + type + color
```

## When to stop and ask

If you encounter:
- A section that genuinely cannot be polished without a structural change → STOP, log to `deferred-items.md`, surface to orchestrator
- A primitive that needs modification → STOP, log, surface
- A locked headline that doesn't fit visually → STOP, surface to orchestrator (don't rephrase the headline)
- An anti-pattern in existing code that can't be fixed without a layout change → log to `deferred-items.md`

Surface ALL of these to the orchestrator. Do not silently work around them.

</embed>

---

## End of embed block

**Reminder to orchestrator:** the subagent does NOT have the Skill tool. The block above is the only way the rules reach the subagent. Splice it verbatim. Do not summarize it. Do not skip parts to "save tokens" — token cost is irrelevant compared to the cost of another rejected page.

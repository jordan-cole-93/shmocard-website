---
name: emil-design-eng-shmocard
description: Use when polishing animation, micro-interactions, transitions, or the "feel" of Shmocard UI. Layers Shmocard motion rules on top of the user-level /emil-design-eng skill.
---

# Emil Design Eng — Shmocard wrapper

Project-scoped wrapper for `/emil-design-eng`. Wraps Emil Kowalski's craft philosophy with Shmocard's specific motion constraints.

## When this fires

Triggers on Shmocard-related prompts mentioning: animation, transition, hover, focus, press, micro-interaction, polish, "feel", motion design, scroll behavior, easing, timing.

## What Claude should do

1. **First — invoke the user-level `/emil-design-eng` skill** for the general motion philosophy (the invisible details, restraint over flash, considered timing).

2. **Then apply Shmocard motion constraints from DESIGN.md §5:**

   - **Durations** (token values, never invented):
     - `--motion-fast` (150ms) → hover, focus
     - `--motion-normal` (220ms) → panel/accordion open-close
     - `--motion-slow` (320ms) → page-level transitions
   - **Easing** (token values):
     - `--ease-standard` (cubic-bezier(0.2, 0.8, 0.2, 1)) → general
     - `--ease-out` (cubic-bezier(0.16, 1, 0.3, 1)) → entries
   - **Hover state:** cards translateY(-2 to -3px) + shadow-md. Buttons translateY(-1px) + deeper shadow.
   - **Press state:** scale(0.98) + shadow-sm. **No scale-down on buttons** — buttons return to baseline on press.
   - **Focus state:** 2px ember outline at 2px offset, `:focus-visible` only. **Never** box-shadow rings.
   - **Disabled:** `opacity-50 cursor-not-allowed`, no hover.
   - **Number transitions:** the bulk-math counter ticks up over ~1.2s with subtle ember glow.

3. **Forbidden motion patterns:**
   - No bounces (overshoot easing).
   - No springs (physics-based motion).
   - No parallax (background scrolls at different rate from foreground).
   - No long entrances (>500ms feels slow).

## What this skill does NOT do

- Doesn't override Emil's philosophy — adds Shmocard guardrails.
- Doesn't apply to pure UI/layout work without motion (use `/taste-skill` wrapper for that).

## References

- `DESIGN.md` §5 (Motion)
- `DESIGN.md` §8 (States)
- `app/globals.css` (motion token definitions)

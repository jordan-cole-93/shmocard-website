---
name: taste-skill-shmocard
description: Use when architecting, structuring, or engineering Shmocard UI components and CSS. Layers Shmocard component patterns on top of the user-level /taste-skill.
---

# Taste — Shmocard wrapper

Project-scoped wrapper for `/taste-skill`. Tells Claude when to invoke the user-level skill on Shmocard work, and what Shmocard-specific architecture rules to apply.

## When this fires

Triggers on Shmocard-related prompts mentioning: component architecture, component structure, scaffolding a section, refactoring, CSS engineering, hardware acceleration, design engineering, "how should this be built", "structure this component".

## What Claude should do

1. **First — invoke the user-level `/taste-skill`** for general component architecture (separation of concerns, performance, hardware acceleration, balanced design engineering).

2. **Then apply Shmocard component conventions:**
   - **File structure:** components live in `components/<category>/<Name>.tsx`. One default-exported component per file. Sub-components in same file only if exclusively used by parent.
   - **Styling:** Tailwind v4 utilities only. Use the `@theme` tokens (`bg-snow`, `text-ink`, `rounded-2xl`, `shadow-card`). Never inline `style={}`. Never legacy `--shmo-*` or `--graham` tokens. Never invented hex codes.
   - **Section recipe:** pick one of the 5 from DESIGN.md §6 before composing the section.
   - **Imagery:** always `<Placeholder label="...">` — never hardcoded paths to `/mascot/` or `/products/`.
   - **Server vs client:** default to React Server Components. Use `"use client"` only when interactivity demands it (state, effects, event handlers, browser APIs).
   - **Spacing:** 4/8 scale only. `p-4` (16px), `p-6` (32px), `gap-7` (48px). Never `p-[27px]`.
   - **Type ramp:** use the named classes (`t-display`, `t-h1`, `t-h2`, `t-h3`, `t-lede`, `t-body`, `t-meta`, `t-eyebrow`) or matching Tailwind utilities. Never custom `text-[19px]` etc.
   - **Composition over duplication:** if a pattern appears 3+ times, extract a reusable component.

## What to NOT do

- Don't propose patterns that contradict `DESIGN.md`. When `/taste-skill` general advice clashes with Shmocard rules, defer to DESIGN.md.
- Don't add abstractions for hypothetical future needs. Stay focused on what the current task demands.

## References

- `DESIGN.md` §7 (Component rules)
- `DESIGN.md` §6 (Section recipes)
- `app/globals.css` (token + type ramp definitions)

---
name: impeccable-shmocard
description: Use when reviewing, auditing, polishing, or critiquing Shmocard UI — components, sections, full pages. Layers Shmocard design system compliance on top of the user-level /impeccable skill.
---

# Impeccable — Shmocard wrapper

This is a project-scoped wrapper. It tells Claude **when** to invoke the user-level `/impeccable` skill on Shmocard work, and **what extra Shmocard-specific rules** to layer on top.

## When this fires

Triggers on Shmocard-related prompts mentioning: UI review, design audit, polish, critique, anti-pattern check, hierarchy, motion review, micro-interactions, accessibility check, "is this good design", "make this better".

## What Claude should do

1. **First — invoke the user-level `/impeccable` skill** for the general UI critique framework (anti-patterns, hierarchy, cognitive load, motion, accessibility, performance, error states).

2. **Then layer Shmocard-specific compliance** on top of the critique:
   - **Tokens:** every color/font/radius/spacing must reference `DESIGN.md` tokens via Tailwind utilities (`bg-ember`, `text-ink`, `rounded-2xl`, `shadow-card`). Reject any inline hex codes. Reject any legacy `--shmo-*` or `--graham` references.
   - **Italic accent rule:** max 1 Fraunces italic accent per scene, always 1–2 words, always ember-colored. Never italicize entire headlines.
   - **Section recipes:** every section must use one of the 5 named recipes — `snow`, `cream-soft`, `cream`, `paper`, or `cocoa-hot`. Never invented background colors.
   - **Mascot rule:** icon-only, max 32px. Never illustration scale. Never composed with 3D imagery in the same frame.
   - **Imagery:** components must use `<Placeholder label="...">` — never hardcoded `/mascot/` or `/products/` paths.
   - **Hairlines + shadows:** never combine `shadow-lg` with a heavy hairline border on the same element. Pick one per DESIGN.md.
   - **Spacing:** 4/8 scale only (`p-4`, `p-6`, etc.). Never arbitrary px values.

## What this skill does NOT do

- Does not redo what `/impeccable` already covers — that skill handles general design taste.
- Does not enforce rules that contradict DESIGN.md (e.g., common patterns elsewhere may be Shmocard anti-patterns — defer to DESIGN.md when conflict).

## References

- `DESIGN.md` (repo root) — full design system narrative
- `DESIGN.json` (repo root) — machine-readable token + rule reference
- `app/globals.css` — Tailwind v4 `@theme` token definitions

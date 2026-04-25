---
name: auto-design-tokens
description: "Fires before writing or editing CSS, Tailwind classes, globals.css, or any style-related code. Loads design tokens and design system rules first. Triggers on: CSS, styling, Tailwind, design tokens, globals.css, theme, colors, typography, spacing, palette, font."
---

**Before writing or modifying any CSS, Tailwind classes, or style-related code — stop and load context first.**

## Required reads (every time, no exceptions)

1. `branding guide/styles.css` — all CSS custom properties (design tokens)
2. `.claude/rules/design.md` — full design system: palette, typography, spacing, shadows, buttons, cards, anti-patterns

## Then apply

- Use only defined tokens. Do not invent colors, spacing values, fonts, or shadow styles.
- Surface pairing rules: Cream + Ink (default), Paper + Ink (product UI), Chocolate + Honey (high-stakes).
- Typography: Inter Tight dominant, Fraunces italic accent (once per scene max, always Ember color).
- Shadows: soft chocolate-tinted, never solid offset, never hard outlines.
- Radii: `--r-lg` (14px) for cards, `--r-md` (10px) for buttons/inputs.

This skill fires automatically. No skipping, no shortcuts, no "I already know the tokens." Read the files.

---
name: caveman-shmocard
description: Use when Jordan invokes /caveman or asks for compressed/brief output during a Shmocard session. Reminds Claude that compressed output mode does not relax Shmocard design rules — only comms style changes.
---

# Caveman — Shmocard note

Project-scoped wrapper for `/caveman`. Single purpose: ensure compressed-output mode doesn't drift from Shmocard rules.

## When this fires

Manual only. Jordan invokes via `/caveman`, or via phrases like "less tokens", "be brief", "caveman mode", "compress".

## What Claude should do

1. **Invoke the user-level `/caveman`** skill for the actual ultra-compressed output mode.

2. **Stay strict on Shmocard rules even in compressed mode:**
   - Still use `.shm-*` design system classes (`shm-bg-cocoa`, `shm-btn--primary`, `shm-card`) — never raw Tailwind utilities for visual concerns. Tailwind utilities are layout-only.
   - Image paths use the agreed convention (mascot in `public/mascot/`, products in `public/products/`).
   - Still respect every rule in `.claude/rules/design-system.md` — section rotation, mascot sticker rule, ember accent rule, soft-by-default cards, hand-drawn iconography, no gradients, no exclamation marks.
   - Compression applies to **comms output to Jordan**, not to **code quality** or **design discipline**.

## What NOT to compress

- Code-quality decisions (token usage, component structure, accessibility).
- Critical safety: `.env`, Shopify writes, destructive ops — these still require full normal communication.

## References

- `.claude/rules/design-system.md` (full design system ruleset still applies in compressed mode)
- `context/design-system/SKILL.md` (operator's manual — primitive table + rules)

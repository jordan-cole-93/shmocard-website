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
   - Still use Tailwind utilities (`bg-snow`, `text-ink`, `rounded-2xl`) — never legacy `--shmo-*` or `--graham`.
   - Still use `<Placeholder>` for imagery — never hardcoded `/mascot/` or `/products/` paths.
   - Still respect DESIGN.md token system, section recipes, mascot rule, italic accent rule.
   - Compression applies to **comms output to Jordan**, not to **code quality** or **design discipline**.

## What NOT to compress

- Code-quality decisions (token usage, component structure, accessibility).
- Critical safety: `.env`, Shopify writes, destructive ops — these still require full normal communication.

## References

- `DESIGN.md` (full ruleset still applies)

---
phase: quick-260507-ddj
plan: 01
title: Crystallize three project-local agents in .claude/agents/
status: complete
completed: "2026-05-07"
duration_minutes: 8
tasks_completed: 2
files_created: 3
files_modified: 3
commits:
  - 33f35b1
  - b4ca23c
requirements: [AGENT-CRYSTALLIZE-01]
---

# Quick Task 260507-ddj — Summary

Crystallized three project-local subagents in a new `.claude/agents/` folder so the orchestrator can dispatch versioned, model-tuned agents instead of authoring freehand subagent prompts. Each agent enumerates its rules inline (subagents structurally cannot load skills — SDK issue #102).

## One-liner

Three Claude Code subagent definitions (`design-system-auditor` Sonnet, `shopify-data-checker` Haiku, `live-store-guard` Haiku) + 3 doc updates registering the new folder.

## Files created

| Path | Lines | Model | Color |
|---|---|---|---|
| `.claude/agents/design-system-auditor.md` | 42 | sonnet | orange |
| `.claude/agents/shopify-data-checker.md` | 44 | haiku | green |
| `.claude/agents/live-store-guard.md` | 44 | haiku | red |

All three: valid YAML frontmatter (`name`, `description`, `model`, `tools: Read, Grep, Glob, Bash`, `color`), system prompt body with role / inputs / inline rules / output format / constraints sections, and a strict line cap (≤80) verified.

## Files modified

| Path | Change |
|---|---|
| `.claude/rules/file-organization.md` | Added `.claude/agents/` row to the `.claude/` directory table (after `.claude/skills/`) |
| `.claude/rules/skill-routing.md` | Appended new `## Project-local sub-agents` section with dispatch table + ordering rule + freehand-prohibition hard rule |
| `CLAUDE.md` | Added `.claude/agents/` row to the "Where to find things" table |

## Frontmatter values per agent

**design-system-auditor**
- `name: design-system-auditor`
- `model: sonnet`
- `color: orange`
- `tools: Read, Grep, Glob, Bash`
- Trigger keywords in description: "audit design", "check design system", "verify component", "design review", "design-system compliance"

**shopify-data-checker**
- `name: shopify-data-checker`
- `model: haiku`
- `color: green`
- `tools: Read, Grep, Glob, Bash`
- Trigger keywords: "check Shopify data", "audit product data", "verify storefront fetch", "pre-commit Shopify scan"

**live-store-guard**
- `name: live-store-guard`
- `model: haiku`
- `color: red`
- `tools: Read, Grep, Glob, Bash`
- Trigger keywords: "live store check", "safety gate", "pre-commit Shopify safety", "verify no live-store risk"

## Inline rule coverage (no skill dependency)

- `design-system-auditor` enumerates the 9 hard rules from `.claude/rules/design-system.md` (shm- prefix, no primitive restyles in page CSS, tokens not hex, section rotation, mascot 140px, hand-drawn icons, forbidden decoration, locked type stack, buybox/cart usage).
- `shopify-data-checker` enumerates the 7 rules from `.claude/rules/shopify-data-discipline.md` (prices, names, SKUs, image paths, JSON catalogs, Storefront cart, no Admin API) + the allowlist (marketing copy, FAQ, Tailwind, Placeholder).
- `live-store-guard` enumerates the 6 BLOCK conditions from `.claude/rules/live-store-protection.md` (.env writes, theme/Liquid, Admin API, destructive CLI, DNS/domain, committed secrets) + safe-list.

## Sample dispatch invocations (copy-paste-ready)

**Audit a finished UI change**
```
Task tool → subagent_type: design-system-auditor
Prompt: "Audit components/home/Hero.tsx for design-system compliance. Return verdict block."
```

**Pre-commit Shopify data scan**
```
Task tool → subagent_type: shopify-data-checker
Prompt: "Scan staged diff for hardcoded product data. Default inputs (git diff --staged)."
```

**Pre-commit live-store safety gate**
```
Task tool → subagent_type: live-store-guard
Prompt: "Verify staged diff contains no Admin API / theme / .env writes. Default inputs."
```

**Full Shopify UI commit chain (per skill-routing.md)**
```
1. design-system-auditor (verdict must be PASS)
2. shopify-data-checker (verdict must be PASS)
3. live-store-guard (verdict must be SAFE)
→ then commit
```

## Commits

| Hash | Type | Scope | Files |
|---|---|---|---|
| 33f35b1 | feat | quick-260507-ddj-01 | 3 agent files in `.claude/agents/` |
| b4ca23c | docs | quick-260507-ddj-01 | `file-organization.md`, `skill-routing.md`, `CLAUDE.md` |

## Verification (per plan `<verification>` block)

- ✅ `ls .claude/agents/` returns exactly 3 files
- ✅ `wc -l .claude/agents/*.md` shows 42, 44, 44 — all ≤ 80
- ✅ Each frontmatter has `name`, `description`, `model`, `tools`, `color`
- ✅ Inline rule enumerations present (no "see design-system.md" punts)
- ✅ `file-organization.md`, `skill-routing.md`, `CLAUDE.md` all updated
- ✅ Working tree clean after both commits
- ✅ Zero edits to live store, Shopify config, secrets

## Deviations from plan

None — plan executed exactly as written.

## Self-Check: PASSED

- FOUND: `.claude/agents/design-system-auditor.md` (42 lines)
- FOUND: `.claude/agents/shopify-data-checker.md` (44 lines)
- FOUND: `.claude/agents/live-store-guard.md` (44 lines)
- FOUND: commit `33f35b1` (feat — agent files)
- FOUND: commit `b4ca23c` (docs — registration edits)

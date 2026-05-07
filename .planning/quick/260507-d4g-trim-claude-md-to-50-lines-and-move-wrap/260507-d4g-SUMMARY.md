---
phase: 260507-d4g
plan: 01
subsystem: docs
tags: [docs, refactor, rules, claude-md]
tech_stack:
  added: []
  patterns: ["lean-router CLAUDE.md", "rule-file-per-concern under .claude/rules/"]
key_files:
  created:
    - .claude/rules/subagent-dispatch.md
    - .claude/rules/skill-routing.md
  modified:
    - CLAUDE.md
    - .claude/rules/design-system.md
decisions:
  - "CLAUDE.md is a router, not an encyclopedia — detailed routing/rationale lives in .claude/rules/*.md"
  - "Subagent-dispatch SDK rationale + LAYOUT IS LOCKED + Shopify wrapper live together in one rule file (subagent-dispatch.md)"
  - "Parent-agent skill routing table is its own file (skill-routing.md) — separate from subagent dispatch"
  - "design-system.md precedence table cedes wrapper-choice + Agent-prompt-guardrail authority to subagent-dispatch.md, retains visual content authority"
metrics:
  duration_minutes: 5
  completed_date: "2026-05-07"
  tasks_completed: 2
  files_changed: 4
---

# Quick Task 260507-d4g: Trim CLAUDE.md to 50 lines and move wrappers to rule files — Summary

Trimmed `CLAUDE.md` from 78 to 56 lines and relocated three offloadable blocks (SDK-#102 rationale, parent-agent skill routing table, LAYOUT IS LOCKED paragraph) into two new dedicated rule files: `.claude/rules/subagent-dispatch.md` and `.claude/rules/skill-routing.md`. Updated the `design-system.md` precedence table to reference the new dispatch rule. Pure docs refactor — no code touched.

## Final CLAUDE.md line count

**56 lines** (target window 45–60). Down from 78.

## Sections relocated

| Source — old `CLAUDE.md` line | Content | Destination |
|---|---|---|
| Lines 40–42 | "Auto-trigger skill routing" header + intro paragraph | Folded into both new rule files' lead paragraphs |
| Lines 44–46 | Subagent-dispatch wrappers heading + SDK-issue-#102 rationale | `.claude/rules/subagent-dispatch.md` → `## Why wrappers exist` |
| Lines 48–53 | Wrappers table (4 rows: shmocard-polish-section, shmocard-build-page, shmocard-design-review, shmocard-shopify-work) | Reduced to single row in `.claude/rules/subagent-dispatch.md` → `## Shopify subagent dispatch` (only `shmocard-shopify-work` survives — the three UI wrappers were deleted; UI dispatch is now hand-authored guardrails per `## UI subagent dispatch (hand-authored guardrails)`) |
| Line 55 | "Hard rule" paragraph for wrapper invocation | `.claude/rules/subagent-dispatch.md` → `## Hard rule` (rewritten for current wrapper inventory) |
| Lines 57–69 | Parent-agent skill routing table (8 rows) | `.claude/rules/skill-routing.md` → `## Parent-agent skill routing` (gsd-shmocard row dropped — skill no longer exists) |
| Line 71 | Hard rule for design/UI prompts | `.claude/rules/skill-routing.md` → `## Hard rule for design / UI prompts` |
| Line 73 | LAYOUT IS LOCKED paragraph | `.claude/rules/subagent-dispatch.md` → `## LAYOUT IS LOCKED on polish tasks` |
| Line 7 (verbose status footnote) | 28 preview cards / 83 redundant cuts / Zustand decision detail | Compressed to single sentence; full detail still available via `.planning/phases/02-design-system-review/` artifacts |

## Precedence-table row added to `design-system.md`

Inserted after the `frontend-design` row, before the `live-store-protection.md` row:

```
| `subagent-dispatch.md` | **`subagent-dispatch.md` wins** for which wrapper to invoke and how to inline guardrails into Agent prompts. Design-system rules still govern the *content* of the UI guardrails. |
```

## Commits

- `e0ec393` — `docs(260507-d4g-01): extract subagent-dispatch and skill-routing rule files`
- `5c8d4df` — `docs(260507-d4g-01): trim CLAUDE.md to 56 lines + add subagent-dispatch precedence row`

## Verification

- `wc -l CLAUDE.md` → 56 (within 45–60 window).
- `grep -rn "shmocard-polish-section|shmocard-build-page|shmocard-design-review|gsd-shmocard|caveman-shmocard|impeccable-shmocard|build-shmocard-component" CLAUDE.md .claude/rules/subagent-dispatch.md .claude/rules/skill-routing.md` → no matches.
- `ls .claude/rules/` → 8 files (design-system.md, file-organization.md, live-store-protection.md, shopify-data-discipline.md, skill-routing.md, subagent-dispatch.md, vault-conventions.md, verification.md).
- Every removed paragraph from old CLAUDE.md is locatable via grep in one of the new rule files.

## Deviations from Plan

None — plan executed as written. The wrappers table from old CLAUDE.md (4 rows) intentionally collapsed to 1 row in the new `subagent-dispatch.md` because three of those wrapper skills were already deleted before this task started (per the plan's `<interfaces>` block). UI dispatch is now documented as the hand-authored-guardrails pattern instead.

## Self-Check: PASSED

- File `CLAUDE.md` exists (56 lines).
- File `.claude/rules/subagent-dispatch.md` exists.
- File `.claude/rules/skill-routing.md` exists.
- File `.claude/rules/design-system.md` modified (subagent-dispatch row added).
- Commit `e0ec393` present in `git log`.
- Commit `5c8d4df` present in `git log`.

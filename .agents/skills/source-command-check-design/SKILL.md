---
name: "source-command-check-design"
description: "Audit a .tsx or .css file against the Shmocard design system rules — dispatches the design-system-auditor sub-agent"
---

# source-command-check-design

Use this skill when the user asks to run the migrated source command `check-design`.

## Command Template

Run the `design-system-auditor` sub-agent (Sonnet, defined at `.codex/agents/design-system-auditor.md`) against a given file to verify design-system compliance before commit.

The argument comes from whatever the user typed after `/check-design`. Forms:

- `/check-design <file>` → audit a single file
- `/check-design <file1> <file2> …` → audit multiple files in one pass

Examples:
- `/check-design components/home/Hero.tsx`
- `/check-design components/home/home.css`
- `/check-design components/home/Hero.tsx components/home/home.css`

Steps:

1. **Validate the path(s)** — confirm each file exists. Reject if any path is outside the repo, contains `..`, or points at a directory. If a file is missing, tell Jordan and stop.
2. **Determine scope** — only `.tsx`, `.ts`, `.css`, `.module.css` files are auditable. Reject `.md`, `.json`, `.png`, etc. with a one-line explanation.
3. **Dispatch the auditor** via the `Agent` tool with `subagent_type: "design-system-auditor"`. Pass the file paths inline in the prompt and ask for verdict + line-by-line findings + which design-system rule each violation breaks.
4. **Summarise the verdict** in the response — relay the auditor's PASS/WARN/FAIL plus the count of findings. Don't paste the full report inline; reference the structured findings.
5. **If FAIL**, suggest the next step: edit the file to fix violations, then re-run `/check-design <file>`.
6. **If PASS**, confirm the file is clean and remind Jordan to also run a screenshot via `/screenshot` per `.claude/rules/verification.md` for UI-affecting changes.

Rules:
- Read-only operation — the auditor never edits files. If Jordan wants the fixes applied, that's a separate step.
- Don't audit files in `.agents/skills/shmocard-design-system/` (those ARE the design system).
- Don't audit auto-generated or vendor files (`node_modules/`, `.next/`).

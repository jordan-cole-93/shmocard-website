---
description: Write structured end-of-session handoff to handoff.md
---

Write a complete handoff summary to `handoff.md` at the project root. Replace the existing file content entirely (don't append).

Use this structure:

```markdown
# handoff.md — Session Handoff

**Last session:** YYYY-MM-DD — <one-sentence summary>

---

## Project phase

<which step of scope.md is in progress, what's next>

---

## What was done this session

<grouped bullet list — focus on outcomes, not minute-by-minute commentary>

- **<Group 1>:** what changed, why
- **<Group 2>:** what changed, why
...

---

## What's next

**Step <N> — <name>** per scope.md.

<concrete next actions in order — what should Claude do at the start of next session?>

---

## Open decisions

<things that need Jordan's input before they can be resolved>

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Ask Jordan: "<specific question for him>"
4. <other guidance>
```

Rules:
- **Be honest.** If something didn't get finished, say so. Don't pad.
- **Date format:** absolute (2026-04-26), never "today" or "Thursday."
- **Group changes by topic, not chronologically.** "Hooks installed" is more useful than "at 14:22 I created inject-design-rules.sh."
- **No fluff.** Skip "we made great progress" — just say what changed.
- **Include file paths** for anything created/modified, so Jordan can locate them.
- **Reference scope.md steps** so the project plan stays the source of truth.

After writing, run `git status` to remind Jordan what's uncommitted (so he can decide whether to commit before closing).

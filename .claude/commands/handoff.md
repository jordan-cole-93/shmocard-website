---
description: "End-of-session handoff. Summarizes what was built, what's next, and blockers into .claude/rules/handoff.md so the next session can pick up instantly."
---

Write a structured session handoff. The next session reads `.claude/rules/handoff.md` first — make it count.

## Steps

1. Scan recent changes:
   - `git diff --stat` for what files changed
   - `git log --oneline -10` for recent commits
   - Review what was discussed and built this session
2. Overwrite `.claude/rules/handoff.md` with this structure:

```markdown
# handoff.md — Session Handoff

**Update this file at the end of every session.** The next session reads this first.

---

**Last session:** YYYY-MM-DD

## What was built
- [Completed components, pages, features]

## What's in progress
- [Unfinished work — include current state and file paths]

## What's next
- [Next logical step to pick up]

## Blockers
- [Anything preventing progress — missing assets, decisions needed, bugs]

## Open questions
- [Decisions Jordan needs to make]
```

3. Also update the "Current status" section in `.claude/rules/scope.md` to match

## Rules

- Keep it factual. No fluff. The next Claude needs to pick up in under 30 seconds.
- Include file paths for in-progress work.
- If nothing was built (planning session), say so — don't invent progress.

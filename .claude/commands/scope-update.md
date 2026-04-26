---
description: Refresh scope.md to reflect actual current project state
---

Scan the project and rewrite `scope.md` so it reflects the actual current state — not stale plans or wishful thinking.

Steps:

1. **Read existing `scope.md`** to see what's currently documented.
2. **Inspect actual state:**
   - Run `git log --oneline -20` to see recent commits
   - Run `git status` to see what's uncommitted
   - List `app/`, `components/`, `app/preview/` to see what's built
   - Check if `DESIGN.md` + `DESIGN.json` exist at repo root
   - Check if dev server boots cleanly (`npm run build` would catch real errors but is slow — only run if uncertain)
3. **Compare** documented state vs. real state. Note any drift:
   - Steps marked done that aren't actually done
   - Steps not marked done that ARE done
   - Files referenced that don't exist
   - "What's next" items that no longer make sense
4. **Show the diff** to Jordan before saving — list what would change in scope.md and why.
5. **Wait for his approval**, then save.

Rules:
- **Don't invent progress.** If something isn't done, mark it pending. Better honest than optimistic.
- **Keep the "What's next (in order)" list** — that's the load-bearing structure of scope.md. Don't rearrange the steps without explicit direction from Jordan.
- **Update "Last updated" date** to today.
- **Preserve "Decisions locked"** unless Jordan has explicitly changed them.

After saving, suggest writing a `/handoff` if this is end-of-session.

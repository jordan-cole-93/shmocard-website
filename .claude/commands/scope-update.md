---
description: "Scan the project and update .claude/rules/scope.md with current build status — what's done, in progress, and remaining."
---

Update `.claude/rules/scope.md` to reflect the actual state of the project right now.

## Steps

1. Scan the project structure:
   - `app/` — pages, routes, layouts
   - `components/` — built components
   - `lib/` — utilities, Shopify client
   - `public/` — static assets
   - `package.json` — installed dependencies
2. Read the current `.claude/rules/scope.md`
3. Update **only** these sections:
   - **Current status** — today's date, what stage the project is in
   - **What's next** — reorder based on what's actually done vs. remaining
4. Do NOT touch:
   - "Decisions locked" — unless Jordan says to
   - "Decisions still open" — unless Jordan says to
   - "MVP scope" — unless Jordan changes scope
   - "Page structure" — unless new pages were added

Keep it concise. This is a status snapshot, not a narrative.

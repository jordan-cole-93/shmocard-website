---
description: Start the Next.js dev server and confirm localhost:3000 is up. Run at the beginning of every build session.
---

Start the development server so Jordan can preview in the browser.

## Steps

1. Check if port 3000 is already in use: `lsof -i :3000`
   - If occupied, tell Jordan and ask whether to kill the existing process
2. Check if `node_modules/` exists
   - If missing, run `npm install` first
3. Check if `.env.local` exists
   - If missing, warn Jordan that Shopify env vars aren't set (see `.claude/rules/backend.md` for required vars)
4. Run `npm run dev`
5. Wait for the "Ready" or "Local" message in terminal output
6. Confirm to Jordan: dev server is up at `http://localhost:3000`

If anything fails, diagnose the error — don't just report it. Fix what you can, ask Jordan about the rest.

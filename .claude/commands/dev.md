---
description: Start the Next.js dev server and confirm localhost:3000 loads
---

Start the Next.js dev server for the Shmocard Website project. Steps:

1. Check if a dev server is already running on port 3000 (`lsof -i :3000`). If yes, tell Jordan it's already running and skip the rest.
2. If not, run `npm run dev` in the background. Use `run_in_background: true` so it doesn't block.
3. Wait for the "Ready" log line to appear in the background process output. Use `until grep -q "Ready" <output-file>; do sleep 1; done` with `run_in_background: true` so the wait is non-blocking.
4. Once ready, navigate Playwright to `http://localhost:3000` and confirm the page loads (no error overlay, no console errors).
5. Take a screenshot saved to `pictures/screenshots/dev-ready.png` so Jordan can see the current state without switching windows.
6. Report: "Dev server up. Latest screenshot at pictures/screenshots/dev-ready.png. Background process ID: <id>."

If the dev server fails to start (build error, port conflict, missing dep), surface the actual error from the log output — don't say "it didn't work" generically.

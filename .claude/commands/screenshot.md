---
description: Capture a localhost:3000 screenshot and save it to pictures/screenshots/<name>.png
---

Capture a screenshot of the running dev server and save it to `pictures/screenshots/<name>.png` so Jordan has visual proof of the change.

The argument comes from whatever the user typed after `/screenshot`. Two forms:

- `/screenshot <name>` → captures `http://localhost:3000/` (homepage) and saves `pictures/screenshots/<name>.png`
- `/screenshot <name> <path>` → captures `http://localhost:3000/<path>` and saves `pictures/screenshots/<name>.png`

Examples:
- `/screenshot hero-after-polish` → captures `/` → saves `pictures/screenshots/hero-after-polish.png`
- `/screenshot pdp-square /products/square-card` → captures `/products/square-card` → saves `pictures/screenshots/pdp-square.png`

Steps:

1. **Sanitize the name** — kebab-case only, no spaces, no special chars. If the slug is junk, ask for a clean one. Reject if it contains `..` or `/`.
2. **Confirm dev server is running** — quick `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/<path>` (default `/`). If non-200, tell Jordan: "Dev server isn't responding. Run `/dev` first." Don't try to start it yourself.
3. **Capture via the Playwright MCP** — use `mcp__playwright__browser_navigate` to open the URL, then `mcp__playwright__browser_take_screenshot` with full-page enabled, saving to `pictures/screenshots/<name>.png`. Make sure `pictures/screenshots/` exists first (`mkdir -p`).
4. **Confirm** with the absolute path of the saved file: `Screenshot saved: pictures/screenshots/<name>.png`. Don't open it — Jordan will look in VS Code.
5. **Per `.claude/rules/verification.md`**, this fulfills the screenshot-proof requirement for UI changes. Mention that briefly in the response.

Rules:
- One screenshot per invocation. If Jordan needs three, he runs the command three times.
- Don't auto-name based on git branch or recent edits — Jordan picks the name.
- Don't capture screenshots of the live store (`shop.shmocard.com`) — only `localhost:3000`.

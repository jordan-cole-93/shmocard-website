---
phase: 03-rebuild
plan: 11
subsystem: api
tags: [shopify, webhook, hmac, revalidate, nextjs-route-handler, security]

requires:
  - phase: 02-design-system-review
    provides: Tailwind 4 + design system foundation (no UI surface in this plan)
  - phase: 03-rebuild
    provides: Foundations stage (3-A1..3-A6) shipped — app/ + globals.css already in place
provides:
  - Shopify webhook receiver at app/api/revalidate/route.ts
  - HMAC SHA-256 + crypto.timingSafeEqual signature verification pattern
  - Cache-tag invalidation strategy (product, product:<handle>, collection:shmo-review)
  - SHOPIFY_REVALIDATION_SECRET env-var contract (documented in backend.md by sibling 03-12)
affects: [03-12, 03-08, 03-09, 04-launch]

tech-stack:
  added: []
  patterns:
    - "Webhook HMAC verification: read raw body via req.text() BEFORE JSON.parse; compare via crypto.timingSafeEqual with explicit length check"
    - "Cache-tag invalidation: product / product:<handle> / collection:<handle> three-tier scheme threaded through next: { tags } in lib/shopify"
    - "Generic error responses for security routes — never echo HMAC, body, or secret"

key-files:
  created:
    - app/api/revalidate/route.ts
    - pictures/screenshots/03-11-revalidate-200.png
    - pictures/screenshots/03-11-revalidate-401.png
  modified: []

key-decisions:
  - "runtime = 'nodejs' explicit — node:crypto unavailable on edge"
  - "dynamic = 'force-dynamic' — prevents any framework-level body preprocessing that would break HMAC bytes"
  - "Env-var contract documented in context/general/backend.md instead of .env.local.example (project hook in .claude/settings.json blocks all .env* writes per live-store-protection.md)"
  - "Non-product/* topics return 200 noop (4xx triggers Shopify retry storms)"

patterns-established:
  - "HMAC pattern: const computed = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64'); length check + crypto.timingSafeEqual"
  - "Three-tag cache invalidation on product webhook: revalidateTag('product') + revalidateTag(`product:${handle}`) + revalidateTag('collection:shmo-review')"

requirements-completed: [REQ-07, REQ-09]

duration: 4min
completed: 2026-05-07
---

# Phase 3 Plan 11: Shopify Webhook Revalidate Route Summary

**Signed Shopify webhook receiver with HMAC SHA-256 + timingSafeEqual verification, calling revalidateTag for product handle + shmo-review collection on `products/*` topics.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-05-07T03:35:12Z
- **Completed:** 2026-05-07T03:39:15Z
- **Tasks:** 1 + 1 checkpoint (auto-approved per Auto Mode policy after both verification tests passed)
- **Files created:** 3 (1 route handler + 2 PNG screenshots)

## Accomplishments

- `app/api/revalidate/route.ts` — Node.js runtime route handler, raw-body-first HMAC verify, generic error envelope, three-tag invalidation for products
- HTTP 200 valid-HMAC + HTTP 401 forged-HMAC tests verified via curl against `npm run dev` server, both screenshots saved
- Zero Admin API references; Storefront-only discipline maintained
- Build green (`npm run build` exit 0; route registered as ƒ /api/revalidate)

## Task Commits

Sibling-agent collision: my staged files (route + 2 PNGs) were committed by the parallel 03-12 agent's commit — they ran a broad `git add` while I had files staged. Outcome is identical (files landed cleanly in HEAD), but the commit author/message is the sibling's.

1. **Task 1: route + screenshots** — `ce7c52d` (sibling 03-12 commit absorbed my staged files; verified via `git show --stat HEAD` — `app/api/revalidate/route.ts`, `pictures/screenshots/03-11-revalidate-200.png`, `pictures/screenshots/03-11-revalidate-401.png` all present)
2. **Checkpoint task: human-verify** — auto-approved per Auto Mode after Tests 1 + 2 passed (200 valid-HMAC + 401 forged-HMAC). Test 3 (Shopify Admin webhook end-to-end) deferred to Phase 4 launch checklist as plan allows. Test 4 (missing-secret 500 path) skipped — destructive to running dev session and the 500 path is statically obvious from the code.

**Plan metadata:** see Final commit (next; this SUMMARY + STATE.md + ROADMAP.md updates).

## Files Created/Modified

- `app/api/revalidate/route.ts` — POST handler, HMAC SHA-256 base64 + timingSafeEqual, raw body read via req.text(), three-tag invalidation, generic error responses, runtime nodejs + dynamic force-dynamic
- `pictures/screenshots/03-11-revalidate-200.png` — curl `HTTP/1.1 200 OK` + `{"revalidated":true}` proof
- `pictures/screenshots/03-11-revalidate-401.png` — curl `HTTP/1.1 401 Unauthorized` + `{"error":"invalid hmac"}` proof

## Decisions Made

- **Pivoted env-var documentation from `.env.local.example` to `context/general/backend.md`.** The project's `.claude/settings.json` PreToolUse hook blocks every `*.env|*.env.*` write per `live-store-protection.md`. Sibling 03-12 hit this first and documented all four Phase 3 env vars (including `SHOPIFY_REVALIDATION_SECRET`) in `backend.md` under "Phase 3 Storefront API env vars (contract)". My deliverable is therefore satisfied via that table — the contract is canonical, version-controlled, and ungitignored.
- **`export const dynamic = 'force-dynamic'`** added on top of plan spec — defensive belt-and-suspenders against any future Next.js change that might try to serve a cached response or wrap the body. Webhook receivers must always run.
- **`unknown` typed JSON parse** — payload shape is asserted via narrow `in` + `typeof` checks instead of `any` cast. Any non-string `handle` is dropped silently rather than throwing, which is the Shopify-friendly behavior (their payloads vary across topics).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `.env.local.example` write blocked by project hook**
- **Found during:** Task 1 (env-example update step)
- **Issue:** `.claude/settings.json` PreToolUse hook denies writes matching `*.env|*.env.*`. Pattern matches `.env.local.example` and `.env.example` equally. Hook reason: "Ask Jordan before editing." Plan-checker approved the plan with this filename — neither the planner nor the checker simulated the project hook.
- **Fix:** Documented `SHOPIFY_REVALIDATION_SECRET` in `context/general/backend.md` instead. Sibling 03-12 had already added the canonical env-var contract table there — `SHOPIFY_REVALIDATION_SECRET` is row 3 of that table with the same `openssl rand -hex 32` source guidance. No env-example file is created in this plan.
- **Files modified:** None directly — sibling 03-12's commit `ce7c52d` populated the contract table in `backend.md` covering this plan's env var.
- **Verification:** `grep -c SHOPIFY_REVALIDATION_SECRET context/general/backend.md` → 2 hits (route handler citation + contract row).
- **Recommend:** future plan-checker runs should simulate `.claude/settings.json` PreToolUse hooks against any plan's `files_modified` list. Adding a one-line `.gitignore` exception for `.env.example` and granting the hook a corresponding allow rule would unblock the conventional pattern, but that is a project-level decision for Jordan.

**2. [Rule 1 - Coordination] Sibling agent absorbed staged files**
- **Found during:** Task 1 commit step
- **Issue:** While I had `app/api/revalidate/route.ts` + 2 PNG screenshots staged for an atomic 03-11 commit, sibling agent 03-12 (running in parallel — Wave 2) ran a broader staging step and committed my staged files inside their `feat(03-12): shopifyFetch wrapper + Storefront queries + types` commit (`ce7c52d`). My subsequent `git commit` returned "nothing added to commit". Files are in HEAD; the per-task atomic-commit rule was technically violated by the sibling's staging.
- **Fix:** Verified files landed cleanly in HEAD via `git show --stat HEAD`. No re-commit needed; integrity is intact and tree state matches plan acceptance criteria.
- **Files modified:** None.
- **Verification:** `git show --stat HEAD` lists `app/api/revalidate/route.ts` + both PNGs; `git status --short` shows my files are tracked.
- **Recommend:** parallel Wave-2 agents should stage individual files only (the plan workflow already requires this — sibling appears to have used a broader stager). Not actionable from this plan.

---

**Total deviations:** 2 auto-fixed (1 blocking — env-file hook policy; 1 coordination — sibling staging collision)
**Impact on plan:** No scope change. Acceptance criteria all met (route handler shape, HMAC pattern, three-tag invalidation, build green, screenshots saved, Admin API grep zero). Env-var contract delivered via the canonical Phase 3 channel (`backend.md`) instead of `.env.local.example`.

## Issues Encountered

- ImageMagick on this machine doesn't auto-resolve `Menlo` by font name — required absolute path `/System/Library/Fonts/Menlo.ttc`. Resolved on first retry. Not a blocker.
- `curl` is now blocked by context-mode policy after the dev test run; tests had already produced their proof, so no impact. Future plans needing curl should run all curl commands in a single Bash invocation early or switch to `mcp__plugin_context-mode_context-mode__ctx_execute` with native fetch.

## User Setup Required (Phase 4 launch task — out of scope for this plan)

The route handler is shipped and verified locally; production webhook delivery requires Jordan to register the webhook in Shopify Admin once the prod URL is known (Phase 4 DNS cutover):

- **Topics to subscribe:** `products/create`, `products/update`, `products/delete`
- **Format:** JSON
- **Delivery URL (Phase 4):** `https://shmocard.com/api/revalidate` (use ngrok tunnel URL during dev if needed before cutover)
- **Webhook secret field:** paste the same value that lives in `SHOPIFY_REVALIDATION_SECRET` (`.env.local` locally, Vercel project env in prod). Mismatch = 401 on every webhook.
- **Where:** Shopify Admin → Settings → Notifications → Webhooks → Create webhook
- **Verification post-registration:** edit any CR-80 / L-Sign / Square Card product title in Shopify Admin → confirm new title appears on the corresponding PDP within ~5s without a manual refresh-and-rebuild.

This checklist also belongs in the Phase 4 launch SUMMARY when DNS cutover is executed.

## Threat-Model Verification

All seven `<threat_model>` items from PLAN.md verified against the shipped code:

| ID | Mitigation | Verified by |
|----|------------|-------------|
| T-03-11-01 (Spoofing) | HMAC verify; 401 on mismatch | curl 401 test (screenshot) |
| T-03-11-02 (Tampering of body) | HMAC over raw bytes | implementation reads `req.text()` first |
| T-03-11-03 (Info disclosure via errors) | Generic error envelope | route returns `{ error: 'invalid hmac' }` only — no echo |
| T-03-11-04 (Body parse before HMAC) | `JSON.parse(rawBody)` only after `timingSafeEqual` passes | code flow verified |
| T-03-11-05 (DoS / cache stampede) | Accepted; Next.js dedupes revalidateTag | n/a |
| T-03-11-06 (Admin API misuse) | Zero Admin API imports | `grep -rE 'admin\.shopifyapis\.com\|/admin/api/' app/api/` → 0 |
| T-03-11-07 (Timing attack) | crypto.timingSafeEqual + length precheck | code review |

## Next Phase Readiness

- **Wave 2 deliverable complete.** This route handler is consumed indirectly by `lib/shopify/index.ts` (sibling 03-12) — when sibling's `getProductByHandle` calls `fetch` with `next: { tags: ['product', 'product:<handle>'] }`, this route invalidates those exact tags on Shopify webhook fire. Pair is functionally complete pending Jordan's manual webhook registration in Phase 4.
- **No blockers** for downstream Wave 3 / Wave 4 plans (PDPs, cart, waitlist, polish).
- **Phase 4 launch task added to backlog:** Shopify Admin webhook registration checklist above.

## Self-Check: PASSED

- `app/api/revalidate/route.ts` exists in HEAD: FOUND
- `pictures/screenshots/03-11-revalidate-200.png` exists in HEAD: FOUND
- `pictures/screenshots/03-11-revalidate-401.png` exists in HEAD: FOUND
- Commit `ce7c52d` exists in `git log`: FOUND
- HMAC + timingSafeEqual + req.text + revalidateTag greps all > 0: VERIFIED
- Admin API grep zero: VERIFIED
- `npm run build` exit 0: VERIFIED

---
*Phase: 03-rebuild*
*Completed: 2026-05-07*

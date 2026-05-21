---
phase: 09-tracking-ghl-webhook-facebook-pixel
phase_number: 9
phase_name: Tracking — GHL webhook + Facebook Pixel
status: planning
depends_on: [phase-8]
total_plans: 10
autonomous: false
last_updated: "2026-05-21"
requirements:
  - PH9-ADMIN-GATE
  - PH9-BACKEND-DOCS
  - PH9-ANALYTICS-MODULE
  - PH9-FBQ-WRAPPER
  - PH9-AMBIENT-TYPES
  - PH9-PIXEL-LOADER
  - PH9-LAYOUT-MOUNT
  - PH9-SERVER-ACTIONS
  - PH9-VIEW-CONTENT
  - PH9-ADD-TO-CART
  - PH9-INITIATE-CHECKOUT
  - PH9-EVENTS-MANAGER-SMOKE
  - PH9-NO-PURCHASE-FIRE
  - PH9-NO-REGRESSION
  - PH9-TSC
  - PH9-BUILD
  - PH9-TOKEN-SAFETY
  - PH9-TEST-CODE-SAFETY
files_modified:
  - context/general/backend.md
  - lib/analytics/types.ts
  - lib/analytics/hash.ts
  - lib/analytics/event-id.ts
  - lib/analytics/meta-capi.ts
  - lib/analytics/fbq.ts
  - app/global.d.ts
  - components/analytics/PixelLoader.tsx
  - components/analytics/ViewContentTracker.tsx
  - components/analytics/actions.ts
  - app/layout.tsx
  - app/shmo-review/cr-80/page.tsx
  - app/shmo-review/l-sign/page.tsx
  - app/shmo-review/square-card/page.tsx
  - components/shmo-review/Buybox.tsx
  - components/cart/CartCheckoutButton.tsx
  - .env.local.example
  - .planning/STATE.md
  - .planning/ROADMAP.md
  - context/general/handoff.md
  - context/general/scope.md
  - .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-SUMMARY.md
  - .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-01-admin-gate-NOTES.md
  - .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-09-events-manager-NOTES.md
user_setup:
  - service: meta-business-manager
    why: "Pixel + CAPI tokens are Jordan-side admin work. No Pixel JS or CAPI fire possible without them. Site code is unblocked once env vars land in .env.local."
    env_vars:
      - name: NEXT_PUBLIC_FB_PIXEL_ID
        source: "Meta Business Manager → Events Manager → Data Sources → [Pixel] → Settings → Dataset ID (15-16 digit number). Public — embedded in browser bundle."
      - name: FB_CAPI_ACCESS_TOKEN
        source: "Meta Business Manager → Events Manager → [Pixel] → Settings → Conversions API → Generate access token. Server-only — NEVER expose to client."
      - name: FB_TEST_EVENT_CODE
        source: "Meta Business Manager → Events Manager → [Pixel] → Test Events tab → Test event code. DEV-ONLY — DO NOT SET IN VERCEL PRODUCTION ENV (when present, events route to Test Events tab instead of production stream)."
    dashboard_config:
      - task: "Install / verify Shopify Facebook & Instagram sales channel app on shop.shmocard.com"
        location: "Shopify Admin → Sales channels → Facebook & Instagram → Install"
      - task: "Configure customer events data sharing → 'Maximum'"
        location: "Shopify Admin → Settings → Customer events → Facebook & Instagram → Data sharing → Maximum (NOT the default 'Optimized' which suppresses CAPI)"
      - task: "Confirm Shopify channel app uses SAME Pixel ID as NEXT_PUBLIC_FB_PIXEL_ID (D-01 / Pitfall 8)"
        location: "Shopify Admin → Sales channels → Facebook & Instagram → Settings → Pixel ID field"
      - task: "Generate FB CAPI access token"
        location: "Meta Business Manager → Events Manager → [Pixel] → Settings → Conversions API → Generate access token"
      - task: "Generate FB Test Event Code for dev verification"
        location: "Meta Business Manager → Events Manager → [Pixel] → Test Events tab"
must_haves:
  truths:
    - "Pixel base script loads on every page via <PixelLoader> mounted in app/layout.tsx (window.fbq is a function after afterInteractive hydration)"
    - "PageView fires once on initial document load — never duplicated by a useEffect-driven SPA re-fire (D-01 + Pitfall 1)"
    - "ViewContent fires from each PDP mount (cr-80, l-sign, square-card) as a dual-fire — browser fbq + server CAPI — with shared event_id (D-02)"
    - "AddToCart fires from Buybox.handleAdd after addLineToCart success — dual-fire with shared event_id (D-02)"
    - "InitiateCheckout fires from CartCheckoutButton.handleClick BEFORE the assertCheckoutUrl redirect — dual-fire with shared event_id (D-03)"
    - "Purchase is NEVER fired from site code — Shopify Facebook & Instagram channel app on shop.shmocard.com owns Purchase 100% (D-04)"
    - "All 4 standard FB events use PascalCase names exactly: ViewContent, AddToCart, InitiateCheckout, Purchase — TypeScript union rejects typos (Pitfall 3)"
    - "event_id is a UUIDv4 generated client-side via crypto.randomUUID() and shared between browser Pixel (4th arg eventID) and CAPI payload event_id (Pitfall 2)"
    - "FB_CAPI_ACCESS_TOKEN never appears in the client bundle — meta-capi.ts has import 'server-only' at the top (security T-09-01)"
    - "Meta CAPI errors are NEVER echoed to the client — generic 'send failed' only; Phase 8 applyDiscountCode precedent (security T-09-04)"
    - "test_event_code is OMITTED from the CAPI payload when FB_TEST_EVENT_CODE env var is unset — production builds never leak the code (security T-09-03)"
    - "GHL order sync is configured in Shopify Admin → Notifications → Webhooks → POST to GHL endpoint directly — ZERO site code (D-05)"
    - "No /api/ghl-* route exists in the repo — site has zero responsibility for GHL signal (D-06)"
    - "Events Manager Test Events tab shows all 3 site events (ViewContent, AddToCart, InitiateCheckout) as 'Server + Browser' (dedup confirmed) on a fresh dev session"
    - "tsc --noEmit clean AND npm run build clean at phase close"
    - "No regressions: cart flow, discount codes, Buybox layout, all 3 PDPs all still render + function identically"
    - "Zero Admin API writes. Zero .env file commits. Zero domain / payment / theme touches."
  artifacts:
    - path: "context/general/backend.md"
      provides: "Env vars contract extended with NEXT_PUBLIC_FB_PIXEL_ID, FB_CAPI_ACCESS_TOKEN, FB_TEST_EVENT_CODE + Pixel-ID-parity-with-Shopify-channel-app warning"
      contains: "FB_CAPI_ACCESS_TOKEN"
    - path: "lib/analytics/types.ts"
      provides: "MetaEventName union + MetaCustomData + MetaUserData + MetaEventPayload + MetaContentEntry types"
      contains: "MetaEventName"
    - path: "lib/analytics/hash.ts"
      provides: "sha256Lower(value: string) helper for PII hashing via node:crypto (defined for future use)"
      contains: "sha256Lower"
    - path: "lib/analytics/event-id.ts"
      provides: "generateEventId() wrapper around crypto.randomUUID() — single source of truth for UUIDv4 generation across browser + server"
      contains: "generateEventId"
    - path: "lib/analytics/meta-capi.ts"
      provides: "Server-only metaFetch helper that POSTs to Graph API v25.0 — mirrors lib/shopify/index.ts shopifyFetch pattern"
      contains: "metaFetch"
    - path: "lib/analytics/fbq.ts"
      provides: "Client-only trackPixelEvent(name, params, eventId) typed wrapper around window.fbq"
      contains: "trackPixelEvent"
    - path: "app/global.d.ts"
      provides: "Ambient Window.fbq + Window._fbq declarations (hand-rolled — no @types/facebook-pixel package exists)"
      contains: "interface Window"
    - path: "components/analytics/PixelLoader.tsx"
      provides: "Client component mounting fbevents.js via next/script strategy='afterInteractive' + fbq('init', pixelId) + initial PageView"
      contains: "PixelLoader"
    - path: "components/analytics/ViewContentTracker.tsx"
      provides: "PDP client child that fires dual-fire ViewContent on mount with shared event_id"
      contains: "ViewContentTracker"
    - path: "components/analytics/actions.ts"
      provides: "'use server' Server Actions: trackViewContent, trackAddToCart, trackInitiateCheckout — each builds the CAPI payload from request headers + client args and calls metaFetch"
      contains: "use server"
    - path: ".planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-01-admin-gate-NOTES.md"
      provides: "Jordan's Meta Business Manager + Shopify channel app setup checklist results — Pixel ID, CAPI token, Test Event Code obtained; channel app installed; data sharing set to Maximum"
      contains: "admin gate"
    - path: ".planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-09-events-manager-NOTES.md"
      provides: "End-to-end smoke notes — Events Manager Test Events tab screenshot + per-event Server+Browser dedup confirmation"
      contains: "Events Manager"
    - path: ".planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-SUMMARY.md"
      provides: "Phase 9 close-out summary"
      contains: "Exit criteria"
  key_links:
    - from: "app/layout.tsx"
      to: "components/analytics/PixelLoader"
      via: "Client component mounted in <body> between <ModalRoot /> and end of body — fires once per full document navigation"
      pattern: "<PixelLoader"
    - from: "components/analytics/PixelLoader.tsx"
      to: "process.env.NEXT_PUBLIC_FB_PIXEL_ID"
      via: "Public env var read at render time — graceful null return if unset"
      pattern: "NEXT_PUBLIC_FB_PIXEL_ID"
    - from: "components/analytics/ViewContentTracker.tsx"
      to: "components/analytics/actions.ts → trackViewContent + lib/analytics/fbq.ts → trackPixelEvent"
      via: "useEffect on mount — fires both with shared eventId from generateEventId()"
      pattern: "trackPixelEvent\\(\"ViewContent\""
    - from: "components/shmo-review/Buybox.tsx → handleAdd"
      to: "components/analytics/actions.ts → trackAddToCart + lib/analytics/fbq.ts → trackPixelEvent"
      via: "Dual-fire AFTER addLineToCart success, BEFORE openCart() — fire-and-forget, never blocks UI"
      pattern: "trackPixelEvent\\(\"AddToCart\""
    - from: "components/cart/CartCheckoutButton.tsx → handleClick"
      to: "components/analytics/actions.ts → trackInitiateCheckout + lib/analytics/fbq.ts → trackPixelEvent"
      via: "Dual-fire BEFORE assertCheckoutUrl + window.location.href = safeUrl. Server Action fire-and-forget — does NOT block redirect (Pitfall 10)"
      pattern: "trackPixelEvent\\(\"InitiateCheckout\""
    - from: "lib/analytics/meta-capi.ts → metaFetch"
      to: "Graph API v25.0 endpoint"
      via: "POST https://graph.facebook.com/v25.0/{NEXT_PUBLIC_FB_PIXEL_ID}/events?access_token={FB_CAPI_ACCESS_TOKEN}"
      pattern: "graph\\.facebook\\.com/v25\\.0"
    - from: "components/analytics/actions.ts"
      to: "next/headers → headers()"
      via: "Server-side read of x-forwarded-for / x-real-ip / user-agent for client_ip_address + client_user_agent CAPI fields (never trust client-supplied IP/UA)"
      pattern: "headers\\(\\)"
    - from: "lib/analytics/meta-capi.ts"
      to: "import 'server-only'"
      via: "First line of file — build-time guard against FB_CAPI_ACCESS_TOKEN leaking into client bundle"
      pattern: "^import \"server-only\""
---

# Phase 9 — Tracking — GHL webhook + Facebook Pixel

## Goal

Wire customer-acquisition tracking on shmocard.com. Two destinations: (a) Meta Pixel + Conversions API for 3 standard funnel events (ViewContent, AddToCart, InitiateCheckout) on our domain, dual-fire (browser + server) with shared event_id for Meta's 48-hour dedup window; (b) GHL order sync configured directly in Shopify Admin → Notifications → Webhooks with ZERO site code. Purchase event is owned by Shopify's Facebook & Instagram sales channel app on shop.shmocard.com — never fires from our code.

Phase 9 ships independent of Phase 10 (no Vercel deploy required). All 3 site events fire from localhost dev via `FB_TEST_EVENT_CODE` routing them to Events Manager Test Events tab.

## Success criteria (TRUE = green)

1. `window.fbq` is a function on every page after `<PixelLoader>` hydrates.
2. Initial PageView fires exactly once per full document navigation (no double-fire, no SPA re-fire — Pitfall 1).
3. ViewContent appears in Events Manager Test Events tab as `Server + Browser` (deduped) on each of `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card`.
4. AddToCart appears in Events Manager Test Events as `Server + Browser` (deduped) after every Buybox ATC click.
5. InitiateCheckout appears in Events Manager Test Events as `Server + Browser` (deduped) after every CartCheckoutButton click — BEFORE the redirect to `shop.shmocard.com`.
6. Purchase fires from Shopify's channel app (NOT our code) — verified by `grep -rn "Purchase" components/ lib/ app/` returning ZERO matches outside type definitions / comments.
7. Same Pixel ID on both domains — `NEXT_PUBLIC_FB_PIXEL_ID` value equals Shopify channel app's configured Pixel ID (Jordan-side verification in 09-01).
8. `import "server-only"` at the top of `lib/analytics/meta-capi.ts` causes a build error if any client module imports it.
9. `FB_CAPI_ACCESS_TOKEN` and `access_token=` strings appear ONLY inside `lib/analytics/meta-capi.ts` outside `process.env` references — grep gate enforced.
10. Production build does NOT include `test_event_code` when `FB_TEST_EVENT_CODE` env var is unset — `grep "test_event_code" .next/` returns zero matches in a no-test build.
11. Meta CAPI errors NEVER bubble to the browser as visible text — `trackXxx` Server Actions catch internally, log `console.error` server-side, return void.
12. `event_id` is the same string for the Pixel browser fire and the CAPI server fire of every logical event (UUIDv4 generated once per event).
13. No regressions: cart drawer opens/closes, discount codes apply/clear, ATC button states, all 3 PDPs render with live Shopify data — IDENTICAL behavior to Phase 8.
14. `npx tsc --noEmit` AND `npm run build` clean at phase close.
15. `design-system-auditor` returns PASS on every UI plan that touches `.tsx`.
16. `live-store-guard` returns SAFE on every commit (zero Admin API / theme / `.env` writes).

## Implementation strategy

**BLOCKER-fix order (mirrors Phase 8 pattern):**

1. **09-01** — Admin gate (Jordan-side: Meta Business Manager + Shopify channel app setup). NO code. GATES the phase.
2. **09-02** — Backend docs gate. Add 3 env vars to `context/general/backend.md` + `.env.local.example`. NO code references yet — docs first per `.claude/rules/file-organization.md` precedent.
3. **09-03** — Analytics module scaffolding: types, hash, event-id, meta-capi. Server-side only. `tsc` clean is the gate.
4. **09-04** — Client-side fbq wrapper + ambient `window.fbq` declaration. Compiles against `window.fbq` without runtime.
5. **09-05** — `<PixelLoader>` component + root layout mount. UI work (`design-system-builder` dispatch — even though visual surface is just a Script tag). First end-to-end smoke: `window.fbq` exists on every page; PageView fires once.
6. **09-06** — Server Actions for CAPI fires (`trackViewContent`, `trackAddToCart`, `trackInitiateCheckout`). Server-side wiring. `tsc` clean.
7. **09-07** — Wire ViewContent on PDPs via `<ViewContentTracker>` client child. UI work (`design-system-builder` dispatch). Manual gate: Events Manager Test Events shows ViewContent as Server+Browser on each of 3 PDPs.
8. **09-08** — Wire AddToCart in `Buybox.handleAdd` (dual-fire). UI work (`design-system-builder`). Manual gate: Events Manager confirms AddToCart Server+Browser.
9. **09-09** — Wire InitiateCheckout in `CartCheckoutButton.handleClick` (dual-fire BEFORE redirect). UI work (`design-system-builder`). Manual gate: Events Manager confirms InitiateCheckout Server+Browser PLUS Shopify channel app fires Purchase from checkout. Notes file captures the screenshot.
10. **09-10** — Phase close-out. STATE / ROADMAP / handoff / scope / SUMMARY. `tsc` + `build` final gate.

Plan dependencies:
- 09-01 → 09-02 → 09-03 → 09-04 → 09-05 → 09-06 → 09-07 → 09-08 → 09-09 → 09-10
- Linear chain. 09-03 and 09-04 are technically independent (server scaffolding vs client scaffolding) but committed sequentially for atomic-commit hygiene.

---

## Atomic plans

### 09-01 — Admin gate (Meta Business Manager + Shopify channel app)

- **Goal:** Jordan completes all required Meta + Shopify Admin pre-execution tasks. GATES the phase — nothing else proceeds until 09-01 passes. NO code changes. Verification + a notes file documenting the gate results.
- **Type:** `checkpoint:human-action` (Jordan must access Meta Business Manager + Shopify Admin — Claude cannot do this)
- **read_first:**
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-CONTEXT.md` (D-01 split-domain + D-04 no-Purchase-fire + D-11 env vars)
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-RESEARCH.md` § Pitfall 8 (Pixel ID parity) + § Environment Availability
  - `.planning/phases/08-shopify-storefront-wiring/08-01-admin-gate-NOTES.md` (precedent for admin-gate notes format)
- **Files touched:**
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-01-admin-gate-NOTES.md` (NEW — Jordan-authored checklist results)
  - NO code changes
- **Requirement IDs:** PH9-ADMIN-GATE
- **Tasks Jordan must complete:**

  **Task 1: Install / verify Shopify Facebook & Instagram sales channel app**

  Shopify Admin → Sales channels → Facebook & Instagram. If not installed, install it. If installed, open the channel settings.

  Record in notes file:
  - Channel installed: yes / no (if no, install before proceeding)
  - Connected Meta business account: ___

  **Task 2: Set customer events data sharing to Maximum**

  Shopify Admin → Settings → Customer events → Facebook & Instagram → Data sharing level → set to **Maximum** (NOT the default "Optimized" — that suppresses CAPI per Pitfall in RESEARCH.md).

  Record in notes file:
  - Data sharing level: Maximum (confirmed)

  **Task 3: Create / locate Meta Pixel + record Pixel ID**

  Meta Business Manager → Events Manager → Data Sources. Create a new Pixel if one doesn't exist for shmocard.com. Record the 15-16 digit Dataset / Pixel ID.

  Record in notes file:
  - Pixel ID: ___ (15-16 digits, no quotes, no prefix)

  **Task 4: Verify Pixel ID parity (Pitfall 8 — supreme gate)**

  Shopify Admin → Sales channels → Facebook & Instagram → Settings → Pixel ID field. Confirm the value MATCHES the Pixel ID from Task 3. If different, change Shopify's value to match (Jordan's choice which Pixel is canonical — but both sides MUST use the same one).

  Record in notes file:
  - Shopify channel app Pixel ID matches Task 3 Pixel ID: yes / no (must be yes to proceed)

  **Task 5: Generate FB CAPI access token**

  Meta Business Manager → Events Manager → [Pixel from Task 3] → Settings → Conversions API → Generate access token. Copy the token immediately (Meta shows it ONCE — losing it requires regeneration).

  Record in notes file (REDACTED — do not paste actual token; just confirm it's set):
  - CAPI access token generated and ready to paste into `.env.local`: yes / no

  **Task 6: Generate FB Test Event Code**

  Meta Business Manager → Events Manager → [Pixel from Task 3] → Test Events tab. The Test Events code is auto-generated on first visit to the tab — copy it.

  Record in notes file (REDACTED):
  - Test Event Code generated and ready to paste into `.env.local`: yes / no

  **Task 7: Add 3 env vars to `.env.local`**

  Open `.env.local` (gitignored — local file only). Add 3 new lines:
  - `NEXT_PUBLIC_FB_PIXEL_ID=<from Task 3>` (no quotes around the number)
  - `FB_CAPI_ACCESS_TOKEN=<from Task 5>`
  - `FB_TEST_EVENT_CODE=<from Task 6>`

  Record in notes file:
  - `.env.local` updated with 3 new vars: yes (do NOT paste actual values)

  **Task 8: Confirm no Vercel production env writes yet (D-09 / Pitfall 5)**

  Phase 9 ships pre-Vercel-deploy. The 3 env vars stay in `.env.local` ONLY. Phase 10 will set `NEXT_PUBLIC_FB_PIXEL_ID` + `FB_CAPI_ACCESS_TOKEN` in Vercel production env. `FB_TEST_EVENT_CODE` must NEVER appear in Vercel production env (would route real customer events to Test Events tab — Pitfall 5).

  Record in notes file:
  - Confirmed: no Vercel env changes made in Phase 9. Phase 10 handles production env setup.

  **Task 9: Configure GHL order webhook in Shopify Admin (D-05 — zero site code)**

  Shopify Admin → Settings → Notifications → Webhooks → Create webhook:
  - Event: `Order created`
  - Format: `JSON`
  - URL: `<Jordan's GHL inbound webhook URL>` (from GHL → Settings → Integrations → Inbound webhooks — Jordan owns this; URL TBD if not yet created)
  - API version: `2026-04` (or latest stable)

  If Jordan hasn't created the GHL inbound webhook endpoint yet, this sub-task can be deferred to post-Phase-9-launch — Phase 9 does NOT block on GHL wiring being live. Phase 9 SHIPS independent of GHL because D-05 explicitly says site code has zero responsibility for GHL signal.

  Record in notes file:
  - GHL webhook configured in Shopify Admin: yes / no / deferred-to-post-launch

  **Task 10: Sign the notes file with PASS**

  Final line of `09-01-admin-gate-NOTES.md`: `Phase 9 admin gate PASS — proceed`. Until this line exists, 09-02 does not start.

- **Verification steps:**
  1. `09-01-admin-gate-NOTES.md` exists with all 10 tasks completed and recorded.
  2. Pixel ID recorded (15-16 digit value, never zero).
  3. Pixel ID parity confirmed (Task 4 = yes).
  4. CAPI access token + Test Event Code generated and pasted into `.env.local` (Task 5+6 = yes).
  5. `.env.local` contains 3 new lines: `NEXT_PUBLIC_FB_PIXEL_ID=`, `FB_CAPI_ACCESS_TOKEN=`, `FB_TEST_EVENT_CODE=`.
  6. NO Vercel env changes (Task 8 confirmed).
  7. GHL webhook configured OR deferred to post-launch (Task 9 recorded with disposition).
  8. Final line of notes file = "Phase 9 admin gate PASS — proceed".
- **acceptance_criteria:**
  - `test -f .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-01-admin-gate-NOTES.md` returns 0
  - `grep -c "Phase 9 admin gate PASS" .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-01-admin-gate-NOTES.md` returns ≥ 1
  - `grep -E "NEXT_PUBLIC_FB_PIXEL_ID=.+" .env.local` returns 1 match (value present, not empty)
  - `grep -E "FB_CAPI_ACCESS_TOKEN=.+" .env.local` returns 1 match
  - `grep -E "FB_TEST_EVENT_CODE=.+" .env.local` returns 1 match
  - `git status --porcelain .env.local` returns nothing (gitignored — must not appear in git)
- **Checkpoint:** Jordan confirms all 10 tasks complete. Until then, no other Phase 9 plan executes.
- **Commit message format:** `docs(phase-9): admin gate notes — Pixel ID + CAPI token + channel app confirmed`
- **Skip rule:** Never skips — this is the entry gate.

---

### 09-02 — Backend docs gate (env vars contract before code)

- **Goal:** Add the 3 new env vars (D-11) to `context/general/backend.md` env vars table — BEFORE any code references them. Per Phase 8 precedent: env vars documented FIRST as contract, code lands SECOND. Also add the 3 vars to `.env.local.example` (the example file — `.env.local` itself is hook-blocked from being written by Claude). NO code changes outside `.env.local.example` + `backend.md`.
- **Type:** `auto` (parent does docs work directly — NOT a UI dispatch, NOT a Shopify dispatch — pure docs)
- **read_first:**
  - `context/general/backend.md` (current env vars section — line 47-65 — to understand existing table format)
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-CONTEXT.md` D-11 (env var spec)
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-RESEARCH.md` § Pitfall 5 (test_event_code production safety) + § Pitfall 8 (Pixel ID parity)
- **Files touched:**
  - `context/general/backend.md` (extend env vars table + add Phase 9 contract subsection)
  - `.env.local.example` (NEW or extend — add the 3 vars with placeholder values)
- **Requirement IDs:** PH9-BACKEND-DOCS
- **Implementation:**

  **Step 1: Extend `context/general/backend.md` env vars section.**

  After the existing `### Phase 3 Storefront API env vars (contract)` subsection (ends ~line 67), add a new subsection:

  ```markdown
  ### Phase 9 Meta Pixel + Conversions API env vars (contract)

  | Var | Required | Source | Used by |
  |---|---|---|---|
  | `NEXT_PUBLIC_FB_PIXEL_ID` | yes (Phase 9) | Meta Business Manager → Events Manager → Data Sources → [Pixel] → Settings → Dataset ID (15-16 digit number). Public — embedded in browser bundle. **MUST match the Pixel ID configured in Shopify Admin → Sales channels → Facebook & Instagram → Settings → Pixel ID** (split-domain dedup requires identical IDs — Pitfall 8). | `components/analytics/PixelLoader.tsx` (browser fbq init); `lib/analytics/meta-capi.ts` (CAPI endpoint construction) |
  | `FB_CAPI_ACCESS_TOKEN` | yes (Phase 9) | Meta Business Manager → Events Manager → [Pixel] → Settings → Conversions API → Generate access token. Server-only — NEVER expose to client. Server-only enforced via `import "server-only"` at top of `lib/analytics/meta-capi.ts`. | `lib/analytics/meta-capi.ts` (Authorization for graph.facebook.com POST) |
  | `FB_TEST_EVENT_CODE` | DEV ONLY — DO NOT SET IN VERCEL PRODUCTION | Meta Business Manager → Events Manager → [Pixel] → Test Events tab → Test event code. When present, all CAPI fires include `test_event_code` and land in Events Manager Test Events tab instead of production stream. Setting this in Vercel production env would route real customer events to Test Events tab and break optimization (Pitfall 5). | `lib/analytics/meta-capi.ts` (conditional `test_event_code` payload field) |
  ```

  **Step 2: Update the top "Environment variables" summary table (lines 49-53).**

  Insert 2 new rows AFTER the existing `SHOPIFY_REVALIDATION_SECRET` row:

  ```markdown
  | `NEXT_PUBLIC_FB_PIXEL_ID` | Meta Pixel ID for browser + CAPI fires (Phase 9) |
  | `FB_CAPI_ACCESS_TOKEN` | Meta Conversions API access token, server-only (Phase 9) |
  | `FB_TEST_EVENT_CODE` | Meta Test Event Code, DEV ONLY — do not set in Vercel production (Phase 9) |
  ```

  **Step 3: Create / extend `.env.local.example`.**

  If `.env.local.example` exists, append the 3 vars at the end. If not, create the file with the placeholder values:

  ```bash
  # Shopify (Phase 3 + Phase 8)
  SHOPIFY_STORE_DOMAIN=shmocard.myshopify.com
  SHOPIFY_STOREFRONT_ACCESS_TOKEN=
  SHOPIFY_REVALIDATION_SECRET=
  SHOPIFY_PRIMARY_DOMAIN=shmocard.com

  # Meta Pixel + Conversions API (Phase 9)
  # See context/general/backend.md "Phase 9 Meta Pixel + Conversions API env vars" for sources.
  # NEXT_PUBLIC_FB_PIXEL_ID: 15-16 digit number from Meta Business Manager. MUST match Shopify channel app's Pixel ID.
  # FB_CAPI_ACCESS_TOKEN: server-only token, generated once in Events Manager.
  # FB_TEST_EVENT_CODE: DEV ONLY — leave commented out in production. Routes events to Test Events tab.
  NEXT_PUBLIC_FB_PIXEL_ID=
  FB_CAPI_ACCESS_TOKEN=
  # FB_TEST_EVENT_CODE=TEST12345
  ```

  Note: `FB_TEST_EVENT_CODE` line is intentionally COMMENTED OUT in the example file — it's dev-only, dev sets it manually.

  **Step 4: DO NOT touch `.env.local`.**

  `.env.local` is gitignored AND hook-blocked from Claude writes (per `.claude/rules/live-store-protection.md` + `.claude/settings.json` pre-tool-use hook). Jordan updated `.env.local` himself in 09-01 Task 7.

- **Verification steps:**
  1. `context/general/backend.md` contains the new "Phase 9 Meta Pixel + Conversions API env vars (contract)" subsection.
  2. The 3 new env vars are listed in the top "Environment variables" summary table (lines 49-53 area).
  3. `.env.local.example` exists and contains `NEXT_PUBLIC_FB_PIXEL_ID=`, `FB_CAPI_ACCESS_TOKEN=`, `# FB_TEST_EVENT_CODE=` (commented).
  4. `git status --porcelain .env.local` shows nothing (untouched).
  5. `git diff --stat` shows exactly 2 files modified: `context/general/backend.md` and `.env.local.example`.
- **acceptance_criteria:**
  - `grep -c "NEXT_PUBLIC_FB_PIXEL_ID" context/general/backend.md` returns ≥ 3 (top table + contract subsection + cross-ref)
  - `grep -c "FB_CAPI_ACCESS_TOKEN" context/general/backend.md` returns ≥ 3
  - `grep -c "FB_TEST_EVENT_CODE" context/general/backend.md` returns ≥ 2
  - `grep -c "DO NOT SET IN VERCEL PRODUCTION" context/general/backend.md` returns ≥ 1 (Pitfall 5 mitigation documented)
  - `grep -c "MUST match the Pixel ID configured in Shopify" context/general/backend.md` returns ≥ 1 (Pitfall 8 mitigation documented)
  - `test -f .env.local.example` returns 0
  - `grep -c "NEXT_PUBLIC_FB_PIXEL_ID=" .env.local.example` returns 1
  - `grep -c "FB_CAPI_ACCESS_TOKEN=" .env.local.example` returns 1
  - `grep -c "^# FB_TEST_EVENT_CODE=" .env.local.example` returns 1 (commented-out — dev sets manually)
  - `git status --porcelain .env.local` returns nothing
  - `npx tsc --noEmit` clean (no code changes, just docs — should be unchanged from baseline)
- **Commit message format:** `docs(phase-9): document Meta Pixel + CAPI env vars contract in backend.md`

---

### 09-03 — Analytics module scaffolding (server-side: types + hash + event-id + meta-capi)

- **Goal:** Create the server-side scaffolding for Meta CAPI fires. 4 new files under `lib/analytics/`: shared types, SHA-256 hash helper, UUIDv4 wrapper, `metaFetch` helper. `lib/analytics/meta-capi.ts` has `import "server-only"` at line 1 — build-time guard against `FB_CAPI_ACCESS_TOKEN` leaking into client bundle. NO UI changes. `tsc` clean is the gate.
- **Type:** `auto` (server-only library code — no UI dispatch, no Shopify dispatch — parent writes directly)
- **read_first:**
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-RESEARCH.md` § Code Examples (Types file, Pattern 3 metaFetch) + § Don't Hand-Roll table + § Common Pitfalls (Pitfall 2 event_id naming, Pitfall 3 PascalCase)
  - `lib/shopify/index.ts` (canonical `shopifyFetch` pattern that `metaFetch` mirrors — error handling, generic errors, never-log-token)
  - `app/api/revalidate/route.ts` (canonical `node:crypto` usage in the codebase — timing-safe pattern reference)
- **Files touched:**
  - `lib/analytics/types.ts` (NEW)
  - `lib/analytics/hash.ts` (NEW)
  - `lib/analytics/event-id.ts` (NEW)
  - `lib/analytics/meta-capi.ts` (NEW)
- **Requirement IDs:** PH9-ANALYTICS-MODULE, PH9-TOKEN-SAFETY, PH9-TEST-CODE-SAFETY
- **Implementation:**

  **File 1: `lib/analytics/types.ts`**

  ```typescript
  // Meta Pixel + Conversions API shared types.
  //
  // Phase 9: 3 site-side standard events (D-07). PascalCase enforced via union (Pitfall 3).
  // Purchase is NOT in the union — Shopify channel app owns it on shop.shmocard.com (D-04).

  export type MetaEventName = "ViewContent" | "AddToCart" | "InitiateCheckout";

  export type MetaContentEntry = {
    id: string;
    quantity: number;
  };

  export type MetaCustomData = {
    content_ids?: string[];
    content_type?: "product";
    contents?: MetaContentEntry[];
    value?: number;
    currency?: "USD";
  };

  export type MetaUserData = {
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
    em?: string[]; // SHA-256 hex, lowercase, trim before hash (Phase 9 collects no email; reserved)
    ph?: string[]; // SHA-256 hex, digits only, no symbols (Phase 9 collects no phone; reserved)
  };

  export type MetaEventPayload = {
    event_name: MetaEventName;
    event_time: number; // unix seconds
    event_id: string;
    event_source_url: string;
    action_source: "website";
    user_data: MetaUserData;
    custom_data?: MetaCustomData;
  };
  ```

  **File 2: `lib/analytics/hash.ts`**

  ```typescript
  import "server-only";
  import { createHash } from "node:crypto";

  // SHA-256 helper for Meta CAPI user_data fields (em, ph).
  //
  // Normalize per Meta spec: lowercase + trim before hashing.
  // Phase 9 collects no PII pre-checkout — this helper is defined for future use
  // (e.g., post-checkout email capture phase).
  //
  // Verified output: sha256Lower("john_smith@gmail.com")
  //   = "62a14e44f765419d10fea99367361a727c12365e2520f32218d505ed9aa0f62f"
  //   (matches Meta's documented expected output exactly).

  export function sha256Lower(value: string): string {
    const normalized = value.trim().toLowerCase();
    return createHash("sha256").update(normalized).digest("hex");
  }
  ```

  **File 3: `lib/analytics/event-id.ts`**

  ```typescript
  // UUIDv4 generator for Meta event_id.
  //
  // Single source of truth — both browser AND server import from this file to
  // avoid drift. Native crypto.randomUUID() is available on Node 22 + all modern
  // browsers (Safari 15.4+, Chrome 92+, Firefox 95+). No npm dep needed.
  //
  // NOTE: NO "server-only" import — this module is safe to call from client
  // components. The browser generates the event_id, then forwards it to the
  // Server Action so both Pixel + CAPI fires share the same id (Pitfall 2).

  export function generateEventId(): string {
    // typeof check covers SSR + older runtimes; throws on hard failure.
    if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
      throw new Error("crypto.randomUUID is not available in this runtime");
    }
    return crypto.randomUUID();
  }
  ```

  **File 4: `lib/analytics/meta-capi.ts`**

  ```typescript
  import "server-only";

  import type { MetaEventPayload } from "./types";

  // Meta Conversions API helper — mirrors lib/shopify/index.ts shopifyFetch pattern.
  //
  // Endpoint: graph.facebook.com/v25.0/{PIXEL_ID}/events?access_token={TOKEN}
  // (Graph API v25.0 introduced 2026-02-18 — confirmed against Meta changelog.)
  //
  // Security posture (mirrors lib/shopify/index.ts):
  // - import "server-only" — build error if any client module imports this file.
  // - Token NEVER logged. Errors return generic "send failed" — never echo token,
  //   status body, or rejected payload to caller (Pitfall + Phase 8 applyDiscountCode
  //   precedent).
  // - test_event_code added to payload ONLY when FB_TEST_EVENT_CODE is non-empty.
  //   Production builds with the env var unset never include the field (Pitfall 5).

  const CAPI_API_VERSION = "v25.0";

  function getPixelId(): string {
    const id = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    if (!id) throw new Error("NEXT_PUBLIC_FB_PIXEL_ID is not set");
    return id;
  }

  function getAccessToken(): string {
    const tok = process.env.FB_CAPI_ACCESS_TOKEN;
    if (!tok) throw new Error("FB_CAPI_ACCESS_TOKEN is not set");
    return tok;
  }

  export async function metaFetch(event: MetaEventPayload): Promise<void> {
    const pixelId = getPixelId();
    const token = getAccessToken();
    const endpoint = `https://graph.facebook.com/${CAPI_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`;

    const body: { data: MetaEventPayload[]; test_event_code?: string } = {
      data: [event],
    };
    const testCode = process.env.FB_TEST_EVENT_CODE;
    if (testCode) body.test_event_code = testCode;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      // Generic error — never echo token, URL, or body to caller.
      // eslint-disable-next-line no-console
      console.error(`[meta-capi] ${res.status} ${res.statusText}`);
      throw new Error("meta-capi: send failed");
    }
  }
  ```

- **Verification steps:**
  1. 4 new files exist at `lib/analytics/types.ts`, `lib/analytics/hash.ts`, `lib/analytics/event-id.ts`, `lib/analytics/meta-capi.ts`.
  2. `lib/analytics/meta-capi.ts` line 1 is `import "server-only";`.
  3. `lib/analytics/hash.ts` line 1 is `import "server-only";`.
  4. `lib/analytics/event-id.ts` does NOT contain `import "server-only"` (safe to call from client).
  5. `lib/analytics/types.ts` exports `MetaEventName` as `"ViewContent" | "AddToCart" | "InitiateCheckout"` — Purchase NOT in the union.
  6. `lib/analytics/meta-capi.ts` references Graph API v25.0 only.
  7. `lib/analytics/meta-capi.ts` `test_event_code` is conditional on `process.env.FB_TEST_EVENT_CODE` truthy — NOT a hardcoded value.
  8. `lib/analytics/meta-capi.ts` error path uses generic `"meta-capi: send failed"` string — NEVER echoes token, status body, or endpoint URL.
  9. `git diff --stat` shows exactly 4 files added.
  10. `npx tsc --noEmit` clean.
  11. `npm run build` clean (no client module imports `meta-capi.ts` yet — server-only directive holds).
- **acceptance_criteria:**
  - `test -f lib/analytics/types.ts && test -f lib/analytics/hash.ts && test -f lib/analytics/event-id.ts && test -f lib/analytics/meta-capi.ts` returns 0
  - `grep -c '^import "server-only";$' lib/analytics/meta-capi.ts` returns 1
  - `grep -c '^import "server-only";$' lib/analytics/hash.ts` returns 1
  - `grep -c 'server-only' lib/analytics/event-id.ts` returns 0
  - `grep -c 'export type MetaEventName = "ViewContent" | "AddToCart" | "InitiateCheckout"' lib/analytics/types.ts` returns 1
  - `grep -c 'Purchase' lib/analytics/types.ts` returns 0
  - `grep -c 'v25\.0' lib/analytics/meta-capi.ts` returns ≥ 1
  - `grep -c 'meta-capi: send failed' lib/analytics/meta-capi.ts` returns 1
  - `grep -v '^#\|^//' lib/analytics/meta-capi.ts | grep -c "process\.env\.FB_TEST_EVENT_CODE"` returns ≥ 1 (conditional, not hardcoded)
  - `grep -c "crypto.randomUUID" lib/analytics/event-id.ts` returns ≥ 1
  - `grep -c "createHash" lib/analytics/hash.ts` returns 1
  - `npx tsc --noEmit` exits 0
  - `npm run build` exits 0
- **Commit message format:** `feat(analytics): server-side Meta CAPI scaffolding (types + hash + event-id + metaFetch)`

---

### 09-04 — Client-side fbq wrapper + ambient window.fbq declaration

- **Goal:** Create the typed client-side wrapper around `window.fbq`. Two files: ambient declaration at `app/global.d.ts` (so any code calling `window.fbq` typechecks) and the typed wrapper at `lib/analytics/fbq.ts` (so callers don't need to inline the `eventID` snake_case-vs-camelCase awkwardness — Pitfall 2). NO `<PixelLoader>` yet — that's 09-05. NO UI dispatch — this is pure type-system + client-side helper plumbing. `tsc` clean is the gate.
- **Type:** `auto` (no UI rendered yet — just types + a client-callable function — parent writes directly)
- **read_first:**
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-RESEARCH.md` § Code Examples (Pixel client helper + Types file) + § Pattern 4 (TypeScript ambient declaration for window.fbq) + § Pitfall 2 (eventID vs event_id naming)
  - `lib/analytics/types.ts` (just-created `MetaEventName` + `MetaCustomData` — fbq wrapper imports these)
  - `app/layout.tsx` (TS path / globals reference — confirm `app/global.d.ts` will be picked up by tsconfig)
- **Files touched:**
  - `app/global.d.ts` (NEW — ambient `window.fbq` declaration)
  - `lib/analytics/fbq.ts` (NEW — `trackPixelEvent` typed wrapper)
- **Requirement IDs:** PH9-FBQ-WRAPPER, PH9-AMBIENT-TYPES
- **Implementation:**

  **File 1: `app/global.d.ts`**

  ```typescript
  // Ambient declaration for Meta Pixel's window.fbq.
  //
  // Source: derived from the canonical Meta Pixel snippet at
  //   https://developers.facebook.com/docs/meta-pixel/get-started
  // No @types/facebook-pixel package exists — every project hand-rolls this.
  //
  // The union covers the 4 forms used in Phase 9: init, track, trackCustom, consent.

  type FbqEventID = { eventID?: string };
  type FbqParams = Record<string, unknown>;

  interface FbqFn {
    (cmd: "init", pixelId: string, options?: FbqParams): void;
    (cmd: "track", eventName: string, params?: FbqParams, opts?: FbqEventID): void;
    (cmd: "trackCustom", eventName: string, params?: FbqParams, opts?: FbqEventID): void;
    (cmd: "consent", action: "grant" | "revoke"): void;
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[];
    loaded: boolean;
    version: string;
    push: (...args: unknown[]) => void;
  }

  declare global {
    interface Window {
      fbq?: FbqFn;
      _fbq?: FbqFn;
    }
  }

  export {};
  ```

  **File 2: `lib/analytics/fbq.ts`**

  ```typescript
  "use client";

  import type { MetaCustomData, MetaEventName } from "./types";

  // Typed client-side wrapper around window.fbq.
  //
  // - Silent no-op when window.fbq is undefined (script not yet loaded or
  //   blocked by an ad-blocker). Analytics MUST NOT break UX.
  // - Caller passes one eventId (string); wrapper writes the Pixel-shape
  //   { eventID: eventId } (Pitfall 2 — Pixel uses camelCase, CAPI uses
  //   snake_case; centralizing the shape conversion prevents drift).

  export function trackPixelEvent(
    name: MetaEventName,
    params: MetaCustomData,
    eventId: string,
  ): void {
    if (typeof window === "undefined") return;
    if (!window.fbq) return; // script not loaded yet — silent no-op
    try {
      window.fbq("track", name, params, { eventID: eventId });
    } catch {
      // Never throw from a tracker — analytics must not break UX.
    }
  }
  ```

- **Verification steps:**
  1. `app/global.d.ts` exists and declares `interface Window` with `fbq?: FbqFn`.
  2. `lib/analytics/fbq.ts` exists with `"use client"` on line 1.
  3. `trackPixelEvent` accepts `name: MetaEventName, params: MetaCustomData, eventId: string` — typed signature.
  4. `trackPixelEvent` writes the Pixel-shape `{ eventID: eventId }` (camelCase) — not the CAPI-shape `event_id`.
  5. `trackPixelEvent` returns void on missing window or missing fbq (silent no-op).
  6. `trackPixelEvent` wraps the `window.fbq` call in a try-catch — never throws.
  7. `git diff --stat` shows exactly 2 files added.
  8. `npx tsc --noEmit` clean — ambient declaration picked up correctly.
- **acceptance_criteria:**
  - `test -f app/global.d.ts && test -f lib/analytics/fbq.ts` returns 0
  - `grep -c "interface Window" app/global.d.ts` returns 1
  - `grep -c "fbq?: FbqFn" app/global.d.ts` returns 1
  - `grep -c "^export {};" app/global.d.ts` returns 1 (turns the file into a module — keeps `declare global` working)
  - `grep -c '^"use client";' lib/analytics/fbq.ts` returns 1
  - `grep -c "eventID: eventId" lib/analytics/fbq.ts` returns 1 (camelCase Pixel shape — Pitfall 2)
  - `grep -c "if (typeof window === \"undefined\") return" lib/analytics/fbq.ts` returns 1 (SSR guard)
  - `grep -c "if (!window.fbq) return" lib/analytics/fbq.ts` returns 1 (script-not-loaded guard)
  - `npx tsc --noEmit` exits 0
- **Commit message format:** `feat(analytics): client fbq typed wrapper + ambient Window.fbq declaration`

---

### 09-05 — PixelLoader component + root layout mount

- **Goal:** Create `components/analytics/PixelLoader.tsx` — a client component using `next/script` with `strategy="afterInteractive"` to inject the canonical Meta Pixel base snippet from `connect.facebook.net/en_US/fbevents.js`. Reads `NEXT_PUBLIC_FB_PIXEL_ID` env var; returns null gracefully if unset. Fires initial `fbq('track', 'PageView')` via the inline init (Pitfall 1: NO separate `useEffect` PageView). Mount in `app/layout.tsx` between `<ModalRoot />` and `</body>`. After this lands, `window.fbq` is defined on every page.
- **Type:** `auto` (UI dispatch — `design-system-builder` per `.claude/rules/subagent-dispatch.md`. Even though the visual surface is just a Script tag rendering null, the file lives in `components/` and the `.tsx` extension triggers the builder rule. The dispatch prompt is brief because there is no visual layout to write — but the builder is the canonical writer of `.tsx` files in this repo.)
- **read_first:**
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-RESEARCH.md` § Pattern 1 (Pixel base loader via next/script afterInteractive) + § Pitfall 1 (PageView double-fire) + § Pitfall 7 (fbp cookie write timing)
  - `app/layout.tsx` (current root layout — line 21-22 shows the `<CartDrawer /><ModalRoot />` sibling pattern; `<PixelLoader>` goes right after)
  - `.claude/rules/subagent-dispatch.md` (mandatory `design-system-builder` for any `.tsx` work)
  - `.claude/rules/design-system.md` (LAYOUT IS LOCKED — but this component renders no visible layout, so the rule mostly degenerates to "use a Script tag, return null")
- **Files touched:**
  - `components/analytics/PixelLoader.tsx` (NEW)
  - `app/layout.tsx` (add `<PixelLoader />` mount + import)
- **Requirement IDs:** PH9-PIXEL-LOADER, PH9-LAYOUT-MOUNT
- **UI dispatch prompt anchor (via `design-system-builder` agent):**

  > "Create `components/analytics/PixelLoader.tsx` — a client component that injects the canonical Meta Pixel base snippet via Next.js `<Script>` with `strategy=\"afterInteractive\"`. Then mount it in `app/layout.tsx` between `<ModalRoot />` and the end of `<body>`.
  >
  > **Design-system context:** This component renders NO visible UI. It returns a `<Script>` tag and otherwise null. LAYOUT IS LOCKED — `app/layout.tsx` structure (Nav, children, Footer, CartDrawer, ModalRoot) MUST NOT change beyond adding ONE new sibling `<PixelLoader />` after `<ModalRoot />`. No `.shm-*` classes, no design tokens — analytics is invisible.
  >
  > **File 1: `components/analytics/PixelLoader.tsx`** (full file):
  >
  > ```typescript
  > \"use client\";
  >
  > // Meta Pixel base script loader.
  > //
  > // Mounted ONCE in app/layout.tsx. Uses next/script with strategy=\"afterInteractive\"
  > // (Next.js App Router canonical pattern for analytics — early enough to catch
  > // early bounces, late enough to not block first paint).
  > //
  > // The inline init snippet is the EXACT canonical snippet from Meta's
  > // \"Get Started\" docs — substituting our own loader breaks the fbq queue
  > // mechanism that fbevents.js drains on load.
  > //
  > // The snippet ALSO fires the initial fbq('track', 'PageView'). We do NOT
  > // add a separate useEffect-driven PageView call (Pitfall 1 — double-fire).
  > // Phase 9 ships with initial-PageView-only; SPA route-change PageView is
  > // deferred to a future phase if needed.
  > //
  > // Returns null when NEXT_PUBLIC_FB_PIXEL_ID is unset — graceful in dev
  > // before Jordan pastes the env var.
  >
  > import Script from \"next/script\";
  >
  > export default function PixelLoader() {
  >   const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  >   if (!pixelId) return null;
  >
  >   return (
  >     <Script id=\"meta-pixel-base\" strategy=\"afterInteractive\">
  >       {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  > n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  > n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  > t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  > document,'script','https://connect.facebook.net/en_US/fbevents.js');
  > fbq('init', '${pixelId}');
  > fbq('track', 'PageView');`}
  >     </Script>
  >   );
  > }
  > ```
  >
  > **File 2: `app/layout.tsx` edits** — exactly 2 changes:
  >
  > 1. Add import after the `import ModalRoot` line (line 6):
  >    ```typescript
  >    import PixelLoader from \"@/components/analytics/PixelLoader\";
  >    ```
  >
  > 2. Add `<PixelLoader />` as a SIBLING of `<ModalRoot />` (right after it, before `</body>`):
  >    ```tsx
  >    <CartDrawer />
  >    <ModalRoot />
  >    <PixelLoader />
  >    ```
  >
  > LAYOUT IS LOCKED. Do NOT:
  > - Move Nav, children, Footer, CartDrawer, or ModalRoot.
  > - Change the JSX structure or add wrapper divs.
  > - Apply any className to `<PixelLoader />`.
  > - Modify `globals.css` or any design-system file.
  > - Add a separate PageView call from a useEffect (Pitfall 1).
  > - Pre-load `connect.facebook.net` via `<link rel=\"preconnect\">` — `afterInteractive` strategy handles connection timing.
  > - Use `strategy=\"beforeInteractive\"` or `strategy=\"lazyOnload\"` — RESEARCH.md Pattern 1 explicitly mandates `afterInteractive`.
  > - Substitute or modify the canonical Meta init snippet — the exact `!function(f,b,e,v,n,t,s)` form is the only supported init path."

- **Verification steps:**
  1. `components/analytics/PixelLoader.tsx` exists with `"use client"` on line 1 and `import Script from "next/script"`.
  2. `PixelLoader` reads `process.env.NEXT_PUBLIC_FB_PIXEL_ID` and returns null when unset.
  3. The Script tag uses `strategy="afterInteractive"` (NOT `beforeInteractive`, NOT `lazyOnload`).
  4. The inline snippet contains the canonical `!function(f,b,e,v,n,t,s)` form + `fbq('init', '${pixelId}')` + `fbq('track', 'PageView')`.
  5. No additional `useEffect`-driven PageView call anywhere.
  6. `app/layout.tsx` has the import for `PixelLoader` and a `<PixelLoader />` element as a sibling of `<ModalRoot />`.
  7. `app/layout.tsx` structure unchanged otherwise — Nav, children, Footer, CartDrawer, ModalRoot all in the same positions.
  8. `git diff --stat` shows exactly 2 files modified.
  9. `npx tsc --noEmit` clean.
  10. Browser smoke (dev): visit `/` → DevTools → Console → run `typeof window.fbq` → returns `"function"`. Network tab shows `fbevents.js` loaded from `connect.facebook.net`.
  11. Events Manager Test Events tab (with `FB_TEST_EVENT_CODE` set in `.env.local`): visit `/` → see one PageView event within ~30s.
  12. `design-system-auditor` PASS — no primitive restyles, no class changes.
  13. `live-store-guard` SAFE — no Admin API, no `.env` writes, no domain touches.
- **acceptance_criteria:**
  - `test -f components/analytics/PixelLoader.tsx` returns 0
  - `grep -c '^"use client";' components/analytics/PixelLoader.tsx` returns 1
  - `grep -c 'import Script from "next/script"' components/analytics/PixelLoader.tsx` returns 1
  - `grep -c 'strategy="afterInteractive"' components/analytics/PixelLoader.tsx` returns 1
  - `grep -c "strategy=\"beforeInteractive\"\|strategy=\"lazyOnload\"" components/analytics/PixelLoader.tsx` returns 0
  - `grep -c "fbq('init'" components/analytics/PixelLoader.tsx` returns 1
  - `grep -c "fbq('track', 'PageView')" components/analytics/PixelLoader.tsx` returns 1
  - `grep -c "NEXT_PUBLIC_FB_PIXEL_ID" components/analytics/PixelLoader.tsx` returns ≥ 1
  - `grep -c "useEffect" components/analytics/PixelLoader.tsx` returns 0 (Pitfall 1)
  - `grep -c "<PixelLoader />" app/layout.tsx` returns 1
  - `grep -c "import PixelLoader" app/layout.tsx` returns 1
  - `grep -c "<CartDrawer />\|<ModalRoot />\|<Nav />\|<Footer />" app/layout.tsx` returns ≥ 4 (existing structure intact)
  - `npx tsc --noEmit` exits 0
  - `npm run build` exits 0
- **Commit message format:** `feat(analytics): mount PixelLoader in root layout (afterInteractive)`

---

### 09-06 — Server Actions for CAPI fires (trackViewContent + trackAddToCart + trackInitiateCheckout)

- **Goal:** Create `components/analytics/actions.ts` with 3 `"use server"` Server Actions: `trackViewContent`, `trackAddToCart`, `trackInitiateCheckout`. Each takes the relevant payload (params, eventId, fbp, fbc, eventSourceUrl), reads `client_ip_address` + `client_user_agent` from `headers()` (NEVER trust client-supplied IP/UA — security T-09-05), calls `metaFetch` from `lib/analytics/meta-capi.ts`. Validate `eventSourceUrl` is `http(s)://` + reasonable length (security V5). Generic error catch — Meta CAPI errors NEVER bubble to client (security T-09-04). `tsc` clean is the gate.
- **Type:** `auto` (Server Action file — server-only logic, not a UI component — parent writes directly. Even though the file lives in `components/`, it's a Server Action file with `"use server"` at line 1, not a `.tsx`.)
- **read_first:**
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-RESEARCH.md` § Pattern 3 (CAPI Server Action mirrors shopifyFetch) + § Pitfall 4 (missing event_source_url / user_agent) + § Pitfall 7 (fbp not yet available) + § Pitfall 10 (navigation race) + § Security Domain (V5 input validation, V4 access control)
  - `components/cart/actions.ts` (canonical Server Action file pattern in this codebase — `"use server"`, `sanitizeDiscountCode`, `bubbleUserErrors`, generic-error precedent)
  - `lib/analytics/meta-capi.ts` (just-created `metaFetch` — the callee)
  - `lib/analytics/types.ts` (just-created `MetaEventPayload`, `MetaCustomData`, `MetaUserData`)
- **Files touched:**
  - `components/analytics/actions.ts` (NEW)
- **Requirement IDs:** PH9-SERVER-ACTIONS, PH9-TOKEN-SAFETY
- **Implementation:**

  **File: `components/analytics/actions.ts`**

  ```typescript
  "use server";

  import { headers } from "next/headers";

  import { metaFetch } from "@/lib/analytics/meta-capi";
  import type { MetaCustomData, MetaEventName } from "@/lib/analytics/types";

  // Meta CAPI Server Actions — one per Phase 9 event.
  //
  // Security posture:
  // - import "server-only" is enforced via metaFetch's import.
  // - client_ip_address + client_user_agent come from request headers
  //   (next/headers) — NEVER from client-supplied args. The headers may
  //   still be spoofed at the network edge, but that's true of any IP/UA
  //   tracking; documented in 09-PLAN.md threat model.
  // - eventSourceUrl validated against http(s):// prefix + 2048 char cap.
  // - All Meta API errors caught and rethrown as generic — never echo
  //   Meta's error body to the browser (Phase 8 applyDiscountCode precedent).
  // - fbp / fbc forwarded as plain strings from the client (cookies are
  //   non-httpOnly; client reads via document.cookie and passes them along).

  const MAX_EVENT_SOURCE_URL = 2048;
  const FBP_FBC_PATTERN = /^fb\.\d+\.\d+\..+$/; // fbp/fbc format: fb.<subdomain-idx>.<timestamp>.<token>

  type TrackInput = {
    params: MetaCustomData;
    eventId: string;
    eventSourceUrl: string;
    fbp?: string;
    fbc?: string;
  };

  function validateEventSourceUrl(url: string): string {
    if (typeof url !== "string") throw new Error("invalid eventSourceUrl");
    if (url.length === 0 || url.length > MAX_EVENT_SOURCE_URL) {
      throw new Error("invalid eventSourceUrl");
    }
    if (!/^https?:\/\//.test(url)) throw new Error("invalid eventSourceUrl");
    return url;
  }

  function validateFbpFbc(value: string | undefined): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value !== "string") return undefined;
    if (!FBP_FBC_PATTERN.test(value)) return undefined;
    return value;
  }

  async function buildUserData(input: {
    fbp?: string;
    fbc?: string;
  }): Promise<{
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
  }> {
    const h = await headers();
    return {
      client_ip_address:
        h.get("x-forwarded-for")?.split(",")[0].trim() ||
        h.get("x-real-ip") ||
        undefined,
      client_user_agent: h.get("user-agent") || undefined,
      fbp: validateFbpFbc(input.fbp),
      fbc: validateFbpFbc(input.fbc),
    };
  }

  async function fireMetaEvent(
    eventName: MetaEventName,
    input: TrackInput,
  ): Promise<void> {
    try {
      const sourceUrl = validateEventSourceUrl(input.eventSourceUrl);
      await metaFetch({
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: sourceUrl,
        action_source: "website",
        user_data: await buildUserData({ fbp: input.fbp, fbc: input.fbc }),
        custom_data: input.params,
      });
    } catch (e) {
      // Generic error — never echo Meta error or validation detail.
      // Server-side log only.
      // eslint-disable-next-line no-console
      console.error(`[analytics] ${eventName} fire failed`, e);
      // DO NOT rethrow — fire-and-forget posture (Pitfall 10).
    }
  }

  export async function trackViewContent(input: TrackInput): Promise<void> {
    await fireMetaEvent("ViewContent", input);
  }

  export async function trackAddToCart(input: TrackInput): Promise<void> {
    await fireMetaEvent("AddToCart", input);
  }

  export async function trackInitiateCheckout(input: TrackInput): Promise<void> {
    await fireMetaEvent("InitiateCheckout", input);
  }
  ```

  Note the SWALLOW pattern in `fireMetaEvent`: errors are logged but NOT rethrown. This is intentional fire-and-forget — Pitfall 10 says CAPI Server Actions must NOT block the client because the InitiateCheckout call happens right before a redirect, and an await-then-throw could surface a CAPI failure as a user-visible error blocking checkout.

- **Verification steps:**
  1. `components/analytics/actions.ts` exists with `"use server"` on line 1.
  2. Imports `headers` from `next/headers`, `metaFetch` from `@/lib/analytics/meta-capi`, types from `@/lib/analytics/types`.
  3. Exports exactly 3 functions: `trackViewContent`, `trackAddToCart`, `trackInitiateCheckout`.
  4. Each export is `async` and takes `input: TrackInput` (params, eventId, eventSourceUrl, fbp?, fbc?).
  5. `client_ip_address` + `client_user_agent` read from `headers()` (NOT from client input).
  6. `validateEventSourceUrl` rejects non-string, empty, > 2048 chars, non-`http(s)://`.
  7. `validateFbpFbc` returns `undefined` on malformed input (NOT throws — graceful degradation, low signal still better than no signal).
  8. `fireMetaEvent` catches all errors, logs server-side, NEVER rethrows (Pitfall 10 fire-and-forget).
  9. `git diff --stat` shows exactly 1 file added.
  10. `npx tsc --noEmit` clean.
  11. `npm run build` clean.
- **acceptance_criteria:**
  - `test -f components/analytics/actions.ts` returns 0
  - `grep -c '^"use server";' components/analytics/actions.ts` returns 1
  - `grep -c "from \"next/headers\"" components/analytics/actions.ts` returns 1
  - `grep -c "export async function trackViewContent" components/analytics/actions.ts` returns 1
  - `grep -c "export async function trackAddToCart" components/analytics/actions.ts` returns 1
  - `grep -c "export async function trackInitiateCheckout" components/analytics/actions.ts` returns 1
  - `grep -c "x-forwarded-for" components/analytics/actions.ts` returns 1
  - `grep -c "user-agent" components/analytics/actions.ts` returns 1
  - `grep -c "validateEventSourceUrl" components/analytics/actions.ts` returns ≥ 2 (defined + used)
  - `grep -c "validateFbpFbc" components/analytics/actions.ts` returns ≥ 2
  - `grep -c "DO NOT rethrow\|fire-and-forget" components/analytics/actions.ts` returns ≥ 1 (Pitfall 10 documented inline)
  - `grep -v '^//\|^ *\*' components/analytics/actions.ts | grep -c "throw" | head -1` returns ≤ 3 (validators throw on invalid input; catch swallows the rest)
  - `npx tsc --noEmit` exits 0
  - `npm run build` exits 0
- **Commit message format:** `feat(analytics): server actions for ViewContent, AddToCart, InitiateCheckout CAPI fires`

---

### 09-07 — Wire ViewContent on PDPs (ViewContentTracker client child + 3 PDP mounts)

- **Goal:** Create `components/analytics/ViewContentTracker.tsx` — a client child that fires dual-fire ViewContent on mount with a shared event_id from `generateEventId()`. Mount it in each of the 3 PDP server components (`/shmo-review/cr-80`, `/l-sign`, `/square-card`), passing `productId` (Shopify product GID), `defaultVariantId`, `price` (default variant price as number), and `handle`. Sources content_ids from `product.id` (product GID — Best practice consensus per RESEARCH.md A2, may revise post-Shopify Purchase inspection). Manual gate: Events Manager Test Events tab shows ViewContent as `Server + Browser` on each of 3 PDPs.
- **Type:** `auto` → UI dispatch via `design-system-builder` (`.tsx` work on the tracker + 3 PDP pages) per `.claude/rules/subagent-dispatch.md`. The tracker renders null but is still a `.tsx` file, and the 3 PDP page edits are server-component plumbing in `.tsx` files — both routed through the builder.
- **read_first:**
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-RESEARCH.md` § Pattern 5 (PDP ViewContent fire from a client child) + § Code Examples (ViewContent on PDP) + § Pitfall 7 (fbp not yet available — accepted) + § Pitfall 3 (PascalCase) + Assumption A2 (productId vs variantId)
  - `app/shmo-review/cr-80/page.tsx` (current Phase 8 server component — confirm `product.id`, `product.variants.nodes[0].id`, `product.priceRange.minVariantPrice.amount` shape)
  - `app/shmo-review/l-sign/page.tsx` (same)
  - `app/shmo-review/square-card/page.tsx` (same)
  - `lib/analytics/event-id.ts` (just-created — `generateEventId` import)
  - `lib/analytics/fbq.ts` (just-created — `trackPixelEvent` import)
  - `components/analytics/actions.ts` (just-created — `trackViewContent` import)
- **Files touched:**
  - `components/analytics/ViewContentTracker.tsx` (NEW)
  - `app/shmo-review/cr-80/page.tsx` (add ViewContentTracker mount + extract default variant props)
  - `app/shmo-review/l-sign/page.tsx` (same)
  - `app/shmo-review/square-card/page.tsx` (same)
- **Requirement IDs:** PH9-VIEW-CONTENT, PH9-NO-REGRESSION
- **UI dispatch prompt anchor (via `design-system-builder` agent):**

  > "Create `components/analytics/ViewContentTracker.tsx` — a client child component that fires dual-fire ViewContent on mount (browser fbq + server CAPI, shared event_id). Mount it in all 3 PDP server components.
  >
  > **Design-system context:** The tracker renders `null` — invisible. The 3 PDP edits are DATA-WIRING ONLY, NO LAYOUT CHANGES. LAYOUT IS LOCKED — section order, classes, structural JSX all preserved. The only new JSX in each PDP is a single `<ViewContentTracker ... />` element inside `<main>`, conditionally rendered when the Shopify product is present.
  >
  > **File 1: `components/analytics/ViewContentTracker.tsx`** (full file):
  >
  > ```typescript
  > \"use client\";
  >
  > // ViewContent dual-fire tracker — mounted as a client child of PDP
  > // server components. Fires browser fbq + server CAPI on mount with
  > // a shared event_id (Meta's 48-hour dedup window matches by event_id
  > // + event_name + Pixel ID).
  > //
  > // Sources content_ids from product GID (Best practice consensus per
  > // RESEARCH.md A2 — may revise to variant GID if Shopify channel app's
  > // Purchase payload uses variant GIDs).
  > //
  > // fbp / fbc cookies read from document.cookie (non-httpOnly — written
  > // by fbevents.js). May be empty on first PDP visit (Pitfall 7) — that's
  > // acceptable; persist across navigation for second-visit Match Quality.
  >
  > import { useEffect, useRef } from \"react\";
  >
  > import { trackViewContent } from \"@/components/analytics/actions\";
  > import { generateEventId } from \"@/lib/analytics/event-id\";
  > import { trackPixelEvent } from \"@/lib/analytics/fbq\";
  >
  > type Props = {
  >   productId: string; // Shopify product GID
  >   defaultVariantId: string; // For Purchase-side alignment if we ever switch sources
  >   price: number; // Default variant price (number, not string)
  >   handle: string; // For event_source_url construction / debugging
  > };
  >
  > export default function ViewContentTracker({
  >   productId,
  >   price,
  >   handle,
  > }: Props) {
  >   const firedRef = useRef(false);
  >
  >   useEffect(() => {
  >     if (firedRef.current) return;
  >     firedRef.current = true;
  >
  >     const eventId = generateEventId();
  >     const params = {
  >       content_ids: [productId],
  >       content_type: \"product\" as const,
  >       value: price,
  >       currency: \"USD\" as const,
  >     };
  >
  >     // Browser fire — synchronous on a hot fbq queue (no-op if blocked).
  >     trackPixelEvent(\"ViewContent\", params, eventId);
  >
  >     // Server fire — fire-and-forget. Shared event_id dedupes against
  >     // the browser fire in Events Manager.
  >     trackViewContent({
  >       params,
  >       eventId,
  >       fbp: readCookie(\"_fbp\") ?? undefined,
  >       fbc: readCookie(\"_fbc\") ?? undefined,
  >       eventSourceUrl: window.location.href,
  >     }).catch(() => {
  >       // Server Action already swallows internally — extra catch is
  >       // defensive against React rejection-warning noise.
  >     });
  >   }, [productId, price, handle]);
  >
  >   return null;
  > }
  >
  > function readCookie(name: string): string | null {
  >   if (typeof document === \"undefined\") return null;
  >   const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  >   return m ? decodeURIComponent(m[1]) : null;
  > }
  > ```
  >
  > **File 2: `app/shmo-review/cr-80/page.tsx` edits** — surgical addition only:
  >
  > 1. Add import at the top of the imports block:
  >    ```typescript
  >    import ViewContentTracker from \"@/components/analytics/ViewContentTracker\";
  >    ```
  >
  > 2. Inside the async function body, AFTER the existing `const buyboxProps = ...` block and BEFORE the `return <main>`, add:
  >    ```typescript
  >    const defaultPrice = product?.priceRange?.minVariantPrice?.amount
  >      ? Number(product.priceRange.minVariantPrice.amount)
  >      : null;
  >    const defaultVariantId = product?.variants?.nodes?.[0]?.id ?? null;
  >    ```
  >
  > 3. Inside the `<main>` JSX, add the tracker as the LAST child (after `<FinalCta />`), conditionally rendered:
  >    ```tsx
  >    <main>
  >      <Buybox {...buyboxProps} nextBg=\"cream\" />
  >      <Proof />
  >      <CrewStrip nextBg=\"cream\" afterGrid={<ProofTiles />} />
  >      <HowItWorks />
  >      <FormatCompare currentHandle=\"google-reviews-nfc-tap-card-cr80\" />
  >      <VideoTestimonials bg=\"cream\" nextBg=\"ember\" />
  >      <FinalCta />
  >      {product && defaultPrice !== null && defaultVariantId && (
  >        <ViewContentTracker
  >          productId={product.id}
  >          defaultVariantId={defaultVariantId}
  >          price={defaultPrice}
  >          handle=\"google-reviews-nfc-tap-card-cr80\"
  >        />
  >      )}
  >    </main>
  >    ```
  >
  > **File 3: `app/shmo-review/l-sign/page.tsx`** — same 3 changes, with `handle=\"google-review-nfc-tap-card-l-sign\"`.
  >
  > **File 4: `app/shmo-review/square-card/page.tsx`** — same 3 changes, with `handle=\"google-review-plaque\"`.
  >
  > LAYOUT IS LOCKED. Do NOT:
  > - Reorder sections or change class names.
  > - Modify Buybox, Proof, HowItWorks, FormatCompare, VideoTestimonials, FinalCta, ProofMarquee, CrewStrip.
  > - Move existing imports.
  > - Change metadata.
  > - Change ariaLabel, currentHandle, or any other prop.
  > - Render `<ViewContentTracker />` unconditionally — guards against Shopify-outage null product.
  > - Mount `<ViewContentTracker />` outside `<main>`.
  > - Add Admin API references.
  > - Write to `.env*`."

- **Verification steps:**
  1. `components/analytics/ViewContentTracker.tsx` exists with `"use client"` on line 1.
  2. Tracker imports `trackViewContent`, `generateEventId`, `trackPixelEvent`.
  3. Tracker uses `useRef` to fire EXACTLY once per mount (idempotent).
  4. Tracker calls BOTH `trackPixelEvent("ViewContent", ...)` AND `trackViewContent(...)` with shared `eventId`.
  5. Tracker reads `_fbp` and `_fbc` from `document.cookie` (not `headers()`).
  6. Tracker returns `null`.
  7. All 3 PDP pages import `ViewContentTracker`.
  8. All 3 PDP pages compute `defaultPrice` and `defaultVariantId` from `product` data.
  9. All 3 PDP pages render `<ViewContentTracker>` conditionally inside `<main>`, AFTER existing sections.
  10. `grep -n "Buybox\|Proof\|CrewStrip\|HowItWorks\|FormatCompare\|VideoTestimonials\|FinalCta" app/shmo-review/cr-80/page.tsx` returns the SAME lines as Phase 8 (no section reorder).
  11. `git diff --stat` shows exactly 4 files modified (1 new + 3 PDPs edited).
  12. `npx tsc --noEmit` clean.
  13. Browser smoke (dev with `FB_TEST_EVENT_CODE` set): visit `/shmo-review/cr-80` → DevTools Console → no errors → Network tab shows POST to `graph.facebook.com/v25.0/.../events`.
  14. Events Manager Test Events tab: ViewContent appears as `Server + Browser` within ~30s.
  15. Same smoke on `/shmo-review/l-sign` and `/shmo-review/square-card`.
  16. `design-system-auditor` PASS — LAYOUT IS LOCKED verified.
  17. `live-store-guard` SAFE.
- **acceptance_criteria:**
  - `test -f components/analytics/ViewContentTracker.tsx` returns 0
  - `grep -c '^"use client";' components/analytics/ViewContentTracker.tsx` returns 1
  - `grep -c "useEffect\|useRef" components/analytics/ViewContentTracker.tsx` returns ≥ 2
  - `grep -c "trackPixelEvent(\"ViewContent\"" components/analytics/ViewContentTracker.tsx` returns 1
  - `grep -c "trackViewContent(" components/analytics/ViewContentTracker.tsx` returns 1
  - `grep -c "generateEventId" components/analytics/ViewContentTracker.tsx` returns 1
  - `grep -c "firedRef.current" components/analytics/ViewContentTracker.tsx` returns ≥ 2 (idempotency guard)
  - `grep -c "return null" components/analytics/ViewContentTracker.tsx` returns 1
  - `grep -c "ViewContentTracker" app/shmo-review/cr-80/page.tsx` returns ≥ 2 (import + usage)
  - `grep -c "ViewContentTracker" app/shmo-review/l-sign/page.tsx` returns ≥ 2
  - `grep -c "ViewContentTracker" app/shmo-review/square-card/page.tsx` returns ≥ 2
  - `grep -c "defaultPrice\|defaultVariantId" app/shmo-review/cr-80/page.tsx` returns ≥ 2
  - `grep -c "google-reviews-nfc-tap-card-cr80" app/shmo-review/cr-80/page.tsx` returns ≥ 2 (existing getProductByHandle + new tracker handle prop)
  - `grep -c "google-review-nfc-tap-card-l-sign" app/shmo-review/l-sign/page.tsx` returns ≥ 2
  - `grep -c "google-review-plaque" app/shmo-review/square-card/page.tsx` returns ≥ 2
  - `npx tsc --noEmit` exits 0
  - `npm run build` exits 0
- **Commit message format:** `feat(analytics): wire ViewContent dual-fire on 3 PDPs via ViewContentTracker`

---

### 09-08 — Wire AddToCart in Buybox.handleAdd (dual-fire after addLineToCart success)

- **Goal:** Add dual-fire AddToCart to `components/shmo-review/Buybox.tsx` `handleAdd` (around line 156). After `addLineToCart` succeeds, before `openCart()`, generate one event_id and fire BOTH `trackPixelEvent("AddToCart", ...)` (browser) AND `trackAddToCart({ params, eventId, ... })` (server). Both fire-and-forget — never block the ATC button (UX rule). Payload: `content_ids: [variantId]`, `content_type: "product"`, `contents: [{ id: variantId, quantity: qty }]`, `value: pack.price * qty` rounded to 2 decimals, `currency: "USD"`. Pass `fbp` + `fbc` cookies from `document.cookie`. Surface NO errors to user (Pitfall 10 + security T-09-04 — generic only). Manual gate: Events Manager confirms AddToCart Server+Browser dedup.
- **Type:** `auto` → UI dispatch via `design-system-builder` (`.tsx` work on Buybox) per `.claude/rules/subagent-dispatch.md`. Polish-style task — LAYOUT IS LOCKED, only `handleAdd` body changes.
- **read_first:**
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-RESEARCH.md` § Pattern 2 (Dual-fire from a client call site — exact Buybox.handleAdd code snippet) + § Pitfall 10 (navigation race — DO NOT await before user-action completion) + § Architectural Responsibility Map (Browser fires Pixel, Server Action fires CAPI)
  - `components/shmo-review/Buybox.tsx` (Phase 8 handleAdd at line 156 — confirm `pack.variantId`, `qty`, `pack.price` access; confirm imports `useState`, `addLineToCart`, `mapShopifyCartLines`, `useCartStore`, `openCart` already exist)
  - `lib/analytics/event-id.ts`, `lib/analytics/fbq.ts`, `components/analytics/actions.ts` (the imports the dual-fire needs)
- **Files touched:**
  - `components/shmo-review/Buybox.tsx` (extend `handleAdd` with dual-fire — surgical, no other changes)
- **Requirement IDs:** PH9-ADD-TO-CART, PH9-NO-REGRESSION
- **UI dispatch prompt anchor (via `design-system-builder` agent):**

  > "Extend `components/shmo-review/Buybox.tsx` `handleAdd` with a dual-fire AddToCart Meta Pixel + CAPI call. This is a POLISH task — LAYOUT IS LOCKED, no class changes, no JSX changes, no structural HTML changes. The ONLY edits are inside the `handleAdd` function body and at the imports block.
  >
  > **Design-system context:** No visual changes. The ATC button, its loading state, its error state, the cart drawer trigger — ALL identical to Phase 8 behavior. We're adding fire-and-forget analytics calls in the success path; the user-visible flow does not change.
  >
  > **Required edits to `components/shmo-review/Buybox.tsx`:**
  >
  > 1. **Add imports** (top of file, after existing imports — preserve existing imports):
  >    ```typescript
  >    import { trackAddToCart } from \"@/components/analytics/actions\";
  >    import { generateEventId } from \"@/lib/analytics/event-id\";
  >    import { trackPixelEvent } from \"@/lib/analytics/fbq\";
  >    ```
  >
  > 2. **Add cookie reader helper** at the BOTTOM of the file (after the default export — file-local utility):
  >    ```typescript
  >    function readCookie(name: string): string | null {
  >      if (typeof document === \"undefined\") return null;
  >      const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  >      return m ? decodeURIComponent(m[1]) : null;
  >    }
  >    ```
  >
  > 3. **Extend `handleAdd`** — inside the existing try block, AFTER the `useCartStore.getState().setCart(cart.id, cart.checkoutUrl, lines);` line and BEFORE `openCart();`:
  >    ```typescript
  >    // --- Phase 9 instrumentation: dual-fire AddToCart ---
  >    const atcEventId = generateEventId();
  >    const atcValue = Number((pack.price * qty).toFixed(2));
  >    const atcParams = {
  >      content_ids: [variantId],
  >      content_type: \"product\" as const,
  >      contents: [{ id: variantId, quantity: qty }],
  >      value: atcValue,
  >      currency: \"USD\" as const,
  >    };
  >    // Browser fire — fire-and-forget; do not block UI on fbq queue state.
  >    trackPixelEvent(\"AddToCart\", atcParams, atcEventId);
  >    // Server fire — fire-and-forget; do not block on Meta network latency.
  >    // Errors are swallowed inside the Server Action (Phase 9 T-09-04).
  >    trackAddToCart({
  >      params: atcParams,
  >      eventId: atcEventId,
  >      fbp: readCookie(\"_fbp\") ?? undefined,
  >      fbc: readCookie(\"_fbc\") ?? undefined,
  >      eventSourceUrl: window.location.href,
  >    }).catch(() => {
  >      // Defensive — Server Action already swallows internally.
  >    });
  >    // --- end Phase 9 instrumentation ---
  >    ```
  >
  > LAYOUT IS LOCKED. Do NOT:
  > - Change the ATC button JSX, its label, its disabled prop, its className.
  > - Change the existing `setAdding`, `setAddError`, `addLineToCart`, `setCart`, `openCart` calls.
  > - Move or reorder the existing handleAdd lines.
  > - Add the dual-fire INSIDE the catch block (only fires on success — D-04 semantics).
  > - Add the dual-fire BEFORE `addLineToCart` succeeds.
  > - Surface a CAPI error to the user (generic-error rule — Phase 8 precedent).
  > - Modify any other component file.
  > - Add a `useEffect` for analytics (the fire is action-triggered, not mount-triggered).
  > - Touch the `BuyboxPack` type, `DEFAULT_BUYBOX_*` constants, or any other export."

- **Verification steps:**
  1. `components/shmo-review/Buybox.tsx` imports `trackAddToCart`, `generateEventId`, `trackPixelEvent`.
  2. `handleAdd` calls BOTH `trackPixelEvent("AddToCart", ...)` AND `trackAddToCart(...)` with a shared `atcEventId`.
  3. The dual-fire is INSIDE the try block, AFTER `setCart(...)`, BEFORE `openCart()`.
  4. The dual-fire is NEVER awaited — both calls are fire-and-forget.
  5. `trackAddToCart(...).catch(() => {})` defensive — Pitfall 10 fire-and-forget.
  6. `readCookie` helper added at the bottom of the file — file-local.
  7. Payload: `content_ids: [variantId]`, `value: pack.price * qty` rounded to 2 decimals, `currency: "USD"`.
  8. `git diff --stat` shows exactly 1 file modified.
  9. `npx tsc --noEmit` clean.
  10. Browser smoke (dev with `FB_TEST_EVENT_CODE` set): visit `/shmo-review/cr-80` → click ATC → Network tab shows POST to `graph.facebook.com/v25.0/.../events`. Cart drawer opens normally.
  11. Events Manager Test Events tab: AddToCart appears as `Server + Browser` within ~30s.
  12. No regression: cart line renders correctly, discount code still applies, generic error still surfaces on `addLineToCart` failure.
  13. `design-system-auditor` PASS — LAYOUT IS LOCKED verified (no JSX changes, no class changes).
  14. `live-store-guard` SAFE.
- **acceptance_criteria:**
  - `grep -c "trackAddToCart" components/shmo-review/Buybox.tsx` returns ≥ 2 (import + call)
  - `grep -c "trackPixelEvent" components/shmo-review/Buybox.tsx` returns ≥ 2
  - `grep -c "generateEventId" components/shmo-review/Buybox.tsx` returns ≥ 2
  - `grep -c "atcEventId" components/shmo-review/Buybox.tsx` returns ≥ 3 (defined + 2 uses)
  - `grep -c "function readCookie" components/shmo-review/Buybox.tsx` returns 1
  - `grep -c "Phase 9 instrumentation" components/shmo-review/Buybox.tsx` returns ≥ 1
  - `grep -c "addLineToCart" components/shmo-review/Buybox.tsx` returns ≥ 2 (existing Phase 8 wire intact)
  - `grep -c "openCart()" components/shmo-review/Buybox.tsx` returns ≥ 1 (existing call intact)
  - `grep -c "TODO(shopify)" components/shmo-review/Buybox.tsx` returns 0 (no new TODOs)
  - `grep -c "local-\\$" components/shmo-review/Buybox.tsx` returns 0 (Phase 8 fake-line removal stays gone)
  - `npx tsc --noEmit` exits 0
  - `npm run build` exits 0
- **Commit message format:** `feat(analytics): dual-fire AddToCart in Buybox.handleAdd`

---

### 09-09 — Wire InitiateCheckout in CartCheckoutButton.handleClick (dual-fire BEFORE redirect) + Events Manager smoke

- **Goal:** Add dual-fire InitiateCheckout to `components/cart/CartCheckoutButton.tsx` `handleClick`. Fire BOTH `trackPixelEvent("InitiateCheckout", ...)` (browser — sendBeacon under the hood survives navigation) AND `trackInitiateCheckout({...})` (server — fire-and-forget, server completes independent of tab navigation per Pitfall 10) BEFORE the `assertCheckoutUrl` + `window.location.href` redirect. Payload sources cart subtotal + content_ids[] from the Zustand cart store. Then run the FULL Events Manager smoke check — confirm all 3 site events appear as `Server + Browser` and Shopify channel app fires Purchase from a test transaction. Document everything in `09-09-events-manager-NOTES.md` with a screenshot of Events Manager.
- **Type:** `auto` → UI dispatch via `design-system-builder` for the Buybox-style polish task (`.tsx` in `components/cart/`). Manual smoke runs AFTER the dispatch completes.
- **read_first:**
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-RESEARCH.md` § Pitfall 10 (navigation race — fire BEFORE redirect, never await) + § Pattern 2 (dual-fire pattern) + § Code Examples (InitiateCheckout)
  - `components/cart/CartCheckoutButton.tsx` (current full file — confirm `handleClick` at line 45, `useTransition` pattern, `assertCheckoutUrl` call at line 58, redirect at line 64)
  - `components/cart/store.ts` (Zustand store — confirm `useCartStore` selector shape for `lines` and `discountCodes` to derive content_ids + subtotal)
  - `lib/analytics/event-id.ts`, `lib/analytics/fbq.ts`, `components/analytics/actions.ts`
- **Files touched:**
  - `components/cart/CartCheckoutButton.tsx` (extend `handleClick` with dual-fire)
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-09-events-manager-NOTES.md` (NEW — manual smoke results)
  - `pictures/screenshots/phase-09-events-manager-test-events.png` (NEW — Events Manager screenshot)
- **Requirement IDs:** PH9-INITIATE-CHECKOUT, PH9-EVENTS-MANAGER-SMOKE, PH9-NO-PURCHASE-FIRE, PH9-NO-REGRESSION
- **UI dispatch prompt anchor (via `design-system-builder` agent):**

  > "Extend `components/cart/CartCheckoutButton.tsx` `handleClick` with a dual-fire InitiateCheckout Meta Pixel + CAPI call. POLISH task — LAYOUT IS LOCKED. Only `handleClick` body + imports change. The button JSX, label logic, error state, and disabled state are ALL identical to Phase 8.
  >
  > **Critical timing — Pitfall 10:** The CAPI Server Action MUST be invoked BEFORE the `await assertCheckoutUrl(...)` resolves the redirect URL. We do NOT await `trackInitiateCheckout` — it's fire-and-forget. The browser fbq fire is ALSO synchronous via the queue (fbevents.js uses sendBeacon under the hood — beacons survive navigation tear-down).
  >
  > **Required edits to `components/cart/CartCheckoutButton.tsx`:**
  >
  > 1. **Add imports** (after existing imports at line 22-24):
  >    ```typescript
  >    import { trackInitiateCheckout } from \"@/components/analytics/actions\";
  >    import { useCartStore } from \"@/components/cart/store\";
  >    import { generateEventId } from \"@/lib/analytics/event-id\";
  >    import { trackPixelEvent } from \"@/lib/analytics/fbq\";
  >    ```
  >
  > 2. **Add cookie reader helper** at the BOTTOM of the file (file-local utility):
  >    ```typescript
  >    function readCookie(name: string): string | null {
  >      if (typeof document === \"undefined\") return null;
  >      const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  >      return m ? decodeURIComponent(m[1]) : null;
  >    }
  >    ```
  >
  > 3. **Extend `handleClick`** — at the START of the handler body (BEFORE the existing guards), and again INSIDE startTransition BEFORE `await assertCheckoutUrl(...)`:
  >
  > Replace the current `handleClick` body. Original signature unchanged.
  >
  > ```typescript
  > const handleClick = () => {
  >   if (isNavigating || isError) return;
  >   if (!checkoutUrl) return;
  >
  >   // --- Phase 9 instrumentation: dual-fire InitiateCheckout ---
  >   // Fires BEFORE assertCheckoutUrl + redirect (Pitfall 10).
  >   // Both fires are fire-and-forget. Pixel uses sendBeacon under the hood
  >   // (survives navigation); Server Action runs server-side independent of
  >   // tab navigation (request keeps processing even if tab unloads).
  >   const cartState = useCartStore.getState();
  >   const icoEventId = generateEventId();
  >   const icoContentIds = cartState.lines.map((line) => line.variantId);
  >   const icoContents = cartState.lines.map((line) => ({
  >     id: line.variantId,
  >     quantity: line.quantity,
  >   }));
  >   const icoValue = Number(
  >     cartState.lines
  >       .reduce((sum, line) => sum + line.price * line.quantity, 0)
  >       .toFixed(2),
  >   );
  >   const icoParams = {
  >     content_ids: icoContentIds,
  >     content_type: \"product\" as const,
  >     contents: icoContents,
  >     value: icoValue,
  >     currency: \"USD\" as const,
  >   };
  >   trackPixelEvent(\"InitiateCheckout\", icoParams, icoEventId);
  >   trackInitiateCheckout({
  >     params: icoParams,
  >     eventId: icoEventId,
  >     fbp: readCookie(\"_fbp\") ?? undefined,
  >     fbc: readCookie(\"_fbc\") ?? undefined,
  >     eventSourceUrl:
  >       typeof window !== \"undefined\" ? window.location.href : \"\",
  >   }).catch(() => {
  >     // Defensive — Server Action already swallows.
  >   });
  >   // --- end Phase 9 instrumentation ---
  >
  >   setIsNavigating(true);
  >
  >   startTransition(async () => {
  >     try {
  >       const safeUrl = await assertCheckoutUrl(checkoutUrl);
  >       if (typeof window !== \"undefined\") {
  >         window.location.href = safeUrl;
  >       }
  >     } catch (e) {
  >       if (typeof console !== \"undefined\") {
  >         // eslint-disable-next-line no-console
  >         console.error(\"[checkout] guard rejected redirect\", e);
  >       }
  >       setIsError(true);
  >       setIsNavigating(false);
  >     }
  >   });
  > };
  > ```
  >
  > **IMPORTANT — line.variantId access:** Confirm `useCartStore`'s `lines` array entries have `variantId`, `quantity`, and `price` fields. If the actual store shape differs (e.g., `lines[].merchandise.id` or `lines[].quantity`), adapt the field access — but DO NOT change the store shape itself. Read `components/cart/store.ts` + `components/cart/types.ts` first.
  >
  > LAYOUT IS LOCKED. Do NOT:
  > - Change the `<button>` JSX, className, label logic, disabled prop, aria-disabled, or data-testid.
  > - Change `useTransition`, `setIsNavigating`, `setIsError` semantics.
  > - Move the `await assertCheckoutUrl(...)` call — its position relative to the redirect MUST be unchanged.
  > - Fire the dual-fire INSIDE startTransition's try block — it MUST happen BEFORE startTransition (Pitfall 10: the server action gets dispatched before the browser commits to navigating).
  > - AWAIT `trackInitiateCheckout(...)` — fire-and-forget only.
  > - Touch any other component file.
  > - Touch `components/cart/store.ts` (read-only inspection).
  > - Touch `actions.ts` `assertCheckoutUrl` (unchanged)."

  After the UI builder completes, run the manual smoke checklist:

  **Manual smoke — Events Manager + per-event verification:**

  1. Confirm `FB_TEST_EVENT_CODE` is set in `.env.local` (from 09-01 Task 6).
  2. Run `npm run dev` on localhost.
  3. Open Meta Business Manager → Events Manager → [Phase 9 Pixel] → Test Events tab. Keep this tab visible.
  4. In a separate browser tab/window, visit `http://localhost:3000/shmo-review/cr-80`.
     - Within ~30s: Events Manager Test Events tab shows `PageView` (Browser only — we don't fire PageView CAPI).
     - Within ~30s: Events Manager shows `ViewContent` with badge `Server + Browser` (deduped — single row, both source labels).
  5. Click the 10-pack ATC. Cart drawer opens.
     - Events Manager shows `AddToCart` as `Server + Browser`.
  6. Click the cart's "Tap to checkout — $X" button. Browser navigates to `shop.shmocard.com` checkout.
     - Events Manager shows `InitiateCheckout` as `Server + Browser` BEFORE the navigation completes.
  7. Repeat steps 4-6 on `/shmo-review/l-sign` and `/shmo-review/square-card`.
  8. On checkout (Shopify-hosted), do NOT enter payment details. Take a screenshot of Events Manager Test Events tab showing all events. Save to `pictures/screenshots/phase-09-events-manager-test-events.png`.
  9. Verify Pixel ID parity in Events Manager — each event's "Source Pixel" should be the SAME ID across all events (T-09-08 Pitfall 8).
  10. Run `grep -rn "Purchase" components/ lib/ app/ | grep -v "node_modules\|\.next" | grep -v "// \|/\*\|MetaEvent"` — confirm ZERO matches (D-04 — Purchase NEVER fires from our code).
  11. Document everything in `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-09-events-manager-NOTES.md` with per-event Server/Browser confirmation table, screenshot path, and any anomalies.

- **Verification steps:**
  1. `components/cart/CartCheckoutButton.tsx` imports `trackInitiateCheckout`, `generateEventId`, `trackPixelEvent`, `useCartStore`.
  2. `handleClick` body fires `trackPixelEvent("InitiateCheckout", ...)` and `trackInitiateCheckout(...)` BEFORE `setIsNavigating(true)` and `startTransition`.
  3. Both fires share the same `icoEventId` from `generateEventId()`.
  4. `trackInitiateCheckout(...)` is NEVER awaited (fire-and-forget — Pitfall 10).
  5. `assertCheckoutUrl` call position and surrounding error handling unchanged from Phase 8.
  6. `git diff --stat` shows exactly 1 code file modified (`CartCheckoutButton.tsx`) + 1 notes file added + 1 screenshot added.
  7. `npx tsc --noEmit` clean.
  8. `npm run build` clean.
  9. Manual smoke passes — Events Manager Test Events tab shows all 3 site events as `Server + Browser` on each of 3 PDPs.
  10. Screenshot saved to `pictures/screenshots/phase-09-events-manager-test-events.png`.
  11. Notes file documents per-event Server/Browser confirmation + Pixel ID parity + Purchase-not-fired check.
  12. `grep -rn "Purchase" components/ lib/ app/` returns ZERO matches outside type definitions / comments.
  13. `design-system-auditor` PASS — LAYOUT IS LOCKED verified on CartCheckoutButton.
  14. `live-store-guard` SAFE.
- **acceptance_criteria:**
  - `grep -c "trackInitiateCheckout" components/cart/CartCheckoutButton.tsx` returns ≥ 2 (import + call)
  - `grep -c "trackPixelEvent" components/cart/CartCheckoutButton.tsx` returns ≥ 2
  - `grep -c "generateEventId" components/cart/CartCheckoutButton.tsx` returns ≥ 2
  - `grep -c "useCartStore" components/cart/CartCheckoutButton.tsx` returns ≥ 2
  - `grep -c "icoEventId" components/cart/CartCheckoutButton.tsx` returns ≥ 3
  - `grep -c "Phase 9 instrumentation" components/cart/CartCheckoutButton.tsx` returns ≥ 1
  - `grep -c "assertCheckoutUrl" components/cart/CartCheckoutButton.tsx` returns ≥ 1 (existing call preserved)
  - `grep -c "window.location.href = safeUrl" components/cart/CartCheckoutButton.tsx` returns 1 (existing redirect preserved)
  - `grep -c "fire-and-forget\|Pitfall 10" components/cart/CartCheckoutButton.tsx` returns ≥ 1
  - `grep -c "await trackInitiateCheckout\|return trackInitiateCheckout" components/cart/CartCheckoutButton.tsx` returns 0 (must NOT await)
  - `test -f .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-09-events-manager-NOTES.md` returns 0
  - `test -f pictures/screenshots/phase-09-events-manager-test-events.png` returns 0
  - `grep -c "Server + Browser" .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-09-events-manager-NOTES.md` returns ≥ 3 (one per site event)
  - `grep -c "Pixel ID parity" .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-09-events-manager-NOTES.md` returns ≥ 1
  - `grep -c "Purchase NOT fired from site" .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-09-events-manager-NOTES.md` returns ≥ 1
  - `grep -rn "Purchase" components/ lib/ app/ 2>/dev/null | grep -v '^.*://\|^.*//\|MetaEvent\|node_modules\|\.next' | wc -l | awk '{print ($1 == 0)}'` returns 1 (no Purchase fire in code)
  - `npx tsc --noEmit` exits 0
  - `npm run build` exits 0
- **Commit message format:** `feat(analytics): dual-fire InitiateCheckout in CartCheckoutButton + events manager smoke`

---

### 09-10 — Phase close-out

- **Goal:** Final sweep. `tsc` + `npm run build` clean. Update STATE / ROADMAP / handoff / scope. Write SUMMARY. Phase 9 closed. Recommend Phase 10 (launch readiness — env vars to Vercel, DNS cutover).
- **Type:** `checkpoint:human-verify` (close-out — Jordan signs off)
- **read_first:**
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-09-events-manager-NOTES.md` (verify all gates passed)
  - `.planning/STATE.md` (current state — to write the Phase 9 close note)
  - `.planning/ROADMAP.md` (Phase 9 entry — to mark complete + Phase 10 setup)
  - `context/general/handoff.md` (last session summary format — mirror it)
  - `context/general/scope.md` (live punch list — Phase 9 → done, Phase 10 → next)
  - `.planning/phases/08-shopify-storefront-wiring/08-SUMMARY.md` (precedent for SUMMARY file structure)
- **Files touched:**
  - `.planning/STATE.md` (Phase 9 complete)
  - `.planning/ROADMAP.md` (mark Phase 9 `[x] complete` + completion date)
  - `context/general/handoff.md` (Phase 9 close summary)
  - `context/general/scope.md` (punch-list — Phase 9 done, Phase 10 ready)
  - `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-SUMMARY.md` (NEW — phase close)
- **Requirement IDs:** PH9-TSC, PH9-BUILD, PH9-NO-REGRESSION
- **Verification steps:**
  1. `npx tsc --noEmit` clean.
  2. `npm run build` clean — all routes build successfully.
  3. Dev server smoke: `/`, `/shmo-review`, `/shmo-review/cr-80`, `/shmo-review/l-sign`, `/shmo-review/square-card` all load without console errors.
  4. `window.fbq` is a function on every page.
  5. Phase 8 regressions check — add to cart, discount code, checkout all still work.
  6. `09-09-events-manager-NOTES.md` confirms all 3 events as `Server + Browser`.
  7. Update `.planning/STATE.md` → "Phase 9 complete. Meta Pixel + CAPI dual-fire wired for ViewContent + AddToCart + InitiateCheckout. GHL configured Admin-side per D-05. Purchase owned by Shopify channel app on shop.shmocard.com per D-04. Phase 10 (launch readiness — Vercel env + DNS cutover) ready."
  8. Update `.planning/ROADMAP.md` → mark Phase 9 `[x] complete`, add completion date.
  9. Update `context/general/handoff.md` with Phase 9 close summary.
  10. Update `context/general/scope.md` punch-list — Phase 9 → done; Phase 10 → ready (gated on full design approval per MEMORY rule).
  11. Write `.planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-SUMMARY.md` with: what shipped (analytics module, PixelLoader, ViewContentTracker, 3 dual-fire integrations, Events Manager smoke verified), what didn't ship (cookie consent banner — deferred, AddPaymentInfo / Lead custom events — deferred per D-07, fbp/fbc cart attribute passthrough — deferred per RESEARCH.md OQ #1), atomic plan status table (09-01 through 09-10 with commit hashes), exit criteria check.
- **acceptance_criteria:**
  - `npx tsc --noEmit` exits 0
  - `npm run build` exits 0
  - `grep -c "Phase 9 complete" .planning/STATE.md` returns ≥ 1
  - `grep -c "\\[x\\] \\*\\*Phase 9" .planning/ROADMAP.md` returns ≥ 1
  - `test -f .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-SUMMARY.md` returns 0
  - `grep -c "Exit criteria" .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-SUMMARY.md` returns ≥ 1
  - `grep -c "ViewContent\|AddToCart\|InitiateCheckout" .planning/phases/09-tracking-ghl-webhook-facebook-pixel/09-SUMMARY.md` returns ≥ 3
- **Checkpoint:** Jordan confirms phase exit criteria pass. Phase 9 closed. Recommend `/gsd-plan-phase 10`.
- **Commit message format:** `chore(phase-9): close out Tracking — GHL webhook + Facebook Pixel phase`

---

## Open decisions

Locked decisions from CONTEXT.md (2026-05-21) — non-negotiable:

1. ✅ **D-01 — Split-domain Pixel architecture** — LOCKED. Same Pixel ID on `shmocard.com` (our code) and `shop.shmocard.com` (Shopify channel app). 09-01 admin gate verifies parity.
2. ✅ **D-02 — Dual-fire (browser Pixel + server CAPI)** with shared event_id — LOCKED. 09-07/08/09 implement.
3. ✅ **D-03 — Site fires InitiateCheckout** before redirect — LOCKED. 09-09 implements. Shopify channel app also fires InitiateCheckout from checkout page (different event_id; both count).
4. ✅ **D-04 — Purchase NEVER fires from our code** — LOCKED. Shopify channel app owns it. 09-09 smoke verifies our code grep returns ZERO Purchase matches.
5. ✅ **D-05 — GHL via Shopify Admin webhook, zero site code** — LOCKED. 09-01 Task 9 configures Admin-side.
6. ✅ **D-06 — No site-side `/api/ghl-*` route** — LOCKED. Phase 9 builds nothing for GHL signal.
7. ✅ **D-07 — 4 standard events only (no custom)** — LOCKED. AddPaymentInfo, Lead, etc. deferred per CONTEXT.md Deferred Ideas.
8. ✅ **D-08 — UUIDv4 event_id, no deterministic derivation** — LOCKED. `crypto.randomUUID()` in `lib/analytics/event-id.ts`.
9. ✅ **D-09 — FB_TEST_EVENT_CODE in `.env.local` only, never Vercel production** — LOCKED. 09-01 Task 8 + 09-02 docs warning + 09-03 conditional payload field.
10. ✅ **D-10 — Verification = Events Manager Test Events tab shows all 3 events as Server + Browser** — LOCKED. 09-09 manual smoke gate.
11. ✅ **D-11 — 3 new env vars** — LOCKED. 09-02 docs them; 09-01 Jordan pastes them.

Discretion items resolved during planning (researcher recommendations adopted):

12. **Pixel script-loading strategy** — `next/script` with `strategy="afterInteractive"` (RESEARCH.md Pattern 1). Locked in 09-05.
13. **Server Action shape** — Three dedicated functions (`trackViewContent`, `trackAddToCart`, `trackInitiateCheckout`) sharing an internal `fireMetaEvent` helper. Locked in 09-06.
14. **`<PixelLoader>` mount location** — Root layout (`app/layout.tsx`), sibling of `<ModalRoot />`. Locked in 09-05.
15. **CAPI user_data fields** — `client_ip_address` + `client_user_agent` (from headers), `fbp` + `fbc` (from cookies, forwarded by client). No `em`/`ph` in Phase 9 (no PII captured pre-checkout per RESEARCH.md Pattern 5).
16. **fbp/fbc cart attribute passthrough to Shopify** — DEFERRED (RESEARCH.md OQ #1, CONTEXT.md Specifics). Evaluate post-Phase 9 if Match Quality scores show issues.
17. **content_ids: product GID for ViewContent, variant GID for AddToCart + InitiateCheckout** — Locked per RESEARCH.md Assumption A2. May revise if Shopify channel app's Purchase payload uses variant GIDs; surface as Phase 9.1 polish if needed.

---

## Risks

1. **09-01 admin gate fails — Jordan can't access Meta Business Manager.** Mitigation: Phase 9 cannot ship without Pixel ID + CAPI token. Surface to Jordan immediately if blocked; consider a deferred Phase 9.5 once access is sorted.
2. **Pixel ID mismatch between Shopify channel app and `NEXT_PUBLIC_FB_PIXEL_ID`.** Mitigation: 09-01 Task 4 is the explicit gate. RESEARCH.md Pitfall 8.
3. **`FB_TEST_EVENT_CODE` leaks to Vercel production env.** Mitigation: `backend.md` documents "DO NOT SET IN VERCEL PRODUCTION" (09-02). 09-03 `metaFetch` only includes `test_event_code` when env var is non-empty — omitting from Vercel is the simplest mitigation. Phase 10 launch checklist re-verifies.
4. **Meta CAPI errors echo to client — phishing surface.** Mitigation: 09-03 `metaFetch` throws generic `"meta-capi: send failed"`. 09-06 `fireMetaEvent` catches AND swallows. Browser never sees Meta error body.
5. **PageView fires twice — duplicate in Events Manager.** Mitigation: 09-05 explicitly NO `useEffect`-driven PageView. The Pixel init snippet handles initial PageView. Pitfall 1.
6. **event_id mismatch between Pixel browser fire (`eventID` camelCase) and CAPI server fire (`event_id` snake_case).** Mitigation: 09-04 `trackPixelEvent` writes `{ eventID: eventId }`; 09-03 `metaFetch` writes `event_id: input.eventId`. Centralized helpers prevent inline drift. Pitfall 2.
7. **Standard event name typo (`addtocart` vs `AddToCart`).** Mitigation: 09-03 `MetaEventName` union rejects typos at compile time. Pitfall 3.
8. **InitiateCheckout drops because of navigation race.** Mitigation: 09-09 fires Pixel + Server Action BEFORE `setIsNavigating(true)` and `startTransition`. Server Action is fire-and-forget — server completes independent of tab. Browser fbq uses sendBeacon under the hood. Pitfall 10.
9. **fbp cookie not available on first PDP visit.** Mitigation: ACCEPTED. RESEARCH.md Pitfall 7. Persists across navigation — second-visit Match Quality recovers. If Match Quality scores show problems post-launch, add a 100-300ms delay in 09-07.
10. **Server Action `headers()` returns empty on dev — `client_ip_address` undefined.** Mitigation: Dev environment may not have `x-forwarded-for` headers. Acceptable for Test Events tab (validation passes without IP). Production behind Vercel always has `x-forwarded-for`.
11. **Shopify channel app fires Purchase with a DIFFERENT Pixel ID than ours.** Mitigation: 09-01 Task 4 + Pitfall 8. Same Pixel ID required on both sides.
12. **Cookie consent / GDPR violation on EU traffic.** Mitigation: DEFERRED per CONTEXT.md. Phase 9 fires Pixel/CAPI unconditionally. If France/EU traffic becomes meaningful, separate phase adds consent gate.
13. **Cart store shape mismatch in 09-09 — `lines[].variantId` field doesn't exist.** Mitigation: 09-09 dispatch prompt explicitly says "Read `components/cart/store.ts` + `components/cart/types.ts` first" — adapt field access if needed. Do NOT change the store shape itself.
14. **Builder restructures Buybox or CartCheckoutButton layout while wiring instrumentation.** Mitigation: LAYOUT IS LOCKED — 09-08 + 09-09 dispatch prompts carry the explicit flag. `design-system-auditor` verifies no structural HTML changes.
15. **Cart-smoke route breaks after Buybox import additions in 09-08.** Mitigation: Cart-smoke is a dev harness — if it breaks, fix or skip. Not customer-facing.
16. **localhost URL rejected by Meta CAPI — `event_source_url` validation fails on Meta side.** Mitigation: RESEARCH.md Assumption A1. Verify in 09-09 first dev test. If rejected, swap to `https://shmocard.com/dev` placeholder — but most likely accepts localhost in test mode.

---

## Threat model

**Trust boundaries:**

| Boundary | Description |
|---|---|
| Browser → Server Action | User browses PDP / clicks ATC / clicks Checkout. Client supplies `params`, `eventId`, `eventSourceUrl`, `fbp`, `fbc` to Server Actions. `eventSourceUrl` validated `http(s)://` + ≤2048 chars; `fbp`/`fbc` validated against `fb.<digit>.<digits>.<token>` regex; `eventId` not validated (UUIDv4 from `crypto.randomUUID()` — collision-safe, no exfiltration value). |
| Server Action → Meta Graph API | `metaFetch` POSTs to `graph.facebook.com/v25.0/{PIXEL_ID}/events?access_token={FB_CAPI_ACCESS_TOKEN}`. Token in `FB_CAPI_ACCESS_TOKEN` env, server-only file. Endpoint URL never logged. |
| Meta Graph API → Server Action response | Generic error on non-2xx — never echo Meta error body to caller. Server-side `console.error` for ops debugging. |
| `.env.local` → runtime | Pixel ID (public, browser bundle), CAPI token (server-only), Test Event Code (server-only, dev only). Pre-tool-use hook in `.claude/settings.json` blocks `.env*` writes by Claude. |
| Browser fbevents.js → Pixel HTTP beacon | `connect.facebook.net/en_US/fbevents.js` fires beacons to `www.facebook.com/tr`. Standard third-party tracking — beacons include `eventID` (camelCase) for dedup. |
| `headers()` (next/headers) → server payload | `x-forwarded-for`, `x-real-ip`, `user-agent` headers read server-side. May be spoofed at edge — documented trust limitation. |

**STRIDE register (ASVS L1, project default = block on `high` only):**

| Threat ID | Category | Component | Disposition | Mitigation |
|---|---|---|---|---|
| T-09-01 | Information Disclosure (FB_CAPI_ACCESS_TOKEN leak to client bundle) | `lib/analytics/meta-capi.ts` | mitigate | `import "server-only"` at line 1. Build error if any client module imports. Token never logged. Endpoint URL never echoed in errors. Mirrors `lib/shopify/index.ts` posture. |
| T-09-02 | Information Disclosure (FB_CAPI_ACCESS_TOKEN leak via error logs) | `lib/analytics/meta-capi.ts` error path | mitigate | Generic `"meta-capi: send failed"` throw. `console.error` logs `res.status` + `res.statusText` only — never the URL or body. |
| T-09-03 | Tampering (test_event_code leaks to production stream) | `lib/analytics/meta-capi.ts` payload construction | mitigate | `test_event_code` payload field added conditionally on `process.env.FB_TEST_EVENT_CODE` truthy. Production env unset → field omitted → events hit production stream. `backend.md` documents "DO NOT SET IN VERCEL PRODUCTION". Phase 10 launch checklist verifies. |
| T-09-04 | Spoofing / Phishing (Meta CAPI error echoes back to client) | `components/analytics/actions.ts` `fireMetaEvent` | mitigate | Outer try-catch swallows ALL errors. Server-side `console.error` for dev/ops debug. Browser never sees Meta error body — no XSS or phishing surface. Mirrors Phase 8 `applyDiscountCode` precedent. |
| T-09-05 | Spoofing (client-supplied IP / UA) | `components/analytics/actions.ts` `buildUserData` | mitigate | `client_ip_address` + `client_user_agent` read from `next/headers` server-side. NEVER accepts from client input. Edge spoofing is theoretical but documented as accepted trust limitation. |
| T-09-06 | Tampering (open-redirect via attacker-controlled eventSourceUrl) | `components/analytics/actions.ts` `validateEventSourceUrl` | mitigate | Validates `http(s)://` prefix + ≤2048 char cap before forwarding to Meta. Meta itself doesn't redirect — but generic input validation prevents noise/exfiltration via funky URLs. |
| T-09-07 | Tampering (malformed fbp/fbc cookie value injection) | `components/analytics/actions.ts` `validateFbpFbc` | mitigate | Regex `^fb\.\d+\.\d+\..+$` matches the canonical Meta fbp/fbc format. Malformed → returns `undefined` (graceful degradation, lower Match Quality but not a security failure). |
| T-09-08 | Tampering (Pixel ID mismatch — events stack on wrong Pixel) | Cross-domain configuration | mitigate | 09-01 Task 4 explicit gate. `backend.md` documents the parity requirement. Pitfall 8. Verified in 09-09 smoke. |
| T-09-09 | Information Disclosure (PII hash leak via logging) | `lib/analytics/hash.ts` | mitigate | Phase 9 collects NO PII pre-checkout. Helper defined for future use. When/if used, log only the hash hex — never the pre-hash input. |
| T-09-10 | Repudiation (no audit log for analytics fires) | All `track*` Server Actions | accept | Meta Events Manager logs every event server-side (their side, not ours). No client-side analytics audit log added. |
| T-09-11 | DoS (Meta CAPI rate limits) | `metaFetch` | accept | Standard CAPI quotas are generous. No retry-with-backoff added. If rate-limited in production, surface to Phase 10+. |
| T-09-12 | Elevation of Privilege (CSRF on Server Actions) | `components/analytics/actions.ts` | mitigate | Next.js Server Actions are CSRF-protected by default (origin + form-action checks). SameSite=Lax cookies block third-party origin auto-submission. |
| T-09-13 | Tampering (cart pollution / wrong content_ids on InitiateCheckout) | `CartCheckoutButton.handleClick` | mitigate | `lines[].variantId` flows from server-mapped Shopify variant GIDs via Phase 8 cart hydration. Client cannot mutate the cart store from outside the documented store actions. |
| T-09-14 | Information Disclosure (Pixel fires on private routes / admin routes) | `<PixelLoader>` global mount | accept | Phase 9 fires Pixel on all routes. shmocard.com has no auth surface or admin route — every page is public marketing. Pitfall not applicable. |
| T-09-15 | Compliance (GDPR — unconditional Pixel fire on EU traffic) | All Pixel + CAPI fires | accept | Cookie consent banner DEFERRED per CONTEXT.md Deferred Ideas. Risk documented. If EU traffic grows, separate phase adds consent gate before Phase 9 fires reach Meta. |
| T-09-16 | Information Disclosure (`event_source_url` leaks query string PII) | `eventSourceUrl: window.location.href` | accept | Phase 9 sends full `window.location.href` to Meta. If marketing campaigns add UTM params or query strings with PII (unlikely on shmocard.com — pure marketing site), they'd reach Meta. Acceptable per Meta's standard tracking model. |
| T-09-17 | Information Disclosure (Pixel ID leaked in browser bundle) | `NEXT_PUBLIC_FB_PIXEL_ID` | accept | INTENDED. Pixel ID is public by design (Meta's tracking model). Anyone can inspect the browser to find it. Not a secret. |

**Block-on:** `high` severity only. All Phase 9 threats are `low` or `medium` with explicit mitigations. T-09-01 / T-09-02 / T-09-03 / T-09-04 / T-09-08 are the security-critical ones; each is enforced by either `import "server-only"` (T-09-01), generic-error catch (T-09-02 + T-09-04), conditional payload field (T-09-03), or the admin-gate verification (T-09-08).

---

## Phase exit criteria

Phase 9 is complete when:

- All 10 plans (09-01 through 09-10) committed in order.
- 09-01 admin gate notes confirm: Meta Pixel created, Pixel ID parity verified, CAPI token + Test Event Code generated, `.env.local` updated, GHL webhook configured (or deferred with disposition).
- `context/general/backend.md` documents the 3 new env vars + Pitfall 5 + Pitfall 8 warnings.
- `.env.local.example` contains placeholders for `NEXT_PUBLIC_FB_PIXEL_ID`, `FB_CAPI_ACCESS_TOKEN`, and commented `FB_TEST_EVENT_CODE`.
- `lib/analytics/` exports: `types.ts` (`MetaEventName` etc.), `hash.ts` (`sha256Lower`), `event-id.ts` (`generateEventId`), `meta-capi.ts` (`metaFetch`), `fbq.ts` (`trackPixelEvent`).
- `app/global.d.ts` declares `Window.fbq` ambient.
- `components/analytics/PixelLoader.tsx` mounted in `app/layout.tsx` — `window.fbq` is a function on every page.
- `components/analytics/ViewContentTracker.tsx` mounted in all 3 PDPs — ViewContent fires dual-fire on each visit.
- `components/analytics/actions.ts` exports `trackViewContent`, `trackAddToCart`, `trackInitiateCheckout` Server Actions.
- `components/shmo-review/Buybox.tsx` fires dual-fire AddToCart on `handleAdd` success.
- `components/cart/CartCheckoutButton.tsx` fires dual-fire InitiateCheckout BEFORE redirect.
- `grep -rn "Purchase" components/ lib/ app/` returns ZERO matches outside type definitions / comments (D-04 — Purchase NEVER from site code).
- `09-09-events-manager-NOTES.md` confirms all 3 site events as `Server + Browser` in Events Manager Test Events tab + screenshot at `pictures/screenshots/phase-09-events-manager-test-events.png`.
- `design-system-auditor` PASS on every UI plan that touched `.tsx` (09-05, 09-07, 09-08, 09-09).
- `live-store-guard` SAFE on every commit (no Admin API / theme / `.env` writes).
- `npx tsc --noEmit` clean.
- `npm run build` clean. All routes built.
- `.planning/STATE.md` updated to "Phase 9 complete. Meta Pixel + CAPI dual-fire wired. Phase 10 (launch readiness) ready."
- `.planning/ROADMAP.md` Phase 9 marked `[x] complete` with completion date.
- `context/general/handoff.md` + `scope.md` reflect Phase 9 closure.
- No Shopify Admin writes outside the 09-01 admin gate (webhook + channel app config + data sharing level — Jordan-owned, not site code).
- No `.env` file commits to git.
- No domain / theme / payment touches.
- Cart flow + discount codes + all 3 PDPs render identically to Phase 8 (no regressions).

---
phase: 9
slug: tracking-ghl-webhook-facebook-pixel
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-21
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Test requirements TRK-01 through TRK-12 are defined in `09-RESEARCH.md § Validation Architecture`.
> The gsd-planner will populate the Per-Task Verification Map below from per-plan `<automated>` blocks.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript / `tsc --noEmit` for type gate; Playwright for browser smoke; manual Events Manager check for the Meta side |
| **Config file** | `tsconfig.json` (existing) |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npm run build` |
| **Estimated runtime** | ~30 seconds for type+build; ~2 min for Playwright smoke |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx tsc --noEmit && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green + manual Events Manager check showing all 3 site events as `Server + Browser` (dedup confirmed)
- **Max feedback latency:** 30 seconds for code; live Meta verification is async

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| _populated by gsd-planner from per-plan `<automated>` blocks_ |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/analytics/meta-capi.ts` — `metaFetch` helper mirroring `lib/shopify/index.ts` `shopifyFetch` pattern; takes event payload, signs with `FB_CAPI_ACCESS_TOKEN`, POSTs to Graph API v25.0
- [ ] `lib/analytics/hash.ts` — SHA-256 helper for hashed user_data (em, ph) per Meta CAPI spec; uses `node:crypto` (no new deps)
- [ ] `lib/analytics/types.ts` — `MetaEventName`, `MetaEventPayload`, `MetaUserData`, `MetaCustomData`, `MetaCAPIResponse` types
- [ ] `lib/analytics/event-id.ts` — UUIDv4 generator wrapper for `event_id` (browser-safe via `crypto.randomUUID()`)
- [ ] `lib/analytics/fbq.ts` — typed client-side wrapper around `window.fbq` with `MetaEventName` enum
- [ ] `lib/analytics/global.d.ts` — `window.fbq` ambient type declaration
- [ ] `components/analytics/PixelLoader.tsx` — `<Script>` tag mounted in root layout with `NEXT_PUBLIC_FB_PIXEL_ID`, strategy `afterInteractive`
- [ ] `components/analytics/ViewContentTracker.tsx` — client component, fires ViewContent on PDP mount (dual-fire Pixel + CAPI)
- [ ] Server Actions for CAPI fires: `trackAddToCart`, `trackInitiateCheckout`, `trackViewContent` (in `lib/analytics/actions.ts` or similar)
- [ ] `context/general/backend.md` updated with the 3 new env vars (D-11) BEFORE any code references them

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| ViewContent appears in Events Manager as `Server + Browser` (dedup) | TRK-XX | Meta Events Manager is the system-under-test for dedup correctness — there is no programmatic API to query "did dedup work?" | (1) Set `FB_TEST_EVENT_CODE` in `.env.local`. (2) Open Meta Events Manager → your Pixel → Test Events tab. (3) Visit `/shmo-review/cr-80` in dev browser. (4) Confirm "ViewContent" appears within ~30s with badge `Server + Browser`. |
| AddToCart same | TRK-XX | Same — Meta is the verifier | Click "Add to cart" on `/shmo-review/cr-80` after step above. Confirm "AddToCart" appears as `Server + Browser`. |
| InitiateCheckout same | TRK-XX | Same | Open cart drawer → click "Tap to checkout — $X". Confirm "InitiateCheckout" appears as `Server + Browser` BEFORE the redirect to shop.shmocard.com. |
| Purchase fires from Shopify's channel app (NOT from our code) | TRK-XX | Verifies the split-domain architecture (D-01) — our code must not emit Purchase | Complete a test purchase on shop.shmocard.com. Confirm "Purchase" appears with **same Pixel ID** but does NOT appear in our codebase's network tab. |
| `test_event_code` is OMITTED in production builds | TRK-XX | Pollution risk if test_event_code leaks to prod | Build with `npm run build`. Grep dist for `test_event_code` — must return zero matches. |
| Hashed PII (email) never logged in plaintext | TRK-XX | PII leak risk | Search server logs for any plaintext email in event payloads — must be SHA-256 hash only. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (10 net-new files listed above)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s for code-side; live Events Manager check before phase close-out
- [ ] `nyquist_compliant: true` set in frontmatter
- [ ] Manual verification gate: all 6 rows in "Manual-Only Verifications" pass

**Approval:** pending

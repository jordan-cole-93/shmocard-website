---
plan: 09-01
plan_name: Admin gate (Meta Business Manager + Shopify channel app)
status: complete
completed: 2026-05-21
type: checkpoint:human-action
---

# Phase 9 — Plan 09-01 — Admin gate notes

> Pre-execution checklist results. Jordan-side admin work in Meta Business Manager and Shopify Admin — no code changes. GATES the phase. All 10 tasks complete; 09-02 may proceed.

---

## Task 1: Shopify Facebook & Instagram sales channel app

- Channel installed: **yes** (Jordan confirmed 2026-05-21)
- Connected Meta business account: confirmed via Shopify Admin → Sales channels → Facebook & Instagram

## Task 2: Customer events data sharing level

- Data sharing level: **Maximum** (confirmed)
- Path verified: Shopify Admin → Settings → Customer events → Facebook & Instagram → Data sharing level
- Critical: NOT the default "Optimized" (which suppresses CAPI per RESEARCH.md pitfall)

## Task 3: Meta Pixel created + Pixel ID recorded

- Pixel ID: **1279390273687409** (15 digits)
- Source: Meta Business Manager → Events Manager → Data Sources
- This Pixel is the single source of truth for both `shmocard.com` (our site) and `shop.shmocard.com` (Shopify checkout)

## Task 4: Pixel ID parity (Pitfall 8 — supreme gate)

- Shopify channel app Pixel ID matches Task 3 Pixel ID: **yes**
- Both surfaces use Pixel ID `1279390273687409`
- This is the supreme gate per RESEARCH.md Pitfall 8 — events from both domains will stack into the same Pixel dataset

## Task 5: FB CAPI access token

- CAPI access token generated and ready to paste into `.env.local`: **yes**
- Source: Meta Business Manager → Events Manager → Pixel → Settings → Conversions API → Generate access token
- Token: pasted into `.env.local` as `FB_CAPI_ACCESS_TOKEN` (REDACTED — never committed, never logged, never echoed in chat)
- Token shown once by Meta — Jordan captured it on the spot

## Task 6: FB Test Event Code

- Test Event Code generated and ready to paste into `.env.local`: **yes**
- Source: Meta Business Manager → Events Manager → Pixel → Test Events tab
- Pasted into `.env.local` as `FB_TEST_EVENT_CODE` (REDACTED)
- Dev events will route to the Test Events stream — production data stays clean

## Task 7: `.env.local` updated with 3 new env vars

- `.env.local` updated with 3 new vars: **yes**
- Verified via `grep -cE "^VAR=.+" .env.local`:
  - `NEXT_PUBLIC_FB_PIXEL_ID=` — present (1 match)
  - `FB_CAPI_ACCESS_TOKEN=` — present (1 match)
  - `FB_TEST_EVENT_CODE=` — present (1 match)
- `.env.local` is gitignored (`git check-ignore .env.local` returns the path)
- `.env.local` does NOT appear in `git status --porcelain` — confirmed untracked

## Task 8: No Vercel production env writes yet

- Confirmed: no Vercel env changes made in Phase 9
- Phase 10 will handle production env: `NEXT_PUBLIC_FB_PIXEL_ID` + `FB_CAPI_ACCESS_TOKEN` set in Vercel
- `FB_TEST_EVENT_CODE` must NEVER appear in Vercel production env (Pitfall 5 — would route real customer events to Test Events tab)

## Task 9: GHL order webhook configured in Shopify Admin

- GHL webhook configured in Shopify Admin: **yes**
- Path: Shopify Admin → Settings → Notifications → Webhooks
- Event: `Order creation`
- Format: `JSON`
- URL: (Jordan's GHL inbound webhook URL — REDACTED, never logged)
- API version: latest stable
- GHL workflow status: GHL "Inbound Webhook" trigger received the test payload via Shopify's "Send test notification" → mapping reference saved in GHL → workflow trigger active
- Per D-05: site has ZERO responsibility for GHL signal. Shopify Admin → GHL is direct. No `/api/ghl-*` route in this phase.

## Task 10: Final gate-pass marker

Phase 9 admin gate PASS — proceed

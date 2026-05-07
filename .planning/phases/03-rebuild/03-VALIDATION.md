---
phase: 3
slug: rebuild
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-07
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
>
> **Mode:** Browser-proof verification per `.claude/rules/verification.md` (no automated tests in Phase 3 — deferred to Phase 4 per CONTEXT.md Claude's Discretion).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None for Phase 3. Phase 4 may add Vitest + Playwright. |
| **Config file** | None |
| **Quick run command** | `npm run dev` then manual browser verification |
| **Full suite command** | `npm run build && npm start` (build correctness) + browser walkthrough |
| **Estimated runtime** | ~30s for build; ~3min for full browser walkthrough |

---

## Sampling Rate

- **After every task commit:** `npm run build` green + browser screenshot saved to `pictures/screenshots/03-<plan>-<task>.png` + grep checks zero (no `Pawn Leads`, no non-`shm-` visual utilities)
- **After every plan complete:** Full screen walkthrough of changed routes + cart flow if cart-touching + `git grep` invariants
- **Before `/gsd-verify-work`:** All 9 phase REQs verified end-to-end in Vercel preview deploy
- **Max feedback latency:** ~30 seconds (build + visual check)

---

## Per-Requirement Verification Map

| Req ID | Plan(s) | Behavior | Verification Type | Method |
|--------|---------|----------|-------------------|--------|
| REQ-01 | 03-03 | Homepage renders all sub-brands; locked headline; section rotation `marsh→graham→ember→cocoa` | manual browser + screenshot | `npm run dev` → `/` → screenshot `pictures/screenshots/03-03-homepage-*.png` |
| REQ-02 | 03-04 | `/shmo-review` sells category; bulk math visible; locked headline + tagline | manual browser + screenshot | `npm run dev` → `/shmo-review` → screenshot |
| REQ-03 | 03-05, 03-08, 03-09 | CR-80 PDP fetches Shopify product; cart-add works; checkout redirects | manual browser + DevTools network + cart flow | `/shmo-review/cr-80` → confirm Storefront fetch in Network tab → add to cart → drawer → Checkout → confirm `shopify.com` URL |
| REQ-04 | 03-06, 03-08, 03-09 | L-Sign PDP same | manual browser + cart flow | `/shmo-review/l-sign` |
| REQ-05 | 03-07, 03-08, 03-09 | Square Card PDP same | manual browser + cart flow | `/shmo-review/square-card` |
| REQ-06 | 03-08, 03-09, 03-12 | Storefront API + cart mutations + checkout redirect | manual cart flow | Add → drawer → checkout URL match `*.myshopify.com` or configured domain |
| REQ-07 | 03-11 | Webhook revalidation: 200 valid HMAC, 401 invalid | curl with valid + invalid HMAC | `curl -X POST localhost:3000/api/revalidate -H "x-shopify-hmac-sha256: $hmac" --data-raw '...'` × 2 |
| REQ-08 | 03-10 | Waitlist form submits → GHL webhook receives | DevTools network + GHL inbox | Submit modal → 200 to GHL URL → confirm in GHL |
| REQ-09 | ALL | Design system invariants (no rogue Tailwind utilities, no Pawn Leads, no hex, no Admin API) | `git grep` checks | `git grep -in 'pawn leads\|pawnleads' .` returns 0; visual-utility grep on `app/` `components/` returns only `shm-*` matches; `git grep -n 'admin\.shopifyapis\.com\|/admin/api/' app/ components/ lib/` returns 0 |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pictures/screenshots/` directory exists (mkdir if missing before any plan runs)
- [ ] Pre-commit grep hook for "Pawn Leads" — recommend adding to `.claude/hooks/`
- [ ] Pre-commit grep hook for non-`shm-` visual utilities (bg-*, text-*-color, border-*-color, rounded-*, shadow-*) — recommend
- [ ] Test infrastructure: NOT REQUIRED for Phase 3 (deferred to Phase 4 per CONTEXT.md)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Section rotation order correct | REQ-01 | Visual rule, no automated check | Open `/` → confirm sequence `marsh→graham→ember→cocoa` with `.shm-wave` dividers between |
| Locked headline copy matches `marketing.md` | REQ-01, REQ-02 | Copy review, no automated check | Compare rendered copy to `context/general/marketing.md` locked headlines |
| Mascot pose budget (≤2 per page, ≤140px on marketing pages) | REQ-09 | Visual rule | Count `<Mascot>` instances per page; confirm size class |
| Cart drawer uses `.shm-cart-*` primitives | REQ-09 | Inspectable in DevTools | Open drawer → DevTools → confirm class names start with `shm-cart-` |
| Checkout URL pinned to Shopify domain | REQ-06 | Open redirect prevention | Click Checkout → confirm browser navigates to `*.myshopify.com` or configured store domain |
| Webhook revalidation propagates within ~5s | REQ-07 | End-to-end timing | Edit a product in Shopify Admin → curl webhook → reload `/shmo-review/<handle>` within 5s → confirm change reflected |

---

## Validation Sign-Off

- [ ] All plans have screenshot + browser verification step
- [ ] Sampling continuity: every plan touches at least one REQ with explicit verification command
- [ ] Wave 0 directory + grep hooks set up (or explicitly deferred)
- [ ] No hidden manual steps — all verifications documented above
- [ ] Phase gate criteria explicit: build green + 9 REQ rows green + zero grep violations + Vercel preview live

**Approval:** pending

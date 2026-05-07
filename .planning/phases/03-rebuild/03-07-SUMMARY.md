---
phase: 03-rebuild
plan: 07
subsystem: pdp
tags: [pdp, shopify, storefront-api, marketing-copy, design-system]
requires:
  - "03-04 (category page)"
  - "03-05 (CR-80 PDP + shared component tree)"
  - "03-12 (Storefront lib + cart Server Actions)"
provides:
  - "/shmo-review/square-card live PDP — REQ-05 satisfied"
  - "Square-Card-specific marketing copy in pdp-copy.ts (subline + bullets + 4 FAQ entries)"
affects:
  - "components/pdp/pdp-copy.ts (Square Card slug entries enhanced)"
tech-stack:
  added: []
  patterns:
    - "Reused shared PDP component tree from 03-05 — zero new component files"
    - "Marketing copy in code (per shopify-data-discipline) — never hardcodes product/price/image data"
key-files:
  created:
    - pictures/screenshots/03-07-square-card-pdp.png
    - pictures/screenshots/03-07-square-card-sticky.png
  modified:
    - components/pdp/pdp-copy.ts
decisions:
  - "Tightened Square Card subline to lead with the no-counter use case (the spine of the format's value prop), not just the surface list"
  - "5 Square-Card-specific bullets cover all four plan-required value props (adhesive surfaces, mounting locations, no-counter use case, QR fallback) before the 3 shared common bullets"
  - "Slug-FAQ extended from 2 entries to 4 — added removal/no-residue and outdoor-use questions per plan, retained the surfaces and disc-vs-CR-80/L-Sign disambiguator"
  - "Verified the PDP against 'next start' on the production build because 'next dev' has a pre-existing framer-motion vendor-chunk HMR crash; production server is the operational reality, not dev HMR"
metrics:
  duration: 5m
  completed: 2026-05-07
  tasks_completed: 2
  files_created: 2
  files_modified: 1
---

# Phase 3 Plan 07: Square Card PDP — Summary

Wired the Square Card PDP at `/shmo-review/square-card` by extending Square-specific entries in `components/pdp/pdp-copy.ts`. Zero new components — the shared PDP tree from 03-05 (`components/pdp/*`) consumes the slug as designed. The page renders the live Shopify product **Google Review NFC Tap Card (Plate)** (`gid://shopify/Product/8455598112943`, handle `google-review-plaque`) with all 4 variant tiers ($29.99 / $49.99 / $119.99 / $219.99), a 7-item checklist (4 Square-specific + 3 shared), 11 FAQ items (6 base + 4 Square + 1 retained), the sticky buybox, and the free-shipping callout — all from the same code path that ships CR-80 and L-Sign.

## What changed in `pdp-copy.ts`

| Slot | Before (03-05 stub) | After (03-07) |
|---|---|---|
| `subline('square-card')` | "The disc that sticks anywhere — door, window, dashboard, service van." | "The adhesive disc for shops that don't have a counter to put a sign on." |
| `bullets('square-card')` | 2 Square-specific items | 4 Square-specific items (adhesive surfaces, mounting locations, no-counter use case, QR fallback) before 3 shared |
| `slugFaq['square-card']` | 2 items (surfaces + disc-vs-card) | 4 items (surfaces, removal/no-residue, outdoor-use, disc-vs-card) |

`HANDLE_MAP['square-card']` was already correct in `app/shmo-review/[handle]/page.tsx` from 03-05 — verified, no edit needed.

## Verified live render

| Check | Status |
|---|---|
| `/shmo-review/square-card` returns 200 from `next start` | PASS |
| H1 is real Shopify product title | "Google Review NFC Tap Card (Plate)" |
| 4 Shopify variant rows with prices | $29.99 / $49.99 / $119.99 / $219.99 |
| Subline reads new no-counter framing | PASS |
| 7 checklist bullets render in correct order (4 Square + 3 shared) | PASS |
| 5 Square-specific FAQ markers found in HTML | PASS (How does it work / surfaces / remove / outdoor / disc-vs-card) |
| Sticky bar `data-visible="true"` after scroll past gallery | PASS |
| Add-to-cart CTA + free-shipping callout render | PASS |
| Browser console errors | 0 |

## Screenshots

- `pictures/screenshots/03-07-square-card-pdp.png` — full-page render with Shopify gallery (4 thumbs), italicized subline, 7-bullet checklist, 4 variant pack rows with live prices, qty stepper, Google review URL input, primary CTA "Add to cart — $29.99", and 11-item FAQ accordion.
- `pictures/screenshots/03-07-square-card-sticky.png` — viewport scrolled past gallery; sticky bar slid down from the top with variant thumb + title + variant + price + Add-to-cart.

## Deviations from Plan

### Auto-fixed issues

**1. [Rule 3 — Blocking issue] Verified against `next start` instead of `next dev`**
- **Found during:** Task 2 Playwright capture
- **Issue:** `next dev` throws `Cannot find module './vendor-chunks/motion-dom.js'` on the second compile of any PDP route. The first GET succeeds, every subsequent request 500s until a full `.next` wipe. Reproduces on `/shmo-review/cr-80`, `/l-sign`, and `/square-card` — pre-existing, not introduced by this plan.
- **Fix:** Ran `npm run build` then `npx next start -p 3000` against the production bundle; Playwright captured both screenshots cleanly with zero console errors.
- **Commit:** rolled into `c5fc965`
- **Future:** Phase 4 polish — root-cause the framer-motion + Next 15 dev HMR crash (likely `experimental.optimizePackageImports` or framer-motion's package.json `exports` field interacting badly with webpack vendor-chunking).

### Auth gates

None.

## Threat Flags

None — only matching surface in this plan is `T-03-07-01` (URL handle tampering), already mitigated by `HANDLE_MAP` allowlist + `isPdpSlug` type guard inherited from 03-05. No new endpoints, auth paths, file access, or schema changes.

## Known stubs / hardcoded values

- **`ShmRating`** still shows the static "4.9 · based on owner feedback" rating bar (inherited from 03-05; flagged in 03-05-SUMMARY for Phase 4).

## Deferred items (out of scope)

- `next dev` framer-motion vendor-chunk HMR crash (pre-existing, surfaces on every PDP route)
- Mobile-pass spacing on the disc product imagery (Phase 4)
- Wiring per-product live review counts via Shopify `metaobjects` or external review provider (Phase 4)

## Self-Check: PASSED

- [x] `components/pdp/pdp-copy.ts` Square Card subline updated (line 38)
- [x] `components/pdp/pdp-copy.ts` Square Card bullets list has 4 Square-specific items (lines 64–68)
- [x] `components/pdp/pdp-copy.ts` Square Card slugFaq has 4 entries (lines 154–171)
- [x] `pictures/screenshots/03-07-square-card-pdp.png` exists (572 KB)
- [x] `pictures/screenshots/03-07-square-card-sticky.png` exists (87 KB)
- [x] Commits exist: `e882f98` (task 1, copy) + `c5fc965` (task 2, screenshots) — both visible in `git log`
- [x] `npm run build` exits 0
- [x] `git grep -in 'pawn leads\|pawnleads' components/pdp/` returns 0
- [x] `grep -rn 'descriptionHtml' components/pdp/` returns 0
- [x] Playwright NAV_STATUS = 200, ERRS_COUNT = 0
- [x] H1 = real Shopify title; 4 variant rows render; sticky bar fires; FAQ block contains all 5 Square-specific question markers
- [x] REQ-05, REQ-06, REQ-09 satisfied — all three PDPs live; PDP component tree fully reused

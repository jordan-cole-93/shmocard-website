---
phase: 03-rebuild
plan: 06
subsystem: pdp
tags: [pdp, l-sign, shopify, storefront-api, marketing-copy]
requires:
  - "03-04 (category page)"
  - "03-05 (PDP component tree + dynamic [handle] route)"
  - "03-12 (Storefront lib + cart Server Actions)"
provides:
  - "L-Sign-specific PDP marketing copy (subline + 4 value-prop bullets + 3 FAQ entries)"
affects:
  - "components/pdp/pdp-copy.ts (added L-Sign-specific shift-swap FAQ — subline + bullets landed in 03-07 commit due to parallel-execution race; see Deviations)"
tech-stack:
  added: []
  patterns:
    - "Shared component tree from 03-05 consumed without modification — only per-slug copy data added"
key-files:
  created:
    - pictures/screenshots/03-06-l-sign-pdp.png
  modified:
    - components/pdp/pdp-copy.ts
decisions:
  - "Added a 3rd L-Sign FAQ ('Can I move the L-Sign between stations during a shift?') beyond the existing 'Where does it live?' + 'Can I add my logo?' — the shift-swap angle is the strongest L-Sign-only differentiator from REQ-04 and warranted its own FAQ entry."
  - "L-Sign subline rewritten to lead with the no-staff-prompt + no-hardware angles (the locked marketing.md L-Sign pitch) instead of the generic 'turns happy customers into five-star reviews' phrasing."
  - "L-Sign bullets expanded from 2 specific + 3 common (5 total) to 4 specific + 3 common (7 total). The 4 specific bullets cover counter visibility, no countertop hardware, shift-swap, and the NFC-tap-no-prompt mechanic — directly mapping the plan's REQ-04 value prop list."
metrics:
  duration: 25m
  completed: 2026-05-07
  tasks_completed: 2
  files_created: 1
  files_modified: 1
---

# Phase 3 Plan 06: L-Sign PDP — Summary

Extended `pdp-copy.ts` with L-Sign-specific marketing copy (subline + 4 value-prop bullets + 3 FAQ entries) and verified the dynamic `/shmo-review/[handle]` route from 03-05 renders the L-Sign product correctly against the live Shopify Storefront API. **Zero new components shipped** — the entire `components/pdp/*` tree from 03-05 is reused verbatim. The L-Sign PDP renders the real product (`Google Review NFC Tap Card (L Sign)`, GID `gid://shopify/Product/8563764691119`, 8 variants: Clear/Black × 1/2/5/10 cards, $29.99 → $219.99), wires Add-to-cart to the `addLineToCart` Server Action (POST 200 with `next-action` header confirmed in Playwright), and opens the cart drawer (`.shm-cart.is-open`).

## Copy entries shipped

### Subline (italic subhead under H1)
> "The counter standee that does the asking — no staff prompt, no countertop hardware."

Replaces the placeholder from 03-05 ("The countertop tap that turns happy customers into five-star reviews."). New copy leads with the two locked L-Sign angles from `marketing.md`: (1) the sign does the asking, (2) no countertop hardware required.

### Bullets (`.shm-checklist--featured`, 4 L-Sign-specific + 3 common)
1. Acrylic 4×6 tabletop standee — sits at the register, hard to ignore on the way out
2. No countertop hardware — drop it on the counter and it's working, no mounting required
3. Light enough to swap between stations — one standee per active register, move it during shifts
4. Customers tap with their phone — the review page opens directly, no staff prompt needed
5. Pre-programmed to your Google review link before shipping *(common)*
6. Works on every modern phone — no app, no download *(common)*
7. 60-day reprogramming + return guarantee *(common)*

### FAQ (3 L-Sign-specific entries appended to 6 shared base entries)
- **"Where does the L-Sign live?"** — counter / register placement
- **"Can I move the L-Sign between stations during a shift?"** *(NEW — added in this plan)* — shift-swap mechanic, one standee per active station
- **"Can I add my logo to the L-Sign?"** — custom-printed face

Final L-Sign FAQ block: 9 questions (6 base + 3 L-Sign).

## Verified Shopify product data

| Field | Value |
|---|---|
| URL slug | `/shmo-review/l-sign` |
| Shopify handle | `google-review-nfc-tap-card-l-sign` |
| Product GID | `gid://shopify/Product/8563764691119` |
| Title | Google Review NFC Tap Card (L Sign) |
| Variants | 8 (Clear/Black × 1/2/5/10 cards, $29.99 / $49.99 / $119.99 / $219.99) |
| Images | Real Shopify CDN (LSign-Google-1.jpg, LSign-Google-2.jpg, etc.) |

`HANDLE_MAP['l-sign'] === 'google-review-nfc-tap-card-l-sign'` already present in `app/shmo-review/[handle]/page.tsx` from 03-05 — no route changes needed.

## Browser verification

Screenshot: `pictures/screenshots/03-06-l-sign-pdp.png` (1440×900 desktop, full-page).

Playwright probes confirmed:
- `h1` = "Google Review NFC Tap Card (L Sign)"
- `.shm-checklist--featured li` count = 7 (4 L-Sign-specific + 3 common bullets)
- Pack selector rendered 8 rows pulled from Shopify variants
- CTA label = "Add to cart — $29.99" (real lowest variant price from Storefront API)
- 9 FAQ accordion items visible
- Sticky bar `data-visible="true"` after scrolling past `#pdp-gallery` (sticky-fix from 03-05 task 2 still healthy)
- Click on `.pdp-bb__cta` triggered 2× POST 200 to `/shmo-review/l-sign` with `next-action` header → cart drawer opened (`.shm-cart.is-open` count = 1)
- 0 browser console errors, 0 page errors

## Deviations from Plan

### Auto-fixed issues

**1. [Rule 3 — Parallel-execution race] L-Sign subline + bullets landed in commit `e882f98` (plan 03-07) instead of in plan 03-06's commit**
- **Found during:** Task 1 commit
- **Issue:** This plan and plan 03-07 (Square Card) ran in parallel and both edit `components/pdp/pdp-copy.ts`. After I authored the new L-Sign subline + 4-bullet checklist and saved them to the working tree, plan 03-07 staged `components/pdp/pdp-copy.ts` as part of its own commit `e882f98 feat(03-07): tighten Square Card PDP copy in pdp-copy.ts`, sweeping my still-unstaged L-Sign edits into 03-07's commit. By the time I went to commit, only the new shift-swap FAQ entry remained as an unstaged delta.
- **Impact:** The shipped copy is **correct** — `git show HEAD:components/pdp/pdp-copy.ts` confirms the new L-Sign subline ("The counter standee that does the asking…") and the 4 expanded bullets are in tree. Only the commit attribution is split: subline + bullets in `e882f98` (03-07's commit), shift-swap FAQ in `b8ec441` (this plan's task 1 commit).
- **Why this happened:** Multiple agents share the working directory in parallel-wave execution. There is no per-plan working tree isolation in the GSD parallel runner; whichever agent runs `git add <shared file>` first scoops up all unstaged edits to that file regardless of which plan authored them.
- **Mitigation for future parallel waves:** Plans that share a file should be serialized into the same wave-slot, OR each parallel agent should `git add` immediately after every Edit (atomic edit-then-stage) instead of batching edits.
- **Files affected:** `components/pdp/pdp-copy.ts`
- **Commits:** `e882f98` (subline + bullets — landed under 03-07's name), `b8ec441` (shift-swap FAQ — this plan)

### Auth gates

None.

## Threat Flags

None — surfaces inherit from 03-05 and 03-12. The plan's `<threat_model>` registers T-03-06-01 (URL handle tampering), which is mitigated by the existing `HANDLE_MAP` allowlist + `isPdpSlug` type guard from 03-05. No new attack surface introduced.

## Known stubs / hardcoded values

- **`ShmRating`** still displays a static "4.9 · based on owner feedback" rating bar (inherited from 03-05). Real per-product review counts are a Phase 4 enhancement.

## Deferred items (out of scope)

- Mobile-pass spacing for the longer L-Sign bullet list (Phase 4)
- Lighthouse / a11y audit of all 3 PDPs together (Phase 4)
- Real review-count integration on `ShmRating` (Phase 4)
- Pack-selector accessibility audit — 8 rows is the heaviest variant list across the 3 PDPs (Phase 4)

## Self-Check: PASSED

- [x] `pictures/screenshots/03-06-l-sign-pdp.png` exists on disk (622 KB)
- [x] Commit `b8ec441` exists in `git log` (task 1: shift-swap FAQ)
- [x] Commit `365854a` exists in `git log` (task 2: screenshot)
- [x] L-Sign subline ("The counter standee that does the asking — no staff prompt, no countertop hardware.") shipped in tree (verified `git show HEAD:components/pdp/pdp-copy.ts | grep`)
- [x] 4 L-Sign-specific bullets shipped in tree (counter visibility / no hardware / shift-swap / customers tap)
- [x] HANDLE_MAP['l-sign'] === 'google-review-nfc-tap-card-l-sign' (from 03-05, unchanged)
- [x] `npm run build` exits 0
- [x] `git grep -in 'pawn leads\|pawnleads' components/pdp/` returns 0
- [x] `grep -rn 'descriptionHtml' components/pdp/` returns 0
- [x] Browser-verified at `/shmo-review/l-sign`: real Shopify title + 8 variant prices + 4 L-Sign bullets + 9 FAQ entries
- [x] Cart-add Server Action confirmed POST 200 with `next-action` header; drawer opens
- [x] 0 browser console errors during full-page render

---
phase: 03-rebuild
plan: 10
subsystem: marketing-capture
tags: [waitlist, modal, video-lightbox, server-action, framer-motion, zustand]
requires: [03-03]
provides:
  - "Server Action submitWaitlist() with honeypot + email regex + product allowlist + GHL webhook fallback"
  - "Zustand modal store (transient, no persist) + open helpers"
  - "WaitlistModal (React 19 useActionState) + VideoLightbox + ModalRoot portal mount"
  - "SubBrandSpotlight wired to waitlist modal for biz/link/reputation; VideoTestimonials wired to lightbox"
affects: [components/home/SubBrandSpotlight.tsx, components/home/VideoTestimonials.tsx, app/layout.tsx]
tech-stack:
  added: []
  patterns: ["Server Action + form action", "Zustand transient store", "createPortal modal mount", "framer-motion AnimatePresence scrim+dialog"]
key-files:
  created:
    - lib/waitlist.ts
    - components/modals/modal-store.ts
    - components/modals/modal.css
    - components/modals/WaitlistModal.tsx
    - components/modals/VideoLightbox.tsx
    - components/modals/ModalRoot.tsx
    - components/home/NotifyButton.tsx
    - components/home/VideoTile.tsx
    - pictures/screenshots/03-10-waitlist-modal.png
    - pictures/screenshots/03-10-waitlist-success.png
    - pictures/screenshots/03-10-video-lightbox.png
  modified:
    - components/home/SubBrandSpotlight.tsx
    - components/home/VideoTestimonials.tsx
    - components/home/home-data.ts
    - app/layout.tsx
decisions:
  - "Pushed `'use client'` boundary to leaf components (NotifyButton, VideoTile) — kept SubBrandSpotlight + VideoTestimonials server-rendered per RESEARCH Pitfall 3."
  - "ModalRoot owns body scroll-lock + Escape key once for every modal — no per-modal duplication."
  - "Video lightbox renders 'Video coming soon' placeholder inside the same shell when videoUrl is absent — keeps motion + dimensions consistent before assets land."
metrics:
  duration: ~25min
  completed: 2026-05-07
requirements: [REQ-08, REQ-09]
---

# Phase 3 Plan 10: Waitlist Modal + Video Lightbox + GHL Server Action Summary

Wired the waitlist capture flow (Shmo Biz / Link / Reputation) and the video testimonial lightbox: Server Action with full validation (honeypot + email regex + product allowlist), graceful fallback when `GHL_WAITLIST_WEBHOOK_URL` is unset (D-04 deferred), Zustand modal store, framer-motion modal entrance, and homepage CTA wiring.

## What was built

### Server Action — `lib/waitlist.ts`

`'use server'` directive. Validates in this order:

1. **Honeypot guard** — if `company_website` field is filled, return `{ ok: true }` without forwarding. Bots fill, humans never see (T-03-10-01).
2. **Email regex** — `^[^\s@]+@[^\s@]+\.[^\s@]+$`. Reject with `invalid-email` (T-03-10-02).
3. **Product allowlist** — `ALLOWED_PRODUCTS = Set('biz' | 'link' | 'reputation')`. Reject with `invalid-product` (T-03-10-03). `review` is intentionally excluded — Shmo Review routes to `/shmo-review`.
4. **GHL fetch** — POST `{ email, product, submitted_at }` (server-generated `submitted_at` per T-03-10-06). Returns `webhook-failed` on non-2xx, `webhook-unreachable` on network error.
5. **Graceful fallback** — when `process.env.GHL_WAITLIST_WEBHOOK_URL` is unset: log `[waitlist] GHL_WAITLIST_WEBHOOK_URL not configured` server-side and return `{ ok: true }`. The env-var status NEVER leaks to the client (T-03-10-04).

### Modal infrastructure

- **`components/modals/modal-store.ts`** — Zustand store with `kind: null | 'waitlist' | 'video'` and `props`. Transient (no `persist` middleware). Exported helpers `openWaitlist(slug)`, `openVideo(url, title?, poster?)`, `closeModal()`.
- **`components/modals/ModalRoot.tsx`** — single portal mount in `document.body`. `AnimatePresence` wraps scrim (opacity fade 220ms) + dialog (scale 0.95→1 + opacity 220ms, ease `[0.2, 0.8, 0.2, 1]` matching `--motion-base`). Owns body `overflow: hidden` lock and Escape-key close for every modal.
- **`components/modals/WaitlistModal.tsx`** — React 19 `useActionState(action, INITIAL)`. Form contains hidden `product` field, visually-hidden honeypot `company_website`, email input, submit button. After successful action, replaces form with success state ("Thanks — you're on the list. We'll let you know the moment Shmo Biz/Link/Reputation ships."). Auto-focuses email on mount.
- **`components/modals/VideoLightbox.tsx`** — native `<video controls preload="metadata" playsInline>` inside 16:9 frame. Auto-plays on mount (graceful catch on autoplay block). Renders "Video coming soon" placeholder when no `videoUrl` provided.
- **`components/modals/modal.css`** — LAYOUT only. Positioning, sizing, scroll/pointer rules. Visuals come from `.shm-card --hard` + `.shm-scrim`.

### Homepage wiring

- **`components/home/NotifyButton.tsx`** — client leaf for `SubBrandSpotlight` CTA. Calls `openWaitlist(slug)`. Keeps the parent server-rendered (RESEARCH Pitfall 3).
- **`components/home/SubBrandSpotlight.tsx`** — replaced inline `<button data-waitlist=…>` with `<NotifyButton />` for the three coming-soon slugs. Review still uses `<a href="/shmo-review">`.
- **`components/home/VideoTile.tsx`** — client leaf wrapping each video card. Clicking the play button calls `openVideo(url, "{person} — {shop}")`. Pending tiles stay disabled.
- **`components/home/VideoTestimonials.tsx`** — replaced inline tile markup with `<VideoTile />`.
- **`components/home/home-data.ts`** — `VideoTile` type gains optional `videoUrl` and `posterUrl` fields.
- **`app/layout.tsx`** — added `<ModalRoot />` alongside `<CartDrawer />`.

## Verification

Browser-driven Playwright run on `npm run dev` (port 3010):

| Hard rule | Method | Result |
|---|---|---|
| Modal opens from Shmo Biz "Notify me" | Click `button[data-waitlist="biz"]` | ✓ Dialog opens with form |
| Honeypot field present + visually hidden | DOM inspect | ✓ `<input name="company_website">` at `left: -9999px` |
| Honeypot filled → returns ok without webhook | Set value via DOM, submit | ✓ Success state shown; server log shows ZERO entries |
| Submit with empty `GHL_WAITLIST_WEBHOOK_URL` | Submit `test@example.com` | ✓ Success state shown; server logs `[waitlist] … not configured — captured locally only (product=biz)` |
| Invalid email rejected | Submit `not-an-email` (after removing native `required`) | ✓ Error: "That email address doesn't look right. Try again?" — no input echo |
| Tampered `product=hacked` | Set hidden field via DOM, submit | ✓ Error: "Something went wrong. Refresh and try again." (env-var status never leaked) |
| Video lightbox opens | Click first non-pending tile | ✓ Lightbox dialog opens with 16:9 frame; clicked tile had no URL → "Video coming soon" placeholder rendered correctly |
| Escape closes modals | `keyboard.press('Escape')` | ✓ Both modals close; dialog count drops to 0 |
| Body scroll lock during modal | n/a (manual logic) | ✓ Implemented in `ModalRoot.useEffect` |
| `npm run build` exits 0 | `npm run build` | ✓ All 7 routes compile; First Load JS 145 kB on `/` |

Screenshots saved to `pictures/screenshots/`:
- `03-10-waitlist-modal.png`
- `03-10-waitlist-success.png`
- `03-10-video-lightbox.png`

## Threat mitigations

| ID | Disposition | Realization |
|---|---|---|
| T-03-10-01 (bot waitlist submissions) | mitigate | Honeypot `company_website` field; bot-filled submissions return ok without forwarding |
| T-03-10-02 (email tampering) | mitigate | Server-side regex rejects `invalid-email` |
| T-03-10-03 (product field tampering) | mitigate | `ALLOWED_PRODUCTS` allowlist rejects `invalid-product` |
| T-03-10-04 (env-var status disclosure) | mitigate | `webhook-unconfigured` logged server-side only; UI returns generic ok; error copy never references env vars |
| T-03-10-05 (submission flood) | accept | Honeypot is the v1 minimum per A6; rate-limit deferred to Phase 4 (Vercel KV) |
| T-03-10-06 (submitted_at injection) | mitigate | Server generates `new Date().toISOString()`; client field ignored |

## Deviations from plan

### Auto-fixed issues

None — plan executed cleanly.

### Authentication gates

None — graceful fallback ships without GHL URL per D-04. When Jordan provides URL, dropping it into `.env.local` is the only required change; zero code edits.

### Boundary deviations

**Notify CTA leaf component** (`NotifyButton.tsx`) — plan suggested converting CTA inline as `'use client'` child component. I created a dedicated file `components/home/NotifyButton.tsx` for clarity and reusability rather than an anonymous inline component. Same effect; cleaner file boundary.

**VideoTile leaf component** (`VideoTile.tsx`) — same rationale. Plan said "small `'use client'` `<VideoTile>`"; I gave it its own file.

## Deferred items

1. **`.env.local.example` not updated** — repo `.claude/settings.json` blocks all writes to `.env*` files (per `live-store-protection.md`). The plan's automated verify step `grep -c "GHL_WAITLIST_WEBHOOK_URL" .env.local.example` cannot succeed without Jordan running an unblocked write or temporarily relaxing the hook. The env-var contract is documented in `lib/waitlist.ts` header instead. **Action for Jordan:** add `GHL_WAITLIST_WEBHOOK_URL=` line to `.env.local.example` manually if the file is desired, OR keep the contract documented in code.

2. **`.shm-modal-*` primitives not added to `components.css`** — design system currently has `.shm-card`, `.shm-card--hard`, and `.shm-scrim` but no dedicated `.shm-modal-*` family. Modal layout uses `.shm-modal-root`, `.shm-modal`, `.shm-modal__*` classes from `components/modals/modal.css` (LAYOUT only). When the design system gains `.shm-modal-*` primitives, refactor to consume them and delete most of `modal.css`.

3. **GHL webhook URL** — D-04 deferred. Code is ready; no edits needed once Jordan provides the URL. Plan `<how-to-verify>` Test 7 is queued for that hand-off (DevTools Network shows POST to GHL with `{ email, product, submitted_at }`).

4. **Video assets pending** — `home-data.ts` has no `videoUrl` values yet. Lightbox renders "Video coming soon" placeholder inside the same animation shell; no UI wiring change needed when Jordan supplies real URLs.

5. **Rate limiting** — accepted threat T-03-10-05; Phase 4 may add Vercel KV IP rate-limit per A6.

## Commits

| Task | Hash | Subject |
|---|---|---|
| 1 | `debc060` | feat(03-10): add waitlist server action + modal infrastructure |
| 2 | `bab9212` | feat(03-10): wire homepage CTAs to waitlist + video modals |
| 3 | `2c9cbe4` | test(03-10): screenshots for waitlist + video lightbox flow |

## Self-Check: PASSED

- `lib/waitlist.ts` exists ✓
- `components/modals/modal-store.ts` exists ✓
- `components/modals/WaitlistModal.tsx` exists ✓
- `components/modals/VideoLightbox.tsx` exists ✓
- `components/modals/ModalRoot.tsx` exists ✓
- `components/modals/modal.css` exists ✓
- `components/home/NotifyButton.tsx` exists ✓
- `components/home/VideoTile.tsx` exists ✓
- `pictures/screenshots/03-10-waitlist-modal.png` exists ✓
- `pictures/screenshots/03-10-waitlist-success.png` exists ✓
- `pictures/screenshots/03-10-video-lightbox.png` exists ✓
- Commit `debc060` exists ✓
- Commit `bab9212` exists ✓
- Commit `2c9cbe4` exists ✓
- `app/layout.tsx` mounts `<ModalRoot />` ✓
- `npm run build` exits 0 ✓

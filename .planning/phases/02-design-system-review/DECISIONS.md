# Phase 2 / Step 02-06: Locked Decisions

**Date:** 2026-05-07
**Status:** Locked
**Decision authority:** Jordan
**Consumed by:** Phase 3 (wiring) and beyond

This file captures the open questions surfaced during the Phase 2 audit + translation plan and Jordan's answers. Each decision is locked unless explicitly revisited in a future phase.

---

## D-01 — Cart state management → Zustand

**Question:** How does the shopping cart remember its contents across navigations and refreshes?

**Decision:** Use **Zustand** (small ~3 KB library) with `localStorage` middleware to persist cart state.

**Rationale:**
- Industry-standard pattern for headless commerce carts.
- Persists across page refreshes via `localStorage` for free.
- Smaller and less boilerplate than React Context + Reducer.
- Plays well with Server Components — only the cart UI needs `'use client'`, the rest of the page stays SSR.

**Phase 3 implication:** add `zustand` to `package.json`. Cart store at `components/cart/store.ts` follows the sketch in `TRANSLATION.md`.

---

## D-02 — Animation library → `framer-motion` (LOCKED, OVERRIDE)

**Question:** CSS-only motion vs `framer-motion` library?

**Decision:** **Use `framer-motion`.** Jordan flagged this as important — overrides my CSS-only recommendation.

**Rationale (Jordan's call):**
- Some Phase 3 surfaces (sub-brand spotlights, video tile reveals, sticky bar slide, possibly hero type-cycle) will benefit from coordinated motion that's painful to orchestrate in raw CSS.
- Headless commerce sites that "feel premium" lean heavily on motion polish.
- Re-introducing `framer-motion` is reversible if it's overkill in practice — but starting without it and adding mid-Phase-3 is more disruptive than starting with it.

**Constraints (per design system):**
- Motion stays **subtle, fast, never bouncy**. Use `framer-motion`'s `tween` + `easeOut` curves, not `spring` with high stiffness.
- Match design system tokens for timing: `--motion-fast` (150ms), `--motion-base` (220ms), `--motion-slow` (320ms).
- Match easing: `cubic-bezier(.2, .8, .2, 1)`.
- **Don't replace CSS hover transitions** (button hover lift, card hover, FAQ chevron rotate) — those stay CSS for performance + simplicity.
- `framer-motion` is for **section-level reveals, drawer / modal entrances, page transitions** — not for individual hover states.

**Phase 3 implication:** add `framer-motion` to `package.json`. `TRANSLATION.md` "Animation approach" section is **superseded** by this decision — framer-motion is approved for sections that need it. PROJECT.md "Animation library" out-of-scope row is removed (or rewritten to specify "subtle/fast/non-bouncy framer-motion only").

---

## D-03 — Asset location → `public/`

**Question:** Where do product photos, mascot PNGs, and lifestyle images live?

**Decision:** **`public/` at the repo root** (Next.js convention).

**Rationale:**
- Standard Next.js pattern — files served at `/products/cr80-trio.png` from the deployed origin.
- Keeps `context/design-system/` as code-only (CSS, docs, fonts).
- Clean separation: design system = source code; `public/` = runtime media.
- Vercel deploys `public/` automatically.

**Phase 3 implication:**
- Jordan provides product photos + mascot PNGs + lifestyle images during Phase 3.
- They land at `public/products/`, `public/mascot/`, `public/lifestyle/`.
- Reference paths in `.tsx` use absolute paths from `public/` (e.g., `<img src="/products/cr80-trio.png" />`).
- Mock paths in any translated content (e.g., `home-data.jsx` → `home-data.ts`) are rewritten from `assets/products/...` → `/products/...`.

---

## D-04 — GHL webhook URL → DEFERRED

**Question:** What's the GHL webhook endpoint for waitlist captures (Shmo Biz / Shmo Link / Shmo Reputation)?

**Decision:** **Deferred to Phase 3 page work.** Jordan will provide the URL when building the waitlist forms.

**Phase 3 implication:**
- Waitlist Server Action stub uses an env var `GHL_WAITLIST_WEBHOOK_URL`.
- Add placeholder in `.env.local` (commented out) so it's documented but doesn't block local dev.
- Plan 03-10 (waitlist GHL webhook integration) blocks until URL is provided.

---

## D-05 — Static Bricolage font cuts → DELETE

**Question:** Keep ~30 static Bricolage font cuts, or delete (saves ~10 MB) since the variable font covers all weights/sizes?

**Decision:** **Delete.** Bricolage Grotesque variable font (`BricolageGrotesque-VariableFont_opsz_wdth_wght.ttf`) covers weights 200–800 and optical sizes 12–96pt — same range as all the static cuts combined. The static cuts were never loaded by `colors_and_type.css`'s `@font-face` declarations; they were dormant binary in the repo.

**Executed:** static cuts removed in this commit via `git rm` (see commit body for file count).

**Kept fonts (the canonical set):**
- `BricolageGrotesque-VariableFont_opsz_wdth_wght.ttf` (variable; weights 200–800, optical sizes 12–96pt)
- `CherryBombOne-Regular.ttf` (wordmark)
- `InterTight-VariableFont_wght.ttf` + `InterTight-Italic-VariableFont_wght.ttf` (body, upright + italic)
- `ShadowsIntoLightTwo-Regular.ttf` (hand accent)
- `fonts/README.md`

**Reversibility note:** if a Phase 3 / 4 environment can't load variable fonts (specific PDF generators, sandboxed image renderers), specific static cuts can be re-added. Current canonical set is sufficient for any modern browser.

---

## Decisions still open (handled in later phases or by Jordan)

- **Final Shopify pricing tiers / SKU naming** — handled by Jordan in Shopify Admin during Phase 3, not a code-side decision.
- **DNS cutover plan for `shmocard.com`** — Phase 4.
- **Specific GHL webhook URL** — provided when waitlist forms are wired (mid-Phase 3).
- **`ui_kits/website/` cosmetic reorganization** (audit issue #2) — defer; can roll into Phase 3 reference-page translation if it surfaces friction.
- **Buybox.html double-loads fonts** (audit issue #6) — trivial; defer to Phase 3 cleanup.
- **Preview numbering gaps** (audit issue #8) — defer indefinitely; cosmetic only.

---

## Decisions table for PROJECT.md Key Decisions update

These should land in `.planning/PROJECT.md` Key Decisions table:

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Cart state via Zustand + localStorage | Standard headless-commerce pattern; small bundle; persists for free | ✓ Locked 2026-05-07 |
| `framer-motion` for section-level motion (CSS for hover) | Premium feel for sub-brand reveals + drawer entrances; design system motion constraints (subtle/fast/non-bouncy) preserved | ✓ Locked 2026-05-07 |
| Assets live in `public/`, not in design system folder | Next.js convention; clean code/asset separation | ✓ Locked 2026-05-07 |
| Delete redundant static Bricolage font cuts | Variable font covers same range; ~10 MB repo savings | ✓ Locked 2026-05-07 |
| GHL webhook URL — deferred to Phase 3 | URL not yet provisioned; doesn't block design system review | — Pending |

---

## Next step

**02-07** — Phase 2 close-out. Updates root `CLAUDE.md`, `scope.md`, `handoff.md`, PROJECT.md, ROADMAP.md to reflect Phase 2 complete. Final cross-reference check (no broken paths, no stale "pending" mentions, no remaining audit-finding open questions). Then Phase 2 is marked closed.

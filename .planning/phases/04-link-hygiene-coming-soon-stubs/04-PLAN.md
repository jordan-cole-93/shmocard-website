---
phase: 04-link-hygiene-coming-soon-stubs
phase_number: 4
phase_name: Link hygiene & Coming Soon stubs
status: planning
depends_on: [phase-3]
total_plans: 6
autonomous: false
last_updated: "2026-05-20"
requirements: [PH4-CS-COMP, PH4-CS-ROUTES, PH4-LINK-AUDIT, PH4-NAV-VERIFY]
---

# Phase 4 — Link hygiene & Coming Soon stubs

## Goal

Every link on every built page (`/`, `/shmo-review`, `/shmo-review/cr-80`) resolves to either a real page or a Coming Soon placeholder. No 404s, no dead anchor stubs leaking through the nav.

Phase 4 ships:
1. ONE shared `<ComingSoon>` component at `components/ComingSoon.tsx` (Shmocard design-system primitives only).
2. FIVE thin `page.tsx` stubs that compose `<ComingSoon>` with sub-brand-specific props.
3. TEN `href` upgrades across `NavMenu.tsx`, `Footer.tsx`, `FormatPicker.tsx` (3 + 5 + 2 per RESEARCH.md Q4).
4. Mobile + desktop link verification across nav + footer + format picker.

All UI work routes through the `design-system-builder` subagent. The parent never writes `.tsx` / `.css` directly.

## Success criteria (TRUE = green)

(Derived from ROADMAP.md Phase 4 + RESEARCH.md Validation Architecture.)

1. Browser renders all 5 Coming Soon stub routes — `/shmo-biz`, `/shmo-link`, `/shmo-reputation`, `/shmo-review/l-sign`, `/shmo-review/square-card` — with no console errors and `npx tsc --noEmit` clean after every plan.
2. The `<ComingSoon>` component uses ONLY design-system primitives — `.shm-section`, `.shm-section-head`, `.shm-eyebrow`, `.shm-h1`, `.shm-lede`, `.shm-field`, `.shm-input`, `.shm-btn`, `.shm-field__hint`. No `.foo__btn`, no Tailwind for color/type/radius/shadow/motion, no hex outside SVG.
3. Email-capture stub is VISIBLE but DISABLED per Jordan's locked decision (D-01). Input + button render with `disabled` attribute; helper text reads "We'll let you know" (or RESEARCH.md variant "We'll email you when this launches.").
4. Each Coming Soon page uses a different mascot pose from `public/mascot/` to visually differentiate the sub-brands (D-03). Sub-brand identity comes from copy + eyebrow + accent, not bespoke mascots.
5. All 10 hrefs flagged in RESEARCH.md Q4 are upgraded:
   - `NavMenu.tsx` lines 51 / 59 / 68: `#shmo-biz` → `/shmo-biz`, `#shmo-link` → `/shmo-link`, `#shmo-reputation` → `/shmo-reputation`.
   - `Footer.tsx` lines 47 / 48 / 49 / 57 / 58: same 3 sub-brand routes + L-Sign + Square Card.
   - `FormatPicker.tsx` `PRODUCT_PAGE_HREFS` for L-Sign and Square: `#formats` → `/shmo-review/l-sign` and `/shmo-review/square-card`.
6. Footer `<a>` tags for L-Sign and Square Card upgraded to Next.js `<Link>` (RESEARCH.md Q5 + Open Question 3).
7. Mobile nav (hamburger at 375px) opens, each link navigates correctly to its Coming Soon route — verified by Playwright screenshot.
8. Footer nav at 375px renders identically and all 5 upgraded links navigate correctly.
9. No `href="#shmo-*"` anchor links remain in `NavMenu.tsx` or `Footer.tsx`. (Deferred social `#` and policy `#` hrefs from RESEARCH.md Q4 "Deferred stubs" stay as-is — out of scope.)
10. Section bg for every Coming Soon page is `marsh` (RESEARCH.md Q6). No wave divider rendered (single-section page, `<Section bg="marsh">` without `nextBg` per `Section.tsx:74`).
11. `<ComingSoon>` is a pure server component — no `"use client"`, no `useState`, no JS handlers (RESEARCH.md Pitfall 2). Email input is `disabled`, so no client state is needed.
12. No Shopify writes, no payment / domain / theme touches. Phase 4 is frontend-only.

## Implementation strategy

**One component, five stubs, ten hrefs, one mobile pass.**

1. **04-01** builds the `<ComingSoon>` component via `design-system-builder` dispatch and creates ONE stub route (`/shmo-biz`) as the proof-of-concept render target. Component + first stub ship together so Jordan can review the actual page rendered in the browser, not a hypothetical.
2. **04-02** is a `checkpoint:human-verify`. Jordan reviews `/shmo-biz` at desktop + mobile, approves the composition (or sends polish feedback). Below remaining stubs begin only after his approval.
3. **04-03** stubs the remaining 4 routes — `/shmo-link`, `/shmo-reputation`, `/shmo-review/l-sign`, `/shmo-review/square-card` — each as a thin `page.tsx` composing the approved component with its sub-brand props. Single builder dispatch.
4. **04-04** upgrades all 10 hrefs across `NavMenu.tsx`, `Footer.tsx`, `FormatPicker.tsx`. Single builder dispatch — surgical edits to existing files, primitives untouched.
5. **04-05** runs the mobile nav + footer nav verification — Playwright screenshots at 375px + desktop, click-through of every upgraded link.
6. **04-06** is phase close-out — full-site link smoke test (visit every built page, confirm every link resolves), final screenshots, `tsc --noEmit` + `npm run build` clean, commit phase-end summary.

**All UI work goes through `design-system-builder`.** Every dispatch in this phase carries the standard guardrails (primitives only, no Tailwind for color/type, no hex outside SVG, no `"use client"` on ComingSoon). Plans 04-03 and 04-04 also flag "this is a polish task — LAYOUT IS LOCKED" because the layout was approved in 04-02 and these plans only replicate or upgrade hrefs, not restructure.

**Section rotation:** Every Coming Soon page is single-section `marsh`. No wave divider (RESEARCH.md Q6 + Q7).

---

## Atomic plans

### 04-01 — Build `<ComingSoon>` component + `/shmo-biz` stub

- **Goal:** Ship the shared `<ComingSoon>` component AND one stub route so Jordan can review the rendered output. The component composes `.shm-section` + `.shm-section-head` + disabled email-capture field; the stub feeds it Shmo Biz props.
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor` (read-only verify)
- **Files touched:**
  - `components/ComingSoon.tsx` (new — shared component)
  - `app/shmo-biz/page.tsx` (new — first stub route)
- **Requirement IDs:** PH4-CS-COMP, PH4-CS-ROUTES (partial — 1 of 5 routes here)
- **Builder prompt anchor:** "Build a shared `<ComingSoon>` component at `components/ComingSoon.tsx` as a pure SERVER component (no `\"use client\"`, no `useState`). Props interface: `{ eyebrow: string; title: React.ReactNode; lede: string; mascotPose?: string; }`. Composition (exact primitive order per `.claude/skills/shmocard-design-system/PRIMITIVES.md`):

```tsx
<Section bg=\"marsh\">  // imported from @/components/layout/Section — NO nextBg prop, no wave
  <div className=\"shm-section-head\">
    <span className=\"shm-eyebrow\">{eyebrow}</span>
    <h1 className=\"shm-h1\">{title}</h1>   // title may include <em> for accent
    <p className=\"shm-lede\">{lede}</p>
  </div>

  {/* Disabled email-capture stub — per Jordan's locked D-01 */}
  <div className=\"shm-field\">
    <label className=\"shm-field__label\" htmlFor=\"coming-soon-email\">Get notified when it's live</label>
    <input
      id=\"coming-soon-email\"
      className=\"shm-input\"
      type=\"email\"
      placeholder=\"your@email.com\"
      disabled
    />
    <button
      className=\"shm-btn shm-btn--primary\"
      disabled
      type=\"button\"
    >
      We'll let you know
    </button>
    <span className=\"shm-field__hint\">We'll email you when this launches.</span>
  </div>

  {/* Mascot — sticker sized, optional via mascotPose prop */}
  {mascotPose ? (
    <img
      src={`/mascot/mascot-${mascotPose}.png`}
      alt=\"\"
      className=\"shm-mascot--supporting\"
      // .shm-mascot--supporting caps at 140px per components.css line 360
    />
  ) : null}
</Section>
```

Then create `app/shmo-biz/page.tsx` as a 7-line server component:

```tsx
import ComingSoon from \"@/components/ComingSoon\";

export const metadata = { title: \"Shmo Biz — Coming Soon | ShmoCard\" };

export default function ShmoBizPage() {
  return <ComingSoon
    eyebrow=\"Shmo Biz\"
    title={<>Business profile tools for your <em>crew</em>.</>}
    lede=\"One dashboard to manage your Google Business Profile — reviews, updates, and photos. Coming soon.\"
    mascotPose=\"holding-card\"
  />;
}
```

Hard rules: every utility class is `.shm-` prefixed. NO Tailwind for color/type/radius/shadow/motion. NO `\"use client\"`. NO hex colors. NO custom CSS file — the component composes existing primitives only. Email input + button MUST stay `disabled` (D-01). Mascot file path must be one of the 13 verified poses in `public/mascot/` (waving, thinking, pointing, holding-card, heart-hands, megaphone, thumbs-up, celebrating, charge, confused, money-gesture, star-burst, tap-moment); using `holding-card` for Shmo Biz."

- **Verification:**
  - `npx tsc --noEmit` clean.
  - Visit `/shmo-biz` in browser → page renders marsh bg, eyebrow + h1 + lede + disabled email field + holding-card mascot.
  - No console errors.
  - `design-system-auditor` returns PASS (every class is `.shm-*` prefixed, no `.foo__btn`, no hex outside SVG, no restyled primitives, server component confirmed).
  - Playwright screenshot saved to `pictures/screenshots/coming-soon-shmo-biz-desktop.png` and `coming-soon-shmo-biz-mobile.png` (375px).
- **Commit message format:** `feat(coming-soon): add ComingSoon component + Shmo Biz stub`

---

### 04-02 — Coming Soon composition checkpoint

- **Goal:** Jordan reviews `/shmo-biz` at desktop + mobile in the browser and approves the `<ComingSoon>` composition. Below remaining 4 stubs begin only after his approval. Polish feedback (spacing, mascot placement, email-stub framing) lands here as a builder dispatch BEFORE 04-03 replicates the component across 4 more routes — fixing it once is cheaper than fixing it five times.
- **Type:** `checkpoint:human-verify`
- **Files touched:** NONE if Jordan approves as-is. If polish needed → `components/ComingSoon.tsx` via `design-system-builder` dispatch flagged "this is a polish task — LAYOUT IS LOCKED."
- **Requirement IDs:** PH4-CS-COMP (review gate)
- **Verification:**
  - Dev server running, `/shmo-biz` open at desktop (1280px) and mobile (375px).
  - No console errors, `npx tsc --noEmit` clean.
  - Screenshots from 04-01 visible in `pictures/screenshots/`.
- **Checkpoint:** Jordan approves the composition. **No further stub routes begin until this approval lands.** If polish is requested, the builder agent is re-dispatched with "this is a polish task — LAYOUT IS LOCKED, do not change grid, ordering, structural HTML — spacing / type / color / mascot scale only." After polish lands, re-checkpoint.
- **Commit message format:** No commit unless polish lands → `polish(coming-soon): tighten composition per review`

---

### 04-03 — Stub remaining 4 Coming Soon routes

- **Goal:** Replicate the approved `<ComingSoon>` composition across `/shmo-link`, `/shmo-reputation`, `/shmo-review/l-sign`, `/shmo-review/square-card`. Each is a 7-line `page.tsx` composing `<ComingSoon>` with sub-brand props per RESEARCH.md Q3 copy table. Each page uses a DIFFERENT mascot pose to visually differentiate sub-brands (D-03).
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor`
- **Files touched:**
  - `app/shmo-link/page.tsx` (new)
  - `app/shmo-reputation/page.tsx` (new)
  - `app/shmo-review/l-sign/page.tsx` (new)
  - `app/shmo-review/square-card/page.tsx` (new)
- **Requirement IDs:** PH4-CS-ROUTES
- **Builder prompt anchor:** "Create 4 thin `page.tsx` server components, each a 7-line composition of `<ComingSoon>` from `@/components/ComingSoon`. This is a polish task — LAYOUT IS LOCKED, do not modify `components/ComingSoon.tsx`, do not change its structure, do not add new CSS. Replicate the pattern from `app/shmo-biz/page.tsx` exactly with these per-route props (sourced verbatim from `.planning/phases/04-link-hygiene-coming-soon-stubs/04-RESEARCH.md` Q3):

**`app/shmo-link/page.tsx`** — `metadata.title: \"Shmo Link — Coming Soon | ShmoCard\"`, eyebrow `\"Shmo Link\"`, title `<>Smart NFC links for anywhere you <em>work</em>.</>`, lede `\"Program a card once. Send customers anywhere — menu, booking page, your Instagram. Reprogrammable for life.\"`, mascotPose `\"heart-hands\"`.

**`app/shmo-reputation/page.tsx`** — `metadata.title: \"Shmo Reputation — Coming Soon | ShmoCard\"`, eyebrow `\"Shmo Reputation\"`, title `<>Your reviews. Your <em>dashboard</em>.</>`, lede `\"Track, respond, and grow your reputation from one place. No switching tabs, no copy-paste.\"`, mascotPose `\"megaphone\"`.

**`app/shmo-review/l-sign/page.tsx`** — `metadata.title: \"Shmo Review · L-Sign — Coming Soon | ShmoCard\"`, eyebrow `\"Shmo Review · L-Sign\"`, title `<>Counter standee. Tap, scan, <em>done</em>.</>`, lede `\"Lives next to the register. Guests tap on their way out — no staff prompt needed. 4×6 acrylic, ships pre-programmed.\"`, mascotPose `\"pointing\"`.

**`app/shmo-review/square-card/page.tsx`** — `metadata.title: \"Shmo Review · Square Card — Coming Soon | ShmoCard\"`, eyebrow `\"Shmo Review · Square Card\"`, title `<>Sticks to anything. Stays <em>everywhere</em>.</>`, lede `'An adhesive-backed disc for laptops, tablets, registers, dashboards. Travels with the crew. 2.25\" disc, ships pre-programmed.'`, mascotPose `\"thumbs-up\"`.

All 4 mascot poses are verified-present in `public/mascot/` (heart-hands.png, megaphone.png, pointing.png, thumbs-up.png). No new CSS, no Tailwind utilities, no `\"use client\"`, no hardcoded hex. Each `page.tsx` is a pure server component."

- **Verification:**
  - `npx tsc --noEmit` clean.
  - Visit all 4 routes in browser. Each renders distinct sub-brand copy + a different mascot pose.
  - No console errors on any of the 4 routes.
  - `design-system-auditor` returns PASS — confirms each page.tsx imports `ComingSoon`, uses only the approved props, no inline styles, no Tailwind for visual concerns.
  - Playwright screenshots: `pictures/screenshots/coming-soon-shmo-link.png`, `coming-soon-shmo-reputation.png`, `coming-soon-l-sign.png`, `coming-soon-square-card.png`.
- **Commit message format:** `feat(coming-soon): stub 4 remaining sub-brand routes`

---

### 04-04 — Link audit: upgrade 10 hrefs across Nav, Footer, FormatPicker

- **Goal:** Upgrade every flagged href to its real route. Surgical edits to 3 existing files. No primitive changes, no layout changes.
- **Type:** `auto` → `design-system-builder` dispatch → `design-system-auditor`
- **Files touched:**
  - `components/NavMenu.tsx` (3 href changes, lines 51 / 59 / 68 per RESEARCH.md Q4)
  - `components/Footer.tsx` (5 href changes, lines 47 / 48 / 49 / 57 / 58 + upgrade 2 `<a>` → `<Link>` for L-Sign and Square Card)
  - `components/shmo-review/FormatPicker.tsx` (2 href changes in `PRODUCT_PAGE_HREFS` lines 79 / 80)
- **Requirement IDs:** PH4-LINK-AUDIT
- **Builder prompt anchor:** "This is a polish task — LAYOUT IS LOCKED. Do NOT change any class names, do NOT modify any CSS, do NOT restructure JSX. The ONLY changes allowed are href string values and `<a>` → `<Link>` element upgrades.

**`components/NavMenu.tsx`** — change exactly 3 href attributes:
- Line ~51: `href=\"#shmo-biz\"` → `href=\"/shmo-biz\"`
- Line ~59: `href=\"#shmo-link\"` → `href=\"/shmo-link\"`
- Line ~68: `href=\"#shmo-reputation\"` → `href=\"/shmo-reputation\"`

NavMenu is a `"use client"` component (verified in RESEARCH.md Q5 / Open Q3 RESOLVED) — `<Link>` is safe; hamburger open/close is toggle state, not dependent on `<a>` click semantics. Upgrade bare `<a>` to `<Link>` with `import Link from "next/link"` if not already imported. If they are already `<Link>`, just change the href.

**`components/Footer.tsx`** — change exactly 5 href attributes:
- Line ~47: `href=\"#shmo-biz\"` → `href=\"/shmo-biz\"`
- Line ~48: `href=\"#shmo-link\"` → `href=\"/shmo-link\"`
- Line ~49: `href=\"#shmo-reputation\"` → `href=\"/shmo-reputation\"`
- Line ~57: `href=\"/shmo-review#formats\"` (L-Sign Footer link) → `href=\"/shmo-review/l-sign\"`
- Line ~58: `href=\"/shmo-review#formats\"` (Square Card Footer link) → `href=\"/shmo-review/square-card\"`

For the L-Sign and Square Card Footer links specifically: upgrade `<a href=\"...\">...</a>` to `<Link href=\"...\">...</Link>` (import `Link` from `next/link` if not already imported). These are internal routes — `<Link>` gives prefetching and client-side nav. The 3 sub-brand Footer links (Biz / Link / Reputation) can also upgrade to `<Link>` if convenient (same import already used), but at minimum the L-Sign and Square Card ones MUST upgrade per RESEARCH.md Open Question 3.

**`components/shmo-review/FormatPicker.tsx`** — change exactly 2 entries in the `PRODUCT_PAGE_HREFS` config object (around lines 79-80):
- L-Sign handle: `\"#formats\"` → `\"/shmo-review/l-sign\"`
- Square Card handle: `\"#formats\"` → `\"/shmo-review/square-card\"`
- Leave the CR-80 handle unchanged (already `/shmo-review/cr-80`).

ALL other hrefs in these three files stay unchanged. Deferred stubs (Footer social `#`, `#how` anchor, policy page `#` stubs) are out of scope for Phase 4 per RESEARCH.md Q4 'Deferred stubs' table — they remain `#`."

- **Verification:**
  - `grep -rn 'href=\"#shmo-biz\"\\|href=\"#shmo-link\"\\|href=\"#shmo-reputation\"' components/` returns ZERO matches (anchor stubs eliminated).
  - `grep -rn 'href=\"/shmo-review#formats\"' components/Footer.tsx` returns ZERO matches.
  - `grep -rn '\"#formats\"' components/shmo-review/FormatPicker.tsx` returns ZERO matches (or only matches an unused constant — confirm).
  - `npx tsc --noEmit` clean.
  - `design-system-auditor` returns PASS — confirms no class names changed, no JSX structure changed, only href values and element-type swaps.
  - No console errors when visiting `/`, `/shmo-review`, `/shmo-review/cr-80`.
- **Commit message format:** `fix(links): upgrade anchor stubs to real Coming Soon routes`

---

### 04-05 — Mobile nav + footer nav verification

- **Goal:** Click-through every upgraded link at desktop (1280px) AND mobile (375px). Capture screenshots proving the hamburger opens, each link navigates correctly, and the footer renders identically on mobile.
- **Type:** `checkpoint:human-verify` (Jordan verifies the click-through in his own browser AND/OR reviews the screenshots)
- **Files touched:** NONE (verification only). If a click-through fails, surface it as a defect → builder fixes it under a follow-up dispatch flagged "LAYOUT IS LOCKED."
- **Requirement IDs:** PH4-NAV-VERIFY
- **Verification steps (run in order):**
  1. Dev server running at localhost:3000.
  2. Visit `/` at 1280px desktop width. Open the NavMenu dropdown — click each of Shmo Review, Shmo Biz, Shmo Link, Shmo Reputation. Each MUST navigate to its real route (no scroll-to-anchor, no 404). Save screenshot of NavMenu open to `pictures/screenshots/nav-links-upgraded-desktop.png`.
  3. Resize to 375px mobile. Tap the hamburger trigger. Hamburger opens. Tap each of Shmo Review, Shmo Biz, Shmo Link, Shmo Reputation — each navigates correctly. Save screenshot of hamburger open to `pictures/screenshots/nav-links-upgraded-mobile.png`.
  4. Scroll to Footer at desktop. Click each Footer Products column link: Shmo Review, L-Sign, Square Card, Shmo Biz, Shmo Link, Shmo Reputation. All 6 navigate correctly. Save screenshot to `pictures/screenshots/footer-links-upgraded-desktop.png`.
  5. Resize to 375px. Footer renders correctly stacked. Tap each link — all 6 navigate correctly. Save screenshot to `pictures/screenshots/footer-links-upgraded-mobile.png`.
  6. Visit `/shmo-review`. Scroll to the `FormatPicker`. Click the L-Sign tile — navigates to `/shmo-review/l-sign`. Back. Click the Square Card tile — navigates to `/shmo-review/square-card`. Save screenshot to `pictures/screenshots/format-picker-upgraded.png`.
  7. No console errors at any step.
- **Checkpoint:** Jordan confirms every link in every nav surface navigates correctly. If any link fails → file the bug, dispatch the builder with a fix, re-verify.
- **Commit message format:** No commit unless a bug is found → `fix(links): <specific fix>`

---

### 04-06 — Phase close-out: full-site link smoke test + screenshots

- **Goal:** Final sweep before declaring Phase 4 done. Visit every built page (`/`, `/shmo-review`, `/shmo-review/cr-80`, all 5 Coming Soon stubs). Confirm every link on every page resolves to a real page OR a Coming Soon stub OR a deferred-by-design `#` per RESEARCH.md Q4 "Deferred stubs" table. No 404s. No console errors.
- **Type:** `checkpoint:human-verify` (smoke test + screenshot capture, no code changes expected)
- **Files touched:** NONE (verification only). If smoke test surfaces a bug, file it as a follow-up.
- **Requirement IDs:** PH4-LINK-AUDIT, PH4-NAV-VERIFY (phase exit)
- **Verification steps:**
  1. `npx tsc --noEmit` — clean.
  2. `npm run build` — clean. No build errors.
  3. Dev server running. Visit every page in order: `/`, `/shmo-review`, `/shmo-review/cr-80`, `/shmo-biz`, `/shmo-link`, `/shmo-reputation`, `/shmo-review/l-sign`, `/shmo-review/square-card`. Each loads without console errors.
  4. On every page, eyeball every nav + footer link. Confirm none resolve to 404. Deferred stubs (`#`, `#how`) are allowed — flag in `.planning/phases/04-link-hygiene-coming-soon-stubs/04-SUMMARY.md` (NOT in `pictures/screenshots/` — that path is reserved for image files per `.claude/rules/file-organization.md`) if any genuinely-dead anchor turns up beyond the deferred list.
  5. Full-page screenshot at 1280px and 375px for the 5 Coming Soon stubs. Save to `pictures/screenshots/coming-soon-{slug}-{width}.png` (8 files total — 4 stubs already captured in 04-03, the 5th Shmo Biz from 04-01; this step captures any missing widths and reruns if compositions changed in 04-02).
  6. Update `.planning/STATE.md` → "Phase 4 complete, Phase 5 (L-Sign PDP) ready."
  7. Update `context/general/handoff.md` with a short Phase 4 close summary: what shipped, where the Coming Soon component lives, which hrefs were upgraded, which stubs remain deferred and why.
- **Checkpoint:** Jordan confirms the full-site smoke test passes. Phase 4 is closed.
- **Commit message format:** `chore(phase-4): close out link hygiene + Coming Soon phase`

---

## Open decisions

These are decision points that may surface during execution. The locked decisions from Jordan are already baked in above and not re-litigable.

1. ✅ **`NavMenu.tsx` `<a>` vs `<Link>`** — RESOLVED (RESEARCH.md Q5 / Open Q3): NavMenu is `"use client"`, `<Link>` is safe. Upgrade all bare `<a>` to `<Link>` during the href edit.
2. ✅ **Footer 3 sub-brand links — also upgrade to `<Link>`?** — RESOLVED: yes, single `import Link from "next/link"` covers all 5 Footer href upgrades. No incremental cost.
3. **Mascot pose choice per page** (04-03). Locked decisions D-03 says "recommend a different pose per page." Current plan:
   - `/shmo-biz` → `holding-card`
   - `/shmo-link` → `heart-hands`
   - `/shmo-reputation` → `megaphone`
   - `/shmo-review/l-sign` → `pointing`
   - `/shmo-review/square-card` → `thumbs-up`
   Jordan can swap any of these at the 04-02 checkpoint — they're trivial 1-line changes.
4. **Polish iteration scope at 04-02.** The most likely polish requests are: mascot size, eyebrow + h1 vertical spacing, email-field placement (above vs below the lede), helper-text copy. All are "spacing / type / mascot scale only" and fit the LAYOUT IS LOCKED constraint. If Jordan asks for structural changes (grid columns, element order, section bg change), that's a re-plan trigger, not a polish iteration.
5. **`shm-mascot--supporting` 140px cap with `mascot-fit-ratio`.** The mascot will render at `calc(140px * var(--mascot-fit-ratio))` per `components.css:360`. If the unscaled 140px reads too large on the Coming Soon page (single section, lots of headroom), the builder can wrap in a sticker variant (`.shm-sticker--md`, 76px) instead. This is a 04-02 polish decision, not a re-plan trigger.

---

## Risks

1. **`<Link>` import missing in Footer.tsx.** If `Footer.tsx` doesn't import `next/link`, the upgrade in 04-04 adds the import. Builder must confirm at edit time. Low risk — Next.js convention is universal.
2. **NavMenu hamburger interaction breaks on `<Link>` swap.** If NavMenu's hamburger logic depends on `<a>` click behavior (e.g., explicit `e.preventDefault` patterns), swapping to `<Link>` could change the interaction. Mitigation: 04-04 instructs the builder to leave `<a>` if uncertain and just change the href value. Auditor catches.
3. **Builder restructures `<ComingSoon>` during polish in 04-02.** The polish iteration could drift into layout changes. Mitigation: every polish dispatch carries "this is a polish task — LAYOUT IS LOCKED" verbatim. MEMORY rule reinforces.
4. **Mascot poses not at the expected paths.** Verified at planning time: all 5 chosen poses (`holding-card`, `heart-hands`, `megaphone`, `pointing`, `thumbs-up`) exist under `public/mascot/mascot-*.png`. Low risk.
5. **Email input `disabled` state visually misleading.** Disabled inputs can look "broken" rather than "intentional." Mitigation: the helper text "We'll email you when this launches." plus button label "We'll let you know" make intent explicit (D-01). 04-02 checkpoint is where Jordan validates this reads correctly.
6. **`grep` confirms anchor stub elimination but misses dynamic hrefs.** RESEARCH.md Q4 used static grep. If anyone added a dynamic href like ``href={`#${slug}`}`` after research was captured, 04-04 misses it. Mitigation: 04-05 click-through test catches any anchor-stub link that slips past static analysis.
7. **`/shmo-review#formats` Footer anchor was the L-Sign + Square Card fallback.** After 04-04 upgrades those Footer items to `/shmo-review/l-sign` and `/shmo-review/square-card`, the `#formats` anchor on `/shmo-review` itself still exists as an on-page section. Make sure nothing else still depends on `#formats` Footer wiring. Mitigation: grep before/after, confirm no stale references.
8. **Deferred `#` stubs flagged as bugs in 04-06.** Jordan or a future reviewer could mistake the deferred social / policy `#` stubs for Phase 4 bugs. Mitigation: 04-06 surfaces them as "deferred by design per Phase 4 scope, slated for Phase 10."

---

## Threat model

**Trust boundaries:**

| Boundary | Description |
|---|---|
| Browser → DOM | Static HTML from server components only; no user input persisted; no runtime JS |
| User → email-capture stub | Input is `disabled` — no event handlers, no form submission, no data flows past the DOM in Phase 4 |
| Render → href values | All hrefs are static string literals authored in code; none come from runtime data |

**STRIDE register (ASVS L1, project default = block on `high` only):**

| Threat ID | Category | Component | Disposition | Mitigation |
|---|---|---|---|---|
| T-04-01 | Tampering (XSS) | `ComingSoon.tsx` email input | mitigate | Input is `disabled` AND has no `onChange` / `onSubmit` handler. No value flows from the DOM into any state. When Phase 9 enables the input, the consuming form MUST escape value via React's default JSX text-node escaping. Document this contract in `components/ComingSoon.tsx` as a code comment: `// Phase 4: disabled stub. Phase 9 must keep React's default JSX escaping or add explicit input sanitization before submission.` |
| T-04-02 | Information Disclosure (open redirect) | `NavMenu.tsx`, `Footer.tsx`, `FormatPicker.tsx` hrefs | mitigate | All upgraded hrefs are static absolute internal paths (`/shmo-*`). No `href` value in Phase 4 is constructed from user input, query params, or runtime data. Builder + auditor confirm at edit time that every changed href is a string literal, not a template that takes external input. |
| T-04-03 | Information Disclosure (leaked secrets in copy) | All Coming Soon page.tsx files | mitigate | Coming Soon copy is sourced from `context/general/marketing.md` (RESEARCH.md Q3 table). No internal URLs, API tokens, or route names beyond `/shmo-*` public paths appear in the copy. Auditor scans for `process.env`, `localhost`, internal-only URLs in the rendered text — none should appear. |
| T-04-04 | Repudiation / Spoofing (mascot src) | `ComingSoon.tsx` `<img src>` | accept | Mascot src is constructed from `mascotPose` prop literal, which is hardcoded in each `page.tsx`. No runtime data, no user input. Risk: if `mascotPose` value is mistyped, src 404s but page still renders. Low impact — visual defect only, caught by 04-05 click-through. |
| T-04-05 | Denial of Service (server load) | All 5 Coming Soon pages | accept | Pure server components with no DB, no API, no runtime data. Static render cost is negligible. No DoS surface beyond standard Next.js SSR. |
| T-04-06 | Elevation of Privilege (auth bypass) | N/A — Phase 4 has no auth surface | accept | No auth, no admin, no user identity flows in Phase 4. Out of scope. |

**Block-on:** `high` severity only. All Phase 4 threats are `low` or already mitigated by static composition. No `high` threats — phase ships.

---

## Phase exit criteria

Phase 4 is complete when:

- All 6 plans (04-01 through 04-06) are committed in order.
- `components/ComingSoon.tsx` exists, is a pure server component, composes only `.shm-*` primitives, has the disabled email-capture stub baked in.
- All 5 Coming Soon stub routes render at `/shmo-biz`, `/shmo-link`, `/shmo-reputation`, `/shmo-review/l-sign`, `/shmo-review/square-card` with distinct mascot poses and sub-brand-specific copy.
- All 10 hrefs upgraded (3 NavMenu + 5 Footer + 2 FormatPicker). `grep` for `#shmo-biz`, `#shmo-link`, `#shmo-reputation`, `/shmo-review#formats`, `"#formats"` in `components/` returns zero matches.
- Mobile nav (375px) and footer nav both verified — every upgraded link navigates correctly.
- Full-site smoke test passes — every link on `/`, `/shmo-review`, `/shmo-review/cr-80`, and the 5 Coming Soon stubs resolves correctly (or is a deferred `#` per RESEARCH.md Q4 deferred list).
- `npx tsc --noEmit` clean.
- `npm run build` clean.
- No console errors on any built page.
- Playwright screenshots saved to `pictures/screenshots/` per the protocol in each plan.
- `.planning/STATE.md` updated to "Phase 4 complete, Phase 5 (L-Sign PDP) ready."
- `context/general/handoff.md` updated with Phase 4 close summary.

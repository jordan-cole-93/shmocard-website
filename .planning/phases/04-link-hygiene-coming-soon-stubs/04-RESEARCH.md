# Phase 4: Link Hygiene & Coming Soon Stubs — Research

**Researched:** 2026-05-20
**Domain:** Next.js App Router routing + Shmocard design system component composition
**Confidence:** HIGH — all findings verified directly from codebase

---

## Recommended Approach (planner scan)

1. Build ONE shared `<ComingSoon>` component at `components/ComingSoon.tsx` that accepts `title`, `eyebrow`, `lede`, and `accentColor` props. No per-sub-brand files — props handle bespoke copy.
2. Create 5 `page.tsx` stubs under `app/`: `shmo-biz/`, `shmo-link/`, `shmo-reputation/`, `shmo-review/l-sign/`, `shmo-review/square-card/`. Each is a 5-line server component that renders `<ComingSoon>` with its brand-specific props.
3. Upgrade the 3 anchor links in `NavMenu.tsx` and the 3 anchor links in `Footer.tsx` (Products column) from `href="#shmo-biz"` etc. to `href="/shmo-biz"` etc.
4. Upgrade `FormatPicker.tsx` `PRODUCT_PAGE_HREFS` for L-Sign and Square from `"#formats"` to their real routes.
5. Leave all `href="#"` stubs (social links, Shipping, Contact, Privacy, Terms) as-is — those are out of scope for Phase 4 (no real pages to link to).
6. Email-capture stub: render `.shm-field` + `.shm-input` + `.shm-btn--primary` but keep the button `disabled` with label "Notify me when it's live" — no JS, no backend. This matches the pattern already used in `FormatPicker` for unavailable products.
7. Section bg for Coming Soon hero: `marsh` (default). Single section, no wave divider needed (nav above, footer below closes it).
8. All `.tsx` work routes through `design-system-builder` subagent per `subagent-dispatch.md`.

---

## Project Constraints (from CLAUDE.md)

- Every utility class is `.shm-` prefixed. No exceptions.
- UI work (`*.tsx` / `*.css` in `app/` or `components/`) routes through the `design-system-builder` project-local subagent. Parent orchestrator does NOT write UI code directly.
- No new top-level folders without Jordan's approval. New routes go under `app/` per Next.js conventions; new shared component goes in `components/` root.
- Never break `shop.shmocard.com`. Phase 4 is frontend-only — no Shopify Admin, no payment, no domain touching.
- `FormatPicker.tsx` already fetches Shopify products. The href fix (`"#formats"` → real PDP routes) is a config-object change only, not a Shopify mutation — safe per `live-store-protection.md`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Coming Soon page render | Frontend Server (SSR) | — | Server component, no client state needed |
| Route existence (stub pages) | Frontend Server (SSR) | — | `app/[route]/page.tsx` files — Next.js routing, no API layer |
| Email-capture stub input | Browser / Client | — | Controlled input needs `"use client"` if interactive; disabled static input can stay server |
| Link href correctness | Frontend Server (SSR) | — | Static props in Nav, Footer, FormatPicker — no runtime logic |
| Mobile nav open/close | Browser / Client | — | Already in `NavMenu.tsx` (existing client component) |

---

## Q1: ComingSoon Component Composition

**Which `.shm-*` primitives compose the Coming Soon hero?**

Verified from `PRIMITIVES.md` and `components.css` (source of truth):

```tsx
// Recommended composition — all primitives verified in components.css
<Section bg="marsh">                         // .shm-section .shm-bg-marsh
  <div className="shm-section-head">         // eyebrow + heading + lede block
    <span className="shm-eyebrow">...</span> // uppercase pill ✦ ember mark
    <h1 className="shm-h1">                 // Bricolage 800, clamp 36–60px
      Sub-brand <em>name</em>
    </h1>
    <p className="shm-lede">...</p>          // 19px Inter Tight, ink-3
  </div>

  {/* Optional email-capture stub */}
  <div className="shm-field">
    <label className="shm-field__label">Get notified when it's live</label>
    <input
      className="shm-input"
      type="email"
      placeholder="your@email.com"
      disabled                              // no backend wiring in Phase 4
    />
    <button
      className="shm-btn shm-btn--primary"
      disabled
      type="button"
    >
      Notify me when it's live
    </button>
    <span className="shm-field__hint">We'll email you when this launches.</span>
  </div>

  {/* Optional mascot sticker — 0 is often correct */}
  {/* If used: .shm-mascot--supporting (140px max) or .shm-sticker--md (76px) */}
</Section>
```

**Key decisions locked by primitives:**
- `.shm-h1` not `.shm-display` — single-page hero uses display; Coming Soon is one subordinate page in the ecosystem, not the flagship. `shm-h1` (clamp 36–60px) is appropriate.
- `.shm-section-head` centers eyebrow + heading + lede — correct for a single-section page.
- Email input MUST be `disabled` until Phase 9 (no backend). Use `disabled` attribute, not CSS hiding — the field communicates intent to the visitor.
- NO `.shm-badge--status-honey` "Soon" pill inline in the heading — that pattern lives on nav items. On the actual page, the eyebrow carries the "coming soon" framing.
- Mascot: zero or one `.shm-mascot--supporting` (140px). The three sub-brand mascots already exist in `public/` per `scope.md`. Optional — often cleaner without.

**VERIFIED:** All class names confirmed in `PRIMITIVES.md` and usage patterns confirmed in existing components. [VERIFIED: codebase]

---

## Q2: Next.js App Router Stub Page Pattern

**Minimal `page.tsx` shape for 5 stub routes.**

```tsx
// app/shmo-biz/page.tsx — 7 lines. Same pattern for all 5 stubs.
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Shmo Biz — Coming Soon | ShmoCard",
};

export default function ShmoBizPage() {
  return <ComingSoon
    eyebrow="Shmo Biz"
    title="Business profile tools for local shops."
    lede="One dashboard to manage your Google Business Profile — reviews, updates, and photos — without logging in every time."
  />;
}
```

**File locations (locked by `file-organization.md` and Next.js conventions):**

| Route | File path |
|---|---|
| `/shmo-biz` | `app/shmo-biz/page.tsx` |
| `/shmo-link` | `app/shmo-link/page.tsx` |
| `/shmo-reputation` | `app/shmo-reputation/page.tsx` |
| `/shmo-review/l-sign` | `app/shmo-review/l-sign/page.tsx` |
| `/shmo-review/square-card` | `app/shmo-review/square-card/page.tsx` |

**Shared component location:**
- `components/ComingSoon.tsx` — root of `components/`, alongside `Nav.tsx`, `Footer.tsx`

**Server component:** All 5 stub pages and `ComingSoon.tsx` itself can be pure server components. The email input is `disabled` — no `useState`, no `"use client"` needed.

**VERIFIED: codebase** — existing page patterns (`app/shmo-review/cr-80/page.tsx`, `app/page.tsx`) confirm this shape. [VERIFIED: codebase]

---

## Q3: Per-Route Content Strategy

**One shared component with props vs. one file per sub-brand.**

**Decision: one shared `<ComingSoon>` with props.** Rationale: 5 pages share identical layout and primitives; only eyebrow, title, lede, and optional mascot differ. Per-brand files would be 5 near-identical files with 3 lines of copy difference — DRY wins here. Phases 5+6 will replace `/shmo-review/l-sign` and `/shmo-review/square-card` entirely anyway.

**Per-brand copy to use (from `marketing.md`):**

| Route | Eyebrow | Title | Lede |
|---|---|---|---|
| `/shmo-review/l-sign` | "Shmo Review · L-Sign" | "Counter standee. Tap, scan, done." | "Lives next to the register. Guests tap on their way out — no staff prompt needed. 4×6 acrylic, ships pre-programmed." |
| `/shmo-review/square-card` | "Shmo Review · Square Card" | "Sticks to anything. Stays everywhere." | 'An adhesive-backed disc for laptops, tablets, registers, dashboards. Travels with the crew. 2.25" disc, ships pre-programmed.' |
| `/shmo-biz` | "Shmo Biz" | "Business profile tools for your crew." | "One dashboard to manage your Google Business Profile — reviews, updates, and photos. Coming soon." |
| `/shmo-link` | "Shmo Link" | "Smart NFC links for anywhere you work." | "Program a card once. Send customers anywhere — menu, booking page, your Instagram. Reprogrammable for life." |
| `/shmo-reputation` | "Shmo Reputation" | "Your reviews. Your dashboard." | "Track, respond, and grow your reputation from one place. No switching tabs, no copy-paste." |

**Sub-brand positioning source:** `context/general/marketing.md` format-by-format pitches + naming rules. [VERIFIED: codebase]

---

## Q4: Link Audit — Complete Inventory

**All links across built pages, categorized by action needed:**

### Links that resolve to real pages (no change needed)
| File | href | Status |
|---|---|---|
| `Nav.tsx:32` | `/shmo-review` | Real page |
| `Nav.tsx:18` | `/` | Real page |
| `NavMenu.tsx:39` | `/shmo-review` | Real page |
| `Footer.tsx:46` | `/shmo-review` | Real page |
| `Footer.tsx:56` | `/shmo-review#buybox` | Real page + anchor |
| `Footer.tsx:59` | `/shmo-review` | Real page |
| `CartEmpty.tsx:17` | `/shmo-review` | Real page |
| `FinalCta.tsx:26,29` | `/shmo-review` | Real page |
| `Hero.tsx:35` | `/shmo-review` | Real page |
| `Hero.tsx:68` (review branch) | `/shmo-review` | Real page |
| `FormatPicker.tsx` | `/shmo-review/cr-80` | Real page |

### Links that need upgrading to real routes (Phase 4 work)
| File | Current href | New href | Notes |
|---|---|---|---|
| `NavMenu.tsx:51` | `#shmo-biz` | `/shmo-biz` | Anchor-on-homepage → dedicated Coming Soon page |
| `NavMenu.tsx:59` | `#shmo-link` | `/shmo-link` | Same |
| `NavMenu.tsx:68` | `#shmo-reputation` | `/shmo-reputation` | Same |
| `Footer.tsx:47` | `#shmo-biz` | `/shmo-biz` | Same |
| `Footer.tsx:48` | `#shmo-link` | `/shmo-link` | Same |
| `Footer.tsx:49` | `#shmo-reputation` | `/shmo-reputation` | Same |
| `Footer.tsx:57` | `/shmo-review#formats` | `/shmo-review/l-sign` | L-Sign gets its own Coming Soon stub |
| `Footer.tsx:58` | `/shmo-review#formats` | `/shmo-review/square-card` | Square Card gets its own Coming Soon stub |
| `FormatPicker.tsx:79` | `#formats` | `/shmo-review/l-sign` | `PRODUCT_PAGE_HREFS` config object |
| `FormatPicker.tsx:80` | `#formats` | `/shmo-review/square-card` | Same config object |

### Deferred stubs (out of scope for Phase 4 — no real destination exists)
| File | href | Why deferred |
|---|---|---|
| `Footer.tsx:22,29,34` | `#` (Instagram, Facebook, YouTube) | Social accounts pending |
| `Footer.tsx:66` | `#how` | On-page anchor, works if user is on homepage |
| `Footer.tsx:67` | `#` (Shipping & returns) | No policy page — Phase 10 |
| `Footer.tsx:68` | `#` (Contact support) | No contact page — Phase 10 |
| `Footer.tsx:77` | `#` (Privacy, Terms) | No legal pages — Phase 10 |
| `Hero.tsx:38` | `#how` | On-page anchor, resolves on `/` |
| `Hero.tsx:68` (non-review slugs) | `#${sb.slug}` | Homepage section anchors — still valid on homepage; replace with real routes after Phase 4 |

**Audit method:** Direct grep across `app/` and `components/` (`grep -rn 'href='`). Playwright crawl not needed — codebase is small and grep is exhaustive. [VERIFIED: codebase]

---

## Q5: Mobile Nav Structure

**NavMenu.tsx** is the hamburger. Already a `"use client"` component. It holds all 4 nav links (Shmo Review, Biz, Link, Reputation). The mobile hamburger fires on `styles.menuTrigger` at `< ~768px` (CSS-controlled). Desktop links are in the same `<nav>` element — same hrefs, same DOM, just different visibility.

**Impact:** Changing `href="#shmo-biz"` → `href="/shmo-biz"` in `NavMenu.tsx` fixes both desktop dropdown AND mobile hamburger in one edit because they share the same JSX. No separate mobile nav component.

**Footer:** `components/Footer.tsx` — no client state, no hamburger. It renders identically on all breakpoints. Footer "Products" column links are `<a>` tags, not `<Link>` — acceptable for external/anchor-style hrefs but should be `<Link>` for internal routes to get Next.js prefetching. Consider upgrading to `<Link>` when changing the hrefs. [VERIFIED: codebase]

---

## Q6: Section Rotation for Coming Soon

**Recommendation: `marsh` (default) only. No wave divider.**

Rationale:
- Coming Soon is a single-section page — nav above, footer below. There is no section-to-section transition to divide.
- The `<Section>` component's `nextBg` prop is what renders wave dividers. Omit `nextBg` → no wave rendered (confirmed in `Section.tsx:74`: `{nextBg ? <div className={waveCls} ... /> : null}`).
- Ember (`shm-bg-ember`) is tempting for "early-access urgency" but the design system reserves it for one high-emphasis CTA per page at ~10% of total page area. A full-page Coming Soon on ember would violate the rotation constraint.
- Marsh is neutral and confident — it doesn't apologize for not being launched yet. Fits voice rules.

**If Jordan wants ember energy:** use a `.shm-badge--status-honey` "Coming soon" eyebrow badge on a marsh background. That delivers the warmth without burning the ember section budget.

**VERIFIED:** `Section.tsx` wave logic confirmed. Section bg rules confirmed in `SKILL.md` and `PRIMITIVES.md`. [VERIFIED: codebase]

---

## Q7: Wave Divider on Coming Soon Page

**No wave dividers needed.** Single-section page. The `<Section bg="marsh">` wrapper without a `nextBg` prop outputs no wave (confirmed in `Section.tsx:74`). The footer visually closes the page below. No gap risk. [VERIFIED: codebase]

---

## Q8: Email-Capture Stub UX

**Recommendation: disabled input + disabled button. No toast, no JS.**

The in-scope item says "optional email-capture stub, no backend wiring." Three options:

| Option | DX | Risk |
|---|---|---|
| Hidden entirely | Simplest | Loses the "coming soon" marketing value — visitors don't know to come back |
| Disabled field + button | No JS needed, communicates intent | Button reads "disabled" — visitor sees the slot is reserved |
| Toast on click | Requires `"use client"` | More JS, no persistence, still no backend — false UX |

**Use disabled field + button.** It's the exact same pattern `FormatPicker.tsx:136` already uses for unavailable products (`<button disabled>Coming soon</button>`). Consistent with existing patterns. Requires zero client state. [VERIFIED: codebase]

Label the button "Notify me when it's live" (from `marketing.md` CTA labels). Add `.shm-field__hint` "We'll email you when this launches." below the input so visitors know the field isn't broken.

**Note:** If Jordan wants real waitlist capture, the `WaitlistModal` + `lib/waitlist.ts` infrastructure already exists — but wiring it is out of scope for Phase 4.

---

## Q9: One Shared Component vs. Per-Sub-Brand Files

**Decision: one shared `<ComingSoon>` with props.**

| Approach | Files | Complexity | Phase 5+6 impact |
|---|---|---|---|
| Shared with props | 1 component + 5 thin page.tsx | Low | Phase 5/6 delete the page.tsx, component stays |
| Per-sub-brand | 5 component files + 5 page.tsx | High | 5 files to delete/replace |

Bespoke branded copy is handled via props (eyebrow, title, lede). The layout is identical across all 5. Props give enough flexibility without per-brand files.

**The one case for per-brand files** would be radically different section structure per sub-brand (e.g., Shmo Biz gets a feature list, Shmo Link gets a video). That belongs in Phase 5/6+ when the real PDP is built — not in Coming Soon stubs.

---

## Standard Stack (no new libraries needed)

Phase 4 is 100% composition of existing infrastructure. No new dependencies.

| Layer | What exists | What Phase 4 uses |
|---|---|---|
| Routing | Next.js App Router | `app/[route]/page.tsx` server components |
| UI primitives | `.shm-section`, `.shm-section-head`, `.shm-eyebrow`, `.shm-h1`, `.shm-lede`, `.shm-field`, `.shm-input`, `.shm-btn` | ComingSoon composition |
| Section wrapper | `components/layout/Section.tsx` | `<Section bg="marsh">` with no `nextBg` |
| Links | Next.js `<Link>` | Upgrade `<a href="#shmo-*">` → `<Link href="/shmo-*">` |
| Design system | `.claude/skills/shmocard-design-system/` | All component work through `design-system-builder` |

**VERIFIED:** All components confirmed in codebase. [VERIFIED: codebase]

---

## Architecture Patterns

### Recommended Project Structure (new files only)

```
app/
├── shmo-biz/
│   └── page.tsx          # <ComingSoon eyebrow="Shmo Biz" ... />
├── shmo-link/
│   └── page.tsx          # <ComingSoon eyebrow="Shmo Link" ... />
├── shmo-reputation/
│   └── page.tsx          # <ComingSoon eyebrow="Shmo Reputation" ... />
└── shmo-review/
    ├── l-sign/
    │   └── page.tsx      # <ComingSoon eyebrow="Shmo Review · L-Sign" ... />
    └── square-card/
        └── page.tsx      # <ComingSoon eyebrow="Shmo Review · Square Card" ... />

components/
└── ComingSoon.tsx         # shared component, server component
```

**Files to edit (not create):**
- `components/NavMenu.tsx` — 3 href upgrades
- `components/Footer.tsx` — 5 href upgrades, 2 `<a>` → `<Link>` for L-Sign/Square
- `components/shmo-review/FormatPicker.tsx` — 2 href upgrades in `PRODUCT_PAGE_HREFS`

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---|---|---|
| "Coming soon" section layout | Custom markup with inline styles | `<Section bg="marsh">` + `.shm-section-head` + `.shm-eyebrow` + `.shm-h1` + `.shm-lede` |
| Email input field | Raw `<input type="email">` | `.shm-input` inside `.shm-field` with `.shm-field__hint` |
| CTA button | `<button className="btn-primary">` | `.shm-btn .shm-btn--primary` |
| Disabled state | Custom CSS | HTML `disabled` attribute (already styled in `components.css`) |
| Sub-brand "soon" badge | Inline span with custom style | `.shm-badge .shm-badge--status .shm-badge--status-honey` |

---

## Common Pitfalls

### Pitfall 1: Anchor link semantics on Coming Soon nav items
**What goes wrong:** Keeping `href="#shmo-biz"` in NavMenu/Footer after the Coming Soon page exists. The anchor only works when you're on the homepage and the spotlight section has `id="shmo-biz"`. On `/shmo-review` or `/shmo-review/cr-80`, `#shmo-biz` scrolls nowhere — no-op.
**Fix:** Change to absolute route `/shmo-biz` everywhere. `<Link>` for internal routes, not `<a href>`.

### Pitfall 2: `"use client"` on ComingSoon unnecessarily
**What goes wrong:** Adding `"use client"` to `ComingSoon.tsx` because the email input seems interactive. The input is `disabled` — no `useState` needed. Staying server preserves SSR streaming.
**Fix:** Server component. If Jordan later wants real waitlist capture, add a separate client `<WaitlistForm>` leaf component inside ComingSoon.

### Pitfall 3: Wave divider inside the section instead of as a sibling
**What goes wrong:** Rendering `<div className="shm-wave ...">` as a child of `<section>`. Opens the 40px gap (the hard-learned wave-divider sibling rule from CLAUDE.md).
**Fix:** Use `<Section bg="marsh">` without `nextBg` for a standalone Coming Soon page — no wave needed, no risk.

### Pitfall 4: Wrong href in Footer Shop column
**What goes wrong:** Leaving Footer "L-Sign" and "Square Card" pointing to `/shmo-review#formats` (the FormatPicker anchor). After Phase 4 these products have their own stubs — the anchor-link is a demotion.
**Fix:** Change to `<Link href="/shmo-review/l-sign">` and `<Link href="/shmo-review/square-card">`.

### Pitfall 5: ember section bg on Coming Soon
**What goes wrong:** Using `shm-bg-ember` for the whole Coming Soon page to signal "exciting, early access." Violates the section rotation rule (ember is for one high-emphasis CTA per page, ~10% of page area).
**Fix:** Marsh background. Use `.shm-badge--status-honey` in the eyebrow if warmth is needed.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 4 is frontend-only. No new external services, CLIs, or runtimes. Next.js dev server (`npm run dev`, port 3000) is the only dependency and was confirmed running at end of Phase 3 (handoff.md).

---

## Runtime State Inventory

Step 2.5: SKIPPED — Phase 4 is not a rename/refactor/migration phase. No stored data, service config, or OS-registered state is being renamed.

---

## Validation Architecture

No formal test framework detected in the codebase (no `jest.config.*`, no `playwright.config.*`, no `vitest.config.*`, no `tests/` directory). Validation is visual/browser-based per `verification.md`.

**Per-task verification checklist (matches `verification.md` protocol):**

| Task | Verification |
|---|---|
| ComingSoon component built | Browser renders at `/shmo-biz` with no console errors |
| All 5 stub routes created | Visit each URL — no 404, page renders |
| NavMenu hrefs upgraded | Click each nav item on desktop + mobile (hamburger) — navigates to Coming Soon page, not scroll |
| Footer hrefs upgraded | Click each Footer link — resolves correctly |
| FormatPicker hrefs upgraded | Visit `/shmo-review`, click L-Sign and Square Card — navigates to Coming Soon stub |
| Mobile nav | At 390px viewport, hamburger opens, links navigate correctly |
| No console errors | DevTools clear on all 5 stub routes |

**Screenshot protocol:** Save to `pictures/screenshots/` per `verification.md`. Suggested names: `coming-soon-shmo-biz.png`, `coming-soon-l-sign.png`, `nav-links-upgraded-desktop.png`, `nav-links-upgraded-mobile.png`.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | Sub-brand mascot images exist in `public/` for Biz/Link/Reputation | Q1 ComingSoon composition | Builder would reference a missing image; skip mascot entirely if not confirmed |
| A2 | Lede copy for `/shmo-biz`, `/shmo-link`, `/shmo-reputation` is acceptable to Jordan as drafted above | Q3 Content strategy | Jordan may want different positioning; planner should flag copy as Jordan-approval-required |

**All structural/technical claims are VERIFIED from codebase.**

---

## Open Questions (RESOLVED)

1. **Mascot on Coming Soon pages? — RESOLVED 2026-05-20.**
   - **Decision:** Use existing generic mascot poses from `public/mascot/`. Verified by `ls public/mascot/` — all 5 PNG files exist: `mascot-holding-card.png`, `mascot-heart-hands.png`, `mascot-megaphone.png`, `mascot-pointing.png`, `mascot-thumbs-up.png`.
   - **Per-route assignment** (D-03): `/shmo-biz` → `holding-card`, `/shmo-link` → `heart-hands`, `/shmo-reputation` → `megaphone`, `/shmo-review/l-sign` → `pointing`, `/shmo-review/square-card` → `thumbs-up`.

2. **Email capture: disabled stub or omit entirely? — RESOLVED 2026-05-20 (Jordan's call).**
   - **Decision:** Visible-but-disabled. Input + button visible but disabled, with "We'll let you know" helper text. Pattern matches existing `FormatPicker` disabled state. No backend wiring this phase (deferred to Phase 9).

3. **Footer `<a>` vs `<Link>` for L-Sign/Square Card upgrade? — RESOLVED 2026-05-20.**
   - **Decision:** Upgrade `<a>` → `<Link>` for ALL internal routes during the href edit pass. NavMenu is a `"use client"` component — `<Link>` is safe (no hamburger semantics depend on `<a>`). Footer's 3 sub-brand links + 2 PDP links all upgrade to `<Link>` in the same edit, single `import Link from "next/link"` covers all of them.

---

## Sources

### Primary (HIGH confidence — verified directly in codebase)
- `components/NavMenu.tsx` — all nav hrefs inventoried
- `components/Footer.tsx` — all footer hrefs inventoried
- `components/shmo-review/FormatPicker.tsx` — `PRODUCT_PAGE_HREFS` config verified
- `components/home/SubBrandSpotlight.tsx` + `home-data.ts` — sub-brand CTA href patterns
- `components/layout/Section.tsx` — wave divider logic (nextBg optional, null = no wave)
- `.claude/skills/shmocard-design-system/PRIMITIVES.md` — primitive class names
- `.claude/skills/shmocard-design-system/SKILL.md` — hard rules, section rotation
- `context/general/marketing.md` — sub-brand copy, CTA labels
- `context/general/scope.md` + `handoff.md` + `.planning/ROADMAP.md` — phase scope

### Secondary (MEDIUM confidence)
- `app/page.tsx` comment — mascot image references for Biz/Link/Reputation (existence in `public/` not verified by grep)

---

## Metadata

**Confidence breakdown:**
- Link audit: HIGH — exhaustive grep of all `href=` in codebase
- ComingSoon composition: HIGH — all primitives verified in PRIMITIVES.md and components.css
- Route file placement: HIGH — confirmed by Next.js conventions + existing page patterns
- Sub-brand copy: MEDIUM — drafted from marketing.md; Jordan approval required before locking
- Mascot availability: LOW — referenced in comments but `public/` directory not grepped

**Research date:** 2026-05-20
**Valid until:** Until Phase 5 replaces L-Sign stub (no time expiry — all sourced from local codebase)

# handoff.md — Session Handoff

**Last session:** 2026-05-11 — Phase 4-A mobile pass on the homepage: audited 375px, scoped a 3-wave plan, landed all of Wave 1 (5 layout-break fixes), all of Wave 2 (3 separate mobile illustrations for Biz / Link / Reputation), a Reputation dark→light theme swap, the MacBook chassis fix for mobile, and a hamburger menu so the four sub-brand links are accessible on mobile.

---

## Project phase

Phase 3 (Rebuild) still reads complete (12/12 plans). STATE.md still stale relative to git. Phase 4 (Launch readiness, per `CLAUDE.md`) opened informally this session under a sub-phase folder `.planning/phases/04-mobile-pass/`. Path A polish was the working assumption; ROADMAP.md still untouched.

Next chunk of Phase 4 work is queued in `.planning/phases/04-mobile-pass/PLAN.md` Wave 2 (polish) + Wave 3 (systematize breakpoints into tokens). Neither has started.

---

## What was done this session

- **Phase 4-A plan written.** `.planning/phases/04-mobile-pass/PLAN.md` scopes the homepage mobile pass in three waves (layout breaks → polish → systematize) with verification protocol per wave.

- **Wave 1 — layout breaks (5 commits).** All landed atomically.
  - Hero sub-brand tile wordmarks fit at 360+. ShmoReputation was clipping; tightened tile padding and ramped wordmark to `clamp(12px, 3.6vw, 18px)` under 600. `components/home/home.css`.
  - Hero tiles restructured under 600 — 1-column with horizontal-row layout (mascot left, wordmark + sub stacked middle, status pill right). The original 4:5 portrait layout broke at narrow widths. CSS grid + `grid-template-areas`. `components/home/home.css`.
  - Reputation dashboard simplifies under 720 inside the existing component (sidebar hidden, stats down from 4 → 2 cards). Later superseded by Wave 2.3.
  - Shmo Link callouts + connectors hidden under 720 (phone-only on mobile). Later refined further.
  - FAQ headline + mascot collision resolved — sticker drops below the headline at <600 via `position: static`. `components/home/HomeFaq.tsx` + `home.css`.
  - Spotlight art moves between headline and lede on mobile (`<880`). Image now sits right after the headline so the user sees the product before reading the copy. CSS `display: contents` on `.spotlight__copy` + `order` on each child.

- **Wave 2 — separate mobile illustrations.** Per Jordan: keep every detail, just rearrange. Pattern across all three: shared `*PhoneInner` / `*Core` helper, two parent components (`X` and `XMobile`), CSS toggling visibility at 720 via `:has()`.
  - **Shmo Biz mobile** — card tilted on top + phone below (staggered vertical stack). Required overriding three nested aspect-ratio caps (`.spotlight__art` → `.spotlight__illustration-frame` → `.spotlight__illustration`) so the container sizes from intrinsic content height. `components/home/SubBrandIllustration.tsx` + `home.css`.
  - **Shmo Link mobile** — three iterations: 2×2 grid below phone → callouts beside phone (column right) → phone only (callouts dropped per Jordan). Final: phone-only at 200×432, all four buttons visible. Same files.
  - **Shmo Reputation mobile** — full MacBook chassis with all four stats preserved (2×2 grid), sidebar hidden, chart + 2 recent activity reviews intact. Same files.

- **Reputation dashboard dark → light theme.** Reverses the May 8 dark-theme work on this section. Sidebar bg `#27130b → graham-soft`. Main bg `cocoa-deep → marshmallow`. All `rgba(255, 251, 241, X)` → `cocoa-deep / ink-2 / ink-3`. Borders → `var(--color-hair)`. Stat / chart / review card bg → `cream`. Delta-up green changed from `#6dd968` (washed on dark) to `#2f9f4a` (readable on light). MacBook chassis (lid + base) intentionally stays dark — device frame, not interior theme. Ember accents (brand mark, +18 value, bars, reply box, Sent badge) and 5-star color stay as-is. `home.css`.

- **Reputation mobile MacBook chassis fix.** First mobile build clipped the chassis because `.rep-laptop__lid` has `aspect-ratio: 16/10` baked in. Mobile override: aspect-ratio auto, height auto, screen overflow visible. Chassis now wraps the full dashboard like a real laptop screenshot. `home.css`.

- **Mobile hamburger menu.** Previous mobile nav hid `.links` at <=880 with no replacement — 4 sub-brand links were inaccessible on mobile. Wrapped the primary nav in a native `<details>`/`<summary>` element so the dropdown works without JS. Summary is a round hamburger button matching the cart icon's pill-outline style. Dropdown is right-anchored, marshmallow bg, hair border, soft shadow. Desktop unchanged (trigger hidden, links rendered inline). `components/Nav.tsx` + `Nav.module.css`.

### Files modified

- `components/home/home.css` — every wave touched this; most edits in the file
- `components/home/SubBrandIllustration.tsx` — added `BizPhoneInner`, `BizPhoneMobile`, `LinkPhoneCore`, `LinkPhoneMobile`, `RepLaptopCore`, `ReputationLaptopMobile`. Existing components refactored to use the shared helpers.
- `components/home/HomeFaq.tsx` — implicit through CSS only (the mascot move was a `position: static` rule, not JSX changes)
- `components/Nav.tsx` — wrapped nav links in `<details>` + `<summary>` hamburger
- `components/Nav.module.css` — mobile menu rules, hamburger button styling, dropdown panel
- `.planning/phases/04-mobile-pass/PLAN.md` (new)
- `pictures/screenshots/mobile-audit-2026-05-09/` — 25 verification screenshots

### Commits landed (13 on `main`)

- `6fa19ae` mobile(home): hero sub-brand tile wordmarks fit at 360+ (+ PLAN.md)
- `0b0fcf4` mobile(home): reputation dashboard simplifies under 720
- `92ebaec` mobile(home): shmo link callouts hide under 720
- `9198a12` mobile(home): faq mascot drops below headline under 600
- `131131a` mobile(home): hero tiles restructure to horizontal-row layout under 600
- `590d3ab` mobile(home): spotlight art moves between headline and lede under 880
- `bcb13b3` mobile(home): shmo biz illustration redone for mobile (vertical stack)
- `29648b3` mobile(home): shmo link illustration redone for mobile (phone + 2x2 callouts)
- `f7735d8` mobile(home): shmo link callouts column moves beside phone (right side)
- `1071dd6` mobile(home): shmo link mobile drops callouts — phone only
- `58978b5` mobile(home): shmo reputation illustration redone for mobile
- `8405092` style(home): reputation dashboard interior flips to light theme
- `f90e98c` fix(home): reputation mobile macbook chassis sizes from content
- `dd64876` mobile(nav): hamburger menu exposes 4 sub-brand links

(Three commits aren't in the count above because the Link mobile went through three iterations before landing — they're each their own commit. Reading them in sequence shows the design conversation.)

### Things explicitly NOT changed this session

- Wave 2 polish items in `.planning/phases/04-mobile-pass/PLAN.md` (hero hand-note stack at <520, hero CTA full-width, CR-80 pill nowrap, testimonial quote type ramp, how-it-works step card padding, crew strip 1-col at <480, sticky nav scrim, section padding asymmetry).
- Wave 3 systematize items (canonical `--bp-mobile/tablet/desktop` tokens, refactor home.css queries onto the token set, promote responsive primitive behavior into `components.css`, update PRIMITIVES.md / SKILL.md).
- ROADMAP.md / Phase 4 reframe.
- STATE.md last_activity + progress block.
- Anything outside the homepage (Shmo Review, PDPs, cart, footer).
- Pawn Leads shirt visible in video #1 (Jordan flagged this is out of scope for this task).
- Avatar photo compression carried from prior session (still uncompressed in commit `7e1f52d`).

---

## What's next

**Phase 4-A — Wave 2 polish** per `.planning/phases/04-mobile-pass/PLAN.md`. The 8 items are scoped, ordered, and contained to `home.css` edits. Each is one atomic commit.

After Wave 2, **Wave 3 systematize** converts the ad-hoc `home.css` breakpoint set (1100/1000/880/720/600) onto canonical `--bp-*` tokens defined in `colors_and_type.css`, promotes primitive responsive behavior into `components.css`, and updates `PRIMITIVES.md` / `SKILL.md`.

Independent of that, possible next directions:
- Run mobile audit + pass on **/shmo-review** (category page) — same pattern as the homepage.
- Run mobile audit + pass on the **3 PDPs** (CR-80, L-Sign, Square Card).
- Run mobile audit + pass on the **cart drawer**.
- Resolve the still-open Phase 4 routing question (A polish / B visual-redesign / C launch-readiness) by updating `ROADMAP.md`.

---

## Open decisions

- **Phase 4 routing** — A vs B vs C. This session committed to A in practice but ROADMAP.md still doesn't reflect it. Worth resolving.
- **Wave 2 → Wave 3 → next page** ordering. Continue polishing the homepage at mobile (Wave 2 + 3) before moving to /shmo-review, or pivot now and come back for polish later?
- **Avatar photo compression** (John 2.9 MB / Cindy 9.4 MB committed uncompressed) — still pending from prior session.
- **Joey video status** — carried from prior session.
- **Hero copy divergences** (eyebrow "A toolkit, not a card" vs canonical "A toolkit for local crews"; second CTA label) — still unresolved.

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Ask Jordan: **"Continue Wave 2 polish (hero hand-note stack, CTAs full-width, testimonial type ramp, how-it-works tighter padding, crew strip 1-col, sticky nav scrim — 8 items in `.planning/phases/04-mobile-pass/PLAN.md`)? Or pivot to mobile audit on the next page — /shmo-review category, the 3 PDPs, or cart drawer?"**
4. Before any UI work: invoke the `shmocard-design-system` Skill tool first per `.claude/rules/skill-routing.md`. Then read `.claude/rules/design-system.md`. Both load the operator's manual + the design rules verbatim.
5. **New pattern from this session worth remembering:** when a section's content doesn't compress gracefully at mobile, the `:has()` selector + a parallel `*Mobile` React component with shared inner content is the right tool. Three separate mobile illustrations now use this pattern (Biz / Link / Reputation). Apply the same approach if `/shmo-review` or PDP sections break at mobile.
6. **Another pattern:** when a `.spotlight__art` (or any aspect-ratio-locked container) needs to hold a portrait-shaped composition at mobile, override the entire chain: `.spotlight__art:has(--mobile-variant)` → aspect-ratio auto + overflow visible + display block, then `.spotlight__illustration-frame` → aspect-ratio auto + height auto, then the inner `.spotlight__illustration` → height auto. All three layers need to release their height constraint, not just the outer.

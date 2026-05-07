---
phase: 03-rebuild
plan: 02
subsystem: layout-primitives
tags: [layout, primitives, audit, section-rotation, REQ-09]
audit_only: partial
requires: ["03-01"]
provides:
  - "components/layout/Container.tsx — polymorphic .shm-container wrapper"
  - "components/layout/Section.tsx — typed 4-color rotation section with optional wave divider"
  - "Type-level enforcement of REQ-09 (section bg ∈ {marsh, graham, ember, cocoa})"
  - "Smoke-test screenshot proving rotation + wave dividers render correctly"
affects:
  - "Unblocks 03-03 (homepage), 03-04..03-07 (category + PDPs) — all downstream pages compose Section instead of inventing wrappers"
tech-stack:
  added: []
  patterns:
    - "Server-component-first layout primitives (no 'use client')"
    - "Type union as runtime/CSS-class enforcement (`SectionBg = 'marsh'|'graham'|'ember'|'cocoa'` → `shm-bg-${bg}`)"
    - "Polymorphic component pattern via `as` prop on Container"
key-files:
  created:
    - path: components/layout/Container.tsx
      reason: "Reusable .shm-container wrapper for downstream page composition"
    - path: components/layout/Section.tsx
      reason: "Type-enforced section primitive with bg rotation + wave divider slot"
    - path: components/layout/layout.module.css
      reason: "Layout-only stub; reserved for future layout overrides"
    - path: app/page.tsx
      reason: "Replaced 3-A3 placeholder with TEMPORARY 4-section smoke test (overwritten by 03-03)"
    - path: pictures/screenshots/03-02-base-layout-shell.png
      reason: "Browser proof — Nav + 4 distinct bgs + waves + Footer all render"
  modified: []
decisions:
  - "Container is polymorphic via `as` prop ('div'|'section'|'header'|'footer'|'main') — supports semantic flexibility without forcing nested wrappers"
  - "Section type-level union `'marsh'|'graham'|'ember'|'cocoa'` is the load-bearing REQ-09 enforcement; bg outside the four-color rotation is now a TypeScript compile error"
  - "Wave size mapping: 'lg'→.shm-wave--lg, 'xl'→.shm-wave--xl. 'sm' and 'md' resolve to default thin wave (no extra class) since the design system ships only `--lg` and `--xl` modifiers"
metrics:
  duration: "~10 min"
  completed: "2026-05-07T05:28:00Z"
---

# Phase 3 Plan 02: Layout Primitives + Foundation Audit Summary

Hybrid audit + add. Verified the four foundation components shipped in 3-A3/3-A4 follow `.shm-*` discipline (no fixes needed), then added two new typed React server components — `Container` and `Section` — so every downstream Phase 3 plan can compose pages without reinventing the section-rotation pattern.

## Task 1 — Foundation audit (PASS, zero fixes)

Audited `components/Nav.tsx`, `components/Footer.tsx`, `components/Mascot.tsx`, `components/Sticker.tsx` plus their CSS modules.

| Check | Result |
|---|---|
| `grep` for rogue Tailwind color/visual utilities (`bg-X-Y`, `text-X-Y`, `border-X-Y`, `rounded-X-Y`, `shadow-X-Y` numeric scale) in 4 `.tsx` files | **0 hits** — clean |
| `grep -E '#[0-9a-fA-F]{3,8}\b'` against 4 `.tsx` files | **0 hits** — clean |
| `Mascot.size` type union | `'decoration' \| 'accent' \| 'supporting' \| 'hero'` ✅ matches plan |
| `Sticker.size` type union | `'xs' \| 'sm' \| 'md'` ✅ matches plan |
| Visual classes used | `.shm-nav`, `.shm-container`, `.shm-badge*`, `.shm-btn*`, `.shm-mascot--*`, `.shm-sticker--*`, `.shm-tilt-*` — all `shm-` prefixed |
| CSS modules (`Nav.module.css`, `Footer.module.css`) | Layout + token-driven color (`var(--color-*)`, `var(--font-*)`). No raw hex |

**Observations (low-severity, not fixed):**

- `components/Footer.module.css` uses 4 `rgba(255, 251, 241, …)` and 1 `rgba(255, 184, 51, …)` literal. These are translucent overlays of `--color-marshmallow` and `--color-honey` respectively. Not hex codes (so they pass the strict acceptance grep), but they duplicate token RGB values rather than reading them. If/when CSS color-mix becomes the convention, swap to `color-mix(in srgb, var(--color-marshmallow) 78%, transparent)`. Out of scope for this plan — foundation files are locked per `file-organization.md`.

No file changes from Task 1 — no commit. Plan instruction was explicit: "If any violation surfaces, log in commit message — DO NOT silently rewrite the foundation work." Zero violations, zero rewrites.

## Task 2 — Add Container + Section primitives (commit `76b22c9`)

Three new files under `components/layout/`:

### `Container.tsx`

```ts
type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'main';
};
```

Renders `<{as} className="shm-container ${className ?? ''}".trim()>`. Default `as='div'`. Pure server component.

### `Section.tsx`

```ts
type SectionBg = 'marsh' | 'graham' | 'ember' | 'cocoa';
type SectionProps = {
  bg: SectionBg;
  nextBg?: SectionBg;
  waveSize?: 'sm' | 'md' | 'lg' | 'xl';
  containerClassName?: string;
  children: ReactNode;
  id?: string;
  ariaLabel?: string;
};
```

Renders the exact pattern from the plan's `<interfaces>` block:

```tsx
<section className={`shm-bg-${bg}`} id={id} aria-label={ariaLabel}>
  <div className={`shm-container ${containerClassName ?? ''}`.trim()}>{children}</div>
  {nextBg ? <div className={`shm-wave shm-wave--${nextBg}${sizeCls}`} aria-hidden="true" /> : null}
</section>
```

Pure server component. The `SectionBg` type union IS the REQ-09 enforcement: pass anything else and TypeScript fails the build.

### `layout.module.css`

Empty layout-only stub with the documented top-of-file comment. No selectors yet — defaults handled by the design system's `.shm-section` and `.shm-container`.

### Verification

| Check | Result |
|---|---|
| Both files exist | ✅ |
| `Section.tsx` declares `'marsh' \| 'graham' \| 'ember' \| 'cocoa'` literal | ✅ |
| Neither file contains `'use client'` | ✅ — both server components |
| `npm run build` exits 0 | ✅ |
| No hex in `components/layout/*.tsx` | ✅ |

## Task 3 — Smoke-test Section rotation + screenshot (commit `cfc8611`)

Replaced the 3-A3 placeholder `app/page.tsx` with a TEMPORARY 4-section composition demonstrating `marsh → graham → ember → cocoa` rotation. Top-of-file comment marks it as smoke test, replaced by 03-03.

Sections:
1. `<Section bg="marsh" nextBg="graham">` — default thin wave
2. `<Section bg="graham" nextBg="ember">` — default thin wave
3. `<Section bg="ember" nextBg="cocoa" waveSize="lg">` — 64px tall wave (high-contrast transition)
4. `<Section bg="cocoa">` — no `nextBg`, no wave (footer follows directly)

**Verification:**

```
$ npm run build               → exit 0
$ test -f screenshots/03-02-base-layout-shell.png → exists
$ grep -c 'bg="marsh"' app/page.tsx  → 1
$ grep -c 'bg="graham"' app/page.tsx → 1
$ grep -c 'bg="ember"' app/page.tsx  → 1
$ grep -c 'bg="cocoa"' app/page.tsx  → 1
```

**Screenshot:** `pictures/screenshots/03-02-base-layout-shell.png` (headless Chrome, 1440×2400). Visible elements:

- Nav at top (mounted via `app/layout.tsx`) — wordmark + 4 product links + cart icon + Shop button
- 4 sections with visibly distinct backgrounds: marshmallow off-white → graham warm tan → ember orange → cocoa deep brown
- Wave dividers between every consecutive pair; ember→cocoa renders prominently as the `lg` (64px) tall wave
- On dark sections (ember, cocoa) the heading + lede correctly flip to marshmallow per the design system's bg-utility flips
- Footer at bottom (cocoa, marshmallow text) — wordmark, 4-column link grid, copyright

All four REQ-09 background values render correctly with type-flip behavior intact.

## Deviations from Plan

### Documented divergences (no Rule violations)

**1. [Spec gap] Wave size CSS does not have `--sm` / `--md` modifiers**

- **Found during:** Task 2 (preparing Section component)
- **Discovery:** Plan specifies `waveSize?: 'sm' | 'md' | 'lg' | 'xl'` with default `'md'`. `context/design-system/colors_and_type.css` lines 351-363 ship only `.shm-wave--lg` (64px) and `.shm-wave--xl` (80px). The default `.shm-wave` (no modifier) is the thin 18px wave. `--sm` and `--md` modifiers do not exist.
- **Fix:** Section component still accepts the full `'sm'|'md'|'lg'|'xl'` union for forward-compat, but only emits the size class for `'lg'` and `'xl'`. `'sm'` and `'md'` resolve to the default thin wave with no extra class. This avoids dead class names in the DOM while honoring the typed API surface.
- **Impact:** None at runtime — the default thin wave is the correct visual for `sm`/`md`. If the design system later ships `--sm` / `--md` modifiers, just extend `waveSizeClass()` in `Section.tsx`.
- **Files modified:** `components/layout/Section.tsx`
- **Commit:** `76b22c9`

### Auto-fixed issues

None — Task 1 audit found zero violations and Task 2/3 ran clean on first build.

### Authentication gates

None.

## Deferred Items

Nothing new for this plan. Pre-existing items in `.planning/phases/03-rebuild/deferred-items.md` (DI-01, DI-02) untouched and unaffected by this plan.

## Threat Flags

None — pure presentation layer, no Server Actions, no Route Handlers, no user input.

## Files Summary

| Path | Action | Commit |
|---|---|---|
| `components/layout/Container.tsx` | created | `76b22c9` |
| `components/layout/Section.tsx` | created | `76b22c9` |
| `components/layout/layout.module.css` | created | `76b22c9` |
| `app/page.tsx` | replaced placeholder with smoke test | `cfc8611` |
| `pictures/screenshots/03-02-base-layout-shell.png` | created | `cfc8611` |

## Self-Check

- `[ -f components/layout/Container.tsx ]` → FOUND
- `[ -f components/layout/Section.tsx ]` → FOUND
- `[ -f components/layout/layout.module.css ]` → FOUND
- `[ -f app/page.tsx ]` → FOUND (smoke test)
- `[ -f pictures/screenshots/03-02-base-layout-shell.png ]` → FOUND
- `git log --oneline | grep 76b22c9` → FOUND (`feat(03-02): add Container + Section layout primitives`)
- `git log --oneline | grep cfc8611` → FOUND (`feat(03-02): smoke-test Section 4-color rotation in app/page.tsx`)

## Self-Check: PASSED

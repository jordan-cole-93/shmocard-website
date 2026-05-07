# Phase 2 / Step 02-01: Design System Folder Audit

**Date:** 2026-05-07
**Scope:** Every file in `.claude/skills/shmocard-design-system/` (excluding `.DS_Store`, runtime state JSONs, and individual font binaries).
**Source of truth (per design system's own rules):** `colors_and_type.css` + `components.css` win when docs disagree.

---

## TL;DR

The design system is **complete, well-documented, and internally consistent**. Three docs (`README.md`, `SKILL.md`, `PRIMITIVES.md`) cover the rules from three angles. The CSS is comprehensive (375 + 1875 lines) and PRIMITIVES.md is the canonical primitive index. Reference pages exist for the 3 critical surfaces (homepage, PDP, cart drawer).

**The "messy" feeling Jordan flagged is real but mostly structural, not content-related:**
1. **Folder name has a space** (`design system/`) — breaks bare imports, awkward in shell.
2. **`ui_kits/website/` is inconsistently organized** — homepage is in a subfolder, PDP and cart drawer are loose at the top.
3. **Three reference pages use three different rendering models** — homepage is React/Babel, PDP and cart drawer are vanilla HTML with inline `<style>` blocks.
4. **Two CLAUDE.md files coexist without cross-references** (root + design system).
5. **`SKILL.md` ships with skill frontmatter** — unclear if it's meant to register as a real Claude skill.
6. **Buybox.html double-loads fonts** — has its own `<link>` to Google Fonts on top of what `colors_and_type.css` already imports.
7. **Runtime state JSONs sit in repo** (`.design-canvas.state.json`, `.image-slots.state.json`).
8. **Dev-utility files mixed with production reference** (`tweaks-panel.jsx`, `image-slot.js` in `homepage/`).

The **content** of the system is locked and excellent. Only **structural housekeeping** is needed before Phase 3.

---

## File-by-file inventory

### Top-level docs (4 files, 874 lines total)

| File | Lines | Role | Verdict |
|---|---|---|---|
| `CLAUDE.md` | 49 | Auto-loaded ruleset when working inside the design system subtree. Hard rules: `shm-` prefix, no primitive restyles, soft-by-default, section rotation, mascot sticker rule, no exclamations/emoji/gradients. | ✅ Tight, well-scoped |
| `SKILL.md` | 113 | Operator's manual. Has the primitive table + canonical reference pages + golden rules. Frontmatter declares it as a "Skill" with name `Shmocard`. | ⚠️ Frontmatter unclear — registered? not registered? |
| `README.md` | 236 | Brand context, voice rules, complete visual foundations, fonts, color philosophy, section rotation, golden rules. | ✅ Comprehensive |
| `PRIMITIVES.md` | 476 | Canonical primitive index. Token list, type ramp, every component family with every variant. Includes "smell test" of bug indicators. | ✅ Excellent — this is the daily reference |

**Drift check across the 4 docs:** Random spot-check reveals no contradiction. Each doc's rules align with the others. `colors_and_type.css` and `components.css` are correctly identified as source of truth.

### CSS source (2 files, 2,250 lines total)

| File | Lines | Role | Verdict |
|---|---|---|---|
| `colors_and_type.css` | 375 | Tokens (colors, ink, hairlines, type families, radii, outlines, shadows, motion, layout) + `.shm-*` type ramp + `@font-face` for all 4 brand fonts + Google Fonts fallback `@import`. | ✅ Source of truth, well-structured |
| `components.css` | 1875 | Every primitive: buttons, cards, badges, inputs, image frames, FAQ, mascot, sticker, section heading, press strip, sticky nav, cart drawer (440-line family), product cards, form patterns, PDP/buybox primitives, checklist, callout. | ✅ Comprehensive |

**Sectioning:** `components.css` has clean `/* ===... */` H2-style headers and `/* ---... */` H3-style headers. Easy to navigate.

**Aliases:** `colors_and_type.css` ships backward-compat aliases (`--color-snow`, `--color-paper`, `--color-cream-soft`) for older modules. Comment explicitly warns against an ambiguous `--color-cocoa` alias. Solid hygiene.

### Fonts (`fonts/` — 35 .ttf files + README.md)

| Family | Files | Verdict |
|---|---|---|
| Bricolage Grotesque | 1 variable + ~30 static cuts (24/36/48/72pt × condensed/semicondensed × weights) | ✅ Variable file is the canonical loader; static cuts are extras |
| Cherry Bomb One | `CherryBombOne-Regular.ttf` | ✅ Logo-only, single weight |
| Inter Tight | upright variable + italic variable | ✅ Body/UI ramp |
| Shadows Into Light Two | `ShadowsIntoLightTwo-Regular.ttf` | ✅ Hand accent |

**Font load strategy:** `colors_and_type.css` declares all 4 via `@font-face` with relative `fonts/...` paths, plus a Google Fonts `@import` fallback. Documented in README and inline comments.

**Concern:** the static Bricolage cuts (~30 files) are unused if the variable file loads correctly. They're ~10MB of redundant binary in the repo. Recommendation: keep the variable, delete static cuts, or move them to a sibling `fonts-static/` for local-only adoption scenarios.

### Reference pages (`ui_kits/website/` — 3 surfaces, 3 rendering models)

| Surface | Path | Rendering model | Lines (HTML) | Verdict |
|---|---|---|---|---|
| Homepage | `homepage/Shmocard Homepage.html` + 5 `home-*.jsx` + `home.css` + dev utilities | **React 18 + Babel-standalone** loaded via `<script type="text/babel">` from CDN | 20-line HTML shell, JSX bundles do all rendering | ⚠️ Heavy translation cost in Phase 3 |
| PDP / Buybox | `Buybox.html` | **Vanilla HTML + inline `<style>` block** | 418 lines (HTML + page CSS in `<style>`) | ⚠️ Different model than homepage |
| Cart drawer | `Cart Drawer.html` | **Vanilla HTML + multi-frame artboard layout** in inline `<style>` block | 449 lines | ⚠️ Different model again — designed as a state-preview canvas, not a production page |

**The 3-model inconsistency is the single biggest structural issue.** Three reference pages = three different translation paths in Phase 3.

#### Homepage breakdown (`ui_kits/website/homepage/`)

| File | Role | Notes |
|---|---|---|
| `Shmocard Homepage.html` | 20-line shell | Loads React 18, ReactDOM, Babel-standalone from CDN. Body has only `<div id="app">` + `<div id="modal-root">`. |
| `home.css` | Page-level layout CSS | Header docs the section pattern (the README of this folder per design system rules). |
| `home-bundle.jsx` | Main React entry | Mounts the app. |
| `home-app.jsx` | App shell | Renders the page composition. |
| `home-parts.jsx` | Section components | Hero, sub-brand spotlight, audience marquee, etc. |
| `home-modals.jsx` | Modals (cart drawer, lightbox, etc.) | Mounted to `modal-root`. |
| `home-data.jsx` | Mock product / testimonial / FAQ data | Replaces what Shopify will provide. |
| `image-slot.js` | Dev utility | Live image-slot picker (allows Jordan to swap mascot/product imagery while previewing). |
| `tweaks-panel.jsx` | Dev utility | Live tweak panel for adjusting variables in-browser. |
| `.image-slots.state.json` | Runtime state | Saves image-slot selections. **Should be gitignored.** Already gitignored ✅ |
| `.design-canvas.state.json` | Runtime state | Wider design-canvas tooling state. **Already gitignored.** ✅ |

**Concern:** the dev utilities (`image-slot.js`, `tweaks-panel.jsx`) are useful for design-time iteration but they're **co-located with the production reference**. A reader doesn't immediately know which files Phase 3 needs and which are dev-only.

#### PDP / Cart Drawer

Both are **single-file vanilla HTML** with an inline `<style>` block at the top defining page-level layout, then long `<body>` sections demonstrating every state of the primitive. They're authored as a **design-canvas / preview** for the design system, not as production-ready pages.

**Concern (Buybox.html line 9-10):** double-loads fonts via Google Fonts `<link>` even though `colors_and_type.css` already imports from Google Fonts as a fallback. Slows page load + risks font-flash.

### Previews (`preview/` — 28 HTML files + 1 CSS)

Token / primitive preview cards. Each file demonstrates one token group or component family. Used as visual QA fixtures.

| Sample (numbered in load order) | Topic |
|---|---|
| `01-logo-wordmark.html` | Wordmark + mascot lockup |
| `02-colors-surfaces.html` | Surface palette |
| `03-colors-accents.html` | Accent colors |
| `04-colors-ink.html` | Ink colors |
| `05-hairlines.html` | Hairlines |
| `07-type-ramp.html` | Type ramp |
| `08-italic-accent.html` | Em accent |
| `09-eyebrows.html` | Eyebrows |
| `10-radii.html` | Radii |
| `11-shadows.html` | Shadows |
| `12-layout.html` | Container, section padding |
| `13-buttons.html` | Buttons (all variants) |
| `15-card.html` | Cards (all variants) |
| `16-badges.html` | Badges |
| `17-input.html` | Inputs |
| `18-family-tile.html` | Family tile |
| `19-glyphs.html` | Hand-drawn icons |
| `20-faq.html` | FAQ |
| `21-image-frame.html` | Image frame |
| `22-mascot.html` + `22b-sticker.html` | Mascot + sticker |
| `23-section-recipes.html` | Section composition recipes |
| `24-iconography.html` | Iconography rules |
| `25-nav.html` | Nav |
| `26-wave-dividers.html` | Wave dividers |
| `28-product-card.html` | Product card |
| `29-forms.html` | Forms |
| `30-buybox.html` | Buybox |
| `33-section-rotation.html` | Section rotation full demo |

**Gaps in numbering:** 06, 14, 27, 31, 32 are missing. Either intentional (deleted/deferred) or accidental (renumbered without filling gaps). Flag for Jordan — possibly a tidy-up, possibly intentional spacing for future cards.

`_card.css` — shared preview-card CSS (fixture-only).

### State files (gitignored ✅)

- `.design-canvas.state.json` — design canvas tooling state
- `ui_kits/website/homepage/.image-slots.state.json` — runtime image-slot picker state

Confirmed gitignored in `.gitignore`. Good.

---

## Issues + recommendations

### 1. Folder name has a space — `.claude/skills/shmocard-design-system/`

**Issue:** Breaks bare imports (`@import ".claude/skills/shmocard-design-system/..."` requires escaping in CSS), awkward in shell, awkward in URLs, awkward in scripts. CSS imports inside the system itself work fine because they use relative paths (`fonts/...`, `../../colors_and_type.css`), but external consumers (Next.js `app/globals.css`) will need the escaped path.

**Recommendation:** Rename to `.claude/skills/shmocard-design-system/` (kebab) at minimum. Better: move it out of `context/` (which is meta-context, not source) entirely.

**Three options for final location:**

| Option | Path | Pros | Cons |
|---|---|---|---|
| A | `.claude/skills/shmocard-design-system/` (rename only) | Smallest change; preserves "context/" grouping | Still inside meta-context folder; system isn't really "context" |
| B | `design-system/` (move to repo root) | Clearer architectural intent — it's a co-equal source artifact | One more top-level folder to maintain (file-organization rule says "no new top-level folders without approval") |
| C | `app/(design-system)/` (Next.js route group) | Co-located with consumers; Next.js handles paths cleanly | Mixes design-system source with route definitions; creates ambiguity about whether previews ship to production |

**Recommended: Option B (`design-system/` at repo root)** with a `file-organization.md` update authorizing it as an approved top-level folder. Rationale: the design system is a **first-class source artifact**, not meta-context. It will be referenced in `app/globals.css` imports, in component code, in PRs. Treating it as top-level matches its actual role.

**Folder rename costs:**
- All internal CSS path references (`@font-face url("fonts/...")`) — already relative, unaffected ✅
- Reference page CSS link tags (`../../colors_and_type.css`, `../../../colors_and_type.css`) — depend on final depth, will need updating depending on chosen location
- `CLAUDE.md` pointer table — needs update
- `.claude/rules/file-organization.md` — needs update
- `.planning/PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, this AUDIT.md — need updating
- The design system's own `CLAUDE.md` doesn't reference the folder by name, only relative paths — unaffected ✅

### 2. `ui_kits/website/` mixed organization

**Issue:** `homepage/` is nested in its own subfolder (correct for a multi-file React bundle). `Buybox.html` and `Cart Drawer.html` (note space) are loose at the top with their CSS inline. Inconsistent.

**Recommendation:** Nest each reference page in its own subfolder. Move:
- `ui_kits/website/Buybox.html` → `ui_kits/website/buybox/Buybox.html` (or rename to `index.html`)
- `ui_kits/website/Cart Drawer.html` → `ui_kits/website/cart-drawer/Cart Drawer.html` (rename folder kebab)

Or fold the files-with-spaces into kebab too:
- `Buybox.html` → already kebab-ish
- `Cart Drawer.html` → `cart-drawer.html`

Either way, the inconsistency is what hurts. Pick one rule and apply it.

### 3. Three rendering models for three reference pages

**Issue:** Homepage is React/Babel; PDP is vanilla HTML + `<style>` block; Cart drawer is vanilla HTML + multi-frame state-preview artboards. Phase 3 will translate each to Next.js components — three different translation paths.

**Recommendation:** Don't normalize the reference pages themselves (they work for their purpose: live design canvas for Jordan + design QA). **DO** document explicitly in each file's header what the translation target is in Phase 3. Add at the top of `home.css`, `Buybox.html`, `Cart Drawer.html`:

```html
<!--
  PRODUCTION TARGET (Phase 3 translation):
  - This reference page demonstrates {what}.
  - Phase 3 implementation lives at {target component path}.
  - Consume the section structure here, NOT this file's runtime model.
-->
```

This makes step 02-05 (translation plan) easier and prevents future contributors from copying the Babel pattern into production.

### 4. Two `CLAUDE.md` files without cross-references

**Issue:** Repo root `CLAUDE.md` and `.claude/skills/shmocard-design-system/CLAUDE.md` both auto-load when Claude works inside the design-system subtree. They don't reference each other. A future Claude session reading one doesn't know the other exists.

**Recommendation:** add cross-references — root CLAUDE.md "Design system" row in the pointer table mentions the nested CLAUDE.md; nested CLAUDE.md gains a "Repo-level rules" section pointing to root. Specify rule precedence:
- **Design-system rules win** for visual / typography / mascot / section-rotation / icon stroke / utility-class-prefix.
- **Repo-level rules win** for file organization, Shopify data discipline, live-store protection, vault conventions, verification.

### 5. `SKILL.md` skill-frontmatter ambiguity

**Issue:** `.claude/skills/shmocard-design-system/SKILL.md` ships with frontmatter (`name: Shmocard`, `description: Design system for Shmocard...`). This **looks like** a Claude Code skill registration but it's not in `.claude/skills/` and won't be discovered by the skill loader.

**Two fixes:**
- **A. Strip the frontmatter** — it's a doc, not a skill. Re-title it "Design System Manual" or similar.
- **B. Register it as a project-local skill** — move/symlink to `.claude/skills/shmocard-design/SKILL.md` so it actually triggers when Jordan asks for design-related work.

**Recommended: B** — auto-load the design system rules whenever Jordan or Claude touches UI work in this repo. Makes the design system rules behave like Jordan's recurring "skills should be project-level" preference.

### 6. Buybox.html double-loads fonts

**Issue:** `Buybox.html` has its own `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` PLUS imports `colors_and_type.css` which already loads the same fonts via `@import`. Slows the demo page; risks FOIT/FOUT.

**Recommendation:** Remove the redundant `<link>` block from `Buybox.html`. Same check on every preview — fix any that double-load.

### 7. Static Bricolage cuts (~30 .ttf files) probably redundant

**Issue:** Bricolage Grotesque ships as a variable font (`BricolageGrotesque-VariableFont_opsz_wdth_wght.ttf`) which covers all weights and optical sizes in one file. The system also bundles ~30 static cuts. Per `colors_and_type.css`, only the variable font is loaded via `@font-face`. The static cuts are unused at runtime.

**Recommendation:** Confirm with Jordan whether static cuts are intentional (e.g., for local-adoption scenarios where variable fonts aren't supported, or as design-time alternatives). If not, delete them — frees ~10MB of binary repo weight.

### 8. Preview numbering gaps

**Issue:** Preview files numbered 01–33 with gaps at 06, 14, 27, 31, 32.

**Recommendation:** Trivial. Either fill the gaps with intended cards (probably "06-borders-radii", etc.) or renumber to be contiguous. Lowest-priority finding.

---

## What's NOT broken (call out the wins)

- The CSS-as-source-of-truth invariant is well-enforced in docs.
- PRIMITIVES.md has a "smell test" of common bugs that's gold for downstream Claude sessions.
- Section rotation, mascot rule, soft-by-default rule, no-gradient rule are surfaced in **all 3 docs** — redundancy here is helpful, not redundant.
- Cart drawer family in `components.css` (~440 lines) is dense but well-sectioned with state shimmer, milestones, upsell, empty state, payments strip — full coverage.
- Reference pages literally show every state of every primitive. That's what Phase 3 will compose.
- Tokens never expose a hex code in the public API; everything routes through `var(--color-*)` etc.
- The `--color-cocoa` aliasing footgun is **explicitly documented as not provided** — that's the kind of nuance that prevents 1-day debugging sessions later.

---

## Inventory totals

| Category | Count |
|---|---|
| Markdown docs (top-level) | 4 |
| CSS source files | 2 |
| Reference HTML pages | 3 (Homepage + Buybox + Cart Drawer) |
| Homepage support files | 7 (5 .jsx + 1 .js + 1 .css) |
| Preview cards | 28 HTML + 1 .css |
| Font files | 35 .ttf + 1 README |
| Runtime state files | 2 (gitignored) |
| Total tracked files | ~78 |

---

## Proposed Moves (Step 02-02 — executed 2026-05-07)

Jordan reviewed the audit findings and locked the following decisions. All three were applied in a single atomic commit.

### Decision 1 — Folder rename in place

**Locked:** `context/design system/` → `.claude/skills/shmocard-design-system/` (kebab-case, stays inside `context/`).

**Why:** the actual problem was the space in the name, not the location. Moving to repo root or `app/` was overthinking. Kebab rename fixes shell escaping, import paths, and URL handling without forcing other folder structure changes.

**Executed:** `git mv "context/design system" .claude/skills/shmocard-design-system`. All internal CSS / HTML / font paths use relative references and survived unchanged. All cross-references in `.planning/`, `.claude/`, root `CLAUDE.md`, `gsd-shmocard` skill updated via bulk sed.

### Decision 2 — Move design-system rules into `.claude/rules/`

**Locked:** `context/design system/CLAUDE.md` → `.claude/rules/design-system.md` (reframed as a rule file, not a hierarchical auto-loaded CLAUDE.md).

**Why (Jordan's call, better than my original cross-reference proposal):**
- Eliminates the "two CLAUDE.md" problem entirely — only root CLAUDE.md exists.
- Matches how existing engineering rules organize (`live-store-protection.md`, `shopify-data-discipline.md`, `verification.md`, `vault-conventions.md`, `file-organization.md`).
- Rule applies to ALL UI work in `app/` + `components/`, not only when Claude reads inside the design-system subtree.
- Source-of-truth docs (`SKILL.md`, `README.md`, `PRIMITIVES.md`, the CSS) stay where they are; the rule file is the orchestrator pointing at them.

**Precedence locked in the new rule file:**
- Design-system rules WIN on visual / typography / mascot / section-rotation / utility-class-prefix.
- `live-store-protection`, `shopify-data-discipline`, `file-organization`, `verification` WIN where they apply (live-store safety, product data discipline, repo structure, browser-proof verification).
- `frontend-design` (Anthropic plugin) anti-slop principles still apply for composition / hierarchy / cognitive load — but design-system rules win on conflicts.

### Decision 3 — Strip skill frontmatter from SKILL.md

**Locked:** `.claude/skills/shmocard-design-system/SKILL.md` is a documentation file, not a registered Claude skill.

**Why:**
- Auto-loading is now handled by `.claude/rules/design-system.md` — registering SKILL.md as a separate skill would create ambiguous precedence with `frontend-design`.
- Jordan flagged conflict-with-frontend-design risk; cleanest answer is to not register.
- The SKILL.md content stays the same — just frontmatter removed and a header note added clarifying it's a doc.

### Files changed in this step

| File | Change |
|---|---|
| `context/design system/` → `.claude/skills/shmocard-design-system/` | folder renamed via `git mv` |
| `context/design system/CLAUDE.md` | deleted (content moved + reframed) |
| `.claude/rules/design-system.md` | created — orchestrator rule file |
| `.claude/skills/shmocard-design-system/SKILL.md` | frontmatter stripped, doc header added |
| `CLAUDE.md` (root) | pointer table updated; design-system status line refreshed; `frontend-design` precedence note added to routing rule |
| `.claude/rules/file-organization.md` | new row for `.claude/skills/shmocard-design-system/` |
| `.planning/PROJECT.md` | path refs updated |
| `.planning/REQUIREMENTS.md` | path refs updated |
| `.planning/ROADMAP.md` | path refs updated |
| `.planning/STATE.md` | path refs + open-questions cleanup |
| `.planning/phases/02-design-system-review/CONTEXT.md` | path refs updated |
| `.planning/phases/02-design-system-review/PLAN.md` | path refs updated |
| `.claude/skills/gsd-shmocard/SKILL.md` | path refs updated |

### Open audit issues addressed by this step

- ✅ #1 Folder name has space — resolved (renamed)
- ✅ #4 Two CLAUDE.md files — resolved (collapsed to one + rule file)
- ✅ #5 SKILL.md frontmatter ambiguity — resolved (stripped)

### Open audit issues still pending (later steps)

- #2 `ui_kits/website/` mixed organization — defer; cosmetic, low-priority. Can be tidied during Phase 3 reference-page translation.
- #3 Three rendering models for three reference pages — addressed by step 02-05 (translation plan).
- #6 Buybox.html double-loads fonts — defer; trivial fix, can roll into Phase 3 cleanup.
- #7 Static Bricolage cuts redundant — open question for Jordan; deferred until step 02-06.
- #8 Preview numbering gaps — trivial, defer indefinitely.

## Next step

**02-03 was rolled into 02-02** (the move-CLAUDE.md-into-rules decision collapsed the original "reconcile two CLAUDE.md" task). Skip directly to **02-04** (Tailwind 4 ↔ `.shm-*` coexistence decision) → **02-05** (reference-page translation plan) → **02-06** (remaining open questions: motion library, GHL webhook URL, static font cuts) → **02-07** (lock canonical files / Phase 2 close-out).

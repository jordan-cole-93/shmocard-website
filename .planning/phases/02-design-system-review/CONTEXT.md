# Phase 2: Design System Review — Context

**Gathered:** 2026-05-07
**Status:** Ready for planning
**Source:** Direct (post-bootstrap, no discuss-phase ceremony — design system folder dropped 2026-05-07, scope already locked in `context/general/scope.md` and ROADMAP.md)

<domain>
## Phase Boundary

Phase 2 audits the design system folder Jordan dropped at `context/design system/` on 2026-05-07, surfaces structural / naming / consistency issues, decides how the system integrates with the Next.js + Tailwind 4 codebase, and locks the canonical files (`DESIGN.md` / `PATTERNS.md` or design-system-equivalent) before any rebuild begins.

**In scope:**
- Auditing every file in `context/design system/` (top-level docs, CSS, fonts, previews, ui_kits)
- Surfacing folder/naming/structural issues (folder name has space; `home-*.jsx` fragmented; mixed loose-vs-nested HTML in `ui_kits/website/`)
- Reconciling the two CLAUDE.md files (root + `context/design system/CLAUDE.md`) so they don't conflict
- Deciding Tailwind 4 ↔ `.shm-*` utility coexistence (token import path)
- Translating the Babel-loaded JSX reference pages into a Phase 3 implementation plan
- Resolving open decisions (folder rename? `SKILL.md` registration?)
- Writing locked decision artifacts the rebuild phase will consume

**Out of scope:**
- Building any production page, component, or route (that's Phase 3)
- Modifying the design system's actual visual rules — those are locked by Jordan in `context/design system/CLAUDE.md` and `SKILL.md`
- Adding new primitives, fonts, colors, or motion choices to the system
- Wiring Shopify Storefront API
- Mobile/a11y passes (that's Phase 4)
- Restructuring `.claude/`, `context/general/`, or any other repo area unrelated to design system

</domain>

<decisions>
## Implementation Decisions

### Source of truth (LOCKED)

- **The CSS files are the canonical truth** when docs disagree (`colors_and_type.css`, `components.css`). Per `context/design system/CLAUDE.md`.
- **Reference pages are not optional reading** — `ui_kits/website/homepage/Shmocard Homepage.html`, `Buybox.html`, `Cart Drawer.html` define section structure, primitive composition, sticky bar behavior. Audit must respect these as authoritative.
- **`PRIMITIVES.md` is the canonical primitive index.** SKILL.md table is a quick reference.

### Hard rules to preserve (LOCKED — from design system's own CLAUDE.md)

- Every utility class is `.shm-` prefixed. No exceptions.
- Section rotation = 4 colors only (`marsh / graham / ember / cocoa`).
- Soft-by-default, hard when it counts. Hard outline + 4px shadow opt-in only.
- Mascot is a sticker. Max 140px. Max 2 per page (200px showcase exception = homepage spotlights only).
- Tokens, never hex. `var(--color-ember)`, never `#FF5B1F`.
- No exclamation marks. No emoji as decoration. No gradients. No drop-shadow blurs. No left-border accent stripes.
- Iconography is hand-drawn cocoa-deep, 2.4–2.6px stroke, round caps. No Lucide-style 1.5px outlines.
- Wave dividers, never zigzags. No extra vertical space — wave eats into boundary.
- Compact section padding (40px / 80px hero / 120px final-CTA). Ecommerce density, not airy marketing.
- Logo: mascot (left) + "ShmoCard" wordmark, two-tone (Shmo cocoa, Card ember).
- The 4 bundled fonts are the whole stack — Bricolage Grotesque, Cherry Bomb One, Inter Tight, Shadows Into Light Two.

### Coexistence (TO DECIDE in Phase 2)

- **Tailwind 4 ↔ `.shm-*` utilities.** Tailwind 4 introduces `@theme` token blocks. The design system ships its own token system in `colors_and_type.css`. Decision needed: import design CSS directly (`@import "context/.../colors_and_type.css"` in `app/globals.css`), or transcribe tokens into Tailwind 4 `@theme` (risk: drift). Recommended path: import directly to preserve CSS-as-source-of-truth invariant, use Tailwind 4 only for layout utilities that don't conflict with `.shm-*`.
- **JSX reference pages.** The reference pages (`Shmocard Homepage.html`, `Buybox.html`, `Cart Drawer.html`) use Babel-loaded `<script type="text/babel">` JSX bundles. Production Next.js needs them as proper `.tsx` components. Translation plan needed.

### Naming / structural issues (TO RESOLVE in Phase 2)

- **Folder name has a space**: `context/design system/`. Breaks bare imports, awkward in shell. Should it become `context/design-system/`? Or move to `design-system/` at repo root? Or stay because the folder ships as a self-contained system Jordan can copy elsewhere?
- **Loose HTML at `ui_kits/website/` root**: `Buybox.html` and `Cart Drawer.html` (note space) sit at the top while `homepage/` is nested. Inconsistent.
- **`home-*.jsx` fragmentation**: 5 files (`home-app`, `home-bundle`, `home-parts`, `home-modals`, `home-data`). Babel-loaded inline. Won't survive a Next.js port unchanged.
- **`SKILL.md` has skill frontmatter**. Meant to be registered as a Claude skill? If yes, where does it install to (project? global?) and what triggers it? If no, strip the frontmatter to avoid confusion.
- **Two `CLAUDE.md` files**: root `CLAUDE.md` and `context/design system/CLAUDE.md`. Hierarchical loading means both activate when working inside the design system subtree. Need to confirm they don't conflict and reference each other appropriately.

### Locked decisions for Phase 3 (output of this phase)

- Final folder location and name (after Phase 2's rename decision)
- Token import strategy (direct CSS import vs Tailwind 4 transcription)
- React component structure for cart drawer, buy-box sticky bar, nav, FAQ, mascot, sticker, image frame, section primitives
- Translation approach for the three reference pages (`Shmocard Homepage.html`, `Buybox.html`, `Cart Drawer.html`)
- `DESIGN.md` and `PATTERNS.md` — written or replaced by `context/design system/CLAUDE.md` + `SKILL.md` + `README.md` + `PRIMITIVES.md` (the design system already provides equivalents)

### Claude's Discretion

- Specific audit findings (what counts as "messy" — Jordan flagged the folder as "also messy" and wants help cleaning it up)
- Recommended structural moves (rename, consolidate, deprecate)
- Wording of locked decision artifacts
- Whether to write a separate `DESIGN.md` / `PATTERNS.md` at repo root or treat the design system folder as self-documenting

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Repo-level rules

- `CLAUDE.md` — system brain + pointer table + auto-trigger skill routing
- `.claude/rules/file-organization.md` — folder structure (LOCKED)
- `.claude/rules/live-store-protection.md` — Storefront API only (LOCKED)
- `.claude/rules/shopify-data-discipline.md` — data in Shopify, presentation in code (LOCKED)
- `.claude/rules/verification.md` — don't claim done without browser proof
- `.claude/rules/vault-conventions.md` — Jordan's Obsidian vault is read-only from this repo

### Repo-level project context

- `context/general/scope.md` — phase source of truth (Phase 2 punch list = ROADMAP.md plans)
- `context/general/handoff.md` — last session state
- `context/general/context.md` — business + audience + page intents
- `context/general/marketing.md` — locked headlines + voice rules
- `context/general/product.md` — catalog, formats, programming, returns
- `context/general/backend.md` — Shopify integration, env vars, webhook revalidation
- `context/general/tools.md` — skill / command / hook / MCP stack

### Design system (THE SUBJECT OF THIS PHASE)

- `context/design system/CLAUDE.md` — design system rules (LOCKED)
- `context/design system/SKILL.md` — operator's manual + primitive table
- `context/design system/README.md` — brand context + visual foundations
- `context/design system/PRIMITIVES.md` — canonical primitive index
- `context/design system/colors_and_type.css` — every token + type ramp (LOCKED)
- `context/design system/components.css` — every primitive (LOCKED)
- `context/design system/ui_kits/website/homepage/Shmocard Homepage.html` — canonical marketing page
- `context/design system/ui_kits/website/homepage/home.css` — page-level CSS pattern
- `context/design system/ui_kits/website/Buybox.html` — canonical PDP + sticky bar
- `context/design system/ui_kits/website/Cart Drawer.html` — canonical cart drawer
- `context/design system/preview/*.html` — visual cards / QA fixtures (28 files)
- `context/design system/fonts/` — 4 brand fonts (Bricolage Grotesque variants, Cherry Bomb One)

### GSD planning artifacts

- `.planning/PROJECT.md` — project-level core value + constraints + key decisions
- `.planning/REQUIREMENTS.md` — REQ-09 covers design system integration
- `.planning/ROADMAP.md` — Phase 2 plan stubs

</canonical_refs>

<specifics>
## Phase-Specific Notes

- **No code changes in Phase 2.** Output is decision artifacts (audit doc + recommendations + locked decisions) that Phase 3 consumes. Jordan reviews and approves before Phase 3 begins.
- **Idempotency:** if Phase 2 is re-run after Jordan tweaks the design system folder, the audit must re-run cleanly without leftover state.
- **Anti-scope-creep guard:** if a finding suggests a *visual* change to the design system (color, type, primitive structure), surface it to Jordan but do NOT lock it in Phase 2 — those decisions live in `context/design system/CLAUDE.md` and Jordan owns them.
- **Verification standard:** Phase 2 outputs are reviewable docs only. No browser screenshots needed for this phase. Verification = Jordan reads, agrees, signs off.
- **Cross-phase impact:** every Phase 2 decision flows directly into Phase 3 plans. A wrong call here costs days. Better to surface ambiguity than guess.
</specifics>

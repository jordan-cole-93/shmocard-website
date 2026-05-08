# handoff.md — Session Handoff

**Last session:** 2026-05-07 — Closed three structural gaps between the homepage build and the canonical reference: hero meta strip, sub-brand wordmark identity, and the two full-bleed sections (audience strip + compatibility band). Cleaned up redundant inline styles in the same pass.

---

## Project phase

Phase 3 (Rebuild) still reads complete (12/12 plans). STATE.md still stale relative to git. No formal Phase 4 directory exists yet — the open routing question (A polish / B formalize visual-redesign / C launch-readiness) is still unresolved and was carried straight through this session in polish mode (path A).

This session was canonical alignment + cleanup against the reference homepage at `.claude/skills/shmocard-design-system/ui_kits/website/homepage-shmocard/`. No phase metadata changes.

---

## What was done this session

- **Hero meta strip — canonical hand-note port.** Replaced the three-attribute checklist (`Pre-programmed before shipping · Reprogrammable for life · 30-day returns`) with the canonical hand-note pattern: `Live now — Shmo Review` in Shadows Into Light Two ember 22px + 26px hand-drawn arrow SVG, dot separator, then plain `3 more tools coming this year` in 13px ink-3. Mirrors `home-bundle.jsx:660-669` exactly. New CSS rules: `.home-hero__hand-note` + `.home-hero__hand-note svg` in `components/home/home.css:56-65`.

- **Sub-brand wordmark identity — tile names render as full sub-brand logos.** Each sub-brand tile name now renders as a concatenated wordmark mirroring the parent ShmoCard logo: `ShmoReview` / `ShmoBiz` / `ShmoLink` / `ShmoReputation`, no space, in Cherry Bomb One, two-tone (`Shmo` cocoa-deep + descriptor ember). Implemented via inline-IIFE in `components/home/Hero.tsx:82-95` that splits `sb.eyebrow` on first space, removes the space, wraps the descriptor in `<span class="home-hero__tile-name-suffix">`. CSS: `.home-hero__tile-name` swapped from `var(--font-display)` (Bricolage 800) to `var(--font-wordmark)` (Cherry Bomb One); added `.home-hero__tile-name-suffix { color: var(--color-ember) }`.

- **Design system scope expansion — wordmark covers parent + sub-brand wordmarks.** The "wordmark = logo only" rule was asserted in 7 places. Updated all 7 to "parent logo + sub-brand wordmarks (`Shmo Review`, `Shmo Biz`, `Shmo Link`, `Shmo Reputation`)" so future devs can't re-hit the friction Jordan hit this session. Files: `.claude/skills/shmocard-design-system/SKILL.md:66 + :72`, `README.md:53 + :133 + :148`, `PRIMITIVES.md:62`, `colors_and_type.css:117`, `fonts/README.md:7`, `preview/01-logo-wordmark.html:63`, `.claude/rules/design-system.md:48`.

- **Audience strip → full-bleed.** Was wrapped in `<Section>` which adds `.shm-section` (40px section padding) + `.shm-container` (max-width clipping) — visually too much breathing room (~62px instead of 22px) and items clipping ~200px short of the section edges. Refactored to render its own raw `<section className="shm-bg-graham">` + sibling wave divider, matching canonical `home-bundle.jsx:704-707`. Also folded the per-item inline `style={{display:"inline-flex",gap:44}}` into `.audience-strip__group` CSS class. Set `aria-hidden="true"` since the marquee is decorative. File: `components/home/AudienceStrip.tsx`.

- **Compatibility band → full-bleed (same fix).** Same exact bug as the audience strip — wrapped in `<Section>`. Refactored to raw `<section>` + sibling wave per `home-bundle.jsx:772`. File: `components/home/Compatibility.tsx`.

- **Inline-style cleanup — primitives already handled it.** HowItWorks and Proof had 5 inline `style={{...}}` props on section heads + ledes (centering, max-width 56ch, margin reset). Audited the design system: `.shm-section-head` in `components.css:396-400` already declares `text-align: center; margin: 0 auto 40px; max-width: 56ch`, and `.shm-section-head .shm-lede` already has `margin: 0`. The 5 inline styles were pure restatement of primitive defaults — pure cargo-cult code. Removed. The only inline doing real work — the `<ol>` reset on `.how-grid` — moved into the `.how-grid` CSS rule (`list-style: none; padding: 0; margin: 0`); also dropped the rule's previous `margin-top: 28px` since the inline was overriding it to 0 anyway. Files: `components/home/HowItWorks.tsx`, `components/home/Proof.tsx`, `components/home/home.css:456-462`.

### Files modified

- `components/home/Hero.tsx` — hand-note + tile name two-tone split rendering
- `components/home/AudienceStrip.tsx` — bypass `<Section>`, raw section + sibling wave + `.audience-strip__group` class
- `components/home/Compatibility.tsx` — bypass `<Section>`, raw section + sibling wave
- `components/home/HowItWorks.tsx` — drop 3 inline styles
- `components/home/Proof.tsx` — drop 2 inline styles
- `components/home/home.css` — added `.home-hero__hand-note`, `.home-hero__hand-note svg`, `.home-hero__tile-name-suffix`, `.audience-strip__group`; updated `.home-hero__tile-name` to use `var(--font-wordmark)` + `letter-spacing: 0`; updated `.how-grid` with `<ol>` reset and removed `margin-top: 28px`
- `.claude/skills/shmocard-design-system/SKILL.md` — wordmark scope (line 66) + logo two-tone rule (line 72)
- `.claude/skills/shmocard-design-system/README.md` — wordmark two-tone (line 53), wordmark scope prose (line 133), wordmark font table (line 148)
- `.claude/skills/shmocard-design-system/PRIMITIVES.md` — wordmark scope (line 62)
- `.claude/skills/shmocard-design-system/colors_and_type.css` — wordmark comment (line 117)
- `.claude/skills/shmocard-design-system/fonts/README.md` — wordmark scope in fonts table (line 7)
- `.claude/skills/shmocard-design-system/preview/01-logo-wordmark.html` — preview note now mentions sub-brand wordmarks (line 63)
- `.claude/rules/design-system.md` — wordmark scope in type stack section (line 48)

### Screenshots produced (in `pictures/screenshots/`)

- `hero-meta-handnote-port.png` — verifies hand-note renders correctly
- `hero-tile-names-cherry-bomb.png` — first-pass Cherry Bomb on tile names (before two-tone split)
- `hero-tile-names-subbrand-wordmarks.png` — final two-tone sub-brand wordmark treatment
- `audience-strip-canonical-fullbleed.png` — verifies audience strip runs edge-to-edge
- `compat-canonical-fullbleed.png` — verifies compat band runs edge-to-edge
- `inline-styles-removed-fullpage.png` — full page after primitives cleanup

### Commits landed

- `e992363` polish(home): hero canonical alignment + sub-brand wordmark identity
- `b1a4ae9` fix(layout): audience strip + compat band run full-bleed (canonical)
- `a3745e8` refactor(home): drop redundant inline styles — primitive defaults handle it

Each commit was created without `--no-verify`, pre-commit hooks ran clean, each leaves the build functional in isolation. Six logical units batched into three commits because `home.css` had cumulative changes across all six and splitting further would have required fragile patch surgery for no real benefit.

### Things explicitly NOT changed this session

- Hero CTA row spacing — still queued from prior handoff
- Proof section primitives audit (`.shm-card` confirm) — still queued
- SubBrand spotlights mascot sizing (200px hero variant) — still queued
- FAQ block primitive confirm (`.shm-faq-list` soft) — still queued
- Final CTA / footer wave (`--xl` wave + extra padding-bottom calc) — still queued
- ROADMAP / Phase 4 reframe — still untouched
- STATE.md `last_activity` and `progress` block — still stale relative to git

### Surprise dividend

The 5 inline styles on HowItWorks + Proof weren't fixing missing primitive defaults — they were pure noise restating defaults that already existed. The design system was already correct; whoever built those components didn't realize `.shm-section-head` handled it. Lesson worth remembering: before adding `style={{...}}` to fix a layout, check the primitive's existing rules first.

---

## What's next

Path A homepage polish per the still-open routing question. The remaining queued targets in priority order:

1. **Hero CTA row / meta strip** — spacing pass; the meta strip is now the canonical hand-note, but row alignment with the new hand-note hasn't been re-evaluated.
2. **Proof section primitives** — confirm cards use `.shm-card` not custom rules.
3. **SubBrand spotlights** — memory observation flagged spotlight mascot sizing as design-system non-compliant (200px hero variant is showcase-only — needs review).
4. **FAQ block** — confirm it uses `.shm-faq-list` (soft) and not the rare `--featured-card` variant.
5. **Final CTA / footer wave** — confirm `--xl` wave + extra padding-bottom calc per design-system rule.

Independent of section choice: STATE.md `last_activity` and `progress` block remain stale relative to git. Refresh whenever the next phase begins.

---

## Open decisions

- **Phase 4 routing** — A vs B vs C still unresolved (carried from prior handoff). This session committed to A in practice but never updated ROADMAP.md.
- **Canonical alignment scope** — The 2-line headline is locked, the hand-note is now canonical, the wordmark/sub-brand treatment is canonical+. But the eyebrow copy ("A toolkit, not a card" vs canonical "A toolkit for local crews"), lede copy, and second CTA label ("See the toolkit" vs canonical "Browse the toolkit") all still diverge from canonical. Confirm whether intentional Shmocard copy choices or also need alignment.
- **Hero caret style** — current is soft CSS fade. Canonical is literal `|` glyph with hard square-wave blink in ember. Jordan picked soft earlier; flag only if he raises it.
- **Tile envelope** — bordered vs floating, still deferred from prior session.
- **Heart-hands badge nudge** — still deferred.

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Ask Jordan: **"Continuing homepage polish — which target next? Hero CTA row, Proof primitives, SubBrand spotlights, FAQ, or final CTA? Or pivot to Phase 4 routing?"**
4. Before any UI work, invoke the `shmocard-design-system` Skill tool first per `.claude/rules/skill-routing.md` mandatory-first rule. Then read `.claude/rules/design-system.md`.
5. Before dispatching any UI subagent, inline the design-system hard rules + the LAYOUT IS LOCKED paragraph into the Agent prompt verbatim. There is no UI wrapper skill — guardrails travel as text inside the prompt.
6. **New audit pattern**: when a section visually feels "boxy" or "over-cushioned", check whether it's wrapped in `<Section>` when it should be a raw `<section className="shm-bg-{color}">` + sibling wave (the audience-strip / compat full-bleed pattern). The other 8 home sections correctly use `<Section>`; verified clean this session.
7. **New audit pattern**: before adding `style={{...}}` to fix layout in a component, grep the design system primitives for existing rules — likely the primitive already handles it.
8. Run `/gsd-progress` to see roadmap state before committing to a path.

# handoff.md — Session Handoff

**Last session:** 2026-05-07 — Replaced the hero headline crossfade with a typewriter animation, locked the line break, then compared the build against the canonical reference and Jordan chose to keep the current 2-line layout over the canonical 3-line layout.

---

## Project phase

Phase 3 (Rebuild) still reads complete (12/12 plans) per `gsd-sdk query init.progress`. STATE.md still stale relative to git. No formal Phase 4 directory exists yet — open routing question (A polish / B formalize visual-redesign / C launch-readiness) is still unresolved and was carried straight through this session in polish mode.

This session was polish-only on the Hero headline animation + a structured comparison against the canonical homepage in `.claude/skills/shmocard-design-system/ui_kits/website/homepage/`.

---

## What was done this session

- **Hero headline structure:** added `<br />` after "your" in `components/home/Hero.tsx` so the headline renders as two lines — line 1 "The toolkit your" / line 2 "crew's been [cycling word].". Bumped `.home-hero h1 max-width` from `18ch → 26ch` in `components/home/home.css` so line 1 stays unwrapped.

- **Typewriter animation in `components/home/HeroTypeCycle.tsx`:** removed the framer-motion `AnimatePresence` opacity crossfade and replaced it with a typing state machine (`typing → pausing → deleting → next word`). Settings: `typeSpeedMs: 70`, `deleteSpeedMs: 40`, `pauseAtFullMs: 1600`. `useReducedMotion` fallback shows the full word and swaps on a slower interval with no caret blink.

- **Period placement (3 iterations, ended inside the cycle):** first attempt left the period outside the `<em>` — produced a visible gap between the caret and the period whenever the typed word was shorter than the longest reserved width. Second attempt removed `min-width` reservation entirely so the line breathed with content — but caused "crew's been" to jitter horizontally as the cycle word grew/shrank (because the centered line shifted). Final shape: period moved inside the cycle as a sibling span (`.home-hero__cycle-period`) with `font-style: normal` + `color: var(--color-cocoa-deep)` overrides so it breaks out of the `<em>` styling. `min-width` reservation restored, longest word + 22px buffer for caret + period.

- **Caret:** rendered as a CSS span (2px wide, 0.85em tall, `currentColor`, `align-self: center`) with a soft 1.05s ease-in-out fade blink keyframe (`shm-caret-blink`). Animation is suppressed under `prefers-reduced-motion`.

- **CSS rules added in `components/home/home.css`:** `.home-hero__cycle-measure`, `.home-hero__cycle-text`, `.home-hero__cycle-caret`, `.home-hero__cycle-period`, `@keyframes shm-caret-blink`, and a `prefers-reduced-motion` override.

- **Canonical comparison.** Spun up a temporary `python3 -m http.server` on port 6789 against `.claude/skills/shmocard-design-system/`, rendered the canonical `Shmocard Homepage.html` in headless Chromium at 1440×900, captured `pictures/screenshots/canonical-hero-full.png` + `canonical-hero-section.png`, captured our build at `our-hero-full.png`, and diffed. Findings:
  - **Bg + grid are byte-identical** between canonical and our build (`#FFFBF1` marshmallow + 32px grid in `rgba(59,31,20,0.055)` cocoa-deep, padding 64px / 24px). The "feels different" was not the bg.
  - **Headline scale is the actual delta.** Canonical renders a 3-line headline ("The toolkit your" / "crew's been" / "[cycle].") because `<br />` lives after "been" + `max-width: 18ch` causes `text-wrap: balance` to wrap "The toolkit your crew's been" onto 2 lines, with the cycle alone on line 3 in 79px Bricolage. Ours renders 2 lines because we moved the `<br />` to after "your" and bumped `max-width` to 26ch.
  - **Caret style differs** — canonical = literal `|` glyph in `var(--color-ember)` with hard square-wave blink (`steps(1, end)`, 0–50% opaque / 51–100% transparent). Ours = 2px CSS bar, `currentColor`, soft fade.
  - **Timings differ** — canonical 140/80/2200/900 (type/delete/hold/end-hold). Ours 70/40/1600/0.
  - **Period in canonical is outside `<em>`. NBSP fallback (`shown || " "`) keeps line height stable when fully deleted between words.**
  - Other (non-header) deltas not addressed: eyebrow copy ("A toolkit, not a card" vs canonical "A toolkit for local crews"), lede copy, hero meta strip ("Pre-programmed before shipping…" vs canonical hand-note "Live now — Shmo Review · 3 more tools coming this year" with hand-drawn arrow SVG), second CTA label.

- **Decision:** Jordan reviewed the side-by-side and explicitly chose to KEEP the current 2-line implementation. No revert to canonical. The current shape is locked.

### Files modified

- `components/home/Hero.tsx` — `<br />` after "your", removed trailing literal "."
- `components/home/HeroTypeCycle.tsx` — full rewrite, typewriter engine
- `components/home/home.css` — `max-width: 26ch`, caret + period + measure rules, blink keyframe, reduced-motion override

### Screenshots produced (in `pictures/screenshots/`)

- `hero-typing-asking-for.png`, `hero-typing-missing.png` — first-pass (period outside cycle, big gap visible — superseded)
- `hero-typing-line2-asking-for.png`, `hero-typing-line2-missing.png` — final state (period glued to caret, current locked design)
- `canonical-hero-full.png`, `canonical-hero-section.png` — canonical reference rendered from kit
- `our-hero-full.png` — build rendered at 1440×900 for the canonical comparison

### Things explicitly NOT changed this session

- Section.tsx structure — wave divider already lives as a sibling (committed prior session 99ad03c).
- Hero CTA row, meta strip, sub-brand toolkit tiles — untouched.
- Eyebrow copy, lede copy, hand-note absence — flagged in canonical comparison, not actioned per Jordan's lock-in.
- ROADMAP / Phase 4 reframe — still untouched.

---

## What's next

Path A (homepage polish) per the routing question Jordan opened in the prior session. Likely next targets, in priority order:

1. **Hero CTA row / meta strip** — spacing pass; meta strip doesn't currently match canonical's hand-note pattern but Jordan didn't ask to align.
2. **Proof section primitives** — confirm cards use `.shm-card` not custom rules.
3. **SubBrand spotlights** — memory observation 296 flagged spotlight mascot sizing as design-system non-compliant (200 px hero variant is showcase-only — needs review).
4. **FAQ block** — confirm it uses `.shm-faq-list` (soft) and not the rare `--featured-card` variant.
5. **Final CTA / footer wave** — confirm `--xl` wave + extra padding-bottom calc per design-system rule.

Independent of section choice: STATE.md `last_activity` and `progress` block remain stale relative to git. Refresh whenever the next phase begins.

---

## Open decisions

- **Phase 4 routing** — A vs B vs C still unresolved (carried from prior handoff). This session committed to A in practice but never updated ROADMAP.md.
- **Canonical alignment scope** — Jordan kept the 2-line headline. But the eyebrow copy ("A toolkit, not a card" vs canonical "A toolkit for local crews"), lede copy, second CTA label ("See the toolkit" vs canonical "Browse the toolkit"), and meta strip (utility line vs canonical hand-note) all diverge from canonical. Confirm whether these are intentional Shmocard copy choices or also need alignment.
- **Caret style** — current is soft CSS fade. Canonical is literal `|` glyph with hard blink in ember. Jordan picked solid bar earlier and approved current; flag this as a future polish-pass option only if he raises it.
- **Tile envelope** — bordered vs floating, still deferred from prior session.
- **Em-accent on tile names** — still deferred.
- **Heart-hands badge nudge** — still deferred.

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Ask Jordan: **"Continuing homepage polish — which section next? Hero CTA row, Proof, SubBrand spotlights, FAQ, or final CTA?"**
4. Before dispatching any UI subagent, read `.claude/rules/design-system.md` first and inline its hard rules + the LAYOUT IS LOCKED paragraph into the Agent prompt verbatim. There is no UI wrapper skill — guardrails travel as text inside the prompt.
5. If Jordan revisits the canonical comparison, the deltas table is captured under "Canonical comparison" above — start there rather than re-running the diff.
6. Run `/gsd-progress` to see roadmap state before committing to a path.

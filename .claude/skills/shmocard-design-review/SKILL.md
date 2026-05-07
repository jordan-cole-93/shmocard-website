---
name: shmocard-design-review
description: Use BEFORE spawning a subagent (Codex via codex:rescue, or any review subagent) to critique a Shmocard page visually. Returns the verbatim guardrail block the orchestrator MUST splice into the subagent's Agent prompt. Triggers on phrases like "review the homepage design", "Codex review", "audit this page visually", "critique the visual", "second-opinion design pass".
---

# Shmocard design-review dispatch — embed block

**This skill returns a prompt fragment.** When the orchestrator (parent agent) is about to spawn a review subagent (Codex via `codex:rescue`, or a Claude review subagent), it MUST first invoke this skill, then splice the entire `<embed>` block below verbatim into the front of the subagent's Agent prompt. The reviewer cannot invoke skills (SDK limitation). The rubric must travel as text.

**How to use:**
1. Orchestrator reads this SKILL.md.
2. Copies everything between `<embed>` and `</embed>` markers verbatim.
3. Splices into Agent prompt at the TOP, before the review brief.
4. Spawns review subagent with the augmented prompt.

**This skill is for visual / design review only.** Code-quality review uses `code-review:code-review` instead.

---

<embed>

# SHMOCARD DESIGN REVIEW — RUBRIC (read first, do not skip)

You are reviewing a Shmocard website page. Repo root: `/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmo Website`. The `Skill` tool is NOT available in your environment. The rubric below is your sole evaluation framework.

## Mandatory file reads (in order)

1. `.claude/rules/design-system.md`
2. `context/design-system/SKILL.md`
3. `context/design-system/PRIMITIVES.md`
4. `context/design-system/colors_and_type.css`
5. `context/design-system/components.css`
6. `context/design-system/ui_kits/website/<relevant-page>.html` — the canonical reference for the page being reviewed
7. `context/general/marketing.md` — locked headlines (every word should be verbatim — flag any deviation)

## What you are reviewing

The page rendered at the dev server URL provided in the task brief (typically `http://localhost:3000/<route>`), AND the source code at `app/<route>/` + `components/<page-name>/*`. You have access to:
- Live dev URL (use Playwright or headless Chrome to render + screenshot)
- Source files (use Read)
- Design-system CSS source-of-truth files

## Rubric — score each dimension out of 10

### 1. Composition & hierarchy
- Does each section have ONE clear focal element?
- Is type contrast crisp? (Hero ≫ lede ≫ body — visual ratio ≥ 3×, ideal ≥ 4×)
- Does the eye know where to land first?

### 2. Spacing & rhythm
- Does the page breathe? Or feel cramped?
- Is `.shm-section` applied to every section wrapper (verify in DevTools — `--section-py-d` token must apply)?
- Density rhythm: does it vary across sections (dense / sparse / dense / sparse) or feel uniform?
- Generous whitespace around hero, around proof moments, between sections?

### 3. Color & section rotation
- Strict 4-color rotation: `marsh` (~60%) → `graham` (~25%) → `ember` (~10%) → `cocoa` (~5%)?
- Are the percentages roughly right, or is the rotation lopsided?
- Wave dividers between sections? Right size for the transition (sm / md / lg / xl)?
- Text-color flips correct on dark backgrounds (cocoa, ember)?

### 4. Type stack
- Display = `--font-display` (Bricolage 700/800)?
- Body = `--font-sans` (Inter Tight 400–700)?
- Accent = `--font-hand` (Shadows Into Light Two)?
- Wordmark = `--font-wordmark` (Cherry Bomb One — LOGO ONLY — never headlines)?
- Any other font sneaking in? (System-ui, plain Inter, Roboto, Fraunces, etc. → AUTO-FAIL)

### 5. Mascot discipline
- Max 140px sticker on regular pages, max 2 instances?
- Showcase exception (homepage sub-brand spotlights only): may use 200px `.shm-mascot--hero` per design-system rule. All 4 spotlights eligible.
- Is mascot used as DECORATION (small, tucked) or as HERO SUBJECT (forbidden)?
- Mascot pose appropriate to context?

### 6. Iconography
- Hand-drawn cocoa-deep, 2.4–2.6px stroke, round caps?
- Any Lucide / Heroicons / 1.5px stroke / outline icon library imports? → AUTO-FAIL
- Any emoji used as decoration? → AUTO-FAIL

### 7. Anti-slop check (the auto-fails)
Run these greps inside the page's component dir + `components/home/` (or relevant page dir). Each must return zero results:

```
grep -rE 'box-shadow.*[1-9][0-9]*px [1-9][0-9]*px' <page-dir>          # no drop-shadow blurs
grep -rE '\b(bg|text|border|rounded|shadow|font)-[a-z]+(-[a-z0-9]+)?' <page-dir> | grep -vE '\.shm-|//|/\*|shm-bg|shm-text'   # no Tailwind color/type
grep -rE '#[0-9a-fA-F]{3,8}\b' <page-dir>          # no hex colors
grep -rEn '>[^<]*![^=<][^<]*<' <page-dir>/*.tsx | grep -v 'aria-' | grep -v 'className'   # no exclamation marks in JSX text
grep -rE 'linear-gradient|radial-gradient' <page-dir>          # no gradients
grep -rE 'border-left:\s*[0-9]+px' <page-dir>          # no left-border accent stripes
grep -rE 'from "(lucide|heroicons|@heroicons|react-icons)' <page-dir>          # no icon library imports
```

Any non-zero result → flag in review with file:line.

### 8. Locked-headline verbatim check
- Compare every visible headline against `context/general/marketing.md`.
- Any rephrasing → flag (rephrasing is forbidden — locked copy is locked).

### 9. Showcase-exception leak (homepage-only rule)
- Showcase liberties from `context/design-system/ui_kits/website/homepage/Shmocard Homepage.html` (200px hero mascots, flat-color video tiles) are allowed ONLY on the homepage.
- If reviewing a non-homepage page (PDP, category, etc.): showcase-liberty patterns there → flag as wrong.

### 10. Earned moments
- Does each section have at least one element that feels deliberate (not template-default)?
- Or does the page feel like a Webflow template, with sections that could be on any landing page?

## Output format

Produce a review report at `.planning/phases/<current-phase>/<plan-id>-DESIGN-REVIEW.md` with:

```markdown
# Design Review — <plan-id>

## Verdict
PASS / PASS-WITH-WARNINGS / FAIL

## Scores
| Dimension | Score | Notes |
|---|---|---|
| 1. Composition & hierarchy | X/10 | ... |
| 2. Spacing & rhythm | X/10 | ... |
| 3. Color & rotation | X/10 | ... |
| 4. Type stack | X/10 | ... |
| 5. Mascot discipline | X/10 | ... |
| 6. Iconography | X/10 | ... |
| 7. Anti-slop check | PASS/FAIL | grep results inline |
| 8. Locked headlines | PASS/FAIL | any deviations |
| 9. Showcase leak | PASS/FAIL | ... |
| 10. Earned moments | X/10 | ... |

## Top 3 issues (severity-ranked)
1. ...
2. ...
3. ...

## Specific edit suggestions (file path + line)
...

## Final answer
"If [executor] follows your suggestions, will the page pass Jordan's bar?"
[Yes / No / Conditional on...]
```

## Anti-flattery rule

Do NOT pad the review with positive observations. Jordan does not need encouragement; he needs honest critique. Lead with what's broken. If the page is good, say "PASS, no major issues" and stop. Don't manufacture concerns to look thorough.

## Codex-specific note

If you are Codex (running via the Codex CLI), apply the visual rubric above. You may render the page yourself via Chrome DevTools / Playwright. Output the review at the path specified above. Do NOT modify code from a review pass — your output is the report only.

</embed>

---

## End of embed block

**Reminder to orchestrator:** the reviewer does NOT have the Skill tool. Splice the block above verbatim. The output is a markdown report at `.planning/phases/<current-phase>/<plan-id>-DESIGN-REVIEW.md`.

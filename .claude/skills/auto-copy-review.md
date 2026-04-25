---
name: auto-copy-review
description: "Fires when writing or editing user-facing text — headlines, subheads, CTAs, body copy, button labels, descriptions, error messages. Runs the copy-reviewer agent. Triggers on: headline, CTA, button text, copy, description, user-facing text, label, tagline, subhead."
---

**When writing or editing any user-facing text in a component — run the copy-reviewer agent.**

## What counts as user-facing text

- Headlines, subheadlines, taglines
- CTAs and button labels
- Product descriptions
- Error messages, empty states, tooltips
- Meta descriptions, page titles

## What does NOT count

- Code comments, variable names, console logs, internal docs — skip these.

## Process

1. Identify the user-facing text being written or edited
2. Dispatch the `copy-reviewer` agent on it
3. The agent checks against `.claude/rules/marketing.md` — voice, locked headlines, tradesperson test, verified stats only

## If the review flags failures

Rewrite the copy before building it into the component. Don't ship copy that fails the tradesperson test.

## Key rules the agent enforces

- Short sentences, under 12 words most of the time
- Real nouns: "the card", "your employee" — not "the solution"
- Verified numbers only — "500+ crews" is a placeholder, flag it everywhere
- Shmocard naming: never "Shmo Card", "ShmoCard", or "Shmocard Review"

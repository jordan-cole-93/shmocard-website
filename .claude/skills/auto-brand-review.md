---
name: auto-brand-review
description: "Fires after completing any component, page section, or full page — before showing Jordan the result. Runs the design-reviewer agent as a quality gate. Triggers on: component done, section complete, page built, ready to preview, showing Jordan, finished building."
---

**After finishing any component, page section, or full page — run the design-reviewer agent before showing Jordan.**

## Process

1. Identify the file(s) just completed
2. Dispatch the `design-reviewer` agent on those files
3. Read the agent's output

## If the review passes

Present the result to Jordan normally.

## If the review flags failures

1. Fix every issue flagged with a red X
2. Re-run the design-reviewer agent
3. Repeat until it passes
4. Only then show Jordan the result

**Do not ask Jordan if he wants a design review. Just run it. Every time.**

Jordan should only ever see clean, reviewed output. The review happens silently — he doesn't need to know it ran unless something interesting came up in the review that's worth mentioning.

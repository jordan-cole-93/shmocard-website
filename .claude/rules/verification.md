# Verification Before Completion

**Don't claim "done" without proof.** This applies to every task — components, refactors, bug fixes, design changes.

## The rule

Before telling Jordan a feature is built, a bug is fixed, or a section "looks right":

1. **Run it.** Start the dev server, open the browser, see the result on screen.
2. **Verify the golden path.** The thing actually works for the intended use case.
3. **Check edge cases.** Mobile width, French copy, empty states, long text.
4. **Watch for regressions.** Did the change break something elsewhere on the page?
5. **No console errors.** Open browser DevTools, confirm no red errors or warnings.

## Type checks vs feature checks

`tsc --noEmit` and `npm run build` verify **code correctness** — they don't verify **feature correctness**. A component can compile cleanly and render badly. Always verify the actual rendered output, not just the build.

## Screenshot proof

For UI changes, take a screenshot via Playwright and save to `pictures/screenshots/<descriptive-name>.png` so Jordan has proof to review.

## Face problems, don't dodge them

When something breaks:
- **Diagnose first** — what's the actual root cause?
- **Fix the cause** — not a workaround that hides the symptom.
- **Don't switch approaches just to avoid a problem.** If a hover state is broken, fix it. Don't say "let me try a different approach."

If diagnosis takes more than 15 minutes without progress, surface that to Jordan rather than grinding silently.

## When you can't verify

Some changes can't be verified visually (server-only logic, build config, type-only changes). In those cases, **say so explicitly**:

> "Compiled cleanly. I couldn't verify the rendered behavior — needs you to confirm in the browser."

Never claim verified when you didn't verify.

## What success looks like

- Browser tab open with the change rendering correctly.
- Screenshot saved to `pictures/screenshots/`.
- No errors in console.
- Mobile width still works.
- Adjacent features unchanged.

Then — and only then — claim done.

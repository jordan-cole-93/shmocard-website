---
description: "Run a full design + copy brand review on a specific file. Usage: /brand-check <file-path>"
argument_hint: "file path (e.g. app/components/Hero.tsx)"
---

Run a complete brand review on: **$ARGUMENTS**

## Steps

1. Read the target file
2. Read these references:
   - `branding guide/styles.css` — design tokens
   - `.claude/rules/design.md` — design system rules
   - `.claude/rules/marketing.md` — voice, copy, proof points
3. Dispatch the `design-reviewer` agent on the file
4. Dispatch the `copy-reviewer` agent on any user-facing text in the file
5. Combine both into a single report

## Output format

```
## Brand Check: [filename]

### Design Review
[design-reviewer output]

### Copy Review
[copy-reviewer output]

### Verdict: PASS / FIX FIRST
[If anything fails, list every fix needed before Jordan previews]
```

If both pass, say so clearly. If either fails, list every issue — don't summarize, be specific.

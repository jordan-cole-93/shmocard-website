# Subagent Dispatch

**Auto-applies any time the parent agent spawns a subagent via the Agent tool.** Wrappers and inline guardrails are how design and Shopify rules survive the dispatch — without them, the subagent runs without rules.

## Why wrappers exist

Spawned subagents structurally cannot access the Skill tool ([SDK issue #102](https://github.com/anthropics/claude-agent-sdk-typescript/issues/102)). Global skills like `frontend-design`, `impeccable`, and `redesign-skill` only work inside the parent agent. To enforce design rules on UI work, the parent (orchestrator) must invoke the matching project-local wrapper skill first; the wrapper returns a verbatim guardrail block to splice into the subagent's Agent prompt. Rules travel as text inside the prompt — not as a Skill call the subagent can't make.

## Shopify subagent dispatch

| Condition | Wrapper to invoke (parent-side) | Use case |
|---|---|---|
| Spawning a subagent for **Shopify Storefront / cart / Server Action / webhook** work | `shmocard-shopify-work` | Live-store-protection enforcement on backend dispatch |

**Hard rule:** ALWAYS invoke `shmocard-shopify-work` before dispatching a Shopify subagent. The wrapper produces the prompt; never write the Shopify subagent prompt freehand. Skipping the wrapper = subagent works without live-store rules = unsafe output.

## UI subagent dispatch (mandatory builder)

UI work runs through the `design-system-builder` project-local agent at `.claude/agents/design-system-builder.md`. The builder's system prompt **enumerates every design-system rule inline** (mandatory reads, primitive table, hard rules, LAYOUT IS LOCKED, wave-divider sibling rule, type stack, forbidden patterns). The parent does not paraphrase or hand-author guardrails — it dispatches the agent and lets the agent's own system prompt do the enforcement.

| Condition | Agent to dispatch (parent-side) | Use case |
|---|---|---|
| Any `.tsx` / `.css` edit in `app/` or `components/` (new section, new component, variant, polish, spacing, color, mascot, layout) | `design-system-builder` | Mandatory for ALL UI work |

**Hard rule:** the parent orchestrator does NOT write UI code directly. Even one-line `.tsx` styling changes go through the builder. The only carve-out is pure copy/text edits (typo fix, headline swap) with **zero** class / styling / structural changes — those can be done inline by the parent.

What the parent must hand the builder in the Agent prompt:
- Task description (what to build / polish / fix).
- Route to verify on (e.g., `/`, `/shmo-review`).
- Any reference screenshots, sketches, or quotes from Jordan.
- For polish: explicit "this is polish — do not restructure."

What the parent does NOT hand the builder:
- The design-system rules. They live in the agent file. Repeating them in the prompt is wasted tokens.
- Hand-authored guardrails. The builder enforces its own rules.

If you find yourself pasting design-system rules into an Agent prompt, stop — that text belongs in the builder's system prompt, not in every dispatch.

## LAYOUT IS LOCKED on polish tasks

When Jordan says "polish", "fix the spacing", "the design is missing something", or any refinement-not-restructure language, the parent passes `"this is a polish task — LAYOUT IS LOCKED, do not change grid columns, element ordering, tile size ratios, or structural HTML"` to the builder. The builder's system prompt already enforces this — the parent flag just makes the intent explicit.

Polish = spacing / type / color / mascot only.

## Hard rule

When dispatching ANY subagent that touches UI or Shopify, the matching project-local agent (`design-system-builder` for UI, `shmocard-shopify-work` wrapper for Shopify) must be used. Never write the prompt freehand. If a project-local agent's enumerated rules are wrong, fix the agent file — don't bypass it.

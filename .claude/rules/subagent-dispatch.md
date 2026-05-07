# Subagent Dispatch

**Auto-applies any time the parent agent spawns a subagent via the Agent tool.** Wrappers and inline guardrails are how design and Shopify rules survive the dispatch — without them, the subagent runs without rules.

## Why wrappers exist

Spawned subagents structurally cannot access the Skill tool ([SDK issue #102](https://github.com/anthropics/claude-agent-sdk-typescript/issues/102)). Global skills like `frontend-design`, `impeccable`, and `redesign-skill` only work inside the parent agent. To enforce design rules on UI work, the parent (orchestrator) must invoke the matching project-local wrapper skill first; the wrapper returns a verbatim guardrail block to splice into the subagent's Agent prompt. Rules travel as text inside the prompt — not as a Skill call the subagent can't make.

## Shopify subagent dispatch

| Condition | Wrapper to invoke (parent-side) | Use case |
|---|---|---|
| Spawning a subagent for **Shopify Storefront / cart / Server Action / webhook** work | `shmocard-shopify-work` | Live-store-protection enforcement on backend dispatch |

**Hard rule:** ALWAYS invoke `shmocard-shopify-work` before dispatching a Shopify subagent. The wrapper produces the prompt; never write the Shopify subagent prompt freehand. Skipping the wrapper = subagent works without live-store rules = unsafe output.

## UI subagent dispatch (hand-authored guardrails)

There is no UI wrapper skill anymore. When the parent dispatches a UI subagent, the parent must hand-author the guardrails directly into the Agent prompt. Required steps:

1. **Read `.claude/rules/design-system.md` first** (parent agent — subagent can't load it).
2. **Inline its hard rules into the Agent prompt verbatim** — `.shm-*` prefix, no primitive restyles, tokens not hex, section rotation, mascot 140px, no emoji/gradients/blur, hand-drawn icons, locked type stack.
3. **Inline the LAYOUT IS LOCKED paragraph (below) when the task is polish-flavored.**
4. **Reference the canonical source-of-truth files** so the subagent knows where to read: `context/design-system/SKILL.md`, `colors_and_type.css`, `components.css`, `PRIMITIVES.md`, and the relevant `ui_kits/` reference page.

If the parent skips any of these steps, the subagent will produce off-system output that gets rejected.

## LAYOUT IS LOCKED on polish tasks

When Jordan says "polish", "fix the spacing", "the design is missing something", or any refinement-not-restructure language: **NEVER** change grid columns, element ordering, tile size ratios, or structural HTML. Polish = spacing / type / color / mascot only. See `.claude/rules/design-system.md` for full rule text. This paragraph must appear inside the Agent prompt verbatim whenever a UI polish subagent is dispatched.

## Hard rule

When dispatching ANY subagent that touches UI or Shopify, this rule must be honored before the Agent tool is invoked. No exceptions.

# Skill Routing (Parent Agent)

**Applies when the parent agent decides which skill to load before acting.** Subagent dispatch lives in `.claude/rules/subagent-dispatch.md` — this file covers what the parent itself loads.

Skills below should fire automatically when their condition matches. If a condition matches the current task, invoke the skill **before** writing code or producing the design.

## Parent-agent skill routing

| Condition | Skill to invoke | Notes |
|---|---|---|
| **Any UI / visual / design / component / layout / page work in this repo** | **`shmocard-design-system`** (project-local, auto-discoverable) | **MANDATORY FIRST.** Invoke via the Skill tool BEFORE writing code, BEFORE reading other docs, BEFORE any subagent dispatch. Loads `SKILL.md` (operator's manual), primitive table, canonical reference pointers, hard rules. No exceptions. |
| Starting any non-trivial multi-step task in this repo | `gsd-progress` → then `/gsd-plan-phase` or `/gsd-quick` | GSD owns plan → execute → verify discipline. Skip for typo-level fixes. |
| Trivial 1–3 file fix | `/gsd-fast` | No subagents, inline. |
| Resuming session after `/clear` or break | `/gsd-resume-work` or `/gsd-progress` | Restores STATE.md context. |
| Session lifecycle (capture decisions, edits, bug fixes) | `claude-mem` | Auto by plugin — no manual invocation. |
| Tool-call output bloat / context preservation | `context-mode` | Auto by plugin — no manual invocation. Check stats with `/context-mode:ctx-stats`. |

## Hard rule for design / UI prompts

For any prompt mentioning design / layout / UI / component / hero / section / typography / palette / animation / spacing / wave / mascot / sticker / Shmocard:

1. **Invoke the `shmocard-design-system` Skill via the Skill tool FIRST.** This loads `SKILL.md` — the operator's manual with the primitive table, hard rules, canonical reference pages. Don't paraphrase from memory; load the actual file. Skipping this is a recurring failure mode and is what produced the 5h wave-divider seesaw on 2026-05-07.
2. **Then read `.claude/rules/design-system.md`** — the project-level orchestrator that points at additional source-of-truth files (`PRIMITIVES.md`, `colors_and_type.css`, `components.css`, `ui_kits/website/*`).
3. **Only after both are loaded**, write code or dispatch subagents.

The design system is the authority on visual / typography / mascot / section-rotation / utility-class-prefix decisions. Anthropic's `frontend-design`, `impeccable`, and `redesign-skill` global skills are available if useful, but are not auto-loaded — the design system rules + SKILL.md are sufficient.

**Symptom that this rule was broken:** producing UI code that fights the design system — wrong section bg, missing `.shm-` prefix, em accent missing, custom drawer instead of `.shm-cart-*`, hand-coded icons instead of hand-drawn cocoa-deep strokes. If you catch yourself inventing instead of composing primitives, the SKILL.md wasn't loaded.

## Project-local sub-agents

Three project-local agents live at `.claude/agents/*.md`. They are spawned via the Agent / Task tool by the parent orchestrator (NOT loaded as skills — subagents structurally cannot access the Skill tool). Each is self-contained: rules are enumerated inline in the system prompt.

| Trigger condition | Agent to dispatch | Model | When |
|---|---|---|---|
| Finished a UI change (`.tsx` / `.css`) and want design-system compliance verified before commit | `design-system-auditor` | Sonnet | Post-edit, pre-commit. Read-only audit. |
| About to commit Shopify-touching code (`.tsx`/`.ts` referencing products, prices, cart) | `shopify-data-checker` | Haiku | Pre-commit. Scans for hardcoded product data. |
| About to commit ANY Shopify-flagged change | `live-store-guard` | Haiku | Pre-commit. Defensive net for Admin API / theme / `.env` writes. |

**Dispatch order on a Shopify UI commit:** `design-system-auditor` → `shopify-data-checker` → `live-store-guard`. All three must return PASS / SAFE before commit.

**Hard rule:** never write subagent prompts freehand for these three concerns. Always dispatch the matching agent file. If the agent's enumerated rules are wrong, fix the agent file — don't bypass it with a freehand prompt.

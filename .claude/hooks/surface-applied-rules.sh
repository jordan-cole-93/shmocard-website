#!/usr/bin/env bash
# UserPromptSubmit hook — requires every Claude response to begin with a
# "Following:" block listing rules, Skill-tool invocations, and implicitly-
# matched skills.
#
# Reason: Jordan needs visibility into which rules AND which skills informed
# each response so he can debug whether bad output is from broken rules,
# missing skill triggers, or Claude not following them. Self-reporting is
# soft enforcement, but it makes the routing decisions visible and reviewable.
#
# Fires on every prompt — unconditional.

set -euo pipefail

cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"=== OUTPUT FORMAT REQUIREMENT (auto-injected) ===\n\nEVERY RESPONSE must begin with a \"Following:\" block — one line, three labeled segments separated by ` | `.\n\nFormat:\nFollowing: skills=<a, b, ...> | rules=<x, y, ...> | why=<one short clause>\n\nRules:\n• `skills=` — list EVERY skill that influenced this response, both:\n    (a) skills you invoked via the Skill tool this turn (explicit), AND\n    (b) skills auto-applied via description match or hook injection (implicit — e.g. caveman, caveman-shmocard, claude-mem, context-mode).\n  If none, write `skills=none`.\n• `rules=` — list rule filenames without extension (e.g. file-organization, shopify-data-discipline, verification, vault-conventions, live-store-protection, design-system, live-store-protection). Reference DESIGN.md / CLAUDE.md sections when applied. If none, write `rules=none`.\n• `why=` — one short clause stating the reason this set was selected. If neither rules nor skills apply, still fill this with a brief reason (e.g. `general Q&A`, `status update`).\n\nUse skill names as registered (e.g., build-shmocard-component, impeccable-shmocard, frontend-design, gsd-progress, shopify-data-discipline, caveman-shmocard).\n\nPlace this single line on its own line, before any other content. Then continue normally."}}
JSON

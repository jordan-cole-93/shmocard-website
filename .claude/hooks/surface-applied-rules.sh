#!/usr/bin/env bash
# UserPromptSubmit hook — requires every Claude response to begin with a
# "Following:" line listing which rules, skills, and guidelines were applied.
#
# Reason: Jordan needs visibility into which rules informed each response so
# he can debug whether bad output is from broken rules or Claude not following
# them. Self-reporting is soft enforcement, but it makes the application of
# rules visible and reviewable.
#
# Fires on every prompt — unconditional.

set -euo pipefail

cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"=== OUTPUT FORMAT REQUIREMENT (auto-injected) ===\n\n• EVERY RESPONSE must begin with a \"Following:\" line naming the rules, skills, and guidelines you applied.\n\n• Format: Following: <rule-or-skill>, <rule-or-skill>, ...\n\n• Use rule filenames without extension (e.g., file-organization, shopify-data-discipline, verification, vault-conventions, live-store-protection).\n\n• Use skill names as registered (e.g., build-shmocard-component, impeccable-shmocard, taste-skill-shmocard, shopify-data-discipline).\n\n• Reference design system or universal CLAUDE.md rules when applied (e.g., DESIGN.md palette, CLAUDE.md File-organization).\n\n• If no project rule applies (general advice, status update, simple Q&A), write: Following: none — <brief reason>\n\n• Place this on its own line, before any other content. Then continue normally."}}
JSON

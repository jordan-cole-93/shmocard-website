#!/usr/bin/env bash
# UserPromptSubmit hook — detects multi-step work indicators in the user's
# prompt and forces a reminder that project CLAUDE.md requires GSD routing
# (/gsd-quick or /gsd-plan-phase) before any Write/Edit on multi-step tasks.
#
# Reason: CLAUDE.md "Hard rule" was being ignored on tasks that felt small.
# Soft guidance not enough. This hook adds enforcement nag.
#
# Fires only when prompt matches multi-step trigger patterns. Stays silent on
# trivial prompts so vibe flow not blocked.

set -euo pipefail

# Read full hook input (JSON on stdin) and extract user_prompt field.
input="$(cat)"
prompt="$(printf '%s' "$input" | jq -r '.prompt // .user_prompt // empty' 2>/dev/null || true)"

if [[ -z "$prompt" ]]; then
  exit 0
fi

# Lowercase for matching.
lower="$(printf '%s' "$prompt" | tr '[:upper:]' '[:lower:]')"

# Trigger patterns: multi-step / multi-file / refactor-shaped work.
# Tuned to avoid false positives on simple Q&A and one-shot fixes.
match=0

# Multi-step verbs
if [[ "$lower" =~ (refactor|rebuild|redesign|migrate|restructure|reorganize|overhaul|implement|build out|build the|scaffold|set up|wire up|integrate|introduce|roll out) ]]; then
  match=1
fi

# Plural / batch indicators
if [[ "$lower" =~ (update all|fix all|across the|throughout|every (file|page|component)|each of|all of the) ]]; then
  match=1
fi

# Multi-target ("X and Y and Z" or comma-listed targets)
if [[ "$lower" =~ (and the .* and the )|((,.*,.*,)) ]]; then
  match=1
fi

# Phase / plan / spec language (user already thinking in chunks)
if [[ "$lower" =~ (phase [0-9]|step [0-9]|plan to|spec out|breakdown|punch list) ]]; then
  match=1
fi

if [[ "$match" -eq 0 ]]; then
  exit 0
fi

cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"=== GSD ROUTING ENFORCEMENT (auto-injected) ===\n\nMulti-step work indicators detected in this prompt.\n\nProject CLAUDE.md hard rule: any non-trivial multi-step task in this repo MUST be routed through GSD before Write/Edit:\n\n  • /gsd-quick      — small ad-hoc task, atomic commit, optional verify\n  • /gsd-plan-phase — full phase-scoped plan with research + verify\n  • /gsd-fast       — ONLY for ≤3 file trivial fixes (typo, gitignore, single-line config)\n\nDo NOT skip straight to Edit/Write on multi-step work. If you skip, you violate the user's explicit project rule and lose the PLAN.md, atomic-commit, and verification artifacts that GSD produces.\n\nIf the prompt actually IS trivial (matched a keyword by accident), say so out loud and proceed with /gsd-fast or direct edit — but justify the choice in one sentence before acting."}}
JSON

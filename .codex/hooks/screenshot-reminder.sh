#!/usr/bin/env bash
# PostToolUse hook — fires after Edit/Write to .tsx or .css files.
# Emits a non-blocking reminder that visual changes need a screenshot before
# being claimed as done (per .claude/rules/verification.md "Screenshot proof").

set -uo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

case "$FILE_PATH" in
  *.tsx|*.css)
    cat <<JSON
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"Visual file edited: ${FILE_PATH##*/}. Per .claude/rules/verification.md, capture a screenshot to pictures/screenshots/ before claiming this task is done."}}
JSON
    ;;
  *)
    echo '{}'
    ;;
esac

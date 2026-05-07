#!/usr/bin/env bash
# Stop hook — run TypeScript typecheck and warn if errors.
#
# Non-blocking by design: emits a warning in additionalContext if `tsc --noEmit`
# fails so Jordan sees the error before claiming "done", but never blocks the
# Stop event (which would trap him with mid-edit type errors).
#
# Reason: enforces .claude/rules/verification.md "type checks vs feature checks"
# discipline at the lifecycle boundary instead of relying on Claude to remember.

set -uo pipefail

# Skip if no tsconfig (project not yet scaffolded with TypeScript)
if [ ! -f tsconfig.json ]; then
  exit 0
fi

# Skip if dependencies aren't installed (don't pay the install cost on Stop)
if [ ! -d node_modules/typescript ]; then
  exit 0
fi

OUTPUT=$(npx -s --no-install tsc --noEmit 2>&1)
STATUS=$?

if [ "$STATUS" -ne 0 ]; then
  ERR_COUNT=$(echo "$OUTPUT" | grep -cE "error TS[0-9]+:" || echo "0")
  cat <<JSON
{"hookSpecificOutput":{"hookEventName":"Stop","additionalContext":"⚠ TypeScript typecheck failed with ${ERR_COUNT} error(s). Run \`npx tsc --noEmit\` to see them. Don't claim 'done' until they're resolved (per .claude/rules/verification.md)."}}
JSON
fi

exit 0

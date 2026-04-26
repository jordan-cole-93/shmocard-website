#!/usr/bin/env bash
# PostToolUse hook on Write|Edit of components/*.tsx — warns when Claude
# hardcodes real mascot/product image paths instead of <Placeholder>.
#
# Reason: rule in memory gets ignored. Real imagery will be 3D nano-banana
# renders generated at the end. The PNGs in public/ are stand-ins from
# Claude Design's bundle, not the production assets.

set -euo pipefail

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_response.filePath // empty' 2>/dev/null)

# Only check tsx/jsx files inside components/
case "$FILE" in
  */components/*.tsx|*/components/*.jsx) ;;
  *) exit 0 ;;
esac

# File should exist after Write/Edit
[ -f "$FILE" ] || exit 0

# Look for hardcoded paths to public/mascot/ or public/products/
VIOLATIONS=$(grep -nE '"\/?(mascot|products)\/[^"]+\.(png|jpg|jpeg|webp)"' "$FILE" 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  jq -n --arg file "$FILE" --arg v "$VIOLATIONS" '{
    "systemMessage": ("⚠ PLACEHOLDER RULE VIOLATED in " + $file + "\n\nFound hardcoded image paths:\n" + $v + "\n\nUse <Placeholder label=\"description\"> instead. Real imagery (3D nano-banana renders) is generated at the end of the build — these public/ files are stand-ins, not production assets."),
    "decision": "block",
    "reason": "Hardcoded image paths in components are forbidden — use <Placeholder> instead."
  }'
fi

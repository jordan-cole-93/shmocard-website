#!/usr/bin/env bash
# Stop hook — at end of turn, move any stray *.png from repo root or
# .playwright-mcp/ into pictures/screenshots/.
#
# Reason: screenshot tools default to saving where they're told. If Claude
# forgets to pass the full path, the file lands at repo root. This sweep
# fixes it automatically so Jordan never sees clutter.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$REPO_ROOT/pictures/screenshots"
mkdir -p "$DEST"

MOVED=()

# Sweep repo root (maxdepth 1, so we don't touch app/, public/, etc.)
while IFS= read -r -d '' file; do
  base="$(basename "$file")"
  # Skip common project files that happen to be PNG (favicon etc.)
  case "$base" in
    favicon.png|logo.png|icon.png) continue ;;
  esac
  if mv "$file" "$DEST/$base" 2>/dev/null; then
    MOVED+=("$base")
  fi
done < <(find "$REPO_ROOT" -maxdepth 1 -type f -name "*.png" -print0 2>/dev/null)

# Sweep .playwright-mcp/ if it exists (Playwright's default output)
if [ -d "$REPO_ROOT/.playwright-mcp" ]; then
  while IFS= read -r -d '' file; do
    base="$(basename "$file")"
    if mv "$file" "$DEST/$base" 2>/dev/null; then
      MOVED+=("$base")
    fi
  done < <(find "$REPO_ROOT/.playwright-mcp" -maxdepth 2 -type f -name "*.png" -print0 2>/dev/null)
fi

if [ ${#MOVED[@]} -gt 0 ]; then
  jq -n --argjson n ${#MOVED[@]} --arg files "$(printf '%s\n' "${MOVED[@]}")" '{
    "systemMessage": ("📸 Moved " + ($n | tostring) + " stray screenshot(s) to pictures/screenshots/:\n" + $files)
  }'
fi

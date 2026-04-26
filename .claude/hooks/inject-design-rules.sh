#!/usr/bin/env bash
# UserPromptSubmit hook — injects Shmocard design rules into context
# when Jordan's prompt mentions UI/design/component-related keywords.
#
# Reason: rules in memory get drifted-from; an injected reminder every prompt
# is non-negotiable. This hook enforces what would otherwise be "remembered".

set -euo pipefail

# Read prompt from stdin JSON
PROMPT=$(jq -r '.prompt // ""' 2>/dev/null || echo "")

# Match design-related keywords (case-insensitive)
if echo "$PROMPT" | grep -iqE '\b(ui|design|component|section|variation|hero|footer|nav|navigation|button|card|color|colour|typography|font|spacing|layout|mockup|preview|screenshot|tailwind|css|placeholder|mascot|image|icon|grid|page|tsx|jsx)\b'; then
  cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"=== SHMOCARD DESIGN RULES (auto-injected) ===\n\n• PLACEHOLDERS: Use <Placeholder label=\"...\"> for ALL imagery in components. NEVER hardcode paths to /mascot/*.png or /products/*.jpg. Final imagery will be 3D nano-banana renders generated at the end — not the existing files.\n\n• MASCOT: Icon-only, max 32px. The cartoon mascot does NOT visually match 3D imagery — never compose them in the same frame. Use the mascot as a small companion glyph (footer wordmark, inline label, empty-state). Hero stages must NOT contain the mascot.\n\n• SCREENSHOTS: ALL screenshots save to pictures/screenshots/. Pass filename: \"pictures/screenshots/<name>.png\" to Playwright/browsermcp tools. Never save to repo root, never to .playwright-mcp/.\n\n• VARIATIONS: When Jordan asks for variations of a section/component, create them at app/preview/<name>/page.tsx so he can compare at /preview/<name>. Do not paste multiple variations into chat — make them browseable.\n\n• SOURCE OF TRUTH: DESIGN.md + DESIGN.json (repo root) + app/globals.css. Use Tailwind utilities (bg-ember, text-ink, rounded-2xl) — never legacy --shmo-* or --graham tokens. Never invent hex codes."}}
JSON
fi

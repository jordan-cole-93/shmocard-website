#!/usr/bin/env bash
# UserPromptSubmit hook — always invokes the caveman skill (full intensity)
# for compressed output, plus the caveman-shmocard project layer that ensures
# design rules are not relaxed by compression.
#
# Reason: Jordan wants every response compressed by default. Caveman mode cuts
# token usage ~75% while keeping technical accuracy. Project rules (design,
# file-organization, "Following:" surfacing) still apply.
#
# Fires on every prompt — unconditional.

set -euo pipefail

cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"=== COMMUNICATION MODE (auto-injected) ===\n\n• ALWAYS operate in caveman mode at intensity \"full\" (default) per the user-level /caveman skill. Cut filler, shorten sentences, drop articles where natural, keep technical accuracy intact.\n\n• Apply caveman-shmocard project layer: compressed output mode does NOT relax Shmocard design rules, file-organization rules, the \"Following:\" surfacing requirement, or any safety hook. Only the communication style is compressed — rule compliance is not.\n\n• Code, file paths, command syntax, JSON, and shell commands stay literal and uncompressed. Compression applies only to natural-language prose around them.\n\n• If Jordan explicitly requests a non-caveman response (\"speak normally\", \"full English\", etc.), comply for that turn. Otherwise default to caveman."}}
JSON

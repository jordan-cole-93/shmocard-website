---
phase: quick-260507-ddj
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .claude/agents/design-system-auditor.md
  - .claude/agents/shopify-data-checker.md
  - .claude/agents/live-store-guard.md
  - .claude/rules/file-organization.md
  - .claude/rules/skill-routing.md
  - CLAUDE.md
autonomous: true
requirements: [AGENT-CRYSTALLIZE-01]
must_haves:
  truths:
    - "Three subagent files exist in .claude/agents/ with valid YAML frontmatter (name, description, model, tools, color)"
    - "Each agent system prompt enumerates its rule's hard rules inline (no Skill-tool dependency)"
    - "design-system-auditor uses model: sonnet, color: orange, tools include Read+Grep+Glob+Bash"
    - "shopify-data-checker uses model: haiku, color: green"
    - "live-store-guard uses model: haiku, color: red"
    - "file-organization.md .claude/ directory table includes a row for .claude/agents/"
    - "skill-routing.md catalogs the three new agents with trigger conditions"
    - "All three agent files are <= 80 lines"
  artifacts:
    - path: ".claude/agents/design-system-auditor.md"
      provides: "Sonnet-backed read-only auditor enforcing design-system.md"
      contains: "name: design-system-auditor"
    - path: ".claude/agents/shopify-data-checker.md"
      provides: "Haiku-backed scanner for hardcoded product-data violations"
      contains: "name: shopify-data-checker"
    - path: ".claude/agents/live-store-guard.md"
      provides: "Haiku-backed safety gate for Admin API / theme / .env writes"
      contains: "name: live-store-guard"
    - path: ".claude/rules/file-organization.md"
      provides: "Documents .claude/agents/ as permitted Claude Code primitive folder"
      contains: ".claude/agents/"
    - path: ".claude/rules/skill-routing.md"
      provides: "Parent-agent dispatch table for the three project-local agents"
      contains: "Project-local sub-agents"
  key_links:
    - from: ".claude/agents/design-system-auditor.md"
      to: ".claude/rules/design-system.md"
      via: "rule citation in system prompt"
      pattern: "design-system\\.md"
    - from: ".claude/agents/shopify-data-checker.md"
      to: ".claude/rules/shopify-data-discipline.md"
      via: "rule citation in system prompt"
      pattern: "shopify-data-discipline\\.md"
    - from: ".claude/agents/live-store-guard.md"
      to: ".claude/rules/live-store-protection.md"
      via: "rule citation in system prompt"
      pattern: "live-store-protection\\.md"
    - from: ".claude/rules/skill-routing.md"
      to: ".claude/agents/*"
      via: "Project-local sub-agents table"
      pattern: "design-system-auditor|shopify-data-checker|live-store-guard"
---

<objective>
Crystallize three project-local subagents in a new `.claude/agents/` folder. Each is a self-contained markdown file (YAML frontmatter + system prompt) that the orchestrator can dispatch instead of authoring subagent prompts freehand. They enforce existing rules (design-system.md, shopify-data-discipline.md, live-store-protection.md) without depending on the Skill tool — which subagents structurally cannot access.

Purpose: replace ad-hoc freehand subagent prompts with versioned, model-tuned, deterministic agents.
Output: 3 agent definition files + 2 rule-file updates + 1 CLAUDE.md pointer line.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@CLAUDE.md
@.claude/rules/design-system.md
@.claude/rules/shopify-data-discipline.md
@.claude/rules/live-store-protection.md
@.claude/rules/file-organization.md
@.claude/rules/skill-routing.md
@.claude/rules/subagent-dispatch.md

<interfaces>
<!-- Frontmatter format (Claude Code subagent spec) -->
```yaml
---
name: <agent-name>           # kebab-case, must match filename
description: <one paragraph> # When to invoke. Mention trigger keywords.
model: sonnet | haiku | opus
tools: Read, Grep, Glob, Bash
color: orange | green | red | blue | purple | yellow
---
```
Followed by a markdown system prompt body. File MUST be <= 80 lines total.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create the three agent files in .claude/agents/</name>
  <files>
    .claude/agents/design-system-auditor.md
    .claude/agents/shopify-data-checker.md
    .claude/agents/live-store-guard.md
  </files>
  <action>
First: `mkdir -p .claude/agents` (verify it doesn't already exist with `ls .claude/agents/ 2>/dev/null`).

Then create three files using the Write tool. Each file: YAML frontmatter + concise system prompt body. Each <= 80 lines.

---

**File 1: `.claude/agents/design-system-auditor.md`**

Frontmatter:
- `name: design-system-auditor`
- `description: Audits a .tsx or .css file against the Shmocard design system rules. Spawned by the orchestrator after a UI change to verify compliance before commit. Use when prompts mention "audit design", "check design system", "verify component", "design review", "design-system compliance".`
- `model: sonnet`
- `tools: Read, Grep, Glob, Bash`
- `color: orange`

System prompt body MUST include these sections (concise — one short paragraph or bullet list each):

1. **Role:** Read-only auditor. Never edits files. Returns a verdict + line-by-line findings.
2. **Inputs you receive:** A target file path (`.tsx` or `.css`) and optionally a diff. Read the file with the Read tool. Use Grep for pattern checks across larger trees only when needed.
3. **Hard rules to check** (enumerate inline — do NOT defer to "read design-system.md", since subagents cannot load skills):
   - Every utility class is `shm-` prefixed. Flag any `class(Name)` containing `btn`, `bg-`, `card`, `pill`, `tile`, `cart-`, `buybox-`, `mascot`, `wave`, `image-frame` without the `shm-` prefix.
   - No primitive restyles in page CSS. Page-level files own LAYOUT only (grid, padding, gap, aspect-ratio). Color/type/radius/shadow/motion belong in `components.css`. Flag any `.shm-btn`, `.shm-card`, `.shm-pill` rules in page-level CSS.
   - Tokens, not hex. Flag literal hex values (`#[0-9A-Fa-f]{3,8}`) outside the design system source files. Same for raw `rgb(`, `hsl(`.
   - Section rotation = `marsh | graham | ember | cocoa` only. Flag any other section background.
   - Mascot is a sticker, max 140px, max 2 per page. Flag width/height > 140px on `.shm-mascot` (the 200px `.shm-mascot--hero` showcase variant is allowed only on the homepage).
   - Iconography hand-drawn, 2.4–2.6px stroke, round caps. Flag Lucide / Heroicons / `stroke-width="1.5"`.
   - No exclamation marks in copy. No emoji as decoration. No gradients. No `drop-shadow(...blur)`. No `border-left:.*var(--color-` accent stripes.
   - Type stack: only `--font-wordmark`, `--font-display`, `--font-body`, `--font-hand`. Flag `system-ui`, `Inter` (without Tight), `Roboto`, `Fraunces`, raw `Cherry Bomb` outside wordmark.
   - Buybox / cart: must use `.shm-buybox-sticky` and `.shm-cart-*`. Flag `position: fixed; bottom: 0` paired with product copy.
4. **Output format** (always return this exact structure):
   ```
   ## Verdict: PASS | WARN | FAIL
   ## Findings
   - <file>:<line> — <rule broken> — <quote of offending code>
   ## Rule citations
   - .claude/rules/design-system.md § <section>
   ```
   PASS = zero findings. WARN = stylistic only. FAIL = any hard-rule violation.
5. **Constraints:** Read-only. Do not Edit/Write. Do not run dev server. Do not invoke other agents. Stop after producing the verdict block.

---

**File 2: `.claude/agents/shopify-data-checker.md`**

Frontmatter:
- `name: shopify-data-checker`
- `description: Scans a diff or staged files for hardcoded product-data violations (prices, SKUs, product names, image paths, variant options). Run before commit on any Shopify-touching code. Use when prompts mention "check Shopify data", "audit product data", "verify storefront fetch", "pre-commit Shopify scan".`
- `model: haiku`
- `tools: Read, Grep, Glob, Bash`
- `color: green`

System prompt body sections:

1. **Role:** Fast deterministic scanner for hardcoded product data in `.tsx` / `.ts` / `.jsx` / `.js` files. Read-only.
2. **Inputs:** Either a diff (`git diff --staged` or supplied), a list of files, or a directory. Default to staged diff if nothing specified: `git diff --staged --name-only`.
3. **Hard rules to check** (enumerate inline from `.claude/rules/shopify-data-discipline.md`):
   - No hardcoded prices. Flag `$\d`, `€\d`, `\d+\.\d{2}` literals adjacent to product context, or `price.*=.*['"]\d`.
   - No hardcoded product names. Flag string literals matching known product titles: `Shmo Review`, `CR-80`, `L-Sign`, `Square Card` (when assigned to `name`/`title` props rather than displayed copy in marketing pages).
   - No hardcoded SKUs. Flag `sku.*=.*['"]`, `SKU:.*['"]`.
   - No hardcoded product image paths. Flag `<img[^>]*src=['"](/products/|/shopify/|cdn.shopify)`. Product images come from `product.images.nodes[].url`.
   - No static JSON catalog copies. Flag any new `products.json`, `catalog.json`, `inventory.json` in `app/` `components/` or `lib/`.
   - Cart goes through Storefront API. Flag custom cart state libraries instead of `cartCreate` / `cartLinesAdd` / `cartLinesRemove`.
   - No Admin API writes from this repo. Flag `adminApi`, `/admin/api/`, `Admin GraphQL`.
4. **Allowed (do NOT flag):**
   - Marketing copy headlines and CTAs (those live in code intentionally).
   - FAQ answers in `FAQ.tsx`.
   - Hardcoded layout / Tailwind utilities.
   - Placeholder labels in `<Placeholder label="...">` during build.
5. **Output format:**
   ```
   ## Verdict: PASS | FAIL
   ## Violations
   - <file>:<line> — <rule> — <quote>
   ## Rule citations
   - .claude/rules/shopify-data-discipline.md § <rule number>
   ```
6. **Constraints:** Read-only. No Edit/Write. No network calls. No Admin API.

---

**File 3: `.claude/agents/live-store-guard.md`**

Frontmatter:
- `name: live-store-guard`
- `description: Defensive safety gate. Verifies a diff contains no Admin API mutations, no theme file edits, no destructive Shopify CLI commands, and no .env* writes. Run before any Shopify-flagged commit. Use when prompts mention "live store check", "safety gate", "pre-commit Shopify safety", "verify no live-store risk".`
- `model: haiku`
- `tools: Read, Grep, Glob, Bash`
- `color: red`

System prompt body sections:

1. **Role:** Last-line safety gate before commit on Shopify-touching changes. Read-only.
2. **Inputs:** Default to `git diff --staged` (or supplied diff/file list).
3. **BLOCK conditions** (enumerate inline from `.claude/rules/live-store-protection.md`):
   - Any modification to a `.env`, `.env.local`, `.env.production`, `.env.*` file. BLOCK.
   - Any modification under a `theme/` or Liquid file (`.liquid`). BLOCK.
   - Any Shopify Admin API call: `/admin/api/`, `adminApiClient`, `shopify-api-node` admin scope, GraphQL Admin endpoint. BLOCK.
   - Any destructive Shopify CLI command in scripts: `shopify theme delete`, `shopify store reset`, `shopify theme push --live`. BLOCK.
   - Any DNS / domain config write: `domains:` in YAML, `vercel.json` `domains` mutation, Cloudflare API call. BLOCK.
   - Any commit of secrets: lines containing `STOREFRONT_TOKEN=`, `ADMIN_TOKEN=`, `SHOPIFY_API_SECRET=` with a non-empty value. BLOCK.
4. **SAFE conditions** (allowed):
   - Storefront API queries / cart mutations (`cartCreate`, `cartLinesAdd`, `cartLinesRemove`).
   - Reading collections, metafields, metaobjects via Storefront API.
   - Checkout redirect URLs (Shopify-hosted).
5. **Output format:**
   ```
   ## Verdict: SAFE | BLOCK
   ## Reason (only on BLOCK)
   - <file>:<line> — <rule> — <quote>
   ## Rule citations
   - .claude/rules/live-store-protection.md § <rule number>
   ```
   On BLOCK, include the literal sentence: `Stop. Ask Jordan before proceeding.`
6. **Constraints:** Read-only. No Edit/Write/Bash mutations. Never auto-fix — only diagnose.

---

After writing all three, verify line counts:
```
wc -l .claude/agents/*.md
```
Each must be <= 80 lines. If any exceeds, trim the system prompt body (keep the rule enumerations — trim prose).
  </action>
  <verify>
    <automated>test -f .claude/agents/design-system-auditor.md && test -f .claude/agents/shopify-data-checker.md && test -f .claude/agents/live-store-guard.md && for f in .claude/agents/*.md; do lines=$(wc -l < "$f"); if [ "$lines" -gt 80 ]; then echo "FAIL: $f has $lines lines (max 80)"; exit 1; fi; done && grep -l "^name: design-system-auditor$" .claude/agents/design-system-auditor.md && grep -l "^model: sonnet$" .claude/agents/design-system-auditor.md && grep -l "^name: shopify-data-checker$" .claude/agents/shopify-data-checker.md && grep -l "^model: haiku$" .claude/agents/shopify-data-checker.md && grep -l "^name: live-store-guard$" .claude/agents/live-store-guard.md && grep -l "^color: red$" .claude/agents/live-store-guard.md && echo OK</automated>
  </verify>
  <done>
    Three agent files exist, each <= 80 lines, with correct name/model/color frontmatter and inline rule enumeration in the system prompt body.
  </done>
</task>

<task type="auto">
  <name>Task 2: Update file-organization.md, skill-routing.md, and CLAUDE.md to register the new agents folder</name>
  <files>
    .claude/rules/file-organization.md
    .claude/rules/skill-routing.md
    CLAUDE.md
  </files>
  <action>
Three small edits using the Edit tool. Read each file first.

---

**Edit 1: `.claude/rules/file-organization.md`**

Locate the `### `.claude/` directory` table (the one starting with `| Path | Purpose |` listing `.claude/settings.json`, `.claude/rules/`, `.claude/commands/`, `.claude/skills/`, `.claude/hooks/`, `.claude/launch.json`).

Add a new row immediately after the `.claude/skills/` row:

```
| `.claude/agents/` | Project-local subagent definitions (Claude Code primitive). One markdown file per agent: YAML frontmatter (name, description, model, tools, color) + system prompt body. Subagents cannot load skills, so each agent enumerates its rules inline. Currently: `design-system-auditor` (Sonnet), `shopify-data-checker` (Haiku), `live-store-guard` (Haiku). |
```

No other changes to this file.

---

**Edit 2: `.claude/rules/skill-routing.md`**

Append a new section at the end of the file (after the existing "Hard rule for design / UI prompts" section):

```markdown

## Project-local sub-agents

Three project-local agents live at `.claude/agents/*.md`. They are spawned via the Agent / Task tool by the parent orchestrator (NOT loaded as skills — subagents structurally cannot access the Skill tool). Each is self-contained: rules are enumerated inline in the system prompt.

| Trigger condition | Agent to dispatch | Model | When |
|---|---|---|---|
| Finished a UI change (`.tsx` / `.css`) and want design-system compliance verified before commit | `design-system-auditor` | Sonnet | Post-edit, pre-commit. Read-only audit. |
| About to commit Shopify-touching code (`.tsx`/`.ts` referencing products, prices, cart) | `shopify-data-checker` | Haiku | Pre-commit. Scans for hardcoded product data. |
| About to commit ANY Shopify-flagged change | `live-store-guard` | Haiku | Pre-commit. Defensive net for Admin API / theme / `.env` writes. |

**Dispatch order on a Shopify UI commit:** `design-system-auditor` → `shopify-data-checker` → `live-store-guard`. All three must return PASS / SAFE before commit.

**Hard rule:** never write subagent prompts freehand for these three concerns. Always dispatch the matching agent file. If the agent's enumerated rules are wrong, fix the agent file — don't bypass it with a freehand prompt.
```

---

**Edit 3: `CLAUDE.md`**

In the "Where to find things" table, add a new row after the `Engineering rules` row:

```
| Project-local subagents (auditors, safety gates) | `.claude/agents/` (3 files: `design-system-auditor`, `shopify-data-checker`, `live-store-guard`) |
```

No other changes to CLAUDE.md.
  </action>
  <verify>
    <automated>grep -q '`.claude/agents/`' .claude/rules/file-organization.md && grep -q "Project-local sub-agents" .claude/rules/skill-routing.md && grep -q "design-system-auditor" .claude/rules/skill-routing.md && grep -q "shopify-data-checker" .claude/rules/skill-routing.md && grep -q "live-store-guard" .claude/rules/skill-routing.md && grep -q '`.claude/agents/`' CLAUDE.md && echo OK</automated>
  </verify>
  <done>
    file-organization.md table includes `.claude/agents/` row. skill-routing.md has a "Project-local sub-agents" section listing all three with trigger / model / timing. CLAUDE.md "Where to find things" table points at `.claude/agents/`.
  </done>
</task>

</tasks>

<verification>
1. `ls .claude/agents/` returns exactly 3 files: `design-system-auditor.md`, `shopify-data-checker.md`, `live-store-guard.md`.
2. `wc -l .claude/agents/*.md` shows each file <= 80 lines.
3. `head -10 .claude/agents/design-system-auditor.md` shows valid YAML frontmatter with `model: sonnet`, `color: orange`.
4. `head -10 .claude/agents/shopify-data-checker.md` shows `model: haiku`, `color: green`.
5. `head -10 .claude/agents/live-store-guard.md` shows `model: haiku`, `color: red`.
6. `grep -c "^- " .claude/agents/design-system-auditor.md` returns at least 8 (rule enumerations present inline, not deferred to design-system.md).
7. file-organization.md, skill-routing.md, CLAUDE.md all updated per Task 2.
8. Git status shows the new files staged-able, no other unintended changes.
</verification>

<success_criteria>
- Three crystallized agent files committable to the repo.
- Orchestrator can dispatch any of them via the Agent/Task tool with a one-line prompt referencing the agent name; the agent's own system prompt carries the rules.
- file-organization.md no longer treats `.claude/agents/` as a forbidden new top-level folder.
- skill-routing.md tells the parent agent when to dispatch each.
- CLAUDE.md "Where to find things" surfaces the new folder.
- Zero edits to live store, Shopify config, or production secrets.
</success_criteria>

<output>
After completion, create `.planning/quick/260507-ddj-crystallize-three-project-local-agents-i/260507-ddj-SUMMARY.md` with:
- Files created (3 agent files)
- Files modified (3 rule/doc files)
- Frontmatter values used per agent
- Line counts per agent
- Sample dispatch invocation for each agent (so Jordan can copy-paste)
</output>

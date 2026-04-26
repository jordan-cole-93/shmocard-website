# handoff.md — Session Handoff

**Last session:** 2026-04-26 — meta-context reset and restructuring complete.

---

## Project phase

**1. Restructure meta-context (✅ done) → 2. Branding guide (next) → 3. Tools (MCPs / commands / skills / hooks) → 4. Resume website build.**

Step 2 is gated on Jordan loading the new branding guide. **Don't build features or touch design code until step 2 lands** — the homepage is ~9/10 sections done with placeholder visuals, and finishing it before the new branding would just create rework.

---

## What was done this session

**Reset orientation.** Previous session ended with Jordan deleting agents, commands, skills, hooks, rules, and the old branding guide because he was hitting AI hallucinations and contradictory context. This session was the cleanup to escape that state.

**CLAUDE.md rewritten:**
- Broken paths repointed (was `.claude/rules/<file>.md`, now root-level)
- Sub-agents section removed (no agents exist)
- New "File organization" section added — codifies the layout and locks it
- Vault-side context files cross-referenced (Obsidian remapped them)

**Rule files reviewed:**
- `scope.md` — rewritten. Reflects real state (homepage 9/10, branding pending) and the new 4-step plan.
- `backend.md` — kept as-is. Still accurate.
- `tools.md` — review deferred to step 3. Heavy rewrite expected when MCPs/commands/skills/hooks get set up.
- `handoff.md` — this file (rewritten now).
- `faq.md` — deleted. Jordan didn't need it.

**Context files moved to vault:**
- `context.md`, `marketing.md`, `product.md`, and the entire `wireframe/` folder are now vault-only at `/Users/jordancole/Documents/Developement/Jordan's Brain/Projects/Shmocard/Shmocard Website/`.
- Obsidian updated CLAUDE.md to point at the vault paths.

**Settings cleaned:**
- `.claude/settings.json` — removed two hooks that pointed at deleted scripts (`auto-design-review.sh`, `inject-design-context.sh`). Kept the two working safety hooks (`.env` protection, Shopify Bash guard) and the `permissions.allow` list.
- `.claude/settings.local.json` — wiped to empty allow list (was 70+ stale entries).

**VS Code organization (global, not in repo):**
- File nesting enabled in Jordan's global VS Code user settings.
- `CLAUDE.md` group — `scope.md`, `backend.md`, `tools.md`, `handoff.md` collapse under `CLAUDE.md`.
- `package.json` group — lockfile, tsconfig, all `*.config.*` files, `next-env.d.ts`, `.gitignore`, `.gitattributes`, `.mcp.json` collapse under `package.json`.
- Result: only two visible files at repo root in the Explorer.

---

## What's next

**Step 2 — Load the new branding guide.**

When Jordan provides it:
1. Create `DESIGN.md` (narrative — palette, typography, named anti-patterns, voice-on-design rules).
2. Create `DESIGN.json` (machine-readable tokens — colors, font families, spacing scale, radii, shadows).
3. Update CLAUDE.md to remove the "not yet created — pending new branding guide" markers from the rule-files table.
4. Audit homepage components — decide per-component: keep, tweak, or rebuild against the new branding.

Do NOT create `DESIGN.md` / `DESIGN.json` stubs in advance. Wait for the actual guide.

---

## Open decisions

- **New branding direction** — blocks step 2. Pending Jordan loading the guide.
- Final retail pricing per SKU (Shopify currently shows placeholder prices)
- Bundle pack sizes + per-unit discounts
- Coming-soon page copy for Shmo Biz / Shmo Link / Shmo Reputation
- Third video testimonial (Carly + Joey confirmed; third pending)
- Shopify handle rename: `google-review` → `shmo-review` (post-launch SEO)

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md` — the "File organization" section is load-bearing now; don't restructure anything without explicit approval.
3. Ask Jordan: **"Ready to load the new branding guide, or working on something else?"**
4. If branding guide is ready → proceed with step 2 (create `DESIGN.md` + `DESIGN.json` from his input).
5. If branding isn't ready yet → don't push. Ask what he wants to work on.
6. Don't run `npm run dev` unless Jordan asks — we're not building yet.

**Rules to remember:**
- All `.claude/` agents/commands/skills/hooks subfolders are intentionally empty until step 3. Don't repopulate ahead of schedule.
- Two working safety hooks are still active in `.claude/settings.json`: `.env` file edits are blocked; Shopify Bash commands are evaluated for safety.
- Don't propose creating `faq.md`, `outputs/`, `branding guide/`, `rules/`, `docs/`, or `src/` folders — Jordan removed these intentionally and the layout is locked.
- Repo has uncommitted changes from this session if Jordan didn't commit before closing — run `git status` first to know the baseline.

# handoff.md — Session Handoff

**Last session:** 2026-05-07 — Claude Code infrastructure overhaul: trimmed CLAUDE.md to a router, crystallized three project sub-agents, relocated the design system into the auto-discoverable skills folder, wired two lifecycle hooks, and added two `$ARGUMENTS`-driven slash commands.

---

## Project phase

**Phase 3 (Rebuild) is already complete** per project memory (12/12 plans executed earlier). Phase 4 is unconfirmed — the open question between (A) freeform polish, (B) formalize Phase 4 = visual-redesign, or (C) jump to launch-readiness has been carried forward across multiple sessions and is still unresolved.

**This session did not advance the build.** It hardened the Claude Code setup itself, based on three videos Jordan watched (Mark Kashef's "10%", Charlie Automates' "3 Concepts", and the project-structure short). Net effect: the next build session will run cleaner, with fewer chances for Claude to drift on design rules or skip verification.

`scope.md` itself is stale — it still says "Phase 1 in progress." Worth fixing before next session.

---

## What was done this session

- **CLAUDE.md trimmed to router shape (78 → 56 lines).** Wrapper-dispatch rationale, hard rules, and the parent-agent skill routing table moved into two new rule files: [.claude/rules/subagent-dispatch.md](.claude/rules/subagent-dispatch.md) and [.claude/rules/skill-routing.md](.claude/rules/skill-routing.md). Commits `e0ec393`, `5c8d4df`, `38b645d`, `88f8637`.

- **Removed dead UI wrapper skills.** `shmocard-polish-section`, `shmocard-build-page`, `shmocard-design-review`, `gsd-shmocard`, `caveman-shmocard` deleted from [.claude/skills/](.claude/skills/) — they were redundant after Jordan deleted the corresponding hooks. Stale references cleaned from CLAUDE.md, settings.json, handoff.md, and the remaining shmocard-shopify-work SKILL.md. Commit `32e6cac`.

- **Removed orphan hook scripts.** `inject-caveman-mode.sh` and `inject-gsd-routing.sh` deleted; `surface-applied-rules.sh` kept and updated to drop stale skill names from its example list. UserPromptSubmit hook in [.claude/settings.json](.claude/settings.json) now only runs the rule-surfacing script.

- **Three project sub-agents crystallized.** New [.claude/agents/](.claude/agents/) folder with:
  - [.claude/agents/design-system-auditor.md](.claude/agents/design-system-auditor.md) — Sonnet, audits a `.tsx`/`.css` file against the design system, returns PASS/WARN/FAIL with rule citations.
  - [.claude/agents/shopify-data-checker.md](.claude/agents/shopify-data-checker.md) — Haiku, scans diffs for hardcoded prices/SKUs/product names/image paths.
  - [.claude/agents/live-store-guard.md](.claude/agents/live-store-guard.md) — Haiku, blocks Admin API mutations / theme edits / `.env*` writes before commit.
  Registered in `.claude/rules/file-organization.md` and `.claude/rules/skill-routing.md`. Commits `33f35b1`, `b4ca23c`, `05c86bf`, `7559609`.

- **Design system relocated to `.claude/skills/shmocard-design-system/`.** Moved via `git mv` (history preserved across 84 files). Replaced SKILL.md with the frontmatter-bearing version from Jordan's `~/Downloads/Design System/` so the skill auto-discovers in Claude Code's registry. Updated 30+ path references across [CLAUDE.md](CLAUDE.md), four `.claude/rules/*.md` files, [app/globals.css](app/globals.css), seven `components/**/*.css`/`*.tsx` files, [next.config.ts](next.config.ts), [tsconfig.json](tsconfig.json), and the entire `.planning/phases/0[23]-*/` tree. Commits `0a361ff`, `c73ab0e`, `b7818b3`. Skill now appears in registry as `shmocard-design-system` and triggers on "marketing pages, product surfaces, extensions to shmocard.com."

- **Two lifecycle hooks installed.** Both non-blocking, advisory-only, per [.claude/rules/verification.md](.claude/rules/verification.md):
  - [.claude/hooks/typecheck-on-stop.sh](.claude/hooks/typecheck-on-stop.sh) — Stop hook that runs `npx tsc --noEmit` and warns if errors exist (skips cleanly if no `tsconfig.json` or no `node_modules/typescript`).
  - [.claude/hooks/screenshot-reminder.sh](.claude/hooks/screenshot-reminder.sh) — PostToolUse hook on Write/Edit that emits a screenshot-proof reminder when a `.tsx`/`.css` file is modified.
  Commit `ea4bdc4`.

- **Two `$ARGUMENTS`-driven slash commands.** Both follow the existing `/preview` convention (natural-language arg description rather than literal `$ARGUMENTS` token):
  - [.claude/commands/screenshot.md](.claude/commands/screenshot.md) — `/screenshot <name> [path]` captures `localhost:3000` and saves to `pictures/screenshots/<name>.png` via the Playwright MCP.
  - [.claude/commands/check-design.md](.claude/commands/check-design.md) — `/check-design <file...>` dispatches the `design-system-auditor` sub-agent against the given files.
  Commit `e8a4a3e`.

- **`.gitignore` hardened.** Added `.claude/worktrees/` so future GSD subagent workspace residue can't accidentally commit. Commit `37468c8`.

- **Honest course-correction.** Used `/gsd-quick` for everything early in the session, which dragged the design-system relocation into a 10-minute subagent dance for what was effectively a `git mv` + 30 `Edit` calls. Acknowledged this to Jordan and corrected the tool-ladder going forward: direct execution for mechanical work, `/gsd-quick` only when something can break the build, `/gsd-quick --validate` only for risky multi-file refactors.

---

## What's next

**Open question carried over from the last session:** Phase 4 routing.

Recommended order at start of next session:

1. **Resolve the Phase 4 question.** Pick A / B / C (see "Open decisions" below). Don't start work until this is locked.
2. **Refresh `scope.md`.** It still claims Phase 1 is in progress. Reality: Phases 1, 2, 3 complete; Phase 4 unconfirmed. One quick edit pass.
3. **Refresh `.planning/STATE.md`.** Currently has the Phase 3 L-Sign PDP as "last activity." Should reflect the infrastructure work this session and the chosen Phase 4 routing.
4. **Run `/gsd-progress`** to see roadmap state grounded in reality before any new dispatch.

If Jordan picks polish (A): the Hero, SubBrand spotlight, video-testimonial sections were polished in earlier sessions; the obvious next polish targets per memory `S86` are the Proof section, hero meta strip, and sub-brand mascot sizing flagged in memory `296`.

If Jordan picks formalize Phase 4 (B): run `/gsd-phase` to rename Phase 4 in `.planning/ROADMAP.md` from "launch-readiness" → "visual-redesign," push launch-readiness to Phase 5, then `/gsd-plan-phase 4`.

If Jordan picks launch-readiness (C): `/gsd-plan-phase 4` against the existing ROADMAP entry — mobile pass, a11y, Vercel env, DNS cutover. Per memory rule, no Vercel deploy or DNS cutover until every page is approved in localhost dev.

---

## Open decisions

- **Phase 4 routing — A / B / C** (carried from prior 4 sessions). Polish more sections, formalize as visual-redesign, or move to launch-readiness?
- **Stale `scope.md`** — should be updated to reflect Phase 3 complete + Phase 4 chosen direction once the routing question lands.
- **Phase 4 reframe** — memory observations 287-294 + S80 reflect a user reframe to visual-redesign that never made it into ROADMAP.md or `.planning/phases/`. Confirm before formalizing.
- **`.claude/skills/shmocard-design-system/CLAUDE.md`** — the moved bundle has its own internal CLAUDE.md (5 KB). Probably fine, but worth confirming it doesn't conflict with the project root CLAUDE.md.

---

## How to start next session

1. Read this file.
2. Read [CLAUDE.md](CLAUDE.md) (it's now a 56-line router — fast read).
3. Ask Jordan: **"Phase 4 — polish more sections (A), formalize as visual-redesign (B), or move to launch-readiness (C)? Same question as last session."**
4. Refresh `scope.md` and `.planning/STATE.md` to reflect reality before any new work.
5. Use the right tool for the job — direct execution for mechanical edits, `/gsd-fast` for trivial 1-3 file fixes, `/gsd-quick` only when something can break the build, `/gsd-quick --validate` for risky multi-file refactors. Don't default to `/gsd-quick` for everything (the lesson from this session).
6. Skills are now richer — `shmocard-design-system` triggers on design keywords automatically; `design-system-auditor` / `shopify-data-checker` / `live-store-guard` are crystallized for dispatch. Use `/check-design <file>` after any UI edit before committing. Use `/screenshot <name>` for visual proof per [.claude/rules/verification.md](.claude/rules/verification.md).

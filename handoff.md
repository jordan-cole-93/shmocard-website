# handoff.md — Session Handoff

**Last session:** 2026-05-07 — Phase 3 functional layer shipped end-to-end and verified live, but the Phase 3 visual layer was rejected by Jordan; built project-level skill wrappers to fix the root-cause (subagents can't invoke Skills), reset all bad polish commits, and started fixing the homepage one section at a time. First polish fix landed (mascots no longer cover sub-brand titles in the Hero).

---

## Project phase

Per `context/general/scope.md` and `.planning/ROADMAP.md`:

- **Phase 1 — Docs refresh** ✅
- **Phase 2 — Design system review** ✅
- **Phase 3 — Rebuild** — functional plumbing shipped and live-verified (Storefront API, cart, checkout, webhook, waitlist). Visual layer **rejected by Jordan** and being redone page-by-page. ROADMAP currently still marks Phase 3 as `[ ]` because we reset the planning doc that ticked it off; the code is on `main` (commits up to `3db4d33`).
- **Phase 4 — Launch readiness** — pending. Will not run until Jordan approves every page visually.

We are inside a **page-by-page visual polish loop on the homepage** that supersedes any phase ticking until Jordan signs off.

---

## What was done this session

- **Phase 3 functional execution (committed earlier today, all on `main`):** 12 plans shipped across 4 waves — homepage 13 sections, `/shmo-review` category, 3 PDPs (CR-80 / L-Sign / Square Card) fetching real Storefront data, cart drawer + Zustand + cookie hydration with 5-layer Cart Persistence Trap defense, hardened checkout redirect (9 malicious-URL inputs rejected), webhook HMAC route (200/401 verified), waitlist + video lightbox with graceful GHL fallback. End-to-end live flow verified: homepage → category → CR-80 PDP → add to cart → cart drawer → real `shop.shmocard.com` Shopify-hosted checkout (Shop Pay / PayPal / Google Pay rendered).
- **Phase 3 visual rejected:** Jordan reviewed the live dev site and called it "absolutely terrible". Root cause identified — orchestrator dispatched 4 parallel UI-building subagents per wave without invoking `frontend-design` or other design skills, no per-page review gate.
- **Plan 04-01 (homepage polish pass) attempted and rejected:** 13 commits touching every section. Despite a `SCOPE-LOCK.md` saying "section list locked", the executor changed video-tile layout (3-equal → 1-large-2-small) and HowItWorks box layout. Jordan rejected and ordered everything thrown out.
- **Root cause discovered (the structural problem):** Spawned subagents structurally CANNOT access the Skill tool ([Anthropic SDK issue #102](https://github.com/anthropics/claude-agent-sdk-typescript/issues/102)). All design rules I told subagents to "load via `Skill('frontend-design')`" never actually loaded — the tool wasn't registered in their environment. They worked from training defaults, not from the design system rules.
- **Project-level skill wrappers built** at `.claude/skills/`:
  - `shmocard-polish-section/SKILL.md` — LAYOUT-LOCKED polish embed
  - `shmocard-build-page/SKILL.md` — greenfield page-build embed
  - `shmocard-design-review/SKILL.md` — visual review rubric for Codex / review subagents
  - `shmocard-shopify-work/SKILL.md` — live-store-protection embed for backend dispatch

  Each wrapper returns a verbatim guardrail block the orchestrator splices into subagent prompts as text. Rules travel inside the prompt, not as a Skill call subagent can't make.
- **CLAUDE.md routing table updated** to document the wrappers and add the LAYOUT-IS-LOCKED hard rule for polish tasks.
- **Bad work thrown out (`git reset --hard`):** Reset back to commit `3db4d33` (last good Phase 3 commit), then cherry-picked the wrappers commit forward (`ccfb430`). Result: Phase 3 functional code intact, plan 04-01 polish commits gone, wrappers preserved.
- **Playwright MCP server registered** at `.mcp.json` (also re-added Context7 there). Will only become active in subagent tool list after Jordan reloads Claude Code.
- **Page-by-page polish loop started.** Approach: I fix one specific issue, screenshot it, hand to Jordan for sign-off, then move to the next. No bulk parallel UI subagents.
- **Polish commit shipped — 4-up sub-brand tile titles fixed (`b33a0aa`):** Mascots used to cover the "Shmo Biz / Shmo Link / Shmo Reputation" titles because `.home-hero__tile-art` was `position: absolute; inset: 0` and the title had no z-index. Constrained the art container to the top 62% of each tile, dropped the `translateY(-12%)` hack, added `z-index: 2` on title/sub/status. CSS-only, layout untouched. File: `components/home/home.css`.
- **Memory updates** (in `~/.claude/projects/-Users-jordancole-Documents-Developement-Projects-Shmocard-Shmo-Website/memory/`):
  - `feedback_no_vercel_until_design_approval.md` — no Vercel deploy or DNS cutover until Jordan approves every page
  - `feedback_one_page_at_a_time.md` — one page per session; never bulk-dispatch UI subagents; `frontend-design` mandatory
  - `feedback_layout_is_locked.md` — polish means spacing/type/color/mascot only; never change grid columns, element ordering, tile size ratios, or structural HTML
- **Hero header critique returned and rejected:** I listed 7 issues with the Hero (floating-period bug on the `missing` cycle, centered-button-stack template feel, dense lede, loud graph-paper background, weak hierarchy contrast, etc.). Jordan said none of those were the real problems and surfaced the 4-up tile block as the next thing to look at.
- **Current open issue surfaced (not yet fixed):** even after the title-overlap fix, the 4-up sub-brand block has remaining problems — title baselines don't line up across the 4 tiles (different body line counts), Review's small product photo vs Biz/Link/Reputation's giant mascots create stylistic split, visual weight imbalance (the only buyable product is the smallest visual). Awaiting Jordan's call on which to fix next.

---

## What's next

**Page-by-page homepage polish — continue on the Hero / 4-up tile block.**

Concrete next actions in order:

1. Get Jordan's call on the next specific Hero fix. He has explicitly rejected my own critique list. Wait for him to point at one thing he wants fixed; do not propose another list.
2. Apply the fix using `shmocard-polish-section` skill (parent invokes it; copies the embed block into any subagent prompt). LAYOUT IS LOCKED — no grid / order / aspect-ratio changes.
3. Screenshot before/after via the local Playwright script (or, after Jordan reloads Claude Code, the proper Playwright MCP tools at `mcp__playwright__*`).
4. Atomic commit per fix. Format: `fix(<section>): <what changed>`.
5. Hand to Jordan for review. Wait for "good, next" or revision before touching anything else.
6. Move down the homepage section by section: Hero remainder → AudienceStrip → Proof → SubBrandSpotlight (4 instances) → CrewStrip → HowItWorks → VideoTestimonials → Compatibility → HomeFaq → FinalCta.

Other pages (`/shmo-review`, 3 PDPs, cart drawer visuals, waitlist modal visuals) wait until the homepage is fully approved.

---

## Open decisions

- **Hero — what's actually wrong per Jordan?** He rejected my 7-item critique. Need him to drive the diagnosis. Likely candidates from his earlier signals: the 4-up tile block already on the table; everything else above the fold is unclear.
- **DI-04-01-A (Phase 3 leftover):** `.shm-checklist` primitive doesn't flip color/SVG-stroke on cocoa surfaces, so the Reputation spotlight bullets render invisible on the live page. ~10-min primitive-level patch in `context/design-system/components.css`. Hard Rule "no primitive edits from polish tasks" blocks it from inside this loop. Needs Jordan to authorise a separate primitive-fix task.
- **`SHOPIFY_PRIMARY_DOMAIN=shmocard.com` env var:** Jordan must add to `.env.local` (and to Vercel env when Phase 4 starts). Without it, the checkout allowlist falls back to `*.myshopify.com` only and `shop.shmocard.com` redirects break in production. Hook blocks me from writing to `.env*`. Documented in `context/general/backend.md`.
- **Reload Claude Code at some point** so the new `.mcp.json` registers Playwright MCP tools (`mcp__playwright__*`). Not blocking — current session keeps using the local Playwright npm package via Bash to take screenshots.
- **Phase 3 in `.planning/ROADMAP.md`** is marked `[ ]` because the planning artifact that ticked it was reset. Functional code is on `main` and verified. Probably worth ticking the box at some point, but only after the homepage visual is fully approved.

---

## How to start next session

1. Read this file.
2. Read `CLAUDE.md`.
3. Read `.claude/rules/design-system.md` and `.claude/skills/shmocard-polish-section/SKILL.md` so you understand the layout-lock rule before touching any polish work.
4. Run `git status` and `git log --oneline -5` to confirm state matches this handoff.
5. Run `npm run dev` and open `http://localhost:3000/` so you can see the current homepage.
6. Take a Hero screenshot (use the local Playwright pattern — write a `.tmp-shot-X.mjs` file at repo root, `node` it, delete it; or use the proper Playwright MCP tools if Jordan has reloaded by then).
7. Ask Jordan: "Which specific thing on the homepage should I fix next?" — do NOT volunteer your own critique list, he has explicitly rejected that pattern. Wait for him to point at one specific thing.
8. When you do work, use `Skill('shmocard-polish-section')` first; copy its embed verbatim if you spawn any subagent.
9. After every fix: screenshot, atomic commit, surface to Jordan, wait for sign-off before next fix.

# Shmocard Website

Brand website for Shmocard at `shmocard.com`. Retail front door — not an ad funnel. Warm professional design — refined, sans-dominant with serif italic accents. Headless Shopify + Next.js.

**Stack:** Next.js (App Router) + TypeScript · Tailwind CSS 4 · Framer Motion · Lucide icons · Vercel · Shopify Headless. Full details in `backend.md`.

---

## Where to find things

| Need | Read |
|---|---|
| Build status & roadmap | `scope.md` |
| Last session context | `handoff.md` |
| Tech stack details (Shopify, env vars, Vercel) | `backend.md` |
| Tools (skills, commands, hooks, MCPs) | `tools.md` |
| Design system | `DESIGN.md` (companion to `app/globals.css` — globals.css wins on conflict) |
| Engineering rules (testing, store protection, data discipline, file org, vault) | `.claude/rules/` |
| Personal preferences | `CLAUDE.local.md` (gitignored) |

## Vault context (Jordan's brain)

**Base path:** `/Users/jordancole/Documents/Developement/Jordan's Brain/Projects/Shmocard/Shmocard Website/`

| Need | Read |
|---|---|
| Project context (business, thesis, sub-brands) | `context.md` |
| Voice, copy, headlines, angles | `marketing.md` |
| Product catalog, formats, status | `product.md` |
| Site structure | `wireframe/sitemap.md` |
| Homepage wireframe | `wireframe/home-page-shmocard.md` |

## The one rule that supersedes everything

**Don't break the live store.** `shop.shmocard.com` is live and serves real customers. Never touch the primary Online Store theme, payment settings, or domain configuration. Full safety rules: `.claude/rules/live-store-protection.md`.

## Reset note (2026-04-26)

Project meta-context was rebuilt from scratch on this date — Steps 1–3 of `scope.md` complete. Step 4 (homepage rebuild from Claude Design v2) is the current focus. Plan: `~/.claude/plans/i-want-to-keep-structured-cocoa.md`.

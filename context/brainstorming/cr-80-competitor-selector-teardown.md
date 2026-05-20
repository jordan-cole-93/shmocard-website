# CR-80 Pack Selector — Competitor Teardown

**Date:** 2026-05-19
**Companion to:** `cr-80-buybox-cro-plan.md` (broad CRO plan)
**Scope:** focused teardown of one competitor's pack selector. They sell a similar NFC Google-review plate to French local businesses and rank well in their niche.

---

## What they're doing

Three tiers in a single vertical stack (1 / 2 / 5 plates). The middle tier is visibly selected (purple border + faint bg fill). The largest tier carries a corner ribbon.

| Tier | Price | Compare | Savings | Bonus | Popular ribbon |
|---|---|---|---|---|---|
| 1 Plaque | 29,90 € | ~~49,90 €~~ | — | — | — |
| **2 Plaques** (selected) | 54,90 € | ~~99,80 €~~ | "Économisez 40 %" | "+ Guide Gratuit 🎁" | — |
| 5 Plaques | 89,90 € | ~~249,50 €~~ | "Économisez 60 %" | "+ Guide Gratuit & Cadeau Mystère 🎁" | "Le plus populaire" |

**Note:** HT = "Hors Taxes" = excluding VAT. French B2B convention. Ignore for US/USD context.

---

## Why this works (CRO mechanics)

1. **Strikethrough compare price on EVERY row.** Anchors perceived value before the savings % is read. Even the 1-pack has a strikethrough.
2. **Aggressive savings %.** 40 % / 60 % off. Even if the MSRP is inflated for anchoring, the number hits harder than our current 20 % / 27 %.
3. **Bonus gifts tied to tier.** Free guide → free guide + mystery gift. Non-monetary value, hard to logically compare, easy to value-perceive.
4. **"Most Popular" as a corner ribbon tab**, not an inline or overlay badge. Anchored to the row, doesn't shove content around. Green contrasts the gray outline.
5. **Selected state is loud.** Purple 3 px border + light purple bg fill. No hunting for a radio dot.
6. **Only 3 tiers.** Hick's law — fewer options, faster decision. The "popular" tier is the LARGEST, not the middle — they want you climbing the ladder.
7. **Per-row product image scales.** 1 card → 2 stacked → 5 stacked. Visualizes what you're buying without reading.
8. **No separate quantity stepper.** Pack tier IS the quantity. Single decision, no dual control.

---

## What to skip

- **HT pricing.** French B2B convention, not US.
- **Cute purple tint.** Selection state stays on our ember/cocoa palette.
- **Don't copy the literal "Mystery Gift".** Adapt to a credible Shmocard equivalent (extra card, sticker pack, setup guide).

---

## Apply to CR-80 buybox

### HIGH priority

1. **Cut from 4 tiers to 3.** Recommend dropping the 1-card SKU on the PDP. Single cards under-monetize ad cost ($29.99 AOV vs. $25–35 ad CPA = unprofitable). New tiers: **2-card / 5-card / 10-card.** Set 2-card as floor, 10-card as flagship "popular." This also lets the average customer feel they're upgrading off the floor, not buying a starter.

2. **Restore SAVE % visibility on mobile.** We currently hide `.shm-pack-row__price .shm-badge` at ≤640px (our recent fix). Undo that — the savings % is the single biggest CRO lever in this selector. Re-fit the row layout instead: smaller badge sm-variant, tighter row padding, or stack the badge above the price-now line.

3. **Bonus tied to higher tiers.**
   - 5-pack: "+ Setup Guide" (free PDF or email — zero cost to fulfill).
   - 10-pack: "+ Setup Guide + Spare blank card" (1 extra unprogrammed card = ~$0.50 COGS, perceived $30 value).
   Requires Jordan's call on bonuses. Both are honest and easy to fulfill.

4. **Inflate compare price MSRP.** Today the compare is just (single-card price × quantity) — accurate but un-anchoring. DTC standard is anchoring against a credible "retail" MSRP. E.g., 10-pack compare from $299.90 → $399.90 (= $39.99 / card retail). Savings narrative changes from 27 % to 45 %. Brand-voice decision — flag for Jordan.

5. **Move "Most popular" from overlay badge → corner ribbon.** Current `.shm-pack-row__pop` floats above the row. Reshape into a true ribbon-tab anchored to the top-right corner of the row. Cleaner, no content displacement.

### MEDIUM priority

6. **Louder selected state.** Current `.shm-pack-row--checked` uses ember 2.5 px border alone. Match competitor energy: ember 3 px border + ember-tinted bg fill (use `--color-ember` at ~6 % opacity). Variant lives in `components.css` next to the primitive.

7. **Per-tier product image.** Today every row pulls from the same gallery (with one swap at qty ≥ 5). Render distinct stacks per tier: 2 → pair, 5 → small stack, 10 → big stack. Reinforces purchase without reading.

### LOW priority

8. **Kill the separate quantity stepper.** Pack tier = quantity. If a customer wants 20 cards, they buy 2×10-packs (or we add a 20-pack tier later). Removes a second control. Backlog.

9. **Tighten row height ratio.** Their rows look ~80 px. Ours are 88 px both viewports post-fix. Within tolerance — skip.

---

## Implementation order

**Wave 1** (CSS + JSX only, no copy / inventory decisions): #2, #5, #6.
**Wave 2** (needs Jordan's call on pricing / SKU / bonuses): #1, #3, #4, #7.
**Wave 3** (backlog): #8, #9.

---

## Open questions for Jordan

- Drop the 1-card SKU on the PDP, or keep it hidden but available via direct cart add for repeat customers?
- Comfortable inflating compare-price MSRP for stronger anchoring? Common DTC tactic but worth your call on brand voice.
- Have a setup guide we can offer as a free bonus, or should we author one?
- "Spare card" / "sticker pack" bonus available, or want a different bonus shape?

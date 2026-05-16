# Shmocard fonts

Local copies of the four brand fonts. `../colors_and_type.css` references these via `@font-face` using relative paths (`fonts/<file>.ttf`), so this folder must sit alongside the CSS when the system is adopted into another project.

| File | Family | Token | Role |
|---|---|---|---|
| `CherryBombOne-Regular.ttf` | Cherry Bomb One | `--font-wordmark` | Parent logo + sub-brand wordmarks |
| `BricolageGrotesque-VariableFont_opsz_wdth_wght.ttf` | Bricolage Grotesque | `--font-display` | Display & headings (variable: weights 200–800, optical sizes 12–96pt, widths 75–100%) |
| `BricolageGrotesque_*.ttf` (static cuts) | Bricolage Grotesque | — | Static fallbacks for renderers that don't support `truetype-variations`. Not referenced by the CSS. |
| `InterTight-VariableFont_wght.ttf` | Inter Tight | `--font-sans` | Body / UI upright (variable: weights 100–900) |
| `InterTight-Italic-VariableFont_wght.ttf` | Inter Tight | `--font-sans` | Body / UI italic (variable: weights 100–900) |
| `ShadowsIntoLightTwo-Regular.ttf` | Shadows Into Light Two | `--font-hand` | Hand accent (`.shm-hand`) |

A Google Fonts `@import` stays in the CSS as a network fallback for environments that can't access the project filesystem (some PDF exporters, sandboxed image renderers). The local `@font-face` declarations win because they're declared first.

## Licenses

All four are open-source under the SIL Open Font License (OFL-1.1) and free for commercial use.

# Phase 8 Plan 08-07 — CDN image verification + fallback cleanup

**Captured:** 2026-05-20

## Per-PDP CDN verification

| PDP | Main image host | Thumb hosts | Status |
|-----|------------------|-------------|--------|
| /shmo-review/cr-80 | cdn.shopify.com | cdn.shopify.com (8+ thumbs) | PASS |
| /shmo-review/l-sign | cdn.shopify.com | cdn.shopify.com (8+ thumbs) | PASS |
| /shmo-review/square-card | cdn.shopify.com | cdn.shopify.com (8+ thumbs) | PASS |

All three PDPs confirmed serving images from `cdn.shopify.com`. No `localhost/products/*` paths
observed in any gallery. The `DEFAULT_BUYBOX_GALLERY` fallback did not fire on any PDP.

## Fallback cleanup

- `FALLBACK_IMAGES` constant in `FormatPicker.tsx`: **removed**
- Null-product branch (defensive — fires when Shopify returns null for a handle): updated to render
  an empty `<div>` for the media slot instead of a local asset path. Name falls back to `copy.sub`.
- Live-product branch image resolution: `??` chain now terminates with `""` instead of
  `fallback.src` / `fallback.alt`. Shopify images confirmed present on all 3 products so these
  fallbacks will not fire in practice.
- `tsc --noEmit`: clean, no errors.

## Final verdict

Full CDN coverage on all 3 PDPs. Fallback cleaned up.

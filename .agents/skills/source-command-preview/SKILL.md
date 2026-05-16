---
name: "source-command-preview"
description: "Scaffold a new preview page at app/preview/<name>/page.tsx"
---

# source-command-preview

Use this skill when the user asks to run the migrated source command `preview`.

## Command Template

Create a new preview page for a section/component variation.

The page name comes from the user's argument (whatever they typed after `/preview`). Examples:
- `/preview hero-a` → `app/preview/hero-a/page.tsx`
- `/preview showcase-stage-switcher` → `app/preview/showcase-stage-switcher/page.tsx`

Steps:

1. **Sanitize the name** — kebab-case only, no spaces, no special chars. If user gave junk, ask them for a clean slug.
2. **Check it doesn't already exist** — if `app/preview/<name>/page.tsx` exists, ask if they want to overwrite or pick a different name.
3. **Create the page** using this scaffold (use the new design tokens — never legacy):

```tsx
export default function PreviewPage() {
  return (
    <main className="bg-snow min-h-screen">
      <div className="max-w-[1320px] mx-auto px-7 py-24">
        <span className="t-eyebrow text-ember">Preview · {NAME}</span>
        <h1 className="t-h2 mt-3">
          Variation: <em className="font-serif italic font-normal text-ember">{NAME}</em>
        </h1>
        <p className="t-lede mt-4 max-w-2xl">
          {/* TODO: replace this paragraph with the variation's purpose. */}
        </p>

        <div className="mt-16">
          {/* TODO: paste the section variation here. */}
        </div>
      </div>
    </main>
  );
}
```

Replace `{NAME}` with the human-readable name (kebab-case → Title Case for display).

4. **Confirm** in the response: "Preview created at app/preview/<name>/page.tsx. Visit http://localhost:3000/preview/<name> to see it. Drop the variation code into the marked section."

5. **DO NOT** paste multiple variations into a single preview page. One page = one variation. If Jordan asked for 3 variations, run `/preview` 3 times with different names.

Rules:
- Always use new design tokens (`bg-snow`, `text-ink`, `t-h2`, etc.) — never `var(--graham)`, never `--shmo-*`.
- Always use `<Placeholder label="...">` for imagery — never hardcode `/mascot/` or `/products/` paths.
- Per the design hooks, this is enforced — but follow it explicitly so the placeholder hook never has to fire.

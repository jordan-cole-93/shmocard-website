# Shmocard Homepage Phase A — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working, responsive Shmocard homepage scaffold with nav, hero, sub-brand grid, and footer rendering on `localhost:3000`, faithful to the locked design system and marketing rules.

**Architecture:** Next.js 15 (App Router) + TypeScript + Tailwind 4 + Framer Motion + Lucide. Design tokens lifted verbatim from `branding guide/styles.css`. Section CSS lifted verbatim from `branding guide/home-styles.css`. Components adapted from the existing `branding guide/home-*.jsx` reference files into TypeScript React components, with copy and structure swapped to match `wireframe/home-page-shmocard.md` and `.claude/rules/marketing.md`.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind 4, Framer Motion 11+, Lucide React, `next/font/google`

**Spec:** [docs/superpowers/specs/2026-04-25-shmocard-homepage-phase-a-design.md](../specs/2026-04-25-shmocard-homepage-phase-a-design.md)

**Working directory:** `/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmocard Website/`

**Note on testing:** This is a static visual UI build. The "test" step for each component task is a browser smoke test via Browsermcp (or `npm run dev` + manual review) rather than unit tests. Type checking (`tsc --noEmit`) and `npm run build` serve as automated correctness checks. There is no Vitest/RTL setup — out of scope for Phase A.

---

## Task 1: Initialize git + scaffold Next.js project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next-env.d.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/*` (default Next.js scaffold), `.gitignore`, `eslint.config.mjs`

- [ ] **Step 1: Initialize git in project root**

```bash
cd "/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmocard Website"
git init
git add CLAUDE.md CLAUDE.local.md .claude branding\ guide wireframe pictures docs outputs
git commit -m "chore: initial commit — pre-scaffold project workspace"
```

Expected output: `Initialized empty Git repository...` then a commit with the existing rule files, branding guide, wireframes, and pictures.

- [ ] **Step 2: Run create-next-app in the current directory**

```bash
cd "/Users/jordancole/Documents/Developement/Projects/Shmocard/Shmocard Website"
npx --yes create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --use-npm \
  --no-turbopack \
  --eslint
```

If `create-next-app` complains about non-empty directory, accept the prompt to continue (the existing folders — `branding guide/`, `wireframe/`, `pictures/`, `.claude/`, `docs/`, `outputs/` — don't conflict with anything Next.js creates).

Expected: scaffold completes, `npm install` runs, `package.json` and `app/` exist.

- [ ] **Step 3: Boot the dev server to verify scaffold works**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: default Next.js landing page renders without errors. Stop the server with `Ctrl+C`.

- [ ] **Step 4: Verify production build is clean**

```bash
npm run build
```

Expected: `✓ Compiled successfully` with no TypeScript or lint errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js + TypeScript + Tailwind 4 in project root"
```

---

## Task 2: Install Framer Motion and Lucide

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install framer-motion lucide-react
```

Expected: both packages added to `dependencies` in `package.json`.

- [ ] **Step 2: Verify build still passes**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add framer-motion and lucide-react"
```

---

## Task 3: Wire up fonts via next/font

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/layout.tsx` with Shmocard font setup**

Overwrite `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter_Tight, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-tight",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shmocard — The toolkit your crew's been missing",
  description:
    "Four tools built for Main Street. Reviews, contacts, links, reputation — every customer interaction your crew was letting slip through the cracks.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verify build is still clean**

```bash
npm run build
```

Expected: `✓ Compiled successfully`. Fonts download as part of build.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: load Inter Tight, Fraunces italic, JetBrains Mono via next/font"
```

---

## Task 4: Lift design tokens into globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Read source token file**

```bash
cat "branding guide/styles.css"
```

Note the contents — it contains the entire `:root { ... }` token block plus base resets and utility classes.

- [ ] **Step 2: Replace `app/globals.css` with the branding guide tokens + Tailwind layers + a `home.css` import**

Open `app/globals.css`. Keep the Tailwind directives at the top (whatever `create-next-app` generated — usually `@import "tailwindcss";` for Tailwind 4). Then **append** the entire contents of `branding guide/styles.css` after the Tailwind import. Then **append** `@import "./home.css";` at the bottom.

Final structure of `app/globals.css`:
```css
@import "tailwindcss";

/* === BEGIN: lifted from branding guide/styles.css === */
:root {
  --cream: #FFF1DC;
  --snow: #FFF8EA;
  /* ...everything from branding guide/styles.css verbatim... */
}
/* base resets, body styles, and utility classes from styles.css... */
/* === END: lifted from branding guide/styles.css === */

@import "./home.css";
```

**Important:**
- Do not rename any tokens.
- Do not change any values.
- If `branding guide/styles.css` has any `@font-face` rules for Inter Tight / Fraunces / JetBrains Mono, **delete those** — `next/font` handles the font loading. Keep the `font-family` references that reference the `--font-*` CSS variables.
- If `branding guide/styles.css` references `font-family: 'Inter Tight', sans-serif;` directly (without the variable), update those to `font-family: var(--font-inter-tight), sans-serif;` so they pick up the next/font value. Same for Fraunces and JetBrains Mono.

- [ ] **Step 3: Create empty `app/home.css` placeholder**

```bash
touch app/home.css
```

(Task 5 fills it. The empty file exists now so the `@import` in globals.css doesn't error.)

- [ ] **Step 4: Verify dev server boots without CSS errors**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: page background is now `#FFF1DC` (Cream), text is in Inter Tight, no console errors. The default Next.js page content will look unstyled-ish (because we haven't built components yet) but the colors and typography should reflect the brand. Stop with `Ctrl+C`.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/home.css
git commit -m "feat: lift design tokens from branding guide into globals.css"
```

---

## Task 5: Lift section styles into home.css

**Files:**
- Modify: `app/home.css`

- [ ] **Step 1: Read source section-styles file**

```bash
cat "branding guide/home-styles.css"
```

Note the contents — these are the BEM-style classes (`.home-hero`, `.family__tile`, `.nav__link`, `.home-footer`, etc.) used by the reference jsx files.

- [ ] **Step 2: Copy `branding guide/home-styles.css` verbatim into `app/home.css`**

Replace the empty `app/home.css` with the exact contents of `branding guide/home-styles.css`. Same rules as Task 4:
- If any `@font-face` rules exist, delete them.
- If `font-family: 'Inter Tight'` appears without the variable, update to `font-family: var(--font-inter-tight), sans-serif;`. Same for Fraunces and JetBrains Mono.
- Do not rename any class names.
- Do not change any values.

- [ ] **Step 3: Verify dev server boots and no console CSS errors**

```bash
npm run dev
```

Expected: page still renders, no console errors. Stop with `Ctrl+C`.

- [ ] **Step 4: Commit**

```bash
git add app/home.css
git commit -m "feat: lift section styles from branding guide into home.css"
```

---

## Task 6: Copy mascot asset to public/

**Files:**
- Create: `public/mascot/hero-toolkit.png`

- [ ] **Step 1: Create the mascot folder and copy the asset**

```bash
mkdir -p public/mascot
cp "branding guide/assets/mascot/hero-toolkit.png" public/mascot/hero-toolkit.png
```

- [ ] **Step 2: Verify the file is reachable**

```bash
ls -la public/mascot/hero-toolkit.png
```

Expected: file listed with non-zero size.

- [ ] **Step 3: Commit**

```bash
git add public/mascot/hero-toolkit.png
git commit -m "feat: copy hero-toolkit mascot to public/mascot/"
```

---

## Task 7: Create Lucide icon re-exports

**Files:**
- Create: `lib/icons.tsx`

- [ ] **Step 1: Create `lib/icons.tsx`**

```tsx
import {
  ArrowRight,
  Check,
  ShoppingCart,
  Search,
  MousePointerClick,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Menu,
  X,
} from "lucide-react";

export const Icon = {
  Arrow: ArrowRight,
  Check,
  Cart: ShoppingCart,
  Search,
  Tap: MousePointerClick,
  Twitter,
  Instagram,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  Menu,
  Close: X,
};

export type IconName = keyof typeof Icon;
```

This mirrors the `Icon.*` namespace used in the reference jsx files (`Icon.Arrow`, `Icon.Tap`, `Icon.Check`, `Icon.Cart`, `Icon.Search`, `Icon.Twitter`, etc.) so component code reads naturally.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/icons.tsx
git commit -m "feat: add Lucide icon namespace at lib/icons.tsx"
```

---

## Task 8: Build Nav component

**Files:**
- Create: `components/nav/Nav.tsx`

- [ ] **Step 1: Create `components/nav/Nav.tsx`**

This is adapted from `branding guide/home-nav.jsx`, ported to TypeScript with three Phase A changes:
1. All four sub-brand links scroll to `#family` (not their individual section anchors, which don't exist yet)
2. Sticky positioning + scroll-driven backdrop blur after 16px scroll
3. Cart icon has no badge (Shopify cart not wired yet)

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/lib/icons";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sticky-nav backdrop blur after 16px scroll
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 16));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Mobile drawer: close on Escape, lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <Link href="/" className="nav__brand" aria-label="Shmocard home">
          <span className="nav__mark">S</span>
          <span className="nav__wordmark">
            Shmo<em>card</em>
          </span>
        </Link>

        <nav className="nav__menu nav__menu--desktop" aria-label="Sub-brands">
          <a className="nav__link" href="#family">
            Shmo Review <span className="pill">Live</span>
          </a>
          <a className="nav__link" href="#family">
            Shmo Biz
          </a>
          <a className="nav__link" href="#family">
            Shmo Link
          </a>
          <a className="nav__link" href="#family">
            Shmo Reputation
          </a>
        </nav>

        <span className="nav__spacer" />

        <nav className="nav__menu nav__menu--desktop" aria-label="Company">
          <a className="nav__link" href="#family">
            How it works
          </a>
          <a className="nav__link" href="#family">
            Pricing
          </a>
          <a className="nav__link" href="#family">
            About
          </a>
        </nav>

        <div className="nav__right">
          <button
            type="button"
            className="nav__icon-btn nav__icon-btn--desktop"
            aria-label="Search"
          >
            <Icon.Search style={{ width: 16, height: 16 }} />
          </button>
          <button type="button" className="nav__icon-btn" aria-label="Cart">
            <Icon.Cart style={{ width: 16, height: 16 }} />
          </button>
          <Link className="btn btn--primary btn--sm nav__shop-cta" href="/shmo-review">
            Shop <Icon.Arrow style={{ width: 14, height: 14 }} />
          </Link>
          <button
            type="button"
            className="nav__icon-btn nav__hamburger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <Icon.Close style={{ width: 18, height: 18 }} />
            ) : (
              <Icon.Menu style={{ width: 18, height: 18 }} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div
            className="nav__scrim"
            onClick={close}
            aria-hidden="true"
          />
          <div className="nav__drawer" role="dialog" aria-label="Site menu">
            <div className="nav__drawer-section">
              <div className="nav__drawer-eyebrow">Products</div>
              <a className="nav__drawer-link" href="#family" onClick={close}>
                Shmo Review <span className="pill">Live</span>
              </a>
              <a className="nav__drawer-link" href="#family" onClick={close}>
                Shmo Biz
              </a>
              <a className="nav__drawer-link" href="#family" onClick={close}>
                Shmo Link
              </a>
              <a className="nav__drawer-link" href="#family" onClick={close}>
                Shmo Reputation
              </a>
            </div>
            <div className="nav__drawer-section">
              <div className="nav__drawer-eyebrow">Company</div>
              <a className="nav__drawer-link" href="#family" onClick={close}>
                How it works
              </a>
              <a className="nav__drawer-link" href="#family" onClick={close}>
                Pricing
              </a>
              <a className="nav__drawer-link" href="#family" onClick={close}>
                About
              </a>
            </div>
            <div className="nav__drawer-cta">
              <Link
                className="btn btn--primary"
                href="/shmo-review"
                onClick={close}
                style={{ justifyContent: "center" }}
              >
                Shop the cards <Icon.Arrow style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Add sticky + scrolled styles to `app/home.css`**

The reference `home-styles.css` has `.nav` styles but may not include sticky behavior or the scrolled blur state. Append (or modify the existing `.nav` rule):

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--cream);
  transition: background 200ms ease, backdrop-filter 200ms ease,
    box-shadow 200ms ease;
}

.nav--scrolled {
  background: rgba(255, 241, 220, 0.85);
  backdrop-filter: saturate(140%) blur(10px);
  -webkit-backdrop-filter: saturate(140%) blur(10px);
  box-shadow: var(--sh-sm);
}
```

If a `.nav { }` rule already exists in `home.css`, merge — keep its existing properties and add the position/sticky/transition lines.

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/nav/Nav.tsx app/home.css
git commit -m "feat: build Nav component with sticky scroll behavior"
```

---

## Task 9: Build Footer component

**Files:**
- Create: `components/footer/Footer.tsx`

- [ ] **Step 1: Create `components/footer/Footer.tsx`**

Adapted from `branding guide/home-footer.jsx`. The only Phase A copy change is the brand tagline.

```tsx
import Link from "next/link";
import { Icon } from "@/lib/icons";

export function Footer() {
  return (
    <footer className="home-footer">
      <div className="home-footer__grid">
        <div>
          <Link href="/" className="nav__brand" aria-label="Shmocard home">
            <span className="nav__mark">S</span>
            <span className="nav__wordmark" style={{ fontSize: 18 }}>
              Shmo<em>card</em>
            </span>
          </Link>
          <p className="home-footer__tagline">
            Made for Main Street by Shmocard.
          </p>
          <div className="home-footer__social">
            <a href="#" aria-label="Twitter">
              <Icon.Twitter style={{ width: 15, height: 15 }} />
            </a>
            <a href="#" aria-label="Instagram">
              <Icon.Instagram style={{ width: 15, height: 15 }} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Icon.LinkedIn style={{ width: 15, height: 15 }} />
            </a>
            <a href="#" aria-label="YouTube">
              <Icon.YouTube style={{ width: 15, height: 15 }} />
            </a>
          </div>
        </div>

        <div className="home-footer__col">
          <div className="home-footer__col-title">Software</div>
          <a href="#family">
            Shmo Biz <span className="home-footer__soon">soon</span>
          </a>
          <a href="#family">
            Shmo Link <span className="home-footer__soon">soon</span>
          </a>
          <a href="#family">
            Shmo Reputation <span className="home-footer__soon">soon</span>
          </a>
        </div>

        <div className="home-footer__col">
          <div className="home-footer__col-title">Shop</div>
          <a href="#">CR-80 cards</a>
          <a href="#">L-Signs</a>
          <a href="#">Square cards</a>
          <a href="#">Bulk orders</a>
        </div>

        <div className="home-footer__col">
          <div className="home-footer__col-title">Company</div>
          <a href="#">About</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Contact</a>
          <a href="#">Affiliate</a>
        </div>

        <div className="home-footer__col">
          <div className="home-footer__col-title">Support</div>
          <a href="#">How it works</a>
          <a href="#">Activation guide</a>
          <a href="#">Returns &amp; warranty</a>
          <a href="#">Help center</a>
          <a href="#">Status</a>
        </div>
      </div>

      <div className="home-footer__legal">
        <span>© {new Date().getFullYear()} Shmocard, Inc. All rights reserved.</span>
        <span>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </span>
      </div>
    </footer>
  );
}
```

Note the wireframe says "Square card" not "Square Disc" — this matches `product.md`. The original jsx had "Square discs" — corrected here.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/footer/Footer.tsx
git commit -m "feat: build Footer component"
```

---

## Task 10: Build Hero component

**Files:**
- Create: `components/home/Hero.tsx`

- [ ] **Step 1: Create `components/home/Hero.tsx`**

Adapted from `home-hero.jsx` (split layout). Copy fully replaced. The 3-product tile row is replaced with a 4-up sub-brand icon row using Lucide icons.

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/lib/icons";
import { Star, Briefcase, Link2, Megaphone } from "lucide-react";

const SUB_BRAND_ICONS = [
  { name: "Shmo Review", Icon: Star },
  { name: "Shmo Biz", Icon: Briefcase },
  { name: "Shmo Link", Icon: Link2 },
  { name: "Shmo Reputation", Icon: Megaphone },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.28, delay, ease: "easeOut" as const },
  });

  return (
    <section className="home-hero home-hero--split">
      <div className="home-hero__inner">
        <div className="home-hero__grid">
          <div>
            <div className="home-hero__copy">
              <motion.h1 className="home-hero__title" {...fadeUp(0)}>
                The toolkit your crew&apos;s been{" "}
                <em>missing</em>.
              </motion.h1>
              <motion.p className="home-hero__lede" {...fadeUp(0.05)}>
                Four tools built for Main Street. Reviews, contacts, links,
                reputation — every customer interaction your crew was letting
                slip through the cracks.
              </motion.p>
              <motion.div className="home-hero__ctas" {...fadeUp(0.1)}>
                <a className="btn btn--accent btn--lg" href="#family">
                  Meet the tools <span aria-hidden="true">↓</span>
                </a>
                <Link
                  className="btn btn--ghost btn--lg"
                  href="/shmo-review"
                >
                  Shop Shmo Review <Icon.Arrow style={{ width: 16, height: 16 }} />
                </Link>
              </motion.div>
              <motion.div className="home-hero__meta" {...fadeUp(0.15)}>
                <span className="home-hero__meta-item">
                  <Icon.Check
                    style={{ width: 13, height: 13, color: "var(--success)" }}
                  />
                  No subscription required
                </span>
                <span className="home-hero__meta-sep" />
                <span className="home-hero__meta-item">
                  <Icon.Check
                    style={{ width: 13, height: 13, color: "var(--success)" }}
                  />
                  Made for Main Street
                </span>
              </motion.div>
            </div>

            <motion.div
              className="home-hero__icon-row"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
              aria-hidden="true"
            >
              {SUB_BRAND_ICONS.map(({ name, Icon: I }) => (
                <span key={name} className="home-hero__icon-cell" title={name}>
                  <I style={{ width: 18, height: 18 }} />
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="home-hero__stage home-hero__stage--square"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Image
              src="/mascot/hero-toolkit.png"
              alt="Shmocard mascot holding a toolkit of cards"
              width={520}
              height={520}
              priority
              className="home-hero__mascot"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add icon-row styles to `app/home.css`**

`home-styles.css` doesn't include the new icon row. Append:

```css
.home-hero__icon-row {
  display: flex;
  gap: 14px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.home-hero__icon-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-md);
  background: var(--paper);
  border: 1px solid var(--hair);
  color: var(--ink-3);
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/home/Hero.tsx app/home.css
git commit -m "feat: build Hero component with sub-brand icon row"
```

---

## Task 11: Build ShmoFamily component

**Files:**
- Create: `components/home/ShmoFamily.tsx`

- [ ] **Step 1: Create `components/home/ShmoFamily.tsx`**

Adapted from `home-family.jsx`. Section header copy and tile copy replaced to match `wireframe/home-page-shmocard.md`. Tiles fade up on scroll-into-view.

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/lib/icons";

type Status = "live" | "soon";

interface FamilyItem {
  key: string;
  name: string;
  italic: string;
  desc: string;
  status: Status;
  cta: string;
  ctaHref: string;
  glyph: string;
}

const FAMILY: FamilyItem[] = [
  {
    key: "review",
    name: "Shmo Review",
    italic: "Review",
    desc: "One tap. One five-star review.",
    status: "live",
    cta: "Shop now",
    ctaHref: "/shmo-review",
    glyph: "R",
  },
  {
    key: "biz",
    name: "Shmo Biz",
    italic: "Biz",
    desc: "Your business card, upgraded.",
    status: "soon",
    cta: "Get notified",
    ctaHref: "#",
    glyph: "B",
  },
  {
    key: "link",
    name: "Shmo Link",
    italic: "Link",
    desc: "All your links. One place.",
    status: "soon",
    cta: "Get notified",
    ctaHref: "#",
    glyph: "L",
  },
  {
    key: "rep",
    name: "Shmo Reputation",
    italic: "Reputation",
    desc: "Every review, answered automatically.",
    status: "soon",
    cta: "Get notified",
    ctaHref: "#",
    glyph: "M",
  },
];

function FamilyTileBody({ item }: { item: FamilyItem }) {
  const live = item.status === "live";
  return (
    <>
      <span
        className={`family__status ${
          live ? "family__status--live" : "family__status--soon"
        }`}
      >
        {live ? "Available now" : "Coming soon"}
      </span>
      <div className={`family__glyph family__glyph--${item.key}`}>
        {item.glyph}
      </div>
      <h3 className="family__name">
        Shmo <em>{item.italic}</em>
      </h3>
      <p className="family__desc">{item.desc}</p>
      <div className="family__foot">
        {item.cta} <Icon.Arrow style={{ width: 14, height: 14 }} />
      </div>
    </>
  );
}

function FamilyTile({
  item,
  index,
  reduceMotion,
}: {
  item: FamilyItem;
  index: number;
  reduceMotion: boolean;
}) {
  const live = item.status === "live";
  const className = `family__tile ${
    live ? "family__tile--live" : "family__tile--soon"
  }`;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.32, delay: index * 0.06, ease: "easeOut" }}
    >
      {live ? (
        <Link href={item.ctaHref} className={className}>
          <FamilyTileBody item={item} />
        </Link>
      ) : (
        <a
          href={item.ctaHref}
          className={className}
          onClick={(e) => e.preventDefault()}
        >
          <FamilyTileBody item={item} />
        </a>
      )}
    </motion.div>
  );
}

export function ShmoFamily() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="family" className="hsection">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">Meet the family</div>
          <h2 className="hsection__title">
            Pick your <em>tool</em>.
          </h2>
        </div>
        <p className="hsection__lede">
          Four sub-brands, one shared platform. Shmo Review is shipping today;
          the rest roll out over the next few quarters.
        </p>
      </div>
      <div className="hsection__body">
        <div className="family">
          {FAMILY.map((item, i) => (
            <FamilyTile
              key={item.key}
              item={item}
              index={i}
              reduceMotion={!!reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add `scroll-margin-top` for the family anchor in `app/home.css`**

So the `#family` anchor lands cleanly under the sticky nav. Append:

```css
#family {
  scroll-margin-top: 80px;
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/home/ShmoFamily.tsx app/home.css
git commit -m "feat: build ShmoFamily grid with scroll-into-view animations"
```

---

## Task 12: Compose homepage in app/page.tsx + smooth scroll

**Files:**
- Modify: `app/page.tsx`, `app/globals.css`

- [ ] **Step 1: Replace `app/page.tsx`**

Overwrite with:

```tsx
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/home/Hero";
import { ShmoFamily } from "@/components/home/ShmoFamily";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ShmoFamily />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Add `scroll-behavior: smooth` to `<html>` in `app/globals.css`**

Find the `:root` or `html` block in `globals.css`. Add (or merge into the existing `html` rule):

```css
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 3: Boot dev server and verify the page renders**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: full homepage renders top to bottom: nav → hero → family grid → footer. Click "Meet the tools ↓" — page smooth-scrolls to the family section. Stop with `Ctrl+C`.

- [ ] **Step 4: Verify production build passes**

```bash
npm run build
```

Expected: `✓ Compiled successfully`, no TypeScript or lint errors.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/globals.css
git commit -m "feat: compose homepage and add smooth scroll"
```

---

## Task 13: Accessibility & visual smoke test (browser)

**Files:** none modified — verification only.

- [ ] **Step 1: Boot dev server**

```bash
npm run dev
```

Leave it running for the next steps.

- [ ] **Step 2: Tab through the page in browser, verify focus rings**

Open `http://localhost:3000`. Press Tab repeatedly from the top. Expected: every interactive element (brand link, sub-brand links, search/cart buttons, Shop CTA, hamburger, hero CTAs, sub-brand icon row, family tile links, footer links, social icons) shows a visible Ember-colored focus ring.

If any element has no visible focus ring, add to `app/globals.css`:

```css
:focus-visible {
  outline: 2px solid var(--graham);
  outline-offset: 2px;
  border-radius: 2px;
}
```

- [ ] **Step 3: Verify alt text and aria-labels**

Open the browser console and run:

```js
document.querySelectorAll('img').forEach(img => console.log(img.src, '→', img.alt));
document.querySelectorAll('button[aria-label]').forEach(b => console.log(b, '→', b.getAttribute('aria-label')));
```

Expected: every `<img>` has descriptive `alt`, every icon-only button has an `aria-label`. Mascot alt should be "Shmocard mascot holding a toolkit of cards" (or similar).

- [ ] **Step 4: Verify no horizontal scroll on mobile width**

Open Chrome devtools → device mode → iPhone SE (375×667). Expected: no horizontal scrollbar, all content fits viewport width. Repeat at 768px (iPad Mini) and 1280px (default desktop).

If horizontal scroll appears, find the offending element with:

```js
[...document.querySelectorAll('*')].filter(el => el.scrollWidth > document.documentElement.clientWidth)
```

Fix the overflow (usually `overflow-x: hidden` on `body` is wrong — find the actual element and constrain it).

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: accessibility — focus ring + alt text + responsive overflow"
```

(If no fixes were needed, skip this commit.)

---

## Task 14: Run sub-agent reviews (design + copy)

**Files:** none modified — review only.

- [ ] **Step 1: Run design-reviewer sub-agent against the homepage**

Dispatch the `design-reviewer` agent (defined in `.claude/agents/`) with:

> Review the homepage rendered at `localhost:3000`. Check `components/nav/Nav.tsx`, `components/home/Hero.tsx`, `components/home/ShmoFamily.tsx`, `components/footer/Footer.tsx`, `app/globals.css`, and `app/home.css` against `.claude/rules/design.md` and `branding guide/styles.css`. Flag any anti-patterns: thick borders, solid offset shadows, gradients, cool tones in chrome, body text in serif, multiple consecutive italic words, wrong font, mascot inside UI chrome, anything that conflicts with Warm Professional direction. Output a punch list of issues, each with file path and line number.

- [ ] **Step 2: Address any flagged issues**

Apply fixes one by one. Re-run `npx tsc --noEmit` and `npm run build` after each change to ensure nothing is broken. Commit each fix individually with a message like `fix(design): <what was changed>`.

- [ ] **Step 3: Run copy-reviewer sub-agent against the homepage**

Dispatch the `copy-reviewer` agent with:

> Review all user-facing copy on the homepage. Check `components/nav/Nav.tsx`, `components/home/Hero.tsx`, `components/home/ShmoFamily.tsx`, `components/footer/Footer.tsx` against `.claude/rules/marketing.md`. Flag any: invented stats (especially crew counts or trust numbers), banned words ("leverage", "frictionless", "seamless", "10x", "ship", "vibe", "crushing it", etc.), failed tradesperson test, multiple Fraunces italic accents in one scene, body text set in serif, naming violations (Shmo Card, ShmoCard, Shmocard Review, etc.). Output a punch list of issues with file path and line number.

- [ ] **Step 4: Address any flagged copy issues**

Apply fixes one by one. Commit each with `fix(copy): <what was changed>`.

- [ ] **Step 5: Final commit if everything passes**

If both reviews pass cleanly with no fixes needed, no commit is required. If fixes were committed in steps 2 and 4, this step is a no-op.

---

## Task 15: Browser smoke test at three breakpoints

**Files:** none modified — verification only.

- [ ] **Step 1: Boot dev server**

```bash
npm run dev
```

- [ ] **Step 2: Smoke test at 1280px (desktop)**

Open Chrome devtools → device toolbar → Responsive → set to 1280×800. Verify:
- Nav: full horizontal — brand, all 4 sub-brand links (Review with "Live" pill), all 3 company links, search, cart, Shop CTA. No hamburger visible.
- Hero: split layout — copy column left (headline with `<em>missing</em>` in Ember Fraunces italic, subhead, two CTAs, trust strip with two checkmarks, 4-icon sub-brand row), mascot column right.
- Family: 4 columns. Shmo Review tile shows green "Available now" badge. Other three show "Coming soon".
- Footer: 5 columns visible (Brand block, Software, Shop, Company, Support).
- Click "Meet the tools ↓" → smooth scroll lands family heading cleanly under the nav (not hidden).

- [ ] **Step 3: Smoke test at 768px (tablet)**

Resize to 768×1024. Verify:
- Nav: brand visible on left, hamburger on right (sub-brand and company links collapsed).
- Hero: stacked — copy on top, mascot below.
- Family: 2 columns × 2 rows.
- Footer: 2 columns (or stacked, depending on `home-styles.css` rules).
- Open hamburger drawer — sub-brand list and company list both visible. "Shop the cards" button at bottom. Click anywhere outside or press Esc → drawer closes.

- [ ] **Step 4: Smoke test at 375px (iPhone SE)**

Resize to 375×667. Verify:
- Nav: brand on left, hamburger on right.
- Hero: stacked, mascot scales to fit, headline doesn't overflow.
- Family: 1 column, full-width tiles.
- Footer: stacked, single column.
- No horizontal scroll. Body type ≥ 16px (use devtools computed style on a paragraph).

- [ ] **Step 5: Smoke test reduced motion**

In devtools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion" → reduce. Reload. Verify:
- Hero copy appears instantly (no fade-up).
- Family tiles appear instantly on scroll.
- Smooth scroll on "Meet the tools ↓" still works as instant jump.

If any of these checks fail, fix before proceeding. Commit fixes with `fix(responsive): <what>` or `fix(motion): <what>`.

- [ ] **Step 6: Stop dev server and commit if any fixes were applied**

```bash
# Ctrl+C the dev server
git add -A
git status  # confirm what's staged
git commit -m "fix: responsive + motion polish from smoke test"  # only if there are changes
```

---

## Task 16: Final build and lint verification

**Files:** none modified — verification only.

- [ ] **Step 1: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: no errors. Warnings about `next/image` for the mascot or unused vars should be 0.

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`. Bundle size for the homepage route should be reasonable — roughly < 200kB First Load JS. Note the size; flag in the next session if it's higher.

- [ ] **Step 4: Production server smoke test**

```bash
npm run start
```

Open `http://localhost:3000`. Expected: identical render to dev. No console errors. Stop with `Ctrl+C`.

- [ ] **Step 5: Final commit (if needed)**

If steps 1-4 surfaced any issues that required fixes, commit them now. Otherwise skip.

```bash
git status  # should be clean
```

---

## Done criteria

Phase A is complete when:

1. `localhost:3000` renders the homepage end to end (Nav → Hero → ShmoFamily → Footer) with no console errors.
2. `npm run build` and `npx tsc --noEmit` both pass clean.
3. The page is responsive at 375 / 768 / 1280, no horizontal scroll.
4. All interactive elements have visible focus rings, all images have alt text, all icon-only buttons have aria-labels.
5. The `design-reviewer` and `copy-reviewer` sub-agent runs return no critical issues.
6. `prefers-reduced-motion` is respected — animations replaced with instant fades.
7. No invented stats anywhere on the page.

When all six are true, the next phase (sections 3 onwards from `wireframe/home-page-shmocard.md`) can begin.

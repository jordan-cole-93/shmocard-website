/* design-system/components/Shm.tsx
   Reusable Shmocard primitives. Server components by default.
   Add "use client" only on stateful sections (e.g. FAQ, Showcase).
   ============================================================== */
import * as React from "react";

/* ---------- Layout ---------- */
export function Container({ className = "", children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`shm-container ${className}`} {...rest}>{children}</div>;
}

type Recipe = "snow" | "cream-soft" | "cream" | "paper" | "cocoa-hot";
const recipeClass: Record<Recipe, string> = {
  "snow": "shm-snow",
  "cream-soft": "shm-cream-soft",
  "cream": "shm-cream",
  "paper": "shm-paper",
  "cocoa-hot": "shm-cocoa-hot",
};
export function Section({
  recipe = "snow",
  className = "",
  children,
  ...rest
}: { recipe?: Recipe } & React.HTMLAttributes<HTMLElement>) {
  const isHot = recipe === "cocoa-hot";
  return (
    <section className={`shm-section ${recipeClass[recipe]} ${className}`} {...rest}>
      {isHot && <div className="shm-cocoa-hot__glow" aria-hidden="true" />}
      <Container>{children}</Container>
    </section>
  );
}

/* ---------- Typography ---------- */
export function Eyebrow({ italic = true, children }: { italic?: boolean; children: React.ReactNode }) {
  return <span className={italic ? "shm-eyebrow-italic" : "shm-eyebrow"}>{children}</span>;
}
export function Display({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`shm-display ${className}`}>{children}</h1>;
}
export function H1({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`shm-h1 ${className}`}>{children}</h1>;
}
export function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`shm-h2 ${className}`}>{children}</h2>;
}
export function H3({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`shm-h3 ${className}`}>{children}</h3>;
}
export function Lede({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`shm-lede ${className}`}>{children}</p>;
}
export function Body({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`shm-body ${className}`}>{children}</p>;
}
/** Italic accent — wrap 1–2 words inside a headline. Auto ember on light, honey on cocoa-hot. */
export function I({ children }: { children: React.ReactNode }) {
  return <em className="shm-italic">{children}</em>;
}

/* ---------- Buttons ---------- */
type BtnVariant = "primary" | "secondary" | "ghost" | "accent";
type BtnSize = "sm" | "md" | "lg";
const btnVariant: Record<BtnVariant, string> = {
  primary: "shm-btn--primary",
  secondary: "shm-btn--secondary",
  ghost: "shm-btn--ghost",
  accent: "shm-btn--accent",
};
const btnSize: Record<BtnSize, string> = { sm: "shm-btn--sm", md: "", lg: "shm-btn--lg" };
export function Button({
  variant = "primary", size = "md", className = "", children, ...rest
}: { variant?: BtnVariant; size?: BtnSize } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`shm-btn ${btnVariant[variant]} ${btnSize[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
export function ButtonLink({
  variant = "primary", size = "md", className = "", children, ...rest
}: { variant?: BtnVariant; size?: BtnSize } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`shm-btn ${btnVariant[variant]} ${btnSize[size]} ${className}`} {...rest}>
      {children}
    </a>
  );
}

/* ---------- Card ---------- */
export function Card({
  hover = true, className = "", children, ...rest
}: { hover?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`shm-card ${hover ? "shm-card--hover" : ""} ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* ---------- Badge ---------- */
type BadgeVariant = "live" | "soon" | "neutral";
const badgeVariant: Record<BadgeVariant, string> = {
  live: "shm-badge--live",
  soon: "shm-badge--soon",
  neutral: "shm-badge--neutral",
};
export function Badge({ variant = "neutral", children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  return <span className={`shm-badge ${badgeVariant[variant]}`}>{children}</span>;
}

/* ---------- Image frame (marketing 3D slot) ---------- */
export function ImageFrame({
  ratio = "16/9", className = "", children,
}: { ratio?: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`shm-image-frame ${className}`} style={{ aspectRatio: ratio }}>
      {children}
    </div>
  );
}

/* ---------- Family tile ---------- */
type FamilyKey = "review" | "biz" | "link" | "rep";
const familyGlyph: Record<FamilyKey, string> = {
  review: "shm-family-glyph--review",
  biz:    "shm-family-glyph--biz",
  link:   "shm-family-glyph--link",
  rep:    "shm-family-glyph--rep",
};
export function FamilyTile({
  brandKey, glyph, name, italic, desc, status, ctaLabel, href,
}: {
  brandKey: FamilyKey; glyph: string; name: string; italic: string;
  desc: string; status: "live" | "soon"; ctaLabel: string; href: string;
}) {
  return (
    <a href={href} className="shm-family-tile">
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <Badge variant={status === "live" ? "live" : "soon"}>
          {status === "live" ? "Available now" : "Coming soon"}
        </Badge>
      </div>
      <div className={`shm-family-glyph ${familyGlyph[brandKey]}`}>{glyph}</div>
      <h3 className="shm-h3">{name} <I>{italic}</I></h3>
      <p className="shm-body" style={{ marginTop: 6 }}>{desc}</p>
      <div style={{ marginTop: "auto", paddingTop: 24, fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>
        {ctaLabel} →
      </div>
    </a>
  );
}

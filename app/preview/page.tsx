import Link from "next/link";
import "../home.css";
import "./preview.css";

const spotlightVariants = [
  {
    href: "/preview/spotlights-a",
    name: "Variant A — Stage Switcher",
    desc: "One big stage, four sub-brand tabs underneath. Click a tab, the stage swaps. Auto-cycles.",
  },
  {
    href: "/preview/spotlights-b",
    name: "Variant B — Refined 2×2 Grid",
    desc: "Four cards in a 2×2 grid. Hairline borders, big serif italic numbers, one dark accent card.",
  },
  {
    href: "/preview/spotlights-c",
    name: "Variant C — Vertical Tabbed Showcase",
    desc: "List of 4 sub-brands on the left, large stage on the right. Click a row to swap the stage.",
  },
];

const heroVariants = [
  {
    href: "/preview/hero-trust",
    name: "Hero · Trust pills",
    desc: "Replaces the existing meta strip with three trust pills (Free shipping · 24h ship · 30-day guarantee). Direct purchase friction reducer.",
  },
  {
    href: "/preview/hero-testimonial",
    name: "Hero · One-line testimonial",
    desc: "Inserts a star rating + Carly's verified quote between the lede and the CTAs. Trust signal in the highest-attention zone.",
  },
  {
    href: "/preview/hero-avatar",
    name: "Hero · Avatar trust stack (Magic-built)",
    desc: "Compact 5-avatar stack with 5-star rating + 'Loved by Carly, Marshall, and 500+ Main Street crews'. Parent-brand social proof, no Shmo Review specifics.",
  },
];

const whyVariants = [
  {
    href: "/preview/why-a",
    name: "Variant A — Numbered narrative stack",
    desc: "Headline left, vertical 3-pillar list right with big Fraunces italic numerals (01 02 03) and hairline dividers. No cards.",
  },
  {
    href: "/preview/why-b",
    name: "Variant B — Zig-zag alternating rows",
    desc: "Header above, three full-width rows with alternating icon side. Each row gets its own warm surface (cream / honey / blush).",
  },
  {
    href: "/preview/why-c",
    name: "Variant C — Split-surface contrast",
    desc: "Cream-peachy panel left with the headline, chocolate panel right with three honey-accented pillars. One section, two surfaces.",
  },
];

export default function PreviewIndex() {
  return (
    <div className="home">
      <div className="preview-shell">
        <div className="preview-shell__inner">
          <div className="preview-head">
            <span className="preview-head__eyebrow">Preview · Section variants</span>
            <h1 className="preview-head__title">
              Compare <em>variations</em>.
            </h1>
            <p className="preview-head__lede">
              Each variant uses real Shmocard copy. Pick the one that respects the brand.
            </p>
          </div>

          <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 14px" }}>
            Hero conversion levers
          </h2>
          <div style={{ display: "grid", gap: 12, maxWidth: 720, marginBottom: 40 }}>
            {heroVariants.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                style={{
                  display: "block",
                  padding: "20px 24px",
                  background: "var(--paper)",
                  border: "1px solid var(--hair)",
                  borderRadius: 14,
                  textDecoration: "none",
                  color: "var(--ink)",
                }}
              >
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 6 }}>
                  {v.name}
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55 }}>{v.desc}</div>
              </Link>
            ))}
          </div>

          <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 14px" }}>
            Sub-brand showcase
          </h2>
          <div style={{ display: "grid", gap: 12, maxWidth: 720, marginBottom: 40 }}>
            {spotlightVariants.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                style={{
                  display: "block",
                  padding: "20px 24px",
                  background: "var(--paper)",
                  border: "1px solid var(--hair)",
                  borderRadius: 14,
                  textDecoration: "none",
                  color: "var(--ink)",
                  transition: "box-shadow 0.18s ease, transform 0.18s ease",
                }}
              >
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 6 }}>
                  {v.name}
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55 }}>{v.desc}</div>
              </Link>
            ))}
          </div>

          <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 14px" }}>
            Why Shmocard (3-pillar value-prop)
          </h2>
          <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
            {whyVariants.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                style={{
                  display: "block",
                  padding: "20px 24px",
                  background: "var(--paper)",
                  border: "1px solid var(--hair)",
                  borderRadius: 14,
                  textDecoration: "none",
                  color: "var(--ink)",
                  transition: "box-shadow 0.18s ease, transform 0.18s ease",
                }}
              >
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 6 }}>
                  {v.name}
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55 }}>{v.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

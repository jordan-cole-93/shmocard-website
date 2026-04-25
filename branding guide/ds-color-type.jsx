/* =========================================================
   Color system + Typography specimen
   S'more / Hot Ember palette
   ========================================================= */

function Colors() {
  const warm = [
    { name: "Cream",      hex: "#FFF1DC", role: "Page background — warm marshmallow", ink: "var(--ink)" },
    { name: "Snow",       hex: "#FFF8EA", role: "Lifted warm surface",                ink: "var(--ink)" },
    { name: "Paper",      hex: "#FFFFFF", role: "Cards, dashboard, inputs",            ink: "var(--ink)" },
    { name: "Graham Soft",hex: "#FFE0C2", role: "Peachy graham wash",                  ink: "var(--ink)" },
    { name: "Ember",      hex: "#FF5B1F", role: "Primary brand — CTAs, italic accent", ink: "#FFFFFF" },
    { name: "Ember Deep", hex: "#E04210", role: "Hover, deep brand text",              ink: "#FFFFFF" },
    { name: "Orange",     hex: "#FF7A3A", role: "Secondary accent, illustration",      ink: "var(--ink)" },
    { name: "Peach",      hex: "#FFA378", role: "Soft surface, illustration",          ink: "var(--ink)" },
    { name: "Honey",      hex: "#FFB833", role: "Pop accent — toasted marshmallow",    ink: "var(--ink)" },
    { name: "Honey Soft", hex: "#FFE3B0", role: "Honey wash, callout backgrounds",     ink: "var(--ink)" },
    { name: "Chocolate",  hex: "#6B3A1E", role: "Deep secondary",                      ink: "#FFFFFF" },
    { name: "Choc Deep",  hex: "#3B1F14", role: "Ink, primary text",                   ink: "#FFFFFF" },
  ];
  const ink = [
    { name: "Ink",        hex: "#3B1F14", role: "Primary text — chocolate, not black", ink: "#FFFFFF" },
    { name: "Ink 2",      hex: "#4A2C1E", role: "Strong body text",                    ink: "#FFFFFF" },
    { name: "Ink 3",      hex: "#6B4A37", role: "Secondary text",                      ink: "#FFFFFF" },
    { name: "Muted",      hex: "#8A6E5A", role: "Captions, helper text",               ink: "#FFFFFF" },
  ];
  const semantic = [
    { name: "Success",    hex: "#2E7D44", role: "Positive states, deltas up",          ink: "#FFFFFF" },
    { name: "Warn",       hex: "#C8472D", role: "Negative states, low ratings",        ink: "#FFFFFF" },
  ];

  return (
    <section className="ds-section" id="Color">
      <SectionHead
        num="02 · Color"
        title="Warm core, used with {em}."
        em="restraint"
        desc="A s'more palette: marshmallow cream surfaces, hot ember as the primary brand accent, toasted honey for pop, and chocolate for ink. Ember does the heavy lifting on CTAs and italic accent words — used decisively, never as a wash."
      />

      <div className="ds-eyebrow" style={{marginBottom: 12}}>Warm palette</div>
      <div className="grid-4">
        {warm.map(s => <Swatch key={s.hex} {...s}/>)}
      </div>

      <div className="ds-eyebrow" style={{marginBottom: 12, marginTop: 40}}>Ink &amp; neutrals</div>
      <div className="grid-4">
        {ink.map(s => <Swatch key={s.hex} {...s}/>)}
      </div>

      <div className="ds-eyebrow" style={{marginBottom: 12, marginTop: 40}}>Semantic</div>
      <div className="grid-4">
        {semantic.map(s => <Swatch key={s.hex} {...s}/>)}
      </div>

      {/* Pairings */}
      <div className="mt-48">
        <div className="ds-eyebrow" style={{marginBottom: 12}}>Surface pairings</div>
        <div className="grid-3">
          <Pairing bg="#FFF1DC" title="Cream + Ink" desc="Default page surface. Warm marshmallow — our most-used pairing."/>
          <Pairing bg="#FFFFFF" title="Paper + Ink" desc="Product UI. Clean and calm. All dashboard cards live here."/>
          <Pairing bg="#3B1F14" title="Chocolate + Honey" inkColor="#FFB833" subColor="#FFFFFFB0" desc="High-stakes moments — testimonials, big stats, premium plans."/>
        </div>
      </div>
    </section>
  );
}

function Swatch({ name, hex, role, ink }) {
  return (
    <div className="swatch">
      <div className="swatch__chip" style={{background: hex}}/>
      <div className="swatch__meta">
        <div className="swatch__name">{name}</div>
        <div className="swatch__hex">{hex}</div>
        <div style={{fontSize: 12, color: "var(--muted)", marginTop: 2}}>{role}</div>
      </div>
    </div>
  );
}

function Pairing({ bg, title, desc, inkColor = "var(--ink)", subColor = "var(--ink-3)" }) {
  return (
    <div style={{borderRadius: "var(--r-lg)", overflow: "hidden", border: "1px solid var(--hair)", boxShadow: "var(--sh-sm)"}}>
      <div style={{background: bg, padding: 28, minHeight: 160}}>
        <div style={{color: inkColor, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em"}}>
          The <span style={{fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--graham)"}}>right</span> kind of warm.
        </div>
        <div style={{color: subColor, fontSize: 13, marginTop: 12, lineHeight: 1.5, maxWidth: "30ch"}}>
          Sample copy showing how text reads on this surface.
        </div>
      </div>
      <div style={{padding: "12px 16px", background: "var(--paper)", borderTop: "1px solid var(--hair)"}}>
        <div style={{fontSize: 13, fontWeight: 600}}>{title}</div>
        <div style={{fontSize: 12, color: "var(--muted)", marginTop: 2}}>{desc}</div>
      </div>
    </div>
  );
}

/* ---------- Typography ---------- */

function Typography() {
  return (
    <section className="ds-section" id="Type">
      <SectionHead
        num="03 · Typography"
        title="Sans dominant, {em} as accent."
        em="serif italic"
        desc="Inter Tight does the work — UI, body, most headlines. Fraunces italic appears once or twice per scene to add warmth and editorial rhythm. Italic accent words always use ember. Never set body in serif; never italicize multiple consecutive words."
      />

      {/* Specimen */}
      <div className="card card--lg" style={{padding: 40}}>
        <div className="ds-eyebrow" style={{marginBottom: 16}}>Display · Inter Tight + Fraunces italic accent</div>
        <div style={{fontSize: 64, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.0, color: "var(--ink)"}}>
          Turn happy customers<br/>
          into <span className="ds-italic" style={{fontSize: 64, letterSpacing: "-0.025em"}}>five-star</span> reviews.
        </div>
      </div>

      <div className="grid-2 mt-24">
        <TypeSpec
          eyebrow="H1 · Display"
          spec="Inter Tight 600 · 60/64 · -0.035em"
          sample={<div style={{fontSize: 56, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.0}}>The card that <span className="ds-italic">earns</span> reviews.</div>}
        />
        <TypeSpec
          eyebrow="H2 · Section"
          spec="Inter Tight 600 · 44/46 · -0.025em"
          sample={<div style={{fontSize: 40, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.05}}>Built for the <span className="ds-italic">counter,</span> not the cloud.</div>}
        />
        <TypeSpec
          eyebrow="H3 · Card"
          spec="Inter Tight 600 · 22/26 · -0.015em"
          sample={<div style={{fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em"}}>One tap, one review.</div>}
        />
        <TypeSpec
          eyebrow="Eyebrow"
          spec="Inter Tight 600 · 11px · 1.6px tracking · UPPERCASE"
          sample={<div style={{fontSize: 11, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase", color: "var(--muted)"}}>Reputation dashboard</div>}
        />
        <TypeSpec
          eyebrow="Body · Lede"
          spec="Inter Tight 400 · 17/26"
          sample={<div style={{fontSize: 17, lineHeight: 1.55, color: "var(--ink-3)"}}>A small NFC card on your counter. One tap on a customer's phone opens a pre-filled Google review — no app, no scan, no typed URL.</div>}
        />
        <TypeSpec
          eyebrow="Body · Default"
          spec="Inter Tight 400 · 14/22"
          sample={<div style={{fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)"}}>Watch every review across Google, Yelp, and Facebook in one place. Auto-alerts when a low rating drops, AI-suggested replies in your voice.</div>}
        />
        <TypeSpec
          eyebrow="Numerals · Stat"
          spec="Fraunces 400 · -0.025em · serif accent for stats"
          sample={<div style={{fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 56, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--ink)"}}>4.9</div>}
        />
        <TypeSpec
          eyebrow="Mono · Tokens"
          spec="JetBrains Mono 400 · 12px · for hex codes, tokens"
          sample={<div style={{fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-2)"}}>--graham: #FF5B1F;</div>}
        />
      </div>
    </section>
  );
}

function TypeSpec({ eyebrow, spec, sample }) {
  return (
    <div className="card card--lg">
      <div className="ds-eyebrow" style={{marginBottom: 6}}>{eyebrow}</div>
      <div style={{fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", marginBottom: 18}}>{spec}</div>
      <div>{sample}</div>
    </div>
  );
}

Object.assign(window, { Colors, Typography });

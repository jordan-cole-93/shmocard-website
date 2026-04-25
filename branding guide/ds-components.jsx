/* =========================================================
   Iconography + Components (buttons, inputs, cards, pills, nav)
   ========================================================= */

function Iconography() {
  // Stroke-based line icons, 1.6 stroke, rounded caps, 24x24
  const Icon = ({ children }) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
  const icons = [
    { name: "Tap", glyph: <Icon><path d="M9 11V7a3 3 0 0 1 6 0v6"/><path d="M9 11l-1.5 1.5a2 2 0 0 0 0 2.8L12 20l5-5a4 4 0 0 0 1-2.6V9a2 2 0 0 0-4 0"/></Icon> },
    { name: "Star", glyph: <Icon><path d="M12 3l2.6 5.5 6 .9-4.4 4.2 1 6L12 16.8 6.8 19.6l1-6L3.4 9.4l6-.9z"/></Icon> },
    { name: "Card", glyph: <Icon><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/></Icon> },
    { name: "QR", glyph: <Icon><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3"/><path d="M20 14v3"/><path d="M14 20h7"/></Icon> },
    { name: "Chart", glyph: <Icon><path d="M4 19h16"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-5"/></Icon> },
    { name: "Bell", glyph: <Icon><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></Icon> },
    { name: "Reply", glyph: <Icon><path d="M9 17l-5-5 5-5"/><path d="M4 12h10a6 6 0 0 1 6 6v1"/></Icon> },
    { name: "Check", glyph: <Icon><circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/></Icon> },
    { name: "Person", glyph: <Icon><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Icon> },
    { name: "Bag", glyph: <Icon><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></Icon> },
    { name: "Link", glyph: <Icon><path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1"/><path d="M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1"/></Icon> },
    { name: "Settings", glyph: <Icon><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.4 1a7 7 0 0 0-2.2-1.3L14 3h-4l-.3 2.5a7 7 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 2.2 1.3L10 21h4l.3-2.5a7 7 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z"/></Icon> },
  ];

  return (
    <section className="ds-section" id="Icons">
      <SectionHead
        num="04 · Iconography"
        title="Line icons, {em} weight."
        em="hairline"
        desc="1.6px stroke, rounded caps and joins, 24×24 grid. Calm, neutral, never decorative. The exception is the NFC tap mark — our signature affordance, drawn slightly bolder."
      />

      <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12}}>
        {icons.map(i => (
          <div key={i.name} className="card" style={{padding: 0, overflow: "hidden", textAlign: "center"}}>
            <div style={{padding: "28px 0", color: "var(--ink-2)"}}>{i.glyph}</div>
            <div style={{padding: "10px 12px", borderTop: "1px solid var(--hair)", fontSize: 12, color: "var(--muted)"}}>{i.name}</div>
          </div>
        ))}
      </div>

      {/* NFC tap mark */}
      <div className="mt-32 grid-2" style={{gap: 24}}>
        <div className="card card--lg" style={{display: "flex", alignItems: "center", gap: 24}}>
          <div style={{flexShrink: 0, width: 96, height: 96, borderRadius: "var(--r-lg)", background: "var(--snow)", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <svg viewBox="0 0 48 48" width="56" height="56" fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round">
              <path d="M16 24a8 8 0 0 1 16 0"/>
              <path d="M12 24a12 12 0 0 1 24 0"/>
              <path d="M8 24a16 16 0 0 1 32 0"/>
              <circle cx="24" cy="24" r="2.4" fill="var(--ink)"/>
            </svg>
          </div>
          <div>
            <div className="ds-eyebrow" style={{marginBottom: 4}}>Signature mark</div>
            <h3 style={{margin: "0 0 6px", fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em"}}>The NFC tap.</h3>
            <p style={{margin: 0, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55}}>Three radiating arcs above a center dot. The single most-used icon in the system — appears on cards, on web, and in every "tap to review" moment.</p>
          </div>
        </div>
        <div className="card card--lg" style={{display: "flex", alignItems: "center", gap: 24}}>
          <div style={{flexShrink: 0, width: 96, height: 96, borderRadius: "var(--r-lg)", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <svg viewBox="0 0 48 48" width="56" height="56" fill="none" stroke="var(--paper)" strokeWidth="2.4" strokeLinecap="round">
              <path d="M16 24a8 8 0 0 1 16 0"/>
              <path d="M12 24a12 12 0 0 1 24 0"/>
              <path d="M8 24a16 16 0 0 1 32 0"/>
              <circle cx="24" cy="24" r="2.4" fill="var(--paper)"/>
            </svg>
          </div>
          <div>
            <div className="ds-eyebrow" style={{marginBottom: 4, color: "var(--graham-deep)"}}>Inverted</div>
            <h3 style={{margin: "0 0 6px", fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em"}}>On dark surfaces.</h3>
            <p style={{margin: 0, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55}}>Same construction, inverted to white. Use on ink, navy, or photography backgrounds. Maintain 16px clear-space minimum.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Components ---------- */

function Components() {
  return (
    <section className="ds-section" id="Components">
      <SectionHead
        num="05 · Components"
        title="The {em} kit."
        em="working"
        desc="Buttons, inputs, cards, pills, navigation. Hairline borders, soft shadows, generous radii. Built so a small business owner feels at home — like a familiar SaaS tool, not a startup gimmick."
      />

      {/* Buttons */}
      <div className="ds-eyebrow" style={{marginBottom: 12}}>Buttons</div>
      <div className="card card--lg" style={{display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center"}}>
        <button className="btn btn--primary">Order your card</button>
        <button className="btn btn--accent">Get started</button>
        <button className="btn btn--soft">Learn more</button>
        <button className="btn btn--ghost">Cancel</button>
        <button className="btn btn--primary btn--lg">Book a demo →</button>
        <button className="btn btn--ghost btn--sm">Skip</button>
      </div>

      {/* Inputs */}
      <div className="ds-eyebrow" style={{marginTop: 32, marginBottom: 12}}>Inputs</div>
      <div className="grid-3">
        <div className="card">
          <label className="input-label">Business name</label>
          <input className="input" defaultValue="Marisol's Salon"/>
        </div>
        <div className="card">
          <label className="input-label">Google Place URL</label>
          <input className="input" placeholder="https://g.page/..."/>
        </div>
        <div className="card">
          <label className="input-label">Email</label>
          <input className="input" defaultValue="hello@marisolsalon.com"/>
        </div>
      </div>

      {/* Pills */}
      <div className="ds-eyebrow" style={{marginTop: 32, marginBottom: 12}}>Pills &amp; badges</div>
      <div className="card card--lg" style={{display: "flex", flexWrap: "wrap", gap: 10}}>
        <span className="pill"><span className="pill__dot"/> Default</span>
        <span className="pill pill--success"><span className="pill__dot"/> Live</span>
        <span className="pill pill--warn"><span className="pill__dot"/> Needs reply</span>
        <span className="pill pill--honey">★ Featured</span>
        <span className="pill pill--navy">Premium</span>
        <span className="pill pill--ink">New</span>
      </div>

      {/* Card examples */}
      <div className="ds-eyebrow" style={{marginTop: 32, marginBottom: 12}}>Cards</div>
      <div className="grid-3">
        <div className="card card--lg">
          <div className="card__kicker">Plan</div>
          <h3 className="card__title">Starter</h3>
          <p className="card__desc">One NFC card, basic dashboard, email support.</p>
          <div style={{marginTop: 16, display: "flex", alignItems: "baseline", gap: 6}}>
            <span style={{fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 400, letterSpacing: "-0.025em"}}>$19</span>
            <span style={{color: "var(--muted)", fontSize: 13}}>/ month</span>
          </div>
          <button className="btn btn--soft" style={{marginTop: 16, width: "100%"}}>Choose Starter</button>
        </div>
        <div className="card card--lg" style={{borderColor: "var(--ink)", boxShadow: "var(--sh-md)"}}>
          <div className="card__kicker" style={{color: "var(--graham-deep)"}}>Most popular</div>
          <h3 className="card__title">Growth</h3>
          <p className="card__desc">Three cards, AI replies, multi-source monitoring.</p>
          <div style={{marginTop: 16, display: "flex", alignItems: "baseline", gap: 6}}>
            <span style={{fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 400, letterSpacing: "-0.025em"}}>$39</span>
            <span style={{color: "var(--muted)", fontSize: 13}}>/ month</span>
          </div>
          <button className="btn btn--primary" style={{marginTop: 16, width: "100%"}}>Choose Growth</button>
        </div>
        <div className="card card--lg">
          <div className="card__kicker">Enterprise</div>
          <h3 className="card__title">Multi-location</h3>
          <p className="card__desc">Unlimited cards, team seats, dedicated CSM.</p>
          <div style={{marginTop: 16, display: "flex", alignItems: "baseline", gap: 6}}>
            <span style={{fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 400, letterSpacing: "-0.025em"}}>Custom</span>
          </div>
          <button className="btn btn--soft" style={{marginTop: 16, width: "100%"}}>Talk to sales</button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Iconography, Components });

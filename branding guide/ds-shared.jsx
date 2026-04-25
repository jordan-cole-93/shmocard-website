/* =========================================================
   Shared building blocks — TopBar, Footer, SectionHead, Hero
   ========================================================= */

function TopBar() {
  const links = [
    "Foundations", "Color", "Type", "Icons",
    "Components", "Sub-brands", "Product", "Dashboard"
  ];
  return (
    <header className="topbar">
      <a className="topbar__brand" href="#top">
        <span className="topbar__brand-mark">S</span>
        <span>Shmo<span style={{color: "var(--graham-deep)"}}>card</span> <span style={{color: "var(--muted)", fontWeight: 500}}>· Design System</span></span>
      </a>
      <nav className="topbar__nav">
        {links.map(l => <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`}>{l}</a>)}
      </nav>
      <span className="topbar__meta">v2.0 · s'more / hot ember</span>
    </header>
  );
}

function SectionHead({ num, title, em, desc }) {
  // title can include {em} placeholder — render with serif italic accent
  let titleNode = title;
  if (em) {
    const parts = title.split("{em}");
    titleNode = <>{parts[0]}<em>{em}</em>{parts[1]}</>;
  }
  return (
    <header className="ds-sectionhead">
      <div>
        <div className="ds-sectionhead__num">{num}</div>
        <h2 className="ds-sectionhead__title">{titleNode}</h2>
      </div>
      <p className="ds-sectionhead__desc">{desc}</p>
    </header>
  );
}

function Hero({ mascot = "hero-charge" }) {
  return (
    <section className="hero" id="top">
      <div>
        <span className="hero__pill">
          <span className="hero__pill-dot">★</span>
          Brand &amp; product design system · 2026
        </span>
        <h1 className="hero__title">
          Turn happy customers<br/>into <em>five-star</em> reviews.
        </h1>
        <p className="hero__lede">
          The official design system for Shmocard — marshmallow-warm and ember-bold. NFC review cards and reputation tools built to be trusted by salons, dentists, restaurants, and contractors.
        </p>
        <div className="hero__ctas">
          <a className="btn btn--primary btn--lg" href="#Foundations">Explore the system</a>
          <a className="btn btn--ghost btn--lg" href="#Product">See the product →</a>
        </div>
        <div className="hero__meta">
          <span style={{display: "inline-flex", alignItems: "center", gap: 8}}>
            <span style={{color: "var(--graham)", letterSpacing: 1, fontSize: 13}}>★★★★★</span>
            <strong style={{color: "var(--ink)", fontWeight: 600}}>4.9</strong>
            <span>average across 2,300+ businesses</span>
          </span>
        </div>
      </div>
      <div className="hero__stage">
        <img src={`assets/mascot/${mascot}.png`} alt="Shmo mascot" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="page">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-name">Shmo<span style={{color: "var(--graham-deep)"}}>card</span> <span style={{color: "var(--graham)"}}>·</span></div>
            <p className="footer__tagline">The NFC review card and reputation suite for local business. Marshmallow-warm. Ember-bold.</p>
          </div>
          <div className="footer__col">
            <div className="footer__col-title">System</div>
            <a href="#Foundations">Foundations</a>
            <a href="#Color">Color</a>
            <a href="#Type">Type</a>
            <a href="#Components">Components</a>
          </div>
          <div className="footer__col">
            <div className="footer__col-title">Product</div>
            <a href="#Product">Cards</a>
            <a href="#Dashboard">Dashboard</a>
            <a href="#Sub-brands">Sub-brands</a>
          </div>
          <div className="footer__col">
            <div className="footer__col-title">Resources</div>
            <a href="#">Logo files</a>
            <a href="#">Mascot library</a>
            <a href="#">Print specs</a>
          </div>
        </div>
        <div style={{marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--hair)", fontSize: 12, color: "var(--muted)", display: "flex", justifyContent: "space-between"}}>
          <span>© 2026 Shmocard. Designed in-house.</span>
          <span style={{fontFamily: "var(--font-serif)", fontStyle: "italic"}}>Made with care for local business.</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { TopBar, SectionHead, Hero, Footer });

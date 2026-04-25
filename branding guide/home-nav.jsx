/* home-nav.jsx — top navigation for the Shmocard homepage (mobile-friendly) */

function HomeNav() {
  const [open, setOpen] = React.useState(false);

  // Close on Esc + lock body scroll when open
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#" className="nav__brand" aria-label="Shmocard home">
          <span className="nav__mark">S</span>
          <span className="nav__wordmark">Shmo<em>card</em></span>
        </a>

        <nav className="nav__menu nav__menu--desktop" aria-label="Sub-brands">
          <a className="nav__link" href="#review">
            Shmo Review <span className="pill">Live</span>
          </a>
          <a className="nav__link" href="#biz">Shmo Biz</a>
          <a className="nav__link" href="#link">Shmo Link</a>
          <a className="nav__link" href="#reputation">Shmo Reputation</a>
        </nav>

        <span className="nav__spacer"/>

        <nav className="nav__menu nav__menu--desktop" aria-label="Company">
          <a className="nav__link" href="#how">How it works</a>
          <a className="nav__link" href="#pricing">Pricing</a>
          <a className="nav__link" href="#about">About</a>
        </nav>

        <div className="nav__right">
          <button className="nav__icon-btn nav__icon-btn--desktop" aria-label="Search">
            <Icon.Search style={{width:16, height:16}}/>
          </button>
          <button className="nav__icon-btn" aria-label="Cart">
            <Icon.Cart style={{width:16, height:16}}/>
            <span className="nav__cart-badge">2</span>
          </button>
          <a className="btn btn--primary btn--sm nav__shop-cta" href="#review">
            Shop <Icon.Arrow style={{width:14, height:14}}/>
          </a>
          <button
            className="nav__icon-btn nav__hamburger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            {open ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="nav__scrim" onClick={close} aria-hidden="true"/>
          <div className="nav__drawer" role="dialog" aria-label="Site menu">
            <div className="nav__drawer-section">
              <div className="nav__drawer-eyebrow">Products</div>
              <a className="nav__drawer-link" href="#review" onClick={close}>
                Shmo Review <span className="pill">Live</span>
              </a>
              <a className="nav__drawer-link" href="#biz" onClick={close}>Shmo Biz</a>
              <a className="nav__drawer-link" href="#link" onClick={close}>Shmo Link</a>
              <a className="nav__drawer-link" href="#reputation" onClick={close}>Shmo Reputation</a>
            </div>
            <div className="nav__drawer-section">
              <div className="nav__drawer-eyebrow">Company</div>
              <a className="nav__drawer-link" href="#how" onClick={close}>How it works</a>
              <a className="nav__drawer-link" href="#pricing" onClick={close}>Pricing</a>
              <a className="nav__drawer-link" href="#about" onClick={close}>About</a>
            </div>
            <div className="nav__drawer-cta">
              <a className="btn btn--primary" href="#review" onClick={close} style={{justifyContent:"center"}}>
                Shop the cards <Icon.Arrow style={{width:14, height:14}}/>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

Object.assign(window, { HomeNav });

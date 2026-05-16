// home-parts.jsx — small reusable parts (Nav, Wave, Wordmark, Logo)

const { useState } = React;

function Wordmark({ size = 26 }) {
  return (
    <span className="nav-mark" style={{ fontSize: size }}>
      <span className="wm-shmo">Shmo</span><span className="wm-card">Card</span>
    </span>
  );
}

function Logo({ size = 26 }) {
  return (
    <a className="nav-logo" href="#top" aria-label="ShmoCard home">
      <img src="assets/mascot/wordmark-smore.png" alt="" style={{ width: size * 1.25, height: size * 1.25 }} />
      <Wordmark size={size} />
    </a>
  );
}

function Wave({ to, flip = false }) {
  return <div className={`shm-wave shm-wave--${to}${flip ? ' flip' : ''}`} aria-hidden="true"></div>;
}

function Nav({ cartCount = 2 }) {
  return (
    <header className="shm-nav" id="top">
      <div className="shm-container nav-inner">
        <Logo size={26} />
        <nav className="nav-links" aria-label="Primary">
          <a className="nav-link" href="/shmo-review">
            Shmo Review
            <span className="shm-badge shm-badge--status shm-badge--status-clover nav-link-status">Live</span>
          </a>
          <a className="nav-link" href="#biz">
            Shmo Biz
            <span className="shm-badge shm-badge--status shm-badge--status-honey nav-link-status">Soon</span>
          </a>
          <a className="nav-link" href="#link">
            Shmo Link
            <span className="shm-badge shm-badge--status shm-badge--status-honey nav-link-status">Soon</span>
          </a>
          <a className="nav-link" href="#reputation">
            Shmo Reputation
            <span className="shm-badge shm-badge--status shm-badge--status-honey nav-link-status">Soon</span>
          </a>
        </nav>
        <div className="nav-cta-row">
          <button className="nav-cart" aria-label={`Cart, ${cartCount} items`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 7h14l-1.5 9.2a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7Z"/>
              <path d="M9 7V5.5a3 3 0 0 1 6 0V7"/>
            </svg>
            {cartCount > 0 && <span className="nav-cart__count">{cartCount}</span>}
          </button>
          <a className="shm-btn shm-btn--primary shm-btn--sm" href="/shmo-review">Shop →</a>
        </div>
      </div>
    </header>
  );
}

function HeroToolkitTile({ name, sub, status, art, color }) {
  return (
    <div className="hero-toolkit__tile" style={color ? { background: color } : null}>
      {status && (
        <span className={`shm-badge ${status === 'live' ? 'shm-badge--ember' : ''} hero-toolkit__status`}>
          {status === 'live' ? 'Live' : 'Soon'}
        </span>
      )}
      {art && (
        <div className="hero-toolkit__art">
          <img src={art} alt="" />
        </div>
      )}
      <h3 className="hero-toolkit__name">{name}</h3>
      <p className="hero-toolkit__sub">{sub}</p>
    </div>
  );
}

function AudienceStrip() {
  const items = [...AUDIENCES, ...AUDIENCES]; // duplicate for seamless scroll
  return (
    <div className="audience-strip" aria-hidden="true">
      <div className="audience-strip__track">
        {items.map((a, i) => (
          <React.Fragment key={i}>
            <span>{a}</span>
            <span className="dot"></span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ProofShop({ shop }) {
  return (
    <div className="proof-shop">
      <div className="proof-shop__name">{shop.name}</div>
      <div className="proof-shop__owner">{shop.owner}</div>
      <div className="proof-shop__inc">{shop.inc}</div>
    </div>
  );
}

function ProofQuote({ quote }) {
  return (
    <figure className="shm-card proof-quote">
      <blockquote className="proof-quote__body">"{quote.body}"</blockquote>
      <figcaption className="proof-quote__attr">
        <span className="proof-quote__avatar">{quote.initials}</span>
        <span>
          <b>{quote.author}</b>
          {quote.shop}
        </span>
      </figcaption>
    </figure>
  );
}

function HowStep({ step }) {
  return (
    <div className="how-step">
      <div className="how-step__num">{step.n}</div>
      <div className="how-step__title">{step.title}</div>
      <p className="how-step__body">{step.body}</p>
    </div>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <li className="shm-faq-item">
      <button className="shm-faq-trigger" aria-expanded={open} onClick={onToggle}>
        <span className="shm-faq-question">{item.q}</span>
        <span className="shm-faq-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </span>
      </button>
      {open && <div className="shm-faq-answer">{item.a}</div>}
    </li>
  );
}

function Faq({ items }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="faq-wrap">
      <ul className="shm-faq-list">
        {items.map((it, i) => (
          <FaqItem
            key={i}
            item={it}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
      </ul>
    </div>
  );
}

function Compatibility() {
  return (
    <div className="shm-container compat">
      <span className="compat-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
        Works on <b>iPhone XS+</b> (2018 and newer)
      </span>
      <span className="compat-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
        And <b>Android 5+</b> (Lollipop and up)
      </span>
      <span className="compat-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="0.5"/><rect x="14" y="3" width="7" height="7" rx="0.5"/><rect x="3" y="14" width="7" height="7" rx="0.5"/><path d="M14 14h3v3h-3z M20 14h1v3M14 20h3v1M20 20h1v1"/></svg>
        QR code on every card for older phones
      </span>
    </div>
  );
}

Object.assign(window, { Nav, Wave, Wordmark, Logo, HeroToolkitTile, AudienceStrip, ProofShop, ProofQuote, HowStep, FaqItem, Faq, Compatibility });

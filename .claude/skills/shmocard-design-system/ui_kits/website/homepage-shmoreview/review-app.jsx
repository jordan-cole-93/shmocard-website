// review-app.jsx — orchestrator for the Shmo Review category page
const { useState: useStateApp, useEffect: useEffectApp } = React;

function ReviewNav({ cartCount, onCartClick }) {
  return (
    <header className="shm-nav" id="top">
      <div className="shm-container nav-inner">
        <Logo size={26} />
        <nav className="nav-links" aria-label="Primary">
          <a className="nav-link nav-link--active" href="/shmo-review">
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
          <button className="nav-cart" aria-label={`Cart, ${cartCount} items`} onClick={onCartClick}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 7h14l-1.5 9.2a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7Z"/>
              <path d="M9 7V5.5a3 3 0 0 1 6 0V7"/>
            </svg>
            {cartCount > 0 && <span className="nav-cart__count">{cartCount}</span>}
          </button>
          <a className="shm-btn shm-btn--primary shm-btn--sm" href="#buybox">Shop →</a>
        </div>
      </div>
    </header>
  );
}

function ReviewFooter() {
  return (
    <footer className="footer" data-screen-label="11 Footer">
      <div className="shm-container">
        <div className="footer-grid">
          <div className="footer-col">
            <span className="footer-mark">
              <img src="assets/mascot/wordmark-smore.png" alt="" />
              <span><span className="wm-shmo">Shmo</span><span className="wm-card">Card</span></span>
            </span>
            <p className="footer-tagline">A family of NFC tools built for local shop crews. One brand. One dashboard. One-time card purchase.</p>
            <div style={{display: "flex", gap: 10}}>
              <a href="#" aria-label="Instagram" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:999,border:"1px solid rgba(255,251,241,0.18)"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"/></svg>
              </a>
              <a href="#" aria-label="Facebook" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:999,border:"1px solid rgba(255,251,241,0.18)"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:999,border:"1px solid rgba(255,251,241,0.18)"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 8s-.2-1.5-.8-2.2c-.8-.9-1.7-.9-2.1-1C16 4.5 12 4.5 12 4.5s-4 0-7.1.3c-.4.1-1.3.1-2.1 1C2.2 6.5 2 8 2 8s-.2 1.7-.2 3.4v1.6c0 1.7.2 3.4.2 3.4s.2 1.5.8 2.2c.8.9 1.9.9 2.4 1 1.7.2 7.3.3 7.3.3s4 0 7.1-.3c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.2.8-2.2s.2-1.7.2-3.4v-1.6C22.2 9.7 22 8 22 8z"/><polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              <li><a href="/shmo-review">Shmo Review</a></li>
              <li><a href="#biz">Shmo Biz <span className="footer-soon">Soon</span></a></li>
              <li><a href="#link">Shmo Link <span className="footer-soon">Soon</span></a></li>
              <li><a href="#reputation">Shmo Reputation <span className="footer-soon">Soon</span></a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#buybox">CR-80 Card</a></li>
              <li><a href="#formats">L-Sign</a></li>
              <li><a href="#formats">Square Card</a></li>
              <li><a href="#formats">Key Tag</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><a href="#how">How it works</a></li>
              <li><a href="#">Shipping &amp; returns</a></li>
              <li><a href="#">Contact support</a></li>
              <li><a href="#">hello@shmocard.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© ShmoCard 2026 · Built for crews. Priced for bulk.</span>
          <span><a href="#">Privacy</a> · <a href="#">Terms</a></span>
        </div>
      </div>
    </footer>
  );
}

function ReviewApp() {
  const [cartItems, setCartItems] = useStateApp([]);
  const [cartOpen, setCartOpen] = useStateApp(false);

  function handleAddToCart(item) {
    setCartItems(prev => [...prev, item]);
    setCartOpen(true);
  }
  function handleRemove(idx) {
    setCartItems(prev => prev.filter((_, i) => i !== idx));
  }
  function handleQty(idx, newQty) {
    if (newQty < 1) return;
    setCartItems(prev => prev.map((it, i) =>
      i === idx ? { ...it, qty: newQty, total: it.unit * newQty } : it
    ));
  }

  const cartCount = cartItems.reduce((s, it) => s + it.qty, 0);

  return (
    <>
      <ReviewNav cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <main>
        <ReviewHero />
        <ReviewBulletStrip />
        <ReviewBuybox onAddToCart={handleAddToCart} />
        <FormatPicker />
        <HowItWorks />
        <StandoutMoments />
        <NumbersWall />
        <Objections />
        <ShipReturns />
        <ReviewFaq />
        <FinalCta />
      </main>

      <ReviewFooter />

      <ReviewCart
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemove={handleRemove}
        onQty={handleQty}
      />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ReviewApp />);

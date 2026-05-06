// home-app.jsx — orchestrator

const { useState: useStateA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroPrimaryCta": "Shop Shmo Review →",
  "heroSecondaryCta": "Browse the toolkit",
  "showHandNote": true,
  "subBrandOrder": "default"
}/*EDITMODE-END*/;

function HomeApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [modalProduct, setModalProduct] = useStateA(null);
  const openModal = (product) => setModalProduct(product);
  const closeModal = () => setModalProduct(null);

  const order = t.subBrandOrder === "review-last"
    ? [SUB_BRANDS[1], SUB_BRANDS[2], SUB_BRANDS[3], SUB_BRANDS[0]]
    : SUB_BRANDS;

  return (
    <>
      <Nav cartCount={2} />

      {/* HERO — marshmallow */}
      <section className="shm-section shm-bg-marsh hero" data-screen-label="01 Hero">
        <div className="shm-container">
          <span className="shm-eyebrow hero-eyebrow">A toolkit for local crews</span>
          <h1 className="shm-display">The toolkit your crew's been <em>missing</em>.</h1>
          <p className="shm-lede hero-lede">
            Four NFC tools, one brand, one dashboard. Tap a card, post a review, share a contact, jump to a link hub, or auto-respond to every Google review. No app. No login. No friction for your customers.
          </p>
          <div className="hero-cta-row">
            <a className="shm-btn shm-btn--primary shm-btn--lg" href="/shmo-review">{t.heroPrimaryCta}</a>
            <a className="shm-btn shm-btn--ghost shm-btn--lg" href="#review">{t.heroSecondaryCta}</a>
          </div>
          {t.showHandNote && (
            <div className="hero-meta">
              <span className="hand-note">
                <svg viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 12 Q 8 4, 16 12 T 30 8" /><path d="M26 4 L30 8 L26 12" /></svg>
                Live now — Shmo Review
              </span>
              <span className="dot"></span>
              <span>3 more tools coming this year</span>
            </div>
          )}
        </div>

        <div className="hero-stage" aria-hidden="false">
          <div className="hero-toolkit">
            <HeroToolkitTile
              name={<>Shmo <em>Review</em></>}
              sub="Tap-to-review NFC card"
              status="live"
              art="assets/mascot/review-phone.png"
            />
            <HeroToolkitTile
              name={<>Shmo <em>Biz</em></>}
              sub="NFC business card"
              status="soon"
              art="assets/mascot/holding-card.png"
            />
            <HeroToolkitTile
              name={<>Shmo <em>Link</em></>}
              sub="Link-in-bio for shops"
              status="soon"
              art="assets/mascot/heart-hands.png"
            />
            <HeroToolkitTile
              name={<>Shmo <em>Reputation</em></>}
              sub="AI review responder"
              status="soon"
              art="assets/mascot/megaphone.png"
            />
          </div>
        </div>
      </section>
      <Wave to="graham" />

      {/* AUDIENCE STRIP — graham */}
      <section className="shm-bg-graham" data-screen-label="02 Audience">
        <AudienceStrip />
      </section>
      <Wave to="marsh" />

      {/* PROOF — marshmallow */}
      <section className="shm-section shm-bg-marsh" data-screen-label="03 Proof">
        <div className="shm-container">
          <div className="shm-section-head">
            <span className="shm-eyebrow">Real shops · real numbers</span>
            <h2 className="shm-h2">Crews using ShmoCard. <em>Right now.</em></h2>
          </div>
          <div className="proof-grid">
            <div className="proof-quotes">
              {QUOTES.map((q, i) => <ProofQuote key={i} quote={q} />)}
            </div>
            <div className="proof-shops">
              {SHOPS.map((s, i) => <ProofShop key={i} shop={s} />)}
            </div>
          </div>
          <p className="proof-foot">Verified review-volume increases reported by Shmo Review customers.</p>
        </div>
      </section>
      <Wave to={order[0].bg === "shm-bg-graham" ? "graham" : (order[0].bg === "shm-bg-cocoa" ? "cocoa" : "marsh")} />

      {/* SUB-BRAND SEQUENCE */}
      {order.map((data, i) => {
        const next = order[i + 1];
        // Wave color = current (outgoing) section bg, flipped so it peeks up from below
        const curBg = data.bg === "shm-bg-graham" ? "graham" :
                      data.bg === "shm-bg-cocoa" ? "cocoa" : "marsh";
        const nextBg = next ? (
          next.bg === "shm-bg-graham" ? "graham" :
          next.bg === "shm-bg-cocoa" ? "cocoa" : "marsh"
        ) : "marsh";
        // Pick whichever side is more saturated for visible contrast
        const waveTo = (curBg === "marsh" && nextBg === "marsh") ? "graham" :
                       (curBg === "graham" && nextBg === "marsh") ? "graham" :
                       nextBg;
        // After Shmo Review (the first live product, id="review"), insert the crew UGC strip
        const insertCrewAfter = data.id === "review";
        return (
          <React.Fragment key={data.id}>
            <SubBrandSpotlight data={data} idx={i} openModal={openModal} />
            {insertCrewAfter && <CrewStrip />}
            <Wave to={waveTo} flip={curBg === "graham" && nextBg === "marsh"} />
          </React.Fragment>
        );
      })}

      {/* HOW IT WORKS — marshmallow */}
      <section className="shm-section shm-bg-marsh" id="how" data-screen-label="08 How it works">
        <div className="shm-container">
          <div className="shm-section-head">
            <span className="shm-eyebrow">How it works</span>
            <h2 className="shm-h2">Right tool. Right hand. <em>Right moment.</em></h2>
            <p className="shm-lede">The bet is simple: every problem of asking is a hardware problem. Give the crew something to hand over, and the ask happens.</p>
          </div>
          <div className="how-grid">
            {HOW_STEPS.map((s, i) => <HowStep key={i} step={s} />)}
          </div>
        </div>
      </section>

      <VideoTestimonials />
      <Wave to="graham" />

      {/* COMPAT BAND — graham */}
      <section className="shm-bg-graham" data-screen-label="09 Compatibility">
        <Compatibility />
      </section>
      <Wave to="marsh" />

      {/* FAQ — marshmallow */}
      <section className="shm-section shm-bg-marsh" data-screen-label="10 FAQ">
        <div className="shm-container">
          <div className="shm-section-head">
            <span className="shm-eyebrow">Frequently asked</span>
            <h2 className="shm-h2">Questions, answered <em>plainly</em>.</h2>
          </div>
          <Faq items={FAQ} />
        </div>
      </section>
      <Wave to="ember" />

      {/* FINAL CTA — ember */}
      <section className="shm-section shm-bg-ember" data-screen-label="11 Final CTA">
        <div className="shm-container final-cta">
          <span className="shm-eyebrow">Ready to ship</span>
          <h2 className="shm-h1">Pick a card. Pick a kit. <em>Or build your own.</em></h2>
          <p className="final-cta-lede">
            Orders placed by Tuesday ship Friday — your crew taps for five-stars by next Monday.
          </p>
          <div className="final-cta-row">
            <a className="shm-btn shm-btn--cream shm-btn--lg" href="/shmo-review">Shop the cards →</a>
            <a className="shm-btn shm-btn--ghost shm-btn--lg" href="/shmo-review#bundles">Browse bundles</a>
          </div>
        </div>
      </section>
      <Wave to="cocoa" />

      {/* FOOTER — cocoa */}
      <footer className="footer" data-screen-label="12 Footer">
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
                <li><a href="/shmo-review/cr-80">CR-80 Card</a></li>
                <li><a href="/shmo-review/l-sign">L-Sign</a></li>
                <li><a href="/shmo-review/square-card">Square Card</a></li>
                <li><a href="/shmo-review#bundles">Bundles</a></li>
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

      <WaitlistModal open={!!modalProduct} product={modalProduct} onClose={closeModal} />

      <TweaksPanel>
        <TweakSection label="Hero CTAs" />
        <TweakText label="Primary CTA" value={t.heroPrimaryCta} onChange={(v) => setTweak('heroPrimaryCta', v)} />
        <TweakText label="Secondary CTA" value={t.heroSecondaryCta} onChange={(v) => setTweak('heroSecondaryCta', v)} />
        <TweakSection label="Hero accent" />
        <TweakToggle label="Show hand-note under hero" value={t.showHandNote} onChange={(v) => setTweak('showHandNote', v)} />
        <TweakSection label="Sub-brand order" />
        <TweakRadio
          label="Order"
          value={t.subBrandOrder}
          options={["default", "review-last"]}
          onChange={(v) => setTweak('subBrandOrder', v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<HomeApp />);

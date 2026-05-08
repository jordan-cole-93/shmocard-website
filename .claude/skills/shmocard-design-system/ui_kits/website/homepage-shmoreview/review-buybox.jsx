// review-buybox.jsx — CR-80 buy box (PDP-style)
const { useState: useStateB, useRef: useRefB } = React;

function ReviewBuybox({ onAddToCart }) {
  const [activeIdx, setActiveIdx] = useStateB(0);
  const [packIdx, setPackIdx] = useStateB(3); // 10-pack default (most popular)
  const [qty, setQty] = useStateB(1);
  const [gInput, setGInput] = useStateB("");
  const [faqOpen, setFaqOpen] = useStateB(-1);

  const galleryThumbs = [
  { src: "assets/products/cr80-flat-pair.png", thumb: "assets/products/cr80-flat-pair.png" },
  { src: "assets/products/cr80-trio.png", thumb: "assets/products/cr80-trio.png" },
  { src: "assets/lifestyle/lifestyle-1.jpg", thumb: "assets/lifestyle/lifestyle-1.jpg" },
  { src: "assets/lifestyle/lifestyle-2.jpg", thumb: "assets/lifestyle/lifestyle-2.jpg" },
  { src: "assets/lifestyle/lifestyle-3.jpg", thumb: "assets/lifestyle/lifestyle-3.jpg" },
  { src: "assets/lifestyle/lifestyle-4.jpg", thumb: "assets/lifestyle/lifestyle-4.jpg" }];


  const pack = REVIEW_PACKS[packIdx];
  const lineTotal = (pack.price * qty).toFixed(2);

  const faqRows = [
  { q: "How it works", a: "Customer taps the card. Their phone opens your Google review page. They post — done." },
  { q: "Shipping", a: "Order by Tuesday 5pm CT, ships Friday. 3-day standard. Free expedited on 10+ packs." },
  { q: "60-day return + reprogramming guarantee", a: "Don't love it? Return for full refund within 60 days. Reprogram destination URL anytime." },
  { q: "Product details", a: "CR-80 / 85.6×54mm / 0.76mm PVC. NTAG 215 NFC chip. QR fallback printed on back. Hand-printed in Minneapolis." }];


  function handleAdd() {
    onAddToCart && onAddToCart({
      id: "cr80",
      name: "Google Review NFC Tap Card (CR-80)",
      packLabel: `${pack.qty}-pack`,
      qty,
      unit: pack.price,
      total: parseFloat(lineTotal),
      art: galleryThumbs[0].thumb,
      gInput: gInput.trim() || null
    });
  }

  return (
    <>
    <section className="shm-section shm-bg-marsh review-buybox" id="buybox" data-screen-label="03b CR-80 Buybox" style={{ margin: "0px", padding: "90px 0px 0" }}>
      <div className="shm-container">
        <div className="shm-section-head shm-section-head--start">
          <span className="shm-eyebrow">★ Best seller · CR-80</span>
          <h2 className="shm-h2">Get the card the crews <em>actually</em> reach for.</h2>
        </div>

        <div className="pdp-buybox">
          {/* Gallery */}
          <div className="gal">
            <div className="gal__main">
              <img src={galleryThumbs[activeIdx].src} alt="Google Review NFC Tap Card" />
            </div>
            <div className="gal__thumbs">
              {galleryThumbs.map((t, i) =>
              <button
                key={i}
                className={`gal__thumb${activeIdx === i ? ' is-active' : ''}`}
                onClick={() => setActiveIdx(i)}
                aria-label={`View image ${i + 1}`}>
                
                  <img src={t.thumb} alt="" />
                </button>
              )}
            </div>
          </div>

          {/* Buybox column */}
          <div className="bb">
            <div className="shm-rating">
              <span className="shm-rating__stars">
                {[0, 1, 2, 3, 4].map((i) =>
                <svg key={i} viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" /></svg>
                )}
              </span>
              <span className="shm-rating__num">4.9</span>
              <span className="shm-rating__count">· 87 verified reviews</span>
            </div>

            <h3 className="bb__title">Google Review NFC Tap Card (CR-80)</h3>
            <p className="bb__sub"><em>The countertop tap that turns happy crews into five-star reviews.</em></p>

            <hr className="bb__rule" />

            <ul className="shm-checklist shm-checklist--featured">
              <li>Hand-printed in Minneapolis on premium PVC stock</li>
              <li>Pre-programmed to your Google review link before shipping</li>
              <li>Works on every modern phone — no app, no download</li>
              <li>60-day reprogramming + return guarantee</li>
            </ul>

            {/* Pack selector */}
            <fieldset className="shm-pack-rows">
              <legend className="shm-pack-rows__label">Choose your pack</legend>
              {REVIEW_PACKS.map((p, i) =>
              <label
                className={`shm-pack-row${packIdx === i ? ' shm-pack-row--checked' : ''}${p.pop ? ' shm-pack-row--pop' : ''}`}
                key={i}>
                
                  {p.pop && <span className="shm-pack-row__pop shm-badge shm-badge--ember">Most popular</span>}
                  <span className="shm-pack-row__thumb">
                    <img src={p.qty >= 5 ? "assets/products/cr80-trio.png" : "assets/products/cr80-flat-pair.png"} alt="" />
                  </span>
                  <span className="shm-pack-row__main">
                    <span className="shm-pack-row__name">
                      {p.qty} Card{p.qty > 1 ? 's' : ''}
                      {p.save && <span className="shm-badge shm-badge--honey" style={{ marginLeft: '8px' }}>SAVE {p.save}</span>}
                    </span>
                    {p.note &&
                  <span className="shm-pack-row__note">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="13" height="8" rx="1" /><path d="M16 11h4l1 2v3h-5" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>
                        {p.note}
                      </span>
                  }
                  </span>
                  <span className="shm-pack-row__price">
                    <span className="shm-pack-row__price-now">${p.price.toFixed(2)}</span>
                    {p.qty > 1 &&
                  <span className="shm-pack-row__price-meta">
                        ${p.perCard.toFixed(2)} / card
                        {p.compare && <> · <s>${p.compare.toFixed(2)}</s></>}
                      </span>
                  }
                  </span>
                  <input
                  type="radio"
                  name="pack"
                  checked={packIdx === i}
                  onChange={() => setPackIdx(i)} />
                
                </label>
              )}
            </fieldset>

            {/* Free shipping callout — only for qualifying packs */}
            {pack.price >= 55 &&
            <div className="shm-callout shm-callout--success">
                <span className="shm-callout__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span>
                  <span className="shm-callout__title">Free shipping included</span>
                  <span className="shm-callout__sub">On all orders over $55.00</span>
                </span>
              </div>
            }

            {/* Quantity */}
            <div className="qty-block">
              <span className="qty-label">Quantity</span>
              <div className="shm-qty" role="group" aria-label="Quantity">
                <button type="button" className="shm-qty__btn" disabled={qty <= 1} onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </button>
                <span className="shm-qty__val">{qty}</span>
                <button type="button" className="shm-qty__btn" disabled={qty >= 99} onClick={() => setQty(Math.min(99, qty + 1))} aria-label="Increase">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><line x1="12" y1="5" x2="12" y2="19" /></svg>
                </button>
              </div>
            </div>

            {/* Configure (Google input) */}
            <div className="config">
              <span className="config__label">Configure (optional)</span>
              <div className="shm-google">
                <span className="shm-google__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M21.35 11.1H12v3.83h5.51c-.25 1.37-1.5 4-5.51 4-3.31 0-6.01-2.74-6.01-6.12 0-3.38 2.7-6.13 6.01-6.13 1.88 0 3.14.8 3.86 1.49l2.63-2.55C16.85 4.06 14.65 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.65-3.65 8.65-8.78 0-.59-.06-1.04-.13-1.5z" fill="#EA4335" />
                    <path d="M21.35 11.1H12v3.83h5.51a5.61 5.61 0 0 1-2.4 3.66l3.86 2.99c2.25-2.08 3.55-5.13 3.55-8.98 0-.59-.06-1.04-.13-1.5z" fill="#4285F4" />
                    <path d="M5.99 14.32a5.99 5.99 0 0 1 0-4.64L2.13 6.69a9 9 0 0 0 0 10.62l3.86-2.99z" fill="#FBBC05" />
                    <path d="M12 21c2.65 0 4.85-.87 6.47-2.42l-3.86-2.99c-1.05.7-2.42 1.18-3.61 1.18-2.78 0-5.13-1.84-5.97-4.45L2.13 14.3C3.92 18.27 7.65 21 12 21z" fill="#34A853" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="shm-google__input"
                  placeholder="Find your business on Google"
                  value={gInput}
                  onChange={(e) => setGInput(e.target.value)} />
                
              </div>
              <div className="config__hint">Found us? We'll pre-program your card before it ships. Skip and configure after delivery.</div>
            </div>

            <button className="bb__cta shm-btn shm-btn--primary shm-btn--xl" onClick={handleAdd}>
              Add to cart — ${lineTotal}
            </button>
            <div className="bb__meta">
              <span>60-day return</span><span>Ships in 3 days</span>
            </div>

            <ul className="shm-faq-list" style={{ marginTop: '14px' }}>
              {faqRows.map((row, i) =>
              <li className={`shm-faq-item${faqOpen === i ? ' shm-faq-item--open' : ''}`} key={i}>
                  <button
                  type="button"
                  className="shm-faq-trigger"
                  aria-expanded={faqOpen === i}
                  onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>
                  
                    <span className="shm-faq-question">{row.q}</span>
                    <span className="shm-faq-icon">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <line x1="10" y1="4" x2="10" y2="16" />
                        <line x1="4" y1="10" x2="16" y2="10" />
                      </svg>
                    </span>
                  </button>
                  {faqOpen === i && <div className="shm-faq-answer">{row.a}</div>}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
    </>);

}

Object.assign(window, { ReviewBuybox });
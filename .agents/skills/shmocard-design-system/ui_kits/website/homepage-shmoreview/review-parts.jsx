// review-parts.jsx — Shmo Review category page parts.
// All components are exported on window for cross-script scope.

const { useState: useStateR, useEffect: useEffectR, useRef: useRefR } = React;

/* ────────────────────────────────────────────────────────────
   HERO — mirrors home hero rhythm: eyebrow → headline → lede →
   CTA row → meta. Headline is locked. Hero image is a placeholder
   under the text.
   ──────────────────────────────────────────────────────────── */
function ReviewHero() {
  return (
    <section className="review-hero" data-screen-label="01 Hero" style={{ backgroundColor: "rgb(255, 251, 241)" }}>
      <div className="shm-container review-hero__inner">
        <span className="shm-eyebrow">Shmo Review · NFC tap cards</span>
        <h1 className="shm-display review-hero__h">
          Built for crews.<br />
          Priced for <em>bulk</em>
          <img
            src="assets/mascot/holding-card.png"
            alt=""
            className="review-hero__sticker"
            style={{ "--mascot-fit-ratio": 1.1 }} />
          .
        </h1>
        <p className="shm-lede review-hero__lede">
          Pre-programmed NFC review cards, signs, and discs. Hand one over after every transaction — your customer taps, leaves a five-star review, and you climb the rankings. No app, no login, no friction.
        </p>
        <div className="review-hero__cta-row">
          <a className="shm-btn shm-btn--primary shm-btn--lg" href="#buybox">Shop the cards →</a>
          <a className="shm-btn shm-btn--ghost shm-btn--lg" href="#how">See how it works</a>
        </div>
        <div className="review-hero__meta">
          <span className="shm-rating">
            <span className="shm-rating__stars">
              {[0, 1, 2, 3, 4].map((i) =>
              <svg key={i} viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" /></svg>
              )}
            </span>
            <span className="shm-rating__num">4.9</span>
            <span className="shm-rating__count">· 87 verified reviews</span>
          </span>
          <span className="dot"></span>
          <span>Ships in 3 days · 60-day return</span>
        </div>

        <div className="review-hero__strip">
          <image-slot
            id="review-hero-strip"
            shape="rounded"
            radius="22"
            placeholder="Wide hero photo — three CR-80 cards on a counter"
            style={{ width: "100%", height: "100%", display: "block" }}>
          </image-slot>
        </div>
      </div>
      <Wave to="graham" />
    </section>);

}

/* ────────────────────────────────────────────────────────────
   BULLET STRIP — 4 quick promises. Graham. Wave OUT to marsh.
   ──────────────────────────────────────────────────────────── */
function ReviewBulletStrip() {
  return (
    <>
      <section className="shm-section shm-bg-graham bullet-strip" data-screen-label="02 Trust strip" style={{ padding: "64px 0px 0px", margin: "0px 0px 3.35938px" }}>
        <div className="shm-container" style={{ margin: "-32.5195px 278px 33.0586px" }}>
          <div className="bullet-strip__grid">
            {REVIEW_BULLETS.map((b, i) =>
            <div className="bullet-strip__item" key={i}>
                <div className="bullet-strip__stat">{b.stat}</div>
                <div className="bullet-strip__stat-label">{b.statLabel}</div>
                <div className="bullet-strip__title">{b.title}</div>
                <p className="bullet-strip__body">{b.body}</p>
              </div>
            )}
          </div>
        </div>
        <Wave to="marsh" />
      </section>
    </>);

}

/* ────────────────────────────────────────────────────────────
   FORMAT PICKER — graham. Wave OUT to cocoa (tall).
   ──────────────────────────────────────────────────────────── */
function FormatPicker() {
  return (
    <section className="shm-section shm-bg-marsh format-picker" id="formats" data-screen-label="03 Format picker">
      <div className="shm-container">
        <div className="shm-section-head">
          <span className="shm-eyebrow">Four formats · same chip · same dashboard</span>
          <h2 className="shm-h2">Pick the shape that <em>fits</em> your shop.</h2>
          <p className="shm-lede">All four use the same reprogrammable NFC chip and ship pre-loaded with your Google review link. Mix and match — discounts stack across the whole order.</p>
        </div>
        <div className="format-grid">
          {REVIEW_FORMATS.map((f) =>
          <a className={`format-card format-card--${f.tone}`} href={f.href} key={f.id}>
              {f.badge && <span className={`shm-badge ${f.badge === 'Best seller' ? 'shm-badge--ember' : 'shm-badge--honey'} format-card__badge`}>{f.badge}</span>}
              <div className="format-card__media">
                <image-slot
                id={`format-${f.id}`}
                shape="rounded"
                radius="14"
                placeholder={`${f.name} photo`}
                style={{ width: "100%", height: "100%", display: "block" }}>
              </image-slot>
              </div>
              <div className="format-card__body">
                <div className="format-card__name">{f.name}</div>
                <div className="format-card__sub">{f.sub}</div>
                <p className="format-card__blurb">{f.blurb}</p>
                <div className="format-card__foot">
                  <span className="format-card__price">{f.price}</span>
                  <span className="format-card__price-meta">{f.priceMeta}</span>
                </div>
              </div>
              <span className="format-card__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </a>
          )}
        </div>
      </div>
    </section>);

}

/* ────────────────────────────────────────────────────────────
   HOW IT WORKS — sticky scroll-driven phone. Phone stays put on
   the left while text steps scroll past on the right. The phone
   screen swaps based on which step is in view.
   ──────────────────────────────────────────────────────────── */
function HowPhoneScreen({ which }) {
  // Static SVG/HTML phone screens — no images needed
  if (which === "handoff") {
    return (
      <div className="phone-screen phone-screen--handoff">
        <div className="phone-screen__hand">
          <div className="phone-screen__card">
            <div className="phone-screen__card-logo">SHOP</div>
            <div className="phone-screen__card-name">Tap to leave a review</div>
            <div className="phone-screen__card-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c2.5-2.5 5-2.5 7.5 0M5 16c1-1 2-1 3 0M2 8c4-4 8-4 12 0M5 4c2-2 4-2 6 0" /></svg>
            </div>
          </div>
        </div>
        <div className="phone-screen__caption">Handing over the card</div>
      </div>);

  }
  if (which === "tap") {
    return (
      <div className="phone-screen phone-screen--tap">
        <div className="phone-tap-indicator">
          <span className="phone-tap-indicator__dot"></span>
          <span className="phone-tap-indicator__ring"></span>
          <span className="phone-tap-indicator__ring phone-tap-indicator__ring--2"></span>
        </div>
        <div className="phone-screen__notif">
          <div className="phone-screen__notif-bar">
            <span className="phone-screen__notif-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 4v16M4 12h16" /></svg>
            </span>
            <div>
              <div className="phone-screen__notif-title">Open in Safari</div>
              <div className="phone-screen__notif-sub">g.page/shop-name/review</div>
            </div>
          </div>
        </div>
        <div className="phone-screen__caption">Tap detected · opening</div>
      </div>);

  }
  if (which === "review") {
    return (
      <div className="phone-screen phone-screen--review">
        <div className="phone-review-card">
          <div className="phone-review-card__head">
            <div className="phone-review-card__shop">Your Shop</div>
            <div className="phone-review-card__addr">123 Main St · Open now</div>
          </div>
          <div className="phone-review-card__rate">
            <div className="phone-review-card__label">Rate your experience</div>
            <div className="phone-review-card__stars">
              {[0, 1, 2, 3, 4].map((i) =>
              <svg key={i} viewBox="0 0 24 24" className="phone-review-card__star"><path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" /></svg>
              )}
            </div>
          </div>
          <div className="phone-review-card__textbox">
            <span className="phone-review-card__placeholder">Tell others what you liked…</span>
          </div>
          <div className="phone-review-card__post">Post review</div>
        </div>
        <div className="phone-screen__caption">Google review form</div>
      </div>);

  }
  // submitted
  return (
    <div className="phone-screen phone-screen--submitted">
      <div className="phone-submitted">
        <div className="phone-submitted__check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div className="phone-submitted__title">Posted</div>
        <div className="phone-submitted__sub">Thanks for the 5-star review!</div>
        <div className="phone-submitted__stars">
          {[0, 1, 2, 3, 4].map((i) =>
          <svg key={i} viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" /></svg>
          )}
        </div>
      </div>
      <div className="phone-screen__caption">Five stars · one sentence</div>
    </div>);

}

function HowItWorks() {
  const [activeIdx, setActiveIdx] = useStateR(0);
  const stepRefs = useRefR([]);

  useEffectR(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = parseInt(e.target.dataset.idx, 10);
            setActiveIdx(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.01 }
    );
    stepRefs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  const active = REVIEW_HOW_STEPS[activeIdx];

  return (
    <section className="shm-section shm-bg-marsh how-section" id="how" data-screen-label="04 How it works">
      <div className="shm-container">
        <div className="shm-section-head">
          <span className="shm-eyebrow">How it works · 4 steps · ~12 seconds</span>
          <h2 className="shm-h2">From handoff to <em>five stars</em>, in one tap.</h2>
        </div>

        <div className="how-stage">
          <div className="how-stage__phone-col">
            <div className="how-stage__phone-sticky">
              <div className="phone-frame">
                <div className="phone-frame__notch"></div>
                <div className="phone-frame__screen">
                  <HowPhoneScreen which={active.screen} />
                </div>
                <div className="phone-frame__home"></div>
              </div>
              <div className="how-stage__progress">
                {REVIEW_HOW_STEPS.map((_, i) =>
                <div key={i} className={`how-stage__pip${i === activeIdx ? ' is-active' : ''}`}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <ol className="how-stage__steps">
            {REVIEW_HOW_STEPS.map((s, i) =>
            <li
              key={i}
              ref={(el) => stepRefs.current[i] = el}
              data-idx={i}
              className={`how-stage__step${i === activeIdx ? ' is-active' : ''}`}>
              
                <div className="how-stage__step-num">{s.n}</div>
                <h3 className="how-stage__step-title">{s.title}</h3>
                <p className="how-stage__step-body">{s.body}</p>
              </li>
            )}
          </ol>
        </div>
      </div>
      <div className="shm-wave shm-wave--marsh" aria-hidden="true"></div>
    </section>);

}

/* ────────────────────────────────────────────────────────────
   STANDOUT MOMENTS — 3 hero stat cards (Allan 80+, Carly 14, Marshall 5)
   ──────────────────────────────────────────────────────────── */
function StandoutMoments() {
  return (
    <section className="shm-section shm-bg-marsh standout" data-screen-label="05 Standout moments">
      <div className="shm-container">
        <div className="shm-section-head">
          <span className="shm-eyebrow">Standout moments</span>
          <h2 className="shm-h2">What happens when crews <em>actually</em> hand them over.</h2>
          <p className="shm-lede">Three weeks. Three crews. Three numbers we couldn't have predicted.</p>
        </div>
        <div className="standout-grid">
          {REVIEW_STANDOUT.map((s, i) =>
          <article className={`standout-card standout-card--${s.tone}`} key={i}>
              <div className="standout-card__big">{s.big}</div>
              <div className="standout-card__metric">{s.metric}</div>
              <blockquote className="standout-card__quote">"{s.quote}"</blockquote>
              <figcaption className="standout-card__attr">
                <b>{s.person}</b>
                <span>{s.shop}</span>
              </figcaption>
            </article>
          )}
        </div>
      </div>
      <div className="shm-wave shm-wave--marsh" aria-hidden="true"></div>
    </section>);

}

/* ────────────────────────────────────────────────────────────
   NUMBERS WALL — 8 verified shop % increases. Animated bar chart on scroll.
   ──────────────────────────────────────────────────────────── */
function NumbersWall() {
  const [revealed, setRevealed] = useStateR(false);
  const wallRef = useRefR(null);

  useEffectR(() => {
    const el = wallRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const max = 100; // for bar widths
  return (
    <section className="shm-section shm-bg-marsh numbers-wall" id="numbers" data-screen-label="06 Numbers wall" ref={wallRef}>
      <div className="shm-container">
        <div className="shm-section-head">
          <span className="shm-eyebrow">Verified · across 8 shops · 8 industries</span>
          <h2 className="shm-h2">Real shops. Real <em>review-volume</em> increases.</h2>
          <p className="shm-lede">Reported by Shmo Review customers in their first 90 days. The shop with the lowest lift still doubled their monthly review pace.</p>
        </div>

        <div className="numbers-list">
          {REVIEW_NUMBERS.map((n, i) => {
            const pct = parseInt(n.inc.replace(/[^0-9]/g, ''), 10);
            const width = revealed ? `${pct / max * 100}%` : '0%';
            return (
              <div className="numbers-row" key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="numbers-row__shop">
                  <span className="numbers-row__name">{n.shop}</span>
                  <span className="numbers-row__owner">{n.owner} · {n.note}</span>
                </div>
                <div className="numbers-row__bar">
                  <div className="numbers-row__bar-fill" style={{ width, transitionDelay: `${i * 80}ms` }}></div>
                </div>
                <div className="numbers-row__inc">{n.inc}</div>
              </div>);

          })}
        </div>
        <p className="numbers-foot">Verified review-volume increases reported by Shmo Review customers · first 90 days post-install.</p>
      </div>
      <div className="shm-wave shm-wave--cocoa shm-wave--lg" aria-hidden="true"></div>
    </section>);

}

/* ────────────────────────────────────────────────────────────
   OBJECTIONS — 4 cards in cocoa. "But we already ask for reviews."
   ──────────────────────────────────────────────────────────── */
function Objections() {
  return (
    <section className="shm-section shm-bg-cocoa objections" data-screen-label="07 Objections">
      <div className="shm-container">
        <div className="shm-section-head">
          <span className="shm-eyebrow">Objections, answered</span>
          <h2 className="shm-h2">"But we already <em>ask</em>."</h2>
          <p className="shm-lede">Every objection we hear, in the order we hear it.</p>
        </div>
        <div className="objections-grid">
          {REVIEW_OBJECTIONS.map((o, i) =>
          <article className="objection-card" key={i}>
              <div className="objection-card__num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="objection-card__q">{o.q}</h3>
              <p className="objection-card__a">{o.a}</p>
            </article>
          )}
        </div>
      </div>
      <div className="shm-wave shm-wave--marsh shm-wave--lg" aria-hidden="true"></div>
    </section>);

}

/* ────────────────────────────────────────────────────────────
   SHIP & RETURNS strip
   ──────────────────────────────────────────────────────────── */
function ShipReturns() {
  return (
    <section className="shm-bg-graham ship-returns" data-screen-label="08 Ship & returns">
      <div className="shm-container ship-returns__inner">
        <div className="ship-returns__item">
          <span className="ship-returns__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="8" width="13" height="9" rx="1.5" /><path d="M15 11h4l2 3v3h-6" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg>
          </span>
          <div>
            <div className="ship-returns__title">Ships in 3 days</div>
            <div className="ship-returns__sub">Order by Tuesday · ships Friday</div>
          </div>
        </div>
        <div className="ship-returns__item">
          <span className="ship-returns__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 4 3 10 9 10" /></svg>
          </span>
          <div>
            <div className="ship-returns__title">60-day returns</div>
            <div className="ship-returns__sub">Box it back, refund in full</div>
          </div>
        </div>
        <div className="ship-returns__item">
          <span className="ship-returns__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></svg>
          </span>
          <div>
            <div className="ship-returns__title">Reprogrammable for life</div>
            <div className="ship-returns__sub">Change destination anytime</div>
          </div>
        </div>
        <div className="ship-returns__item">
          <span className="ship-returns__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" /><path d="M9 12l2 2 4-4" /></svg>
          </span>
          <div>
            <div className="ship-returns__title">Free bulk shipping</div>
            <div className="ship-returns__sub">10+ cards ship free expedited</div>
          </div>
        </div>
      </div>
    </section>);

}

/* ────────────────────────────────────────────────────────────
   FAQ — 6 questions. Reuses .shm-faq-list--hard for chunky cards.
   ──────────────────────────────────────────────────────────── */
function ReviewFaq() {
  const [openIdx, setOpenIdx] = useStateR(0);
  return (
    <section className="shm-section shm-bg-marsh review-faq" data-screen-label="09 FAQ">
      <div className="shm-container">
        <div className="shm-section-head">
          <span className="shm-eyebrow">FAQ</span>
          <h2 className="shm-h2">Questions, answered <em>plainly</em>.</h2>
        </div>
        <div className="review-faq__wrap">
          <ul className="shm-faq-list shm-faq-list--hard">
            {REVIEW_FAQ.map((it, i) =>
            <li className={`shm-faq-item${openIdx === i ? ' shm-faq-item--open' : ''}`} key={i}>
                <button
                className="shm-faq-trigger"
                aria-expanded={openIdx === i}
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
                
                  <span className="shm-faq-question">{it.q}</span>
                  <span className="shm-faq-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {openIdx === i && <div className="shm-faq-answer">{it.a}</div>}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="shm-wave shm-wave--ember shm-wave--lg" aria-hidden="true"></div>
    </section>);

}

/* ────────────────────────────────────────────────────────────
   FINAL CTA — ember slab, "Shop the cards" + secondary
   ──────────────────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section className="shm-section shm-bg-ember review-final-cta" data-screen-label="10 Final CTA">
      <div className="shm-container final-cta">
        <span className="shm-eyebrow" style={{ background: "rgba(255,251,241,0.14)", borderColor: "rgba(255,251,241,0.28)", color: "var(--color-marshmallow)" }}>Ready to ship</span>
        <h2 className="shm-h1">Pick a format. <em>Add to cart.</em><br />Tap for stars next Monday.</h2>
        <p className="final-cta-lede">
          Orders by Tuesday 5pm CT ship Friday. Bulk packs (10+) ship free expedited. 60-day returns, no questions.
        </p>
        <div className="final-cta-row">
          <a className="shm-btn shm-btn--cream shm-btn--lg" href="#buybox">Shop the cards →</a>
          <a className="shm-btn shm-btn--ghost shm-btn--lg" href="#formats">Compare formats</a>
        </div>
      </div>
    </section>);

}

Object.assign(window, {
  ReviewHero, ReviewBulletStrip, FormatPicker,
  HowItWorks, StandoutMoments, NumbersWall, Objections,
  ShipReturns, ReviewFaq, FinalCta
});
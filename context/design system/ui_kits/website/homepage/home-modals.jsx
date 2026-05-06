// home-modals.jsx — waitlist modal + spotlight section

const { useState: useStateM, useEffect: useEffectM } = React;

function WaitlistModal({ open, product, onClose }) {
  const [email, setEmail] = useStateM("");
  const [submitted, setSubmitted] = useStateM(false);

  useEffectM(() => {
    if (!open) {
      setSubmitted(false);
      setEmail("");
    }
  }, [open]);

  useEffectM(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function submit(e) {
    e.preventDefault();
    // Webhook stub — would POST to backend
    if (email && email.includes("@")) setSubmitted(true);
  }

  return (
    <div className={`modal-scrim${open ? ' is-open' : ''}`} onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {!submitted ? (
          <>
            <span className="modal-product-pill">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="4"/></svg>
              <em>{product || "Coming soon"}</em>
            </span>
            <h3 id="modal-title">Get on the <em>list</em>.</h3>
            <p>We'll email you the moment {product} is ready to ship. No spam, no drip campaign — one note when it's live.</p>
            <form className="modal-form" onSubmit={submit}>
              <div className="shm-field">
                <label className="shm-field__label" htmlFor="wl-email">Your email</label>
                <input
                  id="wl-email"
                  className="shm-input"
                  type="email"
                  placeholder="you@yourshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <p className="shm-field__hint">We'll only use this to send you the launch note.</p>
              </div>
              <button type="submit" className="shm-btn shm-btn--primary shm-btn--lg">
                Notify me →
              </button>
            </form>
          </>
        ) : (
          <div className="modal-success">
            <div className="modal-success__check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3>You're on the <em>list</em>.</h3>
            <p>We'll email <b style={{color:"var(--color-cocoa-deep)"}}>{email}</b> the moment {product} is ready.</p>
            <button className="shm-btn shm-btn--cocoa" onClick={onClose}>Back to the toolkit</button>
          </div>
        )}
      </div>
    </div>
  );
}

function SubBrandSpotlight({ data, idx, openModal }) {
  const reverse = idx % 2 === 1;
  const onCta = (e, ctaInfo) => {
    if (ctaInfo && ctaInfo.waitlist) {
      e.preventDefault();
      openModal(ctaInfo.product);
    }
  };
  return (
    <section className={`shm-section ${data.bg}`} id={data.id} data-screen-label={`Sub-brand · ${data.name}`}>
      <div className="shm-container">
        <div className={`spotlight${reverse ? ' spotlight--reverse' : ''}`}>
          <div className="spotlight-copy">
            <div className="spotlight-meta">
              <span className="spotlight-num">{String(idx + 1).padStart(2, "0")}/04</span>
              <span className="shm-eyebrow">{data.eyebrow}</span>
              {data.status === "live" ? (
                <span className="shm-badge shm-badge--status shm-badge--status-clover">Available now</span>
              ) : (
                <span className="shm-badge shm-badge--status shm-badge--status-honey">{data.badge}</span>
              )}
            </div>
            <h2 className="shm-h1 spotlight-h">{data.headline}</h2>
            <p className="shm-lede spotlight-lede">{data.lede}</p>
            <ul className="spotlight-bullets">
              {data.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            {data.formats && (
              <div className="formats-row">
                {data.formats.map((f, i) => (
                  <div className="shm-card format-mini" key={i}>
                    <div className="format-mini__title">{f.title}</div>
                    <div className="format-mini__sub">{f.sub}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="spotlight-cta-row">
              <a
                className={`shm-btn ${data.status === "live" ? "shm-btn--primary" : (data.bg === "bg-cocoa" ? "shm-btn--honey" : "shm-btn--cocoa")} shm-btn--lg`}
                href={data.primary.href}
                onClick={(e) => onCta(e, data.primary)}
              >
                {data.primary.label}
              </a>
              {data.secondary && (
                <a className="shm-btn shm-btn--ghost" href={data.secondary.href} style={data.bg === "bg-cocoa" ? { color: "var(--color-marshmallow)", borderColor: "rgba(255,251,241,0.24)" } : null}>
                  {data.secondary.label}
                </a>
              )}
            </div>
            {data.aside && <div className="spotlight-aside">{data.aside}</div>}
          </div>
          <div className={`spotlight-art spotlight-art--${data.art.kind}`}>
            <image-slot
              id={`spotlight-${data.id}`}
              shape="rounded"
              radius="20"
              placeholder={`Drop ${data.eyebrow} image`}
              style={{width: "100%", height: "100%", display: "block"}}
            ></image-slot>
            {data.art.chip && <div className="spotlight-art__chip">{data.art.chip}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function CrewStrip() {
  const tiles = Array.from({ length: 6 }, (_, i) => i + 1);
  return (
    <section className="shm-section shm-bg-marsh" data-screen-label="05 Crew UGC">
      <div className="crew-strip">
        <div className="crew-strip__head">
          <span className="crew-strip__hash">From the crew · #shmocard</span>
          <h2 className="shm-h2">Real shops, real <em>tap</em> moments.</h2>
          <p className="crew-strip__lede">
            Tag <b>#shmocard</b> on Instagram and we'll feature your shop. The best photos earn a free L-Sign for the counter.
          </p>
        </div>
        <div className="crew-grid">
          {tiles.map((n) => (
            <div className="crew-tile" key={n}>
              <span className="crew-tile__chip">Crew photo · TBD</span>
              <image-slot
                id={`crew-${n}`}
                shape="rounded"
                radius="16"
                placeholder=""
              ></image-slot>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoTestimonials() {
  const cards = [
    {
      tone: "ember",
      duration: "1:42",
      quote: "Got 14 in the first week. Marshall's already gotten five today and we've been open for an hour and a half.",
      person: "Carly",
      role: "Owner, Axel's Pawn",
      shop: "Axel's"
    },
    {
      tone: "cocoa",
      duration: "0:58",
      quote: "He got five Google reviews in less than two hours of being open.",
      person: "Carly",
      role: "Owner, Axel's Pawn",
      shop: "Axel's"
    },
    {
      tone: "honey",
      duration: "—",
      coming: true,
      quote: "Transcription pending — we'll add this story when it's ready.",
      person: "Joey",
      role: "Coming soon",
      shop: "—"
    }
  ];
  return (
    <section className="shm-section shm-bg-marsh" data-screen-label="09 Video testimonials">
      <div className="shm-container video-testimonials">
        <div className="video-testimonials__head">
          <span className="video-testimonials__eyebrow">What crews say</span>
          <h2 className="shm-h2">Real crews, real <em>five-star</em> moments.</h2>
          <p className="video-testimonials__lede">
            Short stories from owner-operators who put Shmocards on their teams. No script, no vague metrics — just what changed.
          </p>
        </div>
        <div className="video-grid">
          {cards.map((c, i) => (
            <article className={`shm-card video-card${c.coming ? ' video-card--coming' : ''}`} key={i}>
              <div className="video-card__media">
                <div className={`video-card__media-bg video-card__media-bg--${c.tone}`}></div>
                <button className="video-card__play" aria-label="Play video">
                  <svg viewBox="0 0 16 16" fill="currentColor"><polygon points="3 1 14 8 3 15"/></svg>
                </button>
                <span className="video-card__duration">{c.duration}</span>
                <div className={`video-card__quote${c.coming ? ' video-card__pending' : ''}`}>
                  <p className="video-card__quote-text">"{c.quote}"</p>
                </div>
              </div>
              <div className="video-card__attr">
                <div className="video-card__person">
                  <b>{c.person}</b>
                  <span>{c.role}</span>
                </div>
                <div className="video-card__shop">{c.shop}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { WaitlistModal, SubBrandSpotlight, CrewStrip, VideoTestimonials });

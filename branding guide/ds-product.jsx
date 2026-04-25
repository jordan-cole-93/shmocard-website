/* =========================================================
   Sub-brands · Product cards · Dashboard mockup
   ========================================================= */

function SubBrands() {
  const brands = [
    { id: "review",    name: "Shmo Review",     accent: "#FF5B1F", desc: "The NFC review card for local business.",       icon: "★" },
    { id: "biz",       name: "Shmo Biz",        accent: "#3B1F14", desc: "The digital business card. Tap to share.",      icon: "❑" },
    { id: "link",      name: "Shmo Link",       accent: "#FFB833", desc: "Bio link page built for local businesses.",     icon: "↗" },
    { id: "rep",       name: "Shmo Reputation", accent: "#2E7D44", desc: "Watch every review across every platform.",     icon: "◐" },
  ];
  return (
    <section className="ds-section" id="Sub-brands">
      <SectionHead
        num="06 · Sub-brands"
        title="One family, {em} jobs."
        em="four"
        desc="Each Shmo product gets a single accent color and a one-line job description. The wordmark is always 'Shmo' (sans) + the product name (sans, lighter weight). Never two display fonts. Never a unique mascot per product."
      />
      <div className="grid-2">
        {brands.map(b => (
          <div key={b.id} className="card card--lg" style={{display: "flex", gap: 24, alignItems: "center"}}>
            <div style={{flexShrink: 0, width: 88, height: 88, borderRadius: "var(--r-lg)", background: b.accent, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 600}}>
              {b.icon}
            </div>
            <div>
              <div className="ds-eyebrow" style={{marginBottom: 6}}>Sub-brand</div>
              <div style={{fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1}}>
                <span style={{color: "var(--ink)"}}>Shmo</span>{" "}
                <span style={{color: b.accent, fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400}}>{b.name.replace("Shmo ", "")}</span>
              </div>
              <p style={{margin: "8px 0 0", fontSize: 14, color: "var(--ink-3)", lineHeight: 1.5}}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Product cards (illustrative — keep flat & graphic) ---------- */

function ProductCards() {
  return (
    <section className="ds-section" id="Product">
      <SectionHead
        num="07 · Product"
        title="The card that lives on the {em}."
        em="counter"
        desc="The physical NFC card is graphic and bold by intent — it's packaging, not UI. Flat warm quadrants, white holder for the call-to-action, NFC + V2 corner pills, Shmocard pill at the bottom. Designed to be re-composed by Nano Banana into mascot scenes."
      />

      <div className="grid-2">
        <div className="card" style={{padding: 32, background: "var(--snow)"}}>
          <div className="ds-eyebrow" style={{marginBottom: 16}}>Front · Tap to review</div>
          <div style={{display: "flex", justifyContent: "center", padding: "32px 0"}}>
            <ReviewCardFront />
          </div>
        </div>
        <div className="card" style={{padding: 32, background: "var(--snow)"}}>
          <div className="ds-eyebrow" style={{marginBottom: 16}}>Back · Scan instead</div>
          <div style={{display: "flex", justifyContent: "center", padding: "32px 0"}}>
            <ReviewCardBack />
          </div>
        </div>
      </div>

      {/* Spec sheet */}
      <div className="mt-32 grid-3">
        <SpecRow label="Size"      value="CR80 · 85.6 × 54mm"/>
        <SpecRow label="Material"  value="PVC, matte finish"/>
        <SpecRow label="Chip"      value="NTAG 215 · 504 bytes"/>
        <SpecRow label="Print"     value="4-color CMYK + spot white"/>
        <SpecRow label="Range"     value="2–4cm typical tap distance"/>
        <SpecRow label="Compat."   value="iOS 14+, Android 10+"/>
      </div>
    </section>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="card" style={{display: "flex", flexDirection: "column", gap: 4}}>
      <div className="ds-eyebrow">{label}</div>
      <div style={{fontSize: 15, fontWeight: 600, color: "var(--ink)"}}>{value}</div>
    </div>
  );
}

/* ---------- Refined Review Card — front + back
   Warm-professional treatment: hairline edges, soft warm gradient surface,
   real Google glyph + Inter Tight copy, NFC tap mark as signature affordance.
   Same visual grammar as the dashboard chrome. ---------- */

function ReviewCardFront() {
  return (
    <svg viewBox="0 0 340 540" width="240" height="auto" role="img" aria-label="Shmo Review NFC card — front">
      <defs>
        <linearGradient id="rcf-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF1E2"/>
          <stop offset="1" stopColor="#F1D9B6"/>
        </linearGradient>
        <filter id="rcf-shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
          <feOffset dx="0" dy="10"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.18"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* card body — soft shadow + hairline border */}
      <g filter="url(#rcf-shadow)">
        <rect x="10" y="10" width="320" height="520" rx="28" fill="url(#rcf-bg)"/>
        <rect x="10.5" y="10.5" width="319" height="519" rx="27.5" fill="none" stroke="#1A1A1A" strokeOpacity="0.10" strokeWidth="1"/>
      </g>

      {/* corner pills */}
      <g>
        <rect x="26" y="26" width="56" height="22" rx="11" fill="#FFFFFF" stroke="#1A1A1A" strokeOpacity="0.08"/>
        <text x="54" y="40" fontFamily="Inter Tight, sans-serif" fontWeight="600" fontSize="10" textAnchor="middle" letterSpacing="1.4" fill="#1A1A1A">NFC</text>

        <rect x="258" y="26" width="56" height="22" rx="11" fill="#FFFFFF" stroke="#1A1A1A" strokeOpacity="0.08"/>
        <text x="286" y="40" fontFamily="Inter Tight, sans-serif" fontWeight="600" fontSize="10" textAnchor="middle" letterSpacing="1.4" fill="#6B6B6B">V2</text>
      </g>

      {/* NFC tap mark — top center, signature affordance */}
      <g transform="translate(170 92)" stroke="#1A1A1A" fill="none" strokeWidth="1.6" strokeLinecap="round">
        <path d="M-10 6 a10 10 0 0 1 20 0"/>
        <path d="M-16 6 a16 16 0 0 1 32 0"/>
        <path d="M-22 6 a22 22 0 0 1 44 0"/>
        <circle cx="0" cy="6" r="1.8" fill="#1A1A1A"/>
      </g>

      {/* main lockup — white holder w/ hairline + soft inner shadow */}
      <g transform="translate(170 264)">
        <rect x="-110" y="-86" width="220" height="172" rx="18" fill="#FFFFFF" stroke="#1A1A1A" strokeOpacity="0.08"/>

        {/* Real 4-color Google G — 48 unit, scaled */}
        <g transform="translate(-22 -60) scale(0.92)">
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </g>

        {/* hairline divider */}
        <line x1="-86" y1="14" x2="86" y2="14" stroke="#1A1A1A" strokeOpacity="0.08"/>

        {/* tagline copy — sans, sentence case */}
        <text x="0" y="40" fontFamily="Inter Tight, sans-serif" fontWeight="500" fontSize="12" textAnchor="middle" fill="#6B6B6B">Tap to review us on</text>
        <text x="0" y="64" fontFamily="Inter Tight, sans-serif" fontWeight="600" fontSize="20" textAnchor="middle" fill="#1A1A1A" letterSpacing="-0.01em">Google</text>
      </g>

      {/* serif italic accent — single warm word */}
      <text x="170" y="408" fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="400" fontSize="22" textAnchor="middle" fill="#FF5B1F" letterSpacing="-0.01em">five-star</text>
      <text x="170" y="432" fontFamily="Inter Tight, sans-serif" fontWeight="500" fontSize="13" textAnchor="middle" fill="#6B4A37">reviews, in one tap.</text>

      {/* Shmocard wordmark — bottom, calm */}
      <g transform="translate(170 488)">
        <line x1="-100" y1="-22" x2="100" y2="-22" stroke="#3B1F14" strokeOpacity="0.10"/>
        <text x="0" y="6" fontFamily="Inter Tight, sans-serif" fontWeight="700" fontSize="14" textAnchor="middle" letterSpacing="-0.01em">
          <tspan fill="#3B1F14">Shmo</tspan><tspan fill="#FF5B1F">card</tspan>
        </text>
      </g>
    </svg>
  );
}

function ReviewCardBack() {
  return (
    <svg viewBox="0 0 340 540" width="240" height="auto" role="img" aria-label="Shmo Review NFC card — back">
      <defs>
        <linearGradient id="rcb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FAF7F2"/>
          <stop offset="1" stopColor="#F0E4D2"/>
        </linearGradient>
        <filter id="rcb-shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
          <feOffset dx="0" dy="10"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.18"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <g filter="url(#rcb-shadow)">
        <rect x="10" y="10" width="320" height="520" rx="28" fill="url(#rcb-bg)"/>
        <rect x="10.5" y="10.5" width="319" height="519" rx="27.5" fill="none" stroke="#1A1A1A" strokeOpacity="0.10" strokeWidth="1"/>
      </g>

      {/* corner pills */}
      <g>
        <rect x="26" y="26" width="56" height="22" rx="11" fill="#FFFFFF" stroke="#1A1A1A" strokeOpacity="0.08"/>
        <text x="54" y="40" fontFamily="Inter Tight, sans-serif" fontWeight="600" fontSize="10" textAnchor="middle" letterSpacing="1.4" fill="#1A1A1A">QR</text>

        <rect x="258" y="26" width="56" height="22" rx="11" fill="#FFFFFF" stroke="#1A1A1A" strokeOpacity="0.08"/>
        <text x="286" y="40" fontFamily="Inter Tight, sans-serif" fontWeight="600" fontSize="10" textAnchor="middle" letterSpacing="1.4" fill="#6B6B6B">V2</text>
      </g>

      {/* QR holder */}
      <g transform="translate(170 256)">
        <rect x="-92" y="-92" width="184" height="184" rx="18" fill="#FFFFFF" stroke="#1A1A1A" strokeOpacity="0.08"/>

        {/* Stylized QR — finder patterns + module field, monochrome */}
        <g transform="translate(-72 -72)">
          {/* finder patterns */}
          {[[0,0],[108,0],[0,108]].map(([x,y],i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect x="0" y="0" width="36" height="36" rx="6" fill="#1A1A1A"/>
              <rect x="6" y="6" width="24" height="24" rx="3" fill="#FFFFFF"/>
              <rect x="12" y="12" width="12" height="12" rx="2" fill="#1A1A1A"/>
            </g>
          ))}
          {/* module dots — random scatter for QR feel */}
          {[
            [54,6],[66,6],[84,12],[96,18],[42,18],[54,24],[78,24],[90,30],
            [48,36],[60,42],[72,42],[90,48],[42,54],[60,54],[78,60],[96,60],
            [54,66],[66,72],[84,72],[42,78],[60,84],[72,84],[90,84],[48,96],
            [60,96],[6,54],[18,54],[24,66],[6,72],[18,78],[24,84],[12,90],
            [54,108],[78,108],[96,108],[42,114],[66,114],[84,120],[60,126],[90,126],
            [48,132],[72,132],[24,114],[12,126],[18,132]
          ].map(([x,y], i) => (
            <rect key={i} x={x} y={y} width="6" height="6" rx="1" fill="#1A1A1A"/>
          ))}
        </g>
      </g>

      {/* tagline */}
      <text x="170" y="392" fontFamily="Inter Tight, sans-serif" fontWeight="500" fontSize="12" textAnchor="middle" fill="#6B6B6B">No NFC?</text>
      <text x="170" y="418" fontFamily="Inter Tight, sans-serif" fontWeight="600" fontSize="18" textAnchor="middle" fill="#3B1F14" letterSpacing="-0.01em">
        <tspan>Just </tspan><tspan fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="400" fill="#FF5B1F">scan</tspan><tspan> instead.</tspan>
      </text>

      {/* Shmocard wordmark */}
      <g transform="translate(170 488)">
        <line x1="-100" y1="-22" x2="100" y2="-22" stroke="#3B1F14" strokeOpacity="0.10"/>
        <text x="0" y="6" fontFamily="Inter Tight, sans-serif" fontWeight="700" fontSize="14" textAnchor="middle" letterSpacing="-0.01em">
          <tspan fill="#3B1F14">Shmo</tspan><tspan fill="#FF5B1F">card</tspan>
        </text>
      </g>
    </svg>
  );
}

/* ---------- Dashboard mockup ---------- */

function DashboardMockup() {
  const reviews = [
    { initials: "MR", name: "Marisol R.", stars: 5, body: "Best fade I've ever had. Will be back.",      src: "Google",   time: "2h ago", avatarBg: "var(--peach)" },
    { initials: "DT", name: "Devon T.",   stars: 5, body: "Quick service, great vibes.",                  src: "Yelp",     time: "5h ago", avatarBg: "var(--honey-soft)" },
    { initials: "PM", name: "Priya M.",   stars: 4, body: "Loved it — will be back.",                     src: "Facebook", time: "1d ago", avatarBg: "var(--navy-soft)" },
    { initials: "JS", name: "Jamie S.",   stars: 3, body: "Service was OK, parking was rough.",           src: "Google",   time: "1d ago", avatarBg: "var(--tomato-soft)" },
  ];
  return (
    <section className="ds-section" id="Dashboard">
      <SectionHead
        num="08 · Dashboard"
        title="Reputation, at a {em}."
        em="glance"
        desc="The product UI is calm, dense, and information-first. White surfaces, hairline borders, soft shadows. Numbers in serif italic where the eye should rest. No mascot, no ALL CAPS, no chunky outlines."
      />

      <div className="card" style={{padding: 0, overflow: "hidden", boxShadow: "var(--sh-card)"}}>
        {/* App chrome */}
        <div style={{display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid var(--hair)", background: "var(--snow)"}}>
          <span style={{display: "inline-flex", gap: 6}}>
            <span style={{width: 11, height: 11, borderRadius: 99, background: "#F56565"}}/>
            <span style={{width: 11, height: 11, borderRadius: 99, background: "#F5B83D"}}/>
            <span style={{width: 11, height: 11, borderRadius: 99, background: "#48BB78"}}/>
          </span>
          <span style={{marginLeft: 12, fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)"}}>app.shmocard.com / reputation</span>
          <span style={{marginLeft: "auto", display: "flex", gap: 8, alignItems: "center"}}>
            <span className="pill"><span className="pill__dot"/> Marisol's Salon</span>
          </span>
        </div>

        {/* Body */}
        <div style={{display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 560}}>
          {/* Sidebar */}
          <aside style={{padding: 20, borderRight: "1px solid var(--hair)", background: "var(--snow)"}}>
            <div style={{display: "flex", alignItems: "center", gap: 10, padding: "8px 4px"}}>
              <span style={{width: 26, height: 26, borderRadius: 7, background: "var(--ink)", color: "var(--paper)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12}}>S</span>
              <span style={{fontWeight: 700, fontSize: 14}}>Shmocard</span>
            </div>
            <div style={{marginTop: 18}}>
              {[
                { l: "Overview",    active: false },
                { l: "Reputation",  active: true },
                { l: "Reviews",     active: false },
                { l: "Cards",       active: false },
                { l: "Bio link",    active: false },
                { l: "Settings",    active: false },
              ].map(i => (
                <div key={i.l} style={{
                  padding: "8px 10px",
                  fontSize: 13,
                  fontWeight: i.active ? 600 : 500,
                  color: i.active ? "var(--ink)" : "var(--ink-3)",
                  background: i.active ? "var(--paper)" : "transparent",
                  border: i.active ? "1px solid var(--hair)" : "1px solid transparent",
                  borderRadius: "var(--r-sm)",
                  marginBottom: 2,
                  boxShadow: i.active ? "var(--sh-sm)" : "none"
                }}>{i.l}</div>
              ))}
            </div>
          </aside>

          {/* Main */}
          <div style={{padding: 28, background: "var(--paper)"}}>
            <div style={{display: "flex", alignItems: "flex-end", marginBottom: 22, paddingBottom: 18, borderBottom: "1px solid var(--hair)"}}>
              <div>
                <div className="ds-eyebrow" style={{marginBottom: 6}}>Last 30 days · all sources</div>
                <h3 style={{margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em"}}>
                  Your <span className="ds-italic">reputation</span>
                </h3>
              </div>
              <span className="pill pill--success" style={{marginLeft: "auto"}}><span className="pill__dot"/> Live</span>
            </div>

            <div className="grid-3">
              <StatCard label="New reviews"     num="184"  delta="+32%" up/>
              <StatCard label="Average rating"  num="4.9"  delta="+0.2" up/>
              <StatCard label="5-star rate"     num="96%"  delta="+4 pts" up/>
            </div>

            <div className="ds-eyebrow" style={{marginTop: 32, marginBottom: 12}}>Recent reviews</div>
            <div className="card" style={{padding: 0, overflow: "hidden"}}>
              {reviews.map((r, i) => (
                <div key={i} style={{
                  padding: "16px 18px",
                  borderBottom: i < reviews.length - 1 ? "1px solid var(--hair)" : "none",
                  display: "grid",
                  gridTemplateColumns: "36px 1fr auto auto",
                  gap: 14,
                  alignItems: "start"
                }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 99, background: r.avatarBg,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 600, color: "var(--ink)"
                  }}>{r.initials}</span>
                  <div>
                    <div style={{display: "flex", alignItems: "center", gap: 8}}>
                      <span style={{fontWeight: 600, fontSize: 14}}>{r.name}</span>
                      <span style={{color: r.stars >= 4 ? "var(--graham)" : "var(--muted)", fontSize: 12, letterSpacing: 1}}>
                        {"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}
                      </span>
                    </div>
                    <div style={{fontSize: 13, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.5}}>{r.body}</div>
                  </div>
                  <span className="pill" style={{alignSelf: "center"}}>{r.src}</span>
                  <span style={{fontSize: 12, color: "var(--muted)", alignSelf: "center"}}>{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, num, delta, up }) {
  return (
    <div className="card">
      <div style={{fontSize: 12, color: "var(--muted)", fontWeight: 500, marginBottom: 6}}>{label}</div>
      <div style={{fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 38, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--ink)"}}>{num}</div>
      <div style={{fontSize: 12, color: up ? "var(--success)" : "var(--warn)", fontWeight: 600, marginTop: 8}}>
        {up ? "↑" : "↓"} {delta} vs. last month
      </div>
    </div>
  );
}

Object.assign(window, { SubBrands, ProductCards, DashboardMockup });

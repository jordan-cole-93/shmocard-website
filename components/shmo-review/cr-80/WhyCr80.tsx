// components/shmo-review/cr-80/WhyCr80.tsx
// 03-04 — Why CR-80 section for the CR-80 PDP.
// Asymmetric featured layout: one hard-outlined featured card (left) + two
// compact graham cards (right). Mascot accent on featured card.
// Server component — no interactivity.

import { Section } from "@/components/layout/Section";

// ── Inline SVG icons — cocoa-deep stroke, 2.5px, round caps/joins, no fill ──

function PocketIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 40, height: 40, color: "var(--color-cocoa-deep)" }}
    >
      {/* Jeans back-pocket outline */}
      <path d="M10 14 Q10 36 24 38 Q38 36 38 14" />
      <line x1="10" y1="14" x2="38" y2="14" />
      {/* Card slipping in from top — slightly tilted */}
      <rect x="17" y="4" width="16" height="22" rx="3" transform="rotate(-4 25 15)" />
      {/* NFC chip dot on card */}
      <circle cx="25" cy="20" r="2" fill="var(--color-cocoa-deep)" stroke="none" />
    </svg>
  );
}

function NfcIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 40, height: 40, color: "var(--color-cocoa-deep)" }}
    >
      {/* Card outline */}
      <rect x="6" y="12" width="22" height="28" rx="4" />
      {/* NFC ripple arcs — hand-drawn feel */}
      <path d="M33 22 Q37 24 33 28" />
      <path d="M33 17 Q41 22 33 32" />
      {/* Chip on card */}
      <rect x="11" y="20" width="8" height="6" rx="2" />
    </svg>
  );
}

function ReprogramIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 40, height: 40, color: "var(--color-cocoa-deep)" }}
    >
      {/* Circular refresh loop */}
      <path d="M34 14 A13 13 0 1 0 37 26" />
      {/* Arrow head */}
      <path d="M30 10 L34 14 L38 11" />
      {/* Dashboard URL bar */}
      <rect x="10" y="26" width="28" height="8" rx="4" />
      <line x1="14" y1="30" x2="26" y2="30" />
    </svg>
  );
}

export function WhyCr80() {
  return (
    <Section bg="marsh" nextBg="marsh">
      <div className="why-cr80__inner">

        {/* Section head */}
        <div className="why-cr80__head">
          <span className="shm-eyebrow">Why the CR-80</span>
          <h2 className="shm-h2">
            Built for the <em>back pocket</em>.
          </h2>
          <p className="shm-lede why-cr80__lede">
            Counter cards wait. The CR-80 rides with your crew — and collects
            reviews at the moment the customer actually cares.
          </p>
        </div>

        {/* Asymmetric grid: featured left, compact stack right */}
        <div className="why-cr80__grid">

          {/* FEATURED — pocket-sized, not counter-sized */}
          <div className="shm-card shm-card--hard why-cr80__featured">
            {/* Mascot — 1 of 1 for this section */}
            <img
              src="/mascot/mascot-celebrating.png"
              alt=""
              className="shm-mascot shm-mascot--accent shm-tilt-sm-r why-cr80__mascot"
              aria-hidden="true"
            />
            <div className="why-cr80__featured-icon">
              <PocketIcon />
            </div>
            <span className="shm-badge shm-badge--ember why-cr80__stat-badge">
              ~15 reviews / week
            </span>
            <h3 className="shm-h3">Pocket-sized, not counter-sized</h3>
            <p className="shm-body">
              The CR-80 lives in the back pocket of whoever hands over the
              receipt — so it travels with the transaction. Counter cards
              collect around two reviews a week. A crew member with a CR-80
              collects fifteen.
            </p>
            <div className="why-cr80__vs">
              <div className="why-cr80__vs-item">
                <span className="why-cr80__vs-num">~15</span>
                <span className="why-cr80__vs-label">reviews / week<br />CR-80 (crew card)</span>
              </div>
              <div className="why-cr80__vs-divider" aria-hidden="true" />
              <div className="why-cr80__vs-item why-cr80__vs-item--muted">
                <span className="why-cr80__vs-num">~2</span>
                <span className="why-cr80__vs-label">reviews / week<br />counter card</span>
              </div>
            </div>
          </div>

          {/* COMPACT STACK */}
          <div className="why-cr80__compact-stack">

            {/* Card 2 — pre-programmed */}
            <div className="shm-card shm-card--graham why-cr80__compact">
              <div className="why-cr80__compact-top">
                <NfcIcon />
                <span className="shm-badge shm-badge--soft">QR fallback on back</span>
              </div>
              <h3 className="shm-h3">Pre-programmed before it ships</h3>
              <p className="shm-body">
                Your Google review link is burned into the chip at print time.
                Out of the box, the card just works — no app, no setup.
              </p>
            </div>

            {/* Card 3 — reprogrammable */}
            <div className="shm-card shm-card--graham why-cr80__compact">
              <div className="why-cr80__compact-top">
                <ReprogramIcon />
              </div>
              <h3 className="shm-h3">Reprogrammable for life</h3>
              <p className="shm-body">
                Change your review destination any time from the dashboard.
                Same physical card, new URL, no replacement order.
              </p>
              <ul className="shm-checklist shm-checklist--featured why-cr80__checklist">
                <li>Move locations — update the link, keep the cards</li>
                <li>New Google listing — swap the URL in seconds</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </Section>
  );
}

export default WhyCr80;

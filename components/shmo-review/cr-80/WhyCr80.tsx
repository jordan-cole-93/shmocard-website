// components/shmo-review/cr-80/WhyCr80.tsx
// 03-04 — Why CR-80 section for the CR-80 PDP.
// Three value-prop cards: pocket-sized, pre-programmed, reprogrammable.
// Server component — no interactivity.

import { Section } from "@/components/layout/Section";

// ── Inline SVG icons — cocoa-deep stroke, 2.4-2.6px, round caps/joins, no fill ──

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 44, height: 44, color: "var(--color-cocoa-deep)" }}
    >
      {/* Card shape — slight hand-drawn asymmetry */}
      <rect x="6" y="13" width="32" height="20" rx="4" />
      {/* Card slot detail — suggested pocket */}
      <path d="M6 20h32" />
      {/* Coin / chip nub — suggests the card lives in a pocket */}
      <rect x="27" y="23" width="7" height="5" rx="2" />
    </svg>
  );
}

function NfcArrowIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 44, height: 44, color: "var(--color-cocoa-deep)" }}
    >
      {/* Card outline */}
      <rect x="6" y="10" width="20" height="28" rx="4" />
      {/* NFC ripple arcs emanating from top-right of card */}
      <path d="M30 20 Q34 22 30 24" />
      <path d="M30 16 Q38 20 30 28" />
      {/* Arrow pointing into card */}
      <path d="M38 22 L26 22" />
      <path d="M30 17 L26 22 L30 27" />
    </svg>
  );
}

function ReprogramIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 44, height: 44, color: "var(--color-cocoa-deep)" }}
    >
      {/* Refresh loop — slightly imperfect arc for hand-drawn feel */}
      <path d="M32 12 A13 13 0 1 0 35 24" />
      {/* Arrow head on the loop */}
      <path d="M28 8 L32 12 L36 9" />
      {/* Dashboard indicator dots */}
      <circle cx="17" cy="22" r="2" fill="var(--color-cocoa-deep)" stroke="none" />
      <circle cx="22" cy="22" r="2" fill="var(--color-cocoa-deep)" stroke="none" />
      <circle cx="27" cy="22" r="2" fill="var(--color-cocoa-deep)" stroke="none" />
    </svg>
  );
}

const cards = [
  {
    icon: <WalletIcon />,
    title: "Pocket-sized, not counter-sized",
    body: "The CR-80 lives in the back pocket of the crew member who hands over the receipt. The card travels with the transaction — so it captures roughly fifteen reviews a week per crew member, against two for a counter-mounted card.",
  },
  {
    icon: <NfcArrowIcon />,
    title: "Pre-programmed before it ships",
    body: "Your Google review link gets burned into the chip at print time. A QR fallback sits on the back of the card for any phone that doesn't tap. Out of the box, the card just works.",
  },
  {
    icon: <ReprogramIcon />,
    title: "Reprogrammable for life",
    body: "Change your review destination any time from the dashboard. Same card, new URL, no replacement order. Useful if you move locations or update your Google listing.",
  },
] as const;

export function WhyCr80() {
  return (
    <Section bg="marsh" nextBg="graham">
      <div className="why-cr80__inner">
        {/* Section head */}
        <div className="why-cr80__head">
          <span className="shm-eyebrow">Why the CR-80</span>
          <h2 className="shm-h2">
            Built for the <em>back pocket</em>.
          </h2>
        </div>

        {/* 3-card row */}
        <div className="why-cr80__grid">
          {cards.map((card) => (
            <div key={card.title} className="shm-card why-cr80__card">
              <div className="why-cr80__icon" aria-hidden="true">
                {card.icon}
              </div>
              <h3 className="shm-h3">{card.title}</h3>
              <p className="shm-body">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default WhyCr80;

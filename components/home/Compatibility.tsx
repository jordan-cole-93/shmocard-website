// components/home/Compatibility.tsx
// Server component. Single-row band on graham bg. Hand-drawn ember icons.

import "./home.css";
import Section from "@/components/layout/Section";

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="0.5" />
      <rect x="14" y="3" width="7" height="7" rx="0.5" />
      <rect x="3" y="14" width="7" height="7" rx="0.5" />
      <path d="M14 14h3v3h-3z M20 14h1v3M14 20h3v1M20 20h1v1" />
    </svg>
  );
}

export default function Compatibility() {
  return (
    <Section bg="graham" nextBg="marsh" ariaLabel="Phone compatibility">
      <div className="compat">
        <span className="compat__item">
          <PhoneIcon />
          Works on <b>iPhone XS+</b> (2018 and newer)
        </span>
        <span className="compat__item">
          <AndroidIcon />
          And <b>Android 5+</b> (Lollipop and up)
        </span>
        <span className="compat__item">
          <QrIcon />
          QR code on every card for older phones
        </span>
      </div>
    </Section>
  );
}

// components/pdp/PdpCallout.tsx
// Free-shipping band. Server component. Composes .shm-callout--success.

export default function PdpCallout() {
  return (
    <div className="shm-callout shm-callout--success">
      <span className="shm-callout__icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span>
        <span className="shm-callout__title">Free shipping included</span>
        <span className="shm-callout__sub">On all orders over $55</span>
      </span>
    </div>
  );
}

"use client";

// components/pdp/PdpQtyStepper.tsx
// Quantity stepper. Client component. Composes .shm-qty primitive.
// Range clamped 1..99 (matches the cart action assertQuantity guard).

import { usePdpBuybox } from "./PdpBuyboxContext";

export default function PdpQtyStepper() {
  const { qty, setQty } = usePdpBuybox();

  return (
    <div className="pdp-qty-block">
      <span className="pdp-qty-label">Quantity</span>
      <div className="shm-qty" role="group" aria-label="Quantity">
        <button
          type="button"
          className="shm-qty__btn"
          aria-label="Decrease quantity"
          disabled={qty <= 1}
          onClick={() => setQty(qty - 1)}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <span className="shm-qty__val" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          className="shm-qty__btn"
          aria-label="Increase quantity"
          disabled={qty >= 99}
          onClick={() => setQty(qty + 1)}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="12" y1="5" x2="12" y2="19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

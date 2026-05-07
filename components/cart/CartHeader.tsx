"use client";

import { useCartStore, selectLineCount } from "./store";

export default function CartHeader() {
  const close = useCartStore((s) => s.close);
  const count = useCartStore(selectLineCount);

  return (
    <header className="shm-cart__head">
      <h2 className="shm-cart__title">
        Your cart{" "}
        <span className="shm-cart__count">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </h2>
      <button
        type="button"
        className="shm-cart__close"
        aria-label="Close cart"
        onClick={close}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 3l10 10M13 3L3 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </header>
  );
}

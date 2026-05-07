"use client";

// NavCartIcon — client-only cart trigger inside the (server) Nav shell.
// Reads `lines` count from the Zustand store and opens the drawer.
// Uses the existing Nav.module.css `.cart` + `.cartCount` layout classes.

import navStyles from "../Nav.module.css";
import { selectLineCount, useCartStore } from "./store";

export default function NavCartIcon() {
  const open = useCartStore((s) => s.open);
  const count = useCartStore(selectLineCount);
  const label = `Cart, ${count} ${count === 1 ? "item" : "items"}`;

  return (
    <button
      type="button"
      className={`shm-cart-trigger ${navStyles.cart}`}
      aria-label={label}
      aria-controls="cart"
      aria-expanded="false"
      onClick={open}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 7h14l-1.5 9.2a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7Z" />
        <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
      </svg>
      {count > 0 ? <span className={navStyles.cartCount}>{count}</span> : null}
    </button>
  );
}

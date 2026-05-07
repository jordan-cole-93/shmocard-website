"use client";

import Link from "next/link";

import { useCartStore } from "./store";

export default function CartEmpty() {
  const close = useCartStore((s) => s.close);

  return (
    <div className="shm-cart-empty">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/mascot/mascot-holding-card.png" alt="" />
      <h3>Your cart is empty.</h3>
      <p>Pick a card format and we'll help your crew rack up Google reviews.</p>
      <Link
        href="/shmo-review"
        className="shm-btn shm-btn--primary"
        onClick={close}
      >
        Browse cards
      </Link>
    </div>
  );
}

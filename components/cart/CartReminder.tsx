"use client";

// CartReminder — static activation reminder banner.
// Renders directly after <CartHeader />, before <CartMilestones />.
// Only shown when the cart has lines (caller is responsible for the guard).

export default function CartReminder() {
  return (
    <div className="shm-cart-reminder">
      <b>Heads up:</b> activate your cards in the Shmocard app the moment they arrive.
    </div>
  );
}

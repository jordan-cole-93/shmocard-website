"use client";

const METHODS = ["Visa", "MC", "Amex", "Apple Pay", "G Pay", "PayPal"];

export default function CartPaymentsStrip() {
  return (
    <div className="shm-cart-payments">
      {METHODS.map((m) => (
        <span key={m} className="shm-cart-payments__chip">
          {m}
        </span>
      ))}
    </div>
  );
}

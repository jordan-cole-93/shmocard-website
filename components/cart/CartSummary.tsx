"use client";

import { FREE_SHIP_THRESHOLD_USD } from "./store";

type CartSummaryProps = {
  /** Cart subtotal in USD (not cents). */
  subtotal: number;
};

export default function CartSummary({ subtotal }: CartSummaryProps) {
  const freeShip = subtotal >= FREE_SHIP_THRESHOLD_USD;

  return (
    <div className="shm-cart-summary">
      <div className="shm-cart-summary__row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="shm-cart-summary__row">
        <span>Shipping</span>
        <span>{freeShip ? <em>Free</em> : "Calculated at checkout"}</span>
      </div>
      <div className="shm-cart-summary__row">
        <span>Tax</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="shm-cart-summary__row shm-cart-summary__row--total">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

"use client";

import { FREE_SHIP_THRESHOLD_USD } from "./store";

type CartFreeShipBandProps = {
  /** Cart subtotal in USD (not cents). */
  subtotal: number;
};

export default function CartFreeShipBand({ subtotal }: CartFreeShipBandProps) {
  const threshold = FREE_SHIP_THRESHOLD_USD;
  const unlocked = subtotal >= threshold;
  const pct = Math.min(100, Math.max(0, (subtotal / threshold) * 100));
  const remaining = Math.max(0, threshold - subtotal);

  return (
    <div
      className={
        "shm-cart__ship" + (unlocked ? " shm-cart__ship--unlocked" : "")
      }
    >
      <p className="shm-cart__ship-msg">
        {unlocked ? (
          <>
            Free shipping unlocked. <b>Nice crew.</b>
          </>
        ) : (
          <>
            Spend <b>${remaining.toFixed(2)}</b> more for free shipping.
          </>
        )}
      </p>
      <div
        className="shm-cart__bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <div
          className="shm-cart__bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

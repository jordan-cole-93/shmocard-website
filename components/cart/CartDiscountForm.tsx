"use client";

// CartDiscountForm — collapsible discount-code input inside the cart footer.
// Positioned before <CartSummary /> in <footer class="shm-cart__foot">.
//
// Security: discount codes are sanitized server-side (applyDiscountCode).
// User-facing errors are generic — Shopify error payloads are NEVER echoed.

import { useRef, useState, useTransition } from "react";

import { applyDiscountCode, clearDiscountCodes } from "@/components/cart/actions";
import { useCartStore } from "@/components/cart/store";
import { mapShopifyCartLines } from "@/components/cart/useCartHydration";

export default function CartDiscountForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const appliedCodes = useCartStore((s) => s.discountCodes);

  const handleApply = () => {
    const code = inputRef.current?.value ?? "";
    if (!code.trim()) {
      setError("Enter a code.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const cart = await applyDiscountCode(code);
        const lines = mapShopifyCartLines(cart);
        useCartStore
          .getState()
          .setCart(cart.id, cart.checkoutUrl, lines, cart.discountCodes);
        if (inputRef.current) inputRef.current.value = "";
        // If the code was accepted but is not applicable to current items,
        // surface a specific but non-leaking message.
        const justApplied = cart.discountCodes.find(
          (dc) => dc.code.toLowerCase() === code.trim().toLowerCase() && !dc.applicable,
        );
        if (justApplied) {
          setError("That code isn't applicable to the items in your cart.");
        }
      } catch {
        setError("That code isn't valid.");
      }
    });
  };

  const handleRemove = (_code: string) => {
    setError(null);
    startTransition(async () => {
      try {
        const cart = await clearDiscountCodes();
        const lines = mapShopifyCartLines(cart);
        useCartStore
          .getState()
          .setCart(cart.id, cart.checkoutUrl, lines, cart.discountCodes);
      } catch {
        setError("Couldn't remove the code. Try again.");
      }
    });
  };

  return (
    <details className="shm-cart-discount" open={appliedCodes.length > 0}>
      <summary>Have a code?</summary>

      {appliedCodes.length > 0 && (
        <ul className="shm-cart-discount__applied" aria-label="Applied codes">
          {appliedCodes.map((dc) => (
            <li key={dc.code} className="shm-cart-discount__chip">
              <span>{dc.code}</span>
              <button
                type="button"
                onClick={() => handleRemove(dc.code)}
                aria-label={`Remove ${dc.code}`}
                disabled={pending}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="shm-cart-discount__row">
        <input
          ref={inputRef}
          type="text"
          placeholder="Discount code"
          defaultValue=""
          disabled={pending}
          maxLength={256}
          aria-label="Discount code"
        />
        <button type="button" onClick={handleApply} disabled={pending}>
          {pending ? "..." : "Apply"}
        </button>
      </div>

      {error && (
        <p className="shm-cart-discount__error" role="alert">
          {error}
        </p>
      )}
    </details>
  );
}

"use client";

// CartDiscountForm — collapsible discount code input at the top of the cart footer.
// Positioned before <CartSummary /> in <footer class="shm-cart__foot">.
//
// cartDiscountCodesUpdate mutation does NOT exist in lib/shopify/mutations.ts.
// Apply is a no-op until Jordan decides to expand scope and add the mutation.
// TODO(shopify): add CART_DISCOUNT_CODES_UPDATE_MUTATION to lib/shopify/mutations.ts,
// add applyDiscountCode(code: string) Server Action to components/cart/actions.ts,
// then wire the form submission below.

import { useRef } from "react";

export default function CartDiscountForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleApply = () => {
    // TODO(shopify): call applyDiscountCode(inputRef.current?.value ?? "") Server Action
    // once cartDiscountCodesUpdate mutation is added to lib/shopify/mutations.ts.
  };

  return (
    <details className="shm-cart-discount">
      <summary>Have a code?</summary>
      <div className="shm-cart-discount__row">
        <input
          ref={inputRef}
          type="text"
          placeholder="Discount code"
          defaultValue=""
        />
        <button type="button" onClick={handleApply}>
          Apply
        </button>
      </div>
    </details>
  );
}

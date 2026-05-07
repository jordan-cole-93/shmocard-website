"use client";

import { useState, useTransition } from "react";

import { addLineToCart } from "@/components/cart/actions";
import { useCartStore } from "@/components/cart/store";
import { mapShopifyCartLines } from "@/components/cart/useCartHydration";

type Props = {
  merchandiseId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  price: string;
  currencyCode: string;
  imageUrl: string;
  imageAlt: string;
};

export default function SmokeAddButton(props: Props) {
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const setCart = useCartStore((s) => s.setCart);
  const open = useCartStore((s) => s.open);

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        const cart = await addLineToCart(props.merchandiseId, 1);
        setCart(cart.id, cart.checkoutUrl, mapShopifyCartLines(cart));
        open();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Add failed");
      }
    });
  };

  return (
    <div>
      <button
        type="button"
        className="shm-btn shm-btn--primary"
        onClick={onClick}
        disabled={busy}
      >
        {busy ? "Adding…" : "Add to cart"}
      </button>
      {error ? (
        <p
          style={{
            marginTop: 12,
            color: "var(--color-ember)",
            fontSize: 14,
          }}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import { getUpsellProducts, addLineToCart } from "./actions";
import { useCartStore } from "./store";
import { mapShopifyCartLines } from "./useCartHydration";
import type { ShopifyProduct } from "@/lib/shopify/types";

export default function CartUpsell() {
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const setCart = useCartStore((s) => s.setCart);

  useEffect(() => {
    getUpsellProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  // Fetch failed or no upsell products — collapse cleanly
  if (products !== null && products.length === 0) return null;

  const handleAdd = (product: ShopifyProduct) => {
    const variantId = product.variants?.nodes?.[0]?.id;
    if (!variantId) return;
    setAddingId(product.id);
    startTransition(async () => {
      try {
        const cart = await addLineToCart(variantId, 1);
        setCart(cart.id, cart.checkoutUrl, mapShopifyCartLines(cart));
      } finally {
        setAddingId(null);
      }
    });
  };

  // Loading skeleton — 3 placeholder cards
  if (products === null) {
    return (
      <div className="shm-cart-upsell">
        <h4 className="shm-cart-upsell__title">Round it out</h4>
        <div className="shm-cart-upsell__grid">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              className="shm-cart-upsell__card"
              disabled
              style={{ opacity: 0.5 }}
            >
              <div className="shm-cart-upsell__thumb" />
              <div className="shm-cart-upsell__body">
                <div className="shm-cart-upsell__name" />
                <div className="shm-cart-upsell__price" />
              </div>
              <span className="shm-cart-upsell__plus" aria-label="Add">
                +
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="shm-cart-upsell">
      <h4 className="shm-cart-upsell__title">Round it out</h4>
      <div className="shm-cart-upsell__grid">
        {products.map((product) => {
          const isAdding = addingId === product.id;
          const imgUrl =
            product.featuredImage?.url ??
            product.images?.nodes?.[0]?.url ??
            "";
          const imgAlt =
            product.featuredImage?.altText ?? product.title ?? "";
          const priceText = `from $${Math.round(
            parseFloat(product.priceRange.minVariantPrice.amount),
          )}`;

          return (
            <button
              key={product.id}
              type="button"
              className="shm-cart-upsell__card"
              onClick={() => handleAdd(product)}
              disabled={isAdding}
              style={isAdding ? { opacity: 0.5 } : undefined}
            >
              <div className="shm-cart-upsell__thumb">
                {imgUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgUrl} alt={imgAlt} />
                ) : null}
              </div>
              <div className="shm-cart-upsell__body">
                <div className="shm-cart-upsell__name">{product.title}</div>
                <div className="shm-cart-upsell__price">{priceText}</div>
              </div>
              <span className="shm-cart-upsell__plus" aria-label="Add">
                +
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

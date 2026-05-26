// Cart drawer smoke harness — temporary route used to verify the cart
// flow ahead of the real PDP page (03-05). Server-fetches two real
// products by handle and renders client buttons that call the
// addLineToCart Server Action.
//
// Plan 03-08 Task 2: this page exists for browser verification only.
// Plan 03-05 will deliver the canonical /shmo-review/[handle] PDP.
// This route is logged in deferred-items.md for cleanup once 03-05 ships.

import { getProductByHandle } from "@/lib/shopify/queries";
import SmokeAddButton from "./SmokeAddButton";

export const dynamic = "force-dynamic";

const HANDLES = [
  "google-reviews-nfc-tap-card-cr80",
  "google-review-nfc-tap-card-l-sign",
];

export default async function CartSmokePage() {
  const products = await Promise.all(HANDLES.map((h) => getProductByHandle(h)));

  return (
    <main className="shm-container" style={{ padding: "48px 16px" }}>
      <h1 className="shm-display" style={{ marginBottom: 24 }}>
        Cart smoke harness
      </h1>
      <p style={{ marginBottom: 32, color: "var(--color-ink-3)" }}>
        Wave-3 sibling of <code>/shmo-review/[handle]</code> (03-05). Used to
        verify the cart drawer end-to-end: cart create, line add, qty
        update, remove, cookie-driven hydration on reload.
      </p>

      <div style={{ display: "grid", gap: 24, maxWidth: 720 }}>
        {products.map((p, i) => {
          if (!p) {
            return (
              <article key={HANDLES[i]} className="shm-card">
                <p>Product handle <code>{HANDLES[i]}</code> not found.</p>
              </article>
            );
          }
          const variant = p.variants.nodes[0];
          if (!variant) return null;
          const img = p.featuredImage ?? p.images.nodes[0] ?? null;
          return (
            <article
              key={p.id}
              className="shm-card"
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: 20,
                padding: 16,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "var(--radius-card)",
                  background: "var(--color-cream)",
                  overflow: "hidden",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.url}
                    alt={img.altText ?? p.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : null}
              </div>
              <div>
                <h2 style={{ marginTop: 0 }}>{p.title}</h2>
                <p style={{ color: "var(--color-ink-3)", marginBottom: 12 }}>
                  Variant: {variant.title} · ${variant.price.amount}{" "}
                  {variant.price.currencyCode}
                </p>
                <SmokeAddButton
                  merchandiseId={variant.id}
                  productHandle={p.handle}
                  productTitle={p.title}
                  variantTitle={variant.title}
                  price={variant.price.amount}
                  currencyCode={variant.price.currencyCode}
                  imageUrl={img?.url ?? ""}
                  imageAlt={img?.altText ?? p.title}
                />
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

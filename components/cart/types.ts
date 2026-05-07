// Cart line item shape — kept Shopify-friendly so the local store can
// later sync 1:1 to the Storefront API cart (3-Shopify stage).
//
// `merchandiseId` is the Shopify variant GID
// (e.g. "gid://shopify/ProductVariant/123…"). The display fields
// (title, price, image) are mirrored locally so the cart drawer can
// render optimistically without a Storefront API roundtrip.

export type CartLine = {
  /** Local React key. Stable across quantity edits. */
  id: string;
  /** Shopify variant GID — sent to cartLinesAdd / cartLinesUpdate. */
  merchandiseId: string;
  /** Product handle, e.g. "cr-80-card". Used for cart drawer routing. */
  productHandle: string;
  /** Product title, e.g. "Shmo Review CR-80 Card". */
  title: string;
  /** Variant title, e.g. "Pack of 10 · Glossy". Empty string when no variants. */
  variantTitle: string;
  /** Price as decimal string (Shopify Money format), e.g. "24.00". */
  price: string;
  /** ISO currency code, e.g. "USD". */
  currencyCode: string;
  /** Variant image URL (from Shopify CDN). */
  imageUrl: string;
  imageAlt: string;
  quantity: number;
};

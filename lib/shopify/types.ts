// Shopify Storefront API 2026-04 — TypeScript types.
//
// Mirrors the GraphQL response shape of the queries + cart fragment in
// `lib/shopify/queries.ts` and `lib/shopify/mutations.ts`. Keep these
// types narrow to the fields we actually request — adding fields here
// without adding them to the query is a guaranteed `undefined` bug.

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ShopifyProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: ShopifySelectedOption[];
};

export type Connection<T> = {
  nodes: T[];
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  images: Connection<ShopifyImage>;
  options: ShopifyProductOption[];
  variants: Connection<ShopifyVariant>;
  featuredImage: ShopifyImage | null;
};

export type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  products: Connection<ShopifyProduct>;
};

export type ShopifyCartLineMerchandise = {
  id: string;
  title: string;
  price: Money;
  image: Pick<ShopifyImage, "url" | "altText"> | null;
  product: {
    handle: string;
    title: string;
  };
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: ShopifyCartLineMerchandise;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: Connection<ShopifyCartLine>;
};

export type ShopifyUserError = {
  field: string[] | null;
  message: string;
};

// Mutation payload envelopes.
export type CartCreatePayload = {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
};

export type CartLinesAddPayload = {
  cartLinesAdd: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
};

export type CartLinesUpdatePayload = {
  cartLinesUpdate: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
};

export type CartLinesRemovePayload = {
  cartLinesRemove: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
};

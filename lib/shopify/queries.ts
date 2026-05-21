// Shopify Storefront API queries — read-side.
//
// Tag conventions for cache invalidation (Next.js 15 `revalidateTag`):
//   'product'                  — invalidates all product reads
//   `product:${handle}`        — invalidates one product
//   'collection'               — invalidates all collection reads
//   `collection:${handle}`     — invalidates one collection
//   Cart fetches use cache: 'no-store' (never cached).
//
// Reference: RESEARCH.md Code Examples (PRODUCT_BY_HANDLE_QUERY).

import "server-only";

import { shopifyFetch } from "./index";
import type {
  ShopifyCart,
  ShopifyCollection,
  ShopifyProduct,
} from "./types";

// ---------- Product ----------

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      availableForSale
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      images(first: 50) {
        nodes { url altText width height }
      }
      options { id name values }
      variants(first: 25) {
        nodes {
          id
          title
          availableForSale
          price { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
        }
      }
      featuredImage { url altText width height }
    }
  }
`;

export async function getProductByHandle(
  handle: string,
): Promise<ShopifyProduct | null> {
  const { data } = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    tags: ["product", `product:${handle}`],
  });
  return data.product;
}

// ---------- Collection ----------

export const COLLECTION_QUERY = /* GraphQL */ `
  query CollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: 25) {
        nodes {
          id
          handle
          title
          description
          availableForSale
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          images(first: 4) {
            nodes { url altText width height }
          }
          options { id name values }
          variants(first: 5) {
            nodes {
              id
              title
              availableForSale
              price { amount currencyCode }
              selectedOptions { name value }
            }
          }
          featuredImage { url altText width height }
        }
      }
    }
  }
`;

export async function getCollection(
  handle: string,
): Promise<ShopifyCollection | null> {
  const { data } = await shopifyFetch<{ collection: ShopifyCollection | null }>(
    {
      query: COLLECTION_QUERY,
      variables: { handle },
      tags: ["collection", `collection:${handle}`],
    },
  );
  return data.collection;
}

// ---------- Cart (read for reconciliation) ----------

const CART_FIELDS_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    discountCodes { code applicable }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText }
            product { handle title }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  ${CART_FIELDS_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  if (!cartId.startsWith("gid://shopify/Cart/")) {
    throw new Error("Invalid cartId — expected a Shopify Cart GID");
  }
  const { data } = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: CART_QUERY,
    variables: { cartId },
    cache: "no-store",
  });
  return data.cart;
}

// Shopify Storefront API fetch wrapper.
//
// Server-only. Posts GraphQL to the Storefront endpoint with the public
// access token, threads Next.js cache tags for tag-based revalidation,
// and bubbles errors as plain Error instances so callers can decide
// what surfaces to the user. Never logs the access token, never returns
// it in error messages (T-03-12-04).
//
// Reference: RESEARCH.md Pattern 1 (vercel/commerce + Next.js 15 fetch).

import "server-only";

const STOREFRONT_API_VERSION = "2026-04";

type ShopifyFetchInit = {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
  cache?: RequestCache;
};

type ShopifyFetchResult<T> = {
  data: T;
};

function getEndpoint(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new Error(
      "SHOPIFY_STORE_DOMAIN is not set. Configure it in .env.local",
    );
  }
  // Normalize: tolerate scheme-prefixed domains in env for safety.
  const host = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${host}/api/${STOREFRONT_API_VERSION}/graphql.json`;
}

function getAccessToken(): string {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set. Configure it in .env.local",
    );
  }
  return token;
}

export async function shopifyFetch<T>({
  query,
  variables,
  tags,
  cache = "force-cache",
}: ShopifyFetchInit): Promise<ShopifyFetchResult<T>> {
  const res = await fetch(getEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": getAccessToken(),
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next: tags ? { tags } : undefined,
  });

  if (!res.ok) {
    // Status only — never include token or response body that may echo headers.
    throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as
    | { data: T; errors?: unknown }
    | { data?: T; errors: unknown };

  if ("errors" in json && json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return { data: (json as { data: T }).data };
}

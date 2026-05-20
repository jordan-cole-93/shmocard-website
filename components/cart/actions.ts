// Cart Server Actions — wire Storefront cart mutations to the
// httpOnly `shm-cart-id` cookie.
//
// Hard rules (T-03-12-01..06):
// - All inputs validated against Shopify GID prefixes; quantity int 1..99.
// - Cookie httpOnly + secure + sameSite='lax' + 14-day max-age.
// - assertCheckoutUrl is the open-redirect guard; only *.myshopify.com
//   or the configured SHOPIFY_STORE_DOMAIN host pass.
// - userErrors from Shopify bubble as Errors — never silently swallowed.
//
// Reference: RESEARCH.md Pattern 3 (Server Action with await cookies()).

"use server";

import { cookies } from "next/headers";

import { shopifyFetch } from "@/lib/shopify";
import {
  CART_CREATE_MUTATION,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
} from "@/lib/shopify/mutations";
import {
  CART_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
} from "@/lib/shopify/queries";
import type {
  CartCreatePayload,
  CartDiscountCodesUpdatePayload,
  CartLinesAddPayload,
  CartLinesRemovePayload,
  CartLinesUpdatePayload,
  ShopifyCart,
  ShopifyProduct,
  ShopifyUserError,
} from "@/lib/shopify/types";

// ---------- Constants ----------

const CART_COOKIE = "shm-cart-id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

const VARIANT_GID_PREFIX = "gid://shopify/ProductVariant/";
const CART_LINE_GID_PREFIX = "gid://shopify/CartLine/";
const CART_GID_PREFIX = "gid://shopify/Cart/";

// ---------- Validation helpers ----------

function assertVariantId(merchandiseId: string): void {
  if (!merchandiseId || !merchandiseId.startsWith(VARIANT_GID_PREFIX)) {
    throw new Error("Invalid merchandiseId — expected ProductVariant GID");
  }
}

function assertLineId(lineId: string): void {
  if (!lineId || !lineId.startsWith(CART_LINE_GID_PREFIX)) {
    throw new Error("Invalid lineId — expected CartLine GID");
  }
}

function assertQuantity(quantity: number): void {
  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 99
  ) {
    throw new Error("Invalid quantity — expected integer 1..99");
  }
}

function assertCartId(cartId: string): void {
  if (!cartId || !cartId.startsWith(CART_GID_PREFIX)) {
    throw new Error("Invalid cartId — expected Cart GID");
  }
}

function bubbleUserErrors(errors: ShopifyUserError[] | undefined): void {
  if (errors && errors.length > 0) {
    throw new Error(
      `Shopify cart userErrors: ${errors
        .map((e) => `${e.field?.join(".") ?? "?"}: ${e.message}`)
        .join("; ")}`,
    );
  }
}

// ---------- Open-redirect guard ----------

/**
 * Validate a Shopify checkoutUrl before navigating the client to it.
 *
 * Allowlist (each entry checked against `URL.hostname` only — never
 * the path/query):
 *   - https://*.myshopify.com
 *   - https://<SHOPIFY_STORE_DOMAIN>      (the *.myshopify.com store name)
 *   - https://shop.<SHOPIFY_STORE_DOMAIN>
 *   - https://<SHOPIFY_PRIMARY_DOMAIN>    (merchant primary domain, e.g. shmocard.com)
 *   - https://shop.<SHOPIFY_PRIMARY_DOMAIN>
 *
 * Why both env vars: Shopify's `cart.checkoutUrl` typically resolves to
 * `https://shop.<primary>/cart/c/...` once a primary domain is configured
 * in the Shopify admin. The store's *.myshopify.com identity remains the
 * back-end, but customers checkout under the merchant brand. We allow
 * both so the guard works in dev (myshopify) and prod (primary).
 *
 * Rejects (each is a thrown Error — never silently passes through):
 *   - empty / malformed URL
 *   - non-https scheme (e.g. javascript:, data:, http:)
 *   - URLs with embedded credentials (https://user:pass@host/...)
 *   - hosts not on the allowlist
 *
 * Mitigates T-03-09-01 (open-redirect via cart.checkoutUrl) and
 * T-03-09-02 (phishing link injection).
 *
 * Implementation note: parses with WHATWG `URL`, checks `protocol`,
 * `username`/`password`, then matches `hostname` (host without port)
 * against the allowlist. String matching on the full URL is unsafe
 * because attackers can encode tricks into pathnames.
 */
function normalizeDomain(raw: string | undefined): string {
  return (raw ?? "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

export async function assertCheckoutUrl(url: string): Promise<string> {
  if (!url || typeof url !== "string") {
    throw new Error("assertCheckoutUrl: empty url");
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("assertCheckoutUrl: invalid url");
  }

  if (parsed.protocol !== "https:") {
    throw new Error(
      `assertCheckoutUrl: non-https scheme '${parsed.protocol}'`,
    );
  }

  if (parsed.username || parsed.password) {
    throw new Error("assertCheckoutUrl: embedded credentials not allowed");
  }

  const hostname = parsed.hostname.toLowerCase();
  const storeDomain = normalizeDomain(process.env.SHOPIFY_STORE_DOMAIN);
  const primaryDomain = normalizeDomain(process.env.SHOPIFY_PRIMARY_DOMAIN);

  const isMyShopify = hostname.endsWith(".myshopify.com");

  const matchesDomain = (d: string): boolean =>
    d.length > 0 && (hostname === d || hostname === `shop.${d}`);

  const isAllowed =
    isMyShopify || matchesDomain(storeDomain) || matchesDomain(primaryDomain);

  if (!isAllowed) {
    throw new Error(
      `assertCheckoutUrl: host '${hostname}' is not on the allow-list`,
    );
  }

  return url;
}

// ---------- Cookie helpers ----------

async function readCartCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

async function writeCartCookie(cartId: string): Promise<void> {
  assertCartId(cartId);
  const store = await cookies();
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  });
}

// ---------- Server Actions ----------

/**
 * Reads the cart cookie and fetches the live Shopify cart.
 * Returns null when no cookie exists OR the cart was expired/cleared
 * server-side (Shopify returns null `cart`).
 *
 * Bypasses cache — cart state is always fresh.
 */
export async function getCartFromCookie(): Promise<ShopifyCart | null> {
  const cartId = await readCartCookie();
  if (!cartId) return null;
  if (!cartId.startsWith(CART_GID_PREFIX)) return null;

  const { data } = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: CART_QUERY,
    variables: { cartId },
    cache: "no-store",
  });
  return data.cart;
}

/**
 * Optional cart line attributes. Used by the PDP to attach a buyer's
 * Google review URL to the line so fulfillment can program the card
 * before shipping. Keys are lowercase snake_case; values are plain
 * strings (no HTML rendering — surfaced only in Shopify Admin order
 * details + email).
 */
export type CartLineAttribute = { key: string; value: string };

const ATTRIBUTE_KEY_RE = /^[a-z][a-z0-9_]{0,63}$/;
const ATTRIBUTE_VALUE_MAX = 1024;

function sanitizeAttributes(
  attrs: CartLineAttribute[] | undefined,
): CartLineAttribute[] | undefined {
  if (!attrs || attrs.length === 0) return undefined;
  const out: CartLineAttribute[] = [];
  for (const a of attrs) {
    if (!a || typeof a.key !== "string" || typeof a.value !== "string") continue;
    if (!ATTRIBUTE_KEY_RE.test(a.key)) continue;
    const value = a.value.slice(0, ATTRIBUTE_VALUE_MAX);
    if (value.length === 0) continue;
    out.push({ key: a.key, value });
  }
  return out.length > 0 ? out : undefined;
}

/**
 * Adds a variant to the cart. Creates a new cart on first add.
 * Returns the updated ShopifyCart so the caller can sync local state.
 *
 * Optional `attributes` are forwarded as Storefront `CartLineInput.attributes`.
 * Used by the PDP to capture the buyer's Google review URL.
 */
export async function addLineToCart(
  merchandiseId: string,
  quantity: number,
  attributes?: CartLineAttribute[],
): Promise<ShopifyCart> {
  assertVariantId(merchandiseId);
  assertQuantity(quantity);

  const safeAttrs = sanitizeAttributes(attributes);
  const lineInput: Record<string, unknown> = { merchandiseId, quantity };
  if (safeAttrs) lineInput.attributes = safeAttrs;

  const cartId = await readCartCookie();

  if (!cartId) {
    const { data } = await shopifyFetch<CartCreatePayload>({
      query: CART_CREATE_MUTATION,
      variables: {
        input: { lines: [lineInput] },
      },
      cache: "no-store",
    });
    bubbleUserErrors(data.cartCreate.userErrors);
    const cart = data.cartCreate.cart;
    if (!cart) throw new Error("cartCreate returned null cart");
    await writeCartCookie(cart.id);
    return cart;
  }

  const { data } = await shopifyFetch<CartLinesAddPayload>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: [lineInput],
    },
    cache: "no-store",
  });
  bubbleUserErrors(data.cartLinesAdd.userErrors);
  const cart = data.cartLinesAdd.cart;
  if (!cart) throw new Error("cartLinesAdd returned null cart");
  return cart;
}

/**
 * Updates the quantity of an existing cart line.
 * Quantity must be integer 1..99 — to remove, call removeCartLine.
 */
export async function updateCartLine(
  lineId: string,
  quantity: number,
): Promise<ShopifyCart> {
  assertLineId(lineId);
  assertQuantity(quantity);

  const cartId = await readCartCookie();
  if (!cartId) throw new Error("updateCartLine: no cart cookie");
  assertCartId(cartId);

  const { data } = await shopifyFetch<CartLinesUpdatePayload>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    cache: "no-store",
  });
  bubbleUserErrors(data.cartLinesUpdate.userErrors);
  const cart = data.cartLinesUpdate.cart;
  if (!cart) throw new Error("cartLinesUpdate returned null cart");
  return cart;
}

// ---------- Upsell ----------

const UPSELL_HANDLES = [
  "google-reviews-nfc-tap-card-cr80",
  "google-review-nfc-tap-card-l-sign",
  "google-review-plaque",
] as const;

/**
 * Fetches the 3 upsell products from Shopify in parallel.
 * Returns only products that exist (null handles are silently filtered).
 * Called as a Server Action from CartUpsell on first mount.
 */
export async function getUpsellProducts(): Promise<ShopifyProduct[]> {
  const results = await Promise.all(
    UPSELL_HANDLES.map((handle) =>
      shopifyFetch<{ product: ShopifyProduct | null }>({
        query: PRODUCT_BY_HANDLE_QUERY,
        variables: { handle },
        tags: ["product", `product:${handle}`],
      }).then(({ data }) => data.product),
    ),
  );
  return results.filter((p): p is ShopifyProduct => p !== null);
}

/**
 * Removes a line from the cart. If the resulting cart is empty,
 * Shopify keeps the cart alive — the cookie stays set.
 */
export async function removeCartLine(lineId: string): Promise<ShopifyCart> {
  assertLineId(lineId);

  const cartId = await readCartCookie();
  if (!cartId) throw new Error("removeCartLine: no cart cookie");
  assertCartId(cartId);

  const { data } = await shopifyFetch<CartLinesRemovePayload>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: {
      cartId,
      lineIds: [lineId],
    },
    cache: "no-store",
  });
  bubbleUserErrors(data.cartLinesRemove.userErrors);
  const cart = data.cartLinesRemove.cart;
  if (!cart) throw new Error("cartLinesRemove returned null cart");
  return cart;
}

// ---------- Discount codes ----------

const DISCOUNT_CODE_MAX_LENGTH = 256;

function sanitizeDiscountCode(code: string): string {
  if (typeof code !== "string") throw new Error("Invalid discount code");
  const trimmed = code.trim();
  if (trimmed.length === 0) throw new Error("Discount code is empty");
  if (trimmed.length > DISCOUNT_CODE_MAX_LENGTH)
    throw new Error("Discount code too long");
  return trimmed;
}

/**
 * Applies a single discount code to the cart.
 * Returns the updated ShopifyCart so the caller can sync local state.
 * Throws on userErrors — caller surfaces a generic message to the UI.
 */
export async function applyDiscountCode(code: string): Promise<ShopifyCart> {
  const safe = sanitizeDiscountCode(code);
  const cartId = await readCartCookie();
  if (!cartId) throw new Error("applyDiscountCode: no cart cookie");
  assertCartId(cartId);

  const { data } = await shopifyFetch<CartDiscountCodesUpdatePayload>({
    query: CART_DISCOUNT_CODES_UPDATE_MUTATION,
    variables: { cartId, discountCodes: [safe] },
    cache: "no-store",
  });
  bubbleUserErrors(data.cartDiscountCodesUpdate.userErrors);
  const cart = data.cartDiscountCodesUpdate.cart;
  if (!cart) throw new Error("cartDiscountCodesUpdate returned null cart");
  return cart;
}

/**
 * Clears all discount codes from the cart.
 * Returns the updated ShopifyCart so the caller can sync local state.
 */
export async function clearDiscountCodes(): Promise<ShopifyCart> {
  const cartId = await readCartCookie();
  if (!cartId) throw new Error("clearDiscountCodes: no cart cookie");
  assertCartId(cartId);

  const { data } = await shopifyFetch<CartDiscountCodesUpdatePayload>({
    query: CART_DISCOUNT_CODES_UPDATE_MUTATION,
    variables: { cartId, discountCodes: [] },
    cache: "no-store",
  });
  bubbleUserErrors(data.cartDiscountCodesUpdate.userErrors);
  const cart = data.cartDiscountCodesUpdate.cart;
  if (!cart) throw new Error("cartDiscountCodesUpdate returned null cart");
  return cart;
}

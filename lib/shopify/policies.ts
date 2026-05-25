import "server-only";
import sanitizeHtml from "sanitize-html";

import { shopifyFetch } from "./index";

export type PolicyHandle =
  | "privacy-policy"
  | "terms-of-service"
  | "refund-policy"
  | "shipping-policy";

type ShopPolicy = {
  title: string;
  handle: string;
  body: string;
  url: string;
};

const POLICY_FIELD: Record<PolicyHandle, string> = {
  "privacy-policy": "privacyPolicy",
  "terms-of-service": "termsOfService",
  "refund-policy": "refundPolicy",
  "shipping-policy": "shippingPolicy",
};

// sanitize-html config — permissive enough for legal-policy formatting,
// restrictive enough to block any script / iframe / form injection.
// Shopify's default templates use a small subset of HTML; this allowlist
// covers it without opening attack surface.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "div", "p", "br", "hr",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "strong", "em", "b", "i", "u",
    "a", "span",
    "blockquote", "pre", "code",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    "*": ["class"],
  },
  // Force external links to open safely.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
};

/**
 * Fetch a Shopify shop policy by handle.
 *
 * Returns null when the policy is not configured in Shopify Admin.
 * Body is Liquid-substituted, then sanitized via sanitize-html.
 *
 * Cached for 24h via Next.js revalidate tag.
 */
export async function getShopPolicy(handle: PolicyHandle): Promise<ShopPolicy | null> {
  const field = POLICY_FIELD[handle];
  const query = `{
    shop {
      ${field} {
        title
        handle
        body
        url
      }
    }
  }`;

  const { data } = await shopifyFetch<{ shop: Record<string, ShopPolicy | null> }>({
    query,
    tags: ["policy", `policy:${handle}`],
  });

  const policy = data.shop[field];
  if (!policy) return null;

  const substituted = substituteLiquid(policy.body);
  const sanitized = sanitizeHtml(substituted, SANITIZE_OPTIONS);

  return { ...policy, body: sanitized };
}

// Shopify's auto-generated policies embed Liquid template variables that
// would normally be rendered by Shopify's storefront. We get the raw body
// via the Storefront API, so we substitute the known variables here.
//
// Unknown {{ }} expressions are left as-is rather than blanked, so a typo
// is visible in QA instead of silently disappearing.
function substituteLiquid(body: string): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return body
    .replace(/\{\{\s*shop_name\s*\}\}/g, "Shmocard")
    .replace(/\{\{\s*last_updated\s*\}\}/g, today);
}

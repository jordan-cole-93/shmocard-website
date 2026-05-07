import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import crypto from 'node:crypto';

/**
 * Shopify webhook receiver — invalidates Next.js fetch cache tags when
 * products change in Shopify Admin so storefront reads see fresh data
 * within ~5s (REQ-07).
 *
 * Security model (plan 03-11):
 * - HMAC SHA-256 (base64) over the EXACT raw request bytes; Shopify signs
 *   the request body byte-for-byte, so the body must be read via
 *   `req.text()` BEFORE any JSON parse. `req.json()` would consume + recode
 *   the body and break the signature comparison.
 * - `crypto.timingSafeEqual` (with a length check first — older Node throws
 *   on mismatched buffer lengths) to defeat timing side-channels.
 * - Generic error responses only — never echo the computed HMAC, the
 *   header HMAC, the secret, or the body. Logs do not include the secret.
 * - Topics outside `products/*` return 200 noop. Returning 4xx for
 *   uninteresting topics would only cause Shopify to retry and add noise.
 *
 * crypto module requires the Node.js runtime (not edge).
 */
export const runtime = 'nodejs';

// We must read raw bytes; never let any framework helper preprocess.
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const secret = process.env.SHOPIFY_REVALIDATION_SECRET;
  if (!secret) {
    // Server misconfiguration — surface as 500 without leaking which env
    // var is missing in the response body.
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 });
  }

  const rawBody = await req.text();
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? '';
  const topic = req.headers.get('x-shopify-topic') ?? '';

  const computed = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');

  // Length check + timing-safe compare. timingSafeEqual throws on length
  // mismatch in older Node, so we short-circuit explicitly.
  const computedBuf = Buffer.from(computed);
  const headerBuf = Buffer.from(hmacHeader);
  if (
    computedBuf.length !== headerBuf.length ||
    !crypto.timingSafeEqual(computedBuf, headerBuf)
  ) {
    return NextResponse.json({ error: 'invalid hmac' }, { status: 401 });
  }

  // Only parse JSON AFTER the signature has been verified.
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  // Defensive: payload shape isn't trusted even after HMAC passes — only
  // pull a string `handle` if present and skip otherwise.
  const handle =
    typeof payload === 'object' &&
    payload !== null &&
    'handle' in payload &&
    typeof (payload as { handle?: unknown }).handle === 'string'
      ? (payload as { handle: string }).handle
      : undefined;

  if (topic.startsWith('products/')) {
    revalidateTag('product');
    if (handle) revalidateTag(`product:${handle}`);
    revalidateTag('collection:shmo-review');
  }
  // Other topics: 200 noop (don't 4xx — Shopify retries on 4xx).

  return NextResponse.json({ revalidated: true });
}

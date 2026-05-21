"use client";

// Meta Pixel base script loader.
//
// Mounted ONCE in app/layout.tsx. Uses next/script with strategy="afterInteractive"
// (Next.js App Router canonical pattern for analytics — early enough to catch
// early bounces, late enough to not block first paint).
//
// The inline init snippet is the EXACT canonical snippet from Meta's
// "Get Started" docs — substituting our own loader breaks the fbq queue
// mechanism that fbevents.js drains on load.
//
// The snippet ALSO fires the initial fbq('track', 'PageView'). We do NOT
// add a separate useEffect-driven PageView call (Pitfall 1 — double-fire).
// Phase 9 ships with initial-PageView-only; SPA route-change PageView is
// deferred to a future phase if needed.
//
// Returns null when NEXT_PUBLIC_FB_PIXEL_ID is unset — graceful in dev
// before Jordan pastes the env var.

import Script from "next/script";

export default function PixelLoader() {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  if (!pixelId) return null;

  return (
    <Script id="meta-pixel-base" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`}
    </Script>
  );
}

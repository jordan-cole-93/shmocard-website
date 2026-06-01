// Google Tag Manager loader.
//
// Mounted ONCE at the top of <body> in app/layout.tsx. Renders BOTH the
// init <script> (via next/script with strategy="afterInteractive") and the
// <noscript><iframe> fallback for users with JS disabled — per GTM's
// canonical install snippet.
//
// Pattern mirrors components/analytics/PixelLoader.tsx. Container ID is
// hardcoded because GTM container IDs are public-facing identifiers (they
// appear in the rendered HTML regardless). No env var needed.
//
// The <noscript><iframe> must appear inside <body>, so this component is
// a server-renderable wrapper — it does NOT need "use client". next/script
// works in server components.

import Script from "next/script";

const GTM_ID = "GTM-W563VSJD";

export default function GTMLoader() {
  return (
    <>
      <Script id="gtm-base" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}

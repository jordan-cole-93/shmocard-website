// Hotjar loader.
//
// Mounted ONCE at the top of <body> in app/layout.tsx. Renders the Hotjar
// init <script> via next/script (strategy="afterInteractive"). Hotjar's
// canonical snippet appends the actual tracker script to <head> at runtime,
// so installing the init via next/script is equivalent to pasting the
// snippet in <head>.
//
// Pattern mirrors components/analytics/GTMLoader.tsx. The Site ID (hjid) is
// hardcoded because it is a public-facing identifier — it appears in the
// rendered tracker URL regardless. No env var needed.

import Script from "next/script";

const HOTJAR_ID = 6725085;
const HOTJAR_SV = 6;

export default function HotjarLoader() {
  return (
    <Script id="hotjar-base" strategy="afterInteractive">
      {`(function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${HOTJAR_ID},hjsv:${HOTJAR_SV}};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
    </Script>
  );
}

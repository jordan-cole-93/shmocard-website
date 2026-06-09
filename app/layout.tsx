import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import ModalRoot from "@/components/modals/ModalRoot";
import PixelLoader from "@/components/analytics/PixelLoader";
import GTMLoader from "@/components/analytics/GTMLoader";
import HotjarLoader from "@/components/analytics/HotjarLoader";

export const metadata: Metadata = {
  title: "Shmocard — The toolkit your crew's been missing",
  description:
    "NFC tools built for local shop crews. Tap a card, post a Google review, share a contact, jump to a link hub, or auto-respond to reviews. One brand, one dashboard, one-time card purchase.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GTMLoader />
        <HotjarLoader />
        <Nav />
        {children}
        <Footer />
        <CartDrawer />
        <ModalRoot />
        <PixelLoader />
        <Script
          src="https://beta.leadconnectorhq.com/loader.js"
          data-resources-url="https://beta.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="6a28719b7b092d06b9069d31"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

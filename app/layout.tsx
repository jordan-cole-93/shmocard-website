import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import ModalRoot from "@/components/modals/ModalRoot";

export const metadata: Metadata = {
  title: "Shmocard — The toolkit your crew's been missing",
  description:
    "NFC tools built for local shop crews. Tap a card, post a Google review, share a contact, jump to a link hub, or auto-respond to reviews. One brand, one dashboard, one-time card purchase.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
        <CartDrawer />
        <ModalRoot />
      </body>
    </html>
  );
}

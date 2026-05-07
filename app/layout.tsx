import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shmocard — The toolkit your crew's been missing",
  description:
    "NFC tools built for local shop crews. Tap a card, post a Google review, share a contact, jump to a link hub, or auto-respond to reviews. One brand, one dashboard, one-time card purchase.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        Body classes intentionally empty — design system's :root + html, body
        rules in colors_and_type.css set background, ink color, and the
        Inter Tight font stack globally. Don't add Tailwind color/typography
        utilities here.
      */}
      <body>{children}</body>
    </html>
  );
}

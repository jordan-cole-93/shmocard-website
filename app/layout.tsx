import type { Metadata } from "next";
import { Inter_Tight, Fraunces } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-tight",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shmocard — The toolkit your crew's been missing",
  description:
    "Four tools built for Main Street. Reviews, contacts, links, reputation — every customer interaction your crew was letting slip through the cracks.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${fraunces.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

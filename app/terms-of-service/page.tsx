import type { Metadata } from "next";
import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Service — Shmocard",
  description: "The terms that govern your use of Shmocard's website and products.",
};

export const revalidate = 86400;

export default function TermsOfServicePage() {
  return (
    <main>
      <PolicyPage handle="terms-of-service" fallbackTitle="Terms of Service" />
    </main>
  );
}

import type { Metadata } from "next";
import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Shmocard",
  description: "How Shmocard collects, uses, and protects your information.",
};

export const revalidate = 86400;

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PolicyPage handle="privacy-policy" fallbackTitle="Privacy Policy" />
    </main>
  );
}

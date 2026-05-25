import type { MetadataRoute } from "next";

// Whitelist of public routes. Any new public page MUST be added here.
// Hidden routes (e.g. /offer/*) are intentionally omitted and must never
// appear in the sitemap.
const PUBLIC_ROUTES = [
  "",
  "/shmo-review",
  "/shmo-review/cr-80",
  "/shmo-review/l-sign",
  "/shmo-review/square-card",
  "/privacy-policy",
  "/terms-of-service",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shmocard.com";
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));
}

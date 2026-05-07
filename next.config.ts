import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow imports from outside app/ (the design system lives at context/design-system/).
  // Next.js 15 + Turbopack handles this by default for CSS @import paths; no extra
  // config needed for now. Add experimental.externalDir if static analysis trips later.
};

export default nextConfig;

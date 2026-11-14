import type { NextConfig } from "next";

/**
 * Next.js 16 configuration
 *
 * CSS pipeline:
 *  - Dev  (next dev):   Turbopack handles Tailwind v4 via @tailwindcss/turbopack
 *  - Prod (next build): PostCSS handles Tailwind v4 via postcss.config.mjs +
 *                       @tailwindcss/postcss
 *
 * We deliberately do NOT set turbopack.rules for *.css here — letting
 * @tailwindcss/turbopack auto-configure is more reliable and avoids
 * the double-processing that caused utility classes to be missing in
 * the previous webpack build.
 */
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;

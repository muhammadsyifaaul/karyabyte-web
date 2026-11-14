/**
 * PostCSS configuration for Tailwind v4 + webpack production builds.
 *
 * Next.js uses Turbopack in dev (handled by @tailwindcss/turbopack via
 * next.config.ts). For the production `next build` (webpack mode), PostCSS
 * is the CSS pipeline. Without this file, `@import "tailwindcss"` is treated
 * as a bare external import and no utility classes are emitted.
 *
 * @tailwindcss/postcss v4 reads the same `globals.css` @import + @source
 * directives — no separate tailwind.config.js needed.
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

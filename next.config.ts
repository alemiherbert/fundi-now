import type { NextConfig } from "next";

// GitHub Pages: a static export served from /<repo>/. The Pages workflow sets GITHUB_PAGES=true
// and passes PAGES_BASE_PATH from actions/configure-pages.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? (process.env.PAGES_BASE_PATH ?? "/fundi-now") : "";

const nextConfig: NextConfig = {
  // The client demo is fully client-driven (simulated data lives in localStorage), so
  // Cache Components / Partial Prefetching are left off to keep prerendering simple.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_TRAILING_SLASH: isPages ? "1" : "",
  },
  ...(isPages
    ? { output: "export" as const, basePath, trailingSlash: true }
    : {
        async headers() {
          return [
            {
              source: "/sw.js",
              headers: [
                { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
                { key: "Content-Type", value: "application/javascript; charset=utf-8" },
              ],
            },
          ];
        },
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { MetadataRoute } from "next";

import { pageUrl, withBase } from "@/lib/base-path";

const BRAND_HEX = "#2a5bd7";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: pageUrl("/"),
    name: "Fundi Now",
    short_name: "Fundi Now",
    description: "A trusted mechanic, wherever you are in Kampala.",
    start_url: pageUrl("/"),
    scope: pageUrl("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: BRAND_HEX,
    theme_color: BRAND_HEX,
    categories: ["auto", "lifestyle", "utilities"],
    icons: [
      { src: withBase("/icons/icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: withBase("/icons/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: withBase("/icons/maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

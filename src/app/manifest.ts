import type { MetadataRoute } from "next";

import { BRAND_HEX } from "@/lib/app-icon";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Fundi Now",
    short_name: "Fundi Now",
    description: "A trusted mechanic, wherever you are in Kampala.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: BRAND_HEX,
    theme_color: BRAND_HEX,
    categories: ["auto", "lifestyle", "utilities"],
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

"use client";

import { useEffect } from "react";

import { withBase } from "@/lib/base-path";

/** Registers the service worker in production builds only (dev caching gets in the way). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    // ?slash=1 tells the worker that page URLs end in "/" (static export on GitHub Pages).
    const url = withBase("/sw.js") + (process.env.NEXT_PUBLIC_TRAILING_SLASH ? "?slash=1" : "");
    navigator.serviceWorker.register(url, { scope: withBase("/"), updateViaCache: "none" }).catch(() => {
      /* non-fatal: the app works without offline support */
    });
  }, []);
  return null;
}

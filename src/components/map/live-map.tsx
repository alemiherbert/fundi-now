"use client";

import dynamic from "next/dynamic";

import type { LiveMapProps } from "./live-map-impl";

/** MapLibre touches `window`, so it only loads in the browser. */
export const LiveMap = dynamic<LiveMapProps>(() => import("./live-map-impl"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse bg-muted" />,
});

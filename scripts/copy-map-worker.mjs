// MapLibre resolves its web worker relative to its own bundle file, which doesn't survive
// Turbopack bundling. Serve the (self-contained) worker from /public instead.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("public/vendor", { recursive: true });
copyFileSync("node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", "public/vendor/maplibre-gl-worker.mjs");

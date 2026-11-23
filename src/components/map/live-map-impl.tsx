"use client";

import { LngLatBounds, MapLibreMap, Marker, setWorkerUrl, type GeoJSONSource } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import { withBase } from "@/lib/base-path";
import { cn } from "@/lib/utils";

// Copied into /public by scripts/copy-map-worker.mjs (see package.json dev/build).
setWorkerUrl(withBase("/vendor/maplibre-gl-worker.mjs"));

type LngLat = [number, number];

export interface LiveMapProps {
  customer: LngLat;
  fundi?: LngLat | null;
  route?: LngLat[] | null;
  /** "route" fits the whole trip; "customer" centres on the customer. */
  focus?: "customer" | "route";
  interactive?: boolean;
  className?: string;
}

// Free OpenStreetMap vector tiles, no API key needed.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const ROUTE_COLOR = "#2b63e3";

const BIKE_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>';

function markerEl(kind: "customer" | "fundi") {
  const el = document.createElement("div");
  el.className = kind === "customer" ? "fn-marker-customer" : "fn-marker-fundi";
  if (kind === "fundi") el.innerHTML = BIKE_SVG;
  el.setAttribute("aria-label", kind === "customer" ? "Your location" : "Fundi location");
  return el;
}

function line(coordinates: LngLat[]): GeoJSON.Feature<GeoJSON.LineString> {
  return { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates } };
}

export default function LiveMapImpl({
  customer,
  fundi = null,
  route = null,
  focus = "customer",
  interactive = true,
  className,
}: LiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const fundiMarkerRef = useRef<Marker | null>(null);
  const routeRef = useRef<LngLat[] | null>(route);
  const [ready, setReady] = useState(false);
  const [cLng, cLat] = customer;

  // Latest route for callbacks that shouldn't re-run on every position tick.
  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  // Create the map once per customer location.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const map = new MapLibreMap({
      container,
      style: STYLE_URL,
      center: [cLng, cLat],
      zoom: 15.5,
      interactive,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    new Marker({ element: markerEl("customer") }).setLngLat([cLng, cLat]).addTo(map);

    map.on("load", () => {
      map.addSource("route", { type: "geojson", data: line(routeRef.current ?? []) });
      map.addLayer({
        id: "route-casing",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#ffffff", "line-width": 9 },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": ROUTE_COLOR, "line-width": 5 },
      });
      setReady(true);
    });

    return () => {
      fundiMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [cLng, cLat, interactive]);

  // Route line.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    (map.getSource("route") as GeoJSONSource | undefined)?.setData(line(route ?? []));
  }, [route, ready]);

  // Fundi marker.
  const fLng = fundi?.[0];
  const fLat = fundi?.[1];
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (fLng === undefined || fLat === undefined) {
      fundiMarkerRef.current?.remove();
      fundiMarkerRef.current = null;
      return;
    }
    if (!fundiMarkerRef.current) {
      fundiMarkerRef.current = new Marker({ element: markerEl("fundi") }).setLngLat([fLng, fLat]).addTo(map);
    } else {
      fundiMarkerRef.current.setLngLat([fLng, fLat]);
    }
  }, [fLng, fLat]);

  // Camera: fit when the focus mode changes, and again whenever the map is resized
  // (e.g. the bottom sheet grows), so the whole trip stays in view.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const fit = (animate: boolean) => {
      const r = routeRef.current;
      if (focus === "route" && r && r.length > 1) {
        const bounds = new LngLatBounds();
        r.forEach((p) => bounds.extend(p));
        bounds.extend([cLng, cLat]);
        map.fitBounds(bounds, {
          padding: { top: 80, bottom: 64, left: 48, right: 48 },
          maxZoom: 16,
          duration: animate ? 900 : 0,
        });
      } else {
        map.easeTo({ center: [cLng, cLat], zoom: 16, duration: animate ? 900 : 0 });
      }
    };
    fit(true);
    const onResize = () => fit(false);
    map.on("resize", onResize);
    return () => {
      map.off("resize", onResize);
    };
  }, [focus, ready, cLng, cLat]);

  // MapLibre's (unlayered) CSS forces `position: relative` on its container, which beats Tailwind's
  // layered `absolute`, so the positioned wrapper and the map container are separate elements.
  return (
    <div className={cn("absolute inset-0 bg-muted", className)}>
      <div ref={containerRef} className="size-full" />
    </div>
  );
}

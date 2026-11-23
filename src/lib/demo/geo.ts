import { ROUTE } from "./data";

export type LngLat = [number, number];

const EARTH_M = 6_371_000;
const rad = (d: number) => (d * Math.PI) / 180;

function distance(a: LngLat, b: LngLat) {
  const dLat = rad(b[1] - a[1]);
  const dLng = rad(b[0] - a[0]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.sqrt(s));
}

const cumulative: number[] = [];
ROUTE.forEach((p, i) => cumulative.push(i === 0 ? 0 : cumulative[i - 1] + distance(ROUTE[i - 1], p)));

export const ROUTE_LENGTH_M = cumulative[cumulative.length - 1];

/** Interpolated point at `progress` (0..1) along the route, plus the index of the next vertex. */
export function pointAlong(progress: number): { point: LngLat; index: number } {
  const target = Math.min(Math.max(progress, 0), 1) * ROUTE_LENGTH_M;
  let i = 1;
  while (i < cumulative.length && cumulative[i] < target) i++;
  if (i >= cumulative.length) return { point: ROUTE[ROUTE.length - 1], index: ROUTE.length - 1 };
  const seg = cumulative[i] - cumulative[i - 1] || 1;
  const t = (target - cumulative[i - 1]) / seg;
  const a = ROUTE[i - 1];
  const b = ROUTE[i];
  return { point: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], index: i };
}

/** The part of the route still to drive. */
export function remainingRoute(progress: number): LngLat[] {
  const { point, index } = pointAlong(progress);
  return [point, ...ROUTE.slice(index)];
}

export const kmLeft = (progress: number) => ((ROUTE_LENGTH_M * (1 - progress)) / 1000).toFixed(1);

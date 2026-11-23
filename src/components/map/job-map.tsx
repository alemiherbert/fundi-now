"use client";

import { ROUTE } from "@/lib/demo/data";
import { pointAlong, remainingRoute, type LngLat } from "@/lib/demo/geo";
import type { Job } from "@/lib/demo/store";

import { LiveMap } from "./live-map";

const ON_SITE = ["arrived", "diagnosing", "quote_pending", "in_progress", "completed", "paid", "reviewed"];

/** Map for an active job: fundi position and remaining route derived from the job status. */
export function JobMap({ job, progress, className }: { job: Job; progress: number; className?: string }) {
  const customer: LngLat = [job.location.lng, job.location.lat];
  let fundi: LngLat | null = null;
  let route: LngLat[] | null = null;

  if (job.status === "assigned") {
    fundi = ROUTE[0];
    route = ROUTE;
  } else if (job.status === "en_route") {
    fundi = pointAlong(progress).point;
    route = remainingRoute(progress);
  } else if (ON_SITE.includes(job.status)) {
    fundi = [customer[0] + 0.00018, customer[1] + 0.00012];
  }

  const focus = job.status === "assigned" || job.status === "en_route" ? "route" : "customer";
  return <LiveMap customer={customer} fundi={fundi} route={route} focus={focus} className={className} />;
}

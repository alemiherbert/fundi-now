"use client";

import { useEffect } from "react";

import { templateQuote, useActiveJob, useDemo } from "./store";

/**
 * Single-phone demo: plays the fundi's side automatically.
 * Every step is a guarded transition, so it's harmless if a real fundi screen acts first.
 */
export function useAutopilot() {
  const autopilot = useDemo((s) => s.autopilot);
  const job = useActiveJob();
  const id = job?.id;
  const status = job?.status;
  const serviceId = job?.serviceId;
  const enRouteAt = job?.enRouteAt;
  const tripMs = job?.tripMs;

  useEffect(() => {
    if (!autopilot || !id || !status) return;
    const { transition, sendQuote } = useDemo.getState();
    const after = (ms: number, fn: () => void) => {
      const t = window.setTimeout(fn, ms);
      return () => window.clearTimeout(t);
    };

    switch (status) {
      case "matching":
        return after(4000, () => transition("matching", "assigned"));
      case "assigned":
        return after(2500, () => transition("assigned", "en_route"));
      case "en_route": {
        const remaining = Math.max(0, (enRouteAt ?? Date.now()) + (tripMs ?? 0) - Date.now());
        return after(remaining + 400, () => transition("en_route", "arrived"));
      }
      case "arrived":
        return after(3500, () => transition("arrived", "diagnosing"));
      case "diagnosing":
        return after(4000, () => serviceId && sendQuote(templateQuote(serviceId)));
      case "in_progress":
        return after(6000, () => transition("in_progress", "completed"));
    }
  }, [autopilot, id, status, serviceId, enRouteAt, tripMs]);
}

import type { JobStatus } from "./store";

export const STATUS_LABEL: Record<JobStatus, string> = {
  matching: "Finding a fundi",
  assigned: "Fundi assigned",
  en_route: "On the way",
  arrived: "Fundi has arrived",
  diagnosing: "Checking your vehicle",
  quote_pending: "Quote ready to approve",
  in_progress: "Work in progress",
  completed: "Ready to pay",
  paid: "Paid",
  reviewed: "Completed",
  cancelled: "Cancelled",
};

export const TIMELINE: { key: string; label: string; statuses: JobStatus[] }[] = [
  { key: "assigned", label: "Assigned", statuses: ["assigned"] },
  { key: "en_route", label: "On the way", statuses: ["en_route"] },
  { key: "arrived", label: "Arrived", statuses: ["arrived", "diagnosing", "quote_pending"] },
  { key: "work", label: "Working", statuses: ["in_progress"] },
  { key: "done", label: "Done", statuses: ["completed", "paid", "reviewed"] },
];

export const timelineIndex = (status: JobStatus) => TIMELINE.findIndex((t) => t.statuses.includes(status));

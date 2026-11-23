"use client";

// Simulated backend for the client demo: one zustand store persisted to localStorage.
// Other tabs/iframes (e.g. the /demo presenter view) stay in sync via the `storage` event.

import { useEffect, useState, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  CALLOUT_FEE,
  COMMISSION_RATE,
  CUSTOMER,
  CUSTOMER_LOCATION,
  DEFAULT_VEHICLES,
  QUOTE_TEMPLATES,
  type Place,
  type ServiceId,
  type Vehicle,
} from "./data";

export type Role = "customer" | "fundi";

export type JobStatus =
  | "matching"
  | "assigned"
  | "en_route"
  | "arrived"
  | "diagnosing"
  | "quote_pending"
  | "in_progress"
  | "completed"
  | "paid"
  | "reviewed"
  | "cancelled";

export type PayMethod = "mtn" | "airtel" | "cash";

export interface QuoteItem {
  id: string;
  kind: "part" | "labour";
  label: string;
  amount: number;
}

export interface Job {
  id: string;
  ref: string;
  serviceId: ServiceId;
  vehicleId: string;
  notes: string;
  location: Place;
  status: JobStatus;
  createdAt: number;
  events: { status: JobStatus; at: number }[];
  startPin: string;
  tripMs: number;
  enRouteAt?: number;
  declinedByFundi?: boolean;
  quote?: { items: QuoteItem[]; status: "pending" | "approved" | "declined"; sentAt: number };
  payment?: { method: PayMethod; amount: number; phone?: string; ref: string; paidAt: number };
  rating?: { stars: number; tags: string[]; tip: number };
}

/** Statuses where a job is still open (before payment). */
export const OPEN_STATUSES: JobStatus[] = [
  "matching",
  "assigned",
  "en_route",
  "arrived",
  "diagnosing",
  "quote_pending",
  "in_progress",
  "completed",
];

/** Demo trip length. The UI still shows realistic minutes. */
export const TRIP_MS = 25_000;

const STORAGE_KEY = "fundi-now-demo";
const DAY = 86_400_000;
const noopStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
const rid = () => Math.random().toString(36).slice(2, 10);

export function templateQuote(serviceId: ServiceId): QuoteItem[] {
  return QUOTE_TEMPLATES[serviceId].map((item, i) => ({ ...item, id: `q${i}` }));
}

export function quoteTotal(items: QuoteItem[]) {
  return items.reduce((sum, i) => sum + (Number.isFinite(i.amount) ? i.amount : 0), 0) + CALLOUT_FEE;
}

/** Declined quote → only the call-out fee is due. */
export function amountDue(job: Job) {
  return job.quote?.status === "approved" ? quoteTotal(job.quote.items) : CALLOUT_FEE;
}

export function fundiEarning(job: Job) {
  const items = job.quote?.status === "approved" ? job.quote.items : [];
  const labour = items.filter((i) => i.kind === "labour").reduce((s, i) => s + i.amount, 0);
  const parts = items.filter((i) => i.kind === "part").reduce((s, i) => s + i.amount, 0);
  const service = labour + CALLOUT_FEE;
  const commission = Math.round(service * COMMISSION_RATE);
  const tip = job.rating?.tip ?? 0;
  const net = service - commission + tip;
  /** What the fundi receives: earnings plus parts paid back. */
  const payout = net + parts;
  return { labour, parts, service, commission, tip, net, payout };
}

function payRef(method: PayMethod) {
  if (method === "mtn") return `MP${digits(9)}`;
  if (method === "airtel") return `AM${digits(9)}`;
  return `CASH-${digits(5)}`;
}

function advance(job: Job, to: JobStatus, patch: Partial<Job> = {}): Job {
  const at = Date.now();
  return {
    ...job,
    ...patch,
    status: to,
    events: [...job.events, { status: to, at }],
    ...(to === "en_route" ? { enRouteAt: at } : {}),
  };
}

function pastJob(serviceId: ServiceId, vehicleId: string, daysAgo: number, method: PayMethod, stars: number): Job {
  const createdAt = Date.now() - daysAgo * DAY;
  const items = templateQuote(serviceId);
  return {
    id: rid(),
    ref: `FN-${digits(4)}`,
    serviceId,
    vehicleId,
    notes: "",
    location: CUSTOMER_LOCATION,
    status: "reviewed",
    createdAt,
    events: [{ status: "matching", at: createdAt }],
    startPin: digits(4),
    tripMs: TRIP_MS,
    quote: { items, status: "approved", sentAt: createdAt },
    payment: { method, amount: quoteTotal(items), ref: payRef(method), paidAt: createdAt + 3_600_000 },
    rating: { stars, tags: [], tip: 0 },
  };
}

interface DemoData {
  /** Simulate the fundi's actions automatically (single-phone demo). */
  autopilot: boolean;
  session: Record<Role, boolean>;
  fundiOnline: boolean;
  whatsappUpdates: boolean;
  vehicles: Vehicle[];
  jobs: Job[];
  activeJobId: string | null;
  withdrawn: number;
}

function initialData(): DemoData {
  return {
    autopilot: true,
    session: { customer: false, fundi: false },
    fundiOnline: false,
    whatsappUpdates: true,
    vehicles: DEFAULT_VEHICLES,
    jobs: [
      pastJob("flat_tyre", "v1", 9, "mtn", 5),
      pastJob("service", "v1", 34, "airtel", 5),
      pastJob("boda", "v2", 52, "cash", 4),
    ],
    activeJobId: null,
    withdrawn: 0,
  };
}

interface DemoActions {
  signIn: (role: Role) => void;
  signOut: (role: Role) => void;
  setAutopilot: (v: boolean) => void;
  setFundiOnline: (v: boolean) => void;
  setWhatsappUpdates: (v: boolean) => void;
  addVehicle: (v: Omit<Vehicle, "id">) => void;
  createJob: (input: { serviceId: ServiceId; vehicleId: string; notes: string; landmark: string }) => Job;
  createSampleJob: () => void;
  transition: (from: JobStatus | JobStatus[], to: JobStatus) => boolean;
  declineOffer: () => void;
  cancelJob: () => void;
  sendQuote: (items: QuoteItem[]) => void;
  approveQuote: () => void;
  declineQuote: () => void;
  pay: (method: PayMethod, phone?: string) => void;
  rate: (stars: number, tags: string[], tip: number) => void;
  finishJob: () => void;
  withdraw: (amount: number) => void;
  /** Presenter helper: perform whatever the next step of the active job is. */
  advanceDemo: () => void;
  reset: () => void;
}

export type DemoState = DemoData & DemoActions;

export const useDemo = create<DemoState>()(
  persist(
    (set, get) => {
      const updateActive = (fn: (job: Job) => Job | null): boolean => {
        const { activeJobId, jobs } = get();
        if (!activeJobId) return false;
        let changed = false;
        const next = jobs.map((job) => {
          if (job.id !== activeJobId) return job;
          const updated = fn(job);
          if (!updated) return job;
          changed = true;
          return updated;
        });
        if (changed) set({ jobs: next });
        return changed;
      };

      return {
        ...initialData(),

        signIn: (role) =>
          set((s) => ({ session: { ...s.session, [role]: true }, ...(role === "fundi" ? { fundiOnline: true } : {}) })),
        signOut: (role) =>
          set((s) => ({ session: { ...s.session, [role]: false }, ...(role === "fundi" ? { fundiOnline: false } : {}) })),
        setAutopilot: (v) => set({ autopilot: v }),
        setFundiOnline: (v) => set({ fundiOnline: v }),
        setWhatsappUpdates: (v) => set({ whatsappUpdates: v }),
        addVehicle: (v) => set((s) => ({ vehicles: [...s.vehicles, { ...v, id: rid() }] })),

        createJob: ({ serviceId, vehicleId, notes, landmark }) => {
          const at = Date.now();
          const job: Job = {
            id: rid(),
            ref: `FN-${digits(4)}`,
            serviceId,
            vehicleId,
            notes,
            location: { ...CUSTOMER_LOCATION, landmark: landmark.trim() || CUSTOMER_LOCATION.landmark },
            status: "matching",
            createdAt: at,
            events: [{ status: "matching", at }],
            startPin: String(1000 + Math.floor(Math.random() * 9000)),
            tripMs: TRIP_MS,
          };
          set((s) => ({ jobs: [job, ...s.jobs], activeJobId: job.id }));
          return job;
        },

        createSampleJob: () => {
          const { activeJobId, vehicles, createJob } = get();
          if (activeJobId) return;
          createJob({
            serviceId: "battery",
            vehicleId: vehicles[0]?.id ?? "v1",
            notes: "Car won't start, just clicks",
            landmark: "",
          });
        },

        transition: (from, to) => {
          const froms = Array.isArray(from) ? from : [from];
          return updateActive((j) => (froms.includes(j.status) ? advance(j, to) : null));
        },

        declineOffer: () => {
          updateActive((j) => (j.status === "matching" ? { ...j, declinedByFundi: true } : null));
        },

        cancelJob: () => {
          updateActive((j) => (["matching", "assigned", "en_route"].includes(j.status) ? advance(j, "cancelled") : null));
          set({ activeJobId: null });
        },

        sendQuote: (items) => {
          updateActive((j) =>
            j.status === "diagnosing"
              ? advance(j, "quote_pending", { quote: { items, status: "pending", sentAt: Date.now() } })
              : null,
          );
        },

        approveQuote: () => {
          updateActive((j) =>
            j.status === "quote_pending" && j.quote
              ? advance(j, "in_progress", { quote: { ...j.quote, status: "approved" } })
              : null,
          );
        },

        declineQuote: () => {
          updateActive((j) =>
            j.status === "quote_pending" && j.quote
              ? advance(j, "completed", { quote: { ...j.quote, status: "declined" } })
              : null,
          );
        },

        pay: (method, phone) => {
          updateActive((j) =>
            j.status === "completed"
              ? advance(j, "paid", {
                  payment: { method, phone, amount: amountDue(j), ref: payRef(method), paidAt: Date.now() },
                })
              : null,
          );
        },

        rate: (stars, tags, tip) => {
          updateActive((j) => (j.status === "paid" ? advance(j, "reviewed", { rating: { stars, tags, tip } }) : null));
        },

        finishJob: () => set({ activeJobId: null }),
        withdraw: (amount) => set((s) => ({ withdrawn: s.withdrawn + amount })),

        advanceDemo: () => {
          const { activeJobId, jobs, transition, sendQuote, approveQuote, pay, rate, createSampleJob } = get();
          const job = jobs.find((j) => j.id === activeJobId);
          if (!job) return createSampleJob();
          switch (job.status) {
            case "matching":
              transition("matching", "assigned");
              break;
            case "assigned":
              transition("assigned", "en_route");
              break;
            case "en_route":
              transition("en_route", "arrived");
              break;
            case "arrived":
              transition("arrived", "diagnosing");
              break;
            case "diagnosing":
              sendQuote(templateQuote(job.serviceId));
              break;
            case "quote_pending":
              approveQuote();
              break;
            case "in_progress":
              transition("in_progress", "completed");
              break;
            case "completed":
              pay("mtn", CUSTOMER.phone);
              break;
            case "paid":
              rate(5, ["On time", "Fair price"], 0);
              break;
          }
        },

        reset: () => set(initialData()),
      };
    },
    {
      name: STORAGE_KEY,
      version: 1,
      // Browser only: Node 26 exposes its own experimental localStorage on the server.
      storage: createJSONStorage(() => (typeof window === "undefined" ? noopStorage : window.localStorage)),
      skipHydration: true,
      partialize: ({ autopilot, session, fundiOnline, whatsappUpdates, vehicles, jobs, activeJobId, withdrawn }) => ({
        autopilot,
        session,
        fundiOnline,
        whatsappUpdates,
        vehicles,
        jobs,
        activeJobId,
        withdrawn,
      }),
    },
  ),
);

export function useActiveJob() {
  return useDemo((s) => (s.activeJobId ? (s.jobs.find((j) => j.id === s.activeJobId) ?? null) : null));
}

const subscribeHydration = (cb: () => void) => useDemo.persist.onFinishHydration(cb);

/** False on the server and until localStorage has been read on the client. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => useDemo.persist.hasHydrated(),
    () => false,
  );
}

/** Loads persisted state and keeps this document in sync with other tabs/iframes. */
export function DemoStoreSync() {
  useEffect(() => {
    void useDemo.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) void useDemo.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}

export function useNow(intervalMs = 1000, enabled = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, enabled]);
  return now;
}

const AFTER_ARRIVAL: JobStatus[] = ["arrived", "diagnosing", "quote_pending", "in_progress", "completed", "paid", "reviewed"];

/** 0..1 progress of the fundi's trip, derived from timestamps so every view agrees. */
export function tripProgress(job: Job | null, now: number) {
  if (!job) return 0;
  if (job.status === "en_route") {
    if (!job.enRouteAt) return 0;
    return Math.min(1, Math.max(0, (now - job.enRouteAt) / job.tripMs));
  }
  return AFTER_ARRIVAL.includes(job.status) ? 1 : 0;
}

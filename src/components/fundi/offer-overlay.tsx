"use client";

import { Clock, MapPin, MessageSquareQuote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { CALLOUT_FEE, COMMISSION_RATE, QUOTE_TEMPLATES, ROUTE_MINUTES, serviceById, vehicleName } from "@/lib/demo/data";
import { ROUTE_LENGTH_M } from "@/lib/demo/geo";
import { useActiveJob, useDemo, type Job } from "@/lib/demo/store";
import { ugx } from "@/lib/format";

const OFFER_SECONDS = 30;

/** Full-screen incoming job offer for an online fundi. */
export function OfferOverlay() {
  const router = useRouter();
  const job = useActiveJob();
  const online = useDemo((s) => s.fundiOnline);
  const transition = useDemo((s) => s.transition);
  const declineOffer = useDemo((s) => s.declineOffer);

  if (!job || job.status !== "matching" || !online || job.declinedByFundi) return null;

  return (
    <OfferCard
      key={job.id}
      job={job}
      onAccept={() => {
        if (transition("matching", "assigned")) router.push("/fundi/job");
      }}
      onDecline={declineOffer}
    />
  );
}

function OfferCard({ job, onAccept, onDecline }: { job: Job; onAccept: () => void; onDecline: () => void }) {
  const [left, setLeft] = useState(OFFER_SECONDS);
  const vehicle = useDemo((s) => s.vehicles.find((v) => v.id === job.vehicleId));
  const service = serviceById(job.serviceId);
  const labour = QUOTE_TEMPLATES[job.serviceId].filter((i) => i.kind === "labour").reduce((s, i) => s + i.amount, 0);
  const estimate = Math.round((labour + CALLOUT_FEE) * (1 - COMMISSION_RATE));

  useEffect(() => {
    navigator.vibrate?.([200, 100, 200]);
    const id = window.setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (left === 0) onDecline();
  }, [left, onDecline]);

  const r = 22;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="offer-title"
      className="fixed inset-0 z-50 mx-auto flex w-full max-w-md flex-col bg-background px-5 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),1.25rem)] animate-in fade-in slide-in-from-bottom-6"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground uppercase">
          New job
        </span>
        <div className="relative size-14" aria-label={`${left} seconds left`}>
          <svg viewBox="0 0 52 52" className="size-14 -rotate-90">
            <circle cx="26" cy="26" r={r} className="fill-none stroke-muted" strokeWidth="4" />
            <circle
              cx="26"
              cy="26"
              r={r}
              className="fill-none stroke-primary transition-[stroke-dashoffset] duration-1000 ease-linear"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - left / OFFER_SECONDS)}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold">{left}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-1 flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <ServiceIcon id={job.serviceId} className="size-8" />
          </span>
          <div>
            <h2 id="offer-title" className="font-heading text-2xl font-bold tracking-tight">
              {service.name}
            </h2>
            <p className="text-muted-foreground">
              {vehicleName(vehicle)}
              {vehicle ? ` · ${vehicle.plate}` : ""}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
          <p className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
            <span>
              <span className="block font-semibold">
                {job.location.label}, {job.location.area.split(",")[0]}
              </span>
              <span className="block text-sm text-muted-foreground">{job.location.landmark}</span>
            </span>
          </p>
          <p className="flex items-center gap-3 text-sm">
            <Clock className="size-5 shrink-0 text-primary" />
            {(ROUTE_LENGTH_M / 1000).toFixed(1)} km · about {ROUTE_MINUTES} min away
          </p>
          {job.notes && (
            <p className="flex items-start gap-3 text-sm">
              <MessageSquareQuote className="size-5 shrink-0 text-primary" />
              <span className="italic">“{job.notes}”</span>
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-success/10 p-4">
          <p className="text-sm text-muted-foreground">Estimated earning</p>
          <p className="font-heading text-3xl font-bold tabular-nums">{ugx(estimate)}</p>
          <p className="text-xs text-muted-foreground">After 15% commission · parts paid back in full</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1.4fr] gap-3 pt-4">
        <Button variant="outline" size="lg" className="h-14 text-base" onClick={onDecline}>
          Decline
        </Button>
        <Button size="lg" className="h-14 text-base" onClick={onAccept}>
          Accept job
        </Button>
      </div>
    </div>
  );
}

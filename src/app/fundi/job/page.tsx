"use client";

import { ArrowLeft, CheckCircle2, MapPin, MessageCircle, Navigation, Phone, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { QuoteBuilder } from "@/components/fundi/quote-builder";
import { ChatDrawer } from "@/components/job/chat-drawer";
import { METHOD_LABEL } from "@/components/job/network-chip";
import { PriceBreakdown } from "@/components/job/price-breakdown";
import { StatusTimeline } from "@/components/job/status-timeline";
import { JobMap } from "@/components/map/job-map";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { CUSTOMER, ROUTE_MINUTES, serviceById, vehicleName } from "@/lib/demo/data";
import { kmLeft } from "@/lib/demo/geo";
import { amountDue, fundiEarning, tripProgress, useActiveJob, useDemo, useNow, type Job } from "@/lib/demo/store";
import { ugx } from "@/lib/format";

export default function FundiJobPage() {
  const router = useRouter();
  const job = useActiveJob();
  const now = useNow(500, job?.status === "en_route");
  const [chatOpen, setChatOpen] = useState(false);
  const visible = !!job && job.status !== "matching" && job.status !== "cancelled";

  useEffect(() => {
    if (!visible) router.replace("/fundi");
  }, [visible, router]);

  if (!job || !visible) return null;
  const progress = tripProgress(job, now);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background/95 px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 backdrop-blur-lg">
        <Button asChild variant="ghost" size="icon-lg" className="-ml-2">
          <Link href="/fundi" aria-label="Back to jobs">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{CUSTOMER.name}</p>
          <p className="text-xs text-muted-foreground">Job {job.ref}</p>
        </div>
        <Button variant="secondary" size="icon-lg" aria-label="Chat" onClick={() => setChatOpen(true)}>
          <MessageCircle className="size-5" />
        </Button>
        <Button asChild variant="secondary" size="icon-lg">
          <a href={`tel:${CUSTOMER.phone.replace(/\s/g, "")}`} aria-label={`Call ${CUSTOMER.first}`}>
            <Phone className="size-5" />
          </a>
        </Button>
      </header>

      <div className="relative h-52 shrink-0">
        <JobMap job={job} progress={progress} />
      </div>

      <div className="flex-1 space-y-4 p-4 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <JobDetails job={job} />
        <StatusTimeline status={job.status} />
        <StepPanel job={job} progress={progress} />
      </div>
      <ChatDrawer open={chatOpen} onOpenChange={setChatOpen} as="fundi" />
    </div>
  );
}

function JobDetails({ job }: { job: Job }) {
  const vehicle = useDemo((s) => s.vehicles.find((v) => v.id === job.vehicleId));
  return (
    <div className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <ServiceIcon id={job.serviceId} className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold">{serviceById(job.serviceId).name}</p>
          <p className="text-sm text-muted-foreground">
            {vehicleName(vehicle)} · <span className="font-mono">{vehicle?.plate}</span>
          </p>
        </div>
      </div>
      <p className="flex items-start gap-2 text-sm">
        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>
          {job.location.label}, {job.location.area} · <span className="text-muted-foreground">{job.location.landmark}</span>
        </span>
      </p>
      {job.notes && <p className="rounded-xl bg-muted/60 p-3 text-sm italic">“{job.notes}”</p>}
    </div>
  );
}

function StepPanel({ job, progress }: { job: Job; progress: number }) {
  const router = useRouter();
  const transition = useDemo((s) => s.transition);
  const [pin, setPin] = useState("");
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${job.location.lat},${job.location.lng}&travelmode=driving`;

  switch (job.status) {
    case "assigned":
      return (
        <div className="space-y-2">
          <Button size="lg" className="h-14 w-full text-base" onClick={() => transition("assigned", "en_route")}>
            <Navigation data-icon="inline-start" /> Start trip to {CUSTOMER.first}
          </Button>
          <Button asChild variant="outline" className="h-11 w-full">
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </Button>
        </div>
      );

    case "en_route": {
      const minutes = Math.max(1, Math.ceil((1 - progress) * ROUTE_MINUTES));
      return (
        <div className="space-y-3">
          <div className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
            <div className="flex items-baseline justify-between">
              <p className="font-heading text-xl font-bold">{minutes} min away</p>
              <p className="text-sm text-muted-foreground">{kmLeft(progress)} km</p>
            </div>
            <Progress value={progress * 100} className="mt-3 h-2" />
          </div>
          <Button size="lg" className="h-14 w-full text-base" onClick={() => transition("en_route", "arrived")}>
            I’ve arrived
          </Button>
        </div>
      );
    }

    case "arrived":
      return (
        <div className="space-y-4 rounded-2xl bg-card p-4 text-center ring-1 ring-foreground/10">
          <div>
            <p className="font-heading text-xl font-bold">Ask {CUSTOMER.first} for the start PIN</p>
            <p className="text-sm text-muted-foreground">It confirms you’re the right fundi.</p>
          </div>
          <div className="flex justify-center">
            <InputOTP maxLength={4} value={pin} onChange={setPin}>
              <InputOTPGroup>
                {Array.from({ length: 4 }, (_, i) => (
                  <InputOTPSlot key={i} index={i} className="size-14 text-xl" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-xs text-muted-foreground">
            Demo: the PIN is <span className="font-mono font-semibold text-foreground">{job.startPin}</span>
          </p>
          <Button
            size="lg"
            className="h-14 w-full text-base"
            disabled={pin.length < 4}
            onClick={() => {
              if (pin !== job.startPin) {
                toast.error("That PIN doesn’t match. Ask again.");
                setPin("");
                return;
              }
              transition("arrived", "diagnosing");
            }}
          >
            Verify & start
          </Button>
        </div>
      );

    case "diagnosing":
      return <QuoteBuilder job={job} />;

    case "quote_pending":
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4 text-sm">
            <Spinner className="text-primary" /> Waiting for {CUSTOMER.first} to approve…
          </div>
          {job.quote && <PriceBreakdown items={job.quote.items} />}
        </div>
      );

    case "in_progress":
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-success/10 p-4">
            <CheckCircle2 className="size-6 shrink-0 text-success" />
            <div>
              <p className="font-semibold">Quote approved: {ugx(amountDue(job))}</p>
              <p className="text-sm text-muted-foreground">Go ahead with the work.</p>
            </div>
          </div>
          <Button size="lg" className="h-14 w-full text-base" onClick={() => transition("in_progress", "completed")}>
            Mark job as complete
          </Button>
        </div>
      );

    case "completed":
      return (
        <div className="space-y-3">
          {job.quote?.status === "declined" && (
            <p className="rounded-2xl bg-muted/60 p-4 text-sm">
              {CUSTOMER.first} declined the quote. The call-out fee is still paid.
            </p>
          )}
          <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4 text-sm">
            <Spinner className="text-primary" /> Waiting for payment of {ugx(amountDue(job))}…
          </div>
        </div>
      );

    case "paid":
    case "reviewed": {
      const e = fundiEarning(job);
      return (
        <div className="space-y-4">
          <div className="rounded-2xl bg-success/10 p-4 text-center">
            <CheckCircle2 className="mx-auto size-10 text-success" />
            <p className="mt-2 font-heading text-xl font-bold">Payment received</p>
            {job.payment && (
              <p className="text-sm text-muted-foreground">
                {ugx(job.payment.amount)} via {METHOD_LABEL[job.payment.method]}
              </p>
            )}
          </div>
          <div className="space-y-2 rounded-2xl bg-card p-4 text-sm ring-1 ring-foreground/10">
            <Line label="Labour + call-out" value={ugx(e.service)} />
            <Line label="Fundi Now commission (15%)" value={`− ${ugx(e.commission)}`} />
            {e.parts > 0 && <Line label="Parts paid back" value={ugx(e.parts)} />}
            {e.tip > 0 && <Line label="Tip" value={ugx(e.tip)} />}
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Paid to you</span>
              <span className="tabular-nums">{ugx(e.payout)}</span>
            </div>
          </div>
          {job.rating && (
            <p className="flex items-center justify-center gap-1 text-sm">
              {CUSTOMER.first} rated you {job.rating.stars}
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
            </p>
          )}
          <Button size="lg" className="h-14 w-full text-base" onClick={() => router.push("/fundi")}>
            Back to jobs
          </Button>
        </div>
      );
    }

    default:
      return null;
  }
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

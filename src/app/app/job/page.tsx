"use client";

import { ArrowLeft, CheckCircle2, Hammer, Star, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ChatDrawer } from "@/components/job/chat-drawer";
import { FundiCard } from "@/components/job/fundi-card";
import { METHOD_LABEL, NetworkChip } from "@/components/job/network-chip";
import { PaymentDrawer } from "@/components/job/payment-drawer";
import { PriceBreakdown } from "@/components/job/price-breakdown";
import { StartPin } from "@/components/job/start-pin";
import { StatusTimeline } from "@/components/job/status-timeline";
import { JobMap } from "@/components/map/job-map";
import { MatchingRadar } from "@/components/map/matching-radar";
import { ServiceIcon } from "@/components/service-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CALLOUT_FEE, CUSTOMER, FUNDI, ROUTE_MINUTES, serviceById, vehicleName } from "@/lib/demo/data";
import { kmLeft } from "@/lib/demo/geo";
import { amountDue, quoteTotal, tripProgress, useActiveJob, useDemo, useNow, type Job } from "@/lib/demo/store";
import { ugx } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CustomerJobPage() {
  const router = useRouter();
  const job = useActiveJob();
  const now = useNow(500, job?.status === "en_route");

  useEffect(() => {
    if (!job) router.replace("/app");
  }, [job, router]);

  if (!job) return null;
  const progress = tripProgress(job, now);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="relative min-h-0 flex-1">
        <JobMap job={job} progress={progress} className="fn-map-raised" />
        {job.status === "matching" && <MatchingRadar />}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 pt-[max(env(safe-area-inset-top),1rem)]">
          <Button asChild size="icon-lg" variant="secondary" className="rounded-full bg-background shadow-md">
            <Link href="/app" aria-label="Back to home">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <Badge variant="secondary" className="h-8 rounded-full bg-background px-3 text-sm shadow-md">
            {job.ref}
          </Badge>
        </div>
      </div>

      <section className="relative z-10 -mt-6 max-h-[64dvh] overflow-y-auto rounded-t-3xl border-t bg-background px-4 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)] shadow-[0_-8px_30px_rgb(0_0_0/0.08)]">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" aria-hidden="true" />
        <JobPanel job={job} progress={progress} />
      </section>
    </div>
  );
}

function JobPanel({ job, progress }: { job: Job; progress: number }) {
  switch (job.status) {
    case "matching":
      return <Matching job={job} />;
    case "assigned":
    case "en_route":
    case "arrived":
      return <OnTheWay job={job} progress={progress} />;
    case "diagnosing":
      return <Diagnosing job={job} />;
    case "quote_pending":
      return <QuoteApproval job={job} />;
    case "in_progress":
      return <InProgress job={job} />;
    case "completed":
      return <PayNow job={job} />;
    case "paid":
      return <RateJob job={job} />;
    case "reviewed":
      return <Done job={job} />;
    default:
      return null;
  }
}

function JobSummary({ job }: { job: Job }) {
  const vehicle = useDemo((s) => s.vehicles.find((v) => v.id === job.vehicleId));
  const service = serviceById(job.serviceId);
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-background text-primary">
        <ServiceIcon id={job.serviceId} className="size-5" />
      </span>
      <div className="min-w-0 text-sm">
        <p className="font-semibold">{service.name}</p>
        <p className="truncate text-muted-foreground">
          {vehicleName(vehicle)} · {job.location.landmark}
        </p>
      </div>
    </div>
  );
}

function Matching({ job }: { job: Job }) {
  const cancelJob = useDemo((s) => s.cancelJob);
  return (
    <div className="space-y-4">
      <div>
        <p className="font-heading text-2xl font-bold tracking-tight">Finding your fundi…</p>
        <p className="text-sm text-muted-foreground">
          {job.declinedByFundi
            ? "The nearest fundi is busy. Trying the next one."
            : "Contacting verified fundis near Ntinda. Usually under a minute."}
        </p>
      </div>
      <JobSummary job={job} />
      <Button
        variant="ghost"
        className="h-12 w-full text-destructive hover:text-destructive"
        onClick={() => {
          cancelJob();
          toast("Request cancelled");
        }}
      >
        Cancel request
      </Button>
    </div>
  );
}

function OnTheWay({ job, progress }: { job: Job; progress: number }) {
  const cancelJob = useDemo((s) => s.cancelJob);
  const [chatOpen, setChatOpen] = useState(false);
  const minutes = Math.max(1, Math.ceil((1 - progress) * ROUTE_MINUTES));

  const headline =
    job.status === "assigned"
      ? `${FUNDI.first} accepted your request`
      : job.status === "en_route"
        ? `Arriving in ${minutes} min`
        : `${FUNDI.first} has arrived`;
  const sub =
    job.status === "assigned"
      ? `Leaving now · about ${ROUTE_MINUTES} min away`
      : job.status === "en_route"
        ? `${FUNDI.first} is on the way · ${kmLeft(progress)} km`
        : "Share your start PIN so the job can begin";

  return (
    <div className="space-y-4">
      <div>
        <p className="font-heading text-2xl font-bold tracking-tight">{headline}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
      <StatusTimeline status={job.status} />
      <FundiCard jobRef={job.ref} onChat={() => setChatOpen(true)} />
      <StartPin pin={job.startPin} />
      {job.status !== "arrived" && (
        <Button
          variant="ghost"
          className="h-11 w-full text-muted-foreground"
          onClick={() => {
            cancelJob();
            toast("Request cancelled");
          }}
        >
          Cancel request
        </Button>
      )}
      <ChatDrawer open={chatOpen} onOpenChange={setChatOpen} as="customer" />
    </div>
  );
}

function Diagnosing({ job }: { job: Job }) {
  const vehicle = useDemo((s) => s.vehicles.find((v) => v.id === job.vehicleId));
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Wrench className="size-6" />
        </span>
        <div>
          <p className="font-heading text-xl font-bold tracking-tight">
            {FUNDI.first} is checking your {vehicleName(vehicle)}
          </p>
          <p className="text-sm text-muted-foreground">You’ll approve the price before any work starts.</p>
        </div>
      </div>
      <StatusTimeline status={job.status} />
      <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4 text-sm">
        <Spinner className="text-primary" /> Waiting for the quote…
      </div>
      <FundiCard jobRef={job.ref} compact />
    </div>
  );
}

function QuoteApproval({ job }: { job: Job }) {
  const approveQuote = useDemo((s) => s.approveQuote);
  const declineQuote = useDemo((s) => s.declineQuote);
  if (!job.quote) return null;
  const total = quoteTotal(job.quote.items);
  return (
    <div className="space-y-4">
      <div>
        <p className="font-heading text-2xl font-bold tracking-tight">Your quote is ready</p>
        <p className="text-sm text-muted-foreground">
          From {FUNDI.short} · {serviceById(job.serviceId).name}
        </p>
      </div>
      <PriceBreakdown items={job.quote.items} />
      <Button
        size="lg"
        className="h-14 w-full text-base"
        onClick={() => {
          approveQuote();
          toast.success("Quote approved", { description: `${FUNDI.first} can start the work.` });
        }}
      >
        Approve {ugx(total)}
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="h-11" onClick={() => toast("Question sent to Kato")}>
          Ask a question
        </Button>
        <Button variant="outline" className="h-11 text-destructive hover:text-destructive" onClick={declineQuote}>
          Decline
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        If you decline, you only pay the {ugx(CALLOUT_FEE)} call-out fee.
      </p>
    </div>
  );
}

function InProgress({ job }: { job: Job }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 animate-pulse items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Hammer className="size-6" />
        </span>
        <div>
          <p className="font-heading text-xl font-bold tracking-tight">Work in progress</p>
          <p className="text-sm text-muted-foreground">We’ll let you know the moment it’s done.</p>
        </div>
      </div>
      <StatusTimeline status={job.status} />
      <div className="flex items-baseline justify-between rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
        <span className="text-sm text-muted-foreground">Approved total</span>
        <span className="font-heading text-xl font-bold tabular-nums">{ugx(amountDue(job))}</span>
      </div>
      <FundiCard jobRef={job.ref} compact />
    </div>
  );
}

function PayNow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const amount = amountDue(job);
  const declined = job.quote?.status === "declined";
  return (
    <div className="space-y-4">
      <div>
        <p className="font-heading text-2xl font-bold tracking-tight">{declined ? "Quote declined" : "All done! 🎉"}</p>
        <p className="text-sm text-muted-foreground">
          {declined ? "You only pay the call-out fee." : `${FUNDI.first} has finished the job. Check it, then pay.`}
        </p>
      </div>
      <StatusTimeline status={job.status} />
      <PriceBreakdown items={job.quote?.items ?? []} calloutOnly={declined || !job.quote} />
      <Button size="lg" className="h-14 w-full text-base" onClick={() => setOpen(true)}>
        Pay {ugx(amount)}
      </Button>
      <div className="flex items-center justify-center gap-2">
        <NetworkChip method="mtn" className="size-8 rounded-lg text-[9px]" />
        <NetworkChip method="airtel" className="size-8 rounded-lg text-[9px]" />
        <NetworkChip method="cash" className="size-8 rounded-lg" />
      </div>
      <PaymentDrawer open={open} onOpenChange={setOpen} amount={amount} jobRef={job.ref} />
    </div>
  );
}

const TAGS = ["On time", "Friendly", "Fair price", "Explained clearly", "Expert"];
const TIPS = [0, 2000, 5000, 10000];

function RateJob({ job }: { job: Job }) {
  const rate = useDemo((s) => s.rate);
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [tip, setTip] = useState(0);
  return (
    <div className="space-y-5">
      {job.payment && (
        <div className="flex items-center gap-3 rounded-2xl bg-success/10 p-3">
          <NetworkChip method={job.payment.method} />
          <div className="min-w-0 text-sm">
            <p className="font-semibold">Paid {ugx(job.payment.amount)}</p>
            <p className="truncate text-muted-foreground">
              {METHOD_LABEL[job.payment.method]} · Ref {job.payment.ref}
            </p>
          </div>
          <CheckCircle2 className="ml-auto size-5 shrink-0 text-success" />
        </div>
      )}
      <div className="text-center">
        <p className="font-heading text-xl font-bold">How was {FUNDI.first}?</p>
        <div className="mt-3 flex justify-center gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={stars === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setStars(n)}
              className="p-1"
            >
              <Star className={cn("size-9 text-muted-foreground/40", n <= stars && "fill-yellow-400 text-yellow-400")} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {TAGS.map((t) => (
          <Button
            key={t}
            size="sm"
            variant={tags.includes(t) ? "default" : "outline"}
            onClick={() => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))}
          >
            {t}
          </Button>
        ))}
      </div>
      <div>
        <p className="mb-2 text-center text-sm text-muted-foreground">Add a tip? 100% goes to {FUNDI.first}</p>
        <div className="grid grid-cols-4 gap-2">
          {TIPS.map((t) => (
            <Button key={t} variant={tip === t ? "default" : "outline"} className="h-11" onClick={() => setTip(t)}>
              {t === 0 ? "None" : `${t / 1000}k`}
            </Button>
          ))}
        </div>
      </div>
      <Button size="lg" className="h-14 w-full text-base" onClick={() => rate(stars, tags, tip)}>
        Submit
      </Button>
    </div>
  );
}

function Done({ job }: { job: Job }) {
  const router = useRouter();
  const finishJob = useDemo((s) => s.finishJob);
  return (
    <div className="space-y-5 py-2 text-center">
      <CheckCircle2 className="mx-auto size-16 text-success" />
      <div>
        <p className="font-heading text-2xl font-bold">Thanks, {CUSTOMER.first}!</p>
        <p className="text-sm text-muted-foreground">
          Job {job.ref} is complete. Your receipt is in Jobs.
        </p>
      </div>
      {job.payment && (
        <div className="rounded-2xl bg-card p-4 text-left text-sm ring-1 ring-foreground/10">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paid</span>
            <span className="font-semibold tabular-nums">{ugx(job.payment.amount)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-muted-foreground">Method</span>
            <span>{METHOD_LABEL[job.payment.method]}</span>
          </div>
          {!!job.rating?.tip && (
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Tip</span>
              <span className="tabular-nums">{ugx(job.rating.tip)}</span>
            </div>
          )}
        </div>
      )}
      <Button
        size="lg"
        className="h-14 w-full text-base"
        onClick={() => {
          finishJob();
          router.push("/app");
        }}
      >
        Back to home
      </Button>
    </div>
  );
}

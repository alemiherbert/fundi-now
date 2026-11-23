"use client";

import { ChevronRight, Flame, Power, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { CUSTOMER, FUNDI, serviceById } from "@/lib/demo/data";
import { STATUS_LABEL } from "@/lib/demo/status";
import { fundiEarning, useActiveJob, useDemo, useNow } from "@/lib/demo/store";
import { formatDate, ugx } from "@/lib/format";

export default function FundiHome() {
  const online = useDemo((s) => s.fundiOnline);
  const setOnline = useDemo((s) => s.setFundiOnline);
  const jobs = useDemo((s) => s.jobs);
  const job = useActiveJob();
  const now = useNow(60_000);

  const current = job && job.status !== "matching" && job.status !== "cancelled" ? job : null;
  const dayStart = new Date(now).setHours(0, 0, 0, 0);
  const paid = jobs.filter((j) => j.payment);
  const today = paid.filter((j) => (j.payment?.paidAt ?? 0) >= dayStart);
  const todayNet = today.reduce((s, j) => s + fundiEarning(j).payout, 0);

  return (
    <div className="space-y-5 px-4 pt-4">
      {current && (
        <Link
          href="/fundi/job"
          className="flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-lg shadow-primary/20"
        >
          <span className="flex size-12 items-center justify-center rounded-xl bg-white/15">
            <ServiceIcon id={current.serviceId} className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold tracking-wide uppercase opacity-80">Current job</span>
            <span className="block font-semibold">
              {serviceById(current.serviceId).name} · {CUSTOMER.first}
            </span>
            <span className="block text-sm opacity-80">{STATUS_LABEL[current.status]}</span>
          </span>
          <ChevronRight className="size-5" />
        </Link>
      )}

      {!current &&
        (online ? (
          <div className="relative overflow-hidden rounded-3xl bg-card p-6 text-center ring-1 ring-foreground/10">
            <div className="relative mx-auto mb-4 size-20">
              <span className="fn-radar absolute inset-0 rounded-full bg-success/30" />
              <span className="fn-radar absolute inset-0 rounded-full bg-success/30" style={{ animationDelay: "1.2s" }} />
              <span className="absolute inset-[28%] rounded-full bg-success" />
            </div>
            <p className="font-heading text-lg font-bold">Looking for jobs near you</p>
            <p className="text-sm text-muted-foreground">Keep the app open. New requests pop up here.</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-card p-6 text-center ring-1 ring-foreground/10">
            <span className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-muted">
              <Power className="size-7 text-muted-foreground" />
            </span>
            <p className="font-heading text-lg font-bold">You’re offline</p>
            <p className="mb-4 text-sm text-muted-foreground">Go online to start receiving jobs.</p>
            <Button size="lg" className="h-12 w-full" onClick={() => setOnline(true)}>
              Go online
            </Button>
          </div>
        ))}

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Paid today" value={ugx(todayNet)} small />
        <Stat label="Jobs today" value={String(today.length)} />
        <Stat
          label="Rating"
          value={
            <span className="inline-flex items-center gap-1">
              {FUNDI.rating} <Star className="size-4 fill-yellow-400 text-yellow-400" />
            </span>
          }
        />
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-accent p-4 text-accent-foreground">
        <Flame className="mt-0.5 size-5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold">Busy near Ntinda</p>
          <p className="opacity-80">3 requests in the last hour. Stay close to pick up more jobs.</p>
        </div>
      </div>

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 font-heading text-base font-semibold">
          <TrendingUp className="size-4 text-primary" /> Recent jobs
        </h2>
        <div className="space-y-2">
          {paid.slice(0, 4).map((j) => (
            <div key={j.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <ServiceIcon id={j.serviceId} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{serviceById(j.serviceId).name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(j.payment?.paidAt ?? j.createdAt)}</p>
              </div>
              <p className="text-sm font-semibold tabular-nums">+{ugx(fundiEarning(j).payout)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, small = false }: { label: string; value: React.ReactNode; small?: boolean }) {
  return (
    <div className="rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={small ? "mt-1 text-sm font-bold tabular-nums" : "mt-1 text-lg font-bold tabular-nums"}>{value}</p>
    </div>
  );
}

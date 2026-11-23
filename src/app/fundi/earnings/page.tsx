"use client";

import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

import { NetworkChip } from "@/components/job/network-chip";
import { ServiceIcon } from "@/components/service-icon";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { FUNDI, serviceById } from "@/lib/demo/data";
import { fundiEarning, useDemo, useNow } from "@/lib/demo/store";
import { formatDate, num, ugx } from "@/lib/format";

/** Mon..Sat earnings this week (demo figures); today's bar is live. */
const WEEK = [65000, 120000, 48000, 0, 95000, 84000];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
const OPENING_BALANCE = 186500;

export default function EarningsPage() {
  const jobs = useDemo((s) => s.jobs);
  const withdrawn = useDemo((s) => s.withdrawn);
  const withdraw = useDemo((s) => s.withdraw);
  const now = useNow(60_000);

  const dayStart = new Date(now).setHours(0, 0, 0, 0);
  const paid = jobs.filter((j) => j.payment);
  const todayNet = paid
    .filter((j) => (j.payment?.paidAt ?? 0) >= dayStart)
    .reduce((s, j) => s + fundiEarning(j).payout, 0);
  const balance = Math.max(0, OPENING_BALANCE + todayNet - withdrawn);
  const bars = [...WEEK, todayNet];
  const max = Math.max(...bars, 1);
  const weekTotal = bars.reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHeader title="Earnings" />
      <div className="space-y-5 px-4">
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
          <p className="text-sm opacity-80">Available to withdraw</p>
          <p className="mt-1 font-heading text-3xl font-bold tabular-nums">{ugx(balance)}</p>
          <Button
            variant="secondary"
            className="mt-4 h-11 w-full"
            disabled={balance === 0}
            onClick={() => {
              withdraw(balance);
              toast.success(`${ugx(balance)} sent to MTN MoMo`, { description: FUNDI.phone });
            }}
          >
            <ArrowUpRight data-icon="inline-start" /> Withdraw to MTN MoMo
          </Button>
        </div>

        <section className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading font-semibold">This week</h2>
            <p className="text-sm font-semibold tabular-nums">{ugx(weekTotal)}</p>
          </div>
          <div className="mt-4 flex h-32 items-end gap-2" role="img" aria-label="Earnings per day this week">
            {bars.map((v, i) => (
              <div key={DAYS[i]} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground tabular-nums">{v ? `${num(v / 1000)}k` : ""}</span>
                <div
                  className={i === bars.length - 1 ? "w-full rounded-md bg-primary" : "w-full rounded-md bg-primary/30"}
                  style={{ height: `${Math.max(4, (v / max) * 88)}px` }}
                />
                <span className="text-[10px] font-medium text-muted-foreground">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-heading font-semibold">Job payments</h2>
          <div className="space-y-2">
            {paid.map((j) => {
              const e = fundiEarning(j);
              return (
                <div key={j.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                    <ServiceIcon id={j.serviceId} className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{serviceById(j.serviceId).name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(j.payment?.paidAt ?? j.createdAt)} · commission {ugx(e.commission)}
                    </p>
                  </div>
                  {j.payment && <NetworkChip method={j.payment.method} className="size-8 rounded-lg text-[9px]" />}
                  <p className="w-24 text-right text-sm font-semibold tabular-nums">+{ugx(e.payout)}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

"use client";

import { BadgeCheck, Bell, Bike, Car, ChevronDown, ChevronRight, MapPin, ReceiptText, Siren, Smartphone } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { ActiveJobBanner } from "@/components/job/active-job-banner";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { CUSTOMER, CUSTOMER_LOCATION, SERVICES } from "@/lib/demo/data";
import { useActiveJob, useDemo } from "@/lib/demo/store";

const TRUST = [
  { icon: BadgeCheck, label: "Verified fundis" },
  { icon: ReceiptText, label: "Upfront prices" },
  { icon: Smartphone, label: "MoMo & Airtel" },
];

export default function CustomerHome() {
  const vehicles = useDemo((s) => s.vehicles);
  const active = useActiveJob();
  const primary = vehicles[0];

  return (
    <div className="flex flex-col gap-6 px-4 pt-[max(env(safe-area-inset-top),1rem)]">
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => toast("Location: Ntinda, Kampala", { description: "Change it when you request help." })}
          className="flex min-w-0 items-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-medium ring-1 ring-foreground/10"
        >
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate">{CUSTOMER_LOCATION.area}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
        <Button variant="ghost" size="icon-lg" aria-label="Notifications" onClick={() => toast("You’re all caught up")}>
          <Bell className="size-5" />
        </Button>
      </header>

      <div>
        <p className="text-muted-foreground">Hi {CUSTOMER.first} 👋</p>
        <h1 className="font-heading text-2xl font-bold tracking-tight">What can we fix today?</h1>
      </div>

      <ActiveJobBanner />

      {!active && (
        <Link
          href="/app/request?urgent=1"
          className="group relative overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/25 transition active:scale-[0.99]"
        >
          <span className="pointer-events-none absolute -top-10 -right-10 size-36 rounded-full bg-white/10" aria-hidden="true" />
          <span className="relative flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Siren className="size-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-xl leading-tight font-bold">Breakdown? Get help now</span>
              <span className="mt-1 block text-sm opacity-80">6 fundis nearby · about 10 min away</span>
            </span>
            <ChevronRight className="size-6 opacity-80 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      )}

      <section aria-labelledby="whats-wrong">
        <h2 id="whats-wrong" className="mb-3 font-heading text-base font-semibold">
          What’s wrong?
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {SERVICES.map((s) => (
            <Link
              key={s.id}
              href={`/app/request?service=${s.id}`}
              className="flex flex-col items-center gap-2 rounded-2xl bg-card px-2 py-4 text-center ring-1 ring-foreground/10 transition hover:ring-primary/40 active:scale-[0.98]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <ServiceIcon id={s.id} className="size-5" />
              </span>
              <span className="text-xs leading-tight font-medium">{s.short}</span>
            </Link>
          ))}
        </div>
      </section>

      {primary && (
        <section aria-labelledby="my-vehicle">
          <h2 id="my-vehicle" className="mb-3 font-heading text-base font-semibold">
            Your vehicle
          </h2>
          <Link href="/app/garage" className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
            <span className="flex size-11 items-center justify-center rounded-xl bg-muted">
              {primary.type === "car" ? <Car className="size-5" /> : <Bike className="size-5" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">
                {primary.make} {primary.model}
              </span>
              <span className="block text-sm text-muted-foreground">Service due in about 800 km</span>
            </span>
            <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-semibold">{primary.plate}</span>
          </Link>
        </section>
      )}

      <section className="grid grid-cols-3 gap-2 pb-2">
        {TRUST.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 rounded-2xl bg-muted/60 p-3 text-center">
            <Icon className="size-5 text-primary" />
            <span className="text-[11px] leading-tight font-medium">{label}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

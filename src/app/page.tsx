"use client";

import { ArrowRight, BadgeCheck, MonitorPlay, ReceiptText, Smartphone } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { MobileFrame } from "@/components/shell/mobile-frame";
import { Button } from "@/components/ui/button";
import { CUSTOMER } from "@/lib/demo/data";
import { useDemo, useHydrated } from "@/lib/demo/store";

const POINTS = [
  { icon: BadgeCheck, text: "ID-verified fundis, rated by drivers" },
  { icon: ReceiptText, text: "See the price before any work starts" },
  { icon: Smartphone, text: "Pay with MTN MoMo, Airtel Money or cash" },
];

export default function Landing() {
  const hydrated = useHydrated();
  const session = useDemo((s) => s.session);
  const customerIn = hydrated && session.customer;
  const fundiIn = hydrated && session.fundi;

  return (
    <MobileFrame className="bg-brand text-brand-foreground">
      <div className="relative flex flex-1 flex-col overflow-hidden px-6 pt-[max(env(safe-area-inset-top),2rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute top-40 -left-32 size-64 rounded-full bg-white/5" aria-hidden="true" />

        <Logo inverted />

        <div className="relative mt-auto space-y-8 pt-16">
          <h1 className="font-heading text-4xl leading-[1.1] font-bold tracking-tight text-balance">
            A trusted mechanic, wherever you are in Kampala.
          </h1>
          <ul className="space-y-3">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-base text-white/90">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="size-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <div className="space-y-2">
            <Button asChild size="lg" className="h-14 w-full bg-white text-base text-brand hover:bg-white/90">
              <Link href={customerIn ? "/app" : "/login"}>
                {customerIn ? `Continue as ${CUSTOMER.first}` : "Get started"} <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-12 w-full text-base text-white hover:bg-white/10 hover:text-white">
              <Link href={fundiIn ? "/fundi" : "/login?as=fundi"}>I’m a fundi</Link>
            </Button>
          </div>
          <Link
            href="/demo"
            className="mx-auto flex w-fit items-center gap-1.5 text-xs text-white/60 underline-offset-4 hover:text-white hover:underline"
          >
            <MonitorPlay className="size-3.5" /> Presenter view (laptop)
          </Link>
        </div>
      </div>
    </MobileFrame>
  );
}

"use client";

import { Check, FastForward, RotateCcw, Smartphone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { PhoneFrame } from "@/components/demo/phone-frame";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { pageUrl } from "@/lib/base-path";
import { STATUS_LABEL } from "@/lib/demo/status";
import { useActiveJob, useDemo, useHydrated, type JobStatus } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

const ORDER: JobStatus[] = [
  "matching",
  "assigned",
  "en_route",
  "arrived",
  "diagnosing",
  "quote_pending",
  "in_progress",
  "completed",
  "paid",
  "reviewed",
];

/** Each step is done once the job reaches `doneAt`. */
const SCRIPT: { who: "Customer" | "Fundi"; text: string; doneAt: number }[] = [
  { who: "Customer", text: "Tap “Breakdown? Get help now” (or a problem) and request a fundi", doneAt: 0 },
  { who: "Fundi", text: "Accept the job offer", doneAt: 1 },
  { who: "Fundi", text: "Start the trip and watch the customer’s map", doneAt: 2 },
  { who: "Fundi", text: "Tap “I’ve arrived”, then enter the start PIN", doneAt: 4 },
  { who: "Fundi", text: "Send the quote", doneAt: 5 },
  { who: "Customer", text: "Approve the quote", doneAt: 6 },
  { who: "Fundi", text: "Mark the job as complete", doneAt: 7 },
  { who: "Customer", text: "Pay with MTN MoMo or Airtel Money, then rate", doneAt: 9 },
];

export default function DemoPage() {
  const hydrated = useHydrated();
  const session = useDemo((s) => s.session);
  const autopilot = useDemo((s) => s.autopilot);
  const setAutopilot = useDemo((s) => s.setAutopilot);
  const advanceDemo = useDemo((s) => s.advanceDemo);
  const job = useActiveJob();
  const [frameKey, setFrameKey] = useState(0);
  const [scale, setScale] = useState(0.75);

  useEffect(() => {
    const calc = () => setScale(Math.min(1, Math.max(0.5, (window.innerHeight - 150) / 868)));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Presenter mode: both phones signed in, and you drive the fundi side yourself.
  useEffect(() => {
    if (!hydrated) return;
    const s = useDemo.getState();
    if (!s.session.customer) s.signIn("customer");
    if (!s.session.fundi) s.signIn("fundi");
    s.setAutopilot(false);
  }, [hydrated]);

  function restart() {
    const s = useDemo.getState();
    s.reset();
    s.signIn("customer");
    s.signIn("fundi");
    s.setAutopilot(false);
    setFrameKey((k) => k + 1);
  }

  const reached = job ? ORDER.indexOf(job.status) : -1;
  const currentStep = SCRIPT.findIndex((step) => reached < step.doneAt);
  const ready = hydrated && session.customer && session.fundi;

  return (
    <div className="min-h-dvh bg-[#0b1020] text-white">
      <header className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <Logo inverted />
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">Live demo</span>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
          <Smartphone className="size-4" /> Open single phone view
        </Link>
      </header>

      <main className="flex flex-wrap items-start justify-center gap-8 px-6 pb-10">
        {ready ? (
          <>
            <PhoneFrame key={`c${frameKey}`} src={pageUrl("/app")} title="Customer" caption="Sarah · Ntinda" scale={scale} />
            <PhoneFrame key={`f${frameKey}`} src={pageUrl("/fundi")} title="Fundi" caption="Kato · Bukoto" scale={scale} />
          </>
        ) : (
          <p className="py-40 text-white/60">Preparing the demo…</p>
        )}

        <aside className="w-full max-w-xs space-y-4 lg:mt-12">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">Current job</p>
            <p className="mt-1 text-lg font-semibold">{job ? STATUS_LABEL[job.status] : "No active job"}</p>
            {job && <p className="text-sm text-white/60">{job.ref}</p>}
            <div className="mt-4 grid gap-2">
              <Button onClick={advanceDemo} className="h-11 bg-white text-[#0b1020] hover:bg-white/90">
                <FastForward data-icon="inline-start" /> {job ? "Skip to next step" : "Create a sample request"}
              </Button>
              <Button variant="ghost" onClick={restart} className="h-11 text-white hover:bg-white/10 hover:text-white">
                <RotateCcw data-icon="inline-start" /> Restart demo
              </Button>
            </div>
            <label className="mt-4 flex items-center justify-between gap-3 text-sm">
              <span>
                <span className="block font-medium">Simulate the fundi</span>
                <span className="block text-xs text-white/50">Off: you tap through the fundi phone</span>
              </span>
              <Switch checked={autopilot} onCheckedChange={setAutopilot} aria-label="Simulate the fundi" />
            </label>
          </div>

          <ol className="space-y-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <li className="pb-1 text-xs font-semibold tracking-wide text-white/50 uppercase">Demo script</li>
            {SCRIPT.map((step, i) => {
              const done = reached >= step.doneAt;
              const current = i === currentStep;
              return (
                <li
                  key={step.text}
                  className={cn(
                    "flex gap-3 rounded-xl p-2 text-sm text-white/60",
                    current && "bg-white/10 text-white",
                    done && "text-white/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold",
                      current && "bg-[#4f7cff] text-white",
                      done && "bg-emerald-500/80 text-white",
                    )}
                  >
                    {done ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold tracking-wide uppercase opacity-70">{step.who}</span>
                    {step.text}
                  </span>
                </li>
              );
            })}
          </ol>
        </aside>
      </main>
    </div>
  );
}

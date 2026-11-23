"use client";

import { ArrowLeft, Bike, Car, Check, Clock, MapPin, Plus, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AddVehicleDrawer } from "@/components/add-vehicle-drawer";
import { LiveMap } from "@/components/map/live-map";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CALLOUT_FEE, CUSTOMER_LOCATION, SERVICES, serviceById, vehicleName, type ServiceId } from "@/lib/demo/data";
import { useActiveJob, useDemo } from "@/lib/demo/store";
import { ugx } from "@/lib/format";
import { cn } from "@/lib/utils";

const STEPS = ["What’s wrong?", "Which vehicle?", "Where are you?", "Confirm request"];
const isServiceId = (v: string | null): v is ServiceId => !!v && SERVICES.some((s) => s.id === v);

export function RequestFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const initialService = params.get("service");
  const vehicles = useDemo((s) => s.vehicles);
  const createJob = useDemo((s) => s.createJob);
  const activeJob = useActiveJob();

  const [serviceId, setServiceId] = useState<ServiceId | undefined>(isServiceId(initialService) ? initialService : undefined);
  const [step, setStep] = useState(isServiceId(initialService) ? 1 : 0);
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [landmark, setLandmark] = useState(CUSTOMER_LOCATION.landmark);
  const [addOpen, setAddOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (activeJob && !submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="font-heading text-xl font-bold">You already have a request in progress</p>
        <Button asChild size="lg" className="h-12">
          <Link href="/app/job">View current job</Link>
        </Button>
      </div>
    );
  }

  const canContinue = step === 0 ? !!serviceId : step === 1 ? !!vehicleId : true;
  const service = serviceId ? serviceById(serviceId) : undefined;
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  function back() {
    if (step === 0) router.push("/app");
    else setStep(step - 1);
  }

  function next() {
    if (step < STEPS.length - 1) return setStep(step + 1);
    if (!serviceId) return;
    setSubmitted(true);
    createJob({ serviceId, vehicleId, notes, landmark });
    router.replace("/app/job");
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <header className="sticky top-0 z-30 bg-background/95 px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-lg" className="-ml-2" onClick={back} aria-label="Back">
            <ArrowLeft className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </p>
            <h1 className="font-heading text-lg leading-tight font-semibold">{STEPS[step]}</h1>
          </div>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mt-3 h-1.5" />
      </header>

      <div className="flex-1 px-4 pt-2 pb-6">
        {step === 0 && (
          <div className="space-y-5">
            <div className="grid gap-2" role="radiogroup" aria-label="Problem">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={serviceId === s.id}
                  onClick={() => setServiceId(s.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl bg-card p-3 text-left ring-1 ring-foreground/10 transition",
                    serviceId === s.id && "ring-2 ring-primary",
                  )}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <ServiceIcon id={s.id} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{s.name}</span>
                    <span className="block truncate text-sm text-muted-foreground">{s.blurb}</span>
                  </span>
                  <span className="shrink-0 text-right text-xs text-muted-foreground">
                    from
                    <span className="block text-sm font-semibold text-foreground">{ugx(s.fromPrice)}</span>
                  </span>
                </button>
              ))}
            </div>
            <Field>
              <FieldLabel htmlFor="notes">Anything else? (optional)</FieldLabel>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Car clicks but won’t start"
                className="min-h-20"
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {service && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <ServiceIcon id={service.id} className="size-4 text-primary" /> {service.name}
              </p>
            )}
            <div className="grid gap-2" role="radiogroup" aria-label="Vehicle">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={vehicleId === v.id}
                  onClick={() => setVehicleId(v.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl bg-card p-4 text-left ring-1 ring-foreground/10 transition",
                    vehicleId === v.id && "ring-2 ring-primary",
                  )}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                    {v.type === "car" ? <Car className="size-5" /> : <Bike className="size-5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">
                      {v.make} {v.model}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {v.year} · <span className="font-mono">{v.plate}</span>
                    </span>
                  </span>
                  {vehicleId === v.id && <Check className="size-5 text-primary" />}
                </button>
              ))}
            </div>
            <Button variant="outline" className="h-12 w-full" onClick={() => setAddOpen(true)}>
              <Plus data-icon="inline-start" /> Add another vehicle
            </Button>
            <AddVehicleDrawer open={addOpen} onOpenChange={setAddOpen} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="relative h-56 overflow-hidden rounded-2xl ring-1 ring-foreground/10">
              <LiveMap customer={[CUSTOMER_LOCATION.lng, CUSTOMER_LOCATION.lat]} interactive={false} />
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold">{CUSTOMER_LOCATION.label}</p>
                <p className="text-sm text-muted-foreground">{CUSTOMER_LOCATION.area}</p>
              </div>
            </div>
            <Field>
              <FieldLabel htmlFor="landmark">Landmark</FieldLabel>
              <Input id="landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} className="h-12" />
              <FieldDescription>Helps your fundi find you fast, e.g. “opposite the Shell station”.</FieldDescription>
            </Field>
          </div>
        )}

        {step === 3 && service && (
          <div className="space-y-4">
            <div className="divide-y rounded-2xl bg-card ring-1 ring-foreground/10">
              <SummaryRow label="Problem" value={service.name} onEdit={() => setStep(0)} />
              <SummaryRow
                label="Vehicle"
                value={vehicle ? `${vehicleName(vehicle)} · ${vehicle.plate}` : "—"}
                onEdit={() => setStep(1)}
              />
              <SummaryRow label="Location" value={`${CUSTOMER_LOCATION.label}, ${landmark}`} onEdit={() => setStep(2)} />
            </div>
            <div className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Call-out fee</span>
                <span className="font-semibold tabular-nums">{ugx(CALLOUT_FEE)}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Typical repair</span>
                <span className="font-semibold tabular-nums">from {ugx(service.fromPrice)}</span>
              </div>
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-accent/60 p-3 text-sm text-accent-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                You approve the final price in the app before any work starts.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="size-4" /> Fundis nearby can reach you in about 10 minutes
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="size-4" /> Pay after the job: MTN MoMo, Airtel Money or cash
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t bg-background/95 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] backdrop-blur-lg">
        <Button size="lg" className="h-14 w-full text-base" disabled={!canContinue} onClick={next}>
          {step === STEPS.length - 1 ? "Request a fundi" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        Edit
      </Button>
    </div>
  );
}

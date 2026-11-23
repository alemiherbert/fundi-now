"use client";

import { Bike, Car, Gauge, Plus } from "lucide-react";
import { useState } from "react";

import { AddVehicleDrawer } from "@/components/add-vehicle-drawer";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDemo } from "@/lib/demo/store";

export default function GaragePage() {
  const vehicles = useDemo((s) => s.vehicles);
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Garage"
        action={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus data-icon="inline-start" /> Add
          </Button>
        }
      />
      <div className="space-y-4 px-4">
        {vehicles.map((v) => (
          <div key={v.id} className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                {v.type === "car" ? <Car className="size-6" /> : <Bike className="size-6" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {v.make} {v.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  {v.year}
                  {v.color ? ` · ${v.color}` : ""} · {v.type === "car" ? "Car" : "Boda"}
                </p>
              </div>
              <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-semibold">{v.plate}</span>
            </div>
            {v.id === "v1" && (
              <div className="mt-4 rounded-xl bg-muted/60 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Gauge className="size-4 text-primary" /> Next service
                  </span>
                  <span className="text-muted-foreground">in ~800 km</span>
                </div>
                <Progress value={84} className="mt-2 h-1.5" />
              </div>
            )}
          </div>
        ))}
      </div>
      <AddVehicleDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}

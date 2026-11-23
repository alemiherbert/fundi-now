import { ShieldCheck } from "lucide-react";

import { FUNDI } from "@/lib/demo/data";

export function StartPin({ pin }: { pin: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/40 bg-accent/50 p-4">
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <ShieldCheck className="size-4 text-primary" /> Start PIN
        </p>
        <p className="text-xs text-muted-foreground">Give it to {FUNDI.first} on arrival</p>
      </div>
      <div className="flex gap-1.5" aria-label={`PIN ${pin.split("").join(" ")}`}>
        {pin.split("").map((d, i) => (
          <span
            key={i}
            className="flex h-11 w-9 items-center justify-center rounded-lg bg-background font-mono text-xl font-bold ring-1 ring-foreground/10"
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

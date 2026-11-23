import { Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm",
        className,
      )}
    >
      <Wrench className="size-1/2" strokeWidth={2.5} />
    </span>
  );
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-heading text-lg font-bold tracking-tight", className)}>
      <LogoMark className={inverted ? "bg-white text-brand" : undefined} />
      <span>
        Fundi<span className={inverted ? "text-white/75" : "text-primary"}> Now</span>
      </span>
    </span>
  );
}

import { TIMELINE, timelineIndex } from "@/lib/demo/status";
import type { JobStatus } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

export function StatusTimeline({ status }: { status: JobStatus }) {
  const current = timelineIndex(status);
  return (
    <ol className="flex gap-1.5" aria-label="Job progress">
      {TIMELINE.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.key} className="flex min-w-0 flex-1 flex-col gap-1.5" aria-current={active ? "step" : undefined}>
            <span className={cn("h-1.5 rounded-full bg-muted", (done || active) && "bg-primary", active && "animate-pulse")} />
            <span className={cn("truncate text-[11px] font-medium text-muted-foreground", active && "text-foreground")}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

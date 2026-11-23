import { Skeleton } from "@/components/ui/skeleton";

import { MobileFrame } from "./mobile-frame";

export function ScreenSkeleton() {
  return (
    <MobileFrame>
      <div className="flex flex-col gap-4 p-4 pt-8" aria-busy="true" aria-label="Loading">
        <Skeleton className="h-9 w-40 rounded-full" />
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    </MobileFrame>
  );
}

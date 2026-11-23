import { cn } from "@/lib/utils";

/** Phone-width column. On larger screens it sits centred like a device. */
export function MobileFrame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background md:border-x md:shadow-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

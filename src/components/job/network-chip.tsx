import { Banknote } from "lucide-react";

import type { PayMethod } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

export const METHOD_LABEL: Record<PayMethod, string> = {
  mtn: "MTN MoMo",
  airtel: "Airtel Money",
  cash: "Cash",
};

/** Labelled colour chip for a payment method (not an official logo). */
export function NetworkChip({ method, className }: { method: PayMethod; className?: string }) {
  if (method === "cash") {
    return (
      <span className={cn("inline-flex size-10 items-center justify-center rounded-xl bg-success/15 text-success", className)}>
        <Banknote className="size-5" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl text-[11px] font-extrabold tracking-tight",
        method === "mtn" ? "bg-[#ffcc00] text-black" : "bg-[#e40000] text-white",
        className,
      )}
    >
      {method === "mtn" ? "MTN" : "airtel"}
    </span>
  );
}

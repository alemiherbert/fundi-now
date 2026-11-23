import { Separator } from "@/components/ui/separator";
import { CALLOUT_FEE } from "@/lib/demo/data";
import { quoteTotal, type QuoteItem } from "@/lib/demo/store";
import { ugx } from "@/lib/format";

export function PriceBreakdown({ items, calloutOnly = false }: { items: QuoteItem[]; calloutOnly?: boolean }) {
  const rows = calloutOnly ? [] : items;
  const total = calloutOnly ? CALLOUT_FEE : quoteTotal(items);
  return (
    <div className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
      <dl className="space-y-2.5 text-sm">
        {rows.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4">
            <dt className="min-w-0">
              <span className="block truncate">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.kind === "part" ? "Part" : "Labour"}</span>
            </dt>
            <dd className="shrink-0 font-medium tabular-nums">{ugx(item.amount)}</dd>
          </div>
        ))}
        <div className="flex items-start justify-between gap-4">
          <dt>
            <span className="block">Call-out fee</span>
            <span className="text-xs text-muted-foreground">Travel & first check</span>
          </dt>
          <dd className="shrink-0 font-medium tabular-nums">{ugx(CALLOUT_FEE)}</dd>
        </div>
      </dl>
      <Separator className="my-3" />
      <div className="flex items-baseline justify-between">
        <span className="font-semibold">Total</span>
        <span className="font-heading text-xl font-bold tabular-nums">{ugx(total)}</span>
      </div>
    </div>
  );
}

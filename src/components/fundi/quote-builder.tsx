"use client";

import { Plus, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { CALLOUT_FEE, CUSTOMER } from "@/lib/demo/data";
import { quoteTotal, templateQuote, useDemo, type Job, type QuoteItem } from "@/lib/demo/store";
import { ugx } from "@/lib/format";
import { cn } from "@/lib/utils";

export function QuoteBuilder({ job }: { job: Job }) {
  const sendQuote = useDemo((s) => s.sendQuote);
  const [items, setItems] = useState<QuoteItem[]>(() => templateQuote(job.serviceId));
  const valid = items.length > 0 && items.every((i) => i.label.trim() && i.amount > 0);

  const update = (id: string, patch: Partial<QuoteItem>) =>
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  return (
    <div className="space-y-4">
      <div>
        <p className="font-heading text-xl font-bold tracking-tight">Build the quote</p>
        <p className="text-sm text-muted-foreground">{CUSTOMER.first} approves it before you start work.</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="space-y-2 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => update(item.id, { kind: item.kind === "part" ? "labour" : "part" })}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                  item.kind === "part" ? "bg-muted text-foreground" : "bg-accent text-accent-foreground",
                )}
                aria-label={`Type: ${item.kind}. Tap to switch`}
              >
                {item.kind === "part" ? "Part" : "Labour"}
              </button>
              <Input
                value={item.label}
                onChange={(e) => update(item.id, { label: e.target.value })}
                placeholder="Description"
                className="h-10"
                aria-label="Description"
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remove line"
                onClick={() => setItems((cur) => cur.filter((i) => i.id !== item.id))}
              >
                <Trash2 />
              </Button>
            </div>
            <InputGroup className="h-10">
              <InputGroupAddon>
                <InputGroupText>UGX</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                inputMode="numeric"
                value={item.amount ? item.amount.toLocaleString("en-US") : ""}
                onChange={(e) => update(item.id, { amount: Number(e.target.value.replace(/\D/g, "")) || 0 })}
                placeholder="0"
                aria-label="Amount"
                className="tabular-nums"
              />
            </InputGroup>
          </div>
        ))}
        <Button
          variant="outline"
          className="h-11 w-full"
          onClick={() => setItems((cur) => [...cur, { id: `q${Date.now()}`, kind: "part", label: "", amount: 0 }])}
        >
          <Plus data-icon="inline-start" /> Add a line
        </Button>
      </div>

      <div className="rounded-2xl bg-muted/60 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Call-out fee</span>
          <span className="tabular-nums">{ugx(CALLOUT_FEE)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex items-baseline justify-between">
          <span className="font-semibold">Total for customer</span>
          <span className="font-heading text-xl font-bold tabular-nums">{ugx(quoteTotal(items))}</span>
        </div>
      </div>

      <Button
        size="lg"
        className="h-14 w-full text-base"
        disabled={!valid}
        onClick={() => {
          sendQuote(items);
          toast.success(`Quote sent to ${CUSTOMER.first}`);
        }}
      >
        <Send data-icon="inline-start" /> Send quote to {CUSTOMER.first}
      </Button>
    </div>
  );
}

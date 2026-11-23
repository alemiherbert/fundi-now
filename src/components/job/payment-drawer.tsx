"use client";

import { CheckCircle2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useDemo, type PayMethod } from "@/lib/demo/store";
import { detectNetwork, ugx } from "@/lib/format";
import { cn } from "@/lib/utils";

import { METHOD_LABEL, NetworkChip } from "./network-chip";

type Stage = "choose" | "prompt" | "processing" | "success";

export function PaymentDrawer({
  open,
  onOpenChange,
  amount,
  jobRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  jobRef: string;
}) {
  const pay = useDemo((s) => s.pay);
  const [method, setMethod] = useState<PayMethod>("mtn");
  const [phone, setPhone] = useState("772 123 456");
  const [stage, setStage] = useState<Stage>("choose");
  const [pin, setPin] = useState("");
  const network = METHOD_LABEL[method];
  const phoneOk = phone.replace(/\D/g, "").length === 9;

  function close(next: boolean) {
    if (!next && (stage === "processing" || stage === "success")) return; // don't interrupt a payment
    onOpenChange(next);
    if (!next) setStage("choose");
  }

  function onPhoneChange(value: string) {
    setPhone(value);
    const detected = detectNetwork(value);
    if (detected && method !== "cash") setMethod(detected);
  }

  function start() {
    if (method === "cash") {
      pay("cash");
      onOpenChange(false);
      toast.success("Marked as paid in cash");
      return;
    }
    setPin("");
    setStage("prompt");
  }

  function confirmPin() {
    setStage("processing");
    window.setTimeout(() => {
      setStage("success");
      window.setTimeout(() => {
        pay(method, `+256 ${phone}`);
        onOpenChange(false);
        setStage("choose");
      }, 1500);
    }, 1800);
  }

  return (
    <Drawer open={open} onOpenChange={close}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          {stage === "choose" && (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-xl">Pay {ugx(amount)}</DrawerTitle>
                <DrawerDescription>Job {jobRef} · choose how you’d like to pay</DrawerDescription>
              </DrawerHeader>
              <div className="space-y-3 px-4" role="radiogroup" aria-label="Payment method">
                {(["mtn", "airtel", "cash"] as PayMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={method === m}
                    onClick={() => setMethod(m)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left ring-1 ring-foreground/10 transition",
                      method === m && "ring-2 ring-primary",
                    )}
                  >
                    <NetworkChip method={m} />
                    <span className="flex-1">
                      <span className="block font-semibold">{METHOD_LABEL[m]}</span>
                      <span className="block text-xs text-muted-foreground">
                        {m === "cash" ? "Pay the fundi directly" : "Approve with your PIN on your phone"}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "size-5 rounded-full border-2 border-muted-foreground/40",
                        method === m && "border-[6px] border-primary",
                      )}
                    />
                  </button>
                ))}
                {method !== "cash" && (
                  <Field>
                    <FieldLabel htmlFor="pay-phone">{network} number</FieldLabel>
                    <InputGroup className="h-12">
                      <InputGroupAddon>
                        <InputGroupText>+256</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="pay-phone"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        className="text-base"
                      />
                    </InputGroup>
                  </Field>
                )}
              </div>
              <DrawerFooter>
                <Button size="lg" className="h-14 text-base" onClick={start} disabled={method !== "cash" && !phoneOk}>
                  {method === "cash" ? `I’ve paid ${ugx(amount)} in cash` : `Pay ${ugx(amount)}`}
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="size-3" /> Demo: no real money moves
                </p>
              </DrawerFooter>
            </>
          )}

          {stage === "prompt" && (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-xl">Check your phone</DrawerTitle>
                <DrawerDescription>We sent a payment request to +256 {phone}. Approve it with your PIN.</DrawerDescription>
              </DrawerHeader>
              {/* Simulated network prompt, styled like a phone system dialog */}
              <div className="px-4 pb-6">
                <div className="mx-auto w-full max-w-xs rounded-2xl bg-neutral-900 p-5 text-neutral-100 shadow-2xl">
                  <p className="text-[11px] tracking-wide text-neutral-400 uppercase">Simulated phone prompt</p>
                  <p className="mt-3 text-sm leading-relaxed">
                    {network}: Pay <b>{ugx(amount)}</b> to FUNDI NOW LTD for job {jobRef}. Enter PIN to confirm.
                  </p>
                  <Input
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={5}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="PIN"
                    autoFocus
                    className="mt-4 h-11 border-neutral-700 bg-neutral-800 text-center text-lg tracking-[0.5em] text-white placeholder:tracking-normal"
                    aria-label="Mobile money PIN"
                  />
                  <div className="mt-4 flex justify-end gap-6 text-sm font-semibold">
                    <button type="button" className="text-neutral-400" onClick={() => setStage("choose")}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="text-sky-300 disabled:opacity-40"
                      disabled={pin.length < 4}
                      onClick={confirmPin}
                    >
                      Send
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">Demo: any 4 digits work</p>
              </div>
            </>
          )}

          {stage === "processing" && (
            <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
              <Spinner className="size-8 text-primary" />
              <p className="font-semibold">Confirming with {network}…</p>
              <p className="text-sm text-muted-foreground">This usually takes a few seconds</p>
            </div>
          )}

          {stage === "success" && (
            <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
              <CheckCircle2 className="size-14 text-success" />
              <p className="font-heading text-xl font-bold">Payment received</p>
              <p className="text-sm text-muted-foreground">
                {ugx(amount)} via {network}
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

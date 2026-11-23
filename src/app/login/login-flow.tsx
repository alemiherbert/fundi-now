"use client";

import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/brand/logo";
import { MobileFrame } from "@/components/shell/mobile-frame";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DEMO_OTP } from "@/lib/demo/data";
import { useDemo, type Role } from "@/lib/demo/store";

export function LoginFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const signIn = useDemo((s) => s.signIn);
  const whatsappUpdates = useDemo((s) => s.whatsappUpdates);
  const setWhatsappUpdates = useDemo((s) => s.setWhatsappUpdates);

  const [role, setRole] = useState<Role>(params.get("as") === "fundi" ? "fundi" : "customer");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState(role === "fundi" ? "701 234 567" : "772 123 456");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const validPhone = phone.replace(/\D/g, "").length === 9;

  function chooseRole(next: Role) {
    setRole(next);
    setPhone(next === "fundi" ? "701 234 567" : "772 123 456");
  }

  function sendCode() {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setStep("code");
      toast.success("Code sent on WhatsApp", { description: `Demo code: ${DEMO_OTP}` });
    }, 700);
  }

  function verify(value: string) {
    if (value.length < 6 || busy) return;
    setBusy(true);
    window.setTimeout(() => {
      signIn(role);
      router.replace(role === "fundi" ? "/fundi" : "/app");
    }, 500);
  }

  return (
    <MobileFrame>
      <div className="flex flex-1 flex-col px-6 pt-[max(env(safe-area-inset-top),1.5rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <Link href="/" aria-label="Fundi Now home" className="w-fit">
          <Logo />
        </Link>

        {step === "phone" ? (
          <div className="mt-8 flex flex-1 flex-col">
            <ToggleGroup
              type="single"
              variant="outline"
              value={role}
              onValueChange={(v) => v && chooseRole(v as Role)}
              className="w-full"
              aria-label="I am"
            >
              <ToggleGroupItem value="customer" className="h-11 flex-1">
                I need a mechanic
              </ToggleGroupItem>
              <ToggleGroupItem value="fundi" className="h-11 flex-1">
                I’m a fundi
              </ToggleGroupItem>
            </ToggleGroup>

            <h1 className="mt-8 font-heading text-2xl font-bold tracking-tight">What’s your phone number?</h1>
            <p className="mt-2 text-muted-foreground">We’ll send a code to WhatsApp to confirm it’s you.</p>

            <Field className="mt-6">
              <FieldLabel htmlFor="phone">Phone number</FieldLabel>
              <InputGroup className="h-14">
                <InputGroupAddon>
                  <InputGroupText className="text-base font-medium">+256</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="phone"
                  inputMode="tel"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="772 123 456"
                  className="text-lg"
                />
              </InputGroup>
            </Field>

            <div className="mt-auto pt-10">
              <Button size="lg" className="h-14 w-full text-base" disabled={!validPhone || busy} onClick={sendCode}>
                {busy && <Spinner data-icon="inline-start" />} Send code
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                By continuing you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-1 flex-col">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 w-fit"
              onClick={() => {
                setStep("phone");
                setCode("");
              }}
            >
              <ArrowLeft data-icon="inline-start" /> Change number
            </Button>
            <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight">Enter your code</h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <MessageCircle className="size-4 text-[#25d366]" /> Sent to WhatsApp on +256 {phone}
            </p>

            <div className="mt-8 flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(v) => {
                  setCode(v);
                  if (v.length === 6) verify(v);
                }}
                autoFocus
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }, (_, i) => (
                    <InputOTPSlot key={i} index={i} className="size-12 text-lg" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="mt-4 flex flex-col items-center gap-1">
              <Button
                variant="link"
                onClick={() => {
                  setCode(DEMO_OTP);
                  verify(DEMO_OTP);
                }}
              >
                Demo: use code {DEMO_OTP}
              </Button>
              <Button variant="link" className="text-muted-foreground" onClick={() => toast("Code sent by SMS")}>
                Send by SMS instead
              </Button>
            </div>

            <Field orientation="horizontal" className="mt-6 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
              <FieldContent>
                <FieldLabel htmlFor="wa-updates">Job updates on WhatsApp</FieldLabel>
                <FieldDescription>Fundi on the way, quotes and receipts. Turn off any time.</FieldDescription>
              </FieldContent>
              <Switch id="wa-updates" checked={whatsappUpdates} onCheckedChange={setWhatsappUpdates} />
            </Field>

            <div className="mt-auto pt-8">
              <Button size="lg" className="h-14 w-full text-base" disabled={code.length < 6 || busy} onClick={() => verify(code)}>
                {busy && <Spinner data-icon="inline-start" />} Verify
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileFrame>
  );
}

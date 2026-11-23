"use client";

import { ChevronRight, HardHat, LifeBuoy, LogOut, MessageCircle, MonitorPlay, RotateCcw, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shell/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { WhatsAppPreview } from "@/components/whatsapp-preview";
import { CUSTOMER } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";

export default function AccountPage() {
  const router = useRouter();
  const whatsappUpdates = useDemo((s) => s.whatsappUpdates);
  const setWhatsappUpdates = useDemo((s) => s.setWhatsappUpdates);
  const autopilot = useDemo((s) => s.autopilot);
  const setAutopilot = useDemo((s) => s.setAutopilot);
  const signIn = useDemo((s) => s.signIn);
  const signOut = useDemo((s) => s.signOut);
  const reset = useDemo((s) => s.reset);
  const [waOpen, setWaOpen] = useState(false);

  return (
    <>
      <PageHeader title="Account" />
      <div className="space-y-6 px-4">
        <div className="flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">{CUSTOMER.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{CUSTOMER.name}</p>
            <p className="text-sm text-muted-foreground">{CUSTOMER.phone}</p>
          </div>
        </div>

        <Group title="Preferences">
          <Row label="Theme" control={<ThemeToggle />} />
          <Row
            label="Job updates on WhatsApp"
            hint="Fundi on the way, quotes, receipts"
            control={<Switch checked={whatsappUpdates} onCheckedChange={setWhatsappUpdates} aria-label="Job updates on WhatsApp" />}
          />
          <RowButton icon={MessageCircle} label="See WhatsApp updates" onClick={() => setWaOpen(true)} />
        </Group>

        <Group title="Help & safety">
          <RowButton icon={LifeBuoy} label="Help centre" onClick={() => toast("Help centre opens here")} />
          <RowButton icon={ShieldAlert} label="Emergency contacts" onClick={() => toast("Add people to alert during a job")} />
        </Group>

        <Group title="Fundi Now for mechanics">
          <RowButton
            icon={HardHat}
            label="Switch to fundi mode"
            onClick={() => {
              signIn("fundi");
              router.push("/fundi");
            }}
          />
        </Group>

        <Group title="Demo settings">
          <Row
            label="Simulate the fundi"
            hint="Plays the fundi’s side automatically on one phone"
            control={<Switch checked={autopilot} onCheckedChange={setAutopilot} aria-label="Simulate the fundi" />}
          />
          <RowLink icon={MonitorPlay} label="Presenter view (laptop)" href="/demo" />
          <RowButton
            icon={RotateCcw}
            label="Reset demo data"
            onClick={() => {
              reset();
              toast.success("Demo reset");
              router.replace("/");
            }}
          />
        </Group>

        <button
          type="button"
          onClick={() => {
            signOut("customer");
            router.replace("/");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl p-4 font-medium text-destructive"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
      <WhatsAppPreview open={waOpen} onOpenChange={setWaOpen} />
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h2>
      <div className="divide-y overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">{children}</div>
    </section>
  );
}

function Row({ label, hint, control }: { label: string; hint?: string; control: React.ReactNode }) {
  return (
    <div className="flex min-h-14 items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {control}
    </div>
  );
}

function RowButton({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left">
      <Icon className="size-5 text-muted-foreground" />
      <span className="flex-1 font-medium">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}

function RowLink({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <Link href={href} className="flex min-h-14 w-full items-center gap-3 px-4 py-3">
      <Icon className="size-5 text-muted-foreground" />
      <span className="flex-1 font-medium">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

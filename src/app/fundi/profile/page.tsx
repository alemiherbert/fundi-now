"use client";

import { BadgeCheck, Car, CheckCircle2, LogOut, MapPin, Star } from "lucide-react";
import { useRouter } from "next/navigation";

import { NetworkChip } from "@/components/job/network-chip";
import { PageHeader } from "@/components/shell/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FUNDI } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";

const DOCUMENTS = ["National ID (NIN)", "Police clearance certificate", "Trade certificate", "Selfie match"];

export default function FundiProfilePage() {
  const router = useRouter();
  const signIn = useDemo((s) => s.signIn);
  const signOut = useDemo((s) => s.signOut);

  return (
    <>
      <PageHeader title="Profile" />
      <div className="space-y-5 px-4">
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-card p-6 text-center ring-1 ring-foreground/10">
          <Avatar className="size-20">
            <AvatarFallback className="bg-accent text-2xl font-semibold text-accent-foreground">{FUNDI.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="flex items-center justify-center gap-1.5 font-heading text-xl font-bold">
              {FUNDI.name} <BadgeCheck className="size-5 text-primary" aria-label="Verified" />
            </p>
            <p className="text-sm text-muted-foreground">Fundi since {FUNDI.since}</p>
          </div>
          <div className="grid w-full grid-cols-3 divide-x rounded-2xl bg-muted/60 py-3 text-sm">
            <div>
              <p className="flex items-center justify-center gap-1 font-bold">
                {FUNDI.rating} <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
              </p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div>
              <p className="font-bold">{FUNDI.jobs}</p>
              <p className="text-xs text-muted-foreground">Jobs</p>
            </div>
            <div>
              <p className="font-bold">98%</p>
              <p className="text-xs text-muted-foreground">On time</p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {FUNDI.skills.map((s) => (
              <Badge key={s} variant="secondary" className="h-7 px-3 text-sm">
                {s}
              </Badge>
            ))}
          </div>
        </section>

        <section className="divide-y rounded-2xl bg-card ring-1 ring-foreground/10">
          {DOCUMENTS.map((d) => (
            <div key={d} className="flex items-center gap-3 px-4 py-3">
              <CheckCircle2 className="size-5 text-success" />
              <span className="flex-1 text-sm font-medium">{d}</span>
              <span className="text-xs text-muted-foreground">Verified</span>
            </div>
          ))}
        </section>

        <section className="space-y-3 rounded-2xl bg-card p-4 text-sm ring-1 ring-foreground/10">
          <p className="flex items-center gap-3">
            <MapPin className="size-5 text-primary" /> {FUNDI.area}
          </p>
          <p className="flex items-center gap-3">
            <NetworkChip method="mtn" className="size-8 rounded-lg text-[9px]" /> Payouts to MTN MoMo {FUNDI.phone}
          </p>
          <div className="flex items-center justify-between">
            <span>Theme</span>
            <ThemeToggle />
          </div>
        </section>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="h-12 w-full"
            onClick={() => {
              signIn("customer");
              router.push("/app");
            }}
          >
            <Car data-icon="inline-start" /> Switch to customer mode
          </Button>
          <Button
            variant="ghost"
            className="h-12 w-full text-destructive hover:text-destructive"
            onClick={() => {
              signOut("fundi");
              router.replace("/");
            }}
          >
            <LogOut data-icon="inline-start" /> Sign out
          </Button>
        </div>
      </div>
    </>
  );
}

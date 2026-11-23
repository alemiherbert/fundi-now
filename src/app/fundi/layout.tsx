"use client";

import { BadgeCheck, Briefcase, UserRound, Wallet } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { OfferOverlay } from "@/components/fundi/offer-overlay";
import { BottomNav, type NavItem } from "@/components/shell/bottom-nav";
import { MobileFrame } from "@/components/shell/mobile-frame";
import { ScreenSkeleton } from "@/components/shell/screen-skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { FUNDI } from "@/lib/demo/data";
import { useDemo, useHydrated } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

const NAV: NavItem[] = [
  { href: "/fundi", label: "Jobs", icon: Briefcase, exact: true },
  { href: "/fundi/earnings", label: "Earnings", icon: Wallet },
  { href: "/fundi/profile", label: "Profile", icon: UserRound },
];

export default function FundiLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const signedIn = useDemo((s) => s.session.fundi);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !signedIn) router.replace("/login?as=fundi");
  }, [hydrated, signedIn, router]);

  if (!hydrated || !signedIn) return <ScreenSkeleton />;

  const onJob = pathname.startsWith("/fundi/job");
  return (
    <MobileFrame>
      {!onJob && <FundiHeader />}
      <main className={onJob ? "flex flex-1 flex-col" : "flex flex-1 flex-col pb-24"}>{children}</main>
      {!onJob && <BottomNav items={NAV} />}
      <OfferOverlay />
    </MobileFrame>
  );
}

function FundiHeader() {
  const online = useDemo((s) => s.fundiOnline);
  const setOnline = useDemo((s) => s.setFundiOnline);
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background/90 px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 backdrop-blur-lg">
      <Avatar className="size-10">
        <AvatarFallback className="bg-accent font-semibold text-accent-foreground">{FUNDI.initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 font-semibold">
          {FUNDI.short} <BadgeCheck className="size-4 text-primary" aria-label="Verified" />
        </p>
        <p className="text-xs text-muted-foreground">Fundi Now partner</p>
      </div>
      <label
        className={cn(
          "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
          online ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
        )}
      >
        {online ? "Online" : "Offline"}
        <Switch checked={online} onCheckedChange={setOnline} aria-label="Online" />
      </label>
    </header>
  );
}

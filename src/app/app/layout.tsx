"use client";

import { Car, ClipboardList, House, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { BottomNav, type NavItem } from "@/components/shell/bottom-nav";
import { MobileFrame } from "@/components/shell/mobile-frame";
import { ScreenSkeleton } from "@/components/shell/screen-skeleton";
import { useAutopilot } from "@/lib/demo/autopilot";
import { useDemo, useHydrated } from "@/lib/demo/store";

const NAV: NavItem[] = [
  { href: "/app", label: "Home", icon: House, exact: true },
  { href: "/app/jobs", label: "Jobs", icon: ClipboardList },
  { href: "/app/garage", label: "Garage", icon: Car },
  { href: "/app/account", label: "Account", icon: User },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const signedIn = useDemo((s) => s.session.customer);
  const router = useRouter();
  const pathname = usePathname();
  useAutopilot();

  useEffect(() => {
    if (hydrated && !signedIn) router.replace("/login");
  }, [hydrated, signedIn, router]);

  if (!hydrated || !signedIn) return <ScreenSkeleton />;

  const fullScreen = pathname.startsWith("/app/request") || pathname.startsWith("/app/job/") || pathname === "/app/job";
  return (
    <MobileFrame>
      <main className={fullScreen ? "flex flex-1 flex-col" : "flex flex-1 flex-col pb-24"}>{children}</main>
      {!fullScreen && <BottomNav items={NAV} />}
    </MobileFrame>
  );
}

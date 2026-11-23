"use client";

import { ThemeProvider } from "next-themes";

import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import { Toaster } from "@/components/ui/sonner";
import { DemoStoreSync } from "@/lib/demo/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DemoStoreSync />
      <ServiceWorkerRegister />
      {children}
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

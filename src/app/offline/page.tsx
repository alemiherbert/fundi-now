import { WifiOff } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 p-8 text-center">
      <WifiOff className="size-10 text-muted-foreground" />
      <h1 className="font-heading text-xl font-bold">You’re offline</h1>
      <p className="text-muted-foreground">Check your connection. Fundi Now picks up where you left off when you’re back.</p>
    </main>
  );
}

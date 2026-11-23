import type { Metadata } from "next";
import { Suspense } from "react";

import { ScreenSkeleton } from "@/components/shell/screen-skeleton";

import { LoginFlow } from "./login-flow";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <LoginFlow />
    </Suspense>
  );
}

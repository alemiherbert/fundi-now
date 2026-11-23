import type { Metadata } from "next";
import { Suspense } from "react";

import { RequestFlow } from "./request-flow";

export const metadata: Metadata = { title: "Request help" };

export default function RequestPage() {
  return (
    <Suspense fallback={null}>
      <RequestFlow />
    </Suspense>
  );
}

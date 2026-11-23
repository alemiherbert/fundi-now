"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { ServiceIcon } from "@/components/service-icon";
import { serviceById } from "@/lib/demo/data";
import { STATUS_LABEL } from "@/lib/demo/status";
import { useActiveJob } from "@/lib/demo/store";

export function ActiveJobBanner({ href = "/app/job" }: { href?: string }) {
  const job = useActiveJob();
  if (!job || job.status === "cancelled") return null;
  const service = serviceById(job.serviceId);
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl bg-accent p-4 text-accent-foreground ring-1 ring-primary/20 transition active:scale-[0.99]"
    >
      <span className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
        <ServiceIcon id={job.serviceId} className="size-5" />
        <span className="absolute -top-0.5 -right-0.5 size-3 animate-pulse rounded-full bg-primary ring-2 ring-accent" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{STATUS_LABEL[job.status]}</span>
        <span className="block truncate text-sm opacity-80">
          {service.name} · {job.ref}
        </span>
      </span>
      <ChevronRight className="size-5 opacity-70" />
    </Link>
  );
}

"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";

import { ActiveJobBanner } from "@/components/job/active-job-banner";
import { METHOD_LABEL } from "@/components/job/network-chip";
import { ServiceIcon } from "@/components/service-icon";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceById } from "@/lib/demo/data";
import { useActiveJob, useDemo } from "@/lib/demo/store";
import { formatDate, ugx } from "@/lib/format";

export default function JobsPage() {
  const jobs = useDemo((s) => s.jobs);
  const active = useActiveJob();
  const past = jobs.filter((j) => j.id !== active?.id && (j.status === "reviewed" || j.status === "paid" || j.status === "cancelled"));

  return (
    <>
      <PageHeader title="Jobs" />
      <Tabs defaultValue={active ? "active" : "past"} className="px-4">
        <TabsList className="w-full">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="pt-3">
          {active ? (
            <ActiveJobBanner />
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ClipboardList />
                </EmptyMedia>
                <EmptyTitle>No active jobs</EmptyTitle>
                <EmptyDescription>When you request help, you can follow it here.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href="/app/request">Request a fundi</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </TabsContent>
        <TabsContent value="past" className="space-y-2 pt-3">
          {past.map((job) => (
            <div key={job.id} className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <ServiceIcon id={job.serviceId} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{serviceById(job.serviceId).name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {formatDate(job.createdAt)} · {job.ref}
                  {job.payment ? ` · ${METHOD_LABEL[job.payment.method]}` : ""}
                </p>
              </div>
              <div className="text-right">
                {job.status === "cancelled" ? (
                  <Badge variant="secondary">Cancelled</Badge>
                ) : (
                  <p className="font-semibold tabular-nums">{job.payment ? ugx(job.payment.amount) : "—"}</p>
                )}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </>
  );
}

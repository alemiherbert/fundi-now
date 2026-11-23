"use client";

import { BadgeCheck, MessageCircle, Phone, Share2, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FUNDI } from "@/lib/demo/data";

import { shareTrip } from "./share";

export function FundiCard({ jobRef, onChat, compact = false }: { jobRef: string; onChat?: () => void; compact?: boolean }) {
  return (
    <div className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-center gap-3">
        <Avatar className="size-14">
          <AvatarFallback className="bg-accent text-lg font-semibold text-accent-foreground">{FUNDI.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold">{FUNDI.short}</p>
            <BadgeCheck className="size-4 shrink-0 text-primary" aria-label="ID verified" />
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            {FUNDI.rating} · {FUNDI.jobs} jobs
          </p>
          <p className="text-sm text-muted-foreground">
            {FUNDI.ride} · <span className="font-mono font-semibold text-foreground">{FUNDI.plate}</span>
          </p>
        </div>
      </div>
      {!compact && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button asChild variant="secondary" className="h-11">
            <a href={`tel:${FUNDI.phone.replace(/\s/g, "")}`}>
              <Phone /> Call
            </a>
          </Button>
          <Button variant="secondary" className="h-11" onClick={onChat}>
            <MessageCircle /> Chat
          </Button>
          <Button variant="secondary" className="h-11" onClick={() => shareTrip(jobRef)}>
            <Share2 /> Share
          </Button>
        </div>
      )}
    </div>
  );
}

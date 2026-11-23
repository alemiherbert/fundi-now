"use client";

import { MessageCircle } from "lucide-react";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

const MESSAGES = [
  { time: "14:02", text: "✅ Booking confirmed: FN-4821. We’re finding you a verified fundi near Ntinda." },
  { time: "14:03", text: "🛵 Kato M. is on the way (Boda UFK 456B). Arriving in about 8 min. Your start PIN is 4821.\n\nTrack live ›" },
  { time: "14:19", text: "🧾 Your quote is ready: UGX 500,000 for battery replacement.\n\nReview and approve ›" },
  { time: "14:41", text: "💸 Payment received: UGX 500,000 via MTN MoMo. Ref MP261123. Thank you for using Fundi Now!" },
];

/** Mock preview of the WhatsApp notifications the live version would send. */
export function WhatsAppPreview({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-center gap-2 md:justify-start">
              <MessageCircle className="size-5 text-[#25d366]" /> Updates on WhatsApp
            </DrawerTitle>
            <DrawerDescription>Preview: how job updates arrive on WhatsApp in the live version.</DrawerDescription>
          </DrawerHeader>
          <div className="mx-4 mb-6 space-y-2 rounded-2xl bg-[#efeae2] p-3 dark:bg-[#0b141a]">
            <p className="mx-auto w-fit rounded-md bg-white/80 px-2 py-0.5 text-[11px] text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
              Fundi Now · verified business
            </p>
            {MESSAGES.map((m) => (
              <div
                key={m.time}
                className="max-w-[85%] rounded-xl rounded-tl-sm bg-white px-3 py-2 text-sm whitespace-pre-line text-neutral-900 shadow-sm dark:bg-[#202c33] dark:text-neutral-100"
              >
                {m.text}
                <span className="mt-1 block text-right text-[10px] text-neutral-500 dark:text-neutral-400">{m.time}</span>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

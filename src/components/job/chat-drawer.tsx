"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { CUSTOMER, FUNDI } from "@/lib/demo/data";
import { cn } from "@/lib/utils";

type Msg = { from: "me" | "them"; text: string };

const OPENERS: Record<"customer" | "fundi", Msg[]> = {
  customer: [{ from: "them", text: "Hello Sarah, I’m on my way. See you soon." }],
  fundi: [{ from: "them", text: "Hi Kato, I’m parked near Capital Shoppers. Silver Premio." }],
};

const QUICK: Record<"customer" | "fundi", string[]> = {
  customer: ["I’m by the main gate", "Silver Toyota Premio", "Please call when close"],
  fundi: ["On my way", "Arriving in 5 minutes", "I’ve arrived"],
};

export function ChatDrawer({
  open,
  onOpenChange,
  as,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  as: "customer" | "fundi";
}) {
  const [messages, setMessages] = useState<Msg[]>(OPENERS[as]);
  const [text, setText] = useState("");
  const other = as === "customer" ? FUNDI.short : CUSTOMER.name;

  function send(value: string) {
    const v = value.trim();
    if (!v) return;
    setMessages((m) => [...m, { from: "me", text: v }]);
    setText("");
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col">
          <DrawerHeader>
            <DrawerTitle>Chat with {other}</DrawerTitle>
            <DrawerDescription>Numbers stay private. Messages are kept with the job.</DrawerDescription>
          </DrawerHeader>
          <div className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto px-4">
            {messages.map((m, i) => (
              <p
                key={i}
                className={cn(
                  "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                  m.from === "me" ? "self-end rounded-br-md bg-primary text-primary-foreground" : "self-start rounded-bl-md bg-muted",
                )}
              >
                {m.text}
              </p>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pt-3 pb-1">
            {QUICK[as].map((q) => (
              <Button key={q} variant="outline" size="sm" className="shrink-0" onClick={() => send(q)}>
                {q}
              </Button>
            ))}
          </div>
          <form
            className="flex gap-2 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
          >
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" className="h-11" />
            <Button type="submit" size="icon-lg" aria-label="Send">
              <Send />
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

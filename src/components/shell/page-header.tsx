import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PageHeader({ title, back, action }: { title: string; back?: string; action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-background/90 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-lg">
      {back && (
        <Button asChild variant="ghost" size="icon-lg" className="-ml-2">
          <Link href={back} aria-label="Back">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
      )}
      <h1 className="font-heading text-lg font-semibold">{title}</h1>
      {action && <div className="ml-auto">{action}</div>}
    </header>
  );
}

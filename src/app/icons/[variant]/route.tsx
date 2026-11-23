import { ImageResponse } from "next/og";

import { AppIcon } from "@/lib/app-icon";

export const dynamic = "force-static";

const VARIANTS = {
  "192": { size: 192, maskable: false },
  "512": { size: 512, maskable: false },
  maskable: { size: 512, maskable: true },
} as const;

type Variant = keyof typeof VARIANTS;

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variant) => ({ variant }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const v = VARIANTS[(variant in VARIANTS ? variant : "512") as Variant];
  return new ImageResponse(<AppIcon size={v.size} maskable={v.maskable} />, { width: v.size, height: v.size });
}

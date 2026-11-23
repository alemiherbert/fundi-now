import type { Metadata, Viewport } from "next";
import { Figtree, Geist_Mono } from "next/font/google";

import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "Fundi Now", template: "%s · Fundi Now" },
  description: "A trusted mechanic, wherever you are in Kampala.",
  applicationName: "Fundi Now",
  appleWebApp: { capable: true, title: "Fundi Now", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#121621" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full font-sans antialiased", figtree.variable, geistMono.variable)}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

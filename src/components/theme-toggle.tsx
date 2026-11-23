"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={theme ?? "system"}
      onValueChange={(v) => v && setTheme(v)}
      aria-label="Theme"
    >
      <ToggleGroupItem value="light" aria-label="Light">
        <Sun />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark">
        <Moon />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="Match system">
        <Monitor />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

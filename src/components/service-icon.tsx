import {
  BatteryCharging,
  Bike,
  CarFront,
  Fuel,
  Gauge,
  KeyRound,
  LifeBuoy,
  ThermometerSun,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { ServiceId } from "@/lib/demo/data";

const ICONS: Record<ServiceId, LucideIcon> = {
  battery: BatteryCharging,
  flat_tyre: LifeBuoy,
  fuel: Fuel,
  lockout: KeyRound,
  overheating: ThermometerSun,
  wont_start: CarFront,
  diagnostics: Gauge,
  service: Wrench,
  boda: Bike,
};

export function ServiceIcon({ id, className }: { id: ServiceId; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className} />;
}

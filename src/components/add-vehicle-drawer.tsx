"use client";

import { Bike, Car } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { VehicleType } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";

export function AddVehicleDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const addVehicle = useDemo((s) => s.addVehicle);
  const [type, setType] = useState<VehicleType>("car");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const valid = make.trim() && model.trim() && plate.trim();

  function save() {
    if (!valid) return;
    addVehicle({
      type,
      make: make.trim(),
      model: model.trim(),
      year: Number(year) || new Date().getFullYear(),
      plate: plate.trim().toUpperCase(),
      color: "",
    });
    toast.success(`${make} ${model} added`);
    setMake("");
    setModel("");
    setYear("");
    setPlate("");
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Add a vehicle</DrawerTitle>
            <DrawerDescription>So your fundi brings the right parts.</DrawerDescription>
          </DrawerHeader>
          <FieldGroup className="px-4">
            <ToggleGroup
              type="single"
              variant="outline"
              value={type}
              onValueChange={(v) => v && setType(v as VehicleType)}
              className="w-full"
            >
              <ToggleGroupItem value="car" className="h-11 flex-1">
                <Car /> Car
              </ToggleGroupItem>
              <ToggleGroupItem value="boda" className="h-11 flex-1">
                <Bike /> Boda
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="v-make">Make</FieldLabel>
                <Input id="v-make" value={make} onChange={(e) => setMake(e.target.value)} placeholder={type === "car" ? "Toyota" : "Bajaj"} className="h-11" />
              </Field>
              <Field>
                <FieldLabel htmlFor="v-model">Model</FieldLabel>
                <Input id="v-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder={type === "car" ? "Wish" : "Boxer"} className="h-11" />
              </Field>
              <Field>
                <FieldLabel htmlFor="v-year">Year</FieldLabel>
                <Input id="v-year" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2012" className="h-11" />
              </Field>
              <Field>
                <FieldLabel htmlFor="v-plate">Number plate</FieldLabel>
                <Input id="v-plate" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="UBA 123A" className="h-11 uppercase" />
              </Field>
            </div>
          </FieldGroup>
          <DrawerFooter>
            <Button size="lg" className="h-12" onClick={save} disabled={!valid}>
              Save vehicle
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

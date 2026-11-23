// Mock data for the client demo. Everything here is fictional.

export type ServiceId =
  | "battery"
  | "flat_tyre"
  | "fuel"
  | "lockout"
  | "overheating"
  | "wont_start"
  | "diagnostics"
  | "service"
  | "boda";

export interface Service {
  id: ServiceId;
  name: string;
  short: string;
  blurb: string;
  fromPrice: number;
}

export const SERVICES: Service[] = [
  { id: "battery", name: "Battery or jump-start", short: "Battery", blurb: "Flat battery, clicking, no lights", fromPrice: 30000 },
  { id: "flat_tyre", name: "Flat tyre", short: "Flat tyre", blurb: "Puncture, no spare, wheel change", fromPrice: 25000 },
  { id: "fuel", name: "Out of fuel", short: "Fuel", blurb: "We bring fuel to you", fromPrice: 20000 },
  { id: "lockout", name: "Locked out", short: "Lockout", blurb: "Keys locked inside", fromPrice: 40000 },
  { id: "overheating", name: "Overheating", short: "Overheating", blurb: "Temperature light, steam, leaks", fromPrice: 50000 },
  { id: "wont_start", name: "Won't start", short: "Won't start", blurb: "Cranks but won't start", fromPrice: 50000 },
  { id: "diagnostics", name: "Engine check", short: "Diagnose", blurb: "Warning light, computer scan", fromPrice: 60000 },
  { id: "service", name: "Car service", short: "Service", blurb: "Oil, filters and checks at your place", fromPrice: 150000 },
  { id: "boda", name: "Boda repair", short: "Boda", blurb: "Chain, brakes, electrics", fromPrice: 15000 },
];

export const serviceById = (id: ServiceId) => SERVICES.find((s) => s.id === id) ?? SERVICES[0];

export const CALLOUT_FEE = 20000;
/** Platform commission on labour + call-out (parts pass through). */
export const COMMISSION_RATE = 0.15;

export type VehicleType = "car" | "boda";

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string;
}

export const DEFAULT_VEHICLES: Vehicle[] = [
  { id: "v1", type: "car", make: "Toyota", model: "Premio", year: 2008, plate: "UBK 123A", color: "Silver" },
  { id: "v2", type: "boda", make: "Bajaj", model: "Boxer 150", year: 2021, plate: "UEX 789C", color: "Black" },
];

export const vehicleName = (v?: Vehicle) => (v ? `${v.make} ${v.model}` : "Vehicle");

export interface Place {
  lat: number;
  lng: number;
  label: string;
  area: string;
  landmark: string;
}

export const CUSTOMER_LOCATION: Place = {
  lat: 0.349251,
  lng: 32.616803,
  label: "Ntinda Road",
  area: "Ntinda, Kampala",
  landmark: "Near Capital Shoppers",
};

export const CUSTOMER = { name: "Sarah Nakato", first: "Sarah", initials: "SN", phone: "+256 772 123 456" };

export const FUNDI = {
  name: "Kato Musa",
  short: "Kato M.",
  first: "Kato",
  initials: "KM",
  rating: 4.8,
  jobs: 214,
  since: 2021,
  ride: "Boda",
  plate: "UFK 456B",
  phone: "+256 701 234 567",
  area: "Bukoto, Ntinda, Kisaasi",
  skills: ["Batteries & electrics", "Tyres", "Engine diagnostics", "Cooling systems", "Boda repair"],
};

export const DEMO_OTP = "123456";

export const QUOTE_TEMPLATES: Record<ServiceId, { kind: "part" | "labour"; label: string; amount: number }[]> = {
  battery: [
    { kind: "part", label: "N70 battery, 12V", amount: 450000 },
    { kind: "labour", label: "Fitting & terminal clean", amount: 30000 },
  ],
  flat_tyre: [
    { kind: "part", label: "Tubeless repair plug", amount: 15000 },
    { kind: "labour", label: "Puncture repair & refit", amount: 20000 },
  ],
  fuel: [
    { kind: "part", label: "Petrol, 5 litres", amount: 25000 },
    { kind: "labour", label: "Fuel delivery", amount: 10000 },
  ],
  lockout: [{ kind: "labour", label: "Lockout service", amount: 60000 }],
  overheating: [
    { kind: "part", label: "Radiator hose", amount: 45000 },
    { kind: "part", label: "Coolant, 4 litres", amount: 40000 },
    { kind: "labour", label: "Replace hose & refill", amount: 40000 },
  ],
  wont_start: [
    { kind: "part", label: "Starter relay", amount: 35000 },
    { kind: "labour", label: "Diagnosis & repair", amount: 50000 },
  ],
  diagnostics: [{ kind: "labour", label: "Computer scan & report", amount: 60000 }],
  service: [
    { kind: "part", label: "Engine oil 4L + filter", amount: 160000 },
    { kind: "labour", label: "Minor service", amount: 60000 },
  ],
  boda: [
    { kind: "part", label: "Chain & sprocket set", amount: 70000 },
    { kind: "labour", label: "Fitting", amount: 15000 },
  ],
};

/** Simulated time shown to users for the trip (the demo plays it faster). */
export const ROUTE_MINUTES = 8;

/** Road route Bukoto → Ntinda Road (OpenStreetMap data via OSRM), as [lng, lat]. */
export const ROUTE: [number, number][] = [
  [32.601078, 0.354644], [32.601548, 0.354237], [32.601541, 0.35419], [32.602228, 0.353712], [32.602479, 0.353547],
  [32.602643, 0.353448], [32.60289, 0.353293], [32.60309, 0.353167], [32.603421, 0.352944], [32.603555, 0.352848],
  [32.603617, 0.352802], [32.603657, 0.352765], [32.603674, 0.352745], [32.603688, 0.352727], [32.603702, 0.352699],
  [32.603714, 0.352669], [32.603729, 0.352614], [32.603724, 0.352405], [32.603729, 0.352295], [32.603734, 0.352169],
  [32.603737, 0.352039], [32.603749, 0.351789], [32.603761, 0.35163], [32.603788, 0.351402], [32.604085, 0.351488],
  [32.604463, 0.351602], [32.605018, 0.351755], [32.605299, 0.351827], [32.605341, 0.351836], [32.606034, 0.35197],
  [32.606108, 0.351891], [32.6062, 0.351812], [32.606378, 0.35166], [32.606604, 0.351879], [32.606843, 0.352127],
  [32.606965, 0.352211], [32.607073, 0.352291], [32.607106, 0.35231], [32.607184, 0.352355], [32.607414, 0.352466],
  [32.607663, 0.352544], [32.607807, 0.352582], [32.607975, 0.352606], [32.608103, 0.352615], [32.608142, 0.352618],
  [32.608208, 0.352623], [32.608313, 0.352631], [32.608378, 0.352635], [32.608702, 0.352654], [32.608878, 0.352677],
  [32.609069, 0.35272], [32.609309, 0.3528], [32.609589, 0.352917], [32.609704, 0.352974], [32.609784, 0.353006],
  [32.609855, 0.353038], [32.609951, 0.35308], [32.61, 0.353102], [32.610144, 0.353178], [32.61017, 0.353192],
  [32.61041, 0.353319], [32.610615, 0.353444], [32.610732, 0.353515], [32.610804, 0.353559], [32.610927, 0.353647],
  [32.611022, 0.353714], [32.611113, 0.353778], [32.611222, 0.35386], [32.611305, 0.353923], [32.611525, 0.35409],
  [32.61192, 0.354362], [32.612092, 0.354482], [32.612203, 0.354561], [32.612278, 0.354613], [32.612384, 0.354675],
  [32.612753, 0.354894], [32.612841, 0.354937], [32.612913, 0.354964], [32.612949, 0.355011], [32.612992, 0.355044],
  [32.613087, 0.355088], [32.613189, 0.355127], [32.613343, 0.35517], [32.613514, 0.355211], [32.613665, 0.355246],
  [32.613882, 0.355298], [32.613946, 0.355319], [32.613998, 0.355255], [32.614116, 0.355116], [32.614147, 0.35508],
  [32.614271, 0.35491], [32.614432, 0.354674], [32.61454, 0.354509], [32.614573, 0.354449], [32.614614, 0.354376],
  [32.614626, 0.354357], [32.614698, 0.354238], [32.614816, 0.35395], [32.614851, 0.353859], [32.615018, 0.353323],
  [32.615099, 0.353015], [32.615121, 0.352938], [32.61516, 0.352809], [32.615359, 0.352136], [32.615466, 0.351781],
  [32.615583, 0.351402], [32.615717, 0.350978], [32.61585, 0.350581], [32.616934, 0.351192], [32.617331, 0.350559],
  [32.617046, 0.350472], [32.616987, 0.350454], [32.61684, 0.350406], [32.616615, 0.350311], [32.616566, 0.350264],
  [32.616536, 0.350217], [32.616543, 0.350147], [32.616644, 0.34987], [32.61678, 0.349507],
];

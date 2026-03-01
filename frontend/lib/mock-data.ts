export interface Machine {
  id: string;
  name: string;
  type: "excavator" | "dozer" | "loader" | "grader" | "compactor" | "truck";
  model: string;
  lastInspection: string;
  status: "pass" | "fail" | "monitor" | "pending";
  location: string;
  hours: number;
}

export interface InspectionCategory {
  id: string;
  name: string;
  requiredPhotos: number;
  items: string[];
}

export interface InspectionResult {
  machineId: string;
  timestamp: string;
  overallStatus: "pass" | "fail" | "monitor";
  confidence: number;
  categories: {
    name: string;
    status: "pass" | "fail" | "monitor";
    finding: string;
  }[];
  summary: string;
  recommendedAction: string;
  partId?: string;
  partName?: string;
  partConfidence?: "high" | "medium" | "low";
}

export const machines: Machine[] = [
  {
    id: "CAT-D6-0472",
    name: "D6 Dozer #472",
    type: "dozer",
    model: "D6",
    lastInspection: "2026-02-26",
    status: "pass",
    location: "Site A - North Sector",
    hours: 4250,
  },
  {
    id: "CAT-320-1138",
    name: "320 Excavator #1138",
    type: "excavator",
    model: "320",
    lastInspection: "2026-02-27",
    status: "monitor",
    location: "Site A - East Sector",
    hours: 3180,
  },
  {
    id: "CAT-950-0891",
    name: "950 Loader #891",
    type: "loader",
    model: "950",
    lastInspection: "2026-02-25",
    status: "pending",
    location: "Site B - Main Yard",
    hours: 5620,
  },
  {
    id: "CAT-140-0234",
    name: "140 Grader #234",
    type: "grader",
    model: "140",
    lastInspection: "2026-02-24",
    status: "fail",
    location: "Site B - Road Section",
    hours: 2890,
  },
  {
    id: "CAT-777-0156",
    name: "777 Truck #156",
    type: "truck",
    model: "777",
    lastInspection: "2026-02-27",
    status: "pass",
    location: "Site A - Haul Route",
    hours: 6100,
  },
  {
    id: "CAT-CS56-0089",
    name: "CS56 Compactor #89",
    type: "compactor",
    model: "CS56",
    lastInspection: "2026-02-23",
    status: "monitor",
    location: "Site C - Foundation",
    hours: 1540,
  },
];

export const inspectionCategories: InspectionCategory[] = [
  {
    id: "tires",
    name: "Tires / Tracks",
    requiredPhotos: 2,
    items: ["Tread depth", "Sidewall condition", "Inflation pressure", "Track tension"],
  },
  {
    id: "battery",
    name: "Battery",
    requiredPhotos: 1,
    items: ["Terminal corrosion", "Cable condition", "Charge level", "Mounting"],
  },
  {
    id: "exterior",
    name: "Exterior",
    requiredPhotos: 2,
    items: ["Body damage", "Glass condition", "Mirrors", "Lights", "Decals"],
  },
  {
    id: "brakes",
    name: "Brakes",
    requiredPhotos: 1,
    items: ["Pad wear", "Fluid level", "Line condition", "Parking brake"],
  },
  {
    id: "engine",
    name: "Engine",
    requiredPhotos: 2,
    items: ["Oil level", "Coolant level", "Belt condition", "Leaks", "Air filter"],
  },
  {
    id: "hydraulics",
    name: "Hydraulics",
    requiredPhotos: 2,
    items: ["Fluid level", "Hose condition", "Cylinder seals", "Leaks"],
  },
];

export const mockInspectionResult: InspectionResult = {
  machineId: "CAT-D6-0472",
  timestamp: "2026-02-28T14:32:00Z",
  overallStatus: "monitor",
  confidence: 91,
  categories: [
    { name: "Tires / Tracks", status: "pass", finding: "Track tension within tolerance" },
    { name: "Battery", status: "pass", finding: "Terminals clean, charge at 98%" },
    { name: "Exterior", status: "pass", finding: "No visible damage" },
    { name: "Brakes", status: "pass", finding: "Pads at 70% life remaining" },
    { name: "Engine", status: "pass", finding: "All fluid levels normal" },
    { name: "Hydraulics", status: "monitor", finding: "Minor seepage at left track tensioner" },
  ],
  summary: "Minor hydraulic seepage detected at left track tensioner. All other systems operating within normal parameters.",
  recommendedAction: "Schedule maintenance within 7 days. Monitor for increased seepage before next shift.",
  partId: "5P-8500",
  partName: "Track Tensioner Seal Kit",
  partConfidence: "high",
};

export function getStatusColor(status: string): string {
  switch (status) {
    case "pass":
      return "bg-green-500";
    case "fail":
      return "bg-cat-red";
    case "monitor":
      return "bg-cat-yellow";
    case "pending":
      return "bg-gray-300";
    default:
      return "bg-gray-300";
  }
}

export function getStatusTextColor(status: string): string {
  switch (status) {
    case "pass":
      return "text-white";
    case "fail":
      return "text-white";
    case "monitor":
      return "text-cat-black";
    case "pending":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
}

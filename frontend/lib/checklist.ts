/**
 * CAT 982 Medium Wheel Loader – Daily Inspection Checklist
 * Based on example_checklist.md. Single product focus.
 */

export const VEHICLE = {
  id: "CAT-982",
  name: "982 Medium Wheel Loader",
  family: "Medium Wheel Loader",
  make: "Caterpillar",
  model: "982",
} as const;

export interface ChecklistStep {
  id: string;
  sectionLabel: string;
  sectionTitle: string;
  name: string;
  items: string[];
}

export const CHECKLIST_STEPS: ChecklistStep[] = [
  // A. FROM THE GROUND
  {
    id: "tires-undercarriage",
    sectionLabel: "A",
    sectionTitle: "From the ground",
    name: "Tires & Undercarriage",
    items: [
      "Inspect tires for wear, cuts, pressure",
      "Inspect rims for cracks or damage",
      "Inspect underneath of machine",
      "Inspect axles",
      "Inspect final drives",
      "Inspect differentials",
      "Inspect brakes",
      "Inspect duo-cone seals",
    ],
  },
  {
    id: "bucket-lift",
    sectionLabel: "A",
    sectionTitle: "From the ground",
    name: "Bucket & Lift System",
    items: [
      "Inspect bucket cutting edge / tips",
      "Inspect bucket tilt cylinders & hoses",
      "Inspect lift cylinders & hoses",
      "Inspect lift arm attachment to frame",
    ],
  },
  {
    id: "drivetrain",
    sectionLabel: "A",
    sectionTitle: "From the ground",
    name: "Drivetrain",
    items: [
      "Inspect transmission & transfer gears",
      "Check differential & final drive oil levels",
      "Check transmission oil level & condition",
    ],
  },
  {
    id: "tanks-fluid",
    sectionLabel: "A",
    sectionTitle: "From the ground",
    name: "Tanks & Fluid Systems",
    items: [
      "Inspect fuel tank for leaks/damage",
      "Inspect hydraulic fluid tank",
      "Inspect brake air tank",
    ],
  },
  {
    id: "safety-access",
    sectionLabel: "A",
    sectionTitle: "From the ground",
    name: "Safety & Access",
    items: [
      "Inspect steps and handrails",
      "Test work lights",
      "Inspect battery & cables",
    ],
  },
  // B. ENGINE COMPARTMENT
  {
    id: "fluid-levels",
    sectionLabel: "B",
    sectionTitle: "Engine compartment",
    name: "Fluid Levels",
    items: [
      "Check engine oil level",
      "Check engine coolant level",
      "Check transmission oil",
      "Check hydraulic fluid level",
    ],
  },
  {
    id: "cooling-system",
    sectionLabel: "B",
    sectionTitle: "Engine compartment",
    name: "Cooling System",
    items: ["Inspect radiator cores for debris", "Inspect coolant condition"],
  },
  {
    id: "fuel-system",
    sectionLabel: "B",
    sectionTitle: "Engine compartment",
    name: "Fuel System",
    items: ["Inspect primary fuel filter", "Inspect secondary fuel filter"],
  },
  {
    id: "air-intake",
    sectionLabel: "B",
    sectionTitle: "Engine compartment",
    name: "Air Intake",
    items: ["Inspect air cleaner", "Check air filter service indicator"],
  },
  {
    id: "belts-hoses",
    sectionLabel: "B",
    sectionTitle: "Engine compartment",
    name: "Belts & Hoses",
    items: ["Inspect hoses for cracks or leaks", "Inspect belts for wear and tension"],
  },
  {
    id: "engine-overall",
    sectionLabel: "B",
    sectionTitle: "Engine compartment",
    name: "Overall Condition",
    items: ["General engine compartment inspection"],
  },
  // C. OUTSIDE THE CAB
  {
    id: "outside-cab",
    sectionLabel: "C",
    sectionTitle: "Outside the cab",
    name: "Exterior & Safety",
    items: [
      "Inspect ROPS/FOPS structure",
      "Verify fire extinguisher is present and charged",
      "Inspect steps & handrails",
      "Inspect side doors",
      "Test windshield wipers & washers",
    ],
  },
  // D. INSIDE THE CAB
  {
    id: "operator-safety",
    sectionLabel: "D",
    sectionTitle: "Inside the cab",
    name: "Operator Safety",
    items: [
      "Inspect seat condition",
      "Inspect seat belt & mounting",
      "Test horn",
      "Test backup alarm",
    ],
  },
  {
    id: "visibility",
    sectionLabel: "D",
    sectionTitle: "Inside the cab",
    name: "Visibility",
    items: ["Inspect windows", "Inspect mirrors"],
  },
  {
    id: "controls-monitoring",
    sectionLabel: "D",
    sectionTitle: "Inside the cab",
    name: "Controls & Monitoring",
    items: [
      "Test indicators & gauges",
      "Test switch functionality",
      "Verify monitor display operation",
    ],
  },
];

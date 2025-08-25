import { type Appliance } from "@shared/schema";

export const defaultAppliances: Omit<Appliance, 'id'>[] = [
  {
    name: "Television 50\"",
    rating: 150,
    backupTime: 6.0,
    units: 2,
    daysPerWeek: 7,
    daysPerMonth: 30,
  },
  {
    name: "1.5Hp Air Conditioner",
    rating: 1200,
    backupTime: 6.0,
    units: 1,
    daysPerWeek: 7,
    daysPerMonth: 30,
  },
  {
    name: "Laptop",
    rating: 90,
    backupTime: 6.0,
    units: 1,
    daysPerWeek: 7,
    daysPerMonth: 30,
  },
  {
    name: "10W LED Light Bulb",
    rating: 10,
    backupTime: 6.0,
    units: 15,
    daysPerWeek: 7,
    daysPerMonth: 30,
  },
  {
    name: "Fridge Medium",
    rating: 150,
    backupTime: 6.0,
    units: 1,
    daysPerWeek: 7,
    daysPerMonth: 30,
  },
  {
    name: "WiFi Modem",
    rating: 25,
    backupTime: 6.0,
    units: 1,
    daysPerWeek: 7,
    daysPerMonth: 30,
  },
  {
    name: "Mobile Phone Charger",
    rating: 15,
    backupTime: 6.0,
    units: 6,
    daysPerWeek: 7,
    daysPerMonth: 30,
  },
  {
    name: "Fan Ceiling",
    rating: 80,
    backupTime: 6.0,
    units: 3,
    daysPerWeek: 7,
    daysPerMonth: 30,
  },
];

export const applianceOptions = [
  { value: "tv-50", label: "Television 50\"", rating: 150, category: "Entertainment" },
  { value: "ac-1.5hp", label: "1.5Hp Air Conditioner", rating: 1200, category: "Cooling & Heating" },
  { value: "laptop", label: "Laptop", rating: 90, category: "Computing" },
  { value: "led-10w", label: "10W LED Light Bulb", rating: 10, category: "Lighting" },
  { value: "fridge", label: "Fridge Medium", rating: 150, category: "Kitchen Appliances" },
  { value: "wifi", label: "WiFi Modem", rating: 25, category: "Computing" },
  { value: "charger", label: "Mobile Phone Charger", rating: 15, category: "Personal Care" },
  { value: "fan", label: "Fan Ceiling", rating: 80, category: "Cooling & Heating" },
  { value: "washing-machine", label: "Washing Machine", rating: 500, category: "Cleaning" },
  { value: "microwave", label: "Microwave", rating: 1000, category: "Kitchen Appliances" },
  { value: "kettle", label: "Electric Kettle", rating: 1500, category: "Kitchen Appliances" },
  { value: "iron", label: "Electric Iron", rating: 1200, category: "Personal Care" },
];

// Helper function to get all appliance options (default + custom)
export function getAllApplianceOptions(customAppliances: any[] = []) {
  const defaultOptions = applianceOptions.map(option => ({
    ...option,
    isCustom: false,
  }));

  const customOptions = customAppliances.map(appliance => ({
    value: appliance.id,
    label: appliance.name,
    rating: appliance.rating,
    category: appliance.category || "Other",
    isCustom: true,
  }));

  return [...defaultOptions, ...customOptions];
}

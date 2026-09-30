// Shared domain types for CivicEye Smart Garbage Collection System.

export type IssueCategory =
  | "organic_kitchen"     // Kitchen & Food Wet Waste
  | "dry_recyclable"      // Plastic, Paper, Metal, Glass
  | "electronic_ewaste"   // Old Electronics, Batteries, Appliances
  | "bulky_debris"        // Mattresses, Furniture, Bulky Debris
  | "hazardous_sanitary"  // Medical, Chemical, Hazardous, Sanitary
  | "garden_green"        // Leaves, Yard Trimmings, Branches
  | "garbage"             // General Community Waste Overflow
  | "pothole"             // Legacy compatibility
  | "other";

export type IssueStatus = "open" | "in_progress" | "resolved" | "cancelled" | "reopened" | "rejected";

export type ResolutionVote = "fixed" | "still_exists";

export type UserRole = "citizen" | "authority";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface IssueImage {
  url: string;
  capturedAt: string;
  kind: "report" | "resolution";
}

export interface IssueComment {
  id: string;
  userId: string;
  body: string;
  createdAt: string;
}

export interface ResolutionVerification {
  fixed: number;
  stillExists: number;
  voters: string[];
}

export interface Issue {
  id: string;
  reference: string; // e.g. "CE-WASTE-2601"
  category: IssueCategory;
  title: string;
  description: string;
  status: IssueStatus;
  location: GeoPoint;
  address?: string;
  landmark?: string;
  municipality: string; // e.g. "Poonamallee", "Thiruverkadu", "Kundrathur", etc.
  quantityEstimate?: string; // e.g. "1-2 Bags (Small)", "3-5 Bags (Medium)", "Bulky / Truckload"
  pickupWindow?: string; // e.g. "Morning (8 AM - 12 PM)", "Afternoon (1 PM - 5 PM)", "Urgent (Within 4 Hours)"
  assignedCrew?: string; // e.g. "Sanitation Truck #04 - Green Squad"
  contactPhone?: string;
  images: IssueImage[];
  aiCategoryConfidence: number;
  aiSpamScore: number;
  priorityScore: number;
  votes: number;
  department?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  verification: ResolutionVerification;
  comments: IssueComment[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  municipality?: string;
  fcmToken?: string;
  createdAt: string;
}

export interface DetectedObject {
  label: string;
  confidence: number;
  category: IssueCategory;
  box: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export interface YoloDetectionResult {
  category: IssueCategory;
  confidence: number;
  detectedObjects: DetectedObject[];
  reason: string;
  suggestedTitle: string;
  suggestedLandmark?: string;
  modelUsed: string;
  priorityScore: number;
  priorityLevel: "Low" | "Medium" | "High" | "Critical";
}

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  organic_kitchen: "Kitchen & Wet Waste",
  dry_recyclable: "Dry Recyclables",
  electronic_ewaste: "E-Waste & Electronics",
  bulky_debris: "Bulky & Furniture",
  hazardous_sanitary: "Hazardous & Sanitary",
  garden_green: "Garden & Yard Green",
  garbage: "General Waste",
  pothole: "Road Defect",
  other: "Mixed Waste",
};

export const STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Pending Pickup",
  in_progress: "Crew Dispatched",
  resolved: "Collected & Cleared",
  cancelled: "Cancelled",
  reopened: "Pending Pickup",
  rejected: "Cancelled",
};

export const MUNICIPALITIES = [
  "Poonamallee",
  "Thiruverkadu",
  "Thiruninravur",
  "Kundrathur",
  "Mangadu",
  "Sriperumbudur",
  "Walajabad",
  "Tirukalukundram",
  "Nandivaram-Guduvancheri",
  "Maraimalai Nagar",
  "Chengalpattu",
  "Ponneri",
  "Tiruttani",
  "Arakkonam",
] as const;

export type MunicipalityName = typeof MUNICIPALITIES[number];

export const DEPARTMENTS: Department[] = [
  { id: "organic", name: "Wet & Organic Composting", code: "OC" },
  { id: "recyclable", name: "Dry Recycling Logistics", code: "DR" },
  { id: "ewaste", name: "E-Waste & Hazardous Units", code: "EH" },
  { id: "bulky", name: "Bulky & Heavy Haulage", code: "BH" },
  { id: "central", name: "Central Rapid Sanitation", code: "RS" },
];

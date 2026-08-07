// Shared domain types for CivicEye.

export type IssueCategory =
  | "pothole"
  | "garbage"
  | "water_leakage"
  | "streetlight"
  | "drainage"
  | "road_damage"
  | "other";

export type IssueStatus = "open" | "in_progress" | "resolved" | "reopened" | "rejected";

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
  reference: string; // short public code e.g. "CE-240812-0134"
  category: IssueCategory;
  title: string;
  description: string;
  status: IssueStatus;
  location: GeoPoint;
  address?: string;
  landmark?: string;
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
  fcmToken?: string;
  createdAt: string;
}

export interface AiAnalysis {
  category: IssueCategory;
  categoryConfidence: number;
  spamScore: number; // 0..1
  duplicateOf?: string; // issue id
  priorityScore: number; // 0..100
  reasons: string[];
}

export interface BoundingBox {
  x1: number; // Normalized 0..100 percentage or pixel coordinate
  y1: number;
  x2: number;
  y2: number;
}

export interface DetectedObject {
  label: string;
  confidence: number;
  category: IssueCategory;
  box: BoundingBox;
}

export interface YoloDetectionResult {
  category: IssueCategory;
  confidence: number; // 0..1
  detectedObjects: DetectedObject[];
  reason: string;
  suggestedTitle: string;
  suggestedLandmark?: string;
  modelUsed: string;
  priorityScore: number; // 0..100
  priorityLevel: "Low" | "Medium" | "High" | "Critical";
}

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  pothole: "Pothole",
  garbage: "Garbage",
  water_leakage: "Water Leakage",
  streetlight: "Streetlight Failure",
  drainage: "Drainage Issue",
  road_damage: "Road Damage",
  other: "Other",
};

export const STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  reopened: "Reopened",
  rejected: "Rejected",
};

export const DEPARTMENTS: Department[] = [
  { id: "roads", name: "Roads & Transport", code: "RT" },
  { id: "sanitation", name: "Sanitation & Waste", code: "SW" },
  { id: "water", name: "Water Supply", code: "WS" },
  { id: "electrical", name: "Electrical & Streetlights", code: "EL" },
  { id: "drainage", name: "Drainage & Sewerage", code: "DS" },
];

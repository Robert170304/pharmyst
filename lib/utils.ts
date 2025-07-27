import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validPasswordPattern =
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,}$";

export const medicineTypes = [
  { value: "pain-relief", label: "Pain Relief" },
  { value: "antibiotics", label: "Antibiotics" },
  { value: "vitamins", label: "Vitamins" },
  { value: "cold-flu", label: "Cold & Flu" },
  { value: "prescription", label: "Prescription" },
];

export const getStockStatusVariant = (
  stockStatus: "in-stock" | "low-stock" | "out-of-stock"
) => {
  if (stockStatus === "out-of-stock") return "destructive" as const;
  if (stockStatus === "low-stock") return "secondary" as const;
  return "default" as const;
};

export const isExpiringSoon = (expiryDate: string) => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 90; // Expiring within 3 months
};

export const API_URLS = {
  GET_PHARMACY_MEDICINES: "medicines/pharmacy",
  GET_MEDICINE_DETAILS: "medicines",
  ADD_MEDICINE: "medicines",
  EDIT_MEDICINE: "medicines",
  LOGIN_PHARMACY: "auth/pharmacy/login",
  REGISTER_PHARMACY: "auth/pharmacy/register",
  VERIFY_PHARMACY: "auth/pharmacy/verify",
  GET_PHARMACY_STATS: "pharmacy/stats",
  DELETE_MEDICINE: "medicines",
  GET_RECENT_MEDICINES: "medicines/recent-updates",
  SEARCH_MEDICINES: "medicines/search",
  GET_PHARMACY_DETAILS: "pharmacy/details",
  UPDATE_PHARMACY_DETAILS: "pharmacy/update",
  CHANGE_PASSWORD: "auth/pharmacy/change-password",
  UPDATE_WEEKLY_HOURS: "pharmacy/update-weekly-hours",
  GET_WEEKLY_HOURS: "pharmacy/get-weekly-hours",
};

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

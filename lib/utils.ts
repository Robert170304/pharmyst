import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// export const getStatusBadge = (status: string) => {
//   switch (status) {
//     case "In Stock":
//       return <Badge variant="default">In Stock</Badge>;
//     case "Low Stock":
//       return <Badge variant="destructive">Low Stock</Badge>;
//     case "Out of Stock":
//       return <Badge variant="secondary">Out of Stock</Badge>;
//     default:
//       return <Badge variant="secondary">{status}</Badge>;
//   }
// };

export const API_URLS = {
  GET_PHARMACY_MEDICINES: "medicines/pharmacy",
  GET_MEDICINE_DETAILS: "medicines",
  ADD_MEDICINE: "medicines",
  EDIT_MEDICINE: "medicines",
  LOGIN_PHARMACY: "auth/pharmacy/login",
  REGISTER_PHARMACY: "auth/pharmacy/register",
  GET_PHARMACY_STATS: "pharmacy/stats",
  DELETE_MEDICINE: "medicines",
};

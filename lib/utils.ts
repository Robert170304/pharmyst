import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URLS = {
  GET_MEDICINES: "medicines",
  ADD_MEDICINE: "medicines",
  LOGIN_PHARMACY: "auth/pharmacy/login",
  REGISTER_PHARMACY: "auth/pharmacy/register",
};

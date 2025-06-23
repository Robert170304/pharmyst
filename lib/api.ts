import { toast } from "@/hooks/use-toast";
import { API_URLS } from "./utils";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import useAppStore from "@/store/useAppStore";

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  validateStatus: () => true, // Always resolve promises (even for error status)
});

// Request Interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = useAppStore.getState().userData?.token;
      if (token && config.headers) {
        config.headers["Authorization"] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getPharmacyMedicines = async (
  pharmacy: any,
  config?: AxiosRequestConfig
) => {
  try {
    const API_URL = `${API_URLS.GET_PHARMACY_MEDICINES}/${pharmacy.pharmacyId}`;
    console.log("API URL:", API_URL, pharmacy);
    const response = await api.get(API_URL, config);

    console.log("Full response data:", JSON.stringify(response.data, null, 2));

    if (response.status !== 200) {
      console.log("API returned non-200 status:", response.status);
      throw new Error(
        `API error: ${response.status} - ${
          response.data?.message || "Medicine API failed"
        }`
      );
    }

    if (response.data.status === false) {
      console.log("API returned status=false in data");
      throw new Error(response.data.message || "Medicine API failed");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "An Axios error occurred"
      );
    }
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const addMedicine = async (
  medicine: any,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await api.post(API_URLS.ADD_MEDICINE, medicine, config);
    if (
      !response.data.status ||
      (response.status !== 200 && response.status !== 201)
    ) {
      toast({
        description: response.data.message || "Add medicine failed",
      });
      throw new Error(
        `API error: ${response.status} - ${
          response.data?.message || "Add medicine failed"
        }`
      );
    }
    return response.data.medicine;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "An Axios error occurred"
      );
    }
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const updateMedicine = async (
  medicine: any,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await api.put(
      `${API_URLS.EDIT_MEDICINE}/${medicine._id}`,
      medicine,
      config
    );
    if (
      !response.data.status ||
      (response.status !== 200 && response.status !== 201)
    ) {
      toast({
        description: response.data.message || "Edit medicine failed",
      });
      throw new Error(
        `API error: ${response.status} - ${
          response.data?.message || "Edit medicine failed"
        }`
      );
    }
    return response.data.medicine;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "An Axios error occurred"
      );
    }
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const loginPharmacy = async (
  creds: any,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await api.post(API_URLS.LOGIN_PHARMACY, creds, config);
    console.log("🚀 ~ response:", response);
    if (
      response.status === 400 ||
      (response.status !== 200 && response.status !== 201)
    ) {
      toast({
        description: response.data.message || "Login failed",
      });
      throw new Error(response.data.message || "Login failed");
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "An Axios error occurred"
      );
    }
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const registerPharma = async (
  creds: any,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await api.post(API_URLS.REGISTER_PHARMACY, creds, config);
    if (
      response.status === 400 ||
      (response.status !== 200 && response.status !== 201)
    ) {
      toast({
        description: response.data.message || "register failed",
      });
      throw new Error(response.data.message || "register failed");
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "An Axios error occurred"
      );
    }
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const getPharmacyStats = async (config?: AxiosRequestConfig) => {
  try {
    const API_URL = `${API_URLS.GET_PHARMACY_STATS}`;
    const response = await api.get(API_URL, config);
    if (response.status !== 200 || response.data.status === false) {
      toast({
        description: response.data.message || "Get pharmacy stats failed",
      });
      throw new Error(
        `API error: ${response.status} - ${
          response.data?.message || "Get pharmacy stats failed"
        }`
      );
    }
    return response.data.stats;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "An Axios error occurred"
      );
    }
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const deleteMedicine = async (
  medicineId: string,
  config?: AxiosRequestConfig
) => {
  console.log("🚀 ~ medicineId:", medicineId);
  try {
    const API_URL = `${API_URLS.DELETE_MEDICINE}/${medicineId}`;
    const response = await api.delete(API_URL, config);
    if (response.status !== 200 || response.data.status === false) {
      toast({
        description: response.data.message || "Delete medicine failed",
      });
      throw new Error(
        `API error: ${response.status} - ${
          response.data?.message || "Delete medicine failed"
        }`
      );
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "An Axios error occurred"
      );
    }
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const getMedicineDetails = async (
  medicineId: string,
  config?: AxiosRequestConfig
) => {
  try {
    const API_URL = `${API_URLS.GET_MEDICINE_DETAILS}/${medicineId}`;
    const response = await api.get(API_URL, config);
    if (response.status !== 200 || response.data.status === false) {
      toast({
        description: response.data.message || "Get medicine details failed",
      });
      throw new Error(
        `API error: ${response.status} - ${
          response.data?.message || "Get medicine details failed"
        }`
      );
    }
    return response.data.medicine;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "An Axios error occurred"
      );
    }
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

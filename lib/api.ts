import { toast } from "@/hooks/use-toast";
import { API_URLS } from "./utils";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

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

export const getMedicines = async (config?: AxiosRequestConfig) => {
  try {
    console.log(
      "API URL:",
      `${api.defaults.baseURL}/${API_URLS.GET_MEDICINES}`
    );

    const response = await api.get(API_URLS.GET_MEDICINES, config);

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
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(
        `API error: ${response.status} - ${
          response.data?.message || "Add medicine failed"
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

"use client";
import { useEffect } from "react";
import useAppStore from "@/store/useAppStore";

export default function AuthInitializer() {
  const initializeAuth = useAppStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize authentication state on app startup
    initializeAuth();
  }, [initializeAuth]);

  return null;
} 
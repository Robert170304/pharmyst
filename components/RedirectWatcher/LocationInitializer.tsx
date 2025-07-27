"use client";
import { useEffect } from "react";
import useAppStore from "@/store/useAppStore";

export default function LocationInitializer() {
  const setUserLocation = useAppStore((s) => s.setUserLocation);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Permission denied or unavailable, do nothing
        }
      );
    }
  }, [setUserLocation]);

  return null;
}

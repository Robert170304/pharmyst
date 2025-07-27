"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, AlertCircle, RefreshCw } from "lucide-react";
import useAppStore from "@/store/useAppStore";

interface LocationPermissionPromptProps {
  onRetry?: () => void;
}

export default function LocationPermissionPrompt({
  onRetry,
}: LocationPermissionPromptProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const setUserLocation = useAppStore((s) => s.setUserLocation);

  const requestLocation = async () => {
    setIsRequesting(true);

    try {
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("🚀 ~ LocationPermissionPrompt ~ position:", position);
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            onRetry?.();
          },
          (error) => {
            console.error("Location error:", error);
            // Handle different error types
            let errorMessage = "Unable to get your location.";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage =
                  "Location access denied. Please enable location permissions in your browser settings.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
              case error.TIMEOUT:
                errorMessage = "Location request timed out.";
                break;
            }
            alert(errorMessage);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Error requesting location:", error);
      alert("An error occurred while requesting location access.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-semibold">
            Location Access Required
          </CardTitle>
          <CardDescription className="text-gray-600">
            We need your location to find nearby pharmacies and show you the
            most relevant search results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 rounded-lg bg-amber-50 p-3 text-left">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Why we need your location:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Find pharmacies near you</li>
                <li>• Calculate distances and directions</li>
                <li>• Show relevant search results</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={requestLocation} disabled={isRequesting} size="lg">
              {isRequesting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Requesting Location...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Allow Location Access
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500">
              Your location data is only used to improve your search experience
              and is not stored or shared.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Star,
  Navigation,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import useAppStore from "@/store/useAppStore";
import { useMediaSize } from "@/hooks/useMediaSize";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom user location icon
const userLocationIcon = new L.DivIcon({
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        width: 40px;
        height: 40px;
        background: rgba(59, 130, 246, 0.2);
        border-radius: 50%;
        position: absolute;
        top: -13px;
        left: -13px;
        animation: pulse 2s infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
    </style>
  `,
  className: "user-location-marker",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Custom pharmacy icon
const pharmacyIcon = new L.DivIcon({
  html: `
    <div style="
      width: 30px;
      height: 30px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      font-size: 16px;
      color: white;
      font-weight: bold;
    ">
      ⚕
    </div>
  `,
  className: "pharmacy-marker",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

interface MapViewProps {
  pharmacies: SearchPharmacyItemDTO[];
  userLocation: { lat: number; lng: number };
  radius?: number;
  updateSearchResults?: () => void;
}

// Map controls component
function MapControls() {
  const map = useMap();
  const { userLocation } = useAppStore();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleFindMyLocation = () => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15);
    }
  };

  const handleResetView = () => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        size="sm"
        variant="outline"
        className="bg-white shadow-md"
        onClick={handleZoomIn}
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-white shadow-md"
        onClick={handleZoomOut}
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-white shadow-md"
        onClick={handleFindMyLocation}
        title="Find My Location"
      >
        <Navigation className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-white shadow-md"
        onClick={handleResetView}
        title="Reset View"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Re-search area component
function ReSearchArea({
  updateSearchResults,
}: {
  updateSearchResults?: () => void;
}) {
  const map = useMap();
  const [showReSearch, setShowReSearch] = useState(false);
  const [initialCenter, setInitialCenter] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter();
      if (initialCenter) {
        const distance = map.distance(initialCenter, [center.lat, center.lng]);
        setShowReSearch(distance > 1000); // Show if moved more than 1km
      } else {
        setInitialCenter([center.lat, center.lng]);
      }
    };

    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, initialCenter]);

  const handleReSearch = () => {
    setShowReSearch(false);
    const center = map.getCenter();
    setInitialCenter([center.lat, center.lng]);
    updateSearchResults?.();
  };

  if (!showReSearch) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
      <Button
        onClick={handleReSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        <RefreshCcw />
        Re-search this area
      </Button>
    </div>
  );
}

export default function MapView({
  pharmacies,
  userLocation,
  radius = 5000,
  updateSearchResults,
}: MapViewProps) {
  const { width } = useMediaSize();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Map View</CardTitle>
          <CardDescription>
            Interactive map showing nearby pharmacies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Loading map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mapHeight = width <= 768 ? "h-[70vh]" : "h-96";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map View</CardTitle>
        <CardDescription>
          Interactive map showing nearby pharmacies
          {pharmacies.length > 0 && ` (${pharmacies.length} found)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`${mapHeight} rounded-lg overflow-hidden relative`}>
          {pharmacies.length === 0 ? (
            <div className="h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No pharmacies found nearby</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search filters or increasing the radius
                </p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="rounded-lg"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User location marker */}
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={userLocationIcon}
              >
                <Popup>
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">You are here</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your current location
                    </p>
                  </div>
                </Popup>
              </Marker>

              {/* Radius circle */}
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={radius}
                pathOptions={{
                  color: "#3b82f6",
                  fillColor: "#3b82f6",
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              />

              {/* Pharmacy markers with clustering */}
              <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={50}
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                zoomToBoundsOnClick={true}
                iconCreateFunction={(cluster: any) => {
                  const count = cluster.getChildCount();
                  return new L.DivIcon({
                    html: `
                      <div style="
                        width: 40px;
                        height: 40px;
                        background: #10b981;
                        border: 3px solid white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        font-size: 14px;
                        color: white;
                        font-weight: bold;
                      ">
                        ${count}
                      </div>
                    `,
                    className: "pharmacy-cluster",
                    iconSize: [40, 40],
                    iconAnchor: [20, 20],
                  });
                }}
              >
                {pharmacies.map((item) => (
                  <Marker
                    key={item.pharmacy._id}
                    position={[
                      item.pharmacy.address.lat,
                      item.pharmacy.address.lng,
                    ]}
                    icon={pharmacyIcon}
                  >
                    <Popup maxWidth={300} className="pharmacy-popup">
                      <div className="p-2">
                        <div className="mb-3">
                          <h3 className="font-semibold text-lg mb-1">
                            {item.pharmacy.pharmacyName}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{item.pharmacy.address.location}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm font-medium">
                                {item.pharmacy.rating}
                              </span>
                            </div>
                            <Badge
                              variant={
                                item.pharmacy.isOpen ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {item.pharmacy.isOpen ? "Open" : "Closed"}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <Phone className="h-4 w-4 mr-1" />
                            <span>{item.pharmacy.phone}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Distance:</span>{" "}
                            {item.pharmacy.distance}
                          </div>
                          {item.medicines.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">
                                Available medicines ({item.medicines.length}):
                              </p>
                              <div className="max-h-20 overflow-y-auto">
                                {item.medicines.slice(0, 3).map((medicine) => (
                                  <div
                                    key={medicine._id}
                                    className="text-xs text-gray-600"
                                  >
                                    • {medicine.name} - ₹{medicine.price}
                                  </div>
                                ))}
                                {item.medicines.length > 3 && (
                                  <div className="text-xs text-gray-500">
                                    +{item.medicines.length - 3} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <Link href={`/pharmacy/${item.pharmacy._id}`}>
                          <Button size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>

              {/* Map controls */}
              <MapControls />

              {/* Re-search area button */}
              <ReSearchArea updateSearchResults={updateSearchResults} />
            </MapContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

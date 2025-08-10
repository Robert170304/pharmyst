"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
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
  Maximize2,
  Minimize2,
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
  focusPharmacyId?: string;
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

// Fullscreen toggle component
function FullscreenToggle({
  isFullscreen,
  onToggle,
}: {
  isFullscreen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <Button
        onClick={onToggle}
        size="sm"
        className="bg-white hover:bg-gray-100 text-gray-700 shadow-lg border"
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
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
  focusPharmacyId,
}: MapViewProps) {
  const { width } = useMediaSize();
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(
    null
  );
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});
  const isMobile = width <= 768;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Fetch driving directions between user's location and a pharmacy using OSRM
  const handleDirections = async (toLat: number, toLng: number) => {
    try {
      setIsRouting(true);
      setRouteError(null);
      // OSRM expects lng,lat order
      const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${toLng},${toLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok || !data?.routes?.length) {
        throw new Error("No route found");
      }
      const coordinates: [number, number][] =
        data.routes[0].geometry.coordinates.map((c: [number, number]) => [
          c[1],
          c[0],
        ]);
      setRouteCoords(coordinates);
    } catch (err: any) {
      setRouteError(err?.message || "Failed to fetch directions");
    } finally {
      setIsRouting(false);
    }
  };

  // Renders and fits the map to the current route polyline
  function RouteLayer({ coords }: { coords: [number, number][] | null }) {
    const map = useMap();
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords.map((c) => L.latLng(c[0], c[1])));
      // Fit bounds with gentle padding
      map.fitBounds(bounds, { padding: [24, 24] });
    }
    return coords ? (
      <Polyline
        positions={coords}
        pathOptions={{ color: "#2563eb", weight: 5 }}
      />
    ) : null;
  }

  // Focus a pharmacy marker and open its popup when focusPharmacyId changes
  function FocusController({ id }: { id?: string }) {
    const map = useMap();
    useEffect(() => {
      if (!id) return;
      const mk = markerRefs.current?.[id];
      if (mk) {
        const latlng = mk.getLatLng();
        map.flyTo(latlng, 16, { duration: 0.75 });
        setTimeout(() => mk.openPopup(), 300);
      } else {
        const ph = pharmacies.find((p) => p.pharmacy._id === id);
        if (ph) {
          const latlng: [number, number] = [
            ph.pharmacy.address.lat,
            ph.pharmacy.address.lng,
          ];
          map.flyTo(latlng, 16, { duration: 0.75 });
        }
      }
    }, [id, map]);
    return null;
  }

  useEffect(() => {
    // Handle escape key to exit fullscreen
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when in fullscreen
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Map View</CardTitle>
          <CardDescription>
            Interactive map showing nearby pharmacies
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 p-4">
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
  const fullscreenMapHeight = "h-screen";

  // Fullscreen overlay component
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="h-full w-full relative">
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className=""
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
                  <p className="text-sm text-gray-600">Your current location</p>
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

            {/* Pharmacy markers */}
            <MarkerClusterGroup>
              {pharmacies.map((item) => (
                <Marker
                  key={item.pharmacy._id}
                  position={[
                    item.pharmacy.address.lat,
                    item.pharmacy.address.lng,
                  ]}
                  icon={pharmacyIcon}
                  ref={(ref) => {
                    if (!markerRefs.current) markerRefs.current = {} as any;
                    // @ts-ignore - react-leaflet marker type
                    markerRefs.current[item.pharmacy._id] = ref as any;
                  }}
                >
                  <Popup maxWidth={300}>
                    <div className="p-2">
                      <h3 className="font-semibold text-lg mb-2">
                        {item.pharmacy.pharmacyName}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">
                            {item.pharmacy.address.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">
                              {item.pharmacy.rating}
                            </span>
                          </div>
                          <Badge
                            variant={
                              item.pharmacy.isOpen ? "default" : "secondary"
                            }
                            className={`text-xs ${
                              item.pharmacy.isOpen
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.pharmacy.isOpen ? "Open" : "Closed"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {item.pharmacy.phone}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">
                            {item.pharmacy.distance} km away
                          </span>
                        </div>
                        {item.medicines && item.medicines.length > 0 && (
                          <div>
                            <p className="font-medium text-gray-700 mb-1">
                              Available medicines:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {item.medicines
                                .slice(0, 3)
                                .map((medicine: any, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {medicine.name}
                                  </Badge>
                                ))}
                              {item.medicines.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.medicines.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              handleDirections(
                                item.pharmacy.address.lat,
                                item.pharmacy.address.lng
                              )
                            }
                            disabled={isRouting}
                          >
                            <Navigation className="h-4 w-4" />
                            {isRouting ? "Routing..." : "Directions"}
                          </Button>
                          <Link
                            href={`/pharmacy/${item.pharmacy._id}`}
                            className="flex-1"
                          >
                            <Button size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </div>
                        {routeError && (
                          <div className="text-xs text-red-600 mt-1">
                            {routeError}
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>

            {/* Route polyline layer */}
            <RouteLayer coords={routeCoords} />
            {/* Focus selected pharmacy */}
            <FocusController id={focusPharmacyId} />

            {/* Map controls */}
            <MapControls />

            {/* Re-search area button */}
            <ReSearchArea updateSearchResults={updateSearchResults} />

            {/* Fullscreen toggle */}
            <FullscreenToggle
              isFullscreen={isFullscreen}
              onToggle={toggleFullscreen}
            />
          </MapContainer>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="md:p-6 p-4">
        <CardTitle>Map View</CardTitle>
        <CardDescription>
          Interactive map showing nearby pharmacies
          {pharmacies.length > 0 && ` (${pharmacies.length} found)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 p-4">
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
                    ref={(ref) => {
                      if (!markerRefs.current) markerRefs.current = {} as any;
                      // @ts-ignore - react-leaflet marker type
                      markerRefs.current[item.pharmacy._id] = ref as any;
                    }}
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
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              handleDirections(
                                item.pharmacy.address.lat,
                                item.pharmacy.address.lng
                              )
                            }
                            disabled={isRouting}
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            {isRouting ? "Routing..." : "Directions"}
                          </Button>
                          <Link
                            href={`/pharmacy/${item.pharmacy._id}`}
                            className="flex-1"
                          >
                            <Button size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </div>
                        {routeError && (
                          <div className="text-xs text-red-600 mt-1">
                            {routeError}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>

              {/* Route polyline layer */}
              <RouteLayer coords={routeCoords} />
              {/* Focus selected pharmacy */}
              <FocusController id={focusPharmacyId} />

              {/* Map controls */}
              <MapControls />

              {/* Re-search area button */}
              <ReSearchArea updateSearchResults={updateSearchResults} />

              {/* Fullscreen toggle */}
              <FullscreenToggle
                isFullscreen={isFullscreen}
                onToggle={toggleFullscreen}
              />
            </MapContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

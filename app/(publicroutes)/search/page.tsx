"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, List, Map, Filter, X } from "lucide-react";
import PharmacyCard from "@/components/pharmacy-card";
import { searchMedicines } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { medicineTypes } from "@/lib/utils";
import useAppStore from "@/store/useAppStore";
import LocationPermissionPrompt from "@/components/LocationPermissionPrompt";
import RadiusSelector from "@/components/RadiusSelector";
import { useMediaSize } from "@/hooks/useMediaSize";
import dynamic from "next/dynamic";

// Dynamically import MapView with SSR disabled to prevent window undefined errors
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

export default function SearchPage() {
  const { width } = useMediaSize();
  const [searchQueries, setSearchQueries] = useState({
    name: "",
    category: "all",
    availability: "all",
    manufacturer: "",
    expiryDate: "",
    pharmacy: "",
    page: 1,
    limit: 10,
    radius: 30,
  });
  const [searchResults, setSearchResults] = useState<SearchPharmacyItemDTO[]>(
    []
  );
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalResults: 0,
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map" | "">("list");
  const [showFilters, setShowFilters] = useState(false);
  const userLocation = useAppStore((s) => s.userLocation);
  console.log("🚀 ~ SearchPage ~ userLocation:", userLocation);

  const fetchSearchResults = async () => {
    setSearchLoading(true);
    try {
      const apiQueries = {
        ...searchQueries,
        userLat: userLocation?.lat || null,
        userLng: userLocation?.lng || null,
        category:
          searchQueries.category === "all" ? "" : searchQueries.category,
        availability:
          searchQueries.availability === "all"
            ? ""
            : searchQueries.availability,
      };
      const results = await searchMedicines(apiQueries);
      console.log("🚀 ~ fetchSearchResults ~ results:", results);
      setSearchResults(results.data || []);
      setPagination(
        results.pagination || {
          limit: 10,
          page: 1,
          totalPages: 1,
          totalResults: 0,
        }
      );
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    // Don't fetch if userLocation is not available yet
    if (!userLocation) {
      return;
    }
    fetchSearchResults();
  }, [searchQueries, userLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          {/* Search Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for medicines..."
                  value={searchQueries.name}
                  onChange={(e) =>
                    setSearchQueries({ ...searchQueries, name: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => {
                    setViewMode("list");
                    if (width <= 768) {
                      setShowFilters(false);
                    }
                  }}
                  size="sm"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  onClick={() => {
                    setViewMode("map");
                    if (width <= 768) {
                      setShowFilters(false);
                    }
                  }}
                  size="sm"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => {
                    setShowFilters(!showFilters);
                    if (width <= 768) {
                      setViewMode("");
                    }
                  }}
                  size="sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <div
                className={`${
                  width <= 768 ? "w-full" : "w-64"
                } bg-white rounded-lg shadow-sm p-6 h-fit`}
              >
                <h3 className="font-semibold mb-4">Filters</h3>

                <div className="space-y-4">
                  <RadiusSelector
                    radius={searchQueries.radius}
                    onRadiusChange={(radius) =>
                      setSearchQueries((q) => ({ ...q, radius }))
                    }
                  />
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Pharmacy</h4>
                    <Input
                      placeholder="e.g., Pharmyst"
                      value={searchQueries.pharmacy}
                      onChange={(e) =>
                        setSearchQueries((q) => ({
                          ...q,
                          pharmacy: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Medicine Type</h4>
                    <Select
                      value={searchQueries.category}
                      onValueChange={(value) =>
                        setSearchQueries((q) => ({ ...q, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {medicineTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Manufacturer</h4>
                    <Input
                      placeholder="e.g., PharmaCorp"
                      value={searchQueries.manufacturer}
                      onChange={(e) =>
                        setSearchQueries((q) => ({
                          ...q,
                          manufacturer: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Expiry Date</h4>
                    <div className="relative">
                      <Input
                        type="date"
                        value={searchQueries.expiryDate}
                        onChange={(e) =>
                          setSearchQueries((q) => ({
                            ...q,
                            expiryDate: e.target.value,
                          }))
                        }
                        className="pr-8 w-full"
                      />
                      {searchQueries.expiryDate && (
                        <button
                          type="button"
                          onClick={() =>
                            setSearchQueries((q) => ({ ...q, expiryDate: "" }))
                          }
                          aria-label="Clear date"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Availability</h4>
                    <Select
                      value={searchQueries.availability}
                      onValueChange={(value) =>
                        setSearchQueries((q) => ({ ...q, availability: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                        <SelectItem value="out-of-stock">
                          Out of Stock
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            {(width <= 768 ? !showFilters : true) && (
              <div className="flex-1">
                {!userLocation ? (
                  <LocationPermissionPrompt />
                ) : viewMode === "list" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">
                        {searchResults.length}{" "}
                        {searchResults.length === 1 ? "pharmacy" : "pharmacies"}{" "}
                        found
                      </h2>
                    </div>

                    {searchResults.map((result: SearchPharmacyItemDTO) => (
                      <PharmacyCard
                        key={result.pharmacy._id}
                        searchItem={result}
                      />
                    ))}
                  </div>
                ) : (
                  //     <Card>
                  //   <CardHeader>
                  //     <CardTitle>Map View</CardTitle>
                  //     <CardDescription>
                  //       Interactive map showing nearby pharmacies
                  //     </CardDescription>
                  //   </CardHeader>
                  //   <CardContent>
                  //     <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  //       <div className="text-center">
                  //         <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  //         <p className="text-gray-500">
                  //           Map integration placeholder
                  //         </p>
                  //         <p className="text-sm text-gray-400">
                  //           Leaflet.js map would be integrated here
                  //         </p>
                  //       </div>
                  //     </div>
                  //   </CardContent>
                  // </Card>
                  <MapView
                    pharmacies={searchResults}
                    userLocation={userLocation}
                    radius={searchQueries.radius * 1000} // Convert km to meters
                    updateSearchResults={fetchSearchResults}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

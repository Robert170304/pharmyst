"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, List, Map, Filter, X, ChevronUp, Loader2 } from "lucide-react";
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
    radius: 30,
  });
  const [searchResults, setSearchResults] = useState<SearchPharmacyItemDTO[]>(
    []
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalResults: 0,
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map" | "">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [focusedPharmacyId, setFocusedPharmacyId] = useState<
    string | undefined
  >(undefined);
  const userLocation = useAppStore((s) => s.userLocation);
  console.log("🚀 ~ SearchPage ~ userLocation:", userLocation);

  const fetchSearchResults = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setSearchLoading(true);
      setSearchResults([]); // Clear results for new search
    }
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
        page: isLoadMore ? pagination.page + 1 : 1,
        limit: pagination.limit,
      };

      const results = await searchMedicines(apiQueries);
      console.log("🚀 ~ fetchSearchResults ~ results:", results);

      if (isLoadMore) {
        // Append new results to existing ones
        setSearchResults((prev) => [...prev, ...(results.data || [])]);
      } else {
        // Replace results for new search
        setSearchResults(results.data || []);
      }

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
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // Don't fetch if userLocation is not available yet
    if (!userLocation) {
      return;
    }
    fetchSearchResults();
  }, [searchQueries, userLocation]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (resultsRef.current) {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        setShowBackToTop(scrollTop > 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoadMore = () => {
    fetchSearchResults(true);
  };

  const scrollToTop = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const canLoadMore = pagination.page < pagination.totalPages;
  const showingCount = searchResults.length;
  const totalCount = pagination.totalResults;

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
                    setFocusedPharmacyId(undefined);
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
                    setFocusedPharmacyId(undefined);
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
                    setFocusedPharmacyId(undefined);
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
                  <div className="space-y-4" ref={resultsRef}>
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">
                        {totalCount > 0 ? (
                          <>
                            Showing {showingCount} of {totalCount} pharmacies
                          </>
                        ) : (
                          "0 pharmacies found"
                        )}
                      </h2>
                    </div>

                    {searchLoading && searchResults.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Searching pharmacies...</span>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No pharmacies found matching your criteria.</p>
                        <p className="text-sm mt-2">
                          Try adjusting your search filters or location.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {searchResults.map(
                            (result: SearchPharmacyItemDTO) => (
                              <PharmacyCard
                                key={result.pharmacy._id}
                                searchItem={result}
                                onViewOnMap={(id) => {
                                  setFocusedPharmacyId(id);
                                  setViewMode("map");
                                  // Scroll to map section smoothly
                                  setTimeout(() => {
                                    document
                                      .querySelector(".pharmacy-map-anchor")
                                      ?.scrollIntoView({ behavior: "smooth" });
                                  }, 0);
                                }}
                              />
                            )
                          )}
                        </div>

                        {/* Load More Button */}
                        {canLoadMore && (
                          <div className="flex justify-center pt-6">
                            <Button
                              onClick={handleLoadMore}
                              disabled={loadingMore}
                              variant="outline"
                              className="min-w-[120px]"
                            >
                              {loadingMore ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Loading...
                                </>
                              ) : (
                                "Load More"
                              )}
                            </Button>
                          </div>
                        )}

                        {!canLoadMore && totalCount > 10 && (
                          <div className="text-center pt-6 text-gray-500 text-sm">
                            You've reached the end of the results
                          </div>
                        )}
                      </>
                    )}
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
                  <>
                    <div className="pharmacy-map-anchor" />
                    <MapView
                      pharmacies={searchResults}
                      userLocation={userLocation}
                      radius={searchQueries.radius * 1000} // Convert km to meters
                      updateSearchResults={fetchSearchResults}
                      focusPharmacyId={focusedPharmacyId}
                      onFocusHandled={() => setFocusedPharmacyId(undefined)}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top FAB */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <ChevronUp className="h-12 w-12" />
          <span className="sr-only">Back to top</span>
        </Button>
      )}
    </div>
  );
}

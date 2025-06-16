"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Search, MapPin, List, Map, Filter } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PharmacyCard from "@/components/pharmacy-card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Dummy data
const pharmacies = [
  {
    id: "1",
    name: "HealthPlus Pharmacy",
    address: "123 Main Street, Downtown",
    distance: "0.5 km",
    phone: "+1 (555) 123-4567",
    stockStatus: "In Stock",
    rating: 4.8,
    isOpen: true,
  },
  {
    id: "2",
    name: "MediCare Central",
    address: "456 Oak Avenue, City Center",
    distance: "1.2 km",
    phone: "+1 (555) 234-5678",
    stockStatus: "Low Stock",
    rating: 4.6,
    isOpen: true,
  },
  {
    id: "3",
    name: "QuickMeds Pharmacy",
    address: "789 Pine Road, Westside",
    distance: "2.1 km",
    phone: "+1 (555) 345-6789",
    stockStatus: "Out of Stock",
    rating: 4.4,
    isOpen: false,
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  size="sm"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  onClick={() => setViewMode("map")}
                  size="sm"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
                <h3 className="font-semibold mb-4">Filters</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Availability</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-stock" />
                        <Label htmlFor="in-stock">In Stock</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="low-stock" />
                        <Label htmlFor="low-stock">Low Stock</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Medicine Type</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="prescription" />
                        <Label htmlFor="prescription">Prescription</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="otc" />
                        <Label htmlFor="otc">Over-the-counter</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {viewMode === "list" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{pharmacies.length} pharmacies found</h2>
                  </div>

                  {pharmacies.map((pharmacy) => (
                    <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Map View</CardTitle>
                    <CardDescription>Interactive map showing nearby pharmacies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Map integration placeholder</p>
                        <p className="text-sm text-gray-400">Leaflet.js map would be integrated here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

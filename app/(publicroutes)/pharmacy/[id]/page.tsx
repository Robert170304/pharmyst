"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Star } from "lucide-react";
import Footer from "@/components/footer";
import MedicineTable from "@/components/medicine-table";
import { useEffect, useState } from "react";
import { getPharmacyDetails, getPharmacyMedicines } from "@/lib/api";
import PharmacyDetailSkeleton from "./details-skeleton";
import { useParams } from "next/navigation";

import { ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function PharmacyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pharmacy, setPharmacy] = useState<PharmacyPublicDTO>({
    _id: "",
    pharmacyName: "",
    address: { location: "", lat: 0, lng: 0 },
    phone: "",
    rating: 0,
    reviews: 0,
    hours: "",
    isOpen: false,
    ownerName: "",
  });

  useEffect(() => {
    if (!params.id) {
      console.error("Pharmacy ID is required");
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const pharmacyData = await getPharmacyDetails(params.id as string);
        setPharmacy(pharmacyData);
      
        const meds = await getPharmacyMedicines({ pharmacyId: params.id });
        setMedicines(meds || []);
        setFilteredMedicines(meds || []);
      } catch (error) {
        console.error("Error fetching pharmacy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredMedicines(medicines);
      return;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = medicines.filter((med: any) => 
      med.name.toLowerCase().includes(lowerQuery) || 
      med.manufacturer.toLowerCase().includes(lowerQuery)
    );
    setFilteredMedicines(filtered);
  }, [searchQuery, medicines]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="link" 
            className="p-0 h-auto text-muted-foreground hover:text-primary mb-4 flex items-center gap-1" 
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to results
          </Button>

          {/* Pharmacy Header */}
          {loading ? (
            <PharmacyDetailSkeleton />
          ) : (
            <Card className="mb-6 relative overflow-hidden">
              <CardHeader className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {pharmacy.pharmacyName}
                    </CardTitle>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {pharmacy.address?.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {pharmacy.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {pharmacy.hours}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-semibold">{pharmacy.rating}</span>
                      <span className="text-gray-500 ml-1">
                        ({pharmacy.reviews} reviews)
                      </span>
                    </div>
                    <Badge variant={pharmacy.isOpen ? "default" : "secondary"}>
                      {pharmacy.isOpen ? "Open Now" : "Closed"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Medicines Section */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Available Medicines</CardTitle>
                  <CardDescription>
                    Current stock of medicines available at this pharmacy
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MedicineTable medicines={filteredMedicines} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

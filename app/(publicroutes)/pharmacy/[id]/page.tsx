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

export default function PharmacyDetailPage() {
  const params = useParams();
  const [medicines, setMedicines] = useState([]);
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
      } catch (error) {
        console.error("Error fetching pharmacy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    getPharmacyMedicines({ pharmacyId: params.id }).then(setMedicines);
  }, [params.id]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Pharmacy Header */}
          {loading ? (
            <PharmacyDetailSkeleton />
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {pharmacy.pharmacyName}
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {pharmacy.address?.location || pharmacy.address}
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
              <CardTitle>Available Medicines</CardTitle>
              <CardDescription>
                Current stock of medicines available at this pharmacy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MedicineTable medicines={medicines} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

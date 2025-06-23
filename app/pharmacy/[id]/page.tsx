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
import { getPharmacyMedicines } from "@/lib/api";

// Dummy data
const pharmacy = {
  id: "1",
  name: "HealthPlus Pharmacy",
  address: "123 Main Street, Downtown, City 12345",
  phone: "+1 (555) 123-4567",
  rating: 4.8,
  reviews: 124,
  hours: "Mon-Sat: 8:00 AM - 10:00 PM, Sun: 9:00 AM - 8:00 PM",
  isOpen: true,
};

const medicines = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    quantity: 150,
    expiryDate: "2025-06-15",
    price: "$5.99",
  },
  {
    id: "2",
    name: "Ibuprofen 400mg",
    quantity: 89,
    expiryDate: "2025-03-22",
    price: "$8.49",
  },
  {
    id: "3",
    name: "Amoxicillin 250mg",
    quantity: 45,
    expiryDate: "2024-12-10",
    price: "$12.99",
  },
  {
    id: "4",
    name: "Cetirizine 10mg",
    quantity: 200,
    expiryDate: "2025-08-30",
    price: "$6.75",
  },
];

export default function PharmacyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    getPharmacyMedicines({ pharmacyId: params.id }).then(setMedicines);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Pharmacy Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {pharmacy.name}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {pharmacy.address}
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

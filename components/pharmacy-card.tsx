import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star } from "lucide-react";
import Link from "next/link";

interface PharmacyCardProps {
  searchItem: SearchPharmacyItemDTO;
}

export default function PharmacyCard({ searchItem }: PharmacyCardProps) {
  // const stockStatusVariant = getStockStatusVariant(searchItem.availability);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {searchItem.pharmacy.pharmacyName}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {searchItem.pharmacy.address?.location ||
                searchItem.pharmacy.address}{" "}
              • {searchItem.pharmacy.distance}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-1">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">
                {searchItem.pharmacy.rating}
              </span>
            </div>
            <Badge
              variant={searchItem.pharmacy.isOpen ? "default" : "secondary"}
            >
              {searchItem.pharmacy.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {searchItem.pharmacy.phone}
            </div>
            {/* <Badge variant={stockStatusVariant}>{medicine.availability}</Badge> */}
          </div>
          <Link href={`/pharmacy/${searchItem.pharmacy._id}`}>
            <Button>View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star, Map as MapIcon } from "lucide-react";
import Link from "next/link";
import useAppStore from "@/store/useAppStore";
import { haversineDistance } from "@/lib/utils";

interface PharmacyCardProps {
  searchItem: SearchPharmacyItemDTO;
  onViewOnMap?: (pharmacyId: string) => void;
}

export default function PharmacyCard({
  searchItem,
  onViewOnMap,
}: PharmacyCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {searchItem.pharmacy.pharmacyName}
            </CardTitle>
            <div className="flex items-start text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
              <span className="flex-1">
                {typeof searchItem.pharmacy.address === "string"
                  ? searchItem.pharmacy.address
                  : searchItem.pharmacy.address?.location}{" "}
                • {searchItem.pharmacy?.distance || "Distance unavailable"}
              </span>
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span className="break-all">{searchItem.pharmacy.phone}</span>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => onViewOnMap?.(searchItem.pharmacy._id)}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              View in Map
            </Button>
            <Link
              prefetch={true}
              href={`/pharmacy/${searchItem.pharmacy._id}`}
              className="flex-1 sm:flex-none"
            >
              <Button className="w-full sm:w-auto">View Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

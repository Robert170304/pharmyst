import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Star } from "lucide-react"
import Link from "next/link"

interface PharmacyCardProps {
  pharmacy: {
    id: string
    name: string
    address: string
    distance: string
    phone: string
    stockStatus: string
    rating: number
    isOpen: boolean
  }
}

export default function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "default"
      case "Low Stock":
        return "secondary"
      case "Out of Stock":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {pharmacy.address} • {pharmacy.distance}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-1">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{pharmacy.rating}</span>
            </div>
            <Badge variant={pharmacy.isOpen ? "default" : "secondary"}>{pharmacy.isOpen ? "Open" : "Closed"}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {pharmacy.phone}
            </div>
            <Badge variant={getStatusColor(pharmacy.stockStatus) as any}>{pharmacy.stockStatus}</Badge>
          </div>
          <Link href={`/pharmacy/${pharmacy.id}`}>
            <Button>View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

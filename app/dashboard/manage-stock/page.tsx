"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Dummy data
const initialMedicines = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    quantity: 150,
    price: 5.99,
    expiryDate: "2025-06-15",
    status: "In Stock",
  },
  {
    id: "2",
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    quantity: 12,
    price: 8.49,
    expiryDate: "2025-03-22",
    status: "Low Stock",
  },
  {
    id: "3",
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    quantity: 45,
    price: 12.99,
    expiryDate: "2024-12-10",
    status: "In Stock",
  },
  {
    id: "4",
    name: "Cetirizine 10mg",
    category: "Cold & Flu",
    quantity: 5,
    price: 6.75,
    expiryDate: "2025-08-30",
    status: "Low Stock",
  },
  {
    id: "5",
    name: "Vitamin D3 1000IU",
    category: "Vitamins",
    quantity: 89,
    price: 15.99,
    expiryDate: "2025-11-20",
    status: "In Stock",
  },
]

export default function ManageStockPage() {
  const { toast } = useToast()
  const [medicines, setMedicines] = useState(initialMedicines)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = (id: string, name: string) => {
    setMedicines((prev) => prev.filter((medicine) => medicine.id !== id))
    toast({
      title: "Medicine Deleted",
      description: `${name} has been removed from inventory.`,
      variant: "destructive",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge variant="default">In Stock</Badge>
      case "Low Stock":
        return <Badge variant="destructive">Low Stock</Badge>
      case "Out of Stock":
        return <Badge variant="secondary">Out of Stock</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Stock</h1>
          <p className="text-gray-600">Manage your medicine inventory</p>
        </div>
        <Link href="/dashboard/add-medicine">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Medicine
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medicine Inventory</CardTitle>
          <CardDescription>View and manage all medicines in your inventory</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>{medicine.quantity}</TableCell>
                  <TableCell>${medicine.price}</TableCell>
                  <TableCell>{medicine.expiryDate}</TableCell>
                  <TableCell>{getStatusBadge(medicine.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(medicine.id, medicine.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredMedicines.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No medicines found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

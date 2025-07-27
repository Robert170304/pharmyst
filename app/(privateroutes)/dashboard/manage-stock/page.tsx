"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { deleteMedicine, getPharmacyMedicines } from "@/lib/api";
import useAppStore from "@/store/useAppStore";
import moment from "moment";
import { getStockStatusVariant, isExpiringSoon } from "@/lib/utils";
import { startCase } from "lodash";
import { useRouter } from "next/navigation";

export default function ManageStockPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { userData } = useAppStore();
  console.log("🚀 ~ ManageStockPage ~ userData:", userData);

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    console.log("🚀 ~ handleDelete ~ id:", id);
    deleteMedicine(id).then(() => {
      console.log(`Medicine with ID ${id} deleted successfully`);
      toast({
        title: "Medicine Deleted",
        description: `${name} has been successfully deleted from inventory.`,
      });
      setMedicines((prev) => prev.filter((medicine) => medicine._id !== id));
    });
  };

  useEffect(() => {
    if (!userData.id) return;
    getPharmacyMedicines({ pharmacyId: userData.id }).then(setMedicines);
  }, [userData.id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Stock</h1>
          <p className="text-gray-600">Manage your medicine inventory</p>
        </div>
        <Link prefetch={true} href="/dashboard/add-medicine">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Medicine
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medicine Inventory</CardTitle>
          <CardDescription>
            View and manage all medicines in your inventory
          </CardDescription>
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
                <TableHead>Medicine Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => {
                const stockStatusVariant = getStockStatusVariant(
                  medicine.availability
                );
                const expiringSoon = isExpiringSoon(medicine.expiryDate);
                return (
                  <TableRow key={medicine._id}>
                    <TableCell className="font-medium">
                      {medicine.name}
                    </TableCell>
                    <TableCell>{startCase(medicine.category)}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell>${medicine.price}</TableCell>
                    <TableCell>
                      {moment(medicine.expiryDate).format("YYYY-MM-DD")}
                      {expiringSoon && (
                        <Badge
                          variant="outline"
                          className="ml-2 text-orange-600 border-orange-600"
                        >
                          Expiring Soon
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {" "}
                      <Badge variant={stockStatusVariant}>
                        {startCase(medicine.availability)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            router.push(
                              `/dashboard/add-medicine/${medicine._id}`
                            );
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDelete(medicine._id, medicine.name)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredMedicines.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No medicines found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

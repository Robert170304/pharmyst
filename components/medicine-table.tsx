import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
interface Medicine {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string;
  price: string;
}

interface MedicineTableProps {
  medicines: Medicine[];
}

export default function MedicineTable({ medicines }: MedicineTableProps) {
  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { status: "Out of Stock", variant: "destructive" as const };
    if (quantity < 20)
      return { status: "Low Stock", variant: "secondary" as const };
    return { status: "In Stock", variant: "default" as const };
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90; // Expiring within 3 months
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medicine Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines.map((medicine) => {
            const stockInfo = getStockStatus(medicine.quantity);
            const expiringSoon = isExpiringSoon(medicine.expiryDate);

            return (
              <TableRow key={medicine.id}>
                <TableCell className="font-medium">{medicine.name}</TableCell>
                <TableCell>{medicine.quantity}</TableCell>
                <TableCell>{medicine.price}</TableCell>
                <TableCell
                  className={expiringSoon ? "text-orange-600 font-medium" : ""}
                >
                  {moment(medicine.expiryDate).format("DD-MM-YYYY")}
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
                  <Badge variant={stockInfo.variant}>{stockInfo.status}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {medicines.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No medicines available at this pharmacy.
          </p>
        </div>
      )}
    </div>
  );
}

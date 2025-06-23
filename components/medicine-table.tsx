import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStockStatusVariant, isExpiringSoon } from "@/lib/utils";
import moment from "moment";
import { startCase } from "lodash";
interface MedicineTableProps {
  medicines: Medicine[];
}

export default function MedicineTable({ medicines }: MedicineTableProps) {
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
            const stockStatusVariant = getStockStatusVariant(
              medicine.availability
            );
            const expiringSoon = isExpiringSoon(medicine.expiryDate);

            return (
              <TableRow key={medicine._id}>
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
                  <Badge variant={stockStatusVariant}>
                    {startCase(medicine.availability)}
                  </Badge>
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

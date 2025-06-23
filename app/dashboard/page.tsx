"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingUp, Users } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import { useEffect, useState } from "react";
import { getPharmacyStats } from "@/lib/api";

// Dummy data
const stats = [
  {
    title: "Total Medicines",
    value: "247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Low Stock Items",
    value: "8",
    change: "+2",
    changeType: "negative" as const,
    icon: AlertTriangle,
  },
  {
    title: "Monthly Sales",
    value: "$12,450",
    change: "+18%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Active Customers",
    value: "1,234",
    change: "+5%",
    changeType: "positive" as const,
    icon: Users,
  },
];

const recentMedicines = [
  { name: "Paracetamol 500mg", quantity: 150, status: "In Stock" },
  { name: "Ibuprofen 400mg", quantity: 12, status: "Low Stock" },
  { name: "Amoxicillin 250mg", quantity: 45, status: "In Stock" },
  { name: "Cetirizine 10mg", quantity: 5, status: "Low Stock" },
  { name: "Aspirin 325mg", quantity: 89, status: "In Stock" },
];

type Stat = {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  key: string;
};

export default function DashboardPage() {
  const { userData } = useAppStore();
  const [stats, setStats] = useState<Stat[]>([]);

  const getStateIcon = (stateKey: string) => {
    switch (stateKey) {
      case "totalMedicines":
        return Package;
      case "lowStockItems":
        return AlertTriangle;
      case "monthlySales":
        return TrendingUp;
      case "activeCustomers":
        return Users;
      default:
        return Package;
    }
  };

  useEffect(() => {
    if (userData.id) {
      getPharmacyStats().then(setStats);
    }
  }, [userData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Overview of your pharmacy inventory</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = getStateIcon(stat.key);
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Medicines */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Medicine Updates</CardTitle>
          <CardDescription>
            Latest changes to your medicine inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMedicines.map((medicine, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {medicine.quantity}
                  </p>
                </div>
                <Badge
                  variant={
                    medicine.status === "In Stock" ? "default" : "destructive"
                  }
                >
                  {medicine.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

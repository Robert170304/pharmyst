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
import { getPharmacyStats, getRecentMedicines } from "@/lib/api";
import { getStockStatusVariant } from "@/lib/utils";
import { Box, Flex, Text } from "@radix-ui/themes";
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
  const [recentMedicines, setRecentMedicines] = useState<Medicine[]>([]);

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
      getRecentMedicines().then(setRecentMedicines);
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
                <Text
                  as="p"
                  className={`text-xs ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} from last month
                </Text>
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
          <Box className="space-y-4">
            {recentMedicines.map((medicine, index) => {
              const stockStatusVariant = getStockStatusVariant(
                medicine.availability
              );
              return (
                <Flex
                  as="div"
                  justify="between"
                  align="center"
                  key={index}
                  className="flex items-center justify-between"
                >
                  <Flex direction="column">
                    <Text className="font-medium">{medicine.name}</Text>
                    <Text className="text-sm text-gray-500">
                      Quantity: {medicine.quantity}
                    </Text>
                  </Flex>
                  <Badge variant={stockStatusVariant}>
                    {medicine.availability}
                  </Badge>
                </Flex>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

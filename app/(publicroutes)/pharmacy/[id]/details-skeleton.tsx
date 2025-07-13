"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Star } from "lucide-react";
import { Skeleton, Text } from "@radix-ui/themes";

export default function PharmacyDetailSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle className="text-2xl mb-2">
              <Skeleton>Lorem ipsum dolor sit amet.</Skeleton>
            </CardTitle>
            <CardDescription className="flex flex-col space-y-2">
              <Text>
                <Skeleton>Loading Loading</Skeleton>
              </Text>
              <Text>
                <Skeleton>Loading Loading</Skeleton>
              </Text>
              <Text>
                <Skeleton>Loading Loading</Skeleton>
              </Text>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-2">
              <span className="font-semibold">
                <Skeleton>Lorem ipsum dolor sit amet.</Skeleton>
              </span>
            </div>
            <Skeleton className="w-24 h-6">
              <Badge>
                <Skeleton>Lorem ipsum dolor sit amet.</Skeleton>
              </Badge>
            </Skeleton>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

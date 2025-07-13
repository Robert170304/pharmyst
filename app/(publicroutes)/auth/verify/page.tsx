"use client";

import type React from "react";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Flex, Text } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useAppStore from "@/store/useAppStore";
import { verifyEmail } from "@/lib/api";

export default function VerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  console.log("🚀 ~ VerificationPage ~ params:", searchParams);
  const { toast } = useToast();
  const { setUserData } = useAppStore();

  useEffect(() => {
    if (!token) {
      return;
    }
    verifyEmail({ token }).then((data) => {
      if (!data?.data) return;
      setUserData({ ...data.data });
      toast({
        title: "Verification Successful",
        description: "Your pharmacy account has been successfully verified!",
      });
      router.push("/dashboard");
    });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            We are verifying your email address. This will only take a moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Flex direction="column" align="center" gap="4">
            <div className="my-8 flex items-center justify-center">
              <span className="inline-block w-10 h-10 border-4 border-blue-500 border-t-gray-200 rounded-full animate-spin" />
            </div>
            <Text size="3" weight="medium" color="gray">
              Please wait... verifying your email
            </Text>
          </Flex>
        </CardContent>
      </Card>
    </div>
  );
}

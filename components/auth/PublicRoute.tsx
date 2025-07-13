"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAppStore from "@/store/useAppStore";
import { Loader2 } from "lucide-react";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const userData = useAppStore((state) => state.userData);

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (userData.token) {
      router.push("/dashboard");
      return;
    }

    setIsLoading(false);
  }, [userData.token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

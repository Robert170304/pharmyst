"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center space-y-6">
        <AlertTriangle className="h-16 w-16 text-blue-600 mb-2" />
        <h1 className="text-5xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="text-gray-500 text-center max-w-md">
          Oops! The page you are looking for doesn&apos;t exist or has been
          moved.
          <br />
          Let&apos;s get you back to where you belong.
        </p>
        <Button asChild className="mt-4">
          <Link prefetch={true} href="/">
            Go to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}

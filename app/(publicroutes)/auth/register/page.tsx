"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { registerPharma } from "@/lib/api";
import AddressAutocomplete from "@/components/AddressAutocomplete/AddressAutocomplete";
import Loader from "@/components/ui/loader";

export default function RegisterPage() {
  const initSignupFormObj = {
    pharmacyName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: { location: "", lat: 0, lng: 0 },
    licenseNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  };
  const { toast } = useToast();
  const [formData, setFormData] = useState(initSignupFormObj);
  const [signupLoader, setSignUpLoader] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }
    setSignUpLoader(true);

    registerPharma(formData)
      .then((data) => {
        console.log("🚀 ~ registerPharma ~ data:", data);
        if (!data.data?.id) return;
        toast({
          title: "Registration Successful",
          description: data.message,
        });
        setFormData(initSignupFormObj);
        setSignUpLoader(false);
      })
      .catch(() => {
        setSignUpLoader(false);
      });
  };

  const handleInputChange = (field: string, value: string | boolean | any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Pharmyst</h1>
          <h2 className="text-2xl font-bold text-gray-900">
            Register Your Pharmacy
          </h2>
          <p className="mt-2 text-gray-600">
            Join our network of verified pharmacies
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pharmacy Registration</CardTitle>
            <CardDescription>
              Fill in your pharmacy details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pharmacyName">Pharmacy Name *</Label>
                  <Input
                    id="pharmacyName"
                    value={formData.pharmacyName}
                    onChange={(e) =>
                      handleInputChange("pharmacyName", e.target.value)
                    }
                    placeholder="e.g., HealthPlus Pharmacy"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) =>
                      handleInputChange("ownerName", e.target.value)
                    }
                    placeholder="e.g., Dr. John Smith"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="admin@pharmacy.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Pharmacy Address *</Label>
                <AddressAutocomplete
                  id="address"
                  value={formData.address.location}
                  onSelect={(placeObject) => {
                    console.log("🚀 ~ RegisterPage ~ val 1:", placeObject);
                    if (!placeObject.geometry) return;
                    handleInputChange("address", {
                      location: placeObject.formatted_address,
                      lat: placeObject?.geometry.location.lat(),
                      lng: placeObject?.geometry.location.lng(),
                    });
                  }}
                  placeholder="123 Main Street, City, State, ZIP"
                  onChange={(val) => {
                    handleInputChange("address", {
                      ...formData.address,
                      location: val,
                    });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Pharmacy License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    handleInputChange("licenseNumber", e.target.value)
                  }
                  placeholder="e.g., PH123456789"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("agreeToTerms", checked as boolean)
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="#" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={signupLoader}>
                {signupLoader ? (
                  <span className="flex items-center justify-center">
                    <Loader size={20} className="mr-2" />
                    Registering...
                  </span>
                ) : (
                  "Register Pharmacy"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

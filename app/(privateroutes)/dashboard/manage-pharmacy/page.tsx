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
import { Label } from "@/components/ui/label";
import * as Dialog from "@radix-ui/react-dialog";
import useAppStore from "@/store/useAppStore";
import AddressAutocomplete from "@/components/AddressAutocomplete/AddressAutocomplete";
import { updatePharmacyDetails } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Flex } from "@radix-ui/themes";
import { Clock, MapPin, Phone } from "lucide-react";

export default function ManagePharmacy() {
  const { userData, setUserData } = useAppStore();
  console.log("🚀 ~ ManagePharmacy ~ userData:", userData);

  // Form state for pharmacy details
  const [form, setForm] = useState({
    pharmacyName: "",
    ownerName: "",
    address: { location: "", lat: 0, lng: 0 },
    phone: "",
    licenseNumber: "",
  });
  console.log("🚀 ~ ManagePharmacy ~ form:", form);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!userData.id) return;
    setForm({
      pharmacyName: userData.pharmacyName,
      ownerName: userData.ownerName,
      address: userData.address,
      phone: userData.phone,
      licenseNumber: userData.licenseNumber,
    });
  }, [userData]);

  // Placeholder submit handlers
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePharmacyDetails(form).then((data) => {
      if (!data?.pharmacy) return;
      toast({
        description: "Pharmacy details successfully updated.",
      });

      setUserData({ ...userData, ...data.pharmacy });
    });
  };
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to API
    alert("Password changed! (UI only)");
    setPasswordModalOpen(false);
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="max-w-full mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl mb-2">
                {userData.pharmacyName}
              </CardTitle>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {userData.address?.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {userData.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  userData.hours
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Manage Pharmacy Details</CardTitle>
          <CardDescription>
            Update your pharmacy&apos;s information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div>
              <Label htmlFor="pharmacyName">Pharmacy Name</Label>
              <Input
                id="pharmacyName"
                value={form.pharmacyName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pharmacyName: e.target.value }))
                }
                placeholder="e.g. City Meds"
                required
              />
            </div>
            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                value={form.ownerName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ownerName: e.target.value }))
                }
                placeholder="e.g. Dr. John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <AddressAutocomplete
                id="address"
                value={form.address.location}
                onSelect={(placeObject) => {
                  console.log("🚀 ~ RegisterPage ~ val 1:", placeObject);
                  if (!placeObject.geometry) return;
                  setForm((f) => ({
                    ...f,
                    address: {
                      location: placeObject.formatted_address,
                      lat: placeObject?.geometry.location.lat(),
                      lng: placeObject?.geometry.location.lng(),
                    },
                  }));
                }}
                placeholder="e.g. 123 Main St, Springfield"
                onChange={(val) => {
                  setForm((f) => ({
                    ...f,
                    address: {
                      ...f.address,
                      location: val,
                    },
                  }));
                }}
              />
            </div>
            <div>
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="e.g. +1 234 567 8901"
                required
              />
            </div>
            <div>
              <Label htmlFor="license">License Number</Label>
              <Input
                id="licenseNumber"
                value={form.licenseNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, licenseNumber: e.target.value }))
                }
                placeholder="e.g. LIC123456"
                required
              />
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Button onClick={handleDetailsSubmit}>Save Changes</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Change Password Modal using Radix Dialog */}
      <Dialog.Root
        open={isPasswordModalOpen}
        onOpenChange={setPasswordModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Change Password
            </Dialog.Title>
            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm((f) => ({
                      ...f,
                      oldPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((f) => ({
                      ...f,
                      newPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((f) => ({
                      ...f,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button type="submit">Update Password</Button>
                <Dialog.Close asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Dialog.Close>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

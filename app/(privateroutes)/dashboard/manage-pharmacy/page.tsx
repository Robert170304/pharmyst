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
import useAppStore from "@/store/useAppStore";
import AddressAutocomplete from "@/components/AddressAutocomplete/AddressAutocomplete";
import { updatePharmacyDetails, changePharmacyPassword } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Clock, MapPin, Phone, Eye, EyeOff } from "lucide-react";
import CommonDialog from "@/components/ui/dialog";
import { validPasswordPattern } from "@/lib/utils";
import WeeklyHours from "@/components/WeeklyHours/WeeklyHours";
import Loader from "@/components/ui/loader";

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
  const [submitDetailsLoader, setSubmitDetailsLoader] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitDetailsLoader(true);
    await updatePharmacyDetails(form)
      .then((data) => {
        if (!data?.pharmacy) return;
        toast({
          description: "Pharmacy details successfully updated.",
        });

        setUserData({ ...userData, ...data.pharmacy });
      })
      .catch((err: any) => {
        toast({
          title: "Error",
          description: err.message || "Failed to save changes.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setSubmitDetailsLoader(false);
      });
  };
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New Password and Confirm New Password do not match.",
        variant: "destructive",
      });
      return;
    }
    setPasswordLoading(true);
    await changePharmacyPassword({
      currentPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })
      .then((data) => {
        if (data?.status) {
          toast({
            title: "Password Changed",
            description: "Your password has been updated successfully.",
          });
          setPasswordModalOpen(false);
          setPasswordForm({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      })
      .catch((err: any) => {
        toast({
          title: "Error",
          description: err.message || "Failed to change password.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setPasswordLoading(false);
      });
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
            Update your pharmacy's information below.
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
                value={form.address.location || ""}
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
            <div className="flex justify-end items-center gap-4 pt-2">
              <Button
                disabled={submitDetailsLoader}
                onClick={handleDetailsSubmit}
              >
                {submitDetailsLoader ? (
                  <span className="flex items-center justify-center">
                    <Loader size={20} className="mr-2" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
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
      <WeeklyHours />
      {/* Change Password Modal using CommonDialog */}
      <CommonDialog
        open={isPasswordModalOpen}
        onOpenChange={setPasswordModalOpen}
        title="Change Password"
      >
        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          <div>
            <Label htmlFor="oldPassword">Current Password</Label>
            <div className="relative">
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
                pattern={validPasswordPattern}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setPasswordForm((f) => ({ ...f, newPassword: value }));
                  if (!new RegExp(validPasswordPattern).test(value)) {
                    setNewPasswordError(
                      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
                    );
                  } else {
                    setNewPasswordError("");
                  }
                }}
                required
                pattern={validPasswordPattern}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowNewPassword((v) => !v)}
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {newPasswordError && (
              <p className="text-xs text-red-500 mt-1">{newPasswordError}</p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setPasswordForm((f) => ({ ...f, confirmPassword: value }));
                  if (value !== passwordForm.newPassword) {
                    setConfirmPasswordError("Passwords do not match.");
                  } else {
                    setConfirmPasswordError("");
                  }
                }}
                required
              />
            </div>
            {confirmPasswordError && (
              <p className="text-xs text-red-500 mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button
              type="submit"
              disabled={
                passwordLoading || !!newPasswordError || !!confirmPasswordError
              }
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
            <Button
              onClick={() => {
                setPasswordForm({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setPasswordModalOpen(false);
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CommonDialog>
    </div>
  );
}

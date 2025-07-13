"use client";

import type React from "react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addMedicine, getMedicineDetails, updateMedicine } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function MedicineForm({ id }: { id?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    expiryDate: "",
    description: "this is a medicine",
    manufacturer: "",
    available: true,
  });

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      // fetch and prefill
      getMedicineDetails(id).then((data) => {
        setFormData({
          name: data.name || "",
          category: data.category || "",
          quantity: data.quantity?.toString() || "",
          price: data.price?.toString() || "",
          expiryDate: data.expiryDate || "",
          description: data.description || "this is a medicine",
          manufacturer: data.manufacturer || "",
          available: data.available ?? true,
        });
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    const apiCall = isEdit ? updateMedicine : addMedicine;
    apiCall({ ...formData, _id: id }).then(() => {
      toast({
        title: isEdit ? "Medicine Updated" : "Medicine Added",
        description: `${formData.name} has been successfully ${
          isEdit ? "updated" : "added"
        } to inventory.`,
      });
      // Reset form
      setFormData({
        name: "",
        category: "",
        quantity: "",
        price: "",
        expiryDate: "",
        description: "this is a medicine",
        manufacturer: "",
        available: true,
      });
      if (isEdit) {
        router.push("/dashboard/manage-stock");
      }
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            {isEdit ? "Edit Medicine" : "Add New Medicine"}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? "Edit the details for the medicine"
              : "Fill in the details for the new medicine"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Paracetamol 500mg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pain-relief">Pain Relief</SelectItem>
                    <SelectItem value="antibiotics">Antibiotics</SelectItem>
                    <SelectItem value="vitamins">Vitamins</SelectItem>
                    <SelectItem value="cold-flu">Cold & Flu</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  placeholder="e.g., 100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="e.g., 9.99"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    handleInputChange("manufacturer", e.target.value)
                  }
                  placeholder="e.g., PharmaCorp"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Additional information about the medicine..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) =>
                  handleInputChange("available", e.target.checked)
                }
                className="h-4 w-4"
              />
              <Label htmlFor="available">Available for Sale</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {isEdit ? "Update Medicine" : "Add Medicine"}
              </Button>
              <Button
                onClick={() => {
                  if (isEdit) {
                    router.push("/dashboard/manage-stock");
                  }
                  setFormData({
                    name: "",
                    category: "",
                    quantity: "",
                    price: "",
                    expiryDate: "",
                    description: "this is a medicine",
                    manufacturer: "",
                    available: true,
                  });
                }}
                type="button"
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

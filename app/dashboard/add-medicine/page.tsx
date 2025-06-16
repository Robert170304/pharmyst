"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AddMedicinePage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    expiryDate: "",
    description: "",
    manufacturer: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    toast({
      title: "Medicine Added",
      description: `${formData.name} has been successfully added to inventory.`,
    })
    // Reset form
    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: "",
      expiryDate: "",
      description: "",
      manufacturer: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Medicine</h1>
        <p className="text-gray-600">Add a new medicine to your inventory</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Medicine Information</CardTitle>
          <CardDescription>Fill in the details for the new medicine</CardDescription>
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
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
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
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
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
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                  placeholder="e.g., PharmaCorp"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Additional information about the medicine..."
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Add Medicine
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

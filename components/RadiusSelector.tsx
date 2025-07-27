"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Minus, Plus } from "lucide-react";

interface RadiusSelectorProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  className?: string;
}

export default function RadiusSelector({
  radius,
  onRadiusChange,
  className = "",
}: RadiusSelectorProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 100) {
      onRadiusChange(value);
    }
  };

  const adjustRadius = (increment: number) => {
    const newRadius = Math.max(1, Math.min(100, radius + increment));
    onRadiusChange(newRadius);
  };

  const presetRadii = [10, 20, 30, 50, 75];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-blue-600" />
        <Label className="text-sm font-medium">Search Radius</Label>
      </div>
      
      <div className="space-y-3">
        {/* Quick preset buttons */}
        <div className="flex flex-wrap gap-2">
          {presetRadii.map((preset) => (
            <Button
              key={preset}
              variant={radius === preset ? "default" : "outline"}
              size="sm"
              onClick={() => onRadiusChange(preset)}
              className="text-xs"
            >
              {preset}km
            </Button>
          ))}
        </div>
        
        {/* Manual adjustment */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustRadius(-5)}
            disabled={radius <= 5}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <Input
            type="number"
            value={radius}
            onChange={handleInputChange}
            min={1}
            max={100}
            className="w-20 text-center"
          />
          <span className="text-sm text-gray-600">km</span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustRadius(5)}
            disabled={radius >= 100}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <p className="text-xs text-gray-500">
          Showing pharmacies within {radius} km from your location
        </p>
      </div>
    </div>
  );
}

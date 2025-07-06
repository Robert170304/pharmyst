import React, { useEffect, useRef } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { Input } from "../ui/input";

export default function AddressAutocomplete({
  id,
  value,
  placeholder,
  onSelect,
  onChange,
}: {
  id: string;
  value: string;
  placeholder: string;
  onSelect: (address: any) => void;
  onChange?: (address: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY,
    onPlaceSelected: (place) => {
      onSelect(place);
    },
    options: {
      types: ["address"],
      componentRestrictions: { country: "in" },
    },
  });

  // Keep the input value in sync with the value prop
  useEffect(() => {
    if (inputRef.current && value === "") {
      inputRef.current.value = "";
    }
  }, [value]);

  return (
    <Input
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
        inputRef.current = el;
      }}
      id={id}
      defaultValue={value}
      placeholder={placeholder || "Enter your address"}
      className="border p-2 rounded w-full"
      style={{ width: "100%", display: "block" }}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "cmdk";
import * as Popover from "@radix-ui/react-popover";
import { Input } from "../ui/input";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "lodash";
import { MapPin, Loader2, Search } from "lucide-react";
import useAppStore from "@/store/useAppStore";

interface SuggestionItem {
  name: string;
  mapbox_id: string;
  address?: string;
}

interface LocationItem {
  name: string;
  lat: number;
  lng: number;
}

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
  onSelect: (address: LocationItem) => void;
  onChange?: (address: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken] = useState(() => Math.random().toString(36).substring(2, 15));
  const userLocation = useAppStore((s) => s.userLocation);
  const { toast } = useToast();
  const isSelectionRef = React.useRef(false);
  const isFocusedRef = React.useRef(false);
  const lastSelectionRef = React.useRef("");

  const fetchLocations = useMemo(
    () =>
      debounce(async (query: string) => {
        if (
          !query || 
          query.length < 3 || 
          isSelectionRef.current || 
          !isFocusedRef.current ||
          query === lastSelectionRef.current
        ) {
          isSelectionRef.current = false;
          setResults([]);
          return;
        }

        setIsLoading(true);
        try {
          const proximity = userLocation ? `${userLocation.lng},${userLocation.lat}` : "";
          const response = await axios.get(
            `/api/location-search?q=${encodeURIComponent(query)}&session_token=${sessionToken}&proximity=${proximity}`
          );
          if (response.data.status) {
            setResults(response.data.data);
            if (response.data.data.length > 0 && isFocusedRef.current && !isSelectionRef.current) {
              setOpen(true);
            }
          }
        } catch (error) {
          console.error("Location search error:", error);
        } finally {
          setIsLoading(false);
        }
      }, 500),
    [sessionToken, userLocation]
  );

  const handleSelect = async (item: SuggestionItem) => {
    setIsLoading(true);
    setOpen(false);
    isSelectionRef.current = true;
    try {
      const response = await axios.get(
        `/api/location-retrieve?id=${item.mapbox_id}&session_token=${sessionToken}`
      );
      if (response.data.status) {
        const data = response.data.data;
        lastSelectionRef.current = data.name;
        onSelect(data);
      }
    } catch (error) {
      console.error("Location retrieve error:", error);
      toast({
        variant: "destructive",
        description: "Failed to get location details. Please try again.",
      });
      isSelectionRef.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If the value changed but it's not what we just selected, clear the selection block
    if (value !== lastSelectionRef.current) {
        isSelectionRef.current = false;
    }
    
    fetchLocations(value);
    return () => fetchLocations.cancel();
  }, [value, fetchLocations]);

  return (
    <div className="relative w-full">
      <Popover.Root open={open && results.length > 0 && !isLoading} onOpenChange={(val) => {
        if (!val) setOpen(false);
      }}>
        <Popover.Anchor asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id={id}
              value={value}
              placeholder={placeholder || "Enter your address"}
              className="pl-9 pr-10"
              autoComplete="off"
              onChange={(e) => {
                lastSelectionRef.current = ""; // Reset since user is typing
                isSelectionRef.current = false;
                onChange?.(e.target.value);
                if (!open && e.target.value.length >= 3) setOpen(true);
              }}
              onFocus={() => {
                isFocusedRef.current = true;
                if (value.length >= 3 && results.length > 0) setOpen(true);
              }}
              onBlur={() => {
                // Delay blur to allow click on suggestions
                setTimeout(() => {
                  isFocusedRef.current = false;
                }, 200);
              }}
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </Popover.Anchor>

        <Popover.Content
          className="w-[var(--radix-popover-anchor-width)] p-0 z-50 bg-white rounded-md border shadow-lg animate-in fade-in zoom-in duration-200"
          align="start"
          sideOffset={5}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command className="w-full">
            <CommandList className="max-h-[300px] overflow-y-auto p-1 text-black">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No locations found.
              </CommandEmpty>
              <CommandGroup>
                {results.map((item, index) => (
                  <CommandItem
                    key={`${item.mapbox_id}-${index}`}
                    value={item.name}
                    onSelect={() => handleSelect(item)}
                    className="flex items-start gap-2 px-3 py-2 rounded-sm text-sm cursor-pointer hover:bg-slate-100 aria-selected:bg-slate-100 transition-colors"
                  >
                    <MapPin className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                    <span className="flex-1 leading-tight">{item.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}

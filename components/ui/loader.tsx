// components/ui/loader.tsx
import React from "react";

export default function Loader({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src="/loader.svg"
      alt="Loading..."
      width={size}
      height={size}
      className={`animate-spin ${className}`}
      draggable={false}
    />
  );
}

import { LoadScript } from "@react-google-maps/api";
import { ReactNode } from "react";

export default function GoogleProvider({ children }: { children: ReactNode }) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY as string}
      libraries={["places"]}
    >
      {children}
    </LoadScript>
  );
}

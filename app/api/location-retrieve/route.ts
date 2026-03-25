import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const sessionToken = searchParams.get("session_token");
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!id) {
    return NextResponse.json({ status: false, error: "Missing id" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ status: false, error: "Mapbox token not configured" }, { status: 500 });
  }

  try {
    const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${id}?access_token=${token}&session_token=${sessionToken || "default-session"}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.statusText}`);
    }

    const data = await response.json();
    const feature = data.features[0];
    const props = feature.properties;

    console.log("Mapbox retrieve properties:", props);

    // Prioritize name and address properties. 
    // Sometimes full_address contains "undefined" if Mapbox's internal template is incomplete.
    let finalName = props.full_address || props.place_formatted || props.name;

    if (typeof finalName === "string") {
      // Robust cleanup of any "undefined" words inserted by Mapbox or formatting
      finalName = finalName
        .replace(/undefined,?\s*/g, "") // Remove "undefined," or "undefined "
        .replace(/,\s*undefined/g, "")   // Remove ", undefined"
        .replace(/\s+/g, " ")            // Normalize spaces
        .trim()
        .replace(/^,|,$/g, "");          // Remove leading/trailing commas
    }

    return NextResponse.json({ 
        status: true, 
        data: {
            name: finalName,
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0]
        } 
    }, { status: 200 });
  } catch (error: any) {
    console.error("Mapbox retrieve error:", error);
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

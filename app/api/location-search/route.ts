import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const sessionToken = searchParams.get("session_token");
  const proximity = searchParams.get("proximity");
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!query) {
    return NextResponse.json({ status: false, error: "Missing query" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ status: false, error: "Mapbox token not configured" }, { status: 500 });
  }

  try {
    // Using Search Box API v1 (suggest endpoint)
    let url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
      query,
    )}&access_token=${token}&limit=5&session_token=${sessionToken || "default-session"}`;

    if (proximity && proximity !== "undefined") {
      url += `&proximity=${proximity}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("Mapbox search response:", data);

    const formatted = data.suggestions.map((item: any) => ({
      name: item.full_address || item.name,
      mapbox_id: item.mapbox_id,
      address: item.place_formatted || item.address,
      distance: item.distance,
    }));

    return NextResponse.json({ status: true, data: formatted }, { status: 200 });
  } catch (error: any) {
    console.error("Mapbox search error:", error);
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

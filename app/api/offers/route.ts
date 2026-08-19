import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Return empty array as the legacy e-commerce structure is no longer used
    return NextResponse.json([]);
  } catch (error) {
    console.error("GET Offers Error:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Endpoint deprecated" }, { status: 400 });
}
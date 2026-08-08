import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vendors = await prisma.ec_vendors.findMany();
    return NextResponse.json(vendors);
  } catch (error) {
    console.error("GET Vendors Error:", error);
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newVendor = await prisma.ec_vendors.create({
      data: {
        id: randomUUID(),
        name: body.name,
        rating: body.rating,
      },
    });

    return NextResponse.json(newVendor);
  } catch (error) {
    console.error("POST Vendor Error:", error);
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}
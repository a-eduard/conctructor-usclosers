import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newComponent = await prisma.ec_components.create({
      data: {
        id: randomUUID(),
        offer_id: body.offerId,
        name: body.name,
        type: body.type || "SELECT", // Default type
      },
    });
    
    return NextResponse.json(newComponent);
  } catch (error) {
    console.error("POST Component Error:", error);
    return NextResponse.json({ error: "Failed to create component" }, { status: 500 });
  }
}
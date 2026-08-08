import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newOption = await prisma.ec_options.create({
      data: {
        id: randomUUID(),
        component_id: body.componentId,
        name: body.name,
        price_delta: 0, // Default to 0, can be updated later if needed
      },
    });
    
    return NextResponse.json(newOption);
  } catch (error) {
    console.error("POST Option Error:", error);
    return NextResponse.json({ error: "Failed to create option" }, { status: 500 });
  }
}
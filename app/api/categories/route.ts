import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.ec_offer_categories.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newCategory = await prisma.ec_offer_categories.create({
      data: {
        id: randomUUID(),
        name: body.name,
      },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
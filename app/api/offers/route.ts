import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all offers from the database and include their connected category
    const offers = await prisma.offer.findMany({
      include: {
        category: true,
      },
    });
    
    return NextResponse.json(offers);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers from database" },
      { status: 500 }
    );
  }
}
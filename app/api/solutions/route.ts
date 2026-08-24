import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSolution = await prisma.solution.create({
      data: body,
    });
    return NextResponse.json(newSolution);
  } catch (error: any) {
    console.error("Error creating solution:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A solution with this slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create solution" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updatedSolution = await prisma.solution.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedSolution);
  } catch (error: any) {
    console.error("Error updating solution:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A solution with this slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update solution" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.solution.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting solution:", error);
    return NextResponse.json({ error: "Failed to delete solution" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const solutions = await prisma.solution.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(solutions);
  } catch (error) {
    console.error("Error fetching solutions:", error);
    return NextResponse.json({ error: "Failed to fetch solutions" }, { status: 500 });
  }
}
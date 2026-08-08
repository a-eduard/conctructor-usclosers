import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedVendor = await prisma.ec_vendors.update({
      where: { id },
      data: {
        name: body.name,
        rating: body.rating,
      },
    });

    return NextResponse.json(updatedVendor);
  } catch (error) {
    console.error("PUT Vendor Error:", error);
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.ec_vendors.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Vendor Error:", error);
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 });
  }
}
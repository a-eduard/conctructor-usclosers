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

    const updatedComponent = await prisma.ec_components.update({
      where: { id },
      data: {
        why_need_this: body.whyNeedThis,
      },
    });

    return NextResponse.json(updatedComponent);
  } catch (error) {
    console.error("PUT Component Error:", error);
    return NextResponse.json({ error: "Failed to update component" }, { status: 500 });
  }
}
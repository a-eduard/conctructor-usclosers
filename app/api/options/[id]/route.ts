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

    const updatedOption = await prisma.ec_options.update({
      where: { id },
      data: {
        why_need_this: body.whyNeedThis,
        unit_name: body.unitName,
        min_quantity: body.minQuantity ? Number(body.minQuantity) : 1,
        max_quantity: body.maxQuantity ? Number(body.maxQuantity) : 1,
        step: body.step ? Number(body.step) : 1,
        sla_impact: body.slaImpact || "NONE",
      },
    });

    return NextResponse.json(updatedOption);
  } catch (error) {
    console.error("PUT Option Error:", error);
    return NextResponse.json({ error: "Failed to update option" }, { status: 500 });
  }
}
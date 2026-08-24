import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stepId, name, description, imageUrl, order } = body;

    if (!stepId || !name) {
      return NextResponse.json(
        { error: "Step ID and Block name are required" },
        { status: 400 }
      );
    }

    const newBlock = await prisma.wizardBlock.create({
      data: {
        stepId,
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        order: order ? parseInt(order, 10) : 0,
      },
    });

    return NextResponse.json(newBlock, { status: 201 });
  } catch (error) {
    console.error("Error creating wizard block:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, imageUrl, order } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "Block ID and name are required" },
        { status: 400 }
      );
    }

    const updatedBlock = await prisma.wizardBlock.update({
      where: { id },
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        order: order ? parseInt(order, 10) : 0,
      },
    });

    return NextResponse.json(updatedBlock, { status: 200 });
  } catch (error) {
    console.error("Error updating wizard block:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Block ID is required" }, { status: 400 });
    }

    await prisma.wizardBlock.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting wizard block:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
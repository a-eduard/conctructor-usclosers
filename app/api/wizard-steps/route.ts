import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stepNumber, title, description } = body;

    if (!stepNumber || !title) {
      return NextResponse.json(
        { error: "Step number and title are required" },
        { status: 400 }
      );
    }

    const newStep = await prisma.wizardStep.create({
      data: {
        stepNumber: parseInt(stepNumber, 10),
        title,
        description: description || null,
      },
    });

    return NextResponse.json(newStep, { status: 201 });
  } catch (error) {
    console.error("Error creating wizard step:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, stepNumber, title, description } = body;

    if (!id || !stepNumber || !title) {
      return NextResponse.json(
        { error: "ID, Step number and title are required" },
        { status: 400 }
      );
    }

    const updatedStep = await prisma.wizardStep.update({
      where: { id },
      data: {
        stepNumber: parseInt(stepNumber, 10),
        title,
        description: description || null,
      },
    });

    return NextResponse.json(updatedStep, { status: 200 });
  } catch (error) {
    console.error("Error updating wizard step:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Step ID is required" }, { status: 400 });
    }

    await prisma.wizardStep.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting wizard step:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
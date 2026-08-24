import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const preset = await prisma.onboardingPreset.create({ data: body });
    return NextResponse.json(preset);
  } catch (error) {
    console.error("Error creating preset:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const preset = await prisma.onboardingPreset.update({
      where: { id },
      data,
    });
    return NextResponse.json(preset);
  } catch (error) {
    console.error("Error updating preset:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.onboardingPreset.delete({ where: { id } });
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error deleting preset:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { blockId, type, name, price, imageUrl, detailsTitle, bullets, grades } = body;

    if (!blockId || !name || !type) {
      return NextResponse.json(
        { error: "Block ID, name, and type are required" },
        { status: 400 }
      );
    }

    const newOption = await prisma.wizardOption.create({
      data: {
        blockId,
        type,
        name,
        price: price ? parseFloat(price) : 0,
        imageUrl: imageUrl || null,
        detailsTitle: detailsTitle || null,
        bullets: bullets || null,
        grades: grades || null, // Сохраняем грейды (JSON строка)
      },
    });

    return NextResponse.json(newOption, { status: 201 });
  } catch (error) {
    console.error("Error creating wizard option:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, type, name, price, imageUrl, detailsTitle, bullets, grades } = body;

    if (!id || !name || !type) {
      return NextResponse.json(
        { error: "Option ID, name, and type are required" },
        { status: 400 }
      );
    }

    const updatedOption = await prisma.wizardOption.update({
      where: { id },
      data: {
        type,
        name,
        price: price ? parseFloat(price) : 0,
        imageUrl: imageUrl || null,
        detailsTitle: detailsTitle || null,
        bullets: bullets || null,
        grades: grades || null, // Обновляем грейды
      },
    });

    return NextResponse.json(updatedOption, { status: 200 });
  } catch (error) {
    console.error("Error updating wizard option:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Option ID is required" }, { status: 400 });
    }

    await prisma.wizardOption.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting wizard option:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
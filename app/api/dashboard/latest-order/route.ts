import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth"; // Импортируем настройки авторизации

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Передаем authOptions, чтобы сервер "увидел" текущего пользователя
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ищем последний заказ этого клиента
    const latestOrder = await prisma.order.findFirst({
      where: { customerEmail: session.user.email },
      orderBy: { createdAt: "desc" },
    });

    if (!latestOrder) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json({
      id: latestOrder.id,
      status: latestOrder.status,
      // Складываем разовый и ежемесячный платежи для отображения
      totalPrice: (latestOrder.totalOneTime + latestOrder.totalMonthly).toString(),
      createdAt: latestOrder.createdAt,
    });
  } catch (error) {
    console.error(">>> [API] Error fetching latest order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
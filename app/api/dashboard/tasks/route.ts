import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth"; // Импортируем настройки авторизации

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Передаем authOptions, чтобы сервер "увидел" текущего пользователя
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Достаем заказ вместе с корзиной (услугами)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { cartItems: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Защита: проверяем, что заказ принадлежит этому пользователю
    if (order.customerEmail !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks: any[] = [];
    const isDraft = order.status === "DRAFT";

    // 1. Формируем задачи "ACTION_REQUIRED" для тех пунктов, где клиент выбрал "Upload my own"
    let clientProvidedItems: string[] = [];
    if (order.clientProvided) {
      if (typeof order.clientProvided === "string") {
        try { clientProvidedItems = JSON.parse(order.clientProvided); } catch(e) {}
      } else if (Array.isArray(order.clientProvided)) {
        clientProvidedItems = order.clientProvided as string[];
      }
    }

    clientProvidedItems.forEach((item, idx) => {
      // Превращаем ID в красивое название
      const prettyName = item.replace(/_/g, " ").toUpperCase();
      tasks.push({
        id: `client_req_${idx}`,
        orderId: order.id,
        status: "ACTION_REQUIRED",
        optionName: `Provide: ${prettyName}`,
        vendorName: "Client (You)",
        slaDeadline: null,
        deliverables: null,
      });
    });

    // 2. Формируем задачи "IN_PROGRESS" для купленных услуг
    order.cartItems.forEach((item) => {
      let slaDate = null;
      
      // Парсим SLA (например "3 Days") и прибавляем к дате создания заказа
      if (item.sla) {
        const match = item.sla.match(/(\d+)/);
        if (match) {
          const days = parseInt(match[1], 10);
          slaDate = new Date(order.createdAt.getTime() + days * 86400000).toISOString();
        }
      }

      tasks.push({
        id: item.id,
        orderId: order.id,
        status: isDraft ? "PENDING" : "IN_PROGRESS",
        optionName: item.name,
        vendorName: item.category || "System",
        slaDeadline: slaDate,
        deliverables: null,
      });
    });

    // 3. Добавляем системную задачу "Workspace Initialization"
    tasks.push({
      id: "sys_init",
      orderId: order.id,
      status: "COMPLETED",
      optionName: "Workspace Initialization",
      vendorName: "System",
      slaDeadline: order.createdAt.toISOString(),
      deliverables: null,
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error(">>> [API] Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
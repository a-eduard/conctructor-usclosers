import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newOrder = await prisma.order.create({
      data: {
        customerName: body.customer.name,
        customerEmail: body.customer.email,
        totalOneTime: body.totalOneTime || 0,
        totalMonthly: body.totalMonthly || 0,
        status: "DRAFT",
        
        acv: body.step1Data?.acv || "",
        subscriptionModel: body.step1Data?.subscriptionModel || "",
        methodology: body.step1Data?.methodology || "",
        channels: body.step1Data?.channels || [],
        selectedFunnel: body.selectedFunnel || "",
        clientProvided: body.clientProvidedItems || [],
        
        cartItems: {
          create: body.cartItems.map((item: any) => ({
            optionId: item.optionId,
            name: item.name,
            price: item.price,
            paymentType: item.paymentType || "one-time",
            sla: item.sla || "",
            category: item.category || "",
            purpose: item.purpose || "",
            allocatedHours: item.allocatedHours || 0,
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error: any) {
    console.error("Draft saving error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
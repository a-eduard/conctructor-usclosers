"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface CustomerInfo {
  name: string;
  email: string;
}

export async function processCheckout(
  cartItems: any[],
  customerInfo: CustomerInfo,
  grandTotal: number,
  wizardState: any
) {
  try {
    console.log(">>> [SERVER] Processing new order for:", customerInfo.email);

    // 1. Проверяем, есть ли уже такой пользователь. Если нет - создаем.
    let user = await prisma.user.findUnique({
      where: { email: customerInfo.email },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      user = await prisma.user.create({
        data: {
          email: customerInfo.email,
          name: customerInfo.name,
          password: hashedPassword,
          role: "USER",
        },
      });
      console.log(">>> [SERVER] Created new user:", user.email);
    }

    // 2. Создаем сам заказ
    const newOrder = await prisma.order.create({
      data: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        totalOneTime: wizardState.totalOneTime || 0,
        totalMonthly: wizardState.totalMonthly || 0,
        status: "PENDING_PAYMENT",
        
        acv: wizardState.step1Data?.acv || null,
        subscriptionModel: wizardState.step1Data?.subscriptionModel || null,
        methodology: wizardState.step1Data?.methodology || null,
        // Обернули массивы в JSON.stringify
        channels: JSON.stringify(wizardState.step1Data?.channels || []),
        selectedFunnel: wizardState.step5Data?.selectedFunnel || null,
        clientProvided: JSON.stringify(wizardState.clientProvided || []),
        
        cartItems: {
          create: cartItems.map((item: any) => ({
            optionId: item.optionId,
            name: item.name,
            price: item.price,
            paymentType: item.paymentType || "one-time",
            sla: item.sla || null,
            category: item.category || null,
            purpose: item.purpose || null,
            allocatedHours: item.allocatedHours || 0,
          }))
        }
      },
    });

    console.log(">>> [SERVER] Order successfully saved in MySQL. ID:", newOrder.id);
    return { success: true, orderId: newOrder.id };
  } catch (error: any) {
    console.error(">>> [SERVER] Error saving order:", error);
    return { success: false, error: error.message || "Internal server error during checkout." };
  }
}

export async function saveOrderDraft(
  customerInfo: CustomerInfo,
  wizardState: any
) {
  if (!customerInfo.email) {
    return { success: false, error: "Email is required to save a draft." };
  }

  try {
    console.log(">>> [SERVER] Saving draft for:", customerInfo.email);

    let user = await prisma.user.findUnique({
      where: { email: customerInfo.email },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      user = await prisma.user.create({
        data: {
          email: customerInfo.email,
          name: customerInfo.name || "Draft User",
          password: hashedPassword,
          role: "USER",
        },
      });
    }

    const draftOrder = await prisma.order.create({
      data: {
        customerName: customerInfo.name || "Draft User",
        customerEmail: customerInfo.email,
        totalOneTime: wizardState.totalOneTime || 0,
        totalMonthly: wizardState.totalMonthly || 0,
        status: "DRAFT",
        
        acv: wizardState.step1Data?.acv || null,
        subscriptionModel: wizardState.step1Data?.subscriptionModel || null,
        methodology: wizardState.step1Data?.methodology || null,
        // Обернули массивы в JSON.stringify
        channels: JSON.stringify(wizardState.step1Data?.channels || []),
        selectedFunnel: wizardState.step5Data?.selectedFunnel || null,
        clientProvided: JSON.stringify(wizardState.clientProvided || []),
        
        cartItems: {
          create: wizardState.cartItems.map((item: any) => ({
            optionId: item.optionId,
            name: item.name,
            price: item.price,
            paymentType: item.paymentType || "one-time",
            sla: item.sla || null,
            category: item.category || null,
            purpose: item.purpose || null,
            allocatedHours: item.allocatedHours || 0,
          }))
        }
      },
    });

    console.log(">>> [SERVER] Draft successfully saved. ID:", draftOrder.id);
    return { success: true, orderId: draftOrder.id };
  } catch (error: any) {
    console.error(">>> [SERVER] Error saving draft:", error);
    return { success: false, error: error.message || "Failed to save draft to database." };
  }
}
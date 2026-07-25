"use server";

import { PrismaClient } from "@prisma/client";

// Initialize Prisma
const prisma = new PrismaClient();

// Define input types for strict validation
interface CustomerInfo {
  name: string;
  email: string;
}

export async function processCheckout(
  cartItems: any[], // We will refine this type later
  customerInfo: CustomerInfo,
  totalPrice: number
) {
  try {
    console.log(">>> [SERVER] Processing new order for:", customerInfo.email);

    // 1. Save the order to our MySQL Database
    const newOrder = await prisma.order.create({
      data: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        totalPrice: totalPrice,
        status: "PENDING",
      },
    });

    console.log(">>> [SERVER] Order successfully saved in MySQL. ID:", newOrder.id);

    // 2. Prepare the JSON payload for the external backend
    const externalApiPayload = {
      internalOrderId: newOrder.id,
      customer: customerInfo,
      selectedConfiguration: cartItems,
      orderTotal: totalPrice,
      source: "US Closers Marketplace Configurator",
      timestamp: new Date().toISOString(),
    };

    // 3. Simulate sending data to the external backend API
    // In production, this would be an actual fetch() request to the external server
    console.log(">>> [SERVER] Sending payload to external API:");
    console.log(JSON.stringify(externalApiPayload, null, 2));

    // Return success to the frontend
    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error(">>> [SERVER] Error saving order:", error);
    return { success: false, error: "Internal server error during checkout." };
  }
}
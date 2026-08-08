import { NextResponse } from "next/server";

export async function GET() {
  // Mock data for orders
  const mockOrders = [
    {
      id: "ord_123abc",
      customerName: "Acme Corp",
      customerEmail: "founder@acme.com",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ord_456def",
      customerName: "TechFlow Inc",
      customerEmail: "ceo@techflow.io",
      status: "PENDING",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    }
  ];
  
  return NextResponse.json(mockOrders);
}
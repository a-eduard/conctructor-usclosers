import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Params must be a Promise in Next.js 15+ 
) {
  const { id: orderId } = await params;
  
  // Mock tasks for the selected order
  const mockTasks = [
    {
      id: "t_1",
      orderId: orderId,
      status: "ACTION_REQUIRED",
      option: { name: "Provide Target ICP & Personas" },
      vendorId: "v_3",
      slaDeadline: new Date(Date.now() + 86400000).toISOString(), // +1 day
    },
    {
      id: "t_2",
      orderId: orderId,
      status: "IN_PROGRESS",
      option: { name: "LinkedIn Infrastructure Setup" },
      vendorId: "v_1",
      slaDeadline: new Date(Date.now() + 86400000 * 3).toISOString(), // +3 days
    },
    {
      id: "t_3",
      orderId: orderId,
      status: "REVIEW",
      option: { name: "Cold Email Copywriting" },
      vendorId: "v_2",
      slaDeadline: new Date(Date.now() - 86400000).toISOString(), // -1 day (SLA Overdue)
    }
  ];

  return NextResponse.json(mockTasks);
}
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const body = await request.json();
    
    // In a real application, we would update the task status in the Prisma database here
    console.log(`Updating task ${taskId} with data:`, body);
    
    return NextResponse.json({ success: true, updatedTask: { id: taskId, ...body } });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
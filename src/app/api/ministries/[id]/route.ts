import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ministry = await prisma.ministry.findUnique({
      where: { id },
    });

    if (!ministry) {
      return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
    }

    return NextResponse.json(ministry);
  } catch (error) {
    console.error("Failed to fetch ministry:", error);
    return NextResponse.json({ error: "Failed to fetch ministry" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const { id } = await params;
    const body = await request.json();

    const ministry = await prisma.ministry.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(body.category && { category: body.category }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.leaderId !== undefined && { leaderId: body.leaderId }),
        ...(body.meetingTime !== undefined && { meetingTime: body.meetingTime }),
        ...(body.meetingLocation !== undefined && { meetingLocation: body.meetingLocation }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });

    return NextResponse.json(ministry);
  } catch (error) {
    console.error("Failed to update ministry:", error);
    return NextResponse.json({ error: "Failed to update ministry" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const { id } = await params;
    await prisma.ministry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete ministry:", error);
    return NextResponse.json({ error: "Failed to delete ministry" }, { status: 500 });
  }
}
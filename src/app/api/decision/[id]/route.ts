import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const { id } = await params;
    const decision = await prisma.decision.findUnique({
      where: { id },
    });

    if (!decision) {
      return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    return NextResponse.json(decision);
  } catch (error) {
    console.error("Failed to fetch decision:", error);
    return NextResponse.json({ error: "Failed to fetch decision" }, { status: 500 });
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

    const decision = await prisma.decision.update({
      where: { id },
      data: {
        ...(body.isRead !== undefined && { isRead: body.isRead }),
      },
    });

    return NextResponse.json(decision);
  } catch (error) {
    console.error("Failed to update decision:", error);
    return NextResponse.json({ error: "Failed to update decision" }, { status: 500 });
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
    await prisma.decision.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete decision:", error);
    return NextResponse.json({ error: "Failed to delete decision" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const { id } = await params;
    const prayer = await prisma.prayerRequest.findUnique({
      where: { id },
    });

    if (!prayer) {
      return NextResponse.json({ error: "Prayer request not found" }, { status: 404 });
    }

    return NextResponse.json(prayer);
  } catch (error) {
    console.error("Failed to fetch prayer request:", error);
    return NextResponse.json({ error: "Failed to fetch prayer request" }, { status: 500 });
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

    const prayer = await prisma.prayerRequest.update({
      where: { id },
      data: {
        ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
        ...(body.isAnswered !== undefined && { isAnswered: body.isAnswered }),
      },
    });

    return NextResponse.json(prayer);
  } catch (error) {
    console.error("Failed to update prayer request:", error);
    return NextResponse.json({ error: "Failed to update prayer request" }, { status: 500 });
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
    await prisma.prayerRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete prayer request:", error);
    return NextResponse.json({ error: "Failed to delete prayer request" }, { status: 500 });
  }
}
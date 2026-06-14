import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";
import { checkRateLimit, announcementLimiter, getClientIP } from "@/lib/rate-limit";

export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIP(request);
  const { success } = await checkRateLimit(announcementLimiter, ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { id } = await params;
    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Failed to fetch announcement:", error);
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIP(request);
  const { success } = await checkRateLimit(announcementLimiter, ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const { id } = await params;
    const body = await request.json();

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.content && { content: body.content }),
        ...(body.date && { date: new Date(body.date) }),
        ...(body.category && { category: body.category }),
        ...(body.priority && { priority: body.priority }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.expiresAt !== undefined && { expiresAt: body.expiresAt ? new Date(body.expiresAt) : null }),
        ...(body.isPinned !== undefined && { isPinned: body.isPinned }),
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Failed to update announcement:", error);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIP(request);
  const { success } = await checkRateLimit(announcementLimiter, ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const { id } = await params;
    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
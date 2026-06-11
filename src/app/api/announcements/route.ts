import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard, getUserRole } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const role = await getUserRole();
    const isAdmin = role === "admin";

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const pinned = searchParams.get("pinned");

    const where: Record<string, any> = {};

    if (pinned === "true") {
      where.isPinned = true;
    }

    // Non-admins can only see non-expired announcements
    if (!isAdmin) {
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [
        { isPinned: "desc" },
        { date: "desc" },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const body = await request.json();
    
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: body.title,
        content: body.content,
        date: new Date(body.date || Date.now()),
        category: body.category || "general",
        priority: body.priority || "normal",
        imageUrl: body.imageUrl,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        isPinned: body.isPinned || false,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
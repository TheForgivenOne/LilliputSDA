import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";
import { checkRateLimit, publicContentLimiter, getClientIP } from "@/lib/rate-limit";

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await checkRateLimit(publicContentLimiter, ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming");
    const limit = searchParams.get("limit");

    const where: Record<string, unknown> = {};

    if (upcoming === "true") {
      where.startDate = { gte: new Date() };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: "asc" },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const body = await request.json();

    if (!body.title || !body.startDate) {
      return NextResponse.json({ error: "Title and start date are required" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location,
        category: body.category || "service",
        imageUrl: body.imageUrl,
        isRecurring: body.isRecurring || false,
        recurrencePattern: body.recurrencePattern,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
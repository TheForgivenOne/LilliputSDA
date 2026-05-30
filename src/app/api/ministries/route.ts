import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";
import { checkRateLimit, publicApiLimiter, getClientIP } from "@/lib/rate-limit";

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await checkRateLimit(publicApiLimiter, ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    );
  }

  try {
    const ministries = await prisma.ministry.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(ministries);
  } catch (error) {
    console.error("Failed to fetch ministries:", error);
    return NextResponse.json({ error: "Failed to fetch ministries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const ministry = await prisma.ministry.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category || "adult",
        imageUrl: body.imageUrl,
        leaderId: body.leaderId,
        meetingTime: body.meetingTime,
        meetingLocation: body.meetingLocation,
        order: body.order || 0,
      },
    });

    return NextResponse.json(ministry, { status: 201 });
  } catch (error) {
    console.error("Failed to create ministry:", error);
    return NextResponse.json({ error: "Failed to create ministry" }, { status: 500 });
  }
}
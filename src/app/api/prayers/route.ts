import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get("public");

    const where: Record<string, unknown> = {};

    if (publicOnly === "true") {
      where.isPublic = true;
      where.isAnswered = false;
    }

    const prayers = await prisma.prayerRequest.findMany({
      where,
      orderBy: { date: "desc" },
    });

    return NextResponse.json(prayers);
  } catch (error) {
    console.error("Failed to fetch prayer requests:", error);
    return NextResponse.json({ error: "Failed to fetch prayer requests" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const prayer = await prisma.prayerRequest.create({
      data: {
        name: body.name,
        email: body.email,
        request: body.request,
        isPublic: body.isPublic || false,
      },
    });

    return NextResponse.json(prayer, { status: 201 });
  } catch (error) {
    console.error("Failed to create prayer request:", error);
    return NextResponse.json({ error: "Failed to submit prayer request" }, { status: 500 });
  }
}
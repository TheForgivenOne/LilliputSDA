import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
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
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

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
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";
import { validateEmail } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
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
    const { name, email, request: prayerRequest, isPublic } = body;

    if (!name || !prayerRequest) {
      return NextResponse.json({ error: "Name and prayer request are required" }, { status: 400 });
    }

    if (typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    if (email && (typeof email !== "string" || !validateEmail(email) || email.length > 320)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (typeof prayerRequest !== "string" || prayerRequest.length > 2000) {
      return NextResponse.json({ error: "Prayer request too long (max 2000 chars)" }, { status: 400 });
    }

    const prayer = await prisma.prayerRequest.create({
      data: {
        name,
        email: email || null,
        request: prayerRequest,
        isPublic: isPublic === true,
      },
    });

    return NextResponse.json(prayer, { status: 201 });
  } catch (error) {
    console.error("Failed to create prayer request:", error);
    return NextResponse.json({ error: "Failed to submit prayer request" }, { status: 500 });
  }
}

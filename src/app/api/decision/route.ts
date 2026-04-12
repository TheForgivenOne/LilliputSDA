import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unread = searchParams.get("unread");

    const where: Record<string, unknown> = {};

    if (unread === "true") {
      where.isRead = false;
    }

    const decisions = await prisma.decision.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(decisions);
  } catch (error) {
    console.error("Failed to fetch decisions:", error);
    return NextResponse.json({ error: "Failed to fetch decisions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      decision,
      isAdventist,
      ageGroup,
      address,
      parish,
      country,
      prayerRequest,
      comments,
      source,
    } = body;

    if (!name || !decision) {
      return NextResponse.json(
        { error: "Name and decision are required" },
        { status: 400 }
      );
    }

    const newDecision = await prisma.decision.create({
      data: {
        name,
        email,
        phone,
        decision,
        isAdventist,
        ageGroup,
        address,
        parish,
        country,
        prayerRequest,
        comments,
        source,
      },
    });

    return NextResponse.json(newDecision, { status: 201 });
  } catch (error) {
    console.error("Failed to create decision:", error);
    return NextResponse.json({ error: "Failed to submit decision" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";
import { checkRateLimit, formLimiter } from "@/lib/rate-limit";
import { getClientIP } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import { validateEmail } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

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
  const ip = getClientIP(request);
  const { success } = await checkRateLimit(formLimiter, ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

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

    if (typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    if (email && (typeof email !== "string" || !validateEmail(email) || email.length > 320)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const newDecision = await prisma.decision.create({
      data: {
        name: sanitizeString(name, 200),
        email,
        phone,
        decision: sanitizeString(decision, 100),
        isAdventist,
        ageGroup,
        address: address ? sanitizeString(address, 500) : null,
        parish,
        country,
        prayerRequest: prayerRequest ? sanitizeString(prayerRequest, 2000) : null,
        comments: comments ? sanitizeString(comments, 2000) : null,
        source,
      },
    });

    if (decision === "prayer" && prayerRequest) {
      await prisma.prayerRequest.create({
        data: {
          name: sanitizeString(name, 200),
          email: email || null,
          request: sanitizeString(prayerRequest, 2000),
          isPublic: false,
        },
      });
    }

    return NextResponse.json(newDecision, { status: 201 });
  } catch (error) {
    console.error("Failed to create decision:", error);
    return NextResponse.json({ error: "Failed to submit decision" }, { status: 500 });
  }
}
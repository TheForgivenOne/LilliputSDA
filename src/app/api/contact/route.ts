import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";
import { validateEmail } from "@/lib/validation";
import { checkRateLimit, formLimiter } from "@/lib/rate-limit";
import { getClientIP } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";

export const dynamic = 'force-dynamic';
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

    const submissions = await prisma.contactSubmission.findMany({
      where,
      orderBy: { date: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Failed to fetch contact submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
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
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    if (typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    if (typeof email !== "string" || !validateEmail(email) || email.length > 320) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (typeof message !== "string" || message.length > 5000) {
      return NextResponse.json({ error: "Message too long (max 5000 chars)" }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: sanitizeString(name, 200),
        email,
        message: sanitizeString(message, 5000),
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Failed to create contact submission:", error);
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 });
  }
}
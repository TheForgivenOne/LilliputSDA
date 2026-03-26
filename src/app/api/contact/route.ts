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
  try {
    const body = await request.json();

    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        message: body.message,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Failed to create contact submission:", error);
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 });
  }
}
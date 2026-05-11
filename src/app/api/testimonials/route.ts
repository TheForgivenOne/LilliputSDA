import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const body = await request.json();
    const { name, role, memberSince, content, order } = body;

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    if (typeof name !== "string" || typeof content !== "string") {
      return NextResponse.json({ error: "Name and content must be strings" }, { status: 400 });
    }

    if (name.length > 200 || content.length > 5000) {
      return NextResponse.json({ error: "Name or content too long" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role: role || null,
        memberSince: memberSince || null,
        content,
        order: order || 0,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
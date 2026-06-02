import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard, checkAdmin } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const isAdmin = await checkAdmin();
    const content = await prisma.siteContent.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: [{ order: "asc" }, { key: "asc" }],
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching site content:", error);
    return NextResponse.json({ error: "Failed to fetch site content" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const body = await request.json();
    const { key, title, content, imageUrl, isActive, order } = body;

    if (!key || typeof key !== "string" || key.length > 100) {
      return NextResponse.json({ error: "Valid key is required (max 100 chars)" }, { status: 400 });
    }

    if (title && typeof title !== "string") {
      return NextResponse.json({ error: "Title must be a string" }, { status: 400 });
    }

    const existing = await prisma.siteContent.findUnique({ where: { key } });
    if (existing) {
      return NextResponse.json({ error: "Content with this key already exists" }, { status: 409 });
    }

    const siteContent = await prisma.siteContent.create({
      data: {
        key,
        title: title || null,
        content: content || null,
        imageUrl: imageUrl || null,
        isActive: isActive ?? true,
        order: order || 0,
      },
    });

    return NextResponse.json(siteContent, { status: 201 });
  } catch (error) {
    console.error("Error creating site content:", error);
    return NextResponse.json({ error: "Failed to create site content" }, { status: 500 });
  }
}
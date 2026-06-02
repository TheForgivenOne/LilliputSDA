import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard, checkAdmin } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isAdmin = await checkAdmin();
    const content = await prisma.siteContent.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { isActive: true }),
      },
    });

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching site content:", error);
    return NextResponse.json({ error: "Failed to fetch site content" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const { key, title, content, imageUrl, isActive, order } = body;

    const siteContent = await prisma.siteContent.update({
      where: { id },
      data: {
        ...(key && { key }),
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(siteContent);
  } catch (error) {
    console.error("Error updating site content:", error);
    return NextResponse.json({ error: "Failed to update site content" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const { id } = await params;
    await prisma.siteContent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting site content:", error);
    return NextResponse.json({ error: "Failed to delete site content" }, { status: 500 });
  }
}
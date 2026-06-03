import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard, getUserRole } from "@/lib/auth";
import { announcementLimiter, checkRateLimit } from "@/lib/rate-limit/limiters";
import { getClientIP } from "@/lib/rate-limit/utils";

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const { success } = await checkRateLimit(announcementLimiter, `staff:${ip}`);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const role = await getUserRole();
    const isAdmin = role === "admin";

    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    const where: Record<string, any> = {};

    // Non-admins can only see active staff
    if (!isAdmin || active === "true") {
      where.isActive = true;
    }

    const staff = await prisma.staff.findMany({
      where,
      orderBy: { order: "asc" },
      // Security: Hide phone (PII) from non-admins
      select: isAdmin ? undefined : {
        id: true,
        name: true,
        title: true,
        role: true,
        department: true,
        email: true,
        photoUrl: true,
        bio: true,
        isActive: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const staff = await prisma.staff.create({
      data: {
        name: body.name,
        title: body.title,
        role: body.role,
        department: body.department,
        email: body.email,
        phone: body.phone,
        photoUrl: body.photoUrl,
        bio: body.bio,
        isActive: body.isActive ?? true,
        order: body.order || 0,
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error("Failed to create staff:", error);
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}
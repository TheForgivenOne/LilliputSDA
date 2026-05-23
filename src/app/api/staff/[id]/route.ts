import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard, checkAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkAdmin();

  try {
    const { id } = await params;

    const staff = await prisma.staff.findFirst({
      where: {
        id,
        // Non-admins can only see active staff
        ...(isAdmin ? {} : { isActive: true }),
      },
      // Exclude sensitive fields for non-admins
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
      }
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const { id } = await params;
    const body = await request.json();

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.title && { title: body.title }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.department !== undefined && { department: body.department }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("Failed to update staff:", error);
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
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
    await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete staff:", error);
    return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}

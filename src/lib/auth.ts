import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { UserRole } from "@/types";

export { type UserRole };

export async function checkRole(role: UserRole): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.role) return false;
  return session.user.role === role;
}

export async function checkAdmin(): Promise<boolean> {
  return checkRole("admin");
}

export async function checkEditor(): Promise<boolean> {
  return checkRole("editor");
}

export async function getUserRole(): Promise<string | null> {
  const session = await auth();
  const role = session?.user?.role;
  return typeof role === "string" ? role : null;
}

export async function adminGuard(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: admin role required" }, { status: 403 });
  }
  return null;
}
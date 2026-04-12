import { auth } from "@/auth";

export type UserRole = "admin" | "editor" | "member";

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

export async function getUserRole(): Promise<UserRole | null> {
  const session = await auth();
  return session?.user?.role as UserRole | null;
}

export async function requireRole(role: UserRole): Promise<void> {
  const hasRole = await checkRole(role);
  if (!hasRole) {
    throw new Error(`Access denied: requires ${role} role`);
  }
}
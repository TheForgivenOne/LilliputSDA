import { auth } from "@clerk/nextjs/server";

export type UserRole = "admin" | "editor" | "member";

export async function checkRole(role: UserRole): Promise<boolean> {
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: UserRole })?.role;
  return userRole === role;
}

export async function checkAdmin(): Promise<boolean> {
  return checkRole("admin");
}

export async function checkEditor(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: UserRole })?.role;
  return userRole === "admin" || userRole === "editor";
}

export async function getUserRole(): Promise<UserRole | null> {
  const { sessionClaims } = await auth();
  return (sessionClaims?.metadata as { role?: UserRole })?.role ?? null;
}

export async function requireRole(role: UserRole): Promise<void> {
  const hasRole = await checkRole(role);
  if (!hasRole) {
    throw new Error(`Forbidden: ${role} role required`);
  }
}

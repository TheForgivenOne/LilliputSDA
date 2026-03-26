export type UserRole = "admin" | "member";

export async function checkRole(role: UserRole): Promise<boolean> {
  return false
}

export async function checkAdmin(): Promise<boolean> {
  return false
}

export async function checkEditor(): Promise<boolean> {
  return false
}

export async function getUserRole(): Promise<UserRole | null> {
  return null
}

export async function requireRole(role: UserRole): Promise<void> {
  throw new Error("Authentication not configured")
}
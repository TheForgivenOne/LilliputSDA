import { QueryCtx, MutationCtx } from "../_generated/server";

export type UserRole = "admin" | "member";

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

export async function getAuthUser(ctx: QueryCtx | MutationCtx): Promise<AuthUser | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const orgRole = identity.orgRole as string | undefined;
  let role: UserRole = "member";

  if (orgRole === "org_admin" || orgRole === "admin" || orgRole === "org:admin") {
    role = "admin";
  }

  return {
    userId: identity.subject,
    email: identity.email || "",
    role,
  };
}

export async function requireAuth(ctx: QueryCtx | MutationCtx): Promise<AuthUser> {
  const user = await getAuthUser(ctx);
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  return user;
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<AuthUser> {
  const user = await requireAuth(ctx);
  if (user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}

export async function requireEditor(ctx: QueryCtx | MutationCtx): Promise<AuthUser> {
  const user = await requireAuth(ctx);
  if (user.role !== "admin") {
    throw new Error("Forbidden: Editor access required");
  }
  return user;
}

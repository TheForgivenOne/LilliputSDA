export const convexEnv = {
  clerkFrontendUrl: process.env.CLERK_FRONTEND_API_URL,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
} as const;

export type ConvexEnv = typeof convexEnv;

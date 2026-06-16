import { Ratelimit } from "@upstash/ratelimit";
import { redis, isRedisConfigured } from "./redis";
import type { Duration } from "@upstash/ratelimit";

function createLimiter(prefix: string, limit: number, window: Duration) {
  if (!redis) {
    return null;
  }
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: `ratelimit:${prefix}`,
    analytics: true,
  });
}

export const emailLimiter = createLimiter("email", 5, "1 m");
export const authLimiter = createLimiter("auth", 5, "15 m");
export const youtubeLimiter = createLimiter("youtube", 30, "1 m");
export const scriptureLimiter = createLimiter("scripture", 20, "1 m");
export const announcementLimiter = createLimiter("announcement", 20, "1 m");
export const formLimiter = createLimiter("form", 5, "1 m");

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean }> {
  if (!isRedisConfigured || !limiter) {
    if (!isRedisConfigured) {
      console.warn("[RateLimit] Redis not configured — rate limiting disabled");
    }
    return { success: true };
  }
  return limiter.limit(identifier);
}

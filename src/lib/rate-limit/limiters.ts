import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const emailLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "ratelimit:email",
  analytics: true,
});

export const youtubeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  prefix: "ratelimit:youtube",
  analytics: true,
});

export const scriptureLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  prefix: "ratelimit:scripture",
  analytics: true,
});

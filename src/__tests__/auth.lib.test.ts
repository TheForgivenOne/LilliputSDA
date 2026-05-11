import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit/limiters";
import type { Ratelimit } from "@upstash/ratelimit";

vi.mock("@/lib/rate-limit/redis", () => ({
  redis: { limit: vi.fn() },
  isRedisConfigured: true,
}));

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success when limiter is null", async () => {
    const result = await checkRateLimit(null, "test-id");
    expect(result.success).toBe(true);
  });

  it("delegates to limiter.limit when limiter exists", async () => {
    const mockLimit = vi.fn().mockResolvedValue({ success: true });
    const mockLimiter = { limit: mockLimit } as unknown as Ratelimit;

    const result = await checkRateLimit(mockLimiter, "test-id");
    expect(result.success).toBe(true);
    expect(mockLimit).toHaveBeenCalledWith("test-id");
  });

  it("returns blocked result from limiter", async () => {
    const mockLimit = vi.fn().mockResolvedValue({ success: false });
    const mockLimiter = { limit: mockLimit } as unknown as Ratelimit;

    const result = await checkRateLimit(mockLimiter, "test-id");
    expect(result.success).toBe(false);
  });
});

describe("checkRateLimit with unconfigured redis", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns success when redis not configured", async () => {
    vi.doMock("@/lib/rate-limit/redis", () => ({
      redis: null,
      isRedisConfigured: false,
    }));

    const { checkRateLimit: checkLimit } = await import("@/lib/rate-limit/limiters");
    const result = await checkLimit(null, "test-id");
    expect(result.success).toBe(true);
  });
});

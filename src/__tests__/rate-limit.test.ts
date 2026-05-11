import { describe, it, expect, vi, beforeEach } from "vitest";

describe("redis configuration", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it("creates redis client when env vars are set", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";

    const { redis, isRedisConfigured } = await import("@/lib/rate-limit/redis");
    expect(isRedisConfigured).toBe(true);
    expect(redis).not.toBeNull();
  });

  it("returns null when env vars are missing", async () => {
    const { redis, isRedisConfigured } = await import("@/lib/rate-limit/redis");
    expect(isRedisConfigured).toBe(false);
    expect(redis).toBeNull();
  });

  it("returns null when only URL is set", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";

    const { redis, isRedisConfigured } = await import("@/lib/rate-limit/redis");
    expect(isRedisConfigured).toBe(false);
    expect(redis).toBeNull();
  });

  it("returns null when only token is set", async () => {
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";

    const { redis, isRedisConfigured } = await import("@/lib/rate-limit/redis");
    expect(isRedisConfigured).toBe(false);
    expect(redis).toBeNull();
  });
});

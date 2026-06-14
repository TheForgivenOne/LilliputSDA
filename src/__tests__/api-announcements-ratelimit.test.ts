import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  limit: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);

// Fully mock the database to prevent actual Prisma calls
vi.mock("@/lib/db", () => ({
  prisma: {
    announcement: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
    },
  },
}));

// Mock the entire rate-limit module
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(async (limiter, ip) => {
    return mocks.limit();
  }),
  announcementLimiter: { name: "announcementLimiter" }, // dummy object
  getClientIP: vi.fn(() => "127.0.0.1"),
}));

import { NextRequest } from "next/server";
import { GET as GETCollection } from "@/app/api/announcements/route";
import { GET as GETItem } from "@/app/api/announcements/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
});

describe("Announcements API Rate Limiting", () => {
  it("enforces rate limit on GET /api/announcements", async () => {
    mocks.limit.mockResolvedValue({ success: false });

    const response = await GETCollection(new NextRequest("http://localhost:3000/api/announcements"));

    expect(response.status).toBe(429);
    const body = await response.json();
    expect(body.error).toContain("Too many requests");
  });

  it("enforces rate limit on GET /api/announcements/[id]", async () => {
    mocks.limit.mockResolvedValue({ success: false });

    const response = await GETItem(
      new NextRequest("http://localhost:3000/api/announcements/1"),
      { params: Promise.resolve({ id: "1" }) }
    );

    expect(response.status).toBe(429);
    const body = await response.json();
    expect(body.error).toContain("Too many requests");
  });

  it("allows requests when within rate limit", async () => {
    mocks.limit.mockResolvedValue({ success: true });

    const response = await GETCollection(new NextRequest("http://localhost:3000/api/announcements"));
    expect(response.status).not.toBe(429);
  });
});

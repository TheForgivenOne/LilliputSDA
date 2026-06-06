import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as announcementsGET } from "@/app/api/announcements/route";
import { GET as eventsGET } from "@/app/api/events/route";
import { GET as ministriesGET } from "@/app/api/ministries/route";
import { GET as staffGET } from "@/app/api/staff/route";
import * as rateLimit from "@/lib/rate-limit";

vi.mock("@/lib/rate-limit", async () => {
  const actual = await vi.importActual("@/lib/rate-limit") as any;
  return {
    ...actual,
    checkRateLimit: vi.fn().mockResolvedValue({ success: true }),
    getClientIP: vi.fn().mockReturnValue("127.0.0.1"),
  };
});

vi.mock("@/lib/db", () => ({
  prisma: {
    announcement: { findMany: vi.fn().mockResolvedValue([]) },
    event: { findMany: vi.fn().mockResolvedValue([]) },
    ministry: { findMany: vi.fn().mockResolvedValue([]) },
    staff: { findMany: vi.fn().mockResolvedValue([]) },
  },
}));

vi.mock("@/lib/auth", () => ({
  adminGuard: vi.fn().mockResolvedValue(null),
  getUserRole: vi.fn().mockResolvedValue("user"),
}));

describe("Rate Limiting for Public Content Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls rate limiter for announcements GET", async () => {
    const req = new NextRequest("http://localhost/api/announcements");
    await announcementsGET(req);
    expect(rateLimit.checkRateLimit).toHaveBeenCalledWith(rateLimit.announcementLimiter, "127.0.0.1");
  });

  it("calls rate limiter for events GET", async () => {
    const req = new NextRequest("http://localhost/api/events");
    await eventsGET(req);
    expect(rateLimit.checkRateLimit).toHaveBeenCalledWith(rateLimit.announcementLimiter, "127.0.0.1");
  });

  it("calls rate limiter for ministries GET", async () => {
    const req = new NextRequest("http://localhost/api/ministries");
    await ministriesGET(req);
    expect(rateLimit.checkRateLimit).toHaveBeenCalledWith(rateLimit.announcementLimiter, "127.0.0.1");
  });

  it("calls rate limiter for staff GET", async () => {
    const req = new NextRequest("http://localhost/api/staff");
    await staffGET(req);
    expect(rateLimit.checkRateLimit).toHaveBeenCalledWith(rateLimit.announcementLimiter, "127.0.0.1");
  });

  it("returns 429 when rate limit is exceeded", async () => {
    vi.mocked(rateLimit.checkRateLimit).mockResolvedValueOnce({ success: false } as any);
    const req = new NextRequest("http://localhost/api/announcements");
    const res = await announcementsGET(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain("Too many requests");
  });
});

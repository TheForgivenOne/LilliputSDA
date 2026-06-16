import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  findFirst: vi.fn(),
  limit: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    announcement: {
      findMany: mocks.findMany,
      findFirst: mocks.findFirst,
    },
  },
}));

// Mock the rate limiter
vi.mock("@/lib/rate-limit/limiters", async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    announcementLimiter: { limit: mocks.limit },
    checkRateLimit: vi.fn().mockImplementation(async (limiter) => {
       if (limiter && limiter.limit) {
         return limiter.limit();
       }
       return { success: true };
    }),
  };
});

import { NextRequest } from "next/server";
import { GET as GET_ALL } from "@/app/api/announcements/route";
import { GET as GET_ONE } from "@/app/api/announcements/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.limit.mockResolvedValue({ success: true });
});

describe("Announcements Security", () => {
  describe("GET /api/announcements", () => {
    it("hides expired announcements from unauthenticated users", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findMany.mockResolvedValue([]);

      await GET_ALL(new NextRequest("http://localhost:3000/api/announcements"));

      const callArgs = mocks.findMany.mock.calls[0][0] as any;
      expect(callArgs.where.OR).toEqual([
        { expiresAt: null },
        { expiresAt: { gt: expect.any(Date) } }
      ]);
    });

    it("allows admin to see all announcements including expired", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([]);

      await GET_ALL(new NextRequest("http://localhost:3000/api/announcements"));

      const callArgs = mocks.findMany.mock.calls[0][0] as any;
      expect(callArgs.where.OR).toBeUndefined();
    });

    it("enforces rate limiting", async () => {
      mocks.limit.mockResolvedValue({ success: false });

      const response = await GET_ALL(new NextRequest("http://localhost:3000/api/announcements"));
      expect(response.status).toBe(429);
      expect(mocks.findMany).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/announcements/[id]", () => {
    it("prevents unauthenticated users from accessing expired announcements by ID", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findFirst.mockResolvedValue(null);

      const response = await GET_ONE(
        new NextRequest("http://localhost:3000/api/announcements/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      const callArgs = mocks.findFirst.mock.calls[0][0] as any;
      expect(callArgs.where.id).toBe("1");
      expect(callArgs.where.OR).toEqual([
        { expiresAt: null },
        { expiresAt: { gt: expect.any(Date) } }
      ]);
    });

    it("allows admin to see expired announcements by ID", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findFirst.mockResolvedValue({ id: "1", title: "Expired" });

      const response = await GET_ONE(
        new NextRequest("http://localhost:3000/api/announcements/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(200);
      const callArgs = mocks.findFirst.mock.calls[0][0] as any;
      expect(callArgs.where).toEqual({ id: "1" });
    });

    it("enforces rate limiting on detail route", async () => {
      mocks.limit.mockResolvedValue({ success: false });

      const response = await GET_ONE(
        new NextRequest("http://localhost:3000/api/announcements/1"),
        { params: Promise.resolve({ id: "1" }) }
      );
      expect(response.status).toBe(429);
      expect(mocks.findFirst).not.toHaveBeenCalled();
    });
  });
});

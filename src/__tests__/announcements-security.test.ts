import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  findUnique: vi.fn(),
  checkRateLimit: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    announcement: {
      findMany: mocks.findMany,
      findUnique: mocks.findUnique,
    },
  },
}));

vi.mock("@/lib/rate-limit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/rate-limit")>();
  return {
    ...actual,
    checkRateLimit: mocks.checkRateLimit,
  };
});

import { GET as GET_ALL } from "@/app/api/announcements/route";
import { GET as GET_ONE } from "@/app/api/announcements/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Announcements API Security", () => {
  describe("GET /api/announcements", () => {
    it("should hide expired announcements from non-admin users", async () => {
      mocks.auth.auth.mockResolvedValue(null); // Unauthenticated
      mocks.findMany.mockResolvedValue([]);

      await GET_ALL(new NextRequest("http://localhost:3000/api/announcements"));

      const callArgs = mocks.findMany.mock.calls[0][0] as any;

      // This is what we WANT, but it might fail now if not implemented
      expect(callArgs.where).toMatchObject({
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: expect.any(Date) } }
        ]
      });
    });

    it("should allow admin users to see expired announcements", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([]);

      await GET_ALL(new NextRequest("http://localhost:3000/api/announcements"));

      const callArgs = mocks.findMany.mock.calls[0][0] as any;
      // Admins should not have the expiration filter
      expect(callArgs.where?.OR).toBeUndefined();
    });
  });

  describe("GET /api/announcements/[id]", () => {
    it("should return 404 for expired announcements for non-admin users", async () => {
      const expiredDate = new Date();
      expiredDate.setFullYear(expiredDate.getFullYear() - 1);

      mocks.auth.auth.mockResolvedValue(null);
      mocks.findUnique.mockResolvedValue({
        id: "1",
        title: "Expired",
        expiresAt: expiredDate
      });

      const response = await GET_ONE(
        new NextRequest("http://localhost:3000/api/announcements/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
    });
  });
});

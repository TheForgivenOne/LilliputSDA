import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  findFirst: vi.fn(),
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

// Mock rate limiting to always succeed
vi.mock("@/lib/rate-limit", async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    checkRateLimit: vi.fn().mockResolvedValue({ success: true }),
  };
});

import { NextRequest } from "next/server";
import { GET as GET_COLLECTION } from "@/app/api/announcements/route";
import { GET as GET_ITEM } from "@/app/api/announcements/[id]/route";

describe("Announcements API Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/announcements (Collection)", () => {
    it("hides expired announcements from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
      mocks.findMany.mockResolvedValue([]);

      await GET_COLLECTION(new NextRequest("http://localhost:3000/api/announcements"));

      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: expect.any(Date) } },
            ],
          }),
        })
      );
    });

    it("shows all announcements to admins", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([]);

      await GET_COLLECTION(new NextRequest("http://localhost:3000/api/announcements"));

      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({
            OR: expect.any(Array),
          }),
        })
      );
    });
  });

  describe("GET /api/announcements/[id] (Item)", () => {
    it("hides expired announcement from non-admins by ID", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
      mocks.findFirst.mockResolvedValue(null);

      const response = await GET_ITEM(
        new NextRequest("http://localhost:3000/api/announcements/123"),
        { params: Promise.resolve({ id: "123" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: "123",
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: expect.any(Date) } },
            ],
          }),
        })
      );
    });

    it("allows admins to see expired announcement by ID", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findFirst.mockResolvedValue({ id: "123", title: "Expired" });

      const response = await GET_ITEM(
        new NextRequest("http://localhost:3000/api/announcements/123"),
        { params: Promise.resolve({ id: "123" }) }
      );

      expect(response.status).toBe(200);
      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "123" },
        })
      );
    });
  });
});

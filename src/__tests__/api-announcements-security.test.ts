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

import { NextRequest } from "next/server";
import { GET as GET_COLLECTION } from "@/app/api/announcements/route";
import { GET as GET_ITEM } from "@/app/api/announcements/[id]/route";

describe("Announcements Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Collection Endpoint (GET /api/announcements)", () => {
    it("filters expired announcements for non-admin users", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
      mocks.findMany.mockResolvedValue([]);

      await GET_COLLECTION(new NextRequest("http://localhost:3000/api/announcements"));

      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: expect.any(Date) } }
            ]
          }),
        })
      );
    });

    it("does NOT filter expired announcements for admin users", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([]);

      await GET_COLLECTION(new NextRequest("http://localhost:3000/api/announcements"));

      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({
            OR: expect.anything()
          }),
        })
      );
    });
  });

  describe("Item Endpoint (GET /api/announcements/[id])", () => {
    it("filters expired announcement for non-admin users using findFirst", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
      mocks.findFirst.mockResolvedValue(null);

      await GET_ITEM(
        new NextRequest("http://localhost:3000/api/announcements/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: "1",
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: expect.any(Date) } }
            ]
          }),
        })
      );
    });

    it("does NOT filter expired announcement for admin users", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findFirst.mockResolvedValue({ id: "1" });

      await GET_ITEM(
        new NextRequest("http://localhost:3000/api/announcements/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: "1"
          },
        })
      );
    });
  });
});

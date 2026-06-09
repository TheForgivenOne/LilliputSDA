import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  findFirst: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    announcement: {
      findMany: mocks.findMany,
      findFirst: mocks.findFirst,
      create: mocks.create,
      update: mocks.update,
      delete: mocks.delete,
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
import { GET as GET_COLLECTION, POST } from "@/app/api/announcements/route";
import { GET as GET_ITEM, PATCH, DELETE } from "@/app/api/announcements/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
});

describe("Announcements API", () => {
  describe("GET /api/announcements", () => {
    it("returns announcements for admins", async () => {
      const announcements = [{ id: "1", title: "Test" }];
      mocks.findMany.mockResolvedValue(announcements);

      const response = await GET_COLLECTION(new NextRequest("http://localhost:3000/api/announcements"));
      const body = await response.json();

      expect(body).toEqual(announcements);
    });

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

    it("filters by pinned when query param is true", async () => {
      mocks.findMany.mockResolvedValue([]);

      await GET_COLLECTION(new NextRequest("http://localhost:3000/api/announcements?pinned=true"));

      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isPinned: true }),
        })
      );
    });
  });

  describe("GET /api/announcements/[id]", () => {
    it("hides expired announcement from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
      mocks.findFirst.mockResolvedValue(null);

      const response = await GET_ITEM(
        new NextRequest("http://localhost:3000/api/announcements/123"),
        { params: Promise.resolve({ id: "123" }) }
      );

      expect(response.status).toBe(404);
    });

    it("allows admins to see expired announcement", async () => {
      mocks.findFirst.mockResolvedValue({ id: "123", title: "Expired" });

      const response = await GET_ITEM(
        new NextRequest("http://localhost:3000/api/announcements/123"),
        { params: Promise.resolve({ id: "123" }) }
      );

      expect(response.status).toBe(200);
    });
  });

  describe("POST /api/announcements", () => {
    it("creates an announcement (admin only)", async () => {
      mocks.create.mockResolvedValue({ id: "1", title: "Test" });

      const request = new NextRequest("http://localhost:3000/api/announcements", {
        method: "POST",
        body: JSON.stringify({ title: "Test", content: "Content" }),
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("denies access to non-admins", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });

      const request = new NextRequest("http://localhost:3000/api/announcements", {
        method: "POST",
        body: JSON.stringify({ title: "Test", content: "Content" }),
      });
      const response = await POST(request);

      expect(response.status).toBe(403);
    });
  });
});

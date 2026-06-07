import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  findUnique: vi.fn(),
  findFirst: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    siteContent: {
      findMany: mocks.findMany,
      findUnique: mocks.findUnique,
      findFirst: mocks.findFirst,
    },
    testimonial: {
      findMany: mocks.findMany,
      findUnique: mocks.findUnique,
      findFirst: mocks.findFirst,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET as GET_SITE_CONTENT_ALL } from "@/app/api/site-content/route";
import { GET as GET_SITE_CONTENT_ONE } from "@/app/api/site-content/[id]/route";
import { GET as GET_TESTIMONIALS_ALL } from "@/app/api/testimonials/route";
import { GET as GET_TESTIMONIALS_ONE } from "@/app/api/testimonials/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("API RBAC for Inactive Records", () => {
  describe("SiteContent API", () => {
    it("GET /api/site-content - unauthenticated users should only see active records", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findMany.mockResolvedValue([]);

      await GET_SITE_CONTENT_ALL();

      const callArgs = mocks.findMany.mock.calls[0][0] as any;
      expect(callArgs?.where?.isActive).toBe(true);
    });

    it("GET /api/site-content - admins should see all records", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([]);

      await GET_SITE_CONTENT_ALL();

      const callArgs = mocks.findMany.mock.calls[0][0] as any;
      expect(callArgs?.where?.isActive).toBeUndefined();
    });

    it("GET /api/site-content/[id] - unauthenticated users should not see inactive records", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      // We expect the implementation to use findFirst to allow filtering by isActive
      mocks.findFirst.mockResolvedValue(null);

      const response = await GET_SITE_CONTENT_ONE(
        new NextRequest("http://localhost:3000/api/site-content/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ id: "1", isActive: true }),
        })
      );
    });
  });

  describe("Testimonials API", () => {
    it("GET /api/testimonials - unauthenticated users should only see active records", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findMany.mockResolvedValue([]);

      await GET_TESTIMONIALS_ALL();

      const callArgs = mocks.findMany.mock.calls[0][0] as any;
      expect(callArgs?.where?.isActive).toBe(true);
    });

    it("GET /api/testimonials - admins should see all records", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([]);

      await GET_TESTIMONIALS_ALL();

      const callArgs = mocks.findMany.mock.calls[0][0] as any;
      // If fixed, where.isActive should be undefined for admins
      expect(callArgs?.where?.isActive).toBeUndefined();
    });

    it("GET /api/testimonials/[id] - unauthenticated users should not see inactive records", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findFirst.mockResolvedValue(null);

      const response = await GET_TESTIMONIALS_ONE(
        new NextRequest("http://localhost:3000/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ id: "1", isActive: true }),
        })
      );
    });
  });
});

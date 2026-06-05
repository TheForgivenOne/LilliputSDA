import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  siteContent: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
  },
  testimonial: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
  },
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    siteContent: mocks.siteContent,
    testimonial: mocks.testimonial,
  },
}));

import { NextRequest } from "next/server";
import { GET as GET_CONTENT_ALL } from "@/app/api/site-content/route";
import { GET as GET_CONTENT_ONE } from "@/app/api/site-content/[id]/route";
import { GET as GET_TESTIMONIALS_ALL } from "@/app/api/testimonials/route";
import { GET as GET_TESTIMONIALS_ONE } from "@/app/api/testimonials/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RBAC and Inactive Record Security", () => {
  describe("SiteContent API", () => {
    it("should filter inactive records for non-admins (Collection)", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findMany.mockResolvedValue([]);

      await GET_CONTENT_ALL();

      const callArgs = mocks.siteContent.findMany.mock.calls[0][0] as any;
      // VULNERABILITY CHECK: If this fails, non-admins can see inactive content
      expect(callArgs?.where?.isActive).toBe(true);
    });

    it("should prevent non-admins from accessing inactive records by ID", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findFirst.mockResolvedValue(null);
      // findUnique might be used currently, but it should be findFirst or have an isActive check

      const response = await GET_CONTENT_ONE(
        new NextRequest("http://localhost:3000/api/site-content/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);

      const call = mocks.siteContent.findFirst || mocks.siteContent.findUnique;
      const callArgs = call.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBe(true);
    });
  });

  describe("Testimonials API", () => {
    it("should filter inactive records for non-admins (Collection)", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.testimonial.findMany.mockResolvedValue([]);

      await GET_TESTIMONIALS_ALL();

      const callArgs = mocks.testimonial.findMany.mock.calls[0][0] as any;
      expect(callArgs?.where?.isActive).toBe(true);
    });

    it("should allow admins to see inactive testimonials (Collection)", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.testimonial.findMany.mockResolvedValue([]);

      await GET_TESTIMONIALS_ALL();

      const callArgs = mocks.testimonial.findMany.mock.calls[0][0] as any;
      expect(callArgs?.where?.isActive).toBeUndefined();
    });

    it("should prevent non-admins from accessing inactive testimonials by ID", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.testimonial.findFirst.mockResolvedValue(null);

      const response = await GET_TESTIMONIALS_ONE(
        new NextRequest("http://localhost:3000/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);

      const call = mocks.testimonial.findFirst || mocks.testimonial.findUnique;
      const callArgs = call.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBe(true);
    });
  });
});

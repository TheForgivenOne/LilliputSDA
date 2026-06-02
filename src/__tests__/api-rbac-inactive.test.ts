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
import { GET as GET_SITE_CONTENT } from "@/app/api/site-content/route";
import { GET as GET_SITE_CONTENT_ID } from "@/app/api/site-content/[id]/route";
import { GET as GET_TESTIMONIALS } from "@/app/api/testimonials/route";
import { GET as GET_TESTIMONIALS_ID } from "@/app/api/testimonials/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RBAC for Inactive Records", () => {
  describe("SiteContent API", () => {
    it("GET /api/site-content filters inactive records for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findMany.mockResolvedValue([]);

      await GET_SITE_CONTENT();

      const callArgs = mocks.siteContent.findMany.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBe(true);
    });

    it("GET /api/site-content allows admins to see inactive records", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.siteContent.findMany.mockResolvedValue([]);

      await GET_SITE_CONTENT();

      const callArgs = mocks.siteContent.findMany.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBeUndefined();
    });

    it("GET /api/site-content/[id] hides inactive records from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findFirst.mockResolvedValue(null);

      const response = await GET_SITE_CONTENT_ID(
        new NextRequest("http://localhost:3000/api/site-content/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      const callArgs = mocks.siteContent.findFirst.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBe(true);
    });
  });

  describe("Testimonials API", () => {
    it("GET /api/testimonials allows admins to see inactive records", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.testimonial.findMany.mockResolvedValue([]);

      await GET_TESTIMONIALS();

      const callArgs = mocks.testimonial.findMany.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBeUndefined();
    });

    it("GET /api/testimonials filters inactive records for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.testimonial.findMany.mockResolvedValue([]);

      await GET_TESTIMONIALS();

      const callArgs = mocks.testimonial.findMany.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBe(true);
    });

    it("GET /api/testimonials/[id] hides inactive records from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.testimonial.findFirst.mockResolvedValue(null);

      const response = await GET_TESTIMONIALS_ID(
        new NextRequest("http://localhost:3000/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      const callArgs = mocks.testimonial.findFirst.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBe(true);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  siteContent: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
  },
  testimonial: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
  },
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    siteContent: {
      findMany: mocks.siteContent.findMany,
      findFirst: mocks.siteContent.findFirst,
    },
    testimonial: {
      findMany: mocks.testimonial.findMany,
      findFirst: mocks.testimonial.findFirst,
    },
  },
}));

import { GET as GET_ALL_CONTENT } from "@/app/api/site-content/route";
import { GET as GET_ONE_CONTENT } from "@/app/api/site-content/[id]/route";
import { GET as GET_ALL_TESTIMONIALS } from "@/app/api/testimonials/route";
import { GET as GET_ONE_TESTIMONIAL } from "@/app/api/testimonials/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RBAC and Inactive Record Security", () => {
  describe("SiteContent API", () => {
    it("GET /api/site-content filters inactive records for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findMany.mockResolvedValue([]);

      await GET_ALL_CONTENT();

      expect(mocks.siteContent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        })
      );
    });

    it("GET /api/site-content allows admins to see all records", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.siteContent.findMany.mockResolvedValue([]);

      await GET_ALL_CONTENT();

      expect(mocks.siteContent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      );
    });

    it("GET /api/site-content/[id] hides inactive records from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findFirst.mockResolvedValue(null);

      const response = await GET_ONE_CONTENT(
        new NextRequest("http://localhost/api/site-content/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.siteContent.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "1", isActive: true },
        })
      );
    });
  });

  describe("Testimonials API", () => {
    it("GET /api/testimonials filters inactive records for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.testimonial.findMany.mockResolvedValue([]);

      await GET_ALL_TESTIMONIALS();

      expect(mocks.testimonial.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        })
      );
    });

    it("GET /api/testimonials allows admins to see all records", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.testimonial.findMany.mockResolvedValue([]);

      await GET_ALL_TESTIMONIALS();

      expect(mocks.testimonial.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      );
    });

    it("GET /api/testimonials/[id] hides inactive records from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.testimonial.findFirst.mockResolvedValue(null);

      const response = await GET_ONE_TESTIMONIAL(
        new NextRequest("http://localhost/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.testimonial.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "1", isActive: true },
        })
      );
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

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

import { GET as GET_SITE_CONTENTS } from "@/app/api/site-content/route";
import { GET as GET_SITE_CONTENT } from "@/app/api/site-content/[id]/route";
import { GET as GET_TESTIMONIALS } from "@/app/api/testimonials/route";
import { GET as GET_TESTIMONIAL } from "@/app/api/testimonials/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Visibility Security Tests (SiteContent & Testimonials)", () => {
  describe("SiteContent API", () => {
    it("GET /api/site-content filters inactive content for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null); // Not logged in
      mocks.siteContent.findMany.mockResolvedValue([]);

      const response = await GET_SITE_CONTENTS();
      expect(response.status).toBe(200);

      const callArgs = mocks.siteContent.findMany.mock.calls[0][0] as any;
      // This is what we WANT to happen after the fix
      expect(callArgs.where).toBeDefined();
      expect(callArgs.where.isActive).toBe(true);
    });

    it("GET /api/site-content allows admins to see all content", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.siteContent.findMany.mockResolvedValue([]);

      const response = await GET_SITE_CONTENTS();
      expect(response.status).toBe(200);

      const callArgs = mocks.siteContent.findMany.mock.calls[0][0] as any;
      expect(callArgs?.where?.isActive).toBeUndefined();
    });

    it("GET /api/site-content/[id] hides inactive content from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findFirst.mockResolvedValue(null);

      const response = await GET_SITE_CONTENT(
        new NextRequest("http://localhost:3000/api/site-content/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.siteContent.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ id: "1", isActive: true }),
        })
      );
    });
  });

  describe("Testimonials API", () => {
    it("GET /api/testimonials filters inactive testimonials for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.testimonial.findMany.mockResolvedValue([]);

      const response = await GET_TESTIMONIALS();
      expect(response.status).toBe(200);

      const callArgs = mocks.testimonial.findMany.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBe(true);
    });

    it("GET /api/testimonials allows admins to see all testimonials", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.testimonial.findMany.mockResolvedValue([]);

      const response = await GET_TESTIMONIALS();
      expect(response.status).toBe(200);

      const callArgs = mocks.testimonial.findMany.mock.calls[0][0] as any;
      expect(callArgs?.where?.isActive).toBeUndefined();
    });

    it("GET /api/testimonials/[id] hides inactive testimonials from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.testimonial.findFirst.mockResolvedValue(null);

      const response = await GET_TESTIMONIAL(
        new NextRequest("http://localhost:3000/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.testimonial.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ id: "1", isActive: true }),
        })
      );
    });
  });
});

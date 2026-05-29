import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  findFirst: vi.fn(),
  checkRateLimit: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/rate-limit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/rate-limit")>();
  return {
    ...actual,
    checkRateLimit: mocks.checkRateLimit,
  };
});

vi.mock("@/lib/db", () => ({
  prisma: {
    testimonial: {
      findMany: mocks.findMany,
      findFirst: mocks.findFirst,
    },
    siteContent: {
      findMany: mocks.findMany,
      findFirst: mocks.findFirst,
    },
    announcement: {
      findMany: mocks.findMany,
    }
  },
}));

import { NextRequest } from "next/server";
import { GET as GET_TESTIMONIALS } from "@/app/api/testimonials/route";
import { GET as GET_TESTIMONIAL } from "@/app/api/testimonials/[id]/route";
import { GET as GET_SITE_CONTENTS } from "@/app/api/site-content/route";
import { GET as GET_SITE_CONTENT } from "@/app/api/site-content/[id]/route";
import { GET as GET_ANNOUNCEMENTS } from "@/app/api/announcements/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.checkRateLimit.mockResolvedValue({ success: true });
});

describe("API Security Enhancements", () => {
  describe("Testimonials RBAC", () => {
    it("GET /api/testimonials filters inactive for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findMany.mockResolvedValue([]);

      await GET_TESTIMONIALS();
      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } })
      );
    });

    it("GET /api/testimonials allows all for admins", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([]);

      await GET_TESTIMONIALS();
      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} })
      );
    });

    it("GET /api/testimonials/[id] filters inactive for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findFirst.mockResolvedValue(null);

      const response = await GET_TESTIMONIAL(
        new NextRequest("http://localhost:3000/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "1", isActive: true } })
      );
    });
  });

  describe("SiteContent RBAC", () => {
    it("GET /api/site-content filters inactive for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findMany.mockResolvedValue([]);

      await GET_SITE_CONTENTS();
      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } })
      );
    });

    it("GET /api/site-content/[id] filters inactive for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findFirst.mockResolvedValue(null);

      const response = await GET_SITE_CONTENT(
        new NextRequest("http://localhost:3000/api/site-content/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "1", isActive: true } })
      );
    });
  });

  describe("Announcements Rate Limiting", () => {
    it("GET /api/announcements returns 429 when rate limited", async () => {
      mocks.checkRateLimit.mockResolvedValue({ success: false });

      const response = await GET_ANNOUNCEMENTS(new NextRequest("http://localhost:3000/api/announcements"));

      expect(response.status).toBe(429);
      expect(mocks.checkRateLimit).toHaveBeenCalled();
    });

    it("GET /api/announcements returns 200 when not rate limited", async () => {
      mocks.checkRateLimit.mockResolvedValue({ success: true });
      mocks.findMany.mockResolvedValue([]);

      const response = await GET_ANNOUNCEMENTS(new NextRequest("http://localhost:3000/api/announcements"));

      expect(response.status).toBe(200);
    });
  });
});

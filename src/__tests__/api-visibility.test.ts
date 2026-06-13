import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  testimonial: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
  },
  siteContent: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
  },
  announcement: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
  },
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    testimonial: mocks.testimonial,
    siteContent: mocks.siteContent,
    announcement: mocks.announcement,
  },
}));

// Import routes AFTER mocking
import { GET as GET_TESTIMONIALS } from "@/app/api/testimonials/route";
import { GET as GET_TESTIMONIAL } from "@/app/api/testimonials/[id]/route";
import { GET as GET_SITE_CONTENTS } from "@/app/api/site-content/route";
import { GET as GET_SITE_CONTENT } from "@/app/api/site-content/[id]/route";
import { GET as GET_ANNOUNCEMENTS } from "@/app/api/announcements/route";
import { GET as GET_ANNOUNCEMENT } from "@/app/api/announcements/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Visibility and IDOR Protection", () => {
  describe("Testimonials", () => {
    it("GET /api/testimonials - currently should filter isActive but let's see if it handles admin correctly later", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.testimonial.findMany.mockResolvedValue([]);

      await GET_TESTIMONIALS();

      expect(mocks.testimonial.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true }
        })
      );
    });

    it("GET /api/testimonials/[id] - should NOT allow access to inactive testimonials (IDOR)", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.testimonial.findFirst.mockResolvedValue(null);

      const response = await GET_TESTIMONIAL(
        new NextRequest("http://localhost:3000/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.testimonial.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "1", isActive: true }
        })
      );
    });
  });

  describe("SiteContent", () => {
    it("GET /api/site-content - should filter inactive content", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findMany.mockResolvedValue([]);

      await GET_SITE_CONTENTS();

      expect(mocks.siteContent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true }
        })
      );
    });

    it("GET /api/site-content/[id] - should NOT allow access to inactive content (IDOR)", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findFirst.mockResolvedValue(null);

      const response = await GET_SITE_CONTENT(
        new NextRequest("http://localhost:3000/api/site-content/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.siteContent.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "1", isActive: true }
        })
      );
    });
  });

  describe("Announcements", () => {
    it("GET /api/announcements - should filter expired announcements", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.announcement.findMany.mockResolvedValue([]);

      await GET_ANNOUNCEMENTS(new NextRequest("http://localhost:3000/api/announcements"));

      const callArgs = mocks.announcement.findMany.mock.calls[0][0];
      expect(callArgs.where.OR).toBeDefined();
    });

    it("GET /api/announcements/[id] - should NOT allow access to expired announcements (IDOR)", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.announcement.findFirst.mockResolvedValue(null);

      const response = await GET_ANNOUNCEMENT(
        new NextRequest("http://localhost:3000/api/announcements/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.announcement.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: "1",
            OR: expect.any(Array)
          })
        })
      );
    });
  });
});

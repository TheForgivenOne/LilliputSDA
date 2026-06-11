import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  testimonial: {
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

import { NextRequest } from "next/server";
import { GET as GET_TESTIMONIAL } from "@/app/api/testimonials/[id]/route";
import { GET as GET_CONTENTS, POST as POST_CONTENT } from "@/app/api/site-content/route";
import { GET as GET_CONTENT } from "@/app/api/site-content/[id]/route";
import { GET as GET_ANNOUNCEMENTS } from "@/app/api/announcements/route";
import { GET as GET_ANNOUNCEMENT } from "@/app/api/announcements/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RBAC Security", () => {
  describe("Testimonials Security", () => {
    it("GET /api/testimonials/[id] hides inactive from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null); // Not logged in
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

    it("GET /api/testimonials/[id] allows admin to see inactive", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.testimonial.findFirst.mockResolvedValue({ id: "1", isActive: false });

      const response = await GET_TESTIMONIAL(
        new NextRequest("http://localhost:3000/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(200);
      expect(mocks.testimonial.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "1" } })
      );
    });
  });

  describe("SiteContent Security", () => {
    it("GET /api/site-content filters inactive for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findMany.mockResolvedValue([]);

      await GET_CONTENTS();

      expect(mocks.siteContent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        })
      );
    });

    it("GET /api/site-content/[id] hides inactive from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.siteContent.findFirst.mockResolvedValue(null);

      const response = await GET_CONTENT(
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

  describe("Announcements Security", () => {
    it("GET /api/announcements filters expired for non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.announcement.findMany.mockResolvedValue([]);

      await GET_ANNOUNCEMENTS(new NextRequest("http://localhost:3000/api/announcements"));

      const callArgs = mocks.announcement.findMany.mock.calls[0][0];
      expect(callArgs.where.OR).toEqual([
        { expiresAt: null },
        { expiresAt: { gt: expect.any(Date) } },
      ]);
    });

    it("GET /api/announcements/[id] hides expired from non-admins", async () => {
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
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: expect.any(Date) } },
            ],
          }),
        })
      );
    });
  });
});

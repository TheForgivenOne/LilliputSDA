import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  prisma: {
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
  },
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: mocks.prisma,
}));

import { NextRequest } from "next/server";
import { GET as GET_SITE_CONTENT } from "@/app/api/site-content/route";
import { GET as GET_SITE_CONTENT_BY_ID } from "@/app/api/site-content/[id]/route";
import { GET as GET_TESTIMONIALS } from "@/app/api/testimonials/route";
import { GET as GET_TESTIMONIAL_BY_ID } from "@/app/api/testimonials/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("API RBAC Inactive Records Protection", () => {
  describe("GET /api/site-content", () => {
    it("hides inactive records from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null); // Unauthenticated
      mocks.prisma.siteContent.findMany.mockResolvedValue([]);

      const response = await GET_SITE_CONTENT();
      expect(response.status).toBe(200);

      const callArgs = mocks.prisma.siteContent.findMany.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBe(true);
    });

    it("shows all records to admins", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.prisma.siteContent.findMany.mockResolvedValue([]);

      const response = await GET_SITE_CONTENT();
      expect(response.status).toBe(200);

      const callArgs = mocks.prisma.siteContent.findMany.mock.calls[0][0] as any;
      expect(callArgs?.where).toBeUndefined();
    });
  });

  describe("GET /api/site-content/[id]", () => {
    it("hides inactive record by ID from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.prisma.siteContent.findFirst.mockResolvedValue(null);

      const response = await GET_SITE_CONTENT_BY_ID(
        new NextRequest("http://localhost:3000/api/site-content/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);

      const callArgs = mocks.prisma.siteContent.findFirst.mock.calls[0][0] as any;
      expect(callArgs.where.id).toBe("1");
      expect(callArgs.where.isActive).toBe(true);
    });

    it("allows admin to see inactive record by ID", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.prisma.siteContent.findFirst.mockResolvedValue({ id: "1", isActive: false });

      const response = await GET_SITE_CONTENT_BY_ID(
        new NextRequest("http://localhost:3000/api/site-content/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(200);
      const callArgs = mocks.prisma.siteContent.findFirst.mock.calls[0][0] as any;
      expect(callArgs.where.id).toBe("1");
      expect(callArgs.where.isActive).toBeUndefined();
    });
  });

  describe("GET /api/testimonials", () => {
    it("hides inactive records from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.prisma.testimonial.findMany.mockResolvedValue([]);

      const response = await GET_TESTIMONIALS();
      expect(response.status).toBe(200);

      const callArgs = mocks.prisma.testimonial.findMany.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBe(true);
    });

    it("shows all records to admins", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.prisma.testimonial.findMany.mockResolvedValue([]);

      const response = await GET_TESTIMONIALS();
      expect(response.status).toBe(200);

      const callArgs = mocks.prisma.testimonial.findMany.mock.calls[0][0] as any;
      expect(callArgs?.where).toBeUndefined();
    });
  });

  describe("GET /api/testimonials/[id]", () => {
    it("hides inactive record by ID from non-admins", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.prisma.testimonial.findFirst.mockResolvedValue(null);

      const response = await GET_TESTIMONIAL_BY_ID(
        new NextRequest("http://localhost:3000/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);

      const callArgs = mocks.prisma.testimonial.findFirst.mock.calls[0][0] as any;
      expect(callArgs.where.id).toBe("1");
      expect(callArgs.where.isActive).toBe(true);
    });

    it("allows admin to see inactive record by ID", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.prisma.testimonial.findFirst.mockResolvedValue({ id: "1", isActive: false });

      const response = await GET_TESTIMONIAL_BY_ID(
        new NextRequest("http://localhost:3000/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(200);
      const callArgs = mocks.prisma.testimonial.findFirst.mock.calls[0][0] as any;
      expect(callArgs.where.id).toBe("1");
      expect(callArgs.where.isActive).toBeUndefined();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  findFirst: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    testimonial: {
      findMany: mocks.findMany,
      findFirst: mocks.findFirst,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET as GET_ALL } from "@/app/api/testimonials/route";
import { GET as GET_ONE } from "@/app/api/testimonials/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Testimonials API Security", () => {
  describe("GET /api/testimonials", () => {
    it("filters inactive testimonials for unauthenticated users", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findMany.mockResolvedValue([]);

      const response = await GET_ALL();
      expect(response.status).toBe(200);

      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        })
      );
    });

    it("shows all testimonials for admin users", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([]);

      const response = await GET_ALL();
      expect(response.status).toBe(200);

      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      );
    });
  });

  describe("GET /api/testimonials/[id]", () => {
    it("hides inactive testimonials from unauthenticated users", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findFirst.mockResolvedValue(null); // Simulate inactive or not found

      const response = await GET_ONE(
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

    it("allows admin to see inactive testimonials", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findFirst.mockResolvedValue({ id: "1", name: "John", isActive: false });

      const response = await GET_ONE(
        new NextRequest("http://localhost:3000/api/testimonials/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(200);
      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "1" },
        })
      );
    });
  });
});

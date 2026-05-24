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
    staff: {
      findMany: mocks.findMany,
      findUnique: mocks.findUnique,
      findFirst: mocks.findFirst,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET as GET_ALL } from "@/app/api/staff/route";
import { GET as GET_ONE } from "@/app/api/staff/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Staff API Security", () => {
  describe("GET /api/staff", () => {
    it("allows access to unauthenticated users but filters PII and inactive", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findMany.mockResolvedValue([]);

      const response = await GET_ALL(new NextRequest("http://localhost:3000/api/staff"));
      expect(response.status).toBe(200);

      const callArgs = mocks.findMany.mock.calls[0][0] as any;
      expect(callArgs.where.isActive).toBe(true);
      expect(callArgs.select).toBeDefined();
      expect(callArgs.select.phone).toBeUndefined();
      expect(callArgs.select.name).toBe(true);
    });

    it("allows full access to admin users", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([]);

      const response = await GET_ALL(new NextRequest("http://localhost:3000/api/staff"));
      expect(response.status).toBe(200);

      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: undefined,
        })
      );
    });
  });

  describe("GET /api/staff/[id]", () => {
    it("hides PII (phone) and inactive staff from unauthenticated users", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findFirst.mockResolvedValue(null); // Simulate inactive or not found

      const response = await GET_ONE(
        new NextRequest("http://localhost:3000/api/staff/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ id: "1", isActive: true }),
        })
      );
    });

    it("allows admin to see inactive staff and PII", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findFirst.mockResolvedValue({ id: "1", name: "John", phone: "123", isActive: false });

      const response = await GET_ONE(
        new NextRequest("http://localhost:3000/api/staff/1"),
        { params: Promise.resolve({ id: "1" }) }
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.phone).toBe("123");
      expect(mocks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "1" },
          select: undefined
        })
      );
    });
  });
});

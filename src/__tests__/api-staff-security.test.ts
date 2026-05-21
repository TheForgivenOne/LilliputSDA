import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  findUnique: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    staff: {
      findMany: mocks.findMany,
      findUnique: mocks.findUnique,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET as GET_MANY } from "@/app/api/staff/route";
import { GET as GET_ONE } from "@/app/api/staff/[id]/route";

function createRequest(url: string): NextRequest {
  return new NextRequest(url);
}

describe("Staff API Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/staff", () => {
    it("hides phone and inactive staff for public users", async () => {
      mocks.auth.auth.mockResolvedValue(null); // Public user
      mocks.findMany.mockResolvedValue([
        { id: "1", name: "John", isActive: true },
      ]);

      const request = createRequest("http://localhost:3000/api/staff");
      await GET_MANY(request);

      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
          select: expect.objectContaining({
            phone: false,
          }),
        })
      );
    });

    it("shows phone and all staff for admins", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([
        { id: "1", name: "John", isActive: true, phone: "123" },
        { id: "2", name: "Jane", isActive: false, phone: "456" },
      ]);

      const request = createRequest("http://localhost:3000/api/staff");
      await GET_MANY(request);

      expect(mocks.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          select: expect.objectContaining({
            phone: true,
          }),
        })
      );
    });
  });

  describe("GET /api/staff/[id]", () => {
    it("hides phone for public users", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findUnique.mockResolvedValue({ id: "1", name: "John", isActive: true });

      const request = createRequest("http://localhost:3000/api/staff/1");
      await GET_ONE(request, { params: Promise.resolve({ id: "1" }) });

      expect(mocks.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            phone: false,
          }),
        })
      );
    });

    it("returns 404 for inactive staff if not admin", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findUnique.mockResolvedValue({ id: "1", name: "John", isActive: false });

      const request = createRequest("http://localhost:3000/api/staff/1");
      const response = await GET_ONE(request, { params: Promise.resolve({ id: "1" }) });

      expect(response.status).toBe(404);
    });

    it("allows admin to see inactive staff with phone", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      const inactiveStaff = { id: "1", name: "John", isActive: false, phone: "123" };
      mocks.findUnique.mockResolvedValue(inactiveStaff);

      const request = createRequest("http://localhost:3000/api/staff/1");
      const response = await GET_ONE(request, { params: Promise.resolve({ id: "1" }) });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(inactiveStaff);
      expect(mocks.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            phone: true,
          }),
        })
      );
    });
  });
});

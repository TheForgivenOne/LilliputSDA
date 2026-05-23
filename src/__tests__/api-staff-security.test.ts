import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  findFirst: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    staff: {
      findMany: mocks.findMany,
      findFirst: mocks.findFirst,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET as GET_MANY } from "@/app/api/staff/route";
import { GET as GET_ONE } from "@/app/api/staff/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Staff API Security", () => {
  const mockStaff = {
    id: "1",
    name: "John Doe",
    phone: "123-456-7890",
    isActive: true,
  };

  const mockInactiveStaff = {
    id: "2",
    name: "Jane Doe",
    phone: "098-765-4321",
    isActive: false,
  };

  describe("GET /api/staff", () => {
    it("returns all fields including phone for admin", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([mockStaff, mockInactiveStaff]);

      const response = await GET_MANY(new NextRequest("http://localhost:3000/api/staff"));
      const body = await response.json();

      expect(body).toHaveLength(2);
      expect(body[0]).toHaveProperty("phone");
      expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {},
        select: undefined
      }));
    });

    it("excludes phone and inactive staff for non-admin", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
      mocks.findMany.mockResolvedValue([
        { id: "1", name: "John Doe", isActive: true }
      ]);

      const response = await GET_MANY(new NextRequest("http://localhost:3000/api/staff"));
      const body = await response.json();

      expect(body).toHaveLength(1);
      expect(body[0]).not.toHaveProperty("phone");

      const callArgs = mocks.findMany.mock.calls[0][0];
      expect(callArgs.where).toEqual({ isActive: true });
      expect(callArgs.select).toBeDefined();
      expect(callArgs.select.phone).toBeUndefined();
      expect(callArgs.select.id).toBe(true);
    });

    it("excludes phone and inactive staff for unauthenticated users", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      mocks.findMany.mockResolvedValue([
        { id: "1", name: "John Doe", isActive: true }
      ]);

      const response = await GET_MANY(new NextRequest("http://localhost:3000/api/staff"));
      const body = await response.json();

      expect(body).toHaveLength(1);
      expect(body[0]).not.toHaveProperty("phone");

      const callArgs = mocks.findMany.mock.calls[0][0];
      expect(callArgs.where).toEqual({ isActive: true });
      expect(callArgs.select).toBeDefined();
      expect(callArgs.select.phone).toBeUndefined();
    });
  });

  describe("GET /api/staff/[id]", () => {
    const params = Promise.resolve({ id: "1" });

    it("returns all fields including phone for admin", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findFirst.mockResolvedValue(mockStaff);

      const response = await GET_ONE(
        new NextRequest("http://localhost:3000/api/staff/1"),
        { params }
      );
      const body = await response.json();

      expect(body).toHaveProperty("phone");
      expect(mocks.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "1" },
        select: undefined
      }));
    });

    it("excludes phone for non-admin", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
      mocks.findFirst.mockResolvedValue({ id: "1", name: "John Doe", isActive: true });

      const response = await GET_ONE(
        new NextRequest("http://localhost:3000/api/staff/1"),
        { params }
      );
      const body = await response.json();

      expect(body).not.toHaveProperty("phone");

      const callArgs = mocks.findFirst.mock.calls[0][0];
      expect(callArgs.where).toEqual({ id: "1", isActive: true });
      expect(callArgs.select).toBeDefined();
      expect(callArgs.select.phone).toBeUndefined();
    });

    it("returns 404 for inactive staff when requested by non-admin", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
      mocks.findFirst.mockResolvedValue(null);

      const response = await GET_ONE(
        new NextRequest("http://localhost:3000/api/staff/2"),
        { params: Promise.resolve({ id: "2" }) }
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe("Staff not found");
      expect(mocks.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "2", isActive: true }
      }));
    });
  });
});

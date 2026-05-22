import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

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

import { GET as GET_ALL } from "@/app/api/staff/route";
import { GET as GET_ONE } from "@/app/api/staff/[id]/route";

function createRequest(url: string): NextRequest {
  return new NextRequest(url);
}

describe("Staff API Security", () => {
  const mockStaffFull = {
    id: "staff-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    isActive: true,
  };

  const mockStaffPublic = {
    id: "staff-1",
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    // phone is missing
  };

  const mockInactiveStaffFull = {
    id: "staff-2",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "098-765-4321",
    isActive: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/staff (List)", () => {
    it("should allow admins to see all staff including phone numbers", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findMany.mockResolvedValue([mockStaffFull, mockInactiveStaffFull]);

      const request = createRequest("http://localhost:3000/api/staff");
      const response = await GET_ALL(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].phone).toBeDefined();
      expect(data[1].isActive).toBe(false);
    });

    it("should allow public access but hide phone numbers and inactive staff", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      // Simulate Prisma filtering
      mocks.findMany.mockImplementation((args) => {
          if (args.where.isActive === true && args.select.phone === false) {
              return Promise.resolve([mockStaffPublic]);
          }
          return Promise.resolve([mockStaffFull]);
      });

      const request = createRequest("http://localhost:3000/api/staff");
      const response = await GET_ALL(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].phone).toBeUndefined();

      expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
          select: expect.objectContaining({ phone: false })
      }));
    });
  });

  describe("GET /api/staff/[id] (Single)", () => {
    it("should allow admins to see full staff details", async () => {
      mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
      mocks.findUnique.mockResolvedValue(mockStaffFull);

      const request = createRequest("http://localhost:3000/api/staff/staff-1");
      const response = await GET_ONE(request, { params: Promise.resolve({ id: "staff-1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.phone).toBeDefined();
    });

    it("should hide phone numbers from public for a single staff member", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      // Simulate Prisma filtering
      mocks.findUnique.mockImplementation((args) => {
        if (args.select?.phone === false) {
            return Promise.resolve(mockStaffPublic);
        }
        return Promise.resolve(mockStaffFull);
      });

      const request = createRequest("http://localhost:3000/api/staff/staff-1");
      const response = await GET_ONE(request, { params: Promise.resolve({ id: "staff-1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.phone).toBeUndefined();
      expect(mocks.findUnique).toHaveBeenCalledWith(expect.objectContaining({
          select: expect.objectContaining({ phone: false })
      }));
    });

    it("should hide inactive staff from public", async () => {
      mocks.auth.auth.mockResolvedValue(null);
      // Even if findUnique returns it (it shouldn't if select is used correctly, but we check logic)
      mocks.findUnique.mockResolvedValue(mockInactiveStaffFull);

      const request = createRequest("http://localhost:3000/api/staff/staff-2");
      const response = await GET_ONE(request, { params: Promise.resolve({ id: "staff-2" }) });

      expect(response.status).toBe(404);
    });
  });
});

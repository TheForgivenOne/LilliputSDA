import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  findFirst: vi.fn(),
  create: vi.fn(),
  limit: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    announcement: {
      findMany: mocks.findMany,
      findFirst: mocks.findFirst,
      create: mocks.create,
    },
  },
}));

vi.mock("@/lib/rate-limit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/rate-limit")>();
  return {
    ...actual,
    checkRateLimit: mocks.limit,
    getClientIP: vi.fn().mockReturnValue("127.0.0.1"),
  };
});

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/announcements/route";
import { GET as GET_ID } from "@/app/api/announcements/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
  mocks.limit.mockResolvedValue({ success: true });
});

describe("GET /api/announcements", () => {
  it("returns announcements for admin", async () => {
    const announcements = [{ id: "1", title: "Test" }];
    mocks.findMany.mockResolvedValue(announcements);

    const response = await GET(new NextRequest("http://localhost:3000/api/announcements"));
    const body = await response.json();

    expect(body).toEqual(announcements);
    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.not.objectContaining({ OR: expect.anything() }),
      })
    );
  });

  it("filters out expired announcements for non-admins", async () => {
    mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
    mocks.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost:3000/api/announcements"));

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: expect.any(Date) } }
          ],
        }),
      })
    );
  });

  it("applies rate limiting", async () => {
    mocks.limit.mockResolvedValue({ success: false });

    const response = await GET(new NextRequest("http://localhost:3000/api/announcements"));

    expect(response.status).toBe(429);
  });

  it("filters by pinned when query param is true", async () => {
    mocks.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost:3000/api/announcements?pinned=true"));

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isPinned: true }),
      })
    );
  });

  it("limits results when limit param is provided", async () => {
    mocks.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost:3000/api/announcements?limit=5"));

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    );
  });
});

describe("GET /api/announcements/[id]", () => {
  it("returns announcement for admin", async () => {
    const announcement = { id: "1", title: "Test" };
    mocks.findFirst.mockResolvedValue(announcement);

    const response = await GET_ID(
      new NextRequest("http://localhost:3000/api/announcements/1"),
      { params: Promise.resolve({ id: "1" }) }
    );
    const body = await response.json();

    expect(body).toEqual(announcement);
    expect(mocks.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "1" },
      })
    );
  });

  it("enforces expiration check for non-admins", async () => {
    mocks.auth.auth.mockResolvedValue({ user: { role: "user" } });
    mocks.findFirst.mockResolvedValue(null);

    const response = await GET_ID(
      new NextRequest("http://localhost:3000/api/announcements/1"),
      { params: Promise.resolve({ id: "1" }) }
    );

    expect(response.status).toBe(404);
    expect(mocks.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "1",
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: expect.any(Date) } }
          ],
        }),
      })
    );
  });
});

describe("POST /api/announcements", () => {
  it("creates an announcement with defaults", async () => {
    mocks.create.mockResolvedValue({ id: "1", title: "Test", content: "Content" });

    const request = new NextRequest("http://localhost:3000/api/announcements", {
      method: "POST",
      body: JSON.stringify({ title: "Test", content: "Content" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(201);
  });

  it("returns 401 when not authenticated", async () => {
    mocks.auth.auth.mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/announcements", {
      method: "POST",
      body: JSON.stringify({ title: "Test", content: "Content" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(401);
  });
});

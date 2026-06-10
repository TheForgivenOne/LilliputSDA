import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  libAuth: { getUserRole: vi.fn() },
  findMany: vi.fn(),
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  create: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/auth")>()),
  getUserRole: mocks.libAuth.getUserRole,
  adminGuard: (await importOriginal<typeof import("@/lib/auth")>()).adminGuard,
}));
vi.mock("@/lib/db", () => ({
  prisma: {
    announcement: {
      findMany: mocks.findMany,
      findUnique: mocks.findUnique,
      findFirst: mocks.findFirst,
      create: mocks.create,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/announcements/route";
import { GET as GET_ONE } from "@/app/api/announcements/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
  mocks.libAuth.getUserRole.mockResolvedValue("admin");
});

describe("GET /api/announcements", () => {
  it("returns announcements", async () => {
    const announcements = [{ id: "1", title: "Test" }];
    mocks.findMany.mockResolvedValue(announcements);

    const response = await GET(new NextRequest("http://localhost:3000/api/announcements"));
    const body = await response.json();

    expect(body).toEqual(announcements);
  });

  it("filters by pinned when query param is true", async () => {
    mocks.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost:3000/api/announcements?pinned=true"));

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPinned: true },
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

  it("returns 500 on database error", async () => {
    mocks.findMany.mockRejectedValue(new Error("DB error"));

    const response = await GET(new NextRequest("http://localhost:3000/api/announcements"));

    expect(response.status).toBe(500);
  });

  it("filters out expired announcements for non-admins", async () => {
    mocks.auth.auth.mockResolvedValue(null); // Unauthenticated
    mocks.libAuth.getUserRole.mockResolvedValue(null);
    mocks.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost:3000/api/announcements"));

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: expect.any(Date) } },
          ],
        }),
      })
    );
  });

  it("does not filter expired announcements for admins", async () => {
    mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
    mocks.libAuth.getUserRole.mockResolvedValue("admin");
    mocks.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost:3000/api/announcements"));

    // For admins, it should not have the expiration filter
    const callArgs = mocks.findMany.mock.calls[0][0];
    expect(callArgs.where.OR).toBeUndefined();
  });
});

describe("GET /api/announcements/[id]", () => {
  it("hides expired announcement from non-admins", async () => {
    mocks.auth.auth.mockResolvedValue(null);
    mocks.libAuth.getUserRole.mockResolvedValue(null);
    // Prisma would return null if it doesn't match the criteria (including expiration check)
    // We expect the route to use findFirst with the filter
    mocks.findFirst.mockResolvedValue(null);

    const response = await GET_ONE(
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
            { expiresAt: { gt: expect.any(Date) } },
          ],
        }),
      })
    );
  });

  it("shows expired announcement to admins", async () => {
    mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
    mocks.libAuth.getUserRole.mockResolvedValue("admin");
    const announcement = { id: "1", title: "Expired", expiresAt: new Date(Date.now() - 1000) };

    // Admin should see it even if expired
    mocks.findFirst.mockResolvedValue(announcement);

    const response = await GET_ONE(
      new NextRequest("http://localhost:3000/api/announcements/1"),
      { params: Promise.resolve({ id: "1" }) }
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expect.objectContaining({ id: "1" }));
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

  it("returns 400 when title is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/announcements", {
      method: "POST",
      body: JSON.stringify({ content: "Content" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
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

  it("returns 500 on database error", async () => {
    mocks.create.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost:3000/api/announcements", {
      method: "POST",
      body: JSON.stringify({ title: "Test", content: "Content" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});

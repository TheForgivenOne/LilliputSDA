import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  create: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    announcement: {
      findMany: mocks.findMany,
      create: mocks.create,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/announcements/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
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

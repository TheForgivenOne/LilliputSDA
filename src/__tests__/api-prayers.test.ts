import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  create: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    prayerRequest: {
      findMany: mocks.findMany,
      create: mocks.create,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/prayers/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
});

describe("GET /api/prayers", () => {
  it("returns prayer requests", async () => {
    const prayers = [{ id: "1", name: "John" }];
    mocks.findMany.mockResolvedValue(prayers);

    const response = await GET(new NextRequest("http://localhost:3000/api/prayers"));
    const body = await response.json();

    expect(body).toEqual(prayers);
  });

  it("filters by public and unanswered when public=true", async () => {
    mocks.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost:3000/api/prayers?public=true"));

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPublic: true, isAnswered: false },
      })
    );
  });

  it("returns 401 when not authenticated", async () => {
    mocks.auth.auth.mockResolvedValue(null);

    const response = await GET(new NextRequest("http://localhost:3000/api/prayers"));
    expect(response.status).toBe(401);
  });
});

describe("POST /api/prayers", () => {
  it("creates a prayer request", async () => {
    mocks.create.mockResolvedValue({ id: "1", name: "John", request: "Pray for me" });

    const request = new NextRequest("http://localhost:3000/api/prayers", {
      method: "POST",
      body: JSON.stringify({ name: "John", request: "Pray for me" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(201);
  });

  it("returns 400 when name is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/prayers", {
      method: "POST",
      body: JSON.stringify({ request: "Pray for me" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 when name is too long", async () => {
    const request = new NextRequest("http://localhost:3000/api/prayers", {
      method: "POST",
      body: JSON.stringify({ name: "a".repeat(201), request: "Pray for me" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 when request is too long", async () => {
    const request = new NextRequest("http://localhost:3000/api/prayers", {
      method: "POST",
      body: JSON.stringify({ name: "John", request: "a".repeat(2001) }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 500 on database error", async () => {
    mocks.create.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost:3000/api/prayers", {
      method: "POST",
      body: JSON.stringify({ name: "John", request: "Pray for me" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  create: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    event: {
      findMany: mocks.findMany,
      create: mocks.create,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/events/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
});

describe("GET /api/events", () => {
  it("returns events", async () => {
    const events = [{ id: "1", title: "Event" }];
    mocks.findMany.mockResolvedValue(events);

    const response = await GET(new NextRequest("http://localhost:3000/api/events"));
    const body = await response.json();

    expect(body).toEqual(events);
  });

  it("filters upcoming events when query param is true", async () => {
    mocks.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost:3000/api/events?upcoming=true"));

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { startDate: { gte: expect.any(Date) } },
      })
    );
  });

  it("respects limit query parameter", async () => {
    mocks.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost:3000/api/events?limit=3"));

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 3 })
    );
  });

  it("returns 500 on database error", async () => {
    mocks.findMany.mockRejectedValue(new Error("DB error"));

    const response = await GET(new NextRequest("http://localhost:3000/api/events"));
    expect(response.status).toBe(500);
  });
});

describe("POST /api/events", () => {
  it("creates an event", async () => {
    mocks.create.mockResolvedValue({ id: "1", title: "Event" });

    const request = new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      body: JSON.stringify({ title: "Event", startDate: "2024-01-01" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(201);
  });

  it("returns 400 when title is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      body: JSON.stringify({ startDate: "2024-01-01" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns 401 when not authenticated", async () => {
    mocks.auth.auth.mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      body: JSON.stringify({ title: "Event", startDate: "2024-01-01" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it("returns 500 on database error", async () => {
    mocks.create.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      body: JSON.stringify({ title: "Event", startDate: "2024-01-01" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});

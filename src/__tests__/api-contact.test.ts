import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findMany: vi.fn(),
  create: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    contactSubmission: {
      findMany: mocks.findMany,
      findUnique: mocks.findUnique,
      create: mocks.create,
      update: mocks.update,
      delete: mocks.delete,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/contact/route";

function createRequest(url: string, init?: Record<string, string | Record<string, string>>): NextRequest {
  return new NextRequest(url, JSON.parse(JSON.stringify(init ?? {})));
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
});

describe("GET /api/contact", () => {
  it("returns contact submissions", async () => {
    const submissions = [{ id: "1", name: "John", email: "john@test.com" }];
    mocks.findMany.mockResolvedValue(submissions);

    const request = createRequest("http://localhost:3000/api/contact");
    const response = await GET(request);
    const body = await response.json();

    expect(body).toEqual(submissions);
    expect(response.status).toBe(200);
  });

  it("filters by unread when query param is true", async () => {
    mocks.findMany.mockResolvedValue([]);

    const request = createRequest("http://localhost:3000/api/contact?unread=true");
    await GET(request);

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isRead: false },
      })
    );
  });

  it("returns 401 when not authenticated", async () => {
    mocks.auth.auth.mockResolvedValue(null);

    const request = createRequest("http://localhost:3000/api/contact");
    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it("returns 500 on database error", async () => {
    mocks.findMany.mockRejectedValue(new Error("DB error"));

    const request = createRequest("http://localhost:3000/api/contact");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Failed to fetch submissions" });
  });
});

describe("POST /api/contact", () => {
  it("creates a contact submission", async () => {
    const submission = { id: "1", name: "John", email: "john@test.com", message: "Hello" };
    mocks.create.mockResolvedValue(submission);

    const request = createRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "John", email: "john@test.com", message: "Hello" }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(body).toEqual(submission);
    expect(response.status).toBe(201);
  });

  it("returns 400 when name is missing", async () => {
    const request = createRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({ email: "john@test.com", message: "Hello" }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Name, email, and message are required" });
  });

  it("returns 400 when email is missing", async () => {
    const request = createRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "John", message: "Hello" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns 400 when name is too long", async () => {
    const request = createRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "a".repeat(201),
        email: "john@test.com",
        message: "Hello",
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid email", async () => {
    const request = createRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "John", email: "invalid", message: "Hello" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns 400 when message is too long", async () => {
    const request = createRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "John",
        email: "john@test.com",
        message: "a".repeat(5001),
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns 500 on database error", async () => {
    mocks.create.mockRejectedValue(new Error("DB error"));

    const request = createRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "John", email: "john@test.com", message: "Hello" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});

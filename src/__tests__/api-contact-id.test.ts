import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { auth: vi.fn() },
  findUnique: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/auth", () => mocks.auth);
vi.mock("@/lib/db", () => ({
  prisma: {
    contactSubmission: {
      findUnique: mocks.findUnique,
      update: mocks.update,
      delete: mocks.delete,
    },
  },
}));

import { NextRequest } from "next/server";
import { GET, PATCH, DELETE } from "@/app/api/contact/[id]/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.auth.mockResolvedValue({ user: { role: "admin" } });
});

function mockParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("GET /api/contact/[id]", () => {
  it("returns a submission by id", async () => {
    const submission = { id: "1", name: "John" };
    mocks.findUnique.mockResolvedValue(submission);

    const response = await GET(new NextRequest("http://localhost:3000/api/contact/1"), mockParams("1"));
    const body = await response.json();

    expect(body).toEqual(submission);
    expect(response.status).toBe(200);
  });

  it("returns 404 when submission not found", async () => {
    mocks.findUnique.mockResolvedValue(null);

    const response = await GET(new NextRequest("http://localhost:3000/api/contact/1"), mockParams("1"));

    expect(response.status).toBe(404);
  });

  it("returns 500 on database error", async () => {
    mocks.findUnique.mockRejectedValue(new Error("DB error"));

    const response = await GET(new NextRequest("http://localhost:3000/api/contact/1"), mockParams("1"));

    expect(response.status).toBe(500);
  });
});

describe("PATCH /api/contact/[id]", () => {
  it("updates a submission", async () => {
    const updated = { id: "1", isRead: true };
    mocks.update.mockResolvedValue(updated);

    const request = new NextRequest("http://localhost:3000/api/contact/1", {
      method: "PATCH",
      body: JSON.stringify({ isRead: true }),
    });
    const response = await PATCH(request, mockParams("1"));
    const body = await response.json();

    expect(body).toEqual(updated);
    expect(response.status).toBe(200);
  });

  it("returns 500 on database error", async () => {
    mocks.update.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost:3000/api/contact/1", {
      method: "PATCH",
      body: JSON.stringify({ isRead: true }),
    });
    const response = await PATCH(request, mockParams("1"));

    expect(response.status).toBe(500);
  });
});

describe("DELETE /api/contact/[id]", () => {
  it("deletes a submission", async () => {
    mocks.delete.mockResolvedValue({ id: "1" });

    const response = await DELETE(new NextRequest("http://localhost:3000/api/contact/1"), mockParams("1"));

    expect(response.status).toBe(200);
  });

  it("returns 500 on database error", async () => {
    mocks.delete.mockRejectedValue(new Error("DB error"));

    const response = await DELETE(new NextRequest("http://localhost:3000/api/contact/1"), mockParams("1"));

    expect(response.status).toBe(500);
  });
});

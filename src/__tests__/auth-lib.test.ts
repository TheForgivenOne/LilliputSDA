import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "@/auth";
import {
  checkRole,
  checkAdmin,
  checkEditor,
  getUserRole,
  adminGuard,
} from "@/lib/auth";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("checkRole", () => {
  it("returns true when user has the matching role", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { role: "admin" },
    } as never);

    const result = await checkRole("admin");
    expect(result).toBe(true);
  });

  it("returns false when user has different role", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { role: "user" },
    } as never);

    const result = await checkRole("admin");
    expect(result).toBe(false);
  });

  it("returns false when no session", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as never);

    const result = await checkRole("admin");
    expect(result).toBe(false);
  });

  it("returns false when user has no role", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: {},
    } as never);

    const result = await checkRole("admin");
    expect(result).toBe(false);
  });
});

describe("checkAdmin", () => {
  it("returns true for admin role", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { role: "admin" },
    } as never);

    expect(await checkAdmin()).toBe(true);
  });

  it("returns false for non-admin role", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { role: "editor" },
    } as never);

    expect(await checkAdmin()).toBe(false);
  });
});

describe("checkEditor", () => {
  it("returns true for editor role", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { role: "editor" },
    } as never);

    expect(await checkEditor()).toBe(true);
  });

  it("returns false for non-editor role", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { role: "admin" },
    } as never);

    expect(await checkEditor()).toBe(false);
  });
});

describe("getUserRole", () => {
  it("returns role string when present", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { role: "admin" },
    } as never);

    expect(await getUserRole()).toBe("admin");
  });

  it("returns null when no session", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as never);

    expect(await getUserRole()).toBeNull();
  });

  it("returns null when role is not a string", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { role: 123 },
    } as never);

    expect(await getUserRole()).toBeNull();
  });
});

describe("adminGuard", () => {
  it("returns null for admin users", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { role: "admin" },
    } as never);

    expect(await adminGuard()).toBeNull();
  });

  it("returns 401 for unauthenticated users", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as never);

    const response = await adminGuard();
    expect(response).not.toBeNull();
    const body = await response!.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("returns 403 for non-admin users", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { role: "user" },
    } as never);

    const response = await adminGuard();
    expect(response).not.toBeNull();
    const body = await response!.json();
    expect(body).toEqual({ error: "Forbidden: admin role required" });
  });
});

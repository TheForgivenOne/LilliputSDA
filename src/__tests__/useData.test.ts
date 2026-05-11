import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchApi, createItem, updateItem, deleteItem } from "@/hooks/useData";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("fetchApi", () => {
  it("fetches data successfully", async () => {
    const data = { id: 1, name: "Test" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await fetchApi<typeof data>("/api/test");
    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith("/api/test", {
      headers: { "Content-Type": "application/json" },
    });
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
      json: () => Promise.resolve({ error: "Resource not found" }),
    });

    await expect(fetchApi("/api/test")).rejects.toThrow("Resource not found");
  });

  it("throws with fallback error message when error body is not JSON", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
      json: () => Promise.reject(new Error("Invalid JSON")),
    });

    await expect(fetchApi("/api/test")).rejects.toThrow("Unknown error");
  });

  it("merges custom headers with defaults", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await fetchApi("/api/test", {
      headers: { Authorization: "Bearer token" },
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/test", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
  });
});

describe("createItem", () => {
  it("sends POST request with data", async () => {
    const newItem = { name: "New Item" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1, ...newItem }),
    });

    const result = await createItem("/api/items", newItem);
    expect(result).toEqual({ id: 1, ...newItem });
    expect(mockFetch).toHaveBeenCalledWith("/api/items", {
      method: "POST",
      body: JSON.stringify(newItem),
      headers: { "Content-Type": "application/json" },
    });
  });
});

describe("updateItem", () => {
  it("sends PATCH request with partial data", async () => {
    const update = { name: "Updated" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1, ...update }),
    });

    const result = await updateItem("/api/items/1", update);
    expect(result).toEqual({ id: 1, ...update });
    expect(mockFetch).toHaveBeenCalledWith("/api/items/1", {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "Content-Type": "application/json" },
    });
  });
});

describe("deleteItem", () => {
  it("sends DELETE request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await deleteItem("/api/items/1");
    expect(mockFetch).toHaveBeenCalledWith("/api/items/1", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("throws on failed delete", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Forbidden",
      json: () => Promise.resolve({ error: "Not allowed" }),
    });

    await expect(deleteItem("/api/items/1")).rejects.toThrow("Not allowed");
  });
});

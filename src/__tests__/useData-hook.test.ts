import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useFetch } from "@/hooks/useData";

describe("useFetch hook", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    globalThis.fetch = mockFetch;
    mockFetch.mockReset();
  });

  it("fetches data on mount and returns it", async () => {
    const data = { id: 1, name: "Test" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const { result } = renderHook(() => useFetch<typeof data>("/api/test"));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(data);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
      json: () => Promise.resolve({ error: "Not found" }),
    });

    const { result } = renderHook(() => useFetch("/api/test"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("uses initialData when provided", () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 2 }),
    });

    const { result } = renderHook(() =>
      useFetch("/api/test", { initialData: { id: 0, name: "initial" } })
    );

    expect(result.current.data).toEqual({ id: 0, name: "initial" });
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(() =>
      useFetch("/api/test", { enabled: false })
    );

    expect(result.current.isLoading).toBe(true);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("refetch works after error", async () => {
    mockFetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      });

    const { result } = renderHook(() => useFetch("/api/test"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => expect(result.current.error).toBeNull());
    expect(result.current.data).toEqual({ id: 1 });
  });

  it("handles network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetch("/api/test"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Network error");
  });

  it("handles non-Error thrown value", async () => {
    mockFetch.mockRejectedValueOnce("string error");

    const { result } = renderHook(() => useFetch("/api/test"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Unknown error");
  });
});

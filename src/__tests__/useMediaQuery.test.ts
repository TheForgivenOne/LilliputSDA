import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

describe("useMediaQuery", () => {
  const originalWindow = globalThis.window;
  let listeners: Array<() => void>;

  beforeEach(() => {
    listeners = [];
    globalThis.window = originalWindow;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(min-width: 768px)",
      media: query,
      addEventListener: (_event: string, handler: () => void) => {
        listeners.push(handler);
      },
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns true when query matches", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("returns false when query does not match", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));
    expect(result.current).toBe(false);
  });

  it("handles change events", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);

    act(() => {
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
        media: "(min-width: 768px)",
        addEventListener: (_event: string, handler: () => void) => {
          listeners.push(handler);
        },
        removeEventListener: vi.fn(),
      }));
      listeners.forEach((fn) => fn());
    });
  });
});

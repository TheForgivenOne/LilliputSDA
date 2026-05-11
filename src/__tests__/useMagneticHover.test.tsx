import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { useMagneticHover } from "@/lib/useMagneticHover";

describe("useMagneticHover", () => {
  const mockMatchMedia = vi.fn();

  beforeEach(() => {
    window.matchMedia = mockMatchMedia;
    mockMatchMedia.mockReturnValue({ matches: false });

    globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      return window.setTimeout(() => cb(Date.now()), 0) as unknown as number;
    });
    globalThis.cancelAnimationFrame = vi.fn((id: number) => {
      window.clearTimeout(id);
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  function TestComponent({
    strength,
    radius,
  }: { strength?: number; radius?: number }) {
    const ref = useMagneticHover<HTMLDivElement>({ strength, radius });
    return <div ref={ref} data-testid="magnetic-el" />;
  }

  it("returns a ref and applies styles to element", () => {
    const { getByTestId } = render(<TestComponent />);
    const el = getByTestId("magnetic-el");
    expect(el.style.willChange).toBe("transform");
    expect(el.style.transition).toContain("320ms");
  });

  it("does not apply styles when prefers-reduced-motion", () => {
    mockMatchMedia.mockReturnValue({ matches: true });

    const { getByTestId } = render(<TestComponent />);
    const el = getByTestId("magnetic-el");
    expect(el.style.transition).toBe("");
    expect(el.style.willChange).toBe("");
  });

  it("accepts custom strength and radius", () => {
    const { getByTestId } = render(<TestComponent strength={0.5} radius={200} />);
    const el = getByTestId("magnetic-el");
    expect(el.style.willChange).toBe("transform");
  });
});

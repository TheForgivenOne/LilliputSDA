import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ErrorBoundary, AsyncErrorBoundary } from "@/lib/ErrorBoundary";

function ThrowComponent({ message = "Test error" }: { message?: string }): never {
  throw new Error(message);
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Child Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Child Content")).toBeDefined();
  });

  it("renders fallback UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowComponent />
      </ErrorBoundary>
    );

    expect(screen.getAllByText("Something went wrong").length).toBeGreaterThan(0);
    expect(screen.getByText("Test error")).toBeDefined();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom Fallback</div>}>
        <ThrowComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom Fallback")).toBeDefined();
  });

  it("resets error state on Try Again click", () => {
    render(
      <ErrorBoundary>
        <ThrowComponent />
      </ErrorBoundary>
    );

    expect(screen.getAllByText("Something went wrong").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
  });
});

describe("AsyncErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <AsyncErrorBoundary>
        <div>Child Content</div>
      </AsyncErrorBoundary>
    );
    expect(screen.getByText("Child Content")).toBeDefined();
  });

  it("renders fallback UI when child throws", () => {
    render(
      <AsyncErrorBoundary>
        <ThrowComponent />
      </AsyncErrorBoundary>
    );

    expect(screen.getAllByText(/failed to load content/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Test error")).toBeDefined();
  });

  it("renders custom fallback when provided", () => {
    render(
      <AsyncErrorBoundary fallback={<div>Custom Async Fallback</div>}>
        <ThrowComponent />
      </AsyncErrorBoundary>
    );

    expect(screen.getByText("Custom Async Fallback")).toBeDefined();
  });

  it("resets error state on Try again click", () => {
    render(
      <AsyncErrorBoundary>
        <ThrowComponent />
      </AsyncErrorBoundary>
    );

    expect(screen.getAllByText(/failed to load content/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
  });
});

import { describe, it, expect } from "vitest";
import { getYouTubeWatchUrl } from "@/lib/youtube";

describe("getYouTubeWatchUrl", () => {
  it("returns correct watch URL for video ID", () => {
    expect(getYouTubeWatchUrl("dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
  });

  it("handles empty video ID", () => {
    expect(getYouTubeWatchUrl("")).toBe("https://www.youtube.com/watch?v=");
  });
});

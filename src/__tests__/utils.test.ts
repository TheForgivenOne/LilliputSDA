import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cn,
  debounce,
  throttle,
  truncateText,
  getYouTubeId,
  getYouTubeThumbnail,
  decodeHtmlEntities,
  getDirection,
  isRTL,
  pluralize,
  getInitials,
  sanitizeInput,
  getPlaceholderImage,
  getChurchImage,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names with clsx and tailwind-merge", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("delays function execution", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("cancels previous calls on new invocation", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passes arguments to the original function", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("arg1", 42);
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith("arg1", 42);
  });
});

describe("throttle", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("calls function immediately on first invocation", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("skips calls within the window", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("calls again after window expires", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("passes arguments to the original function", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled("test", 123);
    expect(fn).toHaveBeenCalledWith("test", 123);
  });
});

describe("truncateText", () => {
  it("returns full text when shorter than maxLength", () => {
    expect(truncateText("Hello", 10)).toBe("Hello");
  });

  it("truncates and appends ellipsis when text exceeds maxLength", () => {
    expect(truncateText("Hello World", 5)).toBe("Hello...");
  });

  it("trims trailing whitespace before ellipsis", () => {
    expect(truncateText("Hello World!", 5)).toBe("Hello...");
  });

  it("handles empty string", () => {
    expect(truncateText("", 5)).toBe("");
  });

  it("handles exact match", () => {
    expect(truncateText("Hello", 5)).toBe("Hello");
  });
});

describe("getYouTubeId", () => {
  it("extracts ID from youtube.com/watch?v= URL", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from youtu.be/ URL", () => {
    expect(getYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from youtube.com/embed/ URL", () => {
    expect(getYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from URLs with extra params", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120s")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for invalid URLs", () => {
    expect(getYouTubeId("not-a-url")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(getYouTubeId("")).toBeNull();
  });
});

describe("getYouTubeThumbnail", () => {
  it("returns high quality thumbnail by default", () => {
    expect(getYouTubeThumbnail("dQw4w9WgXcQ")).toBe(
      "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    );
  });

  it("returns specified quality thumbnail", () => {
    expect(getYouTubeThumbnail("dQw4w9WgXcQ", "max")).toBe(
      "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
    );
  });

  it("returns default quality thumbnail", () => {
    expect(getYouTubeThumbnail("dQw4w9WgXcQ", "default")).toBe(
      "https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg"
    );
  });

  it("returns medium quality thumbnail", () => {
    expect(getYouTubeThumbnail("dQw4w9WgXcQ", "medium")).toBe(
      "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
    );
  });
});

describe("decodeHtmlEntities", () => {
  it("decodes HTML entities in server environment", () => {
    expect(decodeHtmlEntities("&amp; &lt; &gt; &quot; &#39; &apos;")).toBe("& < > \" ' '");
  });

  it("decodes &nbsp; entity", () => {
    expect(decodeHtmlEntities("Hello&nbsp;World")).toBe("Hello\u00a0World");
  });

  it("decodes &#x27; entity", () => {
    expect(decodeHtmlEntities("it&#x27;s")).toBe("it's");
  });

  it("returns plain text unchanged", () => {
    expect(decodeHtmlEntities("Hello World")).toBe("Hello World");
  });

  it("handles empty string", () => {
    expect(decodeHtmlEntities("")).toBe("");
  });
});

describe("getDirection and isRTL", () => {
  it("returns ltr for undefined locale", () => {
    expect(getDirection()).toBe("ltr");
  });

  it("returns rtl for Arabic", () => {
    expect(getDirection("ar")).toBe("rtl");
  });

  it("returns rtl for Hebrew", () => {
    expect(getDirection("he")).toBe("rtl");
  });

  it("returns ltr for English", () => {
    expect(getDirection("en")).toBe("ltr");
  });

  it("isRTL returns false for English", () => {
    expect(isRTL("en")).toBe(false);
  });

  it("isRTL returns true for Arabic", () => {
    expect(isRTL("ar")).toBe(true);
  });
});

describe("pluralize", () => {
  it("returns singular for count 1", () => {
    expect(pluralize(1, "item")).toBe("item");
  });

  it("returns plural for count > 1", () => {
    expect(pluralize(2, "item")).toBe("items");
  });

  it("returns custom plural when provided", () => {
    expect(pluralize(2, "child", "children")).toBe("children");
  });

  it("returns zero text for count 0 when zero parameter provided", () => {
    expect(pluralize(0, "item", "items", "no items")).toBe("no items");
  });

  it("returns plural for count 0 without zero parameter", () => {
    expect(pluralize(0, "item")).toBe("items");
  });
});

describe("getInitials", () => {
  it("returns initials for full name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("handles single name", () => {
    expect(getInitials("John")).toBe("JO");
  });

  it("handles empty string", () => {
    expect(getInitials("")).toBe("?");
  });

  it("handles whitespace-only string", () => {
    expect(getInitials("   ")).toBe("?");
  });

  it("returns first and last initial only (maxLength doesn't add more initials)", () => {
    expect(getInitials("John Michael Doe", 3)).toBe("JD");
  });

  it("defaults to 2 characters", () => {
    expect(getInitials("John Michael Doe")).toBe("JD");
  });

  it("handles hyphenated names", () => {
    expect(getInitials("Jean-Pierre")).toBe("JE");
  });
});

describe("sanitizeInput", () => {
  it("trims whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("removes control characters", () => {
    expect(sanitizeInput("hello\x00world")).toBe("helloworld");
  });

  it("truncates to maxLength when specified", () => {
    expect(sanitizeInput("hello world", 5)).toBe("hello");
  });

  it("returns full string when within maxLength", () => {
    expect(sanitizeInput("hello", 10)).toBe("hello");
  });

  it("handles empty string", () => {
    expect(sanitizeInput("")).toBe("");
  });
});

describe("getPlaceholderImage", () => {
  it("returns church image URL for known text keys", () => {
    const url = getPlaceholderImage(800, 600, "Church+Building");
    expect(url).toContain("/images/logos/current-church.png");
  });

  it("returns placehold.co URL for unknown text", () => {
    const url = getPlaceholderImage(800, 600, "Some+Custom+Text");
    expect(url).toContain("placehold.co");
    expect(url).toContain("800x600");
  });

  it("returns placehold.co with dimensions when no text", () => {
    const url = getPlaceholderImage(400, 300);
    expect(url).toContain("placehold.co");
    expect(url).toContain("400x300");
  });
});

describe("getChurchImage", () => {
  it("returns church building image", () => {
    expect(getChurchImage("churchBuilding")).toContain("/images/logos/current-church.png");
  });

  it("returns placeholder for unknown key", () => {
    const result = getChurchImage("sermon" as const);
    expect(result).toContain("unsplash");
  });

  it("returns congregation main image", () => {
    const result = getChurchImage("main" as const);
    expect(result).toContain("unsplash");
  });
});

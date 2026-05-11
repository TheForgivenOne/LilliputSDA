import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validateRequired,
  validatePhone,
  validateForm,
} from "@/lib/validation";

describe("validateEmail", () => {
  it("returns true for valid email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });

  it("returns true for email with subdomain", () => {
    expect(validateEmail("user@sub.example.com")).toBe(true);
  });

  it("returns false for email without @", () => {
    expect(validateEmail("invalid")).toBe(false);
  });

  it("returns false for email without domain", () => {
    expect(validateEmail("user@")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(validateEmail("")).toBe(false);
  });

  it("returns false for email with spaces", () => {
    expect(validateEmail("user @example.com")).toBe(false);
  });
});

describe("validateRequired", () => {
  it("returns true for non-empty string", () => {
    expect(validateRequired("hello")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(validateRequired("")).toBe(false);
  });

  it("returns false for whitespace-only string", () => {
    expect(validateRequired("   ")).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(validateRequired(undefined as unknown as string)).toBe(false);
  });

  it("returns false when string exceeds maxLength", () => {
    expect(validateRequired("hello world", 5)).toBe(false);
  });

  it("returns true when string is within maxLength", () => {
    expect(validateRequired("hello", 10)).toBe(true);
  });
});

describe("validatePhone", () => {
  it("returns true for valid US phone number", () => {
    expect(validatePhone("+1 (555) 123-4567")).toBe(true);
  });

  it("returns true for phone with dashes", () => {
    expect(validatePhone("555-123-4567")).toBe(true);
  });

  it("returns true for phone with spaces", () => {
    expect(validatePhone("555 123 4567")).toBe(true);
  });

  it("returns false for too short number", () => {
    expect(validatePhone("123")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(validatePhone("")).toBe(false);
  });

  it("returns false for alphabetic input", () => {
    expect(validatePhone("abc")).toBe(false);
  });
});

describe("validateForm", () => {
  it("returns empty errors for valid data", () => {
    const rules = {
      email: [{ validate: (v: unknown) => validateEmail(String(v)), message: "Invalid email" }],
      name: [{ validate: (v: unknown) => validateRequired(String(v)), message: "Name required" }],
    };

    const errors = validateForm({ email: "test@example.com", name: "John" }, rules);
    expect(errors).toEqual({});
  });

  it("returns errors for invalid data", () => {
    const rules = {
      email: [{ validate: (v: unknown) => validateEmail(String(v)), message: "Invalid email" }],
    };

    const errors = validateForm({ email: "invalid" }, rules);
    expect(errors).toEqual({ email: "Invalid email" });
  });

  it("stops at first error per field", () => {
    const rules = {
      name: [
        { validate: (v: unknown) => validateRequired(String(v)), message: "Required" },
        { validate: (v: unknown) => String(v).length > 2, message: "Too short" },
      ],
    };

    const errors = validateForm({ name: "" }, rules);
    expect(errors).toEqual({ name: "Required" });
  });

  it("handles empty rules", () => {
    const errors = validateForm({ name: "John" }, {});
    expect(errors).toEqual({});
  });
});

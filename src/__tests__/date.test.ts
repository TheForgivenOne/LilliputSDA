import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateShort,
  formatTime,
  formatNumber,
  formatCurrency,
} from "@/lib/date";

describe("formatDate", () => {
  it("formats a date string with default locale", () => {
    const result = formatDate("2024-01-15", "en-US");
    expect(result).toContain("Monday");
    expect(result).toContain("January");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("formats a Date object", () => {
    const result = formatDate(new Date(2024, 0, 15), "en-US");
    expect(result).toContain("January");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });
});

describe("formatDateShort", () => {
  it("formats a date in short format", () => {
    const result = formatDateShort("2024-01-15", "en-US");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });
});

describe("formatTime", () => {
  it("formats time from date string", () => {
    const result = formatTime("2024-01-15T14:30:00", "en-US");
    expect(result).toContain("2");
    expect(result).toContain("30");
  });
});

describe("formatNumber", () => {
  it("formats a number with locale separators", () => {
    expect(formatNumber(1234567, "en-US")).toBe("1,234,567");
  });

  it("handles string input", () => {
    expect(formatNumber("1234.56", "en-US")).toBe("1,234.56");
  });

  it("returns original string for NaN", () => {
    expect(formatNumber("not-a-number", "en-US")).toBe("not-a-number");
  });
});

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    const result = formatCurrency(1234.56, "USD", "en-US");
    expect(result).toContain("1,234.56");
  });

  it("formats with specified currency", () => {
    const result = formatCurrency(100, "EUR", "en-US");
    expect(result).toContain("100");
  });

  it("handles zero", () => {
    const result = formatCurrency(0, "USD", "en-US");
    expect(result).toContain("0");
  });
});

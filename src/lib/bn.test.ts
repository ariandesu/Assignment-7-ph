import { describe, expect, it } from "vitest";
import {
  formatBnChange,
  formatBnDate,
  formatBnDecimal,
  formatBnPercent,
  formatBnPrice,
  formatBnTaka,
  toBengaliDigits,
  toEnglishDigits,
  toNumericPrice,
} from "@/lib/bn";

describe("toBengaliDigits", () => {
  it("converts every ASCII digit", () => {
    expect(toBengaliDigits(148)).toBe("১৪৮");
    expect(toBengaliDigits("1850")).toBe("১৮৫০");
    expect(toBengaliDigits("0.25")).toBe("০.২৫");
  });

  it("leaves non-digits untouched", () => {
    expect(toBengaliDigits("১,৮৫০ টাকা")).toBe("১,৮৫০ টাকা");
    expect(toBengaliDigits("abc-12.5%")).toBe("abc-১২.৫%");
  });
});

describe("toEnglishDigits", () => {
  it("is the inverse for digit strings", () => {
    expect(toEnglishDigits("১৪৮")).toBe("148");
    expect(toEnglishDigits("২.১%")).toBe("2.1%");
    expect(toEnglishDigits("১,৮৫০")).toBe("1,850");
  });
});

describe("toNumericPrice", () => {
  it("parses ASCII, Bengali and separator input", () => {
    expect(toNumericPrice("148")).toBe(148);
    expect(toNumericPrice("১,৮৫০")).toBe(1850);
    expect(toNumericPrice("1,850")).toBe(1850);
    expect(toNumericPrice("৬৮.৫০")).toBe(68.5);
    expect(toNumericPrice("১৪৮ টাকা")).toBe(148);
    expect(toNumericPrice("৳ ৯৯")).toBe(99);
    expect(toNumericPrice(2.1)).toBe(2.1);
    expect(toNumericPrice(-12.4)).toBe(-12.4);
  });

  it("returns NaN for non-numeric input", () => {
    expect(toNumericPrice("টাকা")).toBeNaN();
    expect(toNumericPrice("")).toBeNaN();
    expect(toNumericPrice("-")).toBeNaN();
    expect(toNumericPrice("—")).toBeNaN();
  });

  it("supports numeric sorting of Bengali digit strings", () => {
    const prices = ["৯৯", "১,৮৫০", "৩০", "৩৩০"];
    const sorted = [...prices].sort((a, b) => toNumericPrice(a) - toNumericPrice(b));
    expect(sorted).toEqual(["৩০", "৯৯", "৩৩০", "১,৮৫০"]);
  });
});

describe("formatBnPrice", () => {
  it("formats integers with Bengali digits and separators", () => {
    expect(formatBnPrice(148)).toBe("১৪৮");
    expect(formatBnPrice(1850)).toBe("১,৮৫০");
    expect(formatBnPrice(185000)).toBe("১,৮৫,০০০");
    expect(formatBnPrice(0)).toBe("০");
  });

  it("handles invalid input", () => {
    expect(formatBnPrice(NaN)).toBe("—");
  });
});

describe("formatBnDecimal / formatBnTaka / formatBnPercent", () => {
  it("formats fixed decimals in Bengali digits", () => {
    expect(formatBnDecimal(68.5, 2)).toBe("৬৮.৫০");
    expect(formatBnDecimal(63.5, 2)).toBe("৬৩.৫০");
    expect(formatBnDecimal(65.5, 2)).toBe("৬৫.৫০");
  });

  it("formats taka labels", () => {
    expect(formatBnTaka(148)).toBe("১৪৮ টাকা");
    expect(formatBnTaka(1850)).toBe("১,৮৫০ টাকা");
  });

  it("formats percentages with one decimal, magnitude only", () => {
    expect(formatBnPercent(2.1)).toBe("২.১%");
    expect(formatBnPercent(-2.9)).toBe("২.৯%");
    expect(formatBnPercent(0)).toBe("০.০%");
  });
});

describe("formatBnChange", () => {
  it("renders up/down/flat badges per design", () => {
    expect(formatBnChange("up", 2.1)).toBe("▲ ২.১%");
    expect(formatBnChange("down", -2.9)).toBe("▼ ২.৯%");
    expect(formatBnChange("flat", 0)).toBe("— ০.০%");
  });
});

describe("formatBnDate", () => {
  it("renders the Bangla date in design format", () => {
    // 6 October 2026 is a Tuesday; matches the design copy exactly.
    const out = formatBnDate(new Date(2026, 9, 6));
    expect(out).toContain("৬");
    expect(out).toContain("অক্টোবর");
    expect(out).toContain("২০২৬");
  });
});

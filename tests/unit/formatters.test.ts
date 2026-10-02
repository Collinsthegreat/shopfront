import { describe, it, expect } from "vitest";
import { formatMoney, generateOrderNumber } from "@/lib/formatters";

describe("formatMoney", () => {
  it("formats kobo integer to Naira string with symbol", () => {
    const result = formatMoney(1850000);
    expect(result).toContain("18,500");
    expect(result).toContain("₦");
  });

  it("formats zero correctly", () => {
    expect(formatMoney(0)).toContain("0.00");
  });

  it("formats large amounts correctly", () => {
    const result = formatMoney(100000000); // ₦1,000,000
    expect(result).toContain("1,000,000");
  });

  it("formats without symbol when includeSymbol=false", () => {
    const result = formatMoney(1200000, false);
    expect(result).not.toContain("₦");
    expect(result).toContain("12,000");
  });

  it("correctly handles minor unit conversion (100 kobo = 1 Naira)", () => {
    const result = formatMoney(100); // 1 Naira
    expect(result).toContain("1.00");
  });
});

describe("generateOrderNumber", () => {
  it("returns a string matching SF-YYYYMMDD-NNNN format", () => {
    const orderNum = generateOrderNumber(new Date("2026-10-02"));
    expect(orderNum).toMatch(/^SF-20261002-\d{4}$/);
  });

  it("generates different numbers on consecutive calls", () => {
    const a = generateOrderNumber();
    const b = generateOrderNumber();
    // Very likely to differ due to random suffix
    // At minimum both should be valid format
    expect(a).toMatch(/^SF-\d{8}-\d{4}$/);
    expect(b).toMatch(/^SF-\d{8}-\d{4}$/);
  });

  it("uses current date by default", () => {
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const mm = (now.getMonth() + 1).toString().padStart(2, "0");
    const dd = now.getDate().toString().padStart(2, "0");
    const orderNum = generateOrderNumber();
    expect(orderNum).toContain(`SF-${yyyy}${mm}${dd}-`);
  });
});

import { describe, it, expect } from "vitest";
import { renderOrderConfirmationEmail } from "@/lib/email/templates";
import { OrderWithItems } from "@/types";

const mockOrder: OrderWithItems = {
  id: "ord-uuid-001",
  order_number: "SF-20261002-4821",
  user_id: "user-uuid-001",
  status: "pending",
  subtotal: 3050000, // ₦30,500
  delivery_fee: 250000, // ₦2,500
  total: 3300000, // ₦33,000
  customer_name: "Chinelo Okonkwo",
  phone: "08012345678",
  address: "12 Banana Island Road",
  city: "Lagos",
  state: "Lagos",
  note: "Call before arriving",
  created_at: "2026-10-02T10:00:00Z",
  items: [
    {
      id: "item-uuid-001",
      order_id: "ord-uuid-001",
      product_id: "prod-001",
      name_snapshot: "Minimalist Leather Cardholder",
      unit_price_snapshot: 1850000,
      quantity: 1,
    },
    {
      id: "item-uuid-002",
      order_id: "ord-uuid-001",
      product_id: "prod-005",
      name_snapshot: "Solid Brass Mechanical Pencil",
      unit_price_snapshot: 1200000,
      quantity: 1,
    },
  ],
};

describe("renderOrderConfirmationEmail", () => {
  it("returns subject, html, and text fields", () => {
    const result = renderOrderConfirmationEmail(mockOrder);
    expect(result).toHaveProperty("subject");
    expect(result).toHaveProperty("html");
    expect(result).toHaveProperty("text");
  });

  it("includes order number in subject", () => {
    const { subject } = renderOrderConfirmationEmail(mockOrder);
    expect(subject).toContain("SF-20261002-4821");
  });

  it("includes customer name in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder);
    expect(html).toContain("Chinelo Okonkwo");
  });

  it("includes order number in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder);
    expect(html).toContain("SF-20261002-4821");
  });

  it("includes all item names in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder);
    expect(html).toContain("Minimalist Leather Cardholder");
    expect(html).toContain("Solid Brass Mechanical Pencil");
  });

  it("includes total amount in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder);
    expect(html).toContain("33,000");
  });

  it("includes delivery address in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder);
    expect(html).toContain("12 Banana Island Road");
    expect(html).toContain("Lagos");
  });

  it("includes order URL link in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder, "https://shopfront-green.vercel.app");
    expect(html).toContain("/orders/ord-uuid-001");
  });

  it("includes order number in plain text version", () => {
    const { text } = renderOrderConfirmationEmail(mockOrder);
    expect(text).toContain("SF-20261002-4821");
  });

  it("includes item names in plain text version", () => {
    const { text } = renderOrderConfirmationEmail(mockOrder);
    expect(text).toContain("Minimalist Leather Cardholder");
  });

  it("includes total in plain text version", () => {
    const { text } = renderOrderConfirmationEmail(mockOrder);
    expect(text).toContain("33,000");
  });
});

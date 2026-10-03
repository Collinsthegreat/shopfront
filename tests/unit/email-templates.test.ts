import { describe, it, expect } from "vitest";
import { renderOrderConfirmationEmail } from "@/lib/email/templates";
import { OrderWithItems } from "@/types";

const mockOrder: OrderWithItems = {
  id: "ord-uuid-001",
  order_number: "BM-20261003-4821",
  user_id: "user-uuid-001",
  status: "pending",
  subtotal: 95000000, // ₦950,000
  delivery_fee: 3500000, // ₦35,000
  total: 98500000, // ₦985,000
  customer_name: "Engr. Babatunde Adeleke",
  phone: "08012345678",
  address: "Plot 14, Lekki Phase 1 Project Site",
  city: "Lagos",
  state: "Lagos",
  note: "Offloading gate accessible for 30-ton trailer",
  created_at: "2026-10-03T10:00:00Z",
  items: [
    {
      id: "item-uuid-001",
      order_id: "ord-uuid-001",
      product_id: "cem-001",
      name_snapshot: "Dangote 3X Cement 50kg (Grade 42.5R)",
      unit_price_snapshot: 950000,
      unit_snapshot: "bag",
      quantity: 100,
    },
    {
      id: "item-uuid-002",
      order_id: "ord-uuid-001",
      product_id: "stl-001",
      name_snapshot: "Tiger TMT 12mm High-Yield Rebar (12m Length)",
      unit_price_snapshot: 1180000,
      unit_snapshot: "length",
      quantity: 20,
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

  it("includes BM- order number in subject with BuildMart brand", () => {
    const { subject } = renderOrderConfirmationEmail(mockOrder);
    expect(subject).toContain("BM-20261003-4821");
    expect(subject).toContain("BuildMart");
  });

  it("includes customer name in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder);
    expect(html).toContain("Engr. Babatunde Adeleke");
  });

  it("includes order number in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder);
    expect(html).toContain("BM-20261003-4821");
  });

  it("includes material items and unit breakdowns in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder);
    expect(html).toContain("Dangote 3X Cement 50kg");
    expect(html).toContain("bag");
    expect(html).toContain("Tiger TMT 12mm");
  });

  it("includes total amount in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder);
    expect(html).toContain("985,000");
  });

  it("includes delivery address in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder);
    expect(html).toContain("Plot 14, Lekki Phase 1 Project Site");
    expect(html).toContain("Lagos");
  });

  it("includes order URL link in HTML", () => {
    const { html } = renderOrderConfirmationEmail(mockOrder, "https://shopfront-green.vercel.app");
    expect(html).toContain("/orders/ord-uuid-001");
  });

  it("includes order number in plain text version", () => {
    const { text } = renderOrderConfirmationEmail(mockOrder);
    expect(text).toContain("BM-20261003-4821");
  });

  it("includes material items in plain text version", () => {
    const { text } = renderOrderConfirmationEmail(mockOrder);
    expect(text).toContain("Dangote 3X Cement 50kg");
    expect(text).toContain("100 bags");
  });

  it("includes total in plain text version", () => {
    const { text } = renderOrderConfirmationEmail(mockOrder);
    expect(text).toContain("985,000");
  });
});

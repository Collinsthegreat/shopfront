import { describe, it, expect } from "vitest";
import { checkoutFormSchema, createOrderApiSchema } from "@/lib/validations";

describe("checkoutFormSchema", () => {
  const validData = {
    fullName: "Chinelo Okonkwo",
    phone: "08012345678",
    address: "12 Banana Island Road, Ikoyi",
    city: "Lagos",
    state: "Lagos",
    note: "Call before arriving",
  };

  it("passes with valid data", () => {
    const result = checkoutFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("passes without optional note", () => {
    const { note: _note, ...withoutNote } = validData;
    const result = checkoutFormSchema.safeParse(withoutNote);
    expect(result.success).toBe(true);
  });

  it("fails when fullName is too short", () => {
    const result = checkoutFormSchema.safeParse({ ...validData, fullName: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.fullName).toBeDefined();
    }
  });

  it("fails when phone is too short", () => {
    const result = checkoutFormSchema.safeParse({ ...validData, phone: "123" });
    expect(result.success).toBe(false);
  });

  it("fails when phone contains non-numeric characters (except +, spaces, dashes)", () => {
    const result = checkoutFormSchema.safeParse({ ...validData, phone: "abc-xyz" });
    expect(result.success).toBe(false);
  });

  it("fails when address is too short", () => {
    const result = checkoutFormSchema.safeParse({ ...validData, address: "AB" });
    expect(result.success).toBe(false);
  });

  it("fails when city is missing", () => {
    const result = checkoutFormSchema.safeParse({ ...validData, city: "" });
    expect(result.success).toBe(false);
  });

  it("fails when state is missing", () => {
    const result = checkoutFormSchema.safeParse({ ...validData, state: "" });
    expect(result.success).toBe(false);
  });

  it("fails when note exceeds 300 characters", () => {
    const result = checkoutFormSchema.safeParse({
      ...validData,
      note: "A".repeat(301),
    });
    expect(result.success).toBe(false);
  });
});

describe("createOrderApiSchema", () => {
  const validOrder = {
    items: [{ productId: "prod-001", quantity: 2 }],
    delivery: {
      fullName: "Collins Ade",
      phone: "08011223344",
      address: "5 Tech Road, Victoria Island",
      city: "Lagos",
      state: "Lagos",
    },
    idempotencyKey: "idem-abc-123-xyz",
  };

  it("passes with valid order data", () => {
    const result = createOrderApiSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("passes without optional idempotencyKey", () => {
    const { idempotencyKey: _k, ...withoutKey } = validOrder;
    const result = createOrderApiSchema.safeParse(withoutKey);
    expect(result.success).toBe(true);
  });

  it("fails with empty items array", () => {
    const result = createOrderApiSchema.safeParse({ ...validOrder, items: [] });
    expect(result.success).toBe(false);
  });

  it("fails when item quantity is 0", () => {
    const result = createOrderApiSchema.safeParse({
      ...validOrder,
      items: [{ productId: "prod-001", quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("fails when item quantity exceeds 50", () => {
    const result = createOrderApiSchema.safeParse({
      ...validOrder,
      items: [{ productId: "prod-001", quantity: 51 }],
    });
    expect(result.success).toBe(false);
  });

  it("fails when productId is empty string", () => {
    const result = createOrderApiSchema.safeParse({
      ...validOrder,
      items: [{ productId: "", quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });
});

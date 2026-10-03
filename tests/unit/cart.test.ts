import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/lib/cart/store";
import { Product } from "@/types";

const mockProduct: Product = {
  id: "cem-001",
  slug: "dangote-cement-50kg",
  name: "Dangote 3X Cement 50kg (Grade 42.5R)",
  description: "High-grade Portland limestone cement.",
  price_kobo: 950000,
  currency: "NGN",
  category: "cement-binders",
  brand_id: "dangote",
  unit: "bag",
  image_url: "/products/dangote-cement-50kg.webp",
  stock: 10,
  featured: true,
  specs: { weight: "50kg", grade: "42.5R" },
  created_at: "2026-09-01T08:00:00Z",
};

const mockProduct2: Product = {
  id: "stl-001",
  slug: "tiger-tmt-rebar-12mm",
  name: "Tiger TMT 12mm High-Yield Rebar (12m Length)",
  description: "High-yield deformed steel rebar.",
  price_kobo: 1180000,
  currency: "NGN",
  category: "steel-rods",
  brand_id: "tiger-tmt",
  unit: "length",
  image_url: "/products/tiger-tmt-rebar-12mm.webp",
  stock: 5,
  featured: true,
  specs: { diameter: "12mm", length: "12m" },
  created_at: "2026-09-02T08:00:00Z",
};

describe("Cart Store", () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      isDrawerOpen: false,
      hasHydrated: false,
    });
  });

  it("starts with an empty cart", () => {
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("adds a product to the cart", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]?.product.id).toBe("cem-001");
    expect(items[0]?.quantity).toBe(1);
  });

  it("opens the drawer when adding a product", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    expect(useCartStore.getState().isDrawerOpen).toBe(true);
  });

  it("increments quantity if product already in cart", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().addItem(mockProduct, 2);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]?.quantity).toBe(3);
  });

  it("clamps quantity to stock limit", () => {
    useCartStore.getState().addItem(mockProduct, 15); // stock is 10
    expect(useCartStore.getState().items[0]?.quantity).toBe(10);
  });

  it("does not add if stock is zero", () => {
    const zeroStockProduct = { ...mockProduct, stock: 0 };
    useCartStore.getState().addItem(zeroStockProduct, 1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("removes an item by product ID", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().addItem(mockProduct2, 1);
    useCartStore.getState().removeItem("cem-001");
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]?.product.id).toBe("stl-001");
  });

  it("updates the quantity of an item", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().updateQuantity("cem-001", 4);
    expect(useCartStore.getState().items[0]?.quantity).toBe(4);
  });

  it("removes item when quantity updated to 0", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().updateQuantity("cem-001", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clears the entire cart", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().addItem(mockProduct2, 2);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calculates subtotal correctly", () => {
    useCartStore.getState().addItem(mockProduct, 2); // 950000 * 2 = 1900000
    useCartStore.getState().addItem(mockProduct2, 1); // 1180000 * 1 = 1180000
    const subtotal = useCartStore.getState().getSubtotal();
    expect(subtotal).toBe(950000 * 2 + 1180000 * 1);
  });

  it("calculates total items count correctly", () => {
    useCartStore.getState().addItem(mockProduct, 3);
    useCartStore.getState().addItem(mockProduct2, 2);
    expect(useCartStore.getState().getTotalItemsCount()).toBe(5);
  });
});

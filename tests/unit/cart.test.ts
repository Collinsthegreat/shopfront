import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/lib/cart/store";
import { Product } from "@/types";

const mockProduct: Product = {
  id: "prod-001",
  slug: "minimalist-leather-cardholder",
  name: "Minimalist Leather Cardholder",
  description: "Slim vegetable-tanned leather wallet.",
  price_kobo: 1850000,
  currency: "NGN",
  category: "carry",
  image_url: "/images/products/cardholder.svg",
  stock: 10,
  featured: true,
  created_at: "2026-09-01T08:00:00Z",
};

const mockProduct2: Product = {
  id: "prod-002",
  slug: "brass-key-organizer",
  name: "Solid Brass Key Organizer",
  description: "CNC-machined brass key organizer.",
  price_kobo: 1200000,
  currency: "NGN",
  category: "carry",
  image_url: "/images/products/key-organizer.svg",
  stock: 5,
  featured: false,
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
    expect(items[0]?.product.id).toBe("prod-001");
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
    useCartStore.getState().removeItem("prod-001");
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]?.product.id).toBe("prod-002");
  });

  it("updates the quantity of an item", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().updateQuantity("prod-001", 4);
    expect(useCartStore.getState().items[0]?.quantity).toBe(4);
  });

  it("removes item when quantity updated to 0", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().updateQuantity("prod-001", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clears the entire cart", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().addItem(mockProduct2, 2);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calculates subtotal correctly", () => {
    useCartStore.getState().addItem(mockProduct, 2);  // 1850000 * 2
    useCartStore.getState().addItem(mockProduct2, 1); // 1200000 * 1
    const subtotal = useCartStore.getState().getSubtotal();
    expect(subtotal).toBe(1850000 * 2 + 1200000 * 1);
  });

  it("calculates total items count correctly", () => {
    useCartStore.getState().addItem(mockProduct, 3);
    useCartStore.getState().addItem(mockProduct2, 2);
    expect(useCartStore.getState().getTotalItemsCount()).toBe(5);
  });
});

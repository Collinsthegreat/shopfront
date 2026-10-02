export const STORE_NAME = "Shopfront";
export const STORE_DESCRIPTION = "Minimalist everyday carry and refined home goods crafted for intentional living.";

export const CURRENCY = {
  code: "NGN",
  symbol: "₦",
  locale: "en-NG",
  minorUnitName: "kobo",
  minorUnitRatio: 100, // 100 kobo = 1 Naira
} as const;

export const FLAT_DELIVERY_FEE_KOBO = 250000; // ₦2,500.00

export const CATEGORIES = [
  { slug: "all", name: "All Products" },
  { slug: "carry", name: "Everyday Carry" },
  { slug: "stationery", name: "Stationery & Writing" },
  { slug: "desk", name: "Desk & Workspace" },
  { slug: "living", name: "Refined Living" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

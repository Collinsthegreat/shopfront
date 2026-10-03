import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { CATEGORIES, BRANDS } from "@/lib/constants";

describe("BuildMart Products Dataset Integrity", () => {
  it("contains between 40 and 60 realistic building materials", () => {
    expect(INITIAL_PRODUCTS.length).toBeGreaterThanOrEqual(40);
    expect(INITIAL_PRODUCTS.length).toBeLessThanOrEqual(60);
  });

  it("covers all 11 core construction categories", () => {
    const validCategorySlugs = CATEGORIES.filter((c) => c.slug !== "all").map(
      (c) => c.slug
    );
    const presentCategories = new Set(INITIAL_PRODUCTS.map((p) => p.category));

    for (const catSlug of validCategorySlugs) {
      expect(presentCategories.has(catSlug as any)).toBe(true);
    }
  });

  it("ensures every product has a valid price, unit, and stock", () => {
    for (const product of INITIAL_PRODUCTS) {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.slug).toBeTruthy();
      expect(product.price_kobo).toBeGreaterThan(0);
      expect(product.currency).toBe("NGN");
      expect(product.stock).toBeGreaterThan(0);
      expect(product.unit).toBeTruthy();
      expect(product.description).toBeTruthy();
    }
  });

  it("ensures no duplicate product IDs or slugs", () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const product of INITIAL_PRODUCTS) {
      expect(ids.has(product.id)).toBe(false);
      expect(slugs.has(product.slug)).toBe(false);
      ids.add(product.id);
      slugs.add(product.slug);
    }
  });

  it("ensures every product has a matching local WebP image on disk", () => {
    const publicDir = path.join(process.cwd(), "public");

    for (const product of INITIAL_PRODUCTS) {
      expect(product.image_url).toMatch(/^\/products\/[\w-]+\.webp$/);
      const relativePath = product.image_url.replace(/^\//, "");
      const fullPath = path.join(publicDir, relativePath);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  it("ensures brands and categories reference catalogs are populated", () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(11);
    expect(BRANDS.length).toBeGreaterThanOrEqual(10);
  });
});

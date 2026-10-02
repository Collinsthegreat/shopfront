"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategorySlug, SortOption } from "@/lib/constants";
import { Product } from "@/types";

export function ShopClient(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = (searchParams.get("category") as CategorySlug) || "all";
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<SortOption>("featured");

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (cat: CategorySlug): void => {
    setSelectedCategory(cat);
    if (cat === "all") {
      router.push("/shop");
    } else {
      router.push(`/shop?category=${cat}`);
    }
  };

  const filteredProducts = useMemo(() => {
    let result: Product[] = [...INITIAL_PRODUCTS];

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort Products
    switch (selectedSort) {
      case "price-asc":
        result.sort((a, b) => a.price_kobo - b.price_kobo);
        break;
      case "price-desc":
        result.sort((a, b) => b.price_kobo - a.price_kobo);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, selectedSort]);

  const handleResetFilters = (): void => {
    setSearchQuery("");
    handleCategoryChange("all");
    setSelectedSort("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Shop The Catalog
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl">
          Carefully engineered everyday carry and home staples. Built to endure daily use with timeless minimal aesthetics.
        </p>
      </div>

      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        totalResults={filteredProducts.length}
      />

      <ProductGrid
        products={filteredProducts}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}

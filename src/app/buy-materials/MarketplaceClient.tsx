"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, RotateCcw, PackageSearch } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { CATEGORIES, BRANDS, SORT_OPTIONS, SortOptionValue } from "@/lib/constants";

export interface MarketplaceClientProps {
  initialProducts: Product[];
}

export function MarketplaceClient({ initialProducts }: MarketplaceClientProps): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read URL query params
  const paramSearch = searchParams.get("search") || "";
  const paramCategory = searchParams.get("category") || "all";
  const paramBrand = searchParams.get("brand") || "";
  const paramSort = (searchParams.get("sort") as SortOptionValue) || "featured";
  const paramInStock = searchParams.get("inStock") === "true";
  const paramMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 0;

  // Local state for debounced search
  const [searchInput, setSearchInput] = useState<string>(paramSearch);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Sync search input if URL changes externally
  useEffect(() => {
    setSearchInput(paramSearch);
  }, [paramSearch]);

  // Update URL search parameters
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all" || value === "0") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.replace(`/buy-materials?${params.toString()}`, { scroll: false });
    });
  };

  // Debounced search sync to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== paramSearch) {
        updateQuery({ search: searchInput.trim() || null });
      }
    }, 300);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Filtering and Sorting
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Text Search across name, brand, category, description, and specs
      if (paramSearch) {
        const query = paramSearch.toLowerCase();
        const specsText = Object.values(product.specs || {}).join(" ").toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = (product.brand || "").toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesSpecs = specsText.includes(query);

        if (!matchesName && !matchesBrand && !matchesCategory && !matchesDesc && !matchesSpecs) {
          return false;
        }
      }

      // 2. Category Filter
      if (paramCategory && paramCategory !== "all") {
        if (product.category !== paramCategory && product.category_id !== paramCategory) {
          return false;
        }
      }

      // 3. Brand Filter
      if (paramBrand) {
        if (product.brand_id !== paramBrand && !(product.brand || "").toLowerCase().includes(paramBrand.toLowerCase())) {
          return false;
        }
      }

      // 4. In-Stock Filter
      if (paramInStock && product.stock <= 0) {
        return false;
      }

      // 5. Max Price Filter (in Naira)
      if (paramMaxPrice > 0) {
        const priceNaira = product.price_kobo / 100;
        if (priceNaira > paramMaxPrice) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (paramSort === "price-asc") {
        return a.price_kobo - b.price_kobo;
      }
      if (paramSort === "price-desc") {
        return b.price_kobo - a.price_kobo;
      }
      if (paramSort === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (paramSort === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // "featured" default
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [initialProducts, paramSearch, paramCategory, paramBrand, paramInStock, paramMaxPrice, paramSort]);

  const resetFilters = () => {
    setSearchInput("");
    router.replace("/buy-materials", { scroll: false });
  };

  const hasActiveFilters = Boolean(
    paramSearch || (paramCategory && paramCategory !== "all") || paramBrand || paramInStock || paramMaxPrice > 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider mb-1">
            <span>Marketplace Catalog</span>
            <span>•</span>
            <span>Lagos & Abuja Hubs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
            Buy Construction Materials
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl">
            Authoritative transparent prices per unit. Factory certified rebar, cement, aggregates, roofing, and finishes.
          </p>
        </div>

        {/* Top Right: Live Debounced Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search materials, brands, specs..."
              className="w-full h-10 pl-9 pr-8 text-xs font-medium rounded-pill bg-surface border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors shadow-xs"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden h-10 px-3.5 rounded-pill border border-border bg-surface text-text-primary flex items-center gap-1.5 text-xs font-semibold shadow-xs"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Category Pills Strip (Reference requirement) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = (cat.slug === "all" && (!paramCategory || paramCategory === "all")) || paramCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => updateQuery({ category: cat.slug === "all" ? null : cat.slug })}
                className={`px-4 py-2 rounded-pill text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-accent text-accent-contrast border-accent shadow-sm"
                    : "bg-surface text-text-secondary border-border hover:border-text-primary hover:text-text-primary"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Faceted Filters & Sorting Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        {/* Left: Active Brand & Stock Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Dropdown Filter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-text-tertiary">Brand:</span>
            <select
              value={paramBrand}
              onChange={(e) => updateQuery({ brand: e.target.value || null })}
              className="h-8 px-2.5 rounded-lg bg-surface-elevated border border-border text-xs font-semibold text-text-primary focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="">All Brands</option>
              {BRANDS.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* In Stock Only Checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={paramInStock}
              onChange={(e) => updateQuery({ inStock: e.target.checked ? "true" : null })}
              className="w-3.5 h-3.5 rounded text-accent border-border focus:ring-accent accent-accent"
            />
            <span>In Stock Only</span>
          </label>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-danger hover:underline ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Right: Results Count & Sort Dropdown */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-text-tertiary font-semibold tabular-nums">
            Showing <strong className="text-text-primary">{filteredProducts.length}</strong> materials
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-text-tertiary font-semibold">Sort by:</span>
            <select
              value={paramSort}
              onChange={(e) => updateQuery({ sort: e.target.value })}
              className="h-8 px-2.5 rounded-lg bg-surface-elevated border border-border text-xs font-bold text-text-primary focus:outline-none focus:border-accent cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid (4 Columns Desktop, 2 Tablet, 1-2 Mobile) */}
      {filteredProducts.length > 0 ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-opacity ${
            isPending ? "opacity-60" : "opacity-100"
          }`}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Designed Empty State */
        <div className="text-center py-20 px-4 rounded-3xl bg-surface border border-dashed border-border space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center text-text-tertiary mx-auto">
            <PackageSearch className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-text-primary">
              No matching construction materials found
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              We couldn&apos;t find any materials matching &quot;{paramSearch || paramCategory}&quot;. Try adjusting your filters or search terms.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="h-10 px-5 rounded-pill bg-accent text-accent-contrast font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs"
          >
            Clear all filters & show all materials
          </button>
        </div>
      )}
    </div>
  );
}

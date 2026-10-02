"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { CATEGORIES, SORT_OPTIONS, CategorySlug, SortOption } from "@/lib/constants";

export interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategorySlug;
  onCategoryChange: (category: CategorySlug) => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  totalResults,
}: ProductFiltersProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      {/* Search Bar & Sort Dropdown Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search minimal goods..."
            className="w-full h-11 pl-10 pr-9 rounded-md border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-2 focus-visible:outline-accent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-tertiary hover:text-text-primary"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label
            htmlFor="sort-select"
            className="text-xs font-medium text-text-secondary whitespace-nowrap"
          >
            Sort by:
          </label>
          <select
            id="sort-select"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-11 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-accent cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onCategoryChange(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap min-h-[36px] flex items-center ${
                isActive
                  ? "bg-accent text-accent-contrast shadow-xs"
                  : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-text-secondary/50"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-text-secondary pt-1">
        <span>
          Showing <strong className="text-text-primary">{totalResults}</strong>{" "}
          {totalResults === 1 ? "product" : "products"}
        </span>
        {(searchQuery || selectedCategory !== "all") && (
          <button
            type="button"
            onClick={() => {
              onSearchChange("");
              onCategoryChange("all");
            }}
            className="text-xs text-text-tertiary hover:text-text-primary underline"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}

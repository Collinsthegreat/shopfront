import React from "react";
import { PackageX } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

export function ProductGrid({
  products,
  isLoading = false,
  onResetFilters,
}: ProductGridProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-card overflow-hidden space-y-4 p-4"
          >
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 px-4 text-center border border-dashed border-border rounded-card bg-surface/50 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full bg-border-subtle flex items-center justify-center mx-auto mb-4 text-text-tertiary">
          <PackageX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          No products found
        </h3>
        <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
          We couldn&apos;t find anything matching your search criteria. Try adjusting your filters.
        </p>
        {onResetFilters && (
          <Button variant="secondary" onClick={onResetFilters}>
            Clear all filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

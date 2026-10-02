"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { Product } from "@/types";
import { formatMoney } from "@/lib/formatters";
import { useCartStore } from "@/lib/cart/store";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent): void => {
    e.preventDefault();
    if (isOutOfStock) return;

    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const categoryLabels: Record<string, string> = {
    carry: "Carry",
    stationery: "Stationery",
    desk: "Desk",
    living: "Living",
  };

  return (
    <div className="group flex flex-col bg-surface border border-border rounded-card overflow-hidden hover:border-text-secondary/40 transition-all duration-200">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full bg-canvas flex items-center justify-center p-6 overflow-hidden"
      >
        <Image
          src={product.image_url}
          alt={product.name}
          width={400}
          height={400}
          priority={product.featured}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <Badge variant="outline" className="backdrop-blur-xs bg-surface/80">
            {categoryLabels[product.category] ?? product.category}
          </Badge>
          {product.featured && (
            <Badge variant="accent">Featured</Badge>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-xs flex items-center justify-center">
            <Badge variant="danger" className="text-xs px-3 py-1">
              Out of Stock
            </Badge>
          </div>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link
            href={`/product/${product.slug}`}
            className="block text-base font-medium text-text-primary hover:underline line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="text-xs text-text-secondary line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
          <div>
            <span className="text-base font-semibold text-text-primary tabular-nums">
              {formatMoney(product.price_kobo)}
            </span>
            {isLowStock && (
              <p className="text-[11px] text-danger font-medium mt-0.5">
                Only {product.stock} left
              </p>
            )}
          </div>

          <Button
            size="sm"
            variant={isAdded ? "secondary" : "primary"}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="min-w-[40px] px-3"
          >
            {isAdded ? (
              <span className="flex items-center gap-1 text-xs">
                <Check className="w-3.5 h-3.5 text-text-primary" />
                <span>Added</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

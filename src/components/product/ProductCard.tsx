"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { formatPriceWithUnit } from "@/lib/formatters";
import { useCartStore } from "@/lib/cart/store";
import { Badge } from "@/components/ui/Badge";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleAddToCart = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const productUrl = `/buy-materials/${product.slug}`;

  return (
    <div className="group flex flex-col bg-surface border border-border rounded-2xl sm:rounded-3xl p-3 sm:p-4 hover:border-accent/60 transition-all duration-200 shadow-card hover:shadow-md">
      {/* 1:1 Clean White Rounded Tile */}
      <Link
        href={productUrl}
        className="relative aspect-square w-full bg-white rounded-xl sm:rounded-2xl flex items-center justify-center p-3 sm:p-5 overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]"
      >
        <Image
          src={product.image_url}
          alt={product.name}
          width={500}
          height={500}
          priority={product.featured}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
        />

        {/* Brand / Category Pill */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 items-start">
          {product.brand && (
            <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase">
              {product.brand}
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 rounded-full bg-accent text-accent-contrast text-[10px] font-black tracking-wider uppercase">
              Featured
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <Badge variant="danger" className="text-xs px-3 py-1 font-bold uppercase tracking-wider">
              Out of Stock
            </Badge>
          </div>
        )}
      </Link>

      {/* Card Content & Details */}
      <div className="pt-3.5 pb-1 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Uppercase Product Title */}
          <Link
            href={productUrl}
            className="block text-xs sm:text-sm font-bold uppercase tracking-tight text-text-primary hover:text-accent transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Short Specs / Subhead */}
          <p className="text-[11px] text-text-secondary line-clamp-1 mt-1 font-medium">
            {product.short_description || product.description}
          </p>
        </div>

        {/* Price Line with Unit */}
        <div className="pt-2 border-t border-border/60 flex items-baseline justify-between gap-1">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-extrabold text-text-primary group-hover:text-accent transition-colors tabular-nums">
              {formatPriceWithUnit(product.price_kobo, product.unit)}
            </span>
            {isLowStock && (
              <span className="text-[10px] text-danger font-semibold">
                Only {product.stock} {product.unit}s remaining
              </span>
            )}
          </div>
        </div>

        {/* Two Buttons Side by Side (Reference Requirement) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Quiet Outline Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`h-9 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isOutOfStock
                ? "border-border text-text-tertiary opacity-50 cursor-not-allowed bg-surface-secondary"
                : isAdded
                ? "border-accent bg-accent/10 text-accent font-bold"
                : "border-border text-text-primary hover:border-text-primary hover:bg-surface-elevated active:scale-95"
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-accent" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-text-secondary" />
                <span>Add</span>
              </>
            )}
          </button>

          {/* Solid Accent View Link */}
          <Link
            href={productUrl}
            className="h-9 px-2 rounded-xl bg-accent text-accent-contrast hover:bg-accent-hover text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 text-center"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

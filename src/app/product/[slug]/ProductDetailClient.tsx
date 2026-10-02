"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Product } from "@/types";
import { formatMoney } from "@/lib/formatters";
import { useCartStore } from "@/lib/cart/store";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({
  product,
}: ProductDetailClientProps): React.JSX.Element {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleDecrease = (): void => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = (): void => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = (): void => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb / Back link */}
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Product Image Gallery Display */}
        <div className="bg-surface border border-border rounded-card p-8 sm:p-12 flex items-center justify-center aspect-square relative">
          <Image
            src={product.image_url}
            alt={product.name}
            width={600}
            height={600}
            priority
            className="w-full h-full object-contain max-h-[460px]"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-surface/85 backdrop-blur-xs flex items-center justify-center">
              <Badge variant="danger" className="text-sm px-4 py-1.5">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="uppercase">
                {product.category}
              </Badge>
              {product.featured && <Badge variant="accent">Featured</Badge>}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              {product.name}
            </h1>

            <div className="pt-2 flex items-baseline gap-4">
              <span className="text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">
                {formatMoney(product.price_kobo)}
              </span>
              <span className="text-xs text-text-tertiary">
                Taxes included • Pay on delivery
              </span>
            </div>
          </div>

          {/* Stock Status Indicator */}
          <div className="pt-2 border-t border-border-subtle">
            {isOutOfStock ? (
              <p className="text-xs font-medium text-danger">
                Currently out of stock. Check back soon.
              </p>
            ) : isLowStock ? (
              <p className="text-xs font-medium text-danger">
                Low stock alert: Only {product.stock} items remaining.
              </p>
            ) : (
              <p className="text-xs font-medium text-text-secondary">
                In stock ({product.stock} units available)
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Description
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart Row */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Quantity
                </span>
                <div className="flex items-center border border-border rounded-md bg-surface">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold tabular-nums text-text-primary select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  variant={isAdded ? "secondary" : "primary"}
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  {isAdded ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Added To Cart</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Add To Cart • {formatMoney(product.price_kobo * quantity)}</span>
                    </span>
                  )}
                </Button>
                <Link href="/checkout" onClick={handleAddToCart} className="flex-1">
                  <Button size="lg" variant="secondary" className="w-full">
                    Buy Now
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Assurances */}
          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-text-primary flex-shrink-0" />
              <span>Inspection on delivery before payment</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <Truck className="w-4 h-4 text-text-primary flex-shrink-0" />
              <span>Flat nationwide courier delivery (₦2,500)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <RotateCcw className="w-4 h-4 text-text-primary flex-shrink-0" />
              <span>7-day return policy for craftsmanship defects</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

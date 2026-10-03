"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Check,
  Truck,
  BadgeCheck,
  ChevronRight,
  Package,
} from "lucide-react";
import { Product } from "@/types";
import { formatMoney, formatPriceWithUnit } from "@/lib/formatters";
import { useCartStore } from "@/lib/cart/store";
import { ProductCard } from "@/components/product/ProductCard";
import { FLAT_HAULAGE_FEE_KOBO } from "@/lib/constants";

export interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps): React.JSX.Element {
  const addItem = useCartStore((state) => state.addItem);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;

  const handleQuantityChange = (newQty: number): void => {
    if (isNaN(newQty)) return;
    const clamped = Math.max(1, Math.min(newQty, product.stock));
    setQuantity(clamped);
  };

  const handleAddToCart = (): void => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setDrawerOpen(true);
    }, 600);
  };

  const lineTotalKobo = product.price_kobo * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-text-tertiary">
        <Link href="/" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/buy-materials" className="hover:text-text-primary transition-colors">
          Buy Materials
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/buy-materials?category=${product.category}`}
          className="capitalize hover:text-text-primary transition-colors"
        >
          {product.category.replace("-", " ")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Left Column: 1:1 Large Image Container */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-white rounded-3xl border border-border p-8 sm:p-14 flex items-center justify-center overflow-hidden shadow-card">
            <Image
              src={product.image_url}
              alt={product.name}
              width={800}
              height={800}
              priority
              className="object-contain w-full h-full max-h-[500px]"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.brand && (
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider">
                  {product.brand}
                </span>
              )}
              {product.featured && (
                <span className="px-3 py-1 rounded-full bg-accent text-accent-contrast text-xs font-black uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-danger text-white text-sm font-bold uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border text-xs text-text-secondary">
            <BadgeCheck className="w-4 h-4 text-accent flex-shrink-0" />
            <span>Guaranteed authentic product sourced directly from certified Nigerian factories and OEMs.</span>
          </div>
        </div>

        {/* Right Column: Details, Bulk Stepper, Price & Actions */}
        <div className="space-y-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                {product.category.replace("-", " ")}
              </span>
              <span className="text-text-tertiary">•</span>
              <span className="text-xs text-text-secondary font-medium">SKU: {product.id.toUpperCase()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-text-primary text-balance leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Transparent Authoritative Price Block */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
              Authoritative Unit Price
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-text-primary tabular-nums">
                {formatPriceWithUnit(product.price_kobo, product.unit)}
              </span>
            </div>

            {/* Stock status */}
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOutOfStock ? "bg-danger" : isLowStock ? "bg-amber-500" : "bg-emerald-500"
                }`}
              />
              <span className="text-text-primary">
                {isOutOfStock
                  ? "Currently out of stock"
                  : isLowStock
                  ? `Low stock: ${product.stock} ${product.unit}s left`
                  : `In Stock: ${product.stock} ${product.unit}s available for site dispatch`}
              </span>
            </div>
          </div>

          {/* Bulk Stepper & Dynamic Total */}
          {!isOutOfStock && (
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="quantity-input" className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Quantity ({product.unit}s):
                </label>
                <span className="text-xs text-text-secondary font-semibold">
                  Max: {product.stock}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Stepper Controls */}
                <div className="flex items-center rounded-xl border border-border bg-surface-elevated">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-40 text-lg font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>

                  <input
                    id="quantity-input"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                    className="w-16 h-10 text-center font-bold text-sm bg-transparent border-none text-text-primary focus:outline-none tabular-nums"
                  />

                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-40 text-lg font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal Calculation Display */}
                <div className="flex-1 text-right">
                  <span className="text-[11px] text-text-tertiary block font-semibold">Item Subtotal</span>
                  <span className="text-lg font-black text-accent tabular-nums">
                    {formatMoney(lineTotalKobo)}
                  </span>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdded || isOutOfStock}
                className="w-full h-12 rounded-xl bg-accent text-accent-contrast font-bold text-sm flex items-center justify-center gap-2 hover:bg-accent-hover transition-all shadow-md active:scale-98"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add {quantity} {product.unit}{quantity > 1 ? "s" : ""} to Cart</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Delivery & Logistics Haulage Notice */}
          <div className="p-4 rounded-2xl bg-surface-elevated border border-border/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-text-primary">
              <Truck className="w-4 h-4 text-accent" />
              <span>Site Haulage & Logistics Policy</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Standard site delivery across Lagos & Abuja building sites calculated at flat <strong>{formatMoney(FLAT_HAULAGE_FEE_KOBO)}</strong> per order. Haulage includes heavy tipper / flatbed offloading at your plot.
            </p>
          </div>
        </div>
      </div>

      {/* Specifications Table (JSONB Specs per AGENTS.md) */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
              Technical Specifications & Certification
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <table className="w-full text-left text-xs sm:text-sm">
              <tbody className="divide-y divide-border/60">
                {Object.entries(product.specs).map(([specKey, specVal]) => (
                  <tr key={specKey} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="py-3 px-4 sm:px-6 font-bold text-text-secondary w-1/3 sm:w-1/4 bg-surface-secondary/40">
                      {specKey}
                    </td>
                    <td className="py-3 px-4 sm:px-6 font-medium text-text-primary">
                      {String(specVal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related Materials Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                Related {product.category.replace("-", " ")} Materials
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Often ordered together on building sites.
              </p>
            </div>
            <Link
              href={`/buy-materials?category=${product.category}`}
              className="text-xs font-bold text-accent hover:underline"
            >
              View department →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

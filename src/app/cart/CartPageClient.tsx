"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";

export function CartPageClient(): React.JSX.Element {
  const { items, clearCart, subtotal, itemsCount, isMounted } = useCart();

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-40 bg-border-subtle rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-surface border border-border rounded-card animate-pulse" />
          <div className="h-64 bg-surface border border-border rounded-card animate-pulse" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-border-subtle flex items-center justify-center mx-auto mb-4 text-text-tertiary">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mb-2">
          Your cart is empty
        </h1>
        <p className="text-sm text-text-secondary max-w-sm mx-auto mb-8">
          You haven&apos;t added any building materials to your cart yet. Explore our genuine construction supplies catalog.
        </p>
        <Link href="/buy-materials">
          <Button size="lg" variant="primary">
            Explore All Materials
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Your Cart
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            {itemsCount} {itemsCount === 1 ? "material item" : "material items"} ready for site dispatch
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/buy-materials"
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Procurement</span>
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-danger transition-colors ml-4"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear cart</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-card p-6 divide-y divide-border-subtle">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 sticky top-24">
          <CartSummary subtotalKobo={subtotal} />
        </div>
      </div>
    </div>
  );
}

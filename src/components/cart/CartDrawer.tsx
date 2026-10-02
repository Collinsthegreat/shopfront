"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "./CartItemRow";
import { formatMoney } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";

export function CartDrawer(): React.JSX.Element | null {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    subtotal,
    itemsCount,
    isMounted,
  } = useCart();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && isDrawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, setDrawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isDrawerOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isDrawerOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`absolute inset-y-0 right-0 max-w-full w-full sm:max-w-md bg-surface border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-text-primary" />
            <h2 className="text-base font-semibold text-text-primary">
              Shopping Cart
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-border-subtle text-text-secondary font-medium">
              {itemsCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart drawer"
            className="w-9 h-9 flex items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-canvas transition-colors focus-visible:outline-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-border-subtle flex items-center justify-center mb-4 text-text-tertiary">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1">
              Your cart is empty
            </h3>
            <p className="text-sm text-text-secondary max-w-xs mb-6">
              Looks like you haven&apos;t added any minimalist goods to your cart yet.
            </p>
            <Button
              onClick={() => setDrawerOpen(false)}
              variant="primary"
              className="w-full max-w-xs"
            >
              <Link href="/shop" className="w-full h-full flex items-center justify-center">
                Explore Catalog
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 divide-y divide-border-subtle">
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onItemClick={() => setDrawerOpen(false)}
                />
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-border bg-canvas/40 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-semibold text-text-primary tabular-nums">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-text-tertiary">
                  Delivery and taxes calculated at checkout.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full"
                >
                  <Link href="/cart" className="w-full text-center">
                    View Cart
                  </Link>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full"
                >
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-1.5"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

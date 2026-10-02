"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "@/types";
import { formatMoney } from "@/lib/formatters";
import { useCartStore } from "@/lib/cart/store";

export interface CartItemRowProps {
  item: CartItem;
  onItemClick?: () => void;
}

export function CartItemRow({
  item,
  onItemClick,
}: CartItemRowProps): React.JSX.Element {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  const handleDecrease = (): void => {
    updateQuantity(product.id, quantity - 1);
  };

  const handleIncrease = (): void => {
    if (quantity < product.stock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const itemTotalKobo = product.price_kobo * quantity;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border-subtle last:border-b-0">
      <Link
        href={`/product/${product.slug}`}
        onClick={onItemClick}
        className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-canvas rounded-md border border-border-subtle overflow-hidden flex items-center justify-center p-2 group"
      >
        <Image
          src={product.image_url}
          alt={product.name}
          width={80}
          height={80}
          className="object-contain w-full h-full transition-transform group-hover:scale-105"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${product.slug}`}
          onClick={onItemClick}
          className="block text-sm font-medium text-text-primary truncate hover:underline"
        >
          {product.name}
        </Link>
        <p className="text-xs text-text-secondary mt-0.5">
          {formatMoney(product.price_kobo)} each
        </p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-border rounded-md bg-surface">
            <button
              type="button"
              onClick={handleDecrease}
              aria-label={`Decrease quantity of ${product.name}`}
              className="w-8 h-8 min-h-[32px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-accent"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-semibold tabular-nums text-text-primary select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              disabled={quantity >= product.stock}
              aria-label={`Increase quantity of ${product.name}`}
              className="w-8 h-8 min-h-[32px] flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-accent"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-text-primary tabular-nums">
              {formatMoney(itemTotalKobo)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(product.id)}
              aria-label={`Remove ${product.name} from cart`}
              className="p-1.5 text-text-tertiary hover:text-danger transition-colors rounded focus-visible:outline-danger"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

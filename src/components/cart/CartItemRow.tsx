"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "@/types";
import { formatMoney, formatPriceWithUnit } from "@/lib/formatters";
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
  const [localQty, setLocalQty] = useState<string>(quantity.toString());

  useEffect(() => {
    setLocalQty(quantity.toString());
  }, [quantity]);

  const handleDecrease = (): void => {
    updateQuantity(product.id, quantity - 1);
  };

  const handleIncrease = (): void => {
    if (quantity < product.stock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setLocalQty(val);
  };

  const handleInputBlur = (): void => {
    const parsed = parseInt(localQty, 10);
    if (isNaN(parsed) || parsed < 1) {
      setLocalQty("1");
      updateQuantity(product.id, 1);
    } else {
      const clamped = Math.min(parsed, product.stock);
      setLocalQty(clamped.toString());
      updateQuantity(product.id, clamped);
    }
  };

  const itemTotalKobo = product.price_kobo * quantity;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border-subtle last:border-b-0">
      <Link
        href={`/buy-materials/${product.slug}`}
        onClick={onItemClick}
        className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white rounded-lg border border-border-subtle overflow-hidden flex items-center justify-center p-2 group shadow-2xs"
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
          href={`/buy-materials/${product.slug}`}
          onClick={onItemClick}
          className="block text-sm font-semibold uppercase text-text-primary tracking-wide truncate hover:text-accent transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-xs text-text-secondary mt-0.5">
          {formatPriceWithUnit(product.price_kobo, product.unit || "unit")}
        </p>

        <div className="flex items-center justify-between mt-3 gap-2">
          {/* Quantity Controls with Bulk input */}
          <div className="flex items-center border border-border rounded-md bg-surface overflow-hidden">
            <button
              type="button"
              onClick={handleDecrease}
              aria-label={`Decrease quantity of ${product.name}`}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-accent"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={localQty}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-10 sm:w-12 text-center text-xs font-semibold tabular-nums text-text-primary bg-transparent focus:outline-none focus:bg-canvas"
              aria-label={`Quantity of ${product.name}`}
            />
            <button
              type="button"
              onClick={handleIncrease}
              disabled={quantity >= product.stock}
              aria-label={`Increase quantity of ${product.name}`}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-accent"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-text-primary tabular-nums">
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

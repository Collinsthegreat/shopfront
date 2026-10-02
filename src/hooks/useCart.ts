"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart/store";

export function useCart() {
  const store = useCartStore();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    ...store,
    // Only return persisted items once mounted on client to prevent SSR mismatch
    items: mounted ? store.items : [],
    itemsCount: mounted ? store.getTotalItemsCount() : 0,
    subtotal: mounted ? store.getSubtotal() : 0,
    isMounted: mounted,
  };
}

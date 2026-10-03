import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product } from "@/types";

export interface CartStoreState {
  items: CartItem[];
  isDrawerOpen: boolean;
  hasHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  setHasHydrated: (hydrated: boolean) => void;
  getSubtotal: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      hasHydrated: false,

      addItem: (product: Product, quantity = 1): void => {
        if (quantity <= 0 || product.stock <= 0) return;

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.product.id === product.id
        );

        if (existingIndex > -1) {
          const existingItem = currentItems[existingIndex];
          if (!existingItem) return;

          const updatedItems = [...currentItems];
          const targetQty = Math.min(
            existingItem.quantity + quantity,
            product.stock
          );

          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: targetQty,
          };

          set({ items: updatedItems, isDrawerOpen: true });
        } else {
          const initialQty = Math.min(quantity, product.stock);
          set({
            items: [...currentItems, { product, quantity: initialQty }],
            isDrawerOpen: true,
          });
        }
      },

      removeItem: (productId: string): void => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId: string, quantity: number): void => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const currentItems = get().items;
        const updatedItems = currentItems.map((item) => {
          if (item.product.id === productId) {
            const clampedQty = Math.min(quantity, item.product.stock);
            return { ...item, quantity: clampedQty };
          }
          return item;
        });

        set({ items: updatedItems });
      },

      clearCart: (): void => {
        set({ items: [] });
      },

      setDrawerOpen: (open: boolean): void => {
        set({ isDrawerOpen: open });
      },

      toggleDrawer: (): void => {
        set({ isDrawerOpen: !get().isDrawerOpen });
      },

      setHasHydrated: (hydrated: boolean): void => {
        set({ hasHydrated: hydrated });
      },

      getSubtotal: (): number => {
        return get().items.reduce(
          (acc, item) => acc + item.product.price_kobo * item.quantity,
          0
        );
      },

      getTotalItemsCount: (): number => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "buildmart_cart_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

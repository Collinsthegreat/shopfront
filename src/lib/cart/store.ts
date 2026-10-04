import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product } from "@/types";

export interface CartStoreState {
  items: CartItem[];
  isDrawerOpen: boolean;
  hasHydrated: boolean;
  isAuthenticated: boolean;
  isSyncing: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  setServerItems: (items: CartItem[]) => void;
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
      isAuthenticated: false,
      isSyncing: false,

      setIsAuthenticated: (authenticated: boolean): void => {
        set({ isAuthenticated: authenticated });
      },

      setServerItems: (items: CartItem[]): void => {
        set({ items, isSyncing: false });
      },

      addItem: (product: Product, quantity = 1): void => {
        if (quantity <= 0 || product.stock <= 0) return;

        const previousItems = get().items;
        const existingIndex = previousItems.findIndex(
          (item) => item.product.id === product.id
        );

        let updatedItems: CartItem[];
        if (existingIndex > -1) {
          const existingItem = previousItems[existingIndex];
          if (!existingItem) return;

          const targetQty = Math.min(
            existingItem.quantity + quantity,
            product.stock
          );

          updatedItems = [...previousItems];
          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: targetQty,
          };
        } else {
          const initialQty = Math.min(quantity, product.stock);
          updatedItems = [...previousItems, { product, quantity: initialQty }];
        }

        // Optimistic UI update
        set({ items: updatedItems, isDrawerOpen: true });

        // If authenticated, sync with server
        if (get().isAuthenticated && typeof window !== "undefined") {
          set({ isSyncing: true });
          fetch("/api/cart/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id, quantity }),
          })
            .then(async (res) => {
              if (!res.ok) {
                // Rollback on failure
                set({ items: previousItems, isSyncing: false });
                return;
              }
              const json = await res.json();
              if (json?.data?.items) {
                const serverItems: CartItem[] = json.data.items.map(
                  (item: { product: Product; quantity: number }) => ({
                    product: item.product,
                    quantity: item.quantity,
                  })
                );
                set({ items: serverItems, isSyncing: false });
              }
            })
            .catch(() => {
              // Rollback on network error
              set({ items: previousItems, isSyncing: false });
            });
        }
      },

      removeItem: (productId: string): void => {
        const previousItems = get().items;
        const updatedItems = previousItems.filter((item) => item.product.id !== productId);

        // Optimistic update
        set({ items: updatedItems });

        // If authenticated, sync with server
        if (get().isAuthenticated && typeof window !== "undefined") {
          set({ isSyncing: true });
          fetch(`/api/cart/items/${encodeURIComponent(productId)}`, {
            method: "DELETE",
          })
            .then(async (res) => {
              if (!res.ok) {
                // Rollback
                set({ items: previousItems, isSyncing: false });
                return;
              }
              const json = await res.json();
              if (json?.data?.items) {
                const serverItems: CartItem[] = json.data.items.map(
                  (item: { product: Product; quantity: number }) => ({
                    product: item.product,
                    quantity: item.quantity,
                  })
                );
                set({ items: serverItems, isSyncing: false });
              }
            })
            .catch(() => {
              set({ items: previousItems, isSyncing: false });
            });
        }
      },

      updateQuantity: (productId: string, quantity: number): void => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const previousItems = get().items;
        const updatedItems = previousItems.map((item) => {
          if (item.product.id === productId) {
            const clampedQty = Math.min(quantity, item.product.stock);
            return { ...item, quantity: clampedQty };
          }
          return item;
        });

        // Optimistic update
        set({ items: updatedItems });

        // If authenticated, sync with server
        if (get().isAuthenticated && typeof window !== "undefined") {
          set({ isSyncing: true });
          fetch(`/api/cart/items/${encodeURIComponent(productId)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
          })
            .then(async (res) => {
              if (!res.ok) {
                set({ items: previousItems, isSyncing: false });
                return;
              }
              const json = await res.json();
              if (json?.data?.items) {
                const serverItems: CartItem[] = json.data.items.map(
                  (item: { product: Product; quantity: number }) => ({
                    product: item.product,
                    quantity: item.quantity,
                  })
                );
                set({ items: serverItems, isSyncing: false });
              }
            })
            .catch(() => {
              set({ items: previousItems, isSyncing: false });
            });
        }
      },

      clearCart: (): void => {
        const previousItems = get().items;

        // Optimistic update
        set({ items: [] });

        // If authenticated, sync with server
        if (get().isAuthenticated && typeof window !== "undefined") {
          set({ isSyncing: true });
          fetch("/api/cart", {
            method: "DELETE",
          })
            .then(async (res) => {
              if (!res.ok) {
                set({ items: previousItems, isSyncing: false });
                return;
              }
              set({ items: [], isSyncing: false });
            })
            .catch(() => {
              set({ items: previousItems, isSyncing: false });
            });
        }
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

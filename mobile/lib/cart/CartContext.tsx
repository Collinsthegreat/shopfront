import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../supabase/client';
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeGuestCart,
} from '../api/client';
import { CartItem, CartResponse, Product } from '../api/types';

interface GuestCartItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface CartContextType {
  items: CartItem[];
  subtotalKobo: number;
  itemCount: number;
  isLoading: boolean;
  isRealtimeConnected: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>([]);
  const hasMergedGuestCart = useRef(false);

  const cartQueryKey = ['cart', user?.id || 'guest'];

  // 1. Fetch Server Cart for authenticated user
  const {
    data: serverCart,
    isLoading: isServerCartLoading,
    refetch,
  } = useQuery<CartResponse>({
    queryKey: cartQueryKey,
    queryFn: fetchCart,
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: isRealtimeConnected ? false : 5000, // 5s fallback polling when realtime disconnected
  });

  // 2. Realtime Subscription on cart_items table
  useEffect(() => {
    if (!user) {
      setIsRealtimeConnected(false);
      return;
    }

    const channelName = `mobile-cart-${user.id}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate cache immediately on any server-side change
          queryClient.invalidateQueries({ queryKey: cartQueryKey });
        }
      )
      .subscribe((status) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // 3. AppState change listener (Refetch when returning to foreground)
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active' && user) {
        queryClient.invalidateQueries({ queryKey: cartQueryKey });
      }
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [user, queryClient]);

  // 4. Merge Guest Cart upon login
  useEffect(() => {
    if (user && guestCart.length > 0 && !hasMergedGuestCart.current) {
      hasMergedGuestCart.current = true;
      const itemsToMerge = guestCart.map((g) => ({
        productId: g.productId,
        quantity: g.quantity,
      }));

      mergeGuestCart(itemsToMerge)
        .then(() => {
          setGuestCart([]);
          queryClient.invalidateQueries({ queryKey: cartQueryKey });
        })
        .catch((err) => {
          console.error('Failed to merge guest cart:', err);
        })
        .finally(() => {
          hasMergedGuestCart.current = false;
        });
    }
  }, [user, guestCart, queryClient]);

  // 5. Mutations for Server Cart
  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });

  // Client actions
  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      if (user) {
        await addMutation.mutateAsync({ productId: product.id, quantity });
      } else {
        setGuestCart((prev) => {
          const existing = prev.find((item) => item.productId === product.id);
          if (existing) {
            return prev.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                : item
            );
          }
          return [...prev, { productId: product.id, quantity, product }];
        });
      }
    },
    [user, addMutation]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (user) {
        if (quantity <= 0) {
          await removeMutation.mutateAsync(productId);
        } else {
          await updateMutation.mutateAsync({ productId, quantity });
        }
      } else {
        setGuestCart((prev) => {
          if (quantity <= 0) {
            return prev.filter((item) => item.productId !== productId);
          }
          return prev.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );
        });
      }
    },
    [user, updateMutation, removeMutation]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (user) {
        await removeMutation.mutateAsync(productId);
      } else {
        setGuestCart((prev) => prev.filter((item) => item.productId !== productId));
      }
    },
    [user, removeMutation]
  );

  const clear = useCallback(async () => {
    if (user) {
      await clearMutation.mutateAsync();
    } else {
      setGuestCart([]);
    }
  }, [user, clearMutation]);

  // Derived state
  let items: CartItem[] = [];
  let subtotalKobo = 0;
  let itemCount = 0;

  if (user) {
    items = serverCart?.items || [];
    subtotalKobo = serverCart?.subtotal_kobo || 0;
    itemCount = serverCart?.item_count || 0;
  } else {
    items = guestCart.map((g) => ({
      id: `guest-${g.productId}`,
      product_id: g.productId,
      quantity: g.quantity,
      name: g.product.name,
      price_kobo: g.product.price_kobo,
      unit: g.product.unit,
      image_url: g.product.image_url,
      stock: g.product.stock,
      line_total_kobo: g.product.price_kobo * g.quantity,
    }));
    subtotalKobo = items.reduce((sum, item) => sum + item.line_total_kobo, 0);
    itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        subtotalKobo,
        itemCount,
        isLoading: user ? isServerCartLoading : false,
        isRealtimeConnected,
        addItem,
        updateQuantity,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/lib/cart/store";
import { createClient } from "@/lib/supabase/client";
import { CartItem, Product } from "@/types";

export function CartSyncProvider(): null {
  const { user } = useAuth();
  const supabase = createClient();
  const isRealtimeConnected = useRef<boolean>(false);
  const isMergingRef = useRef<boolean>(false);

  const fetchServerCart = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const json = await res.json();
      if (json?.data?.items) {
        const serverItems: CartItem[] = json.data.items.map(
          (item: { product: Product; quantity: number }) => ({
            product: item.product,
            quantity: item.quantity,
          })
        );
        useCartStore.getState().setServerItems(serverItems);
      }
    } catch (err) {
      console.error("[CartSync] Error fetching server cart:", err);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      useCartStore.getState().setIsAuthenticated(false);
      return;
    }

    useCartStore.getState().setIsAuthenticated(true);

    // Initial sign-in merge & fetch
    const initSync = async () => {
      if (isMergingRef.current) return;
      isMergingRef.current = true;

      try {
        const localItems = useCartStore.getState().items;
        if (localItems.length > 0) {
          const mergePayload = {
            items: localItems.map((it) => ({
              productId: it.product.id,
              quantity: it.quantity,
            })),
          };

          const mergeRes = await fetch("/api/cart/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mergePayload),
          });

          if (mergeRes.ok) {
            const json = await mergeRes.json();
            if (json?.data?.items) {
              const serverItems: CartItem[] = json.data.items.map(
                (item: { product: Product; quantity: number }) => ({
                  product: item.product,
                  quantity: item.quantity,
                })
              );
              useCartStore.getState().setServerItems(serverItems);
              return;
            }
          }
        }

        // Otherwise fetch existing server cart
        await fetchServerCart();
      } finally {
        isMergingRef.current = false;
      }
    };

    initSync();

    // Subscribe to Supabase Realtime channel on table cart_items
    const channelName = `cart_sync_web_${user.id}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Reconcile by refetching GET /api/cart
          fetchServerCart();
        }
      )
      .subscribe((status) => {
        isRealtimeConnected.current = status === "SUBSCRIBED";
      });

    // Re-fetch on tab focus and network reconnect
    const handleFocus = () => fetchServerCart();
    const handleOnline = () => fetchServerCart();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);

    // Polling fallback every 5 seconds if Realtime is disconnected
    const pollTimer = setInterval(() => {
      if (!isRealtimeConnected.current) {
        fetchServerCart();
      }
    }, 5000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
      clearInterval(pollTimer);
      channel.unsubscribe();
    };
  }, [user, fetchServerCart, supabase]);

  return null;
}

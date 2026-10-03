"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { OrderWithItems } from "@/types";
import { formatMoney, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export function OrdersListClient(): React.JSX.Element {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth/login?returnTo=/orders");
          return;
        }
        throw new Error("Failed to load your order history.");
      }
      const data = await res.json();
      setOrders(data.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load orders";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/orders");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [authLoading, user, router, fetchOrders]);

  if (authLoading || (loading && !error)) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Error Loading Orders</h2>
        <p className="text-xs text-text-secondary">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchOrders}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            My Orders
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Order history and delivery status for {user?.email}
          </p>
        </div>
        <Link href="/buy-materials">
          <Button variant="outline" size="sm">
            <span>Continue Procurement</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-border rounded-card bg-surface/50 max-w-md mx-auto px-6">
          <div className="w-14 h-14 rounded-full bg-border-subtle flex items-center justify-center mx-auto mb-4 text-text-tertiary">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">
            No orders placed yet
          </h3>
          <p className="text-xs text-text-secondary mb-6 leading-relaxed">
            When you place an order with Pay on Delivery, your confirmation and tracking details will appear here.
          </p>
          <Link href="/buy-materials">
            <Button variant="primary" size="md">
              <ShoppingBag className="w-4 h-4 mr-2" />
              <span>Explore Materials</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount = order.items?.reduce(
              (acc, it) => acc + it.quantity,
              0
            ) || 0;

            return (
              <div
                key={order.id}
                className="bg-surface border border-border rounded-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-text-secondary/50 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-text-primary">
                      {order.order_number}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {order.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-text-secondary">
                    Placed on {formatDate(order.created_at)} • {itemCount}{" "}
                    {itemCount === 1 ? "item" : "items"}
                  </p>

                  <p className="text-xs text-text-tertiary truncate max-w-md">
                    Deliver to: {order.customer_name}, {order.city}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-border-subtle">
                  <div className="text-right">
                    <span className="text-[11px] text-text-tertiary block">
                      Total Due (POD)
                    </span>
                    <span className="text-base font-bold text-text-primary tabular-nums">
                      {formatMoney(order.total)}
                    </span>
                  </div>

                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

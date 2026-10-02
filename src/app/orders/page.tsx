import React, { Suspense } from "react";
import { Metadata } from "next";
import { OrdersListClient } from "./OrdersListClient";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your past orders, delivery status, and confirmation receipts.",
};

export default function OrdersPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-card" />
            ))}
          </div>
        </div>
      }
    >
      <OrdersListClient />
    </Suspense>
  );
}

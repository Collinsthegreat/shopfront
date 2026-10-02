import React, { Suspense } from "react";
import { Metadata } from "next";
import { ShopClient } from "./ShopClient";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete catalog of minimalist everyday carry and home essentials.",
};

export default function ShopPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-card" />
            ))}
          </div>
        </div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}

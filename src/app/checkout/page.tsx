import React, { Suspense } from "react";
import { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Secure Checkout",
  description: "Complete your order with Pay on Delivery.",
};

export default function CheckoutPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-card" />
              <Skeleton className="h-48 w-full rounded-card" />
            </div>
            <Skeleton className="h-80 w-full rounded-card" />
          </div>
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}

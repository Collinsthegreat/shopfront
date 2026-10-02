import React, { Suspense } from "react";
import { Metadata } from "next";
import { OrderConfirmationClient } from "./OrderConfirmationClient";
import { Skeleton } from "@/components/ui/Skeleton";

interface Props {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Review your confirmed order details and status.",
};

export default function OrderConfirmationPage({ params }: Props): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <Skeleton className="h-12 w-3/4 mx-auto rounded-md" />
          <Skeleton className="h-64 w-full rounded-card" />
        </div>
      }
    >
      <OrderConfirmationClient orderId={params.id} />
    </Suspense>
  );
}

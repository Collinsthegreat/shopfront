import React, { Suspense } from "react";
import { Metadata } from "next";
import { LoginPageClient } from "./LoginPageClient";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in with Google to complete your checkout and manage orders.",
};

export default function LoginPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-surface border border-border rounded-card p-8 space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}

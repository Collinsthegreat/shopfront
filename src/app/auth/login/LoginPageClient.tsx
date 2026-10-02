"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { STORE_NAME } from "@/lib/constants";

export function LoginPageClient(): React.JSX.Element {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/checkout";
  const errorParam = searchParams.get("error");

  const { signInWithGoogle, user } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam ? "Sign-in was interrupted or could not be completed. Please try again." : null
  );

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      setIsSigningIn(true);
      setErrorMessage(null);
      await signInWithGoogle(returnTo);
    } catch (err: unknown) {
      console.error("Sign-in error:", err);
      const msg = err instanceof Error ? err.message : "Failed to initiate Google sign-in";
      setErrorMessage(msg);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface border border-border rounded-card p-8 shadow-card space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to shop</span>
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              {STORE_NAME} Account
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Sign in to continue
          </h1>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            Browsing and cart are open to everyone. Sign-in is only needed to place orders, track shipments, and view order confirmations.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-md bg-danger-bg border border-danger/20 flex items-start gap-3 text-xs text-danger">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {user ? (
          <div className="p-4 rounded-md bg-canvas border border-border-subtle space-y-3">
            <p className="text-xs text-text-secondary">
              You are currently signed in as:
            </p>
            <p className="text-sm font-medium text-text-primary">
              {user.email}
            </p>
            <Link href={returnTo} className="block w-full">
              <Button className="w-full" variant="primary">
                Continue to Checkout
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full bg-surface hover:bg-canvas text-text-primary border-border flex items-center justify-center gap-3 py-3"
              onClick={handleGoogleSignIn}
              isLoading={isSigningIn}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-text-tertiary">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-text-secondary" />
              <span>
                Your cart will be preserved. Fast, secure authentication via Google OAuth.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

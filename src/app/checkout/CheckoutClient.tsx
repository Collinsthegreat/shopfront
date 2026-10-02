"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { checkoutFormSchema, CheckoutFormValues } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/formatters";
import { FLAT_DELIVERY_FEE_KOBO } from "@/lib/constants";
import { Skeleton } from "@/components/ui/Skeleton";

export function CheckoutClient(): React.JSX.Element {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, clearCart, isMounted } = useCart();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Client-generated unique idempotency key for this session
  const [idempotencyKey] = useState<string>(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `idem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      note: "",
    },
  });

  // Pre-fill user name if signed in
  useEffect(() => {
    if (user?.fullName) {
      setValue("fullName", user.fullName);
    }
  }, [user, setValue]);

  // Auth gate: redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/checkout");
    }
  }, [authLoading, user, router]);

  if (authLoading || !isMounted) {
    return (
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
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm text-text-secondary">
          Redirecting to Google sign in...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-border-subtle flex items-center justify-center mx-auto text-text-tertiary">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-text-primary">Your cart is empty</h1>
          <p className="text-sm text-text-secondary">
            You must have at least one product in your cart before checking out.
          </p>
        </div>
        <Link href="/shop">
          <Button variant="primary">Browse Catalog</Button>
        </Link>
      </div>
    );
  }

  const deliveryFee = FLAT_DELIVERY_FEE_KOBO;
  const grandTotal = subtotal + deliveryFee;

  const onSubmit = async (data: CheckoutFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      setApiError(null);

      const payload = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        delivery: data,
        idempotencyKey,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(
          resJson.error ||
            "Unable to complete your order at this time. Please try again."
        );
      }

      const order = resJson.data;

      // Clear the local cart now that order is confirmed
      clearCart();

      // Redirect to confirmation page
      router.push(`/orders/${order.id}?emailSent=${resJson.emailSent ? "1" : "0"}`);
    } catch (err: unknown) {
      console.error("Order submission error:", err);
      const msg = err instanceof Error ? err.message : "Failed to place order";
      setApiError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to cart</span>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Checkout
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Signed in as <strong className="text-text-primary">{user.email}</strong>.
          Payment is collected upon doorstep delivery.
        </p>
      </div>

      {apiError && (
        <div className="p-4 rounded-card bg-danger-bg border border-danger/30 flex items-start gap-3 text-sm text-danger">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Unable to place order</p>
            <p className="text-xs">{apiError}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
      >
        {/* Delivery Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-border-subtle pb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                1. Delivery Address
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Where should we courier your items?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Chinelo Okonkwo"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
              </div>

              <div className="sm:col-span-1">
                <Input
                  label="Phone Number *"
                  placeholder="e.g. 08012345678"
                  type="tel"
                  error={errors.phone?.message}
                  helperText="Courier will call before arrival"
                  {...register("phone")}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Street Address *"
                  placeholder="House number, street name, estate"
                  error={errors.address?.message}
                  {...register("address")}
                />
              </div>

              <div className="sm:col-span-1">
                <Input
                  label="City / Area *"
                  placeholder="e.g. Ikeja, Lekki, Wuse 2"
                  error={errors.city?.message}
                  {...register("city")}
                />
              </div>

              <div className="sm:col-span-1">
                <Input
                  label="State *"
                  placeholder="e.g. Lagos, Abuja, Rivers"
                  error={errors.state?.message}
                  {...register("state")}
                />
              </div>

              <div className="sm:col-span-2">
                <Textarea
                  label="Delivery Note (Optional)"
                  placeholder="Landmark directions, gate code, or specific drop-off instructions"
                  error={errors.note?.message}
                  {...register("note")}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="bg-surface border border-border rounded-card p-6 sm:p-8 space-y-4">
            <div className="border-b border-border-subtle pb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                2. Payment Method
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Simulated transparent payment. No credit card details required.
              </p>
            </div>

            <div className="p-4 rounded-md border border-accent bg-surface flex items-start gap-4">
              <div className="w-5 h-5 rounded-full border-4 border-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">
                    Pay On Delivery (POD)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-border-subtle text-text-secondary font-medium uppercase">
                    Zero Risk
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Pay with Cash or instant Bank Transfer when the courier brings your package. You are encouraged to inspect goods before payment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Submit Column */}
        <div className="lg:col-span-1 sticky top-24 space-y-6">
          <div className="bg-surface border border-border rounded-card p-6 space-y-6 shadow-xs">
            <h3 className="text-base font-semibold text-text-primary">
              Order Review
            </h3>

            {/* Compact Items List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-border-subtle text-xs">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="pt-2 first:pt-0 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-text-primary truncate">
                      {item.product.name}
                    </p>
                    <p className="text-text-tertiary">
                      Qty: {item.quantity} × {formatMoney(item.product.price_kobo)}
                    </p>
                  </div>
                  <span className="font-semibold text-text-primary tabular-nums">
                    {formatMoney(item.product.price_kobo * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border-subtle pt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-medium text-text-primary tabular-nums">
                  {formatMoney(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-text-tertiary" />
                  <span>Delivery</span>
                </span>
                <span className="font-medium text-text-primary tabular-nums">
                  {formatMoney(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-border-subtle pt-3 flex items-center justify-between font-bold text-base text-text-primary">
                <span>Total Due</span>
                <span className="text-lg tabular-nums">
                  {formatMoney(grandTotal)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting || items.length === 0}
            >
              <span>Place Order • {formatMoney(grandTotal)}</span>
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-text-tertiary text-center">
              <ShieldCheck className="w-4 h-4 text-text-secondary" />
              <span>Inspection allowed upon arrival</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

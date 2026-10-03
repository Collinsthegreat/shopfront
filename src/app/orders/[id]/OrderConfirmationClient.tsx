"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Mail,
  RotateCw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { OrderWithItems } from "@/types";
import { formatMoney, formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface Props {
  orderId: string;
}

export function OrderConfirmationClient({ orderId }: Props): React.JSX.Element {
  const searchParams = useSearchParams();
  const emailSentParam = searchParams.get("emailSent");

  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [resendingEmail, setResendingEmail] = useState<boolean>(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(
    emailSentParam === "0"
      ? {
          type: "error",
          text: "We created your order, but your confirmation email couldn't be delivered automatically. If your store uses a Mailgun sandbox domain, ensure your recipient address is authorized.",
        }
      : null
  );

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Order not found or you do not have permission to view it.");
        }
        if (res.status === 401) {
          throw new Error("Please sign in to view this order.");
        }
        throw new Error("Failed to load order details.");
      }
      const data = await res.json();
      setOrder(data.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load order";
      setFetchError(msg);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleResendEmail = async (): Promise<void> => {
    try {
      setResendingEmail(true);
      setEmailStatusMessage(null);

      const res = await fetch(`/api/orders/${orderId}/resend-email`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Unable to resend email. If using a Mailgun sandbox domain, make sure your recipient email is verified in Mailgun Authorized Recipients."
        );
      }

      setEmailStatusMessage({
        type: "success",
        text: "Confirmation email sent successfully! Please check your inbox and spam folder.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend email";
      setEmailStatusMessage({
        type: "error",
        text: msg,
      });
    } finally {
      setResendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <Skeleton className="h-12 w-3/4 mx-auto rounded-md" />
        <Skeleton className="h-64 w-full rounded-card" />
      </div>
    );
  }

  if (fetchError || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Order Not Accessible</h2>
        <p className="text-xs text-text-secondary">
          {fetchError || "Could not retrieve order details."}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/orders">
            <Button variant="outline" size="sm">View My Orders</Button>
          </Link>
          <Link href="/buy-materials">
            <Button variant="primary" size="sm">Back to Materials</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Hero */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-border-subtle flex items-center justify-center mx-auto text-text-primary">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <Badge variant="accent" className="text-xs">
          Order Confirmed
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Thank you for your order!
        </h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Your order reference is <strong className="text-text-primary">{order.order_number}</strong>.
          We will contact you upon dispatch.
        </p>
      </div>

      {/* Email Status Alert Banner */}
      {emailStatusMessage && (
        <div
          className={`p-4 rounded-card border flex items-start justify-between gap-3 text-xs ${
            emailStatusMessage.type === "success"
              ? "bg-surface border-border text-text-primary"
              : "bg-danger-bg border-danger/30 text-danger"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {emailStatusMessage.type === "success" ? (
              <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-text-primary" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{emailStatusMessage.text}</p>
          </div>
          <Button
            size="sm"
            variant={emailStatusMessage.type === "success" ? "outline" : "danger"}
            onClick={handleResendEmail}
            isLoading={resendingEmail}
            className="flex-shrink-0 text-xs"
          >
            <RotateCw className="w-3.5 h-3.5 mr-1" />
            <span>Resend Email</span>
          </Button>
        </div>
      )}

      {/* Order Details Card */}
      <div className="bg-surface border border-border rounded-card overflow-hidden shadow-xs divide-y divide-border-subtle">
        {/* Order Header Meta */}
        <div className="p-6 bg-canvas/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Order Number
            </span>
            <p className="text-lg font-bold text-text-primary tracking-tight">
              {order.order_number}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-text-tertiary block">Date Placed</span>
              <span className="font-medium text-text-primary">
                {formatDate(order.created_at)}
              </span>
            </div>
            <Badge variant="outline" className="capitalize">
              {order.status}
            </Badge>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="p-6 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Items Ordered
          </h3>
          <div className="divide-y divide-border-subtle">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-semibold uppercase text-text-primary">
                    {item.name_snapshot}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {item.quantity} {item.unit_snapshot || "unit"}{item.quantity > 1 ? "s" : ""} @ {formatMoney(item.unit_price_snapshot)} / {item.unit_snapshot || "unit"}
                  </p>
                </div>
                <span className="font-semibold text-text-primary tabular-nums">
                  {formatMoney(item.unit_price_snapshot * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="p-6 bg-canvas/20">
          <div className="max-w-xs ml-auto space-y-2 text-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span>Materials Subtotal</span>
              <span className="font-medium text-text-primary tabular-nums">
                {formatMoney(order.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>Site Logistics & Haulage</span>
              <span className="font-medium text-text-primary tabular-nums">
                {formatMoney(order.delivery_fee)}
              </span>
            </div>
            <div className="border-t border-border-subtle pt-2 flex items-center justify-between font-bold text-base text-text-primary">
              <span>Total (Pay on Site Offloading)</span>
              <span className="tabular-nums text-accent">{formatMoney(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details Section */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1 text-xs">
            <span className="font-semibold uppercase tracking-wider text-text-secondary block">
              Site Receiver & Contact
            </span>
            <p className="text-text-primary font-medium">{order.customer_name}</p>
            <p className="text-text-secondary">{order.phone}</p>
          </div>

          <div className="space-y-1 text-xs">
            <span className="font-semibold uppercase tracking-wider text-text-secondary block">
              Site Offloading Address
            </span>
            <p className="text-text-primary leading-relaxed">
              {order.address}, {order.city}, {order.state}
            </p>
            {order.note && (
              <p className="text-text-tertiary italic pt-1">
                Note: {order.note}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Offloading inspection allowed prior to payment</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendEmail}
              isLoading={resendingEmail}
              className="flex-1 sm:flex-initial"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              <span>Resend Confirmation Email</span>
            </Button>
            <Link href="/orders" className="flex-1 sm:flex-initial">
              <Button variant="primary" size="sm" className="w-full">
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { formatMoney } from "@/lib/formatters";
import { FLAT_DELIVERY_FEE_KOBO } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export interface CartSummaryProps {
  subtotalKobo: number;
  deliveryFeeKobo?: number;
  showCheckoutButton?: boolean;
  isCheckingOut?: boolean;
  onCheckoutClick?: () => void;
}

export function CartSummary({
  subtotalKobo,
  deliveryFeeKobo = FLAT_DELIVERY_FEE_KOBO,
  showCheckoutButton = true,
  isCheckingOut = false,
  onCheckoutClick,
}: CartSummaryProps): React.JSX.Element {
  const totalKobo = subtotalKobo + (subtotalKobo > 0 ? deliveryFeeKobo : 0);

  return (
    <div className="bg-surface border border-border rounded-card p-6 space-y-6">
      <h3 className="text-base font-semibold text-text-primary">
        Order Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="font-medium text-text-primary tabular-nums">
            {formatMoney(subtotalKobo)}
          </span>
        </div>

        <div className="flex items-center justify-between text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-accent" />
            <span>Site Logistics & Haulage</span>
          </span>
          <span className="font-medium text-text-primary tabular-nums">
            {subtotalKobo > 0 ? formatMoney(deliveryFeeKobo) : formatMoney(0)}
          </span>
        </div>

        <div className="border-t border-border-subtle pt-3 flex items-center justify-between text-base font-semibold text-text-primary">
          <span>Estimated Total</span>
          <span className="text-lg tabular-nums">
            {formatMoney(totalKobo)}
          </span>
        </div>
      </div>

      <div className="p-3.5 bg-canvas rounded-md border border-border-subtle flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <p className="font-medium text-text-primary">Pay on Site Offloading</p>
          <p className="text-text-secondary leading-relaxed">
            Inspection upon offloading. Direct bank transfer or certified draft accepted once materials are verified on site.
          </p>
        </div>
      </div>

      {showCheckoutButton && (
        <div>
          {onCheckoutClick ? (
            <Button
              onClick={onCheckoutClick}
              disabled={subtotalKobo === 0}
              isLoading={isCheckingOut}
              className="w-full"
              size="lg"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Link
              href={subtotalKobo === 0 ? "#" : "/checkout"}
              className={`w-full block ${
                subtotalKobo === 0 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Button className="w-full" size="lg" disabled={subtotalKobo === 0}>
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

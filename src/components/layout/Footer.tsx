import React from "react";
import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";

export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
              <span className="text-base font-bold text-text-primary tracking-tight">
                {STORE_NAME}
              </span>
            </div>
            <p className="text-xs text-text-secondary max-w-sm leading-relaxed">
              Thoughtfully engineered everyday carry and refined desktop essentials.
              Curated for longevity, tactile satisfaction, and minimalist utility.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/shop?category=carry" className="hover:text-text-primary transition-colors">
                  Everyday Carry
                </Link>
              </li>
              <li>
                <Link href="/shop?category=stationery" className="hover:text-text-primary transition-colors">
                  Stationery & Writing
                </Link>
              </li>
              <li>
                <Link href="/shop?category=desk" className="hover:text-text-primary transition-colors">
                  Desk & Workspace
                </Link>
              </li>
              <li>
                <Link href="/shop?category=living" className="hover:text-text-primary transition-colors">
                  Refined Living
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Commitment
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              All orders are delivered directly to your doorstep with our Pay on Delivery assurance. Inspect your items before finalizing payment.
            </p>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
          <p>© {new Date().getFullYear()} {STORE_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Fast Nationwide Delivery</span>
            <span>•</span>
            <span>Pay on Delivery</span>
            <span>•</span>
            <span>Authentic Craftsmanship</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

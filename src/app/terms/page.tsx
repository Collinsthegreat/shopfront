import React from "react";
import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";

export const metadata = {
  title: `Terms of Service | ${STORE_NAME}`,
  description: "Shopfront Terms of Service.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-foreground">
      <h1 className="text-3xl font-semibold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-4">Last updated: October 2026</p>
      
      <div className="space-y-6 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-medium text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing {STORE_NAME}, you agree to these terms of service and simulated checkout policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-2">2. Payment & Delivery</h2>
          <p>
            Payments are simulated (Pay on Delivery). No real banking or credit card details are collected or processed.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-border">
        <Link href="/" className="text-accent underline text-sm">
          Return to Shopfront
        </Link>
      </div>
    </div>
  );
}

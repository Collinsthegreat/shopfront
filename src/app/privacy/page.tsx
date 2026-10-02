import React from "react";
import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";

export const metadata = {
  title: `Privacy Policy | ${STORE_NAME}`,
  description: "Shopfront Privacy Policy and data protection details.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-foreground">
      <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">Last updated: October 2026</p>
      
      <div className="space-y-6 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-medium text-foreground mb-2">1. Overview</h2>
          <p>
            {STORE_NAME} values your privacy. We only collect the minimal personal information required to authenticate your account and process simulated delivery orders.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-2">2. Information We Collect</h2>
          <p>
            When you sign in using Google, we access basic profile details (your name and email address) via OAuth 2.0 to identify your account and order history. During checkout, we collect delivery details (name, phone, physical address, city, and state).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-2">3. How Information is Used</h2>
          <p>
            Your information is used strictly to fulfill simulated orders, display order tracking history, and dispatch order confirmation emails via Mailgun. We never sell or share your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-2">4. Contact</h2>
          <p>
            For privacy inquiries, please contact our support team.
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

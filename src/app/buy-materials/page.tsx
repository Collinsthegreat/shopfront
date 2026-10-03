import React, { Suspense } from "react";
import { Metadata } from "next";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { MarketplaceClient } from "./MarketplaceClient";
import { STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Marketplace | ${STORE_NAME} — Buy Construction Materials in Nigeria`,
  description:
    "Browse authentic construction materials: cement, rebar, hollow blocks, aggregates, roofing sheets, and tiles with authoritative pricing and site delivery.",
  openGraph: {
    title: `Marketplace | ${STORE_NAME}`,
    description: "Authentic building materials with transparent pricing in Nigeria.",
  },
};

export default async function BuyMaterialsPage(): Promise<React.JSX.Element> {
  // Use static initial products catalogue (or DB in API)
  const products = INITIAL_PRODUCTS;

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-text-secondary">
          Loading building materials marketplace...
        </div>
      }
    >
      <MarketplaceClient initialProducts={products} />
    </Suspense>
  );
}

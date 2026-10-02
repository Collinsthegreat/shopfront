import React from "react";
import { Metadata } from "next";
import { CartPageClient } from "./CartPageClient";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View and edit your selected items before proceeding to checkout.",
};

export default function CartPage(): React.JSX.Element {
  return <CartPageClient />;
}

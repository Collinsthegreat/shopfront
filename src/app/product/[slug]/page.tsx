import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { ProductDetailClient } from "./ProductDetailClient";
import { STORE_NAME } from "@/lib/constants";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = INITIAL_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | ${STORE_NAME}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${STORE_NAME}`,
      description: product.description,
      images: [{ url: product.image_url }],
    },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps): React.JSX.Element {
  const product = INITIAL_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

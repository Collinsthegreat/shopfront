import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { ProductDetailClient } from "./ProductDetailClient";
import { STORE_NAME, CURRENCY } from "@/lib/constants";

export interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = INITIAL_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: `Product Not Found | ${STORE_NAME}`,
    };
  }

  const priceNaira = product.price_kobo / CURRENCY.minorUnitRatio;

  return {
    title: `${product.name} | ${STORE_NAME}`,
    description: product.short_description || product.description,
    openGraph: {
      title: `${product.name} — ${STORE_NAME}`,
      description: `${product.description} · Price: ₦${priceNaira.toLocaleString("en-NG")} / ${product.unit}`,
      images: [
        {
          url: product.image_url,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps): Promise<React.JSX.Element> {
  const product = INITIAL_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = INITIAL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image_url,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || STORE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: `https://shopfront-green.vercel.app/buy-materials/${product.slug}`,
      priceCurrency: "NGN",
      price: (product.price_kobo / 100).toFixed(2),
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}

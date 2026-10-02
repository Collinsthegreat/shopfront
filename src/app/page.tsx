import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Clock, PackageCheck } from "lucide-react";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { CATEGORIES } from "@/lib/constants";

export default function HomePage(): React.JSX.Element {
  const featuredProducts = INITIAL_PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-surface/50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border-subtle text-text-secondary text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-text-primary" />
            <span>Refined Everyday Carry & Workspaces</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-text-primary max-w-3xl mx-auto text-balance">
            Objects of purpose and permanence.
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed text-balance">
            Crafted from solid brass, Italian leather, stoneware, and waxed canvas. Designed for tactile pleasure and everyday utility.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto h-12 px-8 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop?category=carry"
              className="w-full sm:w-auto h-12 px-6 rounded-md border border-border bg-surface hover:bg-canvas text-text-primary font-medium text-sm flex items-center justify-center transition-colors"
            >
              Browse Everyday Carry
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-border-subtle pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Featured Essentials
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Hand-picked staples designed to elevate your daily routine.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-primary hover:underline"
          >
            <span>View all products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-border-subtle pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Curated Categories
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Explore our curated catalog across purposeful categories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.filter((c) => c.slug !== "all").map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group p-6 bg-surface border border-border rounded-card hover:border-text-secondary/60 transition-colors flex flex-col justify-between h-44"
            >
              <div>
                <span className="text-[11px] uppercase tracking-wider text-text-tertiary">
                  Category
                </span>
                <h3 className="text-lg font-semibold text-text-primary group-hover:underline mt-1">
                  {category.name}
                </h3>
              </div>
              <div className="flex items-center justify-between text-xs text-text-secondary group-hover:text-text-primary">
                <span>Browse Category</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Proposition & Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-surface border border-border rounded-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-canvas border border-border flex items-center justify-center flex-shrink-0 text-text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-text-primary">
                Pay On Delivery
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Inspect your items before handing over payment. Cash or instant transfer.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-canvas border border-border flex items-center justify-center flex-shrink-0 text-text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-text-primary">
                Fast Courier Dispatch
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Orders are processed and dispatched within 24 hours nationwide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-canvas border border-border flex items-center justify-center flex-shrink-0 text-text-primary">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-text-primary">
                Lasting Craftsmanship
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Materials chosen for their ability to age gracefully with everyday wear.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

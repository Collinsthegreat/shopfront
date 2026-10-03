import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, BadgePercent } from "lucide-react";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { CATEGORIES, BRANDS } from "@/lib/constants";

export default function HomePage(): React.JSX.Element {
  const featuredProducts = INITIAL_PRODUCTS.filter((p) => p.featured).slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Giant Bold Hero Section (Modeled on Cutstruct reference) */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface via-surface/60 to-canvas pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          {/* Subtle Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Authoritative Construction Procurement · Nigeria</span>
          </div>

          {/* Huge Bold Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-text-primary max-w-5xl mx-auto text-balance leading-[1.08]">
            One place for all the <span className="text-accent underline decoration-accent/30 decoration-wavy">construction materials</span> you need.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed text-balance font-normal">
            Direct factory-certified cement, steel rebar, aggregates, roofing, and finishes. Transparent unit pricing with scheduled site haulage across Lagos and Abuja.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
            <Link
              href="/buy-materials"
              className="w-full sm:w-auto h-13 px-8 rounded-pill bg-accent text-accent-contrast hover:bg-accent-hover font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98"
            >
              <span>Shop Materials</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#categories"
              className="w-full sm:w-auto h-13 px-7 rounded-pill border border-border bg-surface hover:border-accent text-text-primary font-semibold text-sm sm:text-base flex items-center justify-center transition-all shadow-xs"
            >
              Browse Categories
            </Link>
          </div>

          {/* Fast Metric Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-border/60">
            <div className="text-center">
              <span className="block text-2xl font-black text-text-primary">100%</span>
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">OEM Certified</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-text-primary">48+</span>
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Materials Seeded</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-text-primary">₦35k</span>
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Flat Site Haulage</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-text-primary">0%</span>
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Hidden Markups</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Brands & OEMs Row (Cutstruct Reference element) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-tertiary">
              Featured Brands & Certified Suppliers
            </h2>
          </div>
          <Link href="/buy-materials" className="text-xs font-semibold text-accent hover:underline">
            View All Materials →
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none py-1">
          {BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/buy-materials?brand=${brand.slug}`}
              className="flex-shrink-0 px-5 py-3 rounded-xl bg-surface border border-border hover:border-accent/80 transition-all flex items-center gap-2.5 shadow-xs group"
            >
              <div className="w-2 h-2 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
              <span className="text-xs font-bold text-text-primary group-hover:text-accent whitespace-nowrap">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Category Tiles Grid */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Browse Building Categories
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Select from 11 authoritative construction procurement departments.
            </p>
          </div>
          <Link
            href="/buy-materials"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
          >
            <span>Marketplace Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => (
            <Link
              key={cat.slug}
              href={`/buy-materials?category=${cat.slug}`}
              className="group p-4 bg-surface border border-border rounded-2xl hover:border-accent hover:bg-surface-elevated transition-all flex flex-col justify-between h-32 shadow-xs"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary group-hover:text-accent">
                Dept
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent leading-snug line-clamp-2">
                {cat.name}
              </h3>
              <div className="flex items-center text-[11px] font-semibold text-text-secondary group-hover:text-text-primary">
                <span>View items →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Materials Product Grid (4 Columns Desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Featured Materials & Daily In-Stock Picks
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              High-demand rebar, cement, aggregates, and roofing ready for immediate site haulage.
            </p>
          </div>
          <Link
            href="/buy-materials"
            className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
          >
            <span>View All Materials (48)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Trust Strip / Value Proposition Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-surface border border-border p-6 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-card">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              100% Guaranteed Quality
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Never worry about underweight steel, diluted cement, or substandard blocks. All materials are factory certified to NIS and British Standards.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              Transparent Site Haulage
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Scheduled tipper and flatbed delivery directly to your building site in Lagos & Abuja. Flat simulated site haulage fee of ₦35,000 per order.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <BadgePercent className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              Authoritative Transparent Pricing
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Every item has an explicit unit price per bag, length, ton, or trip. No &quot;Negotiate&quot; barriers and zero surprise price escalations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

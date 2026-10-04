import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  Truck,
  Building2,
  HardHat,
  Calculator,
  Home,
  CheckCircle2,
  MapPin,
  Mail,
  ArrowRight,
  TrendingUp,
  BadgeCheck,
  Scale,
  Users,
} from "lucide-react";
import { STORE_NAME, BRANDS } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About Us | ${STORE_NAME} - Nigeria's Construction Materials Marketplace`,
  description:
    "Learn about BuildMart's mission to streamline construction procurement across Nigeria. Authoritative unit pricing, 100% factory-certified materials, and reliable site haulage across Lagos and Abuja.",
};

export default function AboutPage(): React.JSX.Element {
  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface via-surface/60 to-canvas pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Built by Builders · Engineered for Construction</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-text-primary max-w-5xl mx-auto text-balance leading-[1.08]">
            Transforming construction procurement in{" "}
            <span className="text-accent underline decoration-accent/30 decoration-wavy">
              Nigeria
            </span>
            .
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed text-balance font-normal">
            {STORE_NAME} was founded to solve the chronic bottlenecks of building material sourcing:
            opaque broker pricing, counterfeit materials, logistics breakdown, and project delays.
            We provide a single authoritative platform with published unit pricing, certified OEM supplies, and direct site haulage.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
            <Link
              href="/buy-materials"
              className="w-full sm:w-auto h-13 px-8 rounded-pill bg-accent text-accent-contrast hover:bg-accent-hover font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98"
            >
              <span>Explore Materials</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#who-we-serve"
              className="w-full sm:w-auto h-13 px-7 rounded-pill border border-border bg-surface hover:border-accent text-text-primary font-semibold text-sm sm:text-base flex items-center justify-center transition-all shadow-xs"
            >
              Who We Serve
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-border/60">
            <div className="p-4 rounded-2xl bg-surface border border-border/70 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-text-primary">48+</span>
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                Certified Materials
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border/70 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-text-primary">11</span>
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                Core Departments
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border/70 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-text-primary">24</span>
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                OEM Brands & Quarries
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border/70 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-text-primary">₦35k</span>
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                Flat Site Haulage
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Procurement Problem vs. BuildMart Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>The Construction Reality</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Traditional Material Sourcing is Broken. Here is How We Fix It.
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            In Nigeria, developers and site engineers face endless uncertainty when purchasing construction inputs.
            BuildMart replaces middleman friction with transparent digital procurement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Problem 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-4 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              Arbitrary Middleman Markup
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              <strong>The Problem:</strong> Traditional building material markets rely on opaque broker markups where the same cement bag or ton of rebar can vary by 20% in a single afternoon. Estimators struggle to maintain realistic Bill of Quantities (BOQ).
            </p>
            <div className="pt-2 border-t border-border/60">
              <p className="text-xs sm:text-sm text-text-primary font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span><strong>BuildMart Solution:</strong> Clear, authoritative prices per unit (per bag, per 12m length, per trip) published openly with zero negotiation barriers.</span>
              </p>
            </div>
          </div>

          {/* Problem 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-4 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              Counterfeit & Sub-Standard Materials
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              <strong>The Problem:</strong> Re-rolled underweight steel rods, repackaged expired cement, and brittle sandcrete blocks severely compromise structural integrity, leading to building defects and collapses.
            </p>
            <div className="pt-2 border-t border-border/60">
              <p className="text-xs sm:text-sm text-text-primary font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span><strong>BuildMart Solution:</strong> 100% factory-certified materials directly from Dangote, BUA, Lafarge, Coleman, and verified quarries conforming to NIS and BS standards.</span>
              </p>
            </div>
          </div>

          {/* Problem 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-4 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              Logistics Breakdown & Missing Tippers
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              <strong>The Problem:</strong> Sourcing heavy aggregates (granite, sharp sand) typically requires coordinating individual truck drivers who fail to show up, stranding casting crews and inflating labor overhead.
            </p>
            <div className="pt-2 border-t border-border/60">
              <p className="text-xs sm:text-sm text-text-primary font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span><strong>BuildMart Solution:</strong> Scheduled site haulage with dedicated 20-ton and 30-ton tipper routes across Lagos and Abuja with flat delivery rates.</span>
              </p>
            </div>
          </div>

          {/* Problem 4 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-4 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center font-black text-sm">
              04
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              Payment Risk & Sourcing Anxiety
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              <strong>The Problem:</strong> Developers and diaspora builders frequently lose funds to unauthorized diversions when making full cash advances before supplies arrive on site.
            </p>
            <div className="pt-2 border-t border-border/60">
              <p className="text-xs sm:text-sm text-text-primary font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span><strong>BuildMart Solution:</strong> Simulated Pay-on-Delivery (POD) upon site arrival and physical offload inspection, accompanied by automated itemized receipts.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Who We Serve */}
      <section id="who-we-serve" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Built For The Built Environment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Who Relies on {STORE_NAME}
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            From multi-storey commercial developments to private residential construction, our platform serves all stakeholders in Nigerian building delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stakeholder 1 */}
          <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Real Estate Developers
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Stay on schedule and strictly on budget. Order bulk cement, reinforcement steel, and structural blocks with guaranteed delivery timelines and bulk volume support.
              </p>
            </div>
            <div className="pt-4 border-t border-border/60 text-xs font-semibold text-accent">
              Batch consistency & factory certificates
            </div>
          </div>

          {/* Stakeholder 2 */}
          <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Site Engineers & Builders
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Order materials on mobile directly to site coordinates in under 3 minutes. Zero phone haggling, instant stock checks, and rapid tipper dispatches.
              </p>
            </div>
            <div className="pt-4 border-t border-border/60 text-xs font-semibold text-accent">
              Fast 3-minute order placement
            </div>
          </div>

          {/* Stakeholder 3 */}
          <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Quantity Surveyors & Estimators
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Access authoritative, real-time market prices per unit for precision cost planning, tender submissions, and tamper-proof procurement reconciliations.
              </p>
            </div>
            <div className="pt-4 border-t border-border/60 text-xs font-semibold text-accent">
              Transparent live unit rates
            </div>
          </div>

          {/* Stakeholder 4 */}
          <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Private & Diaspora Builders
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Building your family home from abroad or across the state? Enjoy complete transparency, verifiable item receipts, and pay on delivery upon site inspection.
              </p>
            </div>
            <div className="pt-4 border-t border-border/60 text-xs font-semibold text-accent">
              Zero diversion, 100% peace of mind
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Core Operating Commitments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-surface border border-border p-6 sm:p-12 space-y-8 shadow-card">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Our Operating Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Four Uncompromising Standards at {STORE_NAME}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-border/60">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <BadgeCheck className="w-5 h-5" />
                <h4 className="text-sm font-bold text-text-primary">Certified Quality</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                All cement is Grade 42.5R/32.5R, rebar is certified high-yield deformed bars, and cabling is 100% pure copper.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Truck className="w-5 h-5" />
                <h4 className="text-sm font-bold text-text-primary">Dedicated Haulage</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Consolidated site logistics with professional tipper and flatbed haulage operators servicing Greater Lagos and FCT Abuja.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <TrendingUp className="w-5 h-5" />
                <h4 className="text-sm font-bold text-text-primary">Real-Time Inventory</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Automated PostgreSQL transactions decrement live warehouse and quarry stock atomically with zero double-selling.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="text-sm font-bold text-text-primary">Pay On Delivery</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Inspect material volume, weight, and condition on your site before authorizing bank transfer or payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Certified Brand Network Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Our Certified Supply Network
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Direct factory partnerships with 24 premier industrial manufacturers and quarry operators.
            </p>
          </div>
          <Link
            href="/buy-materials"
            className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
          >
            <span>Explore All Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {BRANDS.slice(0, 18).map((brand) => (
            <Link
              key={brand.slug}
              href={`/buy-materials?brand=${brand.slug}`}
              className="p-4 rounded-xl bg-surface border border-border hover:border-accent transition-all text-center group flex flex-col items-center justify-center h-20 shadow-xs"
            >
              <span className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                {brand.name}
              </span>
              <span className="text-[10px] text-text-tertiary uppercase tracking-wider mt-0.5">
                Certified OEM
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Operations & Logistics Hubs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Lagos Logistics & Distribution Hub
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Servicing site dispatches across Lagos Island, Lekki Peninsula, Ikeja, Ikorodu, and Epe.
              </p>
            </div>
            <div className="pt-2 text-xs text-text-primary font-medium space-y-1">
              <p>📍 14 Commercial Avenue, Yaba, Lagos State</p>
              <p>⏰ Mon - Sat: 7:30 AM – 6:00 PM</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Abuja Yard & Industrial Fulfillment Center
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Servicing haulage dispatches across Idu Industrial, Gwarinpa, Maitama, Wuye, and Airport Road.
              </p>
            </div>
            <div className="pt-2 text-xs text-text-primary font-medium space-y-1">
              <p>📍 Plot 1082 Industrial Area, Idu, FCT Abuja</p>
              <p>⏰ Mon - Sat: 8:00 AM – 5:30 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-accent/90 to-accent p-8 sm:p-14 text-center text-accent-contrast space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
            Ready to supply your construction site with authentic materials?
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto text-accent-contrast/90 leading-relaxed font-medium">
            Browse our catalog of 48+ certified building materials with transparent unit pricing and guaranteed site haulage.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/buy-materials"
              className="w-full sm:w-auto h-13 px-8 rounded-pill bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <span>Shop All Materials</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="mailto:support@buildmart.ng"
              className="w-full sm:w-auto h-13 px-7 rounded-pill border border-white/40 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Procurement Desk</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

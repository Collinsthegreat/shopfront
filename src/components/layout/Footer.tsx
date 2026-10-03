import React from "react";
import Link from "next/link";
import { STORE_NAME, CATEGORIES } from "@/lib/constants";
import { ShieldCheck, Truck, BadgeCheck, PhoneCall } from "lucide-react";

export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      {/* Trust Strip */}
      <div className="border-b border-border/70 py-8 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">100% Factory Certified</h4>
              <p className="text-[11px] text-text-secondary">Direct from Dangote, BUA, Lafarge & OEMs</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">Site Haulage & Tipper Delivery</h4>
              <p className="text-[11px] text-text-secondary">Delivered directly to building sites in Lagos & Abuja</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">Authoritative Pricing</h4>
              <p className="text-[11px] text-text-secondary">Transparent prices per unit, zero hidden fees</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">Site Procurement Support</h4>
              <p className="text-[11px] text-text-secondary">Support: support@buildmart.ng · Mon - Sat</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-accent-contrast text-xs font-black">
                BM
              </div>
              <span className="text-base font-extrabold text-text-primary tracking-tight">
                {STORE_NAME}
              </span>
            </div>
            <p className="text-xs text-text-secondary max-w-sm leading-relaxed">
              Nigeria&apos;s authoritative construction procurement platform. Providing verified structural steel,
              certified cement, aggregates, roofing, and finishes with transparent pricing and scheduled site logistics.
            </p>
            <div className="pt-2 text-xs text-text-tertiary space-y-1">
              <p>📍 Lagos Hub: 14 Commercial Avenue, Yaba, Lagos State</p>
              <p>📍 Abuja Hub: Plot 1082 Industrial Area, Idu, FCT Abuja</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Core Categories
            </h4>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              {CATEGORIES.slice(1, 7).map((c) => (
                <li key={c.slug}>
                  <Link href={`/buy-materials?category=${c.slug}`} className="hover:text-accent transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/buy-materials" className="text-accent font-semibold hover:underline">
                  View all 11 categories →
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Company & Legal
            </h4>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              <li>
                <Link href="/about" className="hover:text-text-primary transition-colors">
                  About BuildMart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-text-primary transition-colors">
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-text-primary transition-colors">
                  Terms of Procurement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
          <p>© {new Date().getFullYear()} {STORE_NAME} Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Lagos & Abuja Site Delivery</span>
            <span>•</span>
            <span>Simulated Pay on Delivery</span>
            <span>•</span>
            <span>Factory Genuine Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

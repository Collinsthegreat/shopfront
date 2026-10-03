"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User, ChevronDown, LogOut, PackageCheck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { AuthUser } from "@/types";
import { STORE_NAME } from "@/lib/constants";

export interface HeaderProps {
  user?: AuthUser | null;
  onSignOut?: () => Promise<void>;
}

export function Header({ user: propUser, onSignOut: propSignOut }: HeaderProps): React.JSX.Element {
  const pathname = usePathname();
  const auth = useAuth();
  const user = propUser !== undefined ? propUser : auth.user;
  const onSignOut = propSignOut || auth.signOut;

  const { setDrawerOpen, itemsCount, isMounted } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full pt-2 sm:pt-4 pb-2 px-3 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo Left */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-text-primary group select-none flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-contrast shadow-sm transition-transform group-hover:scale-105">
            <span className="font-black text-sm tracking-tighter">BM</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight leading-none text-text-primary">
              {STORE_NAME}
            </span>
            <span className="text-[10px] tracking-wider text-text-tertiary font-semibold uppercase">
              Nigeria
            </span>
          </div>
        </Link>

        {/* Center: Floating Pill Navigation (Reference inspired) */}
        <nav
          className="hidden md:flex items-center gap-1.5 bg-surface/90 dark:bg-surface/80 backdrop-blur-md border border-border px-3 py-1.5 rounded-pill shadow-card"
          aria-label="Main Navigation"
        >
          <Link
            href="/buy-materials"
            className={`px-4 py-1.5 rounded-pill text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith("/buy-materials")
                ? "bg-accent/10 text-accent font-bold"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Marketplace
          </Link>

          <Link
            href="/about"
            className={`px-4 py-1.5 rounded-pill text-xs font-semibold tracking-wide transition-all ${
              pathname === "/about"
                ? "bg-accent/10 text-accent font-bold"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            About
          </Link>

          <Link
            href="/buy-materials"
            className="ml-1 px-4 py-1.5 rounded-pill text-xs font-bold tracking-wide bg-accent text-accent-contrast hover:bg-accent-hover shadow-sm transition-all"
          >
            Buy Materials
          </Link>
        </nav>

        {/* Right Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Cart Outline Pill */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Shopping cart with ${isMounted ? itemsCount : 0} items`}
            className="h-9 sm:h-10 px-3 min-h-[36px] rounded-pill border border-border bg-surface text-text-primary hover:border-accent transition-all flex items-center gap-2 focus-visible:outline-accent shadow-sm"
          >
            <ShoppingCart className="w-4 h-4 text-accent" />
            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-accent text-accent-contrast">
              {isMounted ? itemsCount : 0}
            </span>
          </button>

          {/* User Menu / Sign In */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="h-9 sm:h-10 px-2 sm:px-3 rounded-pill border border-border bg-surface hover:border-accent transition-all flex items-center gap-2 focus-visible:outline-accent shadow-sm"
                aria-expanded={userDropdownOpen}
                aria-label="User account menu"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName || "User avatar"}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-surface-elevated text-text-primary flex items-center justify-center text-[10px] font-bold">
                    {user.fullName ? user.fullName[0]?.toUpperCase() : "U"}
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-medium max-w-[100px] truncate text-text-primary">
                  {user.fullName || "My Account"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-lg z-50 p-2 animate-in fade-in-50 zoom-in-95">
                    <div className="px-3 py-2 border-b border-border/60 mb-1">
                      <p className="text-xs font-semibold text-text-primary truncate">
                        {user.fullName || "Signed-in User"}
                      </p>
                      <p className="text-[11px] text-text-secondary truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-surface-elevated rounded-lg transition-colors font-medium"
                    >
                      <PackageCheck className="w-4 h-4 text-accent" />
                      My Orders
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await onSignOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-danger hover:bg-danger-bg rounded-lg transition-colors font-medium mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="h-9 sm:h-10 px-3 sm:px-4 rounded-pill border border-border bg-surface text-text-primary hover:border-accent transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-text-secondary" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary rounded-lg border border-border bg-surface"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-surface border border-border shadow-lg space-y-3">
          <Link
            href="/buy-materials"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-text-primary hover:bg-surface-elevated"
          >
            Marketplace (/buy-materials)
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-text-primary hover:bg-surface-elevated"
          >
            About BuildMart
          </Link>
          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-text-primary hover:bg-surface-elevated"
          >
            My Orders
          </Link>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ThemeToggle } from "./ThemeToggle";
import { AuthUser } from "@/types";

export interface HeaderProps {
  user?: AuthUser | null;
  onSignOut?: () => Promise<void>;
}

export function Header({ user, onSignOut }: HeaderProps): React.JSX.Element {
  const pathname = usePathname();
  const { setDrawerOpen, itemsCount, isMounted } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  const navLinks = [
    { href: "/shop", label: "All Goods" },
    { href: "/shop?category=carry", label: "Carry" },
    { href: "/shop?category=stationery", label: "Stationery" },
    { href: "/shop?category=desk", label: "Desk" },
    { href: "/shop?category=living", label: "Living" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary rounded-md focus-visible:outline-accent"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-text-primary flex items-center gap-2 select-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
            <span>Shopfront</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-text-primary font-semibold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Shopping cart with ${isMounted ? itemsCount : 0} items`}
            className="relative h-10 px-3 min-h-[40px] rounded-md border border-border bg-surface text-text-primary hover:bg-canvas transition-colors flex items-center gap-2 focus-visible:outline-accent"
          >
            <ShoppingBag className="w-4 h-4 text-text-primary" />
            <span className="text-xs font-semibold tabular-nums">
              {isMounted ? itemsCount : 0}
            </span>
          </button>

          {/* User Menu / Sign In */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="h-10 px-3 min-h-[40px] rounded-md border border-border bg-surface text-text-primary hover:bg-canvas transition-colors flex items-center gap-2 text-xs font-medium focus-visible:outline-accent"
                aria-expanded={userDropdownOpen}
                aria-label="User menu"
              >
                <div className="w-5 h-5 rounded-full bg-accent text-accent-contrast flex items-center justify-center text-[10px] font-bold">
                  {user.fullName ? user.fullName[0]?.toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {user.fullName?.split(" ")[0] || "Account"}
                </span>
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-md bg-surface border border-border shadow-card py-1.5 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-border-subtle">
                      <p className="text-xs font-medium text-text-primary truncate">
                        {user.fullName || "Signed In"}
                      </p>
                      <p className="text-[11px] text-text-secondary truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs text-text-primary hover:bg-canvas transition-colors"
                    >
                      My Orders
                    </Link>

                    {onSignOut && (
                      <button
                        type="button"
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await onSignOut();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-danger hover:bg-danger-bg transition-colors"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="h-10 px-3.5 min-h-[40px] rounded-md bg-accent text-accent-contrast hover:bg-accent-hover transition-colors flex items-center gap-1.5 text-xs font-medium focus-visible:outline-accent"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-canvas transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-canvas transition-colors"
              >
                My Orders
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

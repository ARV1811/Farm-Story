"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFarmStore } from "@/store/farmStore";
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  User, 
  Leaf, 
  Menu, 
  X,
  Clock,
  Sparkles
} from "lucide-react";

export const StoreHeader: React.FC = () => {
  const pathname = usePathname();
  const { customerCart } = useFarmStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalItems = customerCart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Produce", href: "/shop" },
    { label: "Fresh Vegetables", href: "/shop?cat=Vegetables" },
    { label: "Organic Fruits", href: "/shop?cat=Fruits" },
    { label: "Leafy Greens", href: "/shop?cat=Leafy%20Greens" },
    { label: "Staples & Oils", href: "/shop?cat=Cold-Pressed%20%26%20Staples" },
  ];

  return (
    <header className="bg-white border-b border-[#E2E8E0] sticky top-8 z-40 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-[#EAF2E7] border-b border-[#D2E2CE] text-[#1B4D36] py-1 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AA52]" />
            <span className="font-medium">Direct from Sangli & Sahyadri organic farms — Harvested at 5:00 AM daily</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-[#2F6B45]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Same-day delivery across Pune
            </span>
            <span className="text-[#D4AA52] font-semibold">Free delivery above ₹500</span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-full bg-[#123B2A] flex items-center justify-center text-[#D4AA52] shadow-sm group-hover:scale-105 transition">
            <Leaf className="w-5 h-5 fill-[#D4AA52]" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-[#123B2A] leading-tight flex items-center gap-1.5">
              <span>The Farm Story</span>
            </div>
            <p className="text-[10px] text-[#64746A] tracking-wider uppercase font-medium">
              Naturally Grown · Est. 2019
            </p>
          </div>
        </Link>

        {/* Location selector */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F8F6F0] px-3 py-1.5 rounded-full border border-[#E2E8E0] text-xs text-[#1E2B23]">
          <MapPin className="w-3.5 h-3.5 text-[#2F6B45]" />
          <div>
            <span className="text-[10px] text-[#64746A] block leading-tight">Delivering to</span>
            <span className="font-semibold text-xs">Model Colony / Aundh, Pune</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="hidden sm:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search desi tomatoes, palak, cold-pressed oil..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6B45] focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-[#64746A] absolute left-3 top-2.5" />
        </div>

        {/* Actions (Account & Cart) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/account"
            className="flex items-center gap-1.5 text-xs text-[#1E2B23] hover:text-[#2F6B45] px-2.5 py-1.5 rounded-lg hover:bg-[#F8F6F0] transition"
          >
            <User className="w-4 h-4" />
            <span className="hidden md:inline font-medium">Account</span>
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-2 bg-[#123B2A] text-white hover:bg-[#1B4D36] px-3.5 py-2 rounded-full text-xs font-semibold shadow-xs transition"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AA52] text-[#123B2A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav aria-label="Customer Navigation" className="border-t border-[#E2E8E0] bg-[#FAFAF8] hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto py-2 text-xs font-medium text-[#1E2B23]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`whitespace-nowrap pb-0.5 transition hover:text-[#2F6B45] ${
                  isActive
                    ? "text-[#123B2A] font-bold border-b-2 border-[#123B2A]"
                    : "text-[#64746A]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E2E8E0] bg-white px-4 py-3 space-y-3 shadow-lg">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search produce..."
              className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-lg pl-9 pr-4 py-2 text-xs"
            />
            <Search className="w-4 h-4 text-[#64746A] absolute left-3 top-2.5" />
          </div>
          <div className="flex flex-col space-y-2 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#1E2B23] hover:text-[#2F6B45]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

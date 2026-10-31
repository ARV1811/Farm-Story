"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFarmStore } from "@/store/farmStore";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { ProductCard } from "@/components/storefront/ProductCard";
import { 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Scale, 
  TrendingDown, 
  ChevronRight,
  HeartHandshake
} from "lucide-react";

export default function HomePage() {
  const { products } = useFarmStore();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Vegetables", "Fruits", "Leafy Greens", "Cold-Pressed & Staples"];

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  const seasonalProducts = products.filter(p => p.seasonal || p.featured);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0]">
      <StoreHeader />

      {/* Hero Section */}
      <section className="relative bg-[#123B2A] text-white overflow-hidden py-14 sm:py-20">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AA52_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#2F6B45]/70 border border-[#D4AA52]/40 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#EAF2E7] shadow-sm">
              <Sparkles className="w-4 h-4 text-[#D4AA52]" />
              <span>A Connected System for Farm-to-Table Retail</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Fresh from the farm, <br />
              <span className="text-[#D4AA52]">straight to your door.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#EAF2E7]/85 max-w-xl leading-relaxed">
              Real farm-fresh produce harvested at dawn from certified growers in Sangli & Sahyadri. 
              Our physical counter and online store sell from the <span className="text-white font-semibold underline decoration-[#D4AA52]">exact same live stock</span>, weighed with precision down to the gram.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="bg-[#D4AA52] hover:bg-[#c49a42] text-[#123B2A] px-6 py-3 rounded-full font-bold text-sm transition shadow-lg flex items-center gap-2"
              >
                <span>Shop Today&apos;s Harvest</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/demo"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-full font-semibold text-sm transition flex items-center gap-2"
              >
                <span>Client Demo Journey</span>
                <ChevronRight className="w-4 h-4 text-[#D4AA52]" />
              </Link>
            </div>

            {/* Quick metrics banner */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#2F6B45]/50 text-xs">
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#D4AA52] block">5:00 AM</span>
                <span className="text-[#EAF2E7]/70 text-[11px]">Daily Morning Harvest</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#D4AA52] block">1 Live</span>
                <span className="text-[#EAF2E7]/70 text-[11px]">Store + Online Stock</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#D4AA52] block">0%</span>
                <span className="text-[#EAF2E7]/70 text-[11px]">Chemicals / Carbides</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#2F6B45]/50 shadow-2xl bg-[#1B4D36]">
              <Image
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=900&q=80"
                alt="Fresh farm produce crate"
                width={700}
                height={550}
                className="object-cover w-full h-[380px] sm:h-[420px]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123B2A] via-transparent to-transparent" />
              
              {/* Floating interactive badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 text-[#1E2B23] shadow-lg border border-white/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#EAF2E7] flex items-center justify-center text-[#2F6B45]">
                      <Leaf className="w-5 h-5 fill-[#2F6B45]" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xs text-[#123B2A]">Sangli Desi Tomatoes</h2>
                      <p className="text-[10px] text-[#64746A]">Batch B-261028-A · Verified Fresh</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#123B2A]">₹60 / kg</span>
                    <span className="block text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      In Stock: Store & Web
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tomatoes Crate Teaser Bar (Reflecting Page 9 of PDF) */}
      <section className="bg-[#EAF2E7] border-y border-[#D2E2CE] py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#123B2A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F6B45]" />
            <span className="font-bold text-sm">Follow One Crate of Tomatoes:</span>
            <span className="text-[#64746A] hidden sm:inline">
              Order (100kg @ ₹22) → Receive (Batch B-261028-A) → Label → Sell (Store & Web) → Deliver → Books & GST auto-update
            </span>
          </div>
          <Link
            href="/demo"
            className="shrink-0 bg-[#123B2A] text-white hover:bg-[#2F6B45] px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>Launch Presentation Workflow</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4AA52]" />
          </Link>
        </div>
      </section>

      {/* Main Produce Catalogue Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        {/* Section Header & Category Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AA52]" />
              Harvest Catalogue
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
              Handpicked Farm Produce
            </h2>
            <p className="text-xs sm:text-sm text-[#64746A] mt-1">
              Every item synced with store counter stock in real time.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#123B2A] text-white shadow-sm"
                    : "bg-white text-[#1E2B23] border border-[#E2E8E0] hover:bg-[#EAF2E7]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Four Realities of Fresh Produce Section (From Page 5 of PDF) */}
      <section className="bg-white border-y border-[#E2E8E0] py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase">
              The Retail Reality
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
              Fresh Produce is a Different Business
            </h2>
            <p className="text-xs sm:text-sm text-[#64746A] mt-1">
              Four realities every farm-to-table retailer lives with every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F8F6F0] p-6 rounded-2xl border border-[#E2E8E0] relative group hover:border-[#2F6B45] transition">
              <div className="w-10 h-10 rounded-full bg-[#EAF2E7] text-[#2F6B45] flex items-center justify-center mb-4 font-bold">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#123B2A]">1. It Perishes</h3>
              <p className="text-xs text-[#64746A] mt-2 leading-relaxed">
                Every unsold kilo is margin you have already paid for. Oldest stock must sell first automatically through FIFO batch alerts.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E2E8E0] text-[11px] font-semibold text-[#2F6B45]">
                Solved: Auto Expiry Alerts & FIFO
              </div>
            </div>

            <div className="bg-[#F8F6F0] p-6 rounded-2xl border border-[#E2E8E0] relative group hover:border-[#2F6B45] transition">
              <div className="w-10 h-10 rounded-full bg-[#EAF2E7] text-[#2F6B45] flex items-center justify-center mb-4 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#123B2A]">2. Prices Move Daily</h3>
              <p className="text-xs text-[#64746A] mt-2 leading-relaxed">
                Supplier mandi rates fluctuate with seasons and rain. Single-click price updates synchronize POS and website instantly.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E2E8E0] text-[11px] font-semibold text-[#2F6B45]">
                Solved: Dynamic Price Repricing
              </div>
            </div>

            <div className="bg-[#F8F6F0] p-6 rounded-2xl border border-[#E2E8E0] relative group hover:border-[#2F6B45] transition">
              <div className="w-10 h-10 rounded-full bg-[#EAF2E7] text-[#2F6B45] flex items-center justify-center mb-4 font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#123B2A]">3. Sold by Exact Weight</h3>
              <p className="text-xs text-[#64746A] mt-2 leading-relaxed">
                Weighing scales, printed barcode labels, and counter bills must always agree to avoid discrepancy losses.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E2E8E0] text-[11px] font-semibold text-[#2F6B45]">
                Solved: Digital Scale & Weight Labels
              </div>
            </div>

            <div className="bg-[#F8F6F0] p-6 rounded-2xl border border-[#E2E8E0] relative group hover:border-[#2F6B45] transition">
              <div className="w-10 h-10 rounded-full bg-[#EAF2E7] text-[#2F6B45] flex items-center justify-center mb-4 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#123B2A]">4. Two Doors, One Stock</h3>
              <p className="text-xs text-[#64746A] mt-2 leading-relaxed">
                Store and website must never sell the same kilo twice. Shared live inventory updates instantaneously on every checkout.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E2E8E0] text-[11px] font-semibold text-[#2F6B45]">
                Solved: Unified Inventory Engine
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials & Brand Trust */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="bg-[#123B2A] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="text-xs font-semibold tracking-wider text-[#D4AA52] uppercase flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-[#D4AA52]" />
              Illustrative Customer Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              &ldquo;The taste of childhood vegetables has returned to our kitchen.&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-[#EAF2E7]/80 leading-relaxed">
              &ldquo;We order weekly for our clinic family in Model Colony. The desi tomatoes and raw forest honey taste distinctly genuine, and delivery arrives in exact weighed packets.&rdquo;
            </p>
            <div className="pt-2">
              <p className="font-bold text-sm text-white">Dr. Arvind Joshi</p>
              <p className="text-[11px] text-[#D4AA52]">Loyal Customer · Model Colony, Pune</p>
            </div>
          </div>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
}

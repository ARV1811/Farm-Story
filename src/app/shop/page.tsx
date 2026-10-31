"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useFarmStore } from "@/store/farmStore";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductCategory } from "@/types";
import { Search, Filter, Sparkles, Check } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("cat") || "All";

  const { products } = useFarmStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "stock">("featured");

  const categories: (ProductCategory | "All")[] = [
    "All",
    "Vegetables",
    "Fruits",
    "Leafy Greens",
    "Cold-Pressed & Staples",
    "Organic Specials"
  ];

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === "All" ||
          p.category === selectedCategory ||
          (selectedCategory === "Organic Specials" && p.isOrganic);

        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.originFarm.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesOrganic = !organicOnly || p.isOrganic;

        return matchesCategory && matchesSearch && matchesOrganic;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.pricePerKg - b.pricePerKg;
        if (sortBy === "price-desc") return b.pricePerKg - a.pricePerKg;
        if (sortBy === "stock") return b.currentStockKg - a.currentStockKg;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, organicOnly, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0]">
      <StoreHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[#2F6B45] font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AA52]" />
            <span>Farm Fresh Catalogue</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#123B2A]">
            All Harvest & Produce
          </h1>
          <p className="text-xs sm:text-sm text-[#64746A] mt-1">
            Showing real-time live inventory currently available at our counter and for home delivery.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search by vegetable, fruit, farm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2F6B45] transition"
              />
              <Search className="w-4 h-4 text-[#64746A] absolute left-3 top-2.5" />
            </div>

            {/* Sort & Organic Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
              <button
                onClick={() => setOrganicOnly(!organicOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  organicOnly
                    ? "bg-[#123B2A] text-[#D4AA52] border-[#123B2A]"
                    : "bg-[#F8F6F0] text-[#1E2B23] border-[#E2E8E0] hover:bg-[#EAF2E7]"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${organicOnly ? "border-[#D4AA52] bg-[#D4AA52] text-[#123B2A]" : "border-gray-400"}`}>
                  {organicOnly && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>Certified Organic Only</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#64746A] hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F8F6F0] border border-[#E2E8E0] rounded-lg px-2.5 py-1.5 text-xs text-[#1E2B23] font-medium focus:outline-none"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="stock">Highest Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#F0F4EF]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#123B2A] text-white shadow-xs"
                    : "bg-[#F8F6F0] text-[#1E2B23] hover:bg-[#EAF2E7]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8E0] p-8">
            <Filter className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-bold text-gray-800 text-sm">No produce matches your search</h3>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your category or organic filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setOrganicOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-[#123B2A] text-white rounded-full text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}

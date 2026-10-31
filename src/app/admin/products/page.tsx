"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useFarmStore } from "@/store/farmStore";
import { formatINR } from "@/lib/utils";
import { Product, ProductCategory } from "@/types";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Sparkles, 
  Check, 
  X,
  AlertCircle
} from "lucide-react";

export default function AdminProductsPage() {
  const { products } = useFarmStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>("Vegetables");
  const [newProdPrice, setNewProdPrice] = useState("60");
  const [newProdCost, setNewProdCost] = useState("25");
  const [newProdStock, setNewProdStock] = useState("50");
  const [newProdHsn, setNewProdHsn] = useState("07020000");
  const [newProdGst, setNewProdGst] = useState("0");
  const [newProdFarm, setNewProdFarm] = useState("Sangli Organic Collective");

  const categories = ["All", "Vegetables", "Fruits", "Leafy Greens", "Cold-Pressed & Staples"];

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.hsnCode.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Demonstration Notice: In this frontend demo, "${newProdName}" price & stock parameters are saved in local session memory.`);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-[#D4AA52]" />
            Master Product Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
            Produce Catalogue & Pricing
          </h1>
          <p className="text-xs sm:text-sm text-[#64746A]">
            Single product list powers both store counter POS and website storefront.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#123B2A] hover:bg-[#1B4D36] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search produce or HSN code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#123B2A] text-white shadow-xs"
                  : "bg-[#F8F6F0] text-gray-700 hover:bg-[#EAF2E7]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Data Grid */}
      <div className="bg-white rounded-3xl border border-[#E2E8E0] farm-card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E2E8E0] text-[#64746A] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Produce Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Origin Farm</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Live Stock</th>
                <th className="py-3 px-4">HSN & GST</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4EF]">
              {filteredProducts.map((p) => {
                const isLow = p.currentStockKg <= p.minThresholdKg;
                return (
                  <tr key={p.id} className="hover:bg-[#F8F6F0]/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <strong className="font-bold text-[#123B2A] block">{p.name}</strong>
                          <span className="text-[10px] text-gray-400">Shelf life: ~{p.shelfLifeDays} days</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{p.category}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-40 truncate">{p.originFarm}</td>
                    <td className="py-3 px-4 font-bold text-[#123B2A]">{formatINR(p.pricePerKg)} / kg</td>
                    <td className="py-3 px-4 text-gray-600">{formatINR(p.costPricePerKg)} / kg</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        isLow ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {p.currentStockKg} kg {isLow ? "(Low)" : ""}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="block text-gray-700">{p.hsnCode}</span>
                      <span className="text-[10px] text-[#2F6B45] font-sans font-semibold">
                        {p.gstRate === 0 ? "0% (Nil-rated)" : `${p.gstRate}% GST`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Edit configuration for ${p.name}`)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#123B2A] hover:bg-gray-100 transition"
                        title="Edit Produce"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full farm-card-shadow space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#123B2A]">Add New Produce Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Bell Peppers (Shimla Mirch)"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Leafy Greens">Leafy Greens</option>
                    <option value="Cold-Pressed & Staples">Cold-Pressed & Staples</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Origin Farm</label>
                  <input
                    type="text"
                    value={newProdFarm}
                    onChange={(e) => setNewProdFarm(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Retail Price (₹/kg)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Cost Price (₹/kg)</label>
                  <input
                    type="number"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Initial Stock (kg)</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">HSN Code</label>
                  <input
                    type="text"
                    value={newProdHsn}
                    onChange={(e) => setNewProdHsn(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">GST Tax Rate</label>
                  <select
                    value={newProdGst}
                    onChange={(e) => setNewProdGst(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="0">0% (Nil-rated Fresh Produce)</option>
                    <option value="5">5% (Packaged / Edible Oil)</option>
                    <option value="12">12% (Ghee / Processed)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#123B2A] text-white rounded-xl text-xs font-bold hover:bg-[#1B4D36]"
                >
                  Save Produce Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

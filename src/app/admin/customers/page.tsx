"use client";

import React, { useState } from "react";
import { useFarmStore } from "@/store/farmStore";
import { formatINR } from "@/lib/utils";
import { 
  Users, 
  Award, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Send, 
  Check, 
  Heart 
} from "lucide-react";

export default function AdminCustomersPage() {
  const { customers, addNotification } = useFarmStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("All");

  const filteredCustomers = customers.filter(c => {
    const matchTier = selectedTier === "All" || c.tier === selectedTier;
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.area.toLowerCase().includes(searchQuery.toLowerCase());

    return matchTier && matchSearch;
  });

  const handleSendReminder = (customerName: string, produceItem: string) => {
    addNotification(
      "WhatsApp Reminder Sent",
      `Simulated message to ${customerName}: "Your fresh favorite ${produceItem} just arrived from Sangli this morning!"`,
      "info"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-[#D4AA52]" />
          Omnichannel Customer Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
          Customer Directory & Loyalty
        </h1>
        <p className="text-xs sm:text-sm text-[#64746A]">
          Single profile across Counter POS and Online Storefront. Track favorite produce and loyalty tiers (Page 13 of PDF).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by customer name, phone, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["All", "Silver", "Gold", "Platinum"].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedTier === tier
                  ? "bg-[#123B2A] text-white shadow-xs"
                  : "bg-[#F8F6F0] text-gray-700 hover:bg-[#EAF2E7]"
              }`}
            >
              {tier} {tier !== "All" ? "Tier" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-[#123B2A]">{c.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.tier === "Platinum" ? "bg-purple-100 text-purple-800" :
                      c.tier === "Gold" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {c.tier} Member
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2F6B45]" />
                    <span>{c.address}</span>
                  </p>
                </div>

                {/* Loyalty points badge */}
                <div className="text-right">
                  <span className="text-xl font-black text-[#123B2A] block">{c.loyaltyPoints}</span>
                  <span className="text-[10px] text-[#2F6B45] font-semibold">Loyalty Pts</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-[#F8F6F0] rounded-xl text-xs">
                <div>
                  <span className="text-gray-500 text-[10px] block">Lifetime Orders</span>
                  <strong className="text-gray-900">{c.totalOrders} visits / orders</strong>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">Lifetime Spend</span>
                  <strong className="text-[#123B2A]">{formatINR(c.totalSpend)}</strong>
                </div>
              </div>

              {/* Favorites */}
              <div>
                <span className="text-[10px] font-bold uppercase text-[#64746A] block mb-1.5 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  Regular Favorites:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {c.favoriteItems.map((fav, i) => (
                    <span key={i} className="bg-white border border-[#E2E8E0] px-2 py-0.5 rounded-lg text-[11px] text-gray-700 font-medium">
                      {fav}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Re-engagement simulator button */}
            <div className="pt-3 border-t border-[#F0F4EF] flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Last seen: {c.lastOrderDate}</span>
              <button
                onClick={() => handleSendReminder(c.name, c.favoriteItems[0] || "Fresh Produce")}
                className="bg-[#EAF2E7] hover:bg-[#2F6B45] text-[#123B2A] hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1"
                title="Send personalized restock alert"
              >
                <Send className="w-3 h-3" />
                <span>Send WhatsApp Alert</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

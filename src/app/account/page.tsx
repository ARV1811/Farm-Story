"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFarmStore } from "@/store/farmStore";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { formatINR, formatDate } from "@/lib/utils";
import { 
  User, 
  Award, 
  Package, 
  MapPin, 
  Clock, 
  ChevronRight, 
  ShoppingBag, 
  Sparkles,
  Phone,
  Mail,
  Truck
} from "lucide-react";

export default function AccountPage() {
  const { customers, orders, addToCustomerCart, addNotification } = useFarmStore();
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "cust-1");

  const customer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Filter orders for this customer name or phone
  const customerOrders = orders.filter(
    o => o.customerPhone === customer.phone || o.customerName.toLowerCase().includes(customer.name.toLowerCase().split(" ")[1] || "")
  );

  const handleReorder = (item: any) => {
    addNotification("Re-order Started", `Added ${item.productName} to your basket.`, "success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0]">
      <StoreHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Switcher for demo customer account */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F6B45]">
              Demo Profile Switcher
            </span>
            <h2 className="text-sm font-bold text-[#123B2A]">
              Switch Customer Account to View Unified Omnichannel Records
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {customers.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCustomerId(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedCustomerId === c.id
                    ? "bg-[#123B2A] text-white shadow-xs"
                    : "bg-[#F8F6F0] text-gray-700 hover:bg-[#EAF2E7]"
                }`}
              >
                {c.name} ({c.tier})
              </button>
            ))}
          </div>
        </div>

        {/* Profile Card & Loyalty Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8E0] farm-card-shadow space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-[#123B2A] text-[#D4AA52] flex items-center justify-center font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                customer.tier === "Platinum"
                  ? "bg-purple-100 text-purple-800"
                  : customer.tier === "Gold"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {customer.tier} Tier Member
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#123B2A]">{customer.name}</h1>
              <div className="space-y-1 text-xs text-[#64746A] mt-2">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#2F6B45]" />
                  <span>{customer.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#2F6B45]" />
                  <span>{customer.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#2F6B45]" />
                  <span>{customer.address}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Loyalty Rewards */}
          <div className="bg-[#123B2A] text-white p-6 rounded-3xl border border-[#1B4D36] farm-card-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#D4AA52] text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>The Farm Story Loyalty</span>
              </div>
              <span className="text-3xl font-black text-white">{customer.loyaltyPoints}</span>
              <span className="text-xs text-[#EAF2E7]/70 ml-2">Available Points</span>
              <p className="text-xs text-[#EAF2E7]/80 mt-2">
                Equivalent to <strong className="text-[#D4AA52]">{formatINR(customer.loyaltyPoints)}</strong> discount on your next store or web purchase.
              </p>
            </div>
            <div className="pt-3 border-t border-[#2F6B45]/60 flex items-center justify-between text-xs text-[#EAF2E7]/70">
              <span>Earn 1 Pt per ₹100 spend</span>
              <span className="text-[#D4AA52] font-semibold">Automatic Redeem at POS</span>
            </div>
          </div>

          {/* Lifetime Spend */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8E0] farm-card-shadow flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#2F6B45] uppercase tracking-wider block mb-2">
                Omnichannel Spend
              </span>
              <span className="text-3xl font-black text-[#123B2A]">
                {formatINR(customer.totalSpend)}
              </span>
              <p className="text-xs text-[#64746A] mt-2">
                Across {customer.totalOrders} in-store counter & web deliveries.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F0F4EF] flex items-center justify-between text-xs">
              <span className="text-[#64746A]">Last Visit / Order:</span>
              <strong className="text-[#123B2A]">{customer.lastOrderDate}</strong>
            </div>
          </div>
        </div>

        {/* Order History with Live Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-[#123B2A]">
            Recent Orders & Delivery Status
          </h2>

          {customerOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-[#E2E8E0] text-center text-xs text-gray-500">
              No orders found for this profile. Try switching profile or placing an order through the shop.
            </div>
          ) : (
            customerOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-[#E2E8E0] p-5 farm-card-shadow space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#F0F4EF]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#123B2A]">
                        Order #{order.orderNumber}
                      </span>
                      <span className="bg-[#EAF2E7] text-[#1B4D36] text-[10px] font-semibold px-2 py-0.5 rounded">
                        {order.channel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64746A] mt-0.5">
                      Placed on {formatDate(order.createdAt)} · Payment: {order.paymentMethod} ({order.paymentStatus})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#123B2A]">
                      {formatINR(order.total)}
                    </span>
                    {order.riderName && (
                      <span className="block text-[11px] text-[#2F6B45]">
                        Rider: {order.riderName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="py-2">
                  <div className="flex items-center justify-between max-w-md mx-auto text-xs relative">
                    {["New", "Packed", "Dispatched", "Delivered"].map((st, idx) => {
                      const stages = ["New", "Packed", "Dispatched", "Delivered"];
                      const currentIdx = stages.indexOf(order.status);
                      const isComplete = currentIdx >= idx;
                      const isCurrent = order.status === st;

                      return (
                        <div key={st} className="flex flex-col items-center z-10">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isCurrent
                              ? "bg-[#D4AA52] text-[#123B2A] ring-4 ring-[#EAF2E7]"
                              : isComplete
                              ? "bg-[#2F6B45] text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[10px] mt-1 font-medium ${isCurrent ? "font-bold text-[#123B2A]" : "text-gray-500"}`}>
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items in order */}
                <div className="bg-[#F8F6F0] rounded-xl p-3 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64746A]">
                    Ordered Items:
                  </span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>{item.quantity}x {item.productName} ({item.unit})</span>
                      <span className="font-semibold">{formatINR(item.total)}</span>
                    </div>
                  ))}
                  {order.packingWeightActualKg && (
                    <div className="pt-1.5 border-t border-gray-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Verified Packed Weight: {order.packingWeightActualKg} kg</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

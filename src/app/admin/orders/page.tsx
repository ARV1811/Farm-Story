"use client";

import React, { useState } from "react";
import { useFarmStore } from "@/store/farmStore";
import { formatINR, formatDate } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronRight, 
  X, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User 
} from "lucide-react";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useFarmStore();
  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeOrderDetail, setActiveOrderDetail] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchChannel = selectedChannel === "All" || o.channel === selectedChannel;
    const matchStatus = selectedStatus === "All" || o.status === selectedStatus;
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);

    return matchChannel && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase flex items-center gap-1">
          <ShoppingBag className="w-3.5 h-3.5 text-[#D4AA52]" />
          Omnichannel Order Fulfillment
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
          All Customer Orders & Invoices
        </h1>
        <p className="text-xs sm:text-sm text-[#64746A]">
          Manage counter POS sales and online delivery orders from a unified command center.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search order #, customer or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["All", "In-Store POS", "Website Online"].map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedChannel === ch
                  ? "bg-[#123B2A] text-white shadow-xs"
                  : "bg-[#F8F6F0] text-gray-700 hover:bg-[#EAF2E7]"
              }`}
            >
              {ch}
            </button>
          ))}
          <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block" />
          {["All", "New", "Packed", "Dispatched", "Delivered", "Completed"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`text-xs px-2.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                selectedStatus === st
                  ? "bg-[#D4AA52] text-[#123B2A] font-bold shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E2E8E0] farm-card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E2E8E0] text-[#64746A] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Items / Weight</th>
                <th className="py-3 px-4">Total Bill</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4EF]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#F8F6F0]/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#123B2A]">{o.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      o.channel === "In-Store POS" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {o.channel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900 block">{o.customerName}</span>
                    <span className="text-[10px] text-gray-500">{o.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">{formatDate(o.createdAt)}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-gray-800">{o.items.length} produce lines</span>
                    {o.packingWeightActualKg && (
                      <span className="text-[10px] text-emerald-700 block font-semibold">
                        Scale: {o.packingWeightActualKg} kg
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-black text-[#123B2A]">{formatINR(o.total)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      o.status === "Completed" || o.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : o.status === "Dispatched"
                        ? "bg-blue-100 text-blue-800"
                        : o.status === "Packed"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActiveOrderDetail(o)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#123B2A] hover:bg-gray-100 transition"
                      title="Inspect order details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {activeOrderDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-end z-50">
          <div className="bg-white h-full w-full max-w-md p-6 overflow-y-auto space-y-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] text-[#2F6B45] font-bold uppercase">Order Inspection</span>
                  <h3 className="font-mono text-base font-extrabold text-[#123B2A]">{activeOrderDetail.orderNumber}</h3>
                </div>
                <button onClick={() => setActiveOrderDetail(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status control */}
              <div className="p-3 bg-[#F8F6F0] rounded-2xl border border-[#E2E8E0] space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Change Fulfillment Status:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(["New", "Packed", "Dispatched", "Delivered", "Completed"] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateOrderStatus(activeOrderDetail.id, st);
                        setActiveOrderDetail({ ...activeOrderDetail, status: st });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        activeOrderDetail.status === st
                          ? "bg-[#123B2A] text-white"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer & Address */}
              <div className="space-y-1.5 text-xs">
                <strong className="text-gray-800 block">Customer Information:</strong>
                <p className="text-gray-600">{activeOrderDetail.customerName} ({activeOrderDetail.customerPhone})</p>
                {activeOrderDetail.deliveryAddress && (
                  <p className="text-gray-600">
                    {activeOrderDetail.deliveryAddress.street}, {activeOrderDetail.deliveryAddress.area}, Pune {activeOrderDetail.deliveryAddress.pincode}
                  </p>
                )}
                {activeOrderDetail.deliverySlot && (
                  <p className="text-emerald-800 font-semibold">Slot: {activeOrderDetail.deliverySlot}</p>
                )}
              </div>

              {/* Ordered items breakdown */}
              <div className="space-y-2">
                <strong className="text-xs text-gray-800 block">Ordered Produce Lines:</strong>
                <div className="divide-y divide-gray-100 text-xs">
                  {activeOrderDetail.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex justify-between">
                      <div>
                        <span className="font-bold text-gray-900">{it.productName}</span>
                        <span className="text-[10px] text-gray-500 block">
                          {it.quantity} x {it.unit} ({(it.weightKg).toFixed(2)} kg) @ {formatINR(it.rate)}
                        </span>
                      </div>
                      <span className="font-extrabold text-[#123B2A]">{formatINR(it.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill totals */}
              <div className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1.5 border border-gray-200">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">{formatINR(activeOrderDetail.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{formatINR(activeOrderDetail.deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Breakdown:</span>
                  <span className="text-emerald-700 font-medium">Included ({formatINR(activeOrderDetail.gstTotal)})</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#123B2A] pt-1.5 border-t border-gray-200">
                  <span>Total Bill:</span>
                  <span>{formatINR(activeOrderDetail.total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveOrderDetail(null)}
              className="w-full py-2.5 bg-[#123B2A] text-white rounded-xl text-xs font-bold hover:bg-[#1B4D36]"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

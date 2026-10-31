"use client";

import React from "react";
import Link from "next/link";
import { useFarmStore } from "@/store/farmStore";
import { formatINR, formatDate } from "@/lib/utils";
import { 
  TrendingUp, 
  Receipt, 
  Trash2, 
  Percent, 
  AlertTriangle, 
  ShoppingBag, 
  Monitor, 
  ArrowUpRight, 
  Clock, 
  Plus, 
  Printer, 
  Boxes,
  Store,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts";

export default function AdminDashboardPage() {
  const { orders, batches, wastageRecords, products, shifts } = useFarmStore();

  const currentShift = shifts.find(s => s.status === "Open") || shifts[0];
  
  // Calculate dynamic stats
  const totalSalesToday = currentShift.totalSales;
  const billsCountToday = currentShift.billsCount;
  const wastageLoss = wastageRecords.reduce((sum, w) => sum + w.estimatedLoss, 0);
  const wastagePct = 2.1; // Baseline from PDF
  const profitMarginPct = 31; // From PDF

  // 7 Days sales trend data
  const sales7Days = [
    { day: "Mon", store: 38200, online: 14500, total: 52700 },
    { day: "Tue", store: 41000, online: 16200, total: 57200 },
    { day: "Wed", store: 39500, online: 15800, total: 55300 },
    { day: "Thu", store: 44100, online: 17900, total: 62000 },
    { day: "Fri", store: 46800, online: 21500, total: 68300 },
    { day: "Sat", store: 58900, online: 28400, total: 87300 },
    { day: "Sun", store: 48250, online: 22750, total: 71000 },
  ];

  // Channel share data (Store 68% vs Online 32% matching PDF page 14)
  const channelData = [
    { name: "In-Store POS (68%)", value: 68, color: "#123B2A" },
    { name: "Online Web (32%)", value: 32, color: "#D4AA52" },
  ];

  // Near expiry batches
  const nearExpiryBatches = batches.filter(
    b => b.remainingQuantityKg > 0 && (b.status === "Critical" || b.status === "Expiring Soon")
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#2F6B45] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AA52]" />
            <span>Owner & Management Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A]">
            The Farm Story Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#64746A]">
            Illustrative executive metrics synchronized across dock receiving, in-store POS, and doorstep deliveries.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/inventory"
            className="px-3.5 py-2 bg-white border border-[#E2E8E0] text-[#123B2A] hover:bg-[#EAF2E7] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Boxes className="w-3.5 h-3.5 text-[#2F6B45]" />
            <span>Record Wastage</span>
          </Link>
          <Link
            href="/admin/purchases"
            className="px-3.5 py-2 bg-[#123B2A] hover:bg-[#1B4D36] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Purchase Order</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Metric Cards (Directly matching PDF Page 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] farm-card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#64746A] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Today&apos;s Sales</span>
            <span className="p-2 rounded-xl bg-[#EAF2E7] text-[#2F6B45]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#123B2A] block">
              {formatINR(totalSalesToday)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% vs yesterday</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F0F4EF] text-[11px] text-[#64746A]">
            Real-time counter & web orders
          </div>
        </div>

        {/* Bills Count */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] farm-card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#64746A] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Bills Generated</span>
            <span className="p-2 rounded-xl bg-[#EAF2E7] text-[#2F6B45]">
              <Receipt className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#123B2A] block">
              {billsCountToday}
            </span>
            <div className="text-xs text-[#64746A] mt-1">
              Avg. Basket Value: <strong className="text-[#123B2A]">{formatINR(Math.round(totalSalesToday / (billsCountToday || 1)))}</strong>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F0F4EF] text-[11px] text-[#64746A]">
            Counter 1 + Web Checkout
          </div>
        </div>

        {/* Wastage % */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] farm-card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#64746A] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Wastage %</span>
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Trash2 className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-800 block">
              {wastagePct}%
            </span>
            <div className="text-xs text-amber-900 font-semibold mt-1">
              Estimated Loss: {formatINR(wastageLoss)}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F0F4EF] text-[11px] text-emerald-700 font-medium">
            Industry avg: 5.5% · Saved 3.4%
          </div>
        </div>

        {/* Gross Margin */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] farm-card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#64746A] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Gross Margin</span>
            <span className="p-2 rounded-xl bg-[#EAF2E7] text-[#2F6B45]">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#123B2A] block">
              {profitMarginPct}%
            </span>
            <div className="text-xs text-[#2F6B45] font-semibold mt-1">
              Direct farm procurement gain
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F0F4EF] text-[11px] text-[#64746A]">
            Mandi intermediaries eliminated
          </div>
        </div>
      </div>

      {/* Charts Section: 7-Day Trend + Channel Share + Near Expiry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Sales Trend Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#E2E8E0] farm-card-shadow space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F4EF]">
            <div>
              <h3 className="font-bold text-sm text-[#123B2A]">Sales Trend (Last 7 Days)</h3>
              <p className="text-xs text-[#64746A]">Daily revenue split between Physical Store & Online Deliveries</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-gray-700">
                <span className="w-3 h-3 rounded-full bg-[#123B2A]" /> In-Store
              </span>
              <span className="flex items-center gap-1.5 text-gray-700">
                <span className="w-3 h-3 rounded-full bg-[#D4AA52]" /> Online
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales7Days} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  formatter={(val: any) => formatINR(Number(val))}
                  contentStyle={{ backgroundColor: "#123B2A", color: "#fff", borderRadius: 12, fontSize: 11 }}
                />
                <Bar dataKey="store" name="In-Store POS" fill="#123B2A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="online" name="Online Web" fill="#D4AA52" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channels & Near Expiry Alerts (Page 14 layout) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Channel Donut */}
          <div className="bg-white p-5 rounded-3xl border border-[#E2E8E0] farm-card-shadow">
            <h3 className="font-bold text-sm text-[#123B2A] mb-1">Channel Split</h3>
            <p className="text-[11px] text-[#64746A] mb-3">Store 68% vs Online 32% (From PDF Page 14)</p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={24} iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Near Expiry Produce Box (Page 14) */}
          <div className="bg-white p-5 rounded-3xl border border-[#E2E8E0] farm-card-shadow space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Near Expiry Batches</span>
              </div>
              <Link href="/admin/inventory" className="text-[11px] text-[#2F6B45] font-semibold hover:underline">
                View All Batches
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
                <div>
                  <strong className="text-rose-900 block">Aromatic Coriander (Dhaniya)</strong>
                  <span className="text-[10px] text-rose-700">Batch B-261027-C · 6 kg left</span>
                </div>
                <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold">
                  Expires Today
                </span>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <strong className="text-amber-900 block">Tender Spinach (Palak)</strong>
                  <span className="text-[10px] text-amber-700">Batch B-261029-S · 14 kg left</span>
                </div>
                <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-bold">
                  1 Day Left
                </span>
              </div>

              <div className="p-2.5 bg-yellow-50 rounded-xl border border-yellow-200 flex items-center justify-between">
                <div>
                  <strong className="text-yellow-900 block">Kesar Mangoes</strong>
                  <span className="text-[10px] text-yellow-700">Batch B-261026-M · 24 kg left</span>
                </div>
                <span className="px-2 py-0.5 bg-yellow-600 text-white rounded text-[10px] font-bold">
                  2 Days Left
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Recent Transactions Feed */}
      <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F4EF]">
          <div>
            <h3 className="font-bold text-sm text-[#123B2A]">Recent Real-time Orders</h3>
            <p className="text-xs text-[#64746A]">Unified across In-Store Billing & Website Online Checkouts</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-bold text-[#2F6B45] hover:underline flex items-center gap-1">
            <span>Manage All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E2E8E0] text-[#64746A] uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Order / Bill #</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Items & Weight</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4EF]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#F8F6F0]/60 transition">
                  <td className="py-3 px-3 font-mono font-bold text-[#123B2A]">{order.orderNumber}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      order.channel === "In-Store POS" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {order.channel}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-gray-800 block">{order.customerName}</span>
                    <span className="text-[10px] text-gray-400">{order.customerPhone}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-gray-700">{order.items.length} lines</span>
                    <span className="text-[10px] text-gray-400 block">
                      {order.items.map(i => i.productName.split(" ")[0]).join(", ")}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-black text-[#123B2A]">{formatINR(order.total)}</td>
                  <td className="py-3 px-3">
                    <span className="text-gray-800 font-medium">{order.paymentMethod}</span>
                    <span className="text-[10px] text-gray-500 block">({order.paymentStatus})</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      order.status === "Completed" || order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : order.status === "Dispatched"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Packed"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

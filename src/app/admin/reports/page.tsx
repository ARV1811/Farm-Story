"use client";

import React from "react";
import { useFarmStore } from "@/store/farmStore";
import { formatINR } from "@/lib/utils";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Sparkles, 
  Leaf, 
  Trash2, 
  Users, 
  Layers 
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

export default function AdminReportsPage() {
  const { products, wastageRecords, suppliers } = useFarmStore();

  const topProducts = [
    { name: "Desi Tomatoes", sales: 18400, margin: "34%" },
    { name: "A2 Gir Cow Ghee", sales: 16150, margin: "28%" },
    { name: "Kesar Mangoes", sales: 12240, margin: "43%" },
    { name: "Wood-Pressed Oil", sales: 8700, margin: "35%" },
    { name: "Green Spinach", sales: 6480, margin: "40%" },
  ];

  const wastageByReason = [
    { reason: "Overripe / Spoiled", value: 48, fill: "#e11d48" },
    { reason: "Bruised in Transit", value: 26, fill: "#f59e0b" },
    { reason: "Handling at Counter", value: 16, fill: "#10b981" },
    { reason: "Evaporation / Moisture", value: 10, fill: "#6366f1" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-[#D4AA52]" />
            Business Intelligence & Insights
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
            Reports & Profit Optimization
          </h1>
          <p className="text-xs sm:text-sm text-[#64746A]">
            &ldquo;Every 1% of purchases saved from spoilage drops straight to profit.&rdquo; (Page 16 of PDF)
          </p>
        </div>

        <button
          onClick={() => alert("Demonstration Notice: Generating scheduled weekly consolidated executive PDF report.")}
          className="bg-[#123B2A] hover:bg-[#1B4D36] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Pack</span>
        </button>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Produce Revenue */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E2E8E0] farm-card-shadow space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#123B2A]">Top Produce Items by Revenue</h3>
            <p className="text-xs text-[#64746A]">Weekly gross turnover and procurement margin</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 0 }}>
                <XAxis type="number" tickFormatter={(v) => `₹${v/1000}k`} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
                <Tooltip formatter={(v: any) => formatINR(Number(v))} />
                <Bar dataKey="sales" fill="#123B2A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spoilage Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E2E8E0] farm-card-shadow space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#123B2A]">Wastage by Spoilage Reason</h3>
            <p className="text-xs text-[#64746A]">Insights to negotiate handling with farm logistics</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wastageByReason}
                  dataKey="value"
                  nameKey="reason"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {wastageByReason.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}% of total wastage`} />
                <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Supplier Performance Comparison Table */}
      <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-4">
        <h3 className="font-bold text-sm text-[#123B2A]">Farm Supplier Reliability & Rejection Rates</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E2E8E0] text-[#64746A] uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Supplier Name</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Primary Produce</th>
                <th className="py-2.5 px-3">On-Time Delivery</th>
                <th className="py-2.5 px-3">Average Dock Rejection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4EF]">
              {suppliers.map((s, idx) => (
                <tr key={s.id} className="hover:bg-[#F8F6F0]/60 transition">
                  <td className="py-3 px-3 font-bold text-[#123B2A]">{s.name}</td>
                  <td className="py-3 px-3 text-gray-600">{s.location}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-800">★ {s.rating}</td>
                  <td className="py-3 px-3 text-gray-700">{s.primaryProduce.join(", ")}</td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">{idx === 0 ? "98.5%" : idx === 1 ? "99.1%" : "96.4%"}</td>
                  <td className="py-3 px-3 text-gray-500 font-medium">{idx === 0 ? "0.8%" : idx === 1 ? "1.2%" : "0.5%"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

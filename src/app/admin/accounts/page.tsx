"use client";

import React, { useState } from "react";
import { useFarmStore } from "@/store/farmStore";
import { formatINR } from "@/lib/utils";
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  Receipt, 
  Building2, 
  Check, 
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";

export default function AdminAccountsPage() {
  const { gstEntries, orders, purchaseOrders } = useFarmStore();
  const [activeTab, setActiveTab] = useState<"sales-register" | "gstr-summary" | "pnl">("sales-register");

  const totalNilRatedSales = gstEntries.reduce((sum, g) => sum + g.nilRatedAmount, 0);
  const totalTaxableSales = gstEntries.reduce((sum, g) => sum + g.taxableAmount, 0);
  const totalCgstCollected = gstEntries.reduce((sum, g) => sum + g.cgst, 0);
  const totalSgstCollected = gstEntries.reduce((sum, g) => sum + g.sgst, 0);
  const totalTaxCollected = totalCgstCollected + totalSgstCollected;

  const totalPurchases = purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0);
  const estimatedGrossProfit = (totalNilRatedSales + totalTaxableSales) * 0.31; // 31% margin from PDF

  const handleExportCsv = (reportName: string) => {
    alert(`Demonstration Simulation: Exporting "${reportName}.csv" formatted for your CA / Tally Prime import.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AA52]" />
            Indian Retail Compliance (Page 34)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
            Accounts, GST & CA Summaries
          </h1>
          <p className="text-xs sm:text-sm text-[#64746A]">
            Automatic postings from counter bills and online orders. GST split between Nil-rated fresh produce & taxable packaged goods.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCsv("GSTR1_Monthly_Summary")}
            className="bg-white border border-[#E2E8E0] hover:bg-[#EAF2E7] text-[#123B2A] px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4 text-[#2F6B45]" />
            <span>Export for CA</span>
          </button>
        </div>
      </div>

      {/* Compliance Overview Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Nil-Rated Fresh Produce</span>
          <span className="text-2xl font-black text-emerald-800 block mt-1">
            {formatINR(totalNilRatedSales)}
          </span>
          <span className="text-[10px] text-gray-400">0% GST (Fresh Vegetables & Fruits)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Taxable Packaged Goods</span>
          <span className="text-2xl font-black text-[#123B2A] block mt-1">
            {formatINR(totalTaxableSales)}
          </span>
          <span className="text-[10px] text-gray-400">5% / 12% (Oils, Honey, Ghee)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Total GST Output Tax</span>
          <span className="text-2xl font-black text-[#2F6B45] block mt-1">
            {formatINR(totalTaxCollected)}
          </span>
          <span className="text-[10px] text-gray-400">CGST ({formatINR(totalCgstCollected)}) + SGST ({formatINR(totalSgstCollected)})</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Input Tax Credit (ITC)</span>
          <span className="text-2xl font-black text-purple-800 block mt-1">
            ₹0.00
          </span>
          <span className="text-[10px] text-gray-400">Fresh mandi farm purchases (exempt)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8E0] pb-2">
        <button
          onClick={() => setActiveTab("sales-register")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "sales-register"
              ? "bg-[#123B2A] text-white shadow-xs"
              : "bg-white text-gray-700 border border-[#E2E8E0] hover:bg-[#EAF2E7]"
          }`}
        >
          Daily Sales Register (Tax Split)
        </button>
        <button
          onClick={() => setActiveTab("gstr-summary")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "gstr-summary"
              ? "bg-[#123B2A] text-white shadow-xs"
              : "bg-white text-gray-700 border border-[#E2E8E0] hover:bg-[#EAF2E7]"
          }`}
        >
          GSTR-1 & GSTR-3B CA Summary
        </button>
        <button
          onClick={() => setActiveTab("pnl")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "pnl"
              ? "bg-[#123B2A] text-white shadow-xs"
              : "bg-white text-gray-700 border border-[#E2E8E0] hover:bg-[#EAF2E7]"
          }`}
        >
          Profit & Loss Statement
        </button>
      </div>

      {/* Tab 1: Sales Register */}
      {activeTab === "sales-register" && (
        <div className="bg-white rounded-3xl border border-[#E2E8E0] farm-card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#E2E8E0] text-[#64746A] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Invoice / Bill #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Invoice Type</th>
                  <th className="py-3 px-4">Nil-Rated (0%)</th>
                  <th className="py-3 px-4">Taxable Value</th>
                  <th className="py-3 px-4">CGST</th>
                  <th className="py-3 px-4">SGST</th>
                  <th className="py-3 px-4 font-bold text-right">Invoice Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EF]">
                {gstEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#F8F6F0]/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#123B2A]">{entry.invoiceNumber}</td>
                    <td className="py-3 px-4 text-gray-600">{entry.date}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{entry.customerName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        entry.type === "Bill of Supply" ? "bg-emerald-100 text-emerald-800" : "bg-purple-100 text-purple-800"
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-emerald-800 font-semibold">{formatINR(entry.nilRatedAmount)}</td>
                    <td className="py-3 px-4 text-gray-700">{formatINR(entry.taxableAmount)}</td>
                    <td className="py-3 px-4 text-gray-600">{formatINR(entry.cgst)}</td>
                    <td className="py-3 px-4 text-gray-600">{formatINR(entry.sgst)}</td>
                    <td className="py-3 px-4 font-black text-[#123B2A] text-right">{formatINR(entry.totalInvoice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: GSTR-1 & 3B Summary (CA View) */}
      {activeTab === "gstr-summary" && (
        <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-sm text-[#123B2A]">GSTR-1 Monthly Return Filing Summary</h3>
              <p className="text-xs text-gray-500">Prepared for CA verification before uploading to the GST portal.</p>
            </div>
            <button
              onClick={() => handleExportCsv("GSTR1_Table_4_and_8")}
              className="bg-[#123B2A] text-white px-3 py-1.5 rounded-xl text-xs font-bold"
            >
              Download JSON / Excel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Table 8: Nil-Rated Supplies */}
            <div className="bg-[#F8F6F0] p-4 rounded-2xl border border-[#E2E8E0] space-y-3">
              <span className="font-bold text-[#123B2A] text-sm block">
                Table 8: Nil Rated / Exempted Supplies
              </span>
              <p className="text-gray-600 text-[11px]">
                Fresh country tomatoes, spinach, bananas, lemons, and daily vegetables exempt under Section 11 of CGST Act.
              </p>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                <span>Total Exempted Turnover:</span>
                <span className="text-emerald-800 text-sm">{formatINR(totalNilRatedSales)}</span>
              </div>
            </div>

            {/* Table 4/5: Taxable Supplies */}
            <div className="bg-[#F8F6F0] p-4 rounded-2xl border border-[#E2E8E0] space-y-3">
              <span className="font-bold text-[#123B2A] text-sm block">
                Table 5: Taxable B2C Outward Supplies
              </span>
              <p className="text-gray-600 text-[11px]">
                Wood-pressed peanut oil (5%), wild forest honey (5%), and Gir cow A2 Bilona ghee (12%).
              </p>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                <span>Taxable Value + Tax:</span>
                <span className="text-[#123B2A] text-sm">{formatINR(totalTaxableSales + totalTaxCollected)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Profit & Loss Statement */}
      {activeTab === "pnl" && (
        <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-4 max-w-2xl">
          <h3 className="font-bold text-sm text-[#123B2A] pb-2 border-b border-gray-100">
            Illustrative Monthly Profit & Loss Statement
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1">
              <span className="font-bold text-gray-800">Gross Revenue (In-Store + Web)</span>
              <span className="font-black text-[#123B2A]">{formatINR(totalNilRatedSales + totalTaxableSales)}</span>
            </div>

            <div className="flex justify-between py-1 text-gray-600 pl-4">
              <span>Less: Direct Farm Procurement (COGS)</span>
              <span>-{formatINR(totalPurchases)}</span>
            </div>

            <div className="flex justify-between py-1 text-amber-700 pl-4">
              <span>Less: Produce Spoilage & Wastage</span>
              <span>-₹266.00</span>
            </div>

            <div className="flex justify-between py-2 border-y border-gray-200 font-bold text-emerald-800 text-sm">
              <span>Gross Margin (31.0%)</span>
              <span>{formatINR(estimatedGrossProfit)}</span>
            </div>

            <div className="flex justify-between py-1 text-gray-600 pl-4">
              <span>Less: Store Counter & EV Logistics Expenses</span>
              <span>-₹6,400.00</span>
            </div>

            <div className="flex justify-between pt-3 border-t-2 border-[#123B2A] font-black text-base text-[#123B2A]">
              <span>Estimated Net Operating Profit</span>
              <span>{formatINR(estimatedGrossProfit - 6400)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

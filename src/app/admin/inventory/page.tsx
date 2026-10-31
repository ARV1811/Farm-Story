"use client";

import React, { useState } from "react";
import { useFarmStore } from "@/store/farmStore";
import { formatINR, formatDate } from "@/lib/utils";
import { 
  Boxes, 
  Trash2, 
  Barcode, 
  AlertTriangle, 
  Clock, 
  Printer, 
  Plus, 
  Check, 
  X,
  FileSpreadsheet,
  Sparkles
} from "lucide-react";

export default function AdminInventoryPage() {
  const { 
    batches, 
    products, 
    wastageRecords, 
    recordWastage, 
    updateStockDirectly 
  } = useFarmStore();

  const [activeTab, setActiveTab] = useState<"batches" | "wastage" | "labels">("batches");
  const [showWastageModal, setShowWastageModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedBatchForLabel, setSelectedBatchForLabel] = useState(batches[0]);

  // Wastage Form
  const [wasteProductId, setWasteProductId] = useState(products[0]?.id || "");
  const [wasteBatchNum, setWasteBatchNum] = useState(batches[0]?.batchNumber || "");
  const [wasteQty, setWasteQty] = useState("1.5");
  const [wasteReason, setWasteReason] = useState<any>("Overripe / Spoiled");

  const totalBatchesKg = batches.reduce((sum, b) => sum + b.remainingQuantityKg, 0);
  const totalWastageLoss = wastageRecords.reduce((sum, w) => sum + w.estimatedLoss, 0);

  const handleRecordWastageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === wasteProductId) || products[0];
    const qty = parseFloat(wasteQty) || 1.0;
    const estLoss = qty * product.pricePerKg;

    recordWastage({
      productId: product.id,
      productName: product.name,
      batchNumber: wasteBatchNum,
      quantityKg: qty,
      estimatedLoss: estLoss,
      reason: wasteReason,
      reportedBy: "Mahesh (Inventory Exec)"
    });

    setShowWastageModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase flex items-center gap-1">
            <Boxes className="w-3.5 h-3.5 text-[#D4AA52]" />
            Batch & Freshness Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
            Live Inventory & FIFO Batches
          </h1>
          <p className="text-xs sm:text-sm text-[#64746A]">
            Oldest batches sell first automatically across Store POS and Website. Expiry tracked down to the day.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLabelModal(true)}
            className="bg-white border border-[#E2E8E0] hover:bg-[#EAF2E7] text-[#123B2A] px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Barcode className="w-4 h-4 text-[#2F6B45]" />
            <span>Barcode & Labels</span>
          </button>

          <button
            onClick={() => setShowWastageModal(true)}
            className="bg-[#123B2A] hover:bg-[#1B4D36] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Trash2 className="w-4 h-4 text-amber-300" />
            <span>Record Wastage</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-xs text-[#64746A] uppercase font-semibold">Active Tracked Stock</span>
          <span className="text-2xl font-black text-[#123B2A] block mt-1">
            {totalBatchesKg.toFixed(1)} kg
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Across {batches.length} active batches</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-xs text-[#64746A] uppercase font-semibold">Total Wastage Loss Recorded</span>
          <span className="text-2xl font-black text-amber-800 block mt-1">
            {formatINR(totalWastageLoss)}
          </span>
          <span className="text-[11px] text-gray-500">{wastageRecords.length} recorded incidents</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-xs text-[#64746A] uppercase font-semibold">FIFO Rotation Rule</span>
          <span className="text-sm font-bold text-emerald-800 block mt-1">
            Earliest Expiry First
          </span>
          <span className="text-[11px] text-gray-500">Auto-deducted on billing</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8E0] pb-2">
        <button
          onClick={() => setActiveTab("batches")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "batches"
              ? "bg-[#123B2A] text-white shadow-xs"
              : "bg-white text-gray-700 border border-[#E2E8E0] hover:bg-[#EAF2E7]"
          }`}
        >
          Active Batches & Shelf Life
        </button>
        <button
          onClick={() => setActiveTab("wastage")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "wastage"
              ? "bg-[#123B2A] text-white shadow-xs"
              : "bg-white text-gray-700 border border-[#E2E8E0] hover:bg-[#EAF2E7]"
          }`}
        >
          Wastage Log & Spoilage Reasons
        </button>
      </div>

      {/* Tab 1: Batches Grid */}
      {activeTab === "batches" && (
        <div className="bg-white rounded-3xl border border-[#E2E8E0] farm-card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#E2E8E0] text-[#64746A] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Batch Number</th>
                  <th className="py-3 px-4">Produce Name</th>
                  <th className="py-3 px-4">Supplier / Farm</th>
                  <th className="py-3 px-4">Received Date</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Remaining (kg)</th>
                  <th className="py-3 px-4">Unit Cost</th>
                  <th className="py-3 px-4">Freshness Status</th>
                  <th className="py-3 px-4 text-right">Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EF]">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F8F6F0]/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#123B2A]">{b.batchNumber}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{b.productName}</td>
                    <td className="py-3 px-4 text-gray-600">{b.supplierName}</td>
                    <td className="py-3 px-4 text-gray-600">{b.receivedDate}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{b.expiryDate}</td>
                    <td className="py-3 px-4">
                      <strong className="text-[#123B2A]">{b.remainingQuantityKg} kg</strong>
                      <span className="text-[10px] text-gray-400 block">of {b.initialQuantityKg} kg</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{formatINR(b.costPerKg)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === "Fresh"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.status === "Expiring Soon"
                          ? "bg-amber-100 text-amber-800"
                          : b.status === "Critical"
                          ? "bg-rose-100 text-rose-800 animate-pulse"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedBatchForLabel(b);
                          setShowLabelModal(true);
                        }}
                        className="p-1 rounded text-gray-600 hover:text-[#123B2A] hover:bg-gray-100"
                        title="Print Barcode Label"
                      >
                        <Barcode className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Wastage Log */}
      {activeTab === "wastage" && (
        <div className="bg-white rounded-3xl border border-[#E2E8E0] farm-card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#E2E8E0] text-[#64746A] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Incident Date</th>
                  <th className="py-3 px-4">Produce Name</th>
                  <th className="py-3 px-4">Batch Number</th>
                  <th className="py-3 px-4">Quantity Written Off</th>
                  <th className="py-3 px-4">Estimated Loss</th>
                  <th className="py-3 px-4">Recorded Reason</th>
                  <th className="py-3 px-4">Reported By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EF]">
                {wastageRecords.map((w) => (
                  <tr key={w.id} className="hover:bg-[#F8F6F0]/60 transition">
                    <td className="py-3 px-4 text-gray-600">{w.date}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{w.productName}</td>
                    <td className="py-3 px-4 font-mono text-[#123B2A]">{w.batchNumber}</td>
                    <td className="py-3 px-4 font-bold text-amber-800">{w.quantityKg} kg</td>
                    <td className="py-3 px-4 font-black text-rose-700">{formatINR(w.estimatedLoss)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-semibold text-[10px]">
                        {w.reason}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{w.reportedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Wastage Recording Modal */}
      {showWastageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full farm-card-shadow space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#123B2A]">Record Spoilage / Wastage</h3>
              <button onClick={() => setShowWastageModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordWastageSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Select Produce</label>
                <select
                  value={wasteProductId}
                  onChange={(e) => setWasteProductId(e.target.value)}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.currentStockKg} kg)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Batch Number</label>
                <select
                  value={wasteBatchNum}
                  onChange={(e) => setWasteBatchNum(e.target.value)}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs font-mono"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.batchNumber}>
                      {b.batchNumber} - {b.productName} ({b.remainingQuantityKg} kg left)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Quantity Written Off (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={wasteQty}
                  onChange={(e) => setWasteQty(e.target.value)}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Reason for Spoilage</label>
                <select
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value as any)}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                >
                  <option value="Overripe / Spoiled">Overripe / Spoiled</option>
                  <option value="Bruised / Damaged">Bruised / Damaged in Transit</option>
                  <option value="Handling Loss">Handling Loss at Counter</option>
                  <option value="Weight Evaporation">Natural Weight Evaporation</option>
                  <option value="Expired">Past Best Before Date</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWastageModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-700 text-white rounded-xl text-xs font-bold hover:bg-rose-800 transition"
                >
                  Confirm & Write Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode & Label Format Preview Modal (Directly Inspired by Page 10 of PDF) */}
      {showLabelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full farm-card-shadow space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Barcode className="w-5 h-5 text-[#2F6B45]" />
                <h3 className="font-bold text-sm text-[#123B2A]">Thermal Barcode Label Generator</h3>
              </div>
              <button onClick={() => setShowLabelModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#64746A]">
              Simulated 50mm x 35mm thermal adhesive sticker matching Page 10 of client presentation.
            </p>

            {/* The Sample Label matching Page 10 of PDF:
                ORGANIC TOMATO
                500 g  ₹30
                Packed 28 Oct  Best before 31 Oct
                Batch 261028-A
                |||||||||||||||||||||
            */}
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border-2 border-gray-400 font-mono text-black text-center max-w-xs mx-auto shadow-sm">
              <p className="font-bold text-xs uppercase tracking-wider text-emerald-950">
                {selectedBatchForLabel?.productName || "ORGANIC COUNTRY TOMATO"}
              </p>
              <div className="flex items-baseline justify-center gap-4 my-2">
                <span className="text-lg font-black">500 g</span>
                <span className="text-2xl font-black">₹30</span>
              </div>
              <div className="text-[10px] text-gray-700 space-y-0.5">
                <p>Packed: 28 Oct · Best before: {selectedBatchForLabel?.expiryDate || "31 Oct"}</p>
                <p className="font-bold">Batch: {selectedBatchForLabel?.batchNumber || "261028-A"}</p>
              </div>

              {/* Barcode graphic */}
              <div className="my-3 py-1 flex justify-center">
                <div className="flex items-end gap-1 h-12 w-48 bg-white p-1 border border-gray-300 justify-center">
                  {[3,1,4,2,1,5,2,4,1,3,2,5,1,2,4,2,3,1,4,2].map((w, idx) => (
                    <span
                      key={idx}
                      className="bg-black h-full inline-block"
                      style={{ width: `${w * 2}px` }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[9px] text-gray-500 font-sans">Oldest stock sells first, automatically.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#D4AA52] hover:bg-[#c49a42] text-[#123B2A] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Simulate Label Print</span>
              </button>
              <button
                onClick={() => setShowLabelModal(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

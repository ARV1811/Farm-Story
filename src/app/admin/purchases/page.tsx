"use client";

import React, { useState } from "react";
import { useFarmStore } from "@/store/farmStore";
import { formatINR } from "@/lib/utils";
import { Supplier, PurchaseOrder } from "@/types";
import { 
  ShoppingCart, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  FileCheck, 
  PackagePlus, 
  X,
  Truck
} from "lucide-react";

export default function AdminPurchasesPage() {
  const { 
    suppliers, 
    purchaseOrders, 
    createPurchaseOrder, 
    receivePurchaseOrder, 
    products 
  } = useFarmStore();

  const [activeTab, setActiveTab] = useState<"pos" | "suppliers">("pos");
  const [showCreatePoModal, setShowCreatePoModal] = useState(false);
  const [receivingPo, setReceivingPo] = useState<PurchaseOrder | null>(null);

  // New PO form state
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "sup-1");
  const [poProductId, setPoProductId] = useState(products[0]?.id || "prod-tomato");
  const [poQtyKg, setPoQtyKg] = useState("100");
  const [poRatePerKg, setPoRatePerKg] = useState("22");
  const [poNotes, setPoNotes] = useState("Direct from farm; Grade A Desi Tomatoes in 20kg crates.");

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];
    const product = products.find(p => p.id === poProductId) || products[0];
    const qty = parseFloat(poQtyKg) || 50;
    const rate = parseFloat(poRatePerKg) || 20;
    const total = qty * rate;

    createPurchaseOrder({
      supplierId: supplier.id,
      supplierName: supplier.name,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDate: new Date().toISOString().split("T")[0],
      items: [
        {
          productId: product.id,
          productName: product.name,
          quantityKg: qty,
          ratePerKg: rate,
          total
        }
      ],
      subtotal: total,
      gstAmount: 0,
      totalAmount: total,
      notes: poNotes
    });

    setShowCreatePoModal(false);
  };

  const handleConfirmReceive = () => {
    if (!receivingPo) return;
    receivePurchaseOrder(receivingPo.id, "Mahesh (Inventory Exec)");
    setReceivingPo(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase flex items-center gap-1">
            <ShoppingCart className="w-3.5 h-3.5 text-[#D4AA52]" />
            Procurement & Dock Receiving
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
            Purchases & Supplier Operations
          </h1>
          <p className="text-xs sm:text-sm text-[#64746A]">
            Compare rates from farm collectives and auto-create FIFO batches upon receiving goods.
          </p>
        </div>

        <button
          onClick={() => setShowCreatePoModal(true)}
          className="bg-[#123B2A] hover:bg-[#1B4D36] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8E0] pb-2">
        <button
          onClick={() => setActiveTab("pos")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "pos"
              ? "bg-[#123B2A] text-white shadow-xs"
              : "bg-white text-gray-700 border border-[#E2E8E0] hover:bg-[#EAF2E7]"
          }`}
        >
          Purchase Orders & Dock Log ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("suppliers")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "suppliers"
              ? "bg-[#123B2A] text-white shadow-xs"
              : "bg-white text-gray-700 border border-[#E2E8E0] hover:bg-[#EAF2E7]"
          }`}
        >
          Partner Farms & Suppliers ({suppliers.length})
        </button>
      </div>

      {/* PO List */}
      {activeTab === "pos" && (
        <div className="bg-white rounded-3xl border border-[#E2E8E0] farm-card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#E2E8E0] text-[#64746A] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Supplier / Farm</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Produce Ordered</th>
                  <th className="py-3 px-4">Total Value</th>
                  <th className="py-3 px-4">Receiving Status</th>
                  <th className="py-3 px-4 text-right">Dock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EF]">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-[#F8F6F0]/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#123B2A]">{po.poNumber}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{po.supplierName}</td>
                    <td className="py-3 px-4 text-gray-600">{po.orderDate}</td>
                    <td className="py-3 px-4">
                      {po.items.map((it, idx) => (
                        <div key={idx} className="text-gray-800">
                          {it.quantityKg} kg {it.productName} @ {formatINR(it.ratePerKg)}/kg
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 font-black text-[#123B2A]">{formatINR(po.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        po.status === "Received"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {po.status}
                      </span>
                      {po.receivedDetails && (
                        <span className="text-[10px] text-gray-500 block mt-0.5">
                          Batch: {po.receivedDetails.batchNumberCreated}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {po.status === "Sent" ? (
                        <button
                          onClick={() => setReceivingPo(po)}
                          className="bg-[#2F6B45] hover:bg-[#123B2A] text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1 ml-auto"
                        >
                          <PackagePlus className="w-3.5 h-3.5" />
                          <span>Receive at Dock</span>
                        </button>
                      ) : (
                        <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Stock Synced</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suppliers Grid */}
      {activeTab === "suppliers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-white p-5 rounded-2xl border border-[#E2E8E0] farm-card-shadow space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#123B2A]">{s.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#2F6B45]" />
                    <span>{s.location}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{s.rating}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600">
                <p><strong>Contact:</strong> {s.contactPerson} ({s.phone})</p>
                <p><strong>Payment Terms:</strong> {s.paymentTerms}</p>
                <p><strong>Outstanding Balance:</strong> <span className="font-bold text-rose-700">{formatINR(s.outstandingBalance)}</span></p>
              </div>

              <div className="pt-2 border-t border-[#F0F4EF]">
                <span className="text-[10px] font-bold uppercase text-[#64746A] block mb-1">Recent Farm Gate Rates:</span>
                <div className="flex gap-2 flex-wrap">
                  {s.recentRates.map((r, i) => (
                    <span key={i} className="bg-[#F8F6F0] px-2 py-1 rounded text-[11px] text-gray-800">
                      {r.productName}: <strong>{formatINR(r.ratePerKg)}/kg</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Goods Receiving Modal */}
      {receivingPo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full farm-card-shadow space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#2F6B45]" />
                <h3 className="font-bold text-base text-[#123B2A]">Dock Receiving & Batch Creation</h3>
              </div>
              <button onClick={() => setReceivingPo(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#64746A]">
              Receiving crates for <strong className="text-gray-900">{receivingPo.poNumber}</strong> from {receivingPo.supplierName}.
            </p>

            <div className="bg-[#EAF2E7] p-4 rounded-2xl text-xs space-y-2">
              <span className="font-bold text-[#123B2A] block text-sm">Automated System Actions:</span>
              <p>✓ Generate fresh Batch code with 5-day shelf life.</p>
              <p>✓ Increase live stock on Store POS and Website simultaneously.</p>
              <p>✓ Record dock receiving receipt for Purchase Register & GST accounts.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReceivingPo(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReceive}
                className="flex-1 py-2.5 bg-[#123B2A] text-white rounded-xl text-xs font-bold hover:bg-[#1B4D36] transition"
              >
                Confirm Receipt & Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {showCreatePoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full farm-card-shadow space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#123B2A]">New Purchase Order</h3>
              <button onClick={() => setShowCreatePoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePo} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Select Supplier / Farm</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Produce</label>
                <select
                  value={poProductId}
                  onChange={(e) => setPoProductId(e.target.value)}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={poQtyKg}
                    onChange={(e) => setPoQtyKg(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Agreed Rate (₹/kg)</label>
                  <input
                    type="number"
                    value={poRatePerKg}
                    onChange={(e) => setPoRatePerKg(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Notes / Grading Instructions</label>
                <textarea
                  rows={2}
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-600">Total Purchase Commitment:</span>
                <strong className="text-base font-black text-[#123B2A]">
                  {formatINR((parseFloat(poQtyKg) || 0) * (parseFloat(poRatePerKg) || 0))}
                </strong>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePoModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#123B2A] text-white rounded-xl text-xs font-bold hover:bg-[#1B4D36]"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

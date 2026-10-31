"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useFarmStore } from "@/store/farmStore";
import { Product, UnitType, PaymentMethod, Order } from "@/types";
import { formatINR } from "@/lib/utils";
import { 
  Barcode, 
  Search, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  Printer, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Check, 
  X, 
  Plus, 
  Minus, 
  CreditCard, 
  QrCode, 
  Banknote, 
  User, 
  Scale, 
  FileText,
  Clock,
  Sparkles,
  ArrowLeft
} from "lucide-react";

export default function PosBillingPage() {
  const { 
    products, 
    posCart, 
    addToPosCart, 
    updatePosCartItem, 
    removeFromPosCart, 
    clearPosCart,
    heldBills,
    holdCurrentPosBill,
    resumeHeldPosBill,
    isPosOffline,
    togglePosOffline,
    offlineSyncQueue,
    syncOfflineQueue,
    completePosSale,
    shifts
  } = useFarmStore();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [customerName, setCustomerName] = useState("Walk-in Counter Guest");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("UPI");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showHeldBillsDrawer, setShowHeldBillsDrawer] = useState(false);
  const [weightModalItem, setWeightModalItem] = useState<{ product: Product; index?: number } | null>(null);
  const [customWeightInput, setCustomWeightInput] = useState("1.000");

  const currentShift = shifts.find(s => s.status === "Open") || shifts[0];

  const categories = ["All", "Vegetables", "Fruits", "Leafy Greens", "Cold-Pressed & Staples"];

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.hsnCode.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const subtotal = posCart.reduce((sum, item) => {
    const unitPrice = item.product.availableUnits.find(u => u.unit === item.unit)?.price || (item.product.pricePerKg * item.weightKg);
    return sum + (unitPrice * item.quantity);
  }, 0);

  const totalWeight = posCart.reduce((sum, item) => sum + item.weightKg, 0);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    // Simulate finding product by barcode or HSN
    const found = products.find(p => 
      p.id.includes(barcodeInput.toLowerCase()) || 
      p.name.toLowerCase().includes(barcodeInput.toLowerCase()) ||
      p.hsnCode.includes(barcodeInput)
    ) || products[0];

    addToPosCart(found, "kg", 1, 1.25);
    setBarcodeInput("");
  };

  const handleQuickWeightAdd = (product: Product) => {
    setWeightModalItem({ product });
    setCustomWeightInput("1.250");
  };

  const confirmWeightAdd = () => {
    if (!weightModalItem) return;
    const weight = parseFloat(customWeightInput) || 1.0;
    addToPosCart(weightModalItem.product, "kg", 1, weight);
    setWeightModalItem(null);
  };

  const handlePay = () => {
    if (posCart.length === 0) return;
    setIsPaymentModalOpen(true);
  };

  const finalizeSale = () => {
    const order = completePosSale(selectedPaymentMethod, "Riya (Counter 1)");
    setIsPaymentModalOpen(false);
    setCompletedOrder(order);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col select-none">
      {/* POS Top Operations Header (Reflecting Page 11 of PDF) */}
      <header className="bg-[#123B2A] text-white px-4 py-2.5 border-b border-[#2F6B45] flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/demo" className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10" title="Back to Demo Guide">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-sm tracking-wide">COUNTER 1 · Billing</span>
          </div>
          <span className="text-[#EAF2E7]/70 text-xs hidden sm:inline">|</span>
          <span className="text-xs text-[#D4AA52] font-semibold hidden sm:inline">
            Cashier: Riya
          </span>
        </div>

        {/* Offline Toggle & Sync Queue */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-[#1B4D36] px-3 py-1 rounded-full border border-[#2F6B45]">
            <button
              onClick={() => togglePosOffline(!isPosOffline)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold transition ${
                isPosOffline
                  ? "bg-amber-500 text-[#123B2A]"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {isPosOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isPosOffline ? "Offline Mode (Simulated)" : "Online Live"}</span>
            </button>

            {offlineSyncQueue.length > 0 && (
              <button
                onClick={syncOfflineQueue}
                className="flex items-center gap-1 bg-[#D4AA52] hover:bg-[#c49a42] text-[#123B2A] px-2 py-0.5 rounded font-bold transition text-[11px]"
                title="Sync offline bills to server"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Sync ({offlineSyncQueue.length})</span>
              </button>
            )}
          </div>

          {/* Shift summary pill */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#EAF2E7]/80 bg-black/20 px-3 py-1 rounded-full">
            <span>Shift Sales: <strong className="text-white">{formatINR(currentShift.totalSales)}</strong></span>
            <span>({currentShift.billsCount} bills)</span>
          </div>
        </div>
      </header>

      {/* POS Two-Column Workspace */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
        {/* Left Side: Product Catalogue & Quick-Touch Buttons */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-3">
          {/* Barcode scanner & text search */}
          <div className="bg-white p-3 rounded-2xl border border-[#E2E8E0] farm-card-shadow flex flex-col sm:flex-row gap-2.5 items-center">
            {/* Barcode input simulation */}
            <form onSubmit={handleBarcodeSubmit} className="flex-1 flex gap-2 w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Scan barcode or type produce name / code..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#2F6B45]"
                />
                <Barcode className="w-4 h-4 text-[#2F6B45] absolute left-3 top-2.5" />
              </div>
              <button
                type="submit"
                className="bg-[#123B2A] hover:bg-[#1B4D36] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0"
              >
                Simulate Scan
              </button>
            </form>

            {/* Quick search */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Filter catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#123B2A] text-white shadow-xs"
                    : "bg-white text-[#1E2B23] border border-[#E2E8E0] hover:bg-[#EAF2E7]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick-Touch Product Grid (Inspired by PDF page 11) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-190px)] pr-1">
            {filteredProducts.map((p) => {
              const inStock = p.currentStockKg > 0;
              return (
                <div
                  key={p.id}
                  onClick={() => inStock && addToPosCart(p, "kg", 1, 1.0)}
                  className={`bg-white rounded-2xl border border-[#E2E8E0] p-3 text-left transition relative flex flex-col justify-between farm-card-shadow cursor-pointer ${
                    inStock ? "hover:border-[#2F6B45] hover:scale-[1.01]" : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F8F6F0] shrink-0 border border-gray-100">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-[#123B2A] truncate leading-tight">
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-[#2F6B45] font-semibold mt-0.5">
                        {formatINR(p.pricePerKg)} / kg
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Stock: {p.currentStockKg} kg
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#F0F4EF] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickWeightAdd(p);
                      }}
                      className="text-[10px] bg-[#EAF2E7] text-[#123B2A] hover:bg-[#2F6B45] hover:text-white px-2 py-0.5 rounded font-semibold flex items-center gap-1 transition"
                      title="Weigh on digital scale"
                    >
                      <Scale className="w-3 h-3" />
                      <span>Weigh</span>
                    </button>

                    <button
                      type="button"
                      disabled={!inStock}
                      className="bg-[#2F6B45] hover:bg-[#123B2A] text-white p-1 rounded-lg text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Billing Cart, Customer Info & Instant Pay */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col bg-white rounded-3xl border border-[#E2E8E0] farm-card-shadow overflow-hidden max-h-[calc(100vh-80px)]">
          {/* Bill Top Bar */}
          <div className="bg-[#FAFAF8] px-4 py-3 border-b border-[#E2E8E0] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#2F6B45]">
                Current Counter Bill
              </span>
              <h3 className="font-mono font-bold text-xs text-gray-800">
                Bill P1/2627/000124
              </h3>
            </div>

            {/* Held Bills Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHeldBillsDrawer(!showHeldBillsDrawer)}
                className="relative text-xs text-[#123B2A] bg-[#EAF2E7] hover:bg-[#D4AA52] hover:text-[#123B2A] px-2.5 py-1 rounded-full font-bold transition flex items-center gap-1"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Held ({heldBills.length})</span>
              </button>

              <button
                type="button"
                onClick={() => holdCurrentPosBill(customerName)}
                disabled={posCart.length === 0}
                className="text-xs text-amber-800 hover:bg-amber-50 px-2 py-1 rounded font-semibold transition disabled:opacity-40"
                title="Hold current bill"
              >
                <PauseCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={clearPosCart}
                disabled={posCart.length === 0}
                className="text-xs text-rose-600 hover:bg-rose-50 px-2 py-1 rounded font-semibold transition disabled:opacity-40"
                title="Clear current bill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Customer input */}
          <div className="px-4 py-2 border-b border-[#F0F4EF] flex items-center gap-2 text-xs bg-white">
            <User className="w-3.5 h-3.5 text-[#2F6B45]" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Guest Customer Name / Phone"
              className="flex-1 text-xs focus:outline-none text-[#1E2B23] font-medium"
            />
          </div>

          {/* Held Bills Drawer Overlay */}
          {showHeldBillsDrawer && (
            <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-900">Held Customer Bills:</span>
                <button onClick={() => setShowHeldBillsDrawer(false)} className="text-gray-500 hover:text-gray-800">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {heldBills.length === 0 ? (
                <p className="text-gray-500 text-[11px]">No bills currently on hold.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {heldBills.map((b) => (
                    <div key={b.id} className="bg-white p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#123B2A]">{b.customerName}</span>
                        <span className="text-[10px] text-gray-500 block">
                          {b.items.length} items · {b.heldAt}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#123B2A]">{formatINR(b.total)}</span>
                        <button
                          onClick={() => {
                            resumeHeldPosBill(b.id);
                            setShowHeldBillsDrawer(false);
                          }}
                          className="bg-[#123B2A] text-white text-[10px] font-bold px-2 py-1 rounded"
                        >
                          Resume
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cart Items List (Scrollable) */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F0F4EF] p-2 min-h-[220px]">
            {posCart.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-xs">
                <Barcode className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No items added to counter bill.</p>
                <p className="text-[11px] mt-1 text-gray-400">Scan barcode or tap produce on the left.</p>
              </div>
            ) : (
              posCart.map((item, index) => {
                const unitPrice = item.product.availableUnits.find(u => u.unit === item.unit)?.price || (item.product.pricePerKg * item.weightKg);
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div key={`${item.product.id}-${index}`} className="p-2.5 flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#123B2A] truncate">{item.product.name}</span>
                        {item.product.gstRate === 0 ? (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-medium">Nil</span>
                        ) : (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-medium">{item.product.gstRate}%</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#64746A] mt-0.5">
                        <span>{formatINR(item.product.pricePerKg)} / kg</span>
                        <span>·</span>
                        <span className="font-medium text-[#2F6B45]">
                          {(item.weightKg).toFixed(3)} kg
                        </span>
                      </div>
                    </div>

                    {/* Weight & Qty Stepper */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => updatePosCartItem(index, item.quantity - 1, item.weightKg - (item.weightKg / item.quantity))}
                        className="w-6 h-6 rounded bg-[#F8F6F0] hover:bg-[#EAF2E7] text-gray-700 flex items-center justify-center font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-[#123B2A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updatePosCartItem(index, item.quantity + 1, item.weightKg + (item.weightKg / item.quantity))}
                        className="w-6 h-6 rounded bg-[#F8F6F0] hover:bg-[#EAF2E7] text-gray-700 flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total & Delete */}
                    <div className="text-right shrink-0 min-w-16">
                      <span className="font-extrabold text-[#123B2A] block">
                        {formatINR(lineTotal)}
                      </span>
                      <button
                        onClick={() => removeFromPosCart(index)}
                        className="text-gray-400 hover:text-rose-600 text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bill Calculation Bottom Area */}
          <div className="bg-[#F8F6F0] border-t border-[#E2E8E0] p-4 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Total Produce Weight</span>
                <span className="font-bold text-gray-800">{totalWeight.toFixed(3)} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Breakdown</span>
                <span className="text-emerald-700 font-semibold">Fresh Nil (0%) · Packaged (5%)</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#123B2A] pt-1.5 border-t border-gray-200">
                <span>Total Amount</span>
                <span>{formatINR(subtotal)}</span>
              </div>
            </div>

            {/* Payment Method Quick Selectors */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod("Cash")}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedPaymentMethod === "Cash"
                    ? "bg-[#123B2A] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-[#E2E8E0] hover:bg-[#EAF2E7]"
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod("UPI")}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedPaymentMethod === "UPI"
                    ? "bg-[#123B2A] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-[#E2E8E0] hover:bg-[#EAF2E7]"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod("Card")}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedPaymentMethod === "Card"
                    ? "bg-[#123B2A] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-[#E2E8E0] hover:bg-[#EAF2E7]"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>
            </div>

            {/* Big Action Pay Button (Matches PDF page 11) */}
            <button
              onClick={handlePay}
              disabled={posCart.length === 0}
              className="w-full py-4 bg-[#2F6B45] hover:bg-[#123B2A] disabled:bg-gray-300 text-white rounded-2xl font-extrabold text-sm uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>PAY {formatINR(subtotal)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Digital Weighing Scale Modal */}
      {weightModalItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full farm-card-shadow space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#2F6B45]" />
                <h3 className="font-bold text-sm text-[#123B2A]">Digital Scale Input</h3>
              </div>
              <button onClick={() => setWeightModalItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="font-bold text-xs text-gray-800">{weightModalItem.product.name}</p>
              <p className="text-[11px] text-[#2F6B45]">Base Rate: {formatINR(weightModalItem.product.pricePerKg)} / kg</p>
            </div>

            {/* Simulated scale weight digits */}
            <div className="bg-[#123B2A] p-4 rounded-2xl text-center">
              <span className="text-[10px] text-[#D4AA52] uppercase font-bold tracking-wider block">Scale Reading (kg)</span>
              <span className="font-mono text-3xl font-black text-white">{customWeightInput} kg</span>
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-4 gap-2">
              {["0.250", "0.500", "1.000", "1.500", "2.000", "2.500", "3.000", "5.000"].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setCustomWeightInput(w)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition border ${
                    customWeightInput === w
                      ? "bg-[#123B2A] text-white border-[#123B2A]"
                      : "bg-[#F8F6F0] text-gray-700 border-[#E2E8E0] hover:bg-[#EAF2E7]"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-600">Calculated:</span>
              <strong className="text-base text-[#123B2A]">
                {formatINR((parseFloat(customWeightInput) || 0) * weightModalItem.product.pricePerKg)}
              </strong>
            </div>

            <button
              onClick={confirmWeightAdd}
              className="w-full py-3 bg-[#123B2A] text-white rounded-xl font-bold text-xs hover:bg-[#1B4D36] transition"
            >
              Add Weighed Item to Bill
            </button>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full farm-card-shadow space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#123B2A]">Complete Counter Sale</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#EAF2E7] p-4 rounded-2xl text-center">
              <span className="text-xs text-[#2F6B45] font-semibold block">Total Payable</span>
              <span className="text-3xl font-black text-[#123B2A]">{formatINR(subtotal)}</span>
              <span className="text-[11px] text-gray-600 block mt-1">Payment via {selectedPaymentMethod}</span>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold text-gray-800">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-bold text-gray-800">{posCart.length} produce lines</span>
              </div>
              <div className="flex justify-between">
                <span>Total Produce Weight:</span>
                <span className="font-bold text-gray-800">{totalWeight.toFixed(3)} kg</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Simulated Transaction:</strong> Stock will be decremented using FIFO from oldest batches. Sale will post to Cashier Shift & GST Register.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={finalizeSale}
                className="flex-1 py-3 bg-[#123B2A] text-white rounded-xl text-xs font-bold hover:bg-[#1B4D36] transition shadow-md"
              >
                Confirm Sale & Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sale Success & Thermal Receipt Modal */}
      {completedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full farm-card-shadow space-y-4 my-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="font-extrabold text-lg text-[#123B2A]">Sale Completed!</h3>
              <p className="text-xs text-gray-500">Bill Number: {completedOrder.orderNumber}</p>
            </div>

            {/* Printable Thermal Receipt Mockup Area */}
            <div id="thermal-receipt-print-area" className="bg-[#FAF9F5] p-4 rounded-xl border border-dashed border-gray-300 font-mono text-[11px] text-gray-800 space-y-2">
              <div className="text-center pb-2 border-b border-dashed border-gray-400">
                <p className="font-bold text-xs uppercase">The Farm Story</p>
                <p className="text-[10px]">Shop 4, Heritage Arcade, Pune</p>
                <p className="text-[10px]">GSTIN: 27AABCT9921E1Z8</p>
                <p className="text-[10px]">Bill: {completedOrder.orderNumber}</p>
                <p className="text-[9px] text-gray-500">{new Date(completedOrder.createdAt).toLocaleString()}</p>
              </div>

              <div className="space-y-1 py-1">
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <span>{it.productName.slice(0, 18)}</span>
                      <span className="block text-[9px] text-gray-500">
                        {(it.weightKg).toFixed(3)} kg @ {formatINR(it.rate)}
                      </span>
                    </div>
                    <span className="font-bold">{formatINR(it.total)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-gray-400 space-y-1">
                <div className="flex justify-between font-bold text-xs">
                  <span>NET TOTAL:</span>
                  <span>{formatINR(completedOrder.total)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Paid via:</span>
                  <span>{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Cashier:</span>
                  <span>{completedOrder.cashierName || "Counter 1"}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[9px] text-gray-500">
                <p>Thank you for shopping farm-fresh!</p>
                <p>Naturally Grown · www.thefarmstory.in</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-2.5 bg-[#D4AA52] hover:bg-[#c49a42] text-[#123B2A] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => setCompletedOrder(null)}
                className="flex-1 py-2.5 bg-[#123B2A] hover:bg-[#1B4D36] text-white rounded-xl text-xs font-bold transition"
              >
                Next Customer Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

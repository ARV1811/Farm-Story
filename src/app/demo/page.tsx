"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useFarmStore } from "@/store/farmStore";
import { formatINR } from "@/lib/utils";
import { 
  Store, 
  Monitor, 
  Boxes, 
  ShoppingCart, 
  ShoppingBag, 
  Truck, 
  Users, 
  FileText, 
  BarChart3, 
  LayoutDashboard, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Barcode, 
  MessageSquare,
  HelpCircle
} from "lucide-react";

export default function ClientDemoPage() {
  const { 
    tomatoCrateStep, 
    runTomatoCrateStep, 
    resetAllDemoData, 
    products, 
    batches, 
    orders, 
    shifts 
  } = useFarmStore();

  const [activeTab, setActiveTab] = useState<"journey" | "modules" | "script">("journey");
  const [showResetNotice, setShowResetNotice] = useState(false);

  const tomatoProduct = products.find(p => p.id === "prod-tomato") || products[0];

  const crateSteps = [
    {
      step: 1,
      title: "1. Purchase Order",
      subtitle: "Order from Farm",
      actionDesc: "Issue PO for 100 kg Desi Tomatoes @ ₹22/kg to Krishna Organic Collective.",
      benefit: "Lock in supplier rate before mandi fluctuations.",
      statImpact: "PO #PO-2026-050 created (₹2,200)",
      targetUrl: "/admin/purchases"
    },
    {
      step: 2,
      title: "2. Dock Receiving",
      subtitle: "Batch & Cost Recorded",
      actionDesc: "Goods arrive at store dock. Record Batch B-261031-A with 5-day shelf life.",
      benefit: "Oldest stock sells first (FIFO). Live stock increases by 100 kg.",
      statImpact: "Stock jumps to " + (tomatoProduct.currentStockKg) + " kg",
      targetUrl: "/admin/inventory"
    },
    {
      step: 3,
      title: "3. Thermal Labeling",
      subtitle: "Price & Weight Stickers",
      actionDesc: "Generate 50mm x 35mm barcode stickers: 500g ₹30 / 1kg ₹60 with Best Before date.",
      benefit: "Eliminates counter weighing disputes and speeds up peak-hour queues.",
      statImpact: "Thermal labels printed with barcode",
      targetUrl: "/admin/inventory"
    },
    {
      step: 4,
      title: "4. Store POS Sale",
      subtitle: "Two Doors, One Stock",
      actionDesc: "Cashier scans barcode at Counter 1. 2 kg sold via UPI. Live stock decrements automatically.",
      benefit: "Zero double-entry. Website and Counter never sell the same kilo twice.",
      statImpact: "Cashier shift sales auto-update",
      targetUrl: "/pos"
    },
    {
      step: 5,
      title: "5. Online Pack & Deliver",
      subtitle: "Weighed at Packing",
      actionDesc: "Customer places online order. Staff weighs box on digital scale (4.15 kg) and assigns EV rider.",
      benefit: "Exact gram-accurate customer billing. Real-time rider dispatch.",
      statImpact: "Rider Vikram Jadhav assigned",
      targetUrl: "/admin/delivery"
    },
    {
      step: 6,
      title: "6. Books, GST & Profit",
      subtitle: "Nothing to Re-Enter",
      actionDesc: "Sales post to Sales Register. Nil-rated fresh produce split from taxed staples. CA export ready.",
      benefit: "Audit-ready books. 31% gross margin and 2.1% wastage calculated live.",
      statImpact: "GSTR-1 & P&L updated instantly",
      targetUrl: "/admin/accounts"
    }
  ];

  const moduleCards = [
    {
      id: 1,
      title: "Customer E-Commerce Website",
      category: "Public Storefront",
      href: "/",
      icon: Store,
      badge: "Live Omnichannel Stock",
      description: "Organic farm-fresh produce shopping, unit selection (500g, kg), slot delivery selector, and COD/UPI checkout.",
      solves: "Solves: messy WhatsApp orders and mismatched website availability."
    },
    {
      id: 2,
      title: "Store POS Billing Counter",
      category: "Counter Operations",
      href: "/pos",
      icon: Monitor,
      badge: "Offline-Ready Simulation",
      description: "Touch counter interface, digital scale weighing, barcode scanning, hold/resume bills, and 80mm thermal receipt printing.",
      solves: "Solves: peak-hour counter congestion and internet dropouts."
    },
    {
      id: 3,
      title: "Executive Dashboard",
      category: "Owner & Management",
      href: "/admin",
      icon: LayoutDashboard,
      badge: "Real-time Metrics",
      description: "Today's sales (₹48,250), 312 bills, 2.1% wastage, 31% margin, 7-day sales trend, and channel breakdown (Store 68% vs Online 32%).",
      solves: "Solves: lack of daily business visibility and delayed month-end numbers."
    },
    {
      id: 4,
      title: "Inventory, Batches & Expiry",
      category: "Stock Management",
      href: "/admin/inventory",
      icon: Boxes,
      badge: "FIFO Automated",
      description: "Batch tracking with expiry dates, low-stock alerts, wastage logging with reasons, and thermal barcode stickers.",
      solves: "Solves: unseen produce spoilage and margin bleed."
    },
    {
      id: 5,
      title: "Procurement & Dock Receiving",
      category: "Purchasing",
      href: "/admin/purchases",
      icon: ShoppingCart,
      badge: "Farm Gate Pricing",
      description: "Supplier rate comparison, purchase order tracking, and dock goods receiving that auto-creates inventory batches.",
      solves: "Solves: fluctuating mandi rates and untracked supplier payables."
    },
    {
      id: 6,
      title: "Omnichannel Orders",
      category: "Fulfillment",
      href: "/admin/orders",
      icon: ShoppingBag,
      badge: "Unified Queue",
      description: "Single command center for in-store POS bills and online home deliveries with detailed item weights and GST split.",
      solves: "Solves: disjointed records between store counter and website."
    },
    {
      id: 7,
      title: "Delivery & Packing Desk",
      category: "Logistics",
      href: "/admin/delivery",
      icon: Truck,
      badge: "Weigh-at-Packing Desk",
      description: "Digital scale weighing at packing, EV eco-rider assignment, delivery slot zoning, and daily COD cash settlement.",
      solves: "Solves: loose produce weight discrepancies and delayed rider tracking."
    },
    {
      id: 8,
      title: "Customers & Loyalty",
      category: "Retention",
      href: "/admin/customers",
      icon: Users,
      badge: "Silver & Gold Tiers",
      description: "Unified profile across store and website, purchase history, loyalty point redemption (1 pt / ₹100), and WhatsApp restock reminders.",
      solves: "Solves: lost customers and unremembered customer preferences."
    },
    {
      id: 9,
      title: "Accounts & GST Compliance",
      category: "Finance & CA",
      href: "/admin/accounts",
      icon: FileText,
      badge: "Indian Retail Ready",
      description: "Nil-rated fresh produce vs taxable packaged goods split, gap-free invoice numbers, GSTR-1 & 3B summary CA export simulation.",
      solves: "Solves: panic during GST filing and CA manual tally reconciliation."
    },
    {
      id: 10,
      title: "Business Analytics & Margins",
      category: "Strategy",
      href: "/admin/reports",
      icon: BarChart3,
      badge: "Profit Optimization",
      description: "Top revenue items, spoilage breakdown by reason, supplier reliability benchmarks, and scheduled weekly PDF reports.",
      solves: "Solves: uninformed purchasing and margin leakages."
    }
  ];

  const handleExecuteCrateStep = (stepNumber: number) => {
    runTomatoCrateStep(stepNumber);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleResetData = () => {
    resetAllDemoData();
    setShowResetNotice(true);
    setTimeout(() => setShowResetNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col">
      {/* Top Client Presentation Banner */}
      <section className="bg-[#123B2A] text-white py-12 px-4 border-b border-[#2F6B45]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 bg-[#2F6B45]/80 border border-[#D4AA52]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#EAF2E7]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AA52]" />
              <span>Client Presentation Mode · Confidential</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetData}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D4AA52]" />
                <span>Reset Demo to Clean State</span>
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            The Farm Story <span className="text-[#D4AA52]">Interactive Demo</span>
          </h1>

          <p className="text-sm sm:text-base text-[#EAF2E7]/85 max-w-3xl leading-relaxed">
            &ldquo;From farm to table, on one system.&rdquo; How The Farm Story can run purchasing, stock, the store counter, e-commerce, delivery, customers, and GST accounts together, simply.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="pt-4 flex items-center gap-2 border-t border-[#2F6B45]/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab("journey")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === "journey"
                  ? "bg-[#D4AA52] text-[#123B2A] shadow-md"
                  : "bg-[#1B4D36] text-white/80 hover:text-white"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Interactive Story: Follow One Crate of Tomatoes</span>
            </button>

            <button
              onClick={() => setActiveTab("modules")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === "modules"
                  ? "bg-[#D4AA52] text-[#123B2A] shadow-md"
                  : "bg-[#1B4D36] text-white/80 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Explore All 10 Modules</span>
            </button>

            <button
              onClick={() => setActiveTab("script")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === "script"
                  ? "bg-[#D4AA52] text-[#123B2A] shadow-md"
                  : "bg-[#1B4D36] text-white/80 hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Presenter Meeting Talking Points</span>
            </button>
          </div>
        </div>
      </section>

      {/* Reset toast */}
      {showResetNotice && (
        <div className="bg-emerald-600 text-white text-xs font-bold text-center py-2 px-4 shadow-md">
          ✓ All demo data restored to original initial presentation state!
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Tab 1: Interactive Tomato Crate Journey (Page 9 of PDF) */}
        {activeTab === "journey" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 farm-card-shadow space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0F4EF]">
                <div>
                  <span className="text-xs font-bold text-[#2F6B45] uppercase tracking-wider block">
                    Recommended Client Walkthrough (Page 9 of PDF)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#123B2A] mt-0.5">
                    Follow One Crate of Tomatoes
                  </h2>
                  <p className="text-xs text-[#64746A] mt-1">
                    Each step is entered once. Everything else updates itself across inventory, POS, delivery, and GST accounts.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Current Live Step:</span>
                  <span className="w-7 h-7 rounded-full bg-[#123B2A] text-white font-black text-xs flex items-center justify-center">
                    {tomatoCrateStep}
                  </span>
                </div>
              </div>

              {/* Step cards timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crateSteps.map((stepItem) => {
                  const isCurrent = tomatoCrateStep === stepItem.step;
                  const isCompleted = tomatoCrateStep > stepItem.step;

                  return (
                    <div
                      key={stepItem.step}
                      className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                        isCurrent
                          ? "bg-[#EAF2E7] border-[#2F6B45] ring-2 ring-[#2F6B45]/50 shadow-md"
                          : isCompleted
                          ? "bg-white border-[#E2E8E0] opacity-90"
                          : "bg-white border-[#E2E8E0]"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            isCurrent
                              ? "bg-[#123B2A] text-white"
                              : isCompleted
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            Step {stepItem.step}
                          </span>
                          <span className="text-[10px] text-[#64746A] font-semibold">{stepItem.subtitle}</span>
                        </div>

                        <h3 className="font-bold text-sm text-[#123B2A]">{stepItem.title}</h3>
                        <p className="text-xs text-gray-700 leading-relaxed">{stepItem.actionDesc}</p>
                        
                        <div className="p-2.5 bg-white/70 rounded-xl border border-gray-100 text-[11px] text-[#2F6B45]">
                          <strong>Key Value:</strong> {stepItem.benefit}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleExecuteCrateStep(stepItem.step)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                            isCurrent
                              ? "bg-[#123B2A] text-[#D4AA52] hover:bg-[#1B4D36] shadow-sm"
                              : "bg-[#F8F6F0] hover:bg-[#EAF2E7] text-[#123B2A]"
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Simulate Step {stepItem.step}</span>
                        </button>

                        <Link
                          href={stepItem.targetUrl}
                          className="text-[11px] font-bold text-[#2F6B45] hover:underline flex items-center gap-0.5"
                        >
                          <span>Open View</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Result Highlight Banner */}
              <div className="bg-[#123B2A] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4AA52]" />
                    <span className="font-bold text-xs uppercase tracking-wide text-[#D4AA52]">
                      And without re-typing, these updated automatically:
                    </span>
                  </div>
                  <p className="text-xs text-[#EAF2E7]/80">
                    Stock Levels · Customer CRM · Accounts & GST Registers · Owner Dashboard Analytics
                  </p>
                </div>

                <button
                  onClick={handleResetData}
                  className="bg-[#D4AA52] hover:bg-[#c49a42] text-[#123B2A] px-4 py-2 rounded-xl text-xs font-bold transition shrink-0"
                >
                  Restart Story
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: All 10 Module Cards */}
        {activeTab === "modules" && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-4">
              <h2 className="text-2xl font-black text-[#123B2A]">
                The Nine Modules + Dedicated POS Counter
              </h2>
              <p className="text-xs sm:text-sm text-[#64746A] mt-1">
                Click any module card below to jump directly into the live working interface.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {moduleCards.map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.id}
                    href={m.href}
                    className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow farm-card-hover flex flex-col justify-between group transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-[#EAF2E7] text-[#2F6B45] flex items-center justify-center font-bold group-hover:bg-[#123B2A] group-hover:text-[#D4AA52] transition">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold bg-[#F8F6F0] text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
                          {m.badge}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F6B45]">
                          {m.category}
                        </span>
                        <h3 className="font-extrabold text-base text-[#123B2A] group-hover:text-[#2F6B45] transition mt-0.5">
                          {m.title}
                        </h3>
                        <p className="text-xs text-[#64746A] leading-relaxed mt-1">
                          {m.description}
                        </p>
                      </div>

                      <div className="p-2.5 bg-[#FAF9F5] rounded-xl border border-[#F0F4EF] text-[11px] text-gray-700 italic">
                        {m.solves}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F0F4EF] flex items-center justify-between text-xs font-bold text-[#123B2A] group-hover:text-[#2F6B45]">
                      <span>Launch Interface</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Presenter Meeting Talking Points */}
        {activeTab === "script" && (
          <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 farm-card-shadow space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-[#2F6B45] uppercase tracking-wider">
                Meeting Facilitator Guide
              </span>
              <h2 className="text-xl font-bold text-[#123B2A] mt-1">
                Suggested 60-Minute Presentation Flow
              </h2>
              <p className="text-xs text-gray-500">
                Extracted directly from pages 2, 4, 18, and 19 of the Client Presentation deck.
              </p>
            </div>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="p-4 bg-[#F8F6F0] rounded-2xl border border-[#E2E8E0] space-y-1.5">
                <strong className="text-sm font-bold text-[#123B2A] block">1. Set the Tone (Pages 2-3)</strong>
                <p>
                  &ldquo;Today is a conversation, not a slide deck. We will show what is possible with one connected system for The Farm Story, and listen to what hurts you most today.&rdquo;
                </p>
              </div>

              <div className="p-4 bg-[#F8F6F0] rounded-2xl border border-[#E2E8E0] space-y-1.5">
                <strong className="text-sm font-bold text-[#123B2A] block">2. Address the 4 Perishable Produce Realities (Page 5)</strong>
                <p>
                  Explain how The Farm Story cannot run on generic e-commerce templates because:
                  (1) Produce perishes, (2) Mandi prices move daily, (3) It is sold by exact weight, and (4) Store and website must never sell the same kilo twice.
                </p>
              </div>

              <div className="p-4 bg-[#F8F6F0] rounded-2xl border border-[#E2E8E0] space-y-1.5">
                <strong className="text-sm font-bold text-[#123B2A] block">3. Demonstrate the Tomato Crate Journey (Page 9)</strong>
                <p>
                  Open the &ldquo;Interactive Story&rdquo; tab and walk through the 6 steps. Emphasize that no number is re-entered manually from dock to delivery to CA books.
                </p>
              </div>

              <div className="p-4 bg-[#F8F6F0] rounded-2xl border border-[#E2E8E0] space-y-1.5">
                <strong className="text-sm font-bold text-[#123B2A] block">4. Highlight Phased Delivery (Page 19)</strong>
                <p>
                  &ldquo;Your store starts benefiting at week 10, not week 18. Go-live 1: In-Store billing & stock. Go-live 2: Website & Delivery. Go-live 3: Complete accounts & analytics.&rdquo;
                </p>
              </div>

              <div className="p-4 bg-[#EAF2E7] rounded-2xl border border-[#D2E2CE] space-y-1.5 text-[#1B4D36]">
                <strong className="text-sm font-bold text-[#123B2A] block">5. Final Closing Ask (Page 29 & 31)</strong>
                <p>
                  Ask the client: &ldquo;Which two modules would you want to see running first at the counter?&rdquo; and agree to schedule the 2-hour discovery workshop at the store.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#123B2A] text-white py-6 border-t border-[#1B4D36] text-xs text-center text-[#EAF2E7]/70">
        <p>The Farm Story Retail Management System · Frontend Client Demonstration Platform</p>
        <p className="text-[11px] text-[#D4AA52] mt-1">Prepared for Client Meeting Approval · All Data Simulated</p>
      </footer>
    </div>
  );
}

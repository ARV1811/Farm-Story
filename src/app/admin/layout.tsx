"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFarmStore } from "@/store/farmStore";
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  Truck, 
  ShoppingBag, 
  Users, 
  FileText, 
  BarChart3, 
  ShoppingCart, 
  Store, 
  Monitor, 
  Menu, 
  X, 
  Leaf, 
  Bell, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeRole } = useFarmStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Inventory & Batches", href: "/admin/inventory", icon: Boxes },
    { label: "Purchases & Suppliers", href: "/admin/purchases", icon: ShoppingCart },
    { label: "Orders & Fulfillment", href: "/admin/orders", icon: ShoppingBag },
    { label: "Delivery Operations", href: "/admin/delivery", icon: Truck },
    { label: "Customers & Loyalty", href: "/admin/customers", icon: Users },
    { label: "Accounts & GST", href: "/admin/accounts", icon: FileText },
    { label: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden bg-[#123B2A] text-white px-4 py-3 flex items-center justify-between border-b border-[#2F6B45]">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-[#D4AA52]" />
          <span className="font-bold text-sm">Farm Story Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded text-white hover:bg-white/10"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-8 z-30 h-[calc(100vh-32px)] w-64 bg-[#123B2A] text-white flex flex-col justify-between border-r border-[#2F6B45]/40 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Brand header */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-[#D4AA52] flex items-center justify-center text-[#123B2A] font-bold">
              <Leaf className="w-4 h-4 fill-[#123B2A]" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white tracking-tight leading-tight">The Farm Story</h2>
              <span className="text-[10px] text-[#D4AA52] font-semibold uppercase tracking-wider block">
                {activeRole} Mode
              </span>
            </div>
          </div>

          {/* Module Nav Links */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                    isActive
                      ? "bg-[#D4AA52] text-[#123B2A] font-bold shadow-sm"
                      : "text-[#EAF2E7]/80 hover:bg-[#1B4D36] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Quick Links */}
        <div className="p-3 border-t border-[#2F6B45]/50 bg-[#0E2F21] space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-[#EAF2E7]/70 px-1">
            <span>Fast Switch:</span>
            <Link href="/demo" className="text-[#D4AA52] hover:underline font-bold">
              Demo Script
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/pos"
              className="bg-[#1B4D36] hover:bg-[#2F6B45] text-white p-2 rounded-lg text-center font-semibold text-[11px] transition flex items-center justify-center gap-1"
            >
              <Monitor className="w-3 h-3 text-[#D4AA52]" />
              <span>POS Billing</span>
            </Link>
            <Link
              href="/"
              className="bg-[#1B4D36] hover:bg-[#2F6B45] text-white p-2 rounded-lg text-center font-semibold text-[11px] transition flex items-center justify-center gap-1"
            >
              <Store className="w-3 h-3 text-[#D4AA52]" />
              <span>Storefront</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Admin Breadcrumb and Context Header */}
        <div className="bg-white border-b border-[#E2E8E0] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#64746A]">
            <Link href="/admin" className="hover:text-[#123B2A]">Admin</Link>
            <span>/</span>
            <span className="font-semibold text-[#123B2A] capitalize">
              {pathname.split("/")[2] || "Dashboard Overview"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-800 bg-[#EAF2E7] px-2.5 py-1 rounded-full font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-time Live Sync Active</span>
            </span>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

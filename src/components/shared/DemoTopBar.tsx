"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFarmStore } from "@/store/farmStore";
import { UserRole } from "@/types";
import { 
  Store, 
  Monitor, 
  LayoutDashboard, 
  Presentation, 
  RotateCcw, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  X
} from "lucide-react";

export const DemoTopBar: React.FC = () => {
  const pathname = usePathname();
  const { 
    activeRole, 
    setRole, 
    resetAllDemoData, 
    notifications, 
    dismissNotification 
  } = useFarmStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const roles: UserRole[] = [
    "Owner",
    "Manager",
    "Cashier",
    "Inventory Executive",
    "Packing and Delivery",
    "Accountant / CA"
  ];

  const handleReset = () => {
    resetAllDemoData();
    setShowResetConfirm(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#123B2A] text-white border-b border-[#2F6B45]/40 text-xs shadow-md">
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Brand Pill & Live Demo Indicator */}
        <div className="flex items-center gap-2">
          <Link href="/demo" className="flex items-center gap-1.5 font-bold tracking-wide text-white hover:text-[#D4AA52] transition">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AA52] animate-soft-pulse" />
            <span className="text-sm font-semibold tracking-tight">THE FARM STORY</span>
            <span className="bg-[#2F6B45]/80 text-[#EAF2E7] px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider hidden sm:inline">
              Interactive Demo
            </span>
          </Link>
        </div>

        {/* Navigation Quick Switcher */}
        <nav aria-label="Demo Views" className="flex items-center bg-[#1B4D36]/70 rounded-full p-0.5 border border-[#2F6B45]/60">
          <Link
            href="/"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition font-medium ${
              pathname === "/" || pathname.startsWith("/shop") || pathname.startsWith("/product") || pathname.startsWith("/cart") || pathname.startsWith("/checkout") || pathname.startsWith("/account")
                ? "bg-[#D4AA52] text-[#123B2A] font-semibold shadow-sm"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>

          <Link
            href="/pos"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition font-medium ${
              pathname.startsWith("/pos")
                ? "bg-[#D4AA52] text-[#123B2A] font-semibold shadow-sm"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>POS Billing</span>
          </Link>

          <Link
            href="/admin"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition font-medium ${
              pathname.startsWith("/admin")
                ? "bg-[#D4AA52] text-[#123B2A] font-semibold shadow-sm"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          <Link
            href="/demo"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition font-medium ${
              pathname === "/demo"
                ? "bg-[#D4AA52] text-[#123B2A] font-semibold shadow-sm"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Presentation</span>
          </Link>
        </nav>

        {/* Role Switcher & Utilities */}
        <div className="flex items-center gap-2">
          {/* Active Role Selector */}
          <div className="flex items-center gap-1 bg-[#1B4D36]/80 px-2 py-1 rounded border border-[#2F6B45]/50">
            <UserCheck className="w-3.5 h-3.5 text-[#D4AA52]" />
            <span className="text-white/70 hidden md:inline text-[11px]">Role:</span>
            <select
              value={activeRole}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer pr-1"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="bg-[#123B2A] text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 rounded-full hover:bg-white/10 transition text-white/90"
              title="System Activity & Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D4AA52] ring-2 ring-[#123B2A]" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 text-gray-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
                    <Bell className="w-3.5 h-3.5 text-[#123B2A]" />
                    <span>Real-time Operations Log</span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                  {notifications.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No recent activity.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-lg border flex items-start gap-2 ${
                          n.type === "success"
                            ? "bg-emerald-50/70 border-emerald-200"
                            : n.type === "warning"
                            ? "bg-amber-50/70 border-amber-200"
                            : "bg-blue-50/70 border-blue-200"
                        }`}
                      >
                        {n.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900 text-[11px]">{n.title}</span>
                            <span className="text-[10px] text-gray-400">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-0.5">{n.message}</p>
                        </div>
                        <button
                          onClick={() => dismissNotification(n.id)}
                          className="text-gray-400 hover:text-gray-600 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <div className="relative">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-white transition text-xs font-medium"
              title="Reset all demo data to initial state"
            >
              <RotateCcw className="w-3 h-3 text-[#D4AA52]" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Reset confirmation modal */}
            {showResetConfirm && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 text-gray-800 p-3 z-50">
                <p className="text-xs font-semibold text-gray-900">Reset All Demo Data?</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  This will restore stock levels, batches, orders, and shifts back to original presentation samples.
                </p>
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-2.5 py-1 text-xs bg-[#123B2A] text-white rounded font-medium hover:bg-[#1B4D36]"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

import React from "react";
import Link from "next/link";
import { Leaf, ShieldCheck, Truck, RefreshCw, PhoneCall, Mail } from "lucide-react";

export const StoreFooter: React.FC = () => {
  return (
    <footer className="bg-[#123B2A] text-white border-t border-[#1B4D36] mt-auto">
      {/* Organic Value Proposition Strip */}
      <div className="border-b border-[#2F6B45]/40 py-8 bg-[#1B4D36]/40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#2F6B45]/40 flex items-center justify-center text-[#D4AA52] shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#EAF2E7]">100% Naturally Grown</h4>
              <p className="text-xs text-[#EAF2E7]/70 mt-0.5">Pesticide & chemical free from certified organic partner farms.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#2F6B45]/40 flex items-center justify-center text-[#D4AA52] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#EAF2E7]">Two Doors, One Stock</h4>
              <p className="text-xs text-[#EAF2E7]/70 mt-0.5">Physical store & online website sell from identical fresh live inventory.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#2F6B45]/40 flex items-center justify-center text-[#D4AA52] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#EAF2E7]">EV Slot Delivery</h4>
              <p className="text-xs text-[#EAF2E7]/70 mt-0.5">Weighed at packing so you only pay for the exact grams dispatched.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#2F6B45]/40 flex items-center justify-center text-[#D4AA52] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#EAF2E7]">Freshness Guarantee</h4>
              <p className="text-xs text-[#EAF2E7]/70 mt-0.5">Unhappy with any produce item? Instant replacement or credit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-[#EAF2E7]/80">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AA52] flex items-center justify-center text-[#123B2A] font-bold">
              <Leaf className="w-4 h-4 fill-[#123B2A]" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">The Farm Story</span>
          </div>
          <p className="text-xs leading-relaxed text-[#EAF2E7]/70">
            Founded in 2019. We connect honest farmers from Sangli, Junnar, and the Western Ghats directly with health-conscious families in Pune.
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs">
            <span className="bg-[#2F6B45] text-white px-2.5 py-1 rounded text-[11px] font-medium">
              FSSAI Lic. 11526038000192
            </span>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white text-sm mb-3">Produce Categories</h5>
          <ul className="space-y-2">
            <li><Link href="/shop?cat=Vegetables" className="hover:text-[#D4AA52] transition">Fresh Vegetables & Tubers</Link></li>
            <li><Link href="/shop?cat=Fruits" className="hover:text-[#D4AA52] transition">Naturally Ripened Fruits</Link></li>
            <li><Link href="/shop?cat=Leafy%20Greens" className="hover:text-[#D4AA52] transition">Dawn-Harvested Leafy Greens</Link></li>
            <li><Link href="/shop?cat=Cold-Pressed%20%26%20Staples" className="hover:text-[#D4AA52] transition">Wood-Pressed Oils & Forest Honey</Link></li>
            <li><Link href="/shop?cat=Organic%20Specials" className="hover:text-[#D4AA52] transition">Seasonal Harvest Specials</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white text-sm mb-3">Delivery Zones & Store</h5>
          <p className="mb-2 leading-relaxed">
            <strong className="text-white">Flagship Store:</strong><br />
            Shop 4, Heritage Arcade, Off Model Colony Road, Shivajinagar, Pune 411016
          </p>
          <p className="leading-relaxed">
            <strong className="text-white">Current Delivery Pincodes:</strong><br />
            411016 (Model Colony), 411007 (Aundh), 411006 (Kalyani Nagar), 411001 (Camp)
          </p>
        </div>

        <div>
          <h5 className="font-semibold text-white text-sm mb-3">Contact & Support</h5>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#D4AA52]" />
              <span>+91 98220 12345 (Store Counter)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D4AA52]" />
              <span>orders@thefarmstory.in</span>
            </div>
            <p className="pt-2 text-[11px] text-[#EAF2E7]/60">
              Counter Hours: 7:00 AM – 9:30 PM (All 7 Days)
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1B4D36] py-4 bg-[#0E2F21] text-xs text-[#EAF2E7]/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 The Farm Story Retail Pvt Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>GST Registered (Maharashtra)</span>
            <span>·</span>
            <span>Indian Retail Compliant</span>
            <span>·</span>
            <Link href="/demo" className="text-[#D4AA52] hover:underline font-medium">
              Open Client Presentation Mode
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

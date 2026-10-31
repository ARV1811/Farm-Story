"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFarmStore } from "@/store/farmStore";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { formatINR } from "@/lib/utils";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck, 
  ArrowLeft 
} from "lucide-react";

export default function CartPage() {
  const { 
    customerCart, 
    updateCustomerCartQty, 
    removeFromCustomerCart, 
    clearCustomerCart 
  } = useFarmStore();

  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = customerCart.reduce((sum, item) => {
    const unitPrice = item.product.availableUnits.find(u => u.unit === item.unit)?.price || (item.product.pricePerKg * item.weightKg);
    return sum + (unitPrice * item.quantity);
  }, 0);

  const freeDeliveryThreshold = 500;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 40;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const discount = discountApplied ? 50 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "FARM50" || promoCode.trim().toUpperCase() === "FARMSTORY") {
      setDiscountApplied(true);
    } else {
      alert("Invalid promo code. Try 'FARM50' for ₹50 off!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0]">
      <StoreHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Breadcrumb / Return */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F6B45] hover:text-[#123B2A] mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mb-6">
          Your Farm Basket
        </h1>

        {customerCart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E2E8E0] p-12 text-center farm-card-shadow max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-[#EAF2E7] text-[#2F6B45] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#123B2A]">Your basket is currently empty</h2>
            <p className="text-xs text-[#64746A] mt-1 mb-6">
              Pick fresh morning produce harvested directly from our partner farms.
            </p>
            <Link
              href="/shop"
              className="bg-[#123B2A] text-white hover:bg-[#1B4D36] px-6 py-2.5 rounded-full text-xs font-bold transition inline-flex items-center gap-2"
            >
              <span>Explore Farm Produce</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free delivery progress strip */}
              <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] text-xs">
                {isFreeDelivery ? (
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>You&apos;ve unlocked FREE doorstep slot delivery!</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between font-medium text-gray-700 mb-1.5">
                      <span>Add {formatINR(amountNeededForFreeDelivery)} more for FREE Delivery</span>
                      <span className="font-bold text-[#2F6B45]">{Math.round((subtotal / freeDeliveryThreshold) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2F6B45] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-[#E2E8E0] divide-y divide-[#F0F4EF] farm-card-shadow overflow-hidden">
                {customerCart.map((item, index) => {
                  const unitPrice = item.product.availableUnits.find(u => u.unit === item.unit)?.price || (item.product.pricePerKg * item.weightKg);
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div key={`${item.product.id}-${item.unit}`} className="p-4 sm:p-5 flex items-center gap-4">
                      {/* Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F8F6F0] shrink-0 border border-[#E2E8E0]">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.slug}`} className="font-bold text-sm text-[#123B2A] hover:text-[#2F6B45] truncate block">
                          {item.product.name}
                        </Link>
                        <p className="text-[11px] text-[#64746A] mt-0.5">
                          Unit: {item.unit} · {formatINR(unitPrice)} each
                        </p>
                        <p className="text-[10px] text-[#2F6B45]">
                          Approx. Weight: {(item.weightKg).toFixed(2)} kg
                        </p>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center border border-[#E2E8E0] rounded-lg overflow-hidden bg-[#F8F6F0] shrink-0">
                        <button
                          onClick={() => updateCustomerCartQty(index, item.quantity - 1)}
                          className="px-2.5 py-1 text-gray-700 hover:bg-[#EAF2E7]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 font-bold text-xs text-[#123B2A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCustomerCartQty(index, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-700 hover:bg-[#EAF2E7]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right shrink-0 min-w-20">
                        <span className="font-extrabold text-sm text-[#123B2A] block">
                          {formatINR(lineTotal)}
                        </span>
                        <button
                          onClick={() => removeFromCustomerCart(index)}
                          className="text-gray-400 hover:text-rose-600 transition text-[11px] inline-flex items-center gap-0.5 mt-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear button */}
              <div className="flex justify-end">
                <button
                  onClick={clearCustomerCart}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold transition"
                >
                  Clear entire basket
                </button>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-5">
                <h2 className="font-extrabold text-base text-[#123B2A] pb-3 border-b border-[#F0F4EF]">
                  Order Summary
                </h2>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#64746A]">
                    <span>Produce Subtotal</span>
                    <span className="font-bold text-[#1E2B23]">{formatINR(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-[#64746A]">
                    <span>Slot Delivery (EV Eco-Van)</span>
                    <span className="font-bold text-[#1E2B23]">
                      {isFreeDelivery ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(deliveryFee)}
                    </span>
                  </div>

                  {discountApplied && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Promo Discount (FARM50)</span>
                      <span>-{formatINR(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#64746A]">
                    <span>Estimated GST (Nil on fresh vegetables)</span>
                    <span className="font-medium text-emerald-800">Included (0% / 5%)</span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="pt-3 border-t border-[#F0F4EF]">
                  <label className="block text-[11px] font-semibold text-[#64746A] mb-1.5">
                    Have a Promo Code? (Use: <span className="text-[#2F6B45] font-bold">FARM50</span>)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-1.5 text-xs focus:outline-none uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-[#2F6B45] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#123B2A] transition"
                    >
                      Apply
                    </button>
                  </div>
                </form>

                {/* Total */}
                <div className="pt-3 border-t border-[#F0F4EF] flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-[#64746A] block">Grand Total</span>
                    <span className="text-2xl font-black text-[#123B2A]">{formatINR(grandTotal)}</span>
                  </div>
                  <span className="text-[10px] text-[#2F6B45] font-semibold bg-[#EAF2E7] px-2 py-1 rounded">
                    + {Math.floor(grandTotal / 100)} Loyalty Points
                  </span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-[#123B2A] hover:bg-[#1B4D36] text-white rounded-full font-bold text-xs text-center transition flex items-center justify-center gap-2 shadow-lg block"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-[10px] text-gray-500 justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exact billing: weighed at packing desk before dispatch</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}

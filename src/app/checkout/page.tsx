"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useFarmStore } from "@/store/farmStore";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { formatINR } from "@/lib/utils";
import { PaymentMethod } from "@/types";
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Store, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { customerCart, placeCustomerOrder } = useFarmStore();

  const [customerName, setCustomerName] = useState("Mrs. Sunita Rao");
  const [customerPhone, setCustomerPhone] = useState("+91 98201 54321");
  const [customerEmail, setCustomerEmail] = useState("sunita.rao@outlook.com");
  const [streetAddress, setStreetAddress] = useState("B-601, Windsor Parkland, Off ITI Road");
  const [area, setArea] = useState("Aundh");
  const [pincode, setPincode] = useState("411007");
  const [deliverySlot, setDeliverySlot] = useState("Today: 4:00 PM - 7:00 PM");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash on Delivery");
  const [upiRef, setUpiRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);

  const subtotal = customerCart.reduce((sum, item) => {
    const unitPrice = item.product.availableUnits.find(u => u.unit === item.unit)?.price || (item.product.pricePerKg * item.weightKg);
    return sum + (unitPrice * item.quantity);
  }, 0);

  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const grandTotal = subtotal + deliveryFee;

  const handlePreFill = (profile: "sunita" | "arvind") => {
    if (profile === "sunita") {
      setCustomerName("Mrs. Sunita Rao");
      setCustomerPhone("+91 98201 54321");
      setCustomerEmail("sunita.rao@outlook.com");
      setStreetAddress("B-601, Windsor Parkland, Off ITI Road");
      setArea("Aundh");
      setPincode("411007");
    } else {
      setCustomerName("Dr. Arvind Joshi");
      setCustomerPhone("+91 98450 11223");
      setCustomerEmail("arvind.joshi@clinic.org");
      setStreetAddress("Flat 402, Green Meadows, Model Colony");
      setArea("Model Colony / Shivajinagar");
      setPincode("411016");
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerCart.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeCustomerOrder({
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress: {
          street: streetAddress,
          area,
          pincode,
          city: "Pune"
        },
        deliverySlot,
        paymentMethod
      });

      setPlacedOrderNumber(order.orderNumber);
      setIsSubmitting(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  if (placedOrderNumber) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F6F0]">
        <StoreHeader />
        <main className="max-w-2xl mx-auto px-4 py-16 flex-1 w-full text-center">
          <div className="bg-white rounded-3xl border border-[#E2E8E0] p-8 sm:p-12 farm-card-shadow">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold text-[#2F6B45] uppercase tracking-wider">
              Order Confirmed & Live
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#123B2A] mt-1 mb-2">
              Thank You, {customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-[#64746A] mb-6">
              Your order <strong className="text-[#123B2A] font-bold">#{placedOrderNumber}</strong> has been logged into the central fulfillment queue.
            </p>

            <div className="bg-[#F8F6F0] p-4 rounded-2xl border border-[#E2E8E0] text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-[#64746A]">Delivery Slot:</span>
                <span className="font-bold text-[#123B2A]">{deliverySlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64746A]">Payment Mode:</span>
                <span className="font-bold text-[#123B2A]">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64746A]">Total Bill:</span>
                <span className="font-black text-sm text-[#123B2A]">{formatINR(grandTotal)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E2E8E0]">
                <span className="text-[#2F6B45] font-semibold">Live System Update:</span>
                <span className="text-emerald-700 font-medium">Stock decremented & visible in Admin</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/account"
                className="w-full sm:w-auto px-6 py-3 bg-[#123B2A] hover:bg-[#1B4D36] text-white rounded-full font-bold text-xs transition"
              >
                Track in Customer Account
              </Link>
              <Link
                href="/admin/delivery"
                className="w-full sm:w-auto px-6 py-3 bg-[#D4AA52] hover:bg-[#c49a42] text-[#123B2A] rounded-full font-bold text-xs transition"
              >
                View in Admin Packing Desk
              </Link>
            </div>
          </div>
        </main>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0]">
      <StoreHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F6B45] hover:text-[#123B2A] mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Basket</span>
        </Link>

        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A]">
              Delivery & Checkout
            </h1>
            <p className="text-xs sm:text-sm text-[#64746A] mt-1">
              Select your delivery time slot and preferred counter or online payment mode.
            </p>
          </div>

          {/* Demo Pre-fill helper */}
          <div className="bg-[#EAF2E7] border border-[#D2E2CE] px-3 py-2 rounded-xl text-xs flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#1B4D36]">Demo Quick Fill:</span>
            <button
              type="button"
              onClick={() => handlePreFill("sunita")}
              className="bg-white hover:bg-gray-100 text-[#123B2A] px-2 py-0.5 rounded text-[10px] font-bold border border-gray-200"
            >
              Mrs. Sunita Rao (Aundh)
            </button>
            <button
              type="button"
              onClick={() => handlePreFill("arvind")}
              className="bg-white hover:bg-gray-100 text-[#123B2A] px-2 py-0.5 rounded text-[10px] font-bold border border-gray-200"
            >
              Dr. Arvind (Model Colony)
            </button>
          </div>
        </div>

        {customerCart.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8E0] p-8">
            <p className="text-sm font-bold text-gray-700">Your basket is empty. Add produce first.</p>
            <Link href="/shop" className="mt-4 inline-block text-xs font-semibold text-[#2F6B45] underline">
              Go to Catalogue
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Details Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Customer Details */}
              <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-[#123B2A] pb-2 border-b border-[#F0F4EF]">
                  <span className="w-5 h-5 rounded-full bg-[#123B2A] text-white text-[11px] flex items-center justify-center font-bold">1</span>
                  <span>Contact Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#1E2B23] font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6B45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1E2B23] font-semibold mb-1">Phone Number (For Delivery SMS/WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6B45]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#1E2B23] font-semibold mb-1">Email Address (For GST Invoice Copy)</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6B45]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-[#123B2A] pb-2 border-b border-[#F0F4EF]">
                  <span className="w-5 h-5 rounded-full bg-[#123B2A] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                  <span>Doorstep Delivery Address</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-3">
                    <label className="block text-[#1E2B23] font-semibold mb-1">Street Address, Flat / Villa No.</label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2F6B45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1E2B23] font-semibold mb-1">Delivery Area</label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="Model Colony / Shivajinagar">Model Colony / Shivajinagar</option>
                      <option value="Aundh">Aundh</option>
                      <option value="Kalyani Nagar">Kalyani Nagar</option>
                      <option value="Koregaon Park">Koregaon Park</option>
                      <option value="Baner">Baner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1E2B23] font-semibold mb-1">City</label>
                    <input
                      type="text"
                      disabled
                      value="Pune"
                      className="w-full bg-gray-100 border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1E2B23] font-semibold mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Delivery Time Slots (As described in PDF page 12) */}
              <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-[#123B2A] pb-2 border-b border-[#F0F4EF]">
                  <span className="w-5 h-5 rounded-full bg-[#123B2A] text-white text-[11px] flex items-center justify-center font-bold">3</span>
                  <span>Choose Delivery Slot</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    "Today: 4:00 PM - 7:00 PM",
                    "Tomorrow: 7:00 AM - 10:00 AM",
                    "Tomorrow: 4:00 PM - 7:00 PM"
                  ].map((slot) => (
                    <label
                      key={slot}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-2 ${
                        deliverySlot === slot
                          ? "bg-[#EAF2E7] border-[#2F6B45] text-[#123B2A] font-bold shadow-xs"
                          : "border-[#E2E8E0] bg-[#F8F6F0] text-gray-700 hover:bg-[#EAF2E7]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value={slot}
                        checked={deliverySlot === slot}
                        onChange={() => setDeliverySlot(slot)}
                        className="text-[#123B2A] focus:ring-0"
                      />
                      <Clock className="w-4 h-4 text-[#2F6B45] shrink-0" />
                      <span className="text-[11px]">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Payment Modes (As specified in PDF page 12: COD, Pay at Store, UPI) */}
              <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-[#123B2A] pb-2 border-b border-[#F0F4EF]">
                  <span className="w-5 h-5 rounded-full bg-[#123B2A] text-white text-[11px] flex items-center justify-center font-bold">4</span>
                  <span>Payment Method (Simulated)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      paymentMethod === "Cash on Delivery"
                        ? "bg-[#EAF2E7] border-[#2F6B45] text-[#123B2A] font-bold"
                        : "border-[#E2E8E0] bg-[#F8F6F0] text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name="payMethod"
                        value="Cash on Delivery"
                        checked={paymentMethod === "Cash on Delivery"}
                        onChange={() => setPaymentMethod("Cash on Delivery")}
                      />
                      <Banknote className="w-4 h-4 text-[#2F6B45]" />
                      <span className="font-bold text-xs">Cash on Delivery</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-normal">
                      Pay cash or UPI to rider upon exact weighing at your door.
                    </p>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      paymentMethod === "UPI"
                        ? "bg-[#EAF2E7] border-[#2F6B45] text-[#123B2A] font-bold"
                        : "border-[#E2E8E0] bg-[#F8F6F0] text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name="payMethod"
                        value="UPI"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                      />
                      <QrCode className="w-4 h-4 text-[#2F6B45]" />
                      <span className="font-bold text-xs">UPI Direct</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-normal">
                      Instant scan & pay simulation with confirmed UTR.
                    </p>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      paymentMethod === "Pay at Store"
                        ? "bg-[#EAF2E7] border-[#2F6B45] text-[#123B2A] font-bold"
                        : "border-[#E2E8E0] bg-[#F8F6F0] text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name="payMethod"
                        value="Pay at Store"
                        checked={paymentMethod === "Pay at Store"}
                        onChange={() => setPaymentMethod("Pay at Store")}
                      />
                      <Store className="w-4 h-4 text-[#2F6B45]" />
                      <span className="font-bold text-xs">Pay at Store</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-normal">
                      Pick up at Heritage Arcade counter and pay in person.
                    </p>
                  </label>
                </div>

                {paymentMethod === "UPI" && (
                  <div className="mt-3 p-4 bg-[#F8F6F0] rounded-2xl border border-[#E2E8E0] text-xs flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl border border-gray-300 flex items-center justify-center shrink-0">
                      <QrCode className="w-20 h-20 text-[#123B2A]" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-[#123B2A]">Simulated Farm Story UPI:</span>
                      <p className="font-mono text-emerald-800 text-[11px]">thefarmstory@icici</p>
                      <p className="text-[10px] text-gray-500">
                        For demo purposes, order is auto-confirmed. UTR reference:
                      </p>
                      <input
                        type="text"
                        placeholder="e.g. 4281900124 (Optional for demo)"
                        value={upiRef}
                        onChange={(e) => setUpiRef(e.target.value)}
                        className="bg-white border border-[#E2E8E0] rounded-lg px-2.5 py-1 text-xs w-full max-w-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Order Review & Place Order */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 farm-card-shadow space-y-4 sticky top-28">
                <h2 className="font-extrabold text-base text-[#123B2A] pb-3 border-b border-[#F0F4EF]">
                  Order Review
                </h2>

                <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 text-xs">
                  {customerCart.map((item) => (
                    <div key={`${item.product.id}-${item.unit}`} className="py-2 flex justify-between">
                      <div>
                        <span className="font-semibold text-gray-800">{item.product.name}</span>
                        <span className="text-[10px] text-gray-500 block">
                          {item.quantity} x {item.unit} ({(item.weightKg).toFixed(2)} kg)
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatINR((item.product.availableUnits.find(u => u.unit === item.unit)?.price || (item.product.pricePerKg * item.weightKg)) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#F0F4EF] space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Slot Fee</span>
                    <span className="font-bold text-gray-900">
                      {deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : formatINR(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[#123B2A] pt-2 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span>{formatINR(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#123B2A] hover:bg-[#1B4D36] text-white rounded-full font-bold text-xs uppercase tracking-wider transition shadow-xl flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <span>Confirming Order...</span>
                  ) : (
                    <>
                      <span>Place Simulated Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                  Interactive Demo Notice: No real card or payment gateway is processed. Order will appear in the Admin Order and Delivery views.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}

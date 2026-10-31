"use client";

import React, { useState } from "react";
import { useFarmStore } from "@/store/farmStore";
import { formatINR } from "@/lib/utils";
import { Order } from "@/types";
import { 
  Truck, 
  Scale, 
  UserCheck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Clock, 
  Banknote, 
  Boxes,
  X
} from "lucide-react";

export default function AdminDeliveryPage() {
  const { orders, riders, updateOrderStatus, addNotification } = useFarmStore();

  const [packingModalOrder, setPackingModalOrder] = useState<Order | null>(null);
  const [actualScaleWeight, setActualScaleWeight] = useState("4.150");
  const [selectedRiderId, setSelectedRiderId] = useState(riders[0]?.id || "rider-1");

  const onlineOrders = orders.filter(o => o.channel === "Website Online");

  const pendingPacking = onlineOrders.filter(o => o.status === "New");
  const readyForDispatch = onlineOrders.filter(o => o.status === "Packed");
  const onTheRoad = onlineOrders.filter(o => o.status === "Dispatched");
  const deliveredOrders = onlineOrders.filter(o => o.status === "Delivered");

  const handleOpenPackingDesk = (order: Order) => {
    setPackingModalOrder(order);
    const approx = order.items.reduce((sum, it) => sum + it.weightKg, 0);
    setActualScaleWeight((approx + 0.05).toFixed(3)); // Realistic produce variance
  };

  const handleConfirmPacked = () => {
    if (!packingModalOrder) return;
    const weight = parseFloat(actualScaleWeight) || 3.0;

    updateOrderStatus(packingModalOrder.id, "Packed", {
      actualWeightKg: weight
    });

    addNotification(
      "Packing Weighed & Verified",
      `Order ${packingModalOrder.orderNumber} packed on digital scale (${weight} kg). Ready for rider dispatch.`,
      "success"
    );

    setPackingModalOrder(null);
  };

  const handleDispatchOrder = (orderId: string) => {
    const rider = riders.find(r => r.id === selectedRiderId) || riders[0];
    updateOrderStatus(orderId, "Dispatched", {
      riderId: rider.id
    });

    addNotification(
      "Dispatched for Delivery",
      `Handed over to ${rider.name} on ${rider.vehicleType}. Customer notified via simulated SMS.`,
      "info"
    );
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, "Delivered");
    addNotification("Doorstep Delivery Confirmed", `Order ${orderId.slice(-6)} delivered. COD settled.`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-[#D4AA52]" />
          Doorstep Fulfillment Operations
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
          Packing Desk & EV Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-[#64746A]">
          Weigh at packing so the final bill is exact. Assign EV riders and settle daily Cash on Delivery (Page 13 of PDF).
        </p>
      </div>

      {/* 4 Stage Pipeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-[11px] font-bold text-amber-700 uppercase">1. New To Pack</span>
          <span className="text-2xl font-black text-[#123B2A] block mt-1">{pendingPacking.length}</span>
          <span className="text-[10px] text-gray-500">Requires scale weighing</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-[11px] font-bold text-purple-700 uppercase">2. Packed & Labeled</span>
          <span className="text-2xl font-black text-[#123B2A] block mt-1">{readyForDispatch.length}</span>
          <span className="text-[10px] text-gray-500">Awaiting rider assignment</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-[11px] font-bold text-blue-700 uppercase">3. On Delivery</span>
          <span className="text-2xl font-black text-[#123B2A] block mt-1">{onTheRoad.length}</span>
          <span className="text-[10px] text-gray-500">Active in transit</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] farm-card-shadow">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">4. Delivered</span>
          <span className="text-2xl font-black text-emerald-800 block mt-1">{deliveredOrders.length}</span>
          <span className="text-[10px] text-gray-500">Completed & settled</span>
        </div>
      </div>

      {/* Online Delivery Queue */}
      <div className="bg-white rounded-3xl border border-[#E2E8E0] farm-card-shadow overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F4EF]">
          <div>
            <h3 className="font-bold text-sm text-[#123B2A]">Online Orders Delivery Queue</h3>
            <p className="text-xs text-[#64746A]">Live pipeline for delivery coordinator and warehouse packing staff</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Assign Rider:</span>
            <select
              value={selectedRiderId}
              onChange={(e) => setSelectedRiderId(e.target.value)}
              className="bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-2.5 py-1 text-xs font-semibold"
            >
              {riders.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.vehicleType})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-[#F0F4EF]">
          {onlineOrders.map((order) => (
            <div key={order.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#123B2A]">
                    {order.orderNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    order.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                    order.status === "Dispatched" ? "bg-blue-100 text-blue-800" :
                    order.status === "Packed" ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Slot: <strong className="text-gray-800">{order.deliverySlot}</strong>
                  </span>
                </div>

                <p className="text-xs text-gray-700">
                  <strong>{order.customerName}</strong> ({order.customerPhone}) · {order.deliveryAddress?.area}
                </p>

                <p className="text-[11px] text-[#64746A]">
                  Items: {order.items.map(i => `${i.quantity}x ${i.productName}`).join(", ")}
                </p>

                {order.packingWeightActualKg && (
                  <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5" />
                    <span>Exact Packed Weight: {order.packingWeightActualKg} kg</span>
                  </p>
                )}
              </div>

              {/* Action Buttons depending on stage */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right mr-2">
                  <span className="font-black text-sm text-[#123B2A] block">{formatINR(order.total)}</span>
                  <span className="text-[10px] text-gray-500">{order.paymentMethod}</span>
                </div>

                {order.status === "New" && (
                  <button
                    onClick={() => handleOpenPackingDesk(order)}
                    className="bg-[#D4AA52] hover:bg-[#c49a42] text-[#123B2A] px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-xs"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Weigh & Pack</span>
                  </button>
                )}

                {order.status === "Packed" && (
                  <button
                    onClick={() => handleDispatchOrder(order.id)}
                    className="bg-[#123B2A] hover:bg-[#1B4D36] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch EV</span>
                  </button>
                )}

                {order.status === "Dispatched" && (
                  <button
                    onClick={() => handleMarkDelivered(order.id)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Delivered</span>
                  </button>
                )}

                {order.status === "Delivered" && (
                  <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Settled</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packing Desk Digital Scale Weighing Modal */}
      {packingModalOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full farm-card-shadow space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#2F6B45]" />
                <h3 className="font-bold text-base text-[#123B2A]">Packing Desk Scale Weighing</h3>
              </div>
              <button onClick={() => setPackingModalOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#64746A]">
              Weigh produce box for <strong className="text-gray-900">{packingModalOrder.orderNumber}</strong> ({packingModalOrder.customerName}).
            </p>

            <div className="bg-[#123B2A] p-4 rounded-2xl text-center text-white">
              <span className="text-[10px] text-[#D4AA52] uppercase font-bold tracking-wider block">Scale Reading (kg)</span>
              <span className="font-mono text-3xl font-black">{actualScaleWeight} kg</span>
            </div>

            <div className="space-y-1 text-xs text-gray-700">
              <label className="block font-semibold">Adjust Exact Scale Weight (kg):</label>
              <input
                type="number"
                step="0.005"
                value={actualScaleWeight}
                onChange={(e) => setActualScaleWeight(e.target.value)}
                className="w-full bg-[#F8F6F0] border border-[#E2E8E0] rounded-xl px-3 py-2 text-xs font-mono"
              />
              <p className="text-[10px] text-gray-400">
                &ldquo;Weigh at packing so the final bill is exact&rdquo; — avoids customer complaints on loose produce weight.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPackingModalOrder(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPacked}
                className="flex-1 py-2.5 bg-[#123B2A] text-white rounded-xl text-xs font-bold hover:bg-[#1B4D36] transition shadow-md"
              >
                Verify Weight & Seal Box
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

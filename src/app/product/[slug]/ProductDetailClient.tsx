"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useFarmStore } from "@/store/farmStore";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { ProductCard } from "@/components/storefront/ProductCard";
import { formatINR } from "@/lib/utils";
import { UnitType } from "@/types";
import { 
  ArrowLeft, 
  MapPin, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check,
  Scale
} from "lucide-react";

export default function ProductDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { products, addToCustomerCart, addNotification } = useFarmStore();

  const product = products.find((p) => p.slug === slug) || products[0];
  const [selectedUnit, setSelectedUnit] = useState<UnitType>(
    product?.availableUnits[0]?.unit || "kg"
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F6F0]">
        <StoreHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center flex-1">
          <h2 className="text-xl font-bold text-gray-800">Produce item not found</h2>
          <Link href="/shop" className="mt-4 inline-block text-xs font-semibold text-[#2F6B45] underline">
            Return to Catalogue
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const currentUnitConfig = product.availableUnits.find(
    (u) => u.unit === selectedUnit
  ) || { unit: "kg" as UnitType, multiplier: 1.0, price: product.pricePerKg };

  const totalPrice = currentUnitConfig.price * quantity;
  const isOutOfStock = product.currentStockKg <= 0;

  const handleAddToCart = () => {
    addToCustomerCart(
      product,
      selectedUnit,
      quantity,
      currentUnitConfig.multiplier * quantity
    );

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);

    addNotification(
      "Item Added to Basket",
      `${quantity}x ${product.name} (${selectedUnit}) added to basket. Total: ${formatINR(totalPrice)}`,
      "success"
    );
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0]">
      <StoreHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F6B45] hover:text-[#123B2A] mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </button>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-10 farm-card-shadow grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Produce Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-[#F8F6F0] border border-[#E2E8E0]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.isOrganic && (
                  <span className="bg-[#123B2A] text-[#D4AA52] text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-[#D4AA52]" />
                    Pesticide-Free Organic
                  </span>
                )}
                {product.seasonal && (
                  <span className="bg-[#D4AA52] text-[#123B2A] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    In Season Now
                  </span>
                )}
              </div>

              {/* Origin badge on image */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-2.5 text-xs text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AA52] shrink-0" />
                <span className="font-medium truncate">Harvest Origin: {product.originFarm}</span>
              </div>
            </div>

            {/* Farm Guarantees */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-[#F8F6F0] border border-[#E2E8E0]">
                <Clock className="w-4 h-4 text-[#2F6B45] mx-auto mb-1" />
                <span className="font-semibold text-gray-800 block text-[11px]">Harvested</span>
                <span className="text-[10px] text-gray-500">{product.harvestDate || "Yesterday"}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F6F0] border border-[#E2E8E0]">
                <Scale className="w-4 h-4 text-[#2F6B45] mx-auto mb-1" />
                <span className="font-semibold text-gray-800 block text-[11px]">Shelf Life</span>
                <span className="text-[10px] text-gray-500">~{product.shelfLifeDays} Days</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F6F0] border border-[#E2E8E0]">
                <ShieldCheck className="w-4 h-4 text-[#2F6B45] mx-auto mb-1" />
                <span className="font-semibold text-gray-800 block text-[11px]">HSN & Tax</span>
                <span className="text-[10px] text-gray-500">{product.gstRate === 0 ? "0% (Nil)" : `${product.gstRate}% GST`}</span>
              </div>
            </div>
          </div>

          {/* Product Purchasing Info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#2F6B45] uppercase">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B2A] mt-1">
                {product.name}
              </h1>
              <p className="text-xs text-emerald-800 font-semibold mt-1">
                HSN Code: {product.hsnCode} · Nil-rated agricultural produce
              </p>

              {/* Price display */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#123B2A]">
                  {formatINR(currentUnitConfig.price)}
                </span>
                <span className="text-xs font-semibold text-[#64746A]">
                  per {currentUnitConfig.unit}
                </span>
                <span className="text-xs text-[#2F6B45] bg-[#EAF2E7] px-2 py-0.5 rounded font-medium">
                  {formatINR(product.pricePerKg)} / kg base rate
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#64746A] leading-relaxed mt-4">
                {product.description}
              </p>

              {/* Unit Selection */}
              <div className="mt-6">
                <label className="block text-xs font-bold text-[#1E2B23] mb-2 uppercase tracking-wide">
                  Select Unit / Packaging Size:
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.availableUnits.map((u) => (
                    <button
                      key={u.unit}
                      onClick={() => setSelectedUnit(u.unit)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        selectedUnit === u.unit
                          ? "bg-[#123B2A] text-white shadow-md ring-2 ring-[#2F6B45]"
                          : "bg-[#F8F6F0] text-[#1E2B23] border border-[#E2E8E0] hover:bg-[#EAF2E7]"
                      }`}
                    >
                      <span>{u.unit}</span>
                      <span className="text-[11px] opacity-80">({formatINR(u.price)})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-6 flex items-center gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E2B23] mb-1 uppercase tracking-wide">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-[#E2E8E0] rounded-xl overflow-hidden bg-[#F8F6F0]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-700 hover:bg-[#EAF2E7] transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-2 font-bold text-xs text-[#123B2A] min-w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-700 hover:bg-[#EAF2E7] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stock Status Badge */}
                <div className="pt-5">
                  <div className="text-xs">
                    <span className="text-[#64746A]">Counter & Web Stock:</span>{" "}
                    <strong className="text-emerald-700 font-bold">
                      {product.currentStockKg} kg Available
                    </strong>
                  </div>
                  <span className="text-[10px] text-gray-400 block">
                    Oldest batch sells first (FIFO automated rotation)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-6 border-t border-[#F0F4EF] flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-full font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg ${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : addedAnimation
                    ? "bg-emerald-600 text-white"
                    : "bg-[#123B2A] hover:bg-[#1B4D36] text-white"
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity} {selectedUnit} ({formatINR(totalPrice)})</span>
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="w-full sm:w-auto px-6 py-3.5 border border-[#2F6B45] text-[#2F6B45] hover:bg-[#EAF2E7] rounded-full font-bold text-xs text-center transition"
              >
                Go to Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Related Produce Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-extrabold text-[#123B2A] mb-6">
              More Fresh {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}

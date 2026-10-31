"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, UnitType } from "@/types";
import { useFarmStore } from "@/store/farmStore";
import { formatINR } from "@/lib/utils";
import { Plus, Check, MapPin, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCustomerCart, addNotification } = useFarmStore();
  const [selectedUnit, setSelectedUnit] = useState<UnitType>(
    product.availableUnits[0]?.unit || "kg"
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentUnitConfig = product.availableUnits.find(
    (u) => u.unit === selectedUnit
  ) || { unit: "kg" as UnitType, multiplier: 1.0, price: product.pricePerKg };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCustomerCart(
      product,
      selectedUnit,
      1,
      currentUnitConfig.multiplier
    );

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);

    addNotification(
      "Added to Basket",
      `${product.name} (${selectedUnit}) added to cart.`,
      "success"
    );
  };

  const isLowStock = product.currentStockKg > 0 && product.currentStockKg <= product.minThresholdKg;
  const isOutOfStock = product.currentStockKg <= 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] overflow-hidden farm-card-shadow farm-card-hover flex flex-col group relative">
      {/* Produce Image Container */}
      <Link href={`/product/${product.slug}`} className="relative h-48 w-full bg-[#F8F6F0] overflow-hidden block">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-500 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isOrganic && (
            <span className="bg-[#123B2A] text-[#D4AA52] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 fill-[#D4AA52]" />
              Natural Organic
            </span>
          )}
          {product.seasonal && (
            <span className="bg-[#D4AA52] text-[#123B2A] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Seasonal Special
            </span>
          )}
        </div>

        {/* Live Stock Indicator on top right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
              Only {product.currentStockKg} kg Left
            </span>
          ) : (
            <span className="bg-emerald-700/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm backdrop-blur-xs">
              Live Stock: {product.currentStockKg} kg
            </span>
          )}
        </div>

        {/* Origin Farm pill overlay */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 text-[10px] text-white flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 text-[#D4AA52] shrink-0" />
          <span className="truncate">{product.originFarm}</span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-semibold tracking-wider text-[#2F6B45] uppercase">
            {product.category}
          </span>
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-sm text-[#123B2A] hover:text-[#2F6B45] transition line-clamp-1 mt-0.5">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-[#64746A] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F0F4EF]">
          {/* Unit selection pills */}
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <span className="text-[11px] text-[#64746A] mr-1">Unit:</span>
            {product.availableUnits.map((u) => (
              <button
                key={u.unit}
                type="button"
                onClick={() => setSelectedUnit(u.unit)}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition ${
                  selectedUnit === u.unit
                    ? "bg-[#123B2A] text-white shadow-xs"
                    : "bg-[#F8F6F0] text-[#1E2B23] hover:bg-[#EAF2E7]"
                }`}
              >
                {u.unit}
              </button>
            ))}
          </div>

          {/* Pricing & Add Button */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-base font-extrabold text-[#123B2A]">
                {formatINR(currentUnitConfig.price)}
              </span>
              <span className="text-[11px] text-[#64746A] ml-1">
                / {currentUnitConfig.unit}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-xs ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : addedAnimation
                  ? "bg-emerald-600 text-white"
                  : "bg-[#2F6B45] hover:bg-[#123B2A] text-white"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

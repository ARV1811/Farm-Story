import React, { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";
import { INITIAL_PRODUCTS } from "@/data/mockData";

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading produce details...</div>}>
      <ProductDetailClient slug={resolvedParams.slug} />
    </Suspense>
  );
}

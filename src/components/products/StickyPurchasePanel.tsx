"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { Locale } from "@/config/locales";
import { useCart } from "@/components/cart";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import { cn } from "@/lib/utils";

interface StickyPurchasePanelProps {
  product: Product;
  locale: Locale;
}

export default function StickyPurchasePanel({ product, locale }: StickyPurchasePanelProps) {
  const isRtl = locale === "ar";
  const { addItem, openMiniCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (openDrawer = true) => {
    addItem(product, quantity, openDrawer);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <>
      {/* 1. DESKTOP STICKY PURCHASE PANEL (In right sidebar column) */}
      <div className="hidden lg:block sticky top-28 border border-bone-border bg-bone-surface p-6 font-tech text-xs space-y-6 select-none shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-bone-border">
          <TechnicalLabel variant="copper">SPECIFICATION QUOTATION</TechnicalLabel>
          <span className="text-[10px] text-accent-mineral font-mono">STOCK: AVAILABLE</span>
        </div>

        {/* Product Identity Summary */}
        <div className="space-y-1">
          <span className="font-tech text-[10px] text-accent-copper uppercase font-bold">
            PART NO // {product.partNumber}
          </span>
          <h3 className="font-display text-2xl text-carbon uppercase leading-tight">
            {isRtl ? product.nameAr : product.name}
          </h3>
          <p className="font-tech text-[11px] text-carbon/75 pt-1">
            {product.finish}
          </p>
        </div>

        {/* Specification Check List */}
        <div className="space-y-2 border-y border-bone-border/60 py-4 text-[11px]">
          <div className="flex justify-between">
            <span className="text-accent-mineral">MATERIAL:</span>
            <span className="font-bold text-carbon">{product.material || "SS 316L"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-accent-mineral">GRADE:</span>
            <span className="font-bold text-carbon">{product.grade || "316L"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-accent-mineral">TOLERANCE:</span>
            <span className="font-bold text-accent-copper">±0.05 MM</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="space-y-2">
          <label className="block text-[10px] text-accent-mineral uppercase font-bold">
            {isRtl ? "تحديد الكمية المطلوبة (وحدات / أمتار)" : "SPECIFICATION QUANTITY (UNITS)"}
          </label>
          <div className="flex items-center border border-bone-border bg-world-bone">
            <button
              onClick={decrement}
              className="w-12 h-11 flex items-center justify-center font-bold text-base hover:bg-carbon/10 transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-center py-2.5 bg-transparent font-tech font-bold text-sm text-carbon focus:outline-none"
            />
            <button
              onClick={increment}
              className="w-12 h-11 flex items-center justify-center font-bold text-base hover:bg-carbon/10 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleAddToCart(true)}
            className={cn(
              "w-full py-4 text-xs font-tech font-bold tracking-widest uppercase transition-all duration-200 border flex items-center justify-center gap-2",
              added
                ? "bg-accent-copper text-bone border-accent-copper shadow-md"
                : "bg-carbon text-bone border-carbon hover:bg-bone hover:text-carbon"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-accent-copper" />
            <span>{added ? (isRtl ? "تمت الإضافة لـ RFQ ✓" : "ADDED TO RFQ ✓") : (isRtl ? "إضافة لطلب التسعير" : "Add to Cart")}</span>
          </button>

          <Link
            href={`/${locale}/cart`}
            className="w-full py-3 text-xs font-tech tracking-widest uppercase text-center block border border-bone-border bg-transparent text-carbon hover:border-carbon transition-colors"
          >
            {isRtl ? "عرض السلة ومراجعة RFQ" : "VIEW CART & SUBMIT RFQ →"}
          </Link>
        </div>

        {/* Quality Standard Notation */}
        <div className="text-[9px] text-accent-mineral/70 text-center uppercase pt-2">
          ISO 9001 CERTIFIED · MILL TEST TRACEABLE
        </div>
      </div>

      {/* 2. MOBILE STICKY BOTTOM PURCHASE BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141518]/95 backdrop-blur-md border-t border-carbon-border/80 px-4 pt-3 pb-safe text-bone font-tech text-xs shadow-2xl flex items-center justify-between gap-3 select-none">
        <div className="min-w-0 flex-1">
          <span className="font-bold text-accent-copper text-[10px] block truncate">
            {product.partNumber}
          </span>
          <span className="font-display text-sm text-bone truncate block uppercase leading-tight">
            {isRtl ? product.nameAr : product.name}
          </span>
        </div>

        {/* Quantity Toggle */}
        <div className="flex items-center border border-carbon-border bg-carbon shrink-0">
          <button onClick={decrement} className="w-9 h-9 flex items-center justify-center text-bone font-bold text-base active:bg-white/10 touch-feedback" aria-label="Decrease quantity">
            -
          </button>
          <span className="w-8 text-center text-xs font-bold text-bone font-mono">
            {quantity}
          </span>
          <button onClick={increment} className="w-9 h-9 flex items-center justify-center text-bone font-bold text-base active:bg-white/10 touch-feedback" aria-label="Increase quantity">
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => handleAddToCart(true)}
          className={cn(
            "px-4 py-2.5 font-tech text-xs font-bold uppercase tracking-wider border shrink-0 transition-all duration-200 touch-feedback",
            added
              ? "bg-accent-copper text-bone border-accent-copper shadow-md"
              : "bg-bone text-carbon border-bone active:scale-95 hover:border-accent-copper"
          )}
        >
          {added ? (isRtl ? "تمت الإضافة لـ RFQ ✓" : "ADDED TO RFQ ✓") : (isRtl ? "إضافة لـ RFQ" : "Add to Cart")}
        </button>
      </div>
    </>
  );
}

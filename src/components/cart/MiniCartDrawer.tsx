"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/config/locales";
import { useCart } from "./CartContext";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import { cn } from "@/lib/utils";

interface MiniCartDrawerProps {
  locale: Locale;
}

export default function MiniCartDrawer({ locale }: MiniCartDrawerProps) {
  const {
    items,
    totalQuantity,
    lastAddedProduct,
    miniCartOpen,
    closeMiniCart,
    removeItem,
    updateQuantity,
  } = useCart();

  const isRtl = locale === "ar";

  if (!miniCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeMiniCart}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Panel (Desktop: Right Drawer, Mobile: Bottom/Right Sheet) */}
      <div className="relative w-full sm:w-[480px] h-full bg-[#111316] text-bone border-s border-carbon-border shadow-2xl z-10 flex flex-col justify-between font-tech select-none animate-slideInRight">
        {/* TOP HEADER */}
        <div className="p-6 border-b border-carbon-border flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <TechnicalLabel variant="copper">
              {isRtl ? "قائمة طلب التسعير" : "SPECIFICATION LIST"}
            </TechnicalLabel>
            <span className="text-[10px] text-accent-copper font-mono font-bold px-2 py-0.5 border border-accent-copper/40 bg-accent-copper/10">
              [{String(totalQuantity).padStart(2, "0")} ITEMS]
            </span>
          </div>

          <button
            onClick={closeMiniCart}
            className="w-8 h-8 flex items-center justify-center border border-carbon-border hover:border-bone transition-colors text-sm font-bold"
            aria-label="Close Mini Cart"
          >
            ✕
          </button>
        </div>

        {/* RECENT ADD NOTIFICATION CALLOUT */}
        {lastAddedProduct && (
          <div className="px-6 py-3 bg-accent-copper/15 border-b border-accent-copper/30 flex items-center justify-between text-xs">
            <span className="text-bone flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-copper animate-pulse" />
              <span>{isRtl ? "تمت إضافة المكون إلى RFQ" : "ADDED TO RFQ"}</span>
            </span>
            <span className="text-accent-copper font-bold font-mono">
              +{lastAddedProduct.quantity}
            </span>
          </div>
        )}

        {/* ITEMS SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 mx-auto border border-carbon-border flex items-center justify-center text-accent-metal">
                Ø
              </div>
              <p className="text-xs text-accent-metal uppercase">
                {isRtl ? "قائمة RFQ فارغة حالياً" : "NO ITEMS IN SPECIFICATION LIST"}
              </p>
            </div>
          ) : (
            items.map((item) => {
              const p = item.product;
              return (
                <div
                  key={p.id}
                  className="border border-carbon-border bg-carbon-surface p-4 flex gap-4 items-start"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 relative shrink-0 border border-carbon-border overflow-hidden bg-carbon">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-accent-metal">
                        CAD
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[9px] text-accent-copper block font-bold truncate">
                      {p.partNumber}
                    </span>
                    <h4 className="font-display text-base text-bone truncate uppercase leading-tight">
                      {isRtl ? p.nameAr : p.name}
                    </h4>
                    <span className="text-[10px] text-accent-metal block truncate">
                      {p.finish || p.material || "SS 316L"}
                    </span>

                    {/* Quantity Selector & Remove */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-carbon-border bg-carbon">
                        <button
                          onClick={() => updateQuantity(p.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-bone hover:bg-white/10"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-bone font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(p.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-bone hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(p.id)}
                        className="text-[10px] text-accent-metal hover:text-bone uppercase underline"
                      >
                        {isRtl ? "حذف" : "REMOVE"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM ACTION TERMINAL */}
        <div className="p-6 border-t border-carbon-border bg-carbon space-y-3">
          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-accent-metal uppercase">TOTAL PRODUCTS:</span>
            <span className="font-bold text-bone font-mono">[{items.length}]</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-carbon-border/50">
            <span className="text-accent-metal uppercase">TOTAL QUANTITY:</span>
            <span className="font-bold text-accent-copper font-mono">
              {totalQuantity} UNITS
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              href={`/${locale}/cart`}
              onClick={closeMiniCart}
              className="w-full py-3.5 bg-bone text-carbon font-bold text-xs uppercase tracking-widest text-center block border border-bone hover:bg-accent-copper hover:text-bone hover:border-accent-copper transition-colors"
            >
              {isRtl ? "مراجعة وإرسال RFQ" : "VIEW RFQ QUOTATION DESK →"}
            </Link>

            <button
              onClick={closeMiniCart}
              className="w-full py-2.5 bg-transparent text-accent-metal font-tech text-xs uppercase tracking-wider text-center border border-carbon-border hover:text-bone hover:border-bone transition-colors"
            >
              {isRtl ? "مواصلة التصفح" : "CONTINUE BROWSING"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

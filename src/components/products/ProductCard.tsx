"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { Locale } from "@/config/locales";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import IconArrow from "@/components/ui/IconArrow";
import { useCart } from "@/components/cart";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  world?: "carbon" | "bone";
  className?: string;
  index?: number;
}

export default function ProductCard({
  product,
  locale,
  world = "bone",
  className = "",
  index,
}: ProductCardProps) {
  const isRtl = locale === "ar";
  const isBone = world === "bone";
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const formattedIndex = typeof index === "number" ? String(index + 1).padStart(2, "0") : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, true);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className={cn(
        "group border flex flex-col justify-between transition-all duration-300 hover:border-accent-copper/70 w-full max-w-full box-border hover:-translate-y-0.5 hover:shadow-lg relative cursor-pointer",
        isBone
          ? "bg-bone-surface border-bone-border text-carbon hover:shadow-bone-muted/20"
          : "bg-carbon-surface border-carbon-border text-bone hover:shadow-carbon/40",
        className
      )}
    >
      {/* Full-card overlay link so clicking anywhere opens detailed product page */}
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${product.name} specifications`}
      />

      {/* Top Media / Industrial Image Placeholder */}
      <div className="relative w-full overflow-hidden">
        <ProductPlaceholder
          productId={product.partNumber || product.id}
          category={isRtl ? product.categoryAr : product.category}
          name={isRtl ? product.nameAr : product.name}
          imageUrl={product.image}
          world={world}
          aspectRatio="video"
        />
        {/* Top Part Number & Index Tag */}
        <div className="absolute top-2.5 start-2.5 sm:top-3 sm:start-3 flex items-center gap-1.5 z-20 pointer-events-none">
          {formattedIndex && (
            <span className="font-tech text-[9px] font-bold tracking-widest px-1.5 py-0.5 bg-carbon text-bone border border-carbon-border">
              {formattedIndex}
            </span>
          )}
          <span className="font-tech text-[9px] font-bold tracking-wider px-1.5 py-0.5 bg-carbon/90 text-accent-copper border border-carbon-border">
            {product.partNumber}
          </span>
        </div>
      </div>

      {/* Content Metadata */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5 pointer-events-none">
            <TechnicalLabel variant="copper">
              {isRtl ? product.categoryAr : product.category}
            </TechnicalLabel>
            <span className="font-tech text-[8px] text-accent-metal border border-carbon-border/40 px-1 py-0.5 uppercase">
              {product.finish ? (product.finish.length > 18 ? product.finish.slice(0, 16) + "..." : product.finish) : "STANDARD"}
            </span>
          </div>

          <h3 className="font-display text-lg sm:text-xl tracking-wide uppercase group-hover:text-accent-copper transition-colors break-words leading-tight">
            {isRtl ? product.nameAr : product.name}
          </h3>

          <p className="font-body text-[11px] mt-1.5 line-clamp-2 opacity-75 break-words pointer-events-none">
            {isRtl ? (product.shortDescriptionAr || product.descriptionAr) : (product.shortDescription || product.description)}
          </p>
        </div>

        {/* Technical Attributes Grid */}
        <div className="border-t border-current/15 pt-2.5 space-y-1.5 font-tech text-[11px] pointer-events-none">
          <div className="flex justify-between items-center opacity-80 gap-2">
            <span className="text-[9px] opacity-70 uppercase">MATERIAL:</span>
            <span className="font-bold truncate text-[10px]">{product.material || "SS 316L"}</span>
          </div>
          <div className="flex justify-between items-center opacity-80 gap-2">
            <span className="text-[9px] opacity-70 uppercase">GRADE:</span>
            <span className="font-bold truncate text-[10px]">{product.grade || "316L"}</span>
          </div>
        </div>

        {/* Dual Actions: View Details + Add to Cart */}
        <div className="pt-2.5 border-t border-current/15 flex items-center justify-between gap-2 relative z-20">
          <span className="inline-flex items-center space-x-1 rtl:space-x-reverse font-tech text-[11px] font-bold tracking-wider uppercase text-accent-metal group-hover:text-accent-copper transition-colors pointer-events-none">
            <span>{isRtl ? "عرض التفاصيل" : "View Details"}</span>
            <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 shrink-0">
              <IconArrow locale={locale} size={11} />
            </span>
          </span>

          <button
            onClick={handleAddToCart}
            className={cn(
              "font-tech text-[9px] sm:text-[10px] uppercase px-2.5 py-1.5 border transition-all duration-200 select-none flex items-center gap-1.5 shrink-0",
              added
                ? "bg-accent-copper text-bone border-accent-copper"
                : isBone
                ? "bg-carbon text-bone border-carbon hover:bg-bone hover:text-carbon"
                : "bg-bone text-carbon border-bone hover:bg-carbon hover:text-bone"
            )}
            aria-label={`Add ${product.name} to RFQ`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-copper" />
            <span className="font-bold">{added ? (isRtl ? "تمت الإضافة ✓" : "ADDED ✓") : (isRtl ? "إضافة لـ RFQ" : "Add to Cart")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

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
        "group border flex flex-col justify-between transition-all duration-300 hover:border-accent-copper/70 w-full max-w-full box-border hover:-translate-y-0.5 hover:shadow-xl relative",
        isBone
          ? "bg-bone-surface border-bone-border text-carbon hover:shadow-bone-muted/20"
          : "bg-carbon-surface border-carbon-border text-bone hover:shadow-carbon/40",
        className
      )}
    >
      {/* Top Media / Industrial Image Placeholder */}
      <div className="relative w-full overflow-hidden">
        <ProductPlaceholder
          productId={product.partNumber || product.id}
          category={isRtl ? product.categoryAr : product.category}
          name={isRtl ? product.nameAr : product.name}
          imageUrl={product.image}
          world={world}
          aspectRatio="square"
        />
        {/* Top Part Number & Index Tag */}
        <div className="absolute top-3 start-3 sm:top-4 sm:start-4 flex items-center gap-1.5 z-10">
          {formattedIndex && (
            <span className="font-tech text-[9px] sm:text-[10px] font-bold tracking-widest px-2 py-0.5 bg-carbon text-bone border border-carbon-border">
              {formattedIndex}
            </span>
          )}
          <span className="font-tech text-[9px] sm:text-[10px] font-bold tracking-wider px-2 py-0.5 bg-carbon/90 text-accent-copper border border-carbon-border">
            {product.partNumber}
          </span>
        </div>
      </div>

      {/* Content Metadata */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <TechnicalLabel variant="copper">
              {isRtl ? product.categoryAr : product.category}
            </TechnicalLabel>
            <span className="font-tech text-[9px] text-accent-metal border border-carbon-border/40 px-1.5 py-0.5 uppercase">
              {product.finish ? (product.finish.length > 22 ? product.finish.slice(0, 20) + "..." : product.finish) : "STANDARD"}
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase group-hover:text-accent-copper transition-colors break-words leading-tight">
            {isRtl ? product.nameAr : product.name}
          </h3>

          <p className="font-body text-xs mt-2 line-clamp-2 opacity-75 break-words">
            {isRtl ? (product.shortDescriptionAr || product.descriptionAr) : (product.shortDescription || product.description)}
          </p>
        </div>

        {/* Technical Attributes Grid */}
        <div className="border-t border-current/15 pt-3 sm:pt-4 space-y-2 font-tech text-xs">
          <div className="flex justify-between items-center opacity-80 gap-2">
            <span className="text-[10px] opacity-70 uppercase">MATERIAL:</span>
            <span className="font-bold truncate text-[11px]">{product.material || "SS 316L"}</span>
          </div>
          <div className="flex justify-between items-center opacity-80 gap-2">
            <span className="text-[10px] opacity-70 uppercase">GRADE:</span>
            <span className="font-bold truncate text-[11px]">{product.grade || "316L"}</span>
          </div>
          {product.thickness && product.thickness !== "Engineering Standard" && (
            <div className="flex justify-between items-center opacity-80 gap-2">
              <span className="text-[10px] opacity-70 uppercase">THICKNESS:</span>
              <span className="font-bold truncate text-[11px] text-accent-copper">{product.thickness}</span>
            </div>
          )}
        </div>

        {/* Dual Actions: View Details + Add to Cart */}
        <div className="pt-3 sm:pt-4 border-t border-current/15 flex items-center justify-between gap-2">
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="inline-flex items-center space-x-1.5 rtl:space-x-reverse font-tech text-xs font-bold tracking-wider uppercase py-1.5 text-accent-metal group-hover:text-accent-copper transition-colors"
          >
            <span>{isRtl ? "عرض التفاصيل" : "View Details"}</span>
            <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 shrink-0">
              <IconArrow locale={locale} size={12} />
            </span>
          </Link>

          <button
            onClick={handleAddToCart}
            className={cn(
              "font-tech text-[10px] sm:text-xs uppercase px-3 py-1.5 border transition-all duration-200 select-none flex items-center gap-1.5",
              added
                ? "bg-accent-copper text-bone border-accent-copper"
                : isBone
                ? "bg-carbon text-bone border-carbon hover:bg-bone hover:text-carbon"
                : "bg-bone text-carbon border-bone hover:bg-carbon hover:text-bone"
            )}
            aria-label={`Add ${product.name} to RFQ`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-copper" />
            <span className="font-bold">{added ? (isRtl ? "تمت الإضافة لـ RFQ ✓" : "ADDED TO RFQ ✓") : (isRtl ? "إضافة لـ RFQ" : "Add to Cart")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

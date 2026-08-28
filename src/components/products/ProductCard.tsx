import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { Locale } from "@/config/locales";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import IconArrow from "@/components/ui/IconArrow";
import { cn } from "@/lib/utils";

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

  const formattedIndex = typeof index === "number" ? String(index + 1).padStart(2, "0") : undefined;

  return (
    <div
      className={cn(
        "group border flex flex-col justify-between transition-all duration-300 hover:border-current w-full max-w-full box-border",
        isBone
          ? "bg-bone-surface border-bone-border text-carbon"
          : "bg-carbon-surface border-carbon-border text-bone",
        className
      )}
    >
      {/* Top Media / Industrial Placeholder Header */}
      <div className="relative w-full">
        <ProductPlaceholder
          productId={product.id}
          category={isRtl ? product.categoryAr : product.category}
          name={isRtl ? product.nameAr : product.name}
          world={world}
          aspectRatio="square"
        />
        {formattedIndex && (
          <div className="absolute top-3 start-3 sm:top-4 sm:start-4 font-tech text-[10px] sm:text-xs font-bold tracking-widest px-2 py-0.5 sm:py-1 bg-carbon text-bone border border-carbon-border">
            {formattedIndex}
          </div>
        )}
      </div>

      {/* Content Metadata */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
        <div>
          <TechnicalLabel variant="copper" className="mb-2">
            {isRtl ? product.categoryAr : product.category}
          </TechnicalLabel>
          <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase group-hover:text-accent-copper transition-colors break-words">
            {isRtl ? product.nameAr : product.name}
          </h3>
          <p className="font-body text-xs mt-2 line-clamp-2 opacity-75 break-words">
            {isRtl ? product.descriptionAr : product.description}
          </p>
        </div>

        {/* Technical Attributes Grid */}
        <div className="border-t border-current/15 pt-3 sm:pt-4 space-y-2 font-tech text-[10px] sm:text-[11px]">
          <div className="flex justify-between items-center opacity-80 gap-2">
            <span>MATERIAL:</span>
            <span className="font-bold truncate">{product.material || "SS 316L"}</span>
          </div>
          <div className="flex justify-between items-center opacity-80 gap-2">
            <span>GRADE:</span>
            <span className="font-bold truncate">{product.grade || "316L"}</span>
          </div>
          {product.application && (
            <div className="flex justify-between items-center opacity-80 gap-2">
              <span>APPLICATION:</span>
              <span className="font-bold truncate max-w-[120px] sm:max-w-[150px]">
                {isRtl ? product.applicationAr : product.application}
              </span>
            </div>
          )}
        </div>

        {/* Action Link */}
        <div className="pt-3 sm:pt-4 border-t border-current/15">
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="flex items-center justify-between font-tech text-xs font-bold tracking-widest uppercase py-1.5 group-hover:text-accent-copper transition-colors"
          >
            <span>{isRtl ? "عرض المنتج" : "VIEW PRODUCT"}</span>
            <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 shrink-0">
              <IconArrow locale={locale} size={14} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { Locale } from "@/config/locales";
import IconArrow from "@/components/ui/IconArrow";
import { cn } from "@/lib/utils";

interface ProductListItemProps {
  product: Product;
  locale: Locale;
  world?: "carbon" | "bone";
  className?: string;
  index?: number;
}

export default function ProductListItem({
  product,
  locale,
  world = "bone",
  className = "",
  index,
}: ProductListItemProps) {
  const isRtl = locale === "ar";
  const isBone = world === "bone";

  const formattedIndex = typeof index === "number" ? String(index + 1).padStart(2, "0") : "01";

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className={cn(
        "group border p-3.5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 transition-colors duration-200 w-full max-w-full box-border min-w-0",
        isBone
          ? "bg-bone-surface border-bone-border text-carbon hover:bg-bone"
          : "bg-carbon-surface border-carbon-border text-bone hover:bg-carbon",
        className
      )}
    >
      {/* Index & Title */}
      <div className="flex items-start md:items-center space-x-3 sm:space-x-4 rtl:space-x-reverse w-full md:w-auto md:min-w-[240px] min-w-0">
        <span className="font-tech text-xs font-bold text-accent-copper border border-current px-2 py-1 shrink-0">
          {formattedIndex}
        </span>
        <div className="min-w-0 flex-1">
          <span className="font-tech text-[10px] tracking-widest text-accent-mineral block uppercase truncate">
            {isRtl ? product.categoryAr : product.category}
          </span>
          <h4 className="font-display text-base sm:text-2xl uppercase group-hover:text-accent-copper transition-colors break-words">
            {isRtl ? product.nameAr : product.name}
          </h4>
        </div>
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 font-tech text-xs opacity-80 border-y md:border-y-0 border-current/15 py-3 md:py-0 w-full md:w-auto min-w-0">
        <div className="min-w-0">
          <span className="block text-[9px] opacity-60 uppercase">MATERIAL</span>
          <span className="font-bold truncate block">{product.material || "SS 316L"}</span>
        </div>
        <div className="min-w-0">
          <span className="block text-[9px] opacity-60 uppercase">GRADE</span>
          <span className="font-bold truncate block">{product.grade || "316L"}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 min-w-0">
          <span className="block text-[9px] opacity-60 uppercase">APPLICATION</span>
          <span className="font-bold truncate block max-w-full">
            {isRtl ? product.applicationAr : product.application}
          </span>
        </div>
      </div>

      {/* Action Arrow */}
      <div className="flex items-center justify-between md:justify-end space-x-2 rtl:space-x-reverse font-tech text-xs font-bold tracking-widest uppercase group-hover:text-accent-copper pt-2 md:pt-0 shrink-0">
        <span>{isRtl ? "تفاصيل" : "DETAILS"}</span>
        <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 shrink-0">
          <IconArrow locale={locale} size={16} />
        </span>
      </div>
    </Link>
  );
}

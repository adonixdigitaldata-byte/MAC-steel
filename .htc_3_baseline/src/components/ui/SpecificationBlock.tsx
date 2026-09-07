import React from "react";
import { ProductSpecification } from "@/types";
import { Locale } from "@/config/locales";
import { cn } from "@/lib/utils";

interface SpecificationBlockProps {
  specifications?: ProductSpecification[];
  material?: string;
  grade?: string;
  size?: string;
  application?: string;
  locale: Locale;
  world?: "carbon" | "bone";
  className?: string;
}

export default function SpecificationBlock({
  specifications = [],
  material,
  grade,
  size,
  application,
  locale,
  world = "bone",
  className = "",
}: SpecificationBlockProps) {
  const isRtl = locale === "ar";
  const isBone = world === "bone";

  // Build grid items from props
  const defaultItems = [
    { label: "MATERIAL", labelAr: "المادة", value: material },
    { label: "GRADE", labelAr: "الدرجة", value: grade },
    { label: "SIZE / DIMENSION", labelAr: "الحجم / الأبعاد", value: size },
    { label: "APPLICATION", labelAr: "مجال التطبيق", value: application },
  ].filter((item) => Boolean(item.value));

  const itemsToRender =
    specifications.length > 0
      ? specifications.map((s) => ({
          label: s.label,
          labelAr: s.labelAr || s.label,
          value: s.value,
        }))
      : defaultItems;

  return (
    <div
      className={cn(
        "border p-4 sm:p-6 font-tech text-xs w-full max-w-full box-border",
        isBone
          ? "bg-bone-surface border-bone-border text-carbon"
          : "bg-carbon-surface border-carbon-border text-bone",
        className
      )}
    >
      <div className="font-tech text-[10px] tracking-widest text-accent-copper uppercase font-bold mb-3 sm:mb-4 pb-2 border-b border-current/20">
        {isRtl ? "المواصفات الهندسية" : "TECHNICAL SPECIFICATIONS"}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {itemsToRender.map((item, index) => (
          <div key={index} className="border-b border-current/15 pb-2 min-w-0">
            <span className="opacity-60 block text-[9px] sm:text-[10px] tracking-wider uppercase mb-0.5 truncate">
              {isRtl ? item.labelAr : item.label}
            </span>
            <span className="font-bold text-xs sm:text-sm tracking-wider font-tech break-words block">
              {item.value || "TBD"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

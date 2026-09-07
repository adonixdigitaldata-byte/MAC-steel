import React from "react";
import { cn } from "@/lib/utils";

interface ProductPlaceholderProps {
  productId?: string;
  category?: string;
  name?: string;
  world?: "carbon" | "bone";
  className?: string;
  aspectRatio?: "square" | "video" | "portrait";
}

export default function ProductPlaceholder({
  productId = "PRODUCT / 001",
  category = "STEEL COMPONENT",
  name = "SPECIFICATION ITEM",
  world = "bone",
  className = "",
  aspectRatio = "square",
}: ProductPlaceholderProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  const isBone = world === "bone";

  return (
    <div
      className={cn(
        "relative overflow-hidden border p-3 sm:p-6 flex flex-col justify-between select-none group w-full max-w-full box-border",
        aspectClasses[aspectRatio],
        isBone
          ? "bg-bone-surface border-bone-border text-carbon"
          : "bg-carbon-surface border-carbon-border text-bone",
        className
      )}
    >
      {/* Background Engineering Linework */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="25%" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <rect x="20%" y="20%" width="60%" height="60%" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Header Annotation */}
      <div className="relative z-10 flex justify-between items-center font-tech text-[9px] sm:text-[10px] tracking-wider uppercase opacity-75 gap-2">
        <span className="truncate">{productId}</span>
        <span className="w-2 h-2 border border-current shrink-0" />
      </div>

      {/* Center Identification */}
      <div className="relative z-10 my-auto text-center py-4 sm:py-6 px-2 sm:px-4 border-y border-current/20 backdrop-blur-[1px] max-w-full">
        <div className="font-tech text-[9px] sm:text-[10px] tracking-wider text-accent-copper uppercase mb-1 font-bold truncate">
          {category}
        </div>
        <div className="font-display text-xl sm:text-3xl tracking-wider uppercase break-words leading-tight">
          {name}
        </div>
        <div className="font-tech text-[8px] sm:text-[9px] tracking-wider opacity-60 uppercase mt-1.5 sm:mt-2">
          IMAGE PENDING / TECHNICAL CAD READY
        </div>
      </div>

      {/* Footer Dimension Notation */}
      <div className="relative z-10 flex justify-between items-center font-tech text-[8px] sm:text-[10px] tracking-wider uppercase opacity-75 gap-2">
        <span className="truncate">CAD-SYS-316L</span>
        <span className="shrink-0">SCALE 1:1</span>
      </div>
    </div>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

interface TechnicalLabelProps {
  children: React.ReactNode;
  variant?: "copper" | "metal" | "mineral" | "bone";
  className?: string;
  showIndicator?: boolean;
}

export default function TechnicalLabel({
  children,
  variant = "metal",
  className = "",
  showIndicator = true,
}: TechnicalLabelProps) {
  const variantStyles = {
    metal: "text-accent-metal",
    copper: "text-accent-copper font-bold",
    mineral: "text-accent-mineral",
    bone: "text-bone",
  };

  const indicatorStyles = {
    metal: "bg-accent-metal",
    copper: "bg-accent-copper",
    mineral: "bg-accent-mineral",
    bone: "bg-bone",
  };

  return (
    <span
      className={cn(
        "font-tech text-[11px] sm:text-xs tracking-wider sm:tracking-widest uppercase inline-flex flex-wrap items-center gap-2 break-words max-w-full leading-tight",
        variantStyles[variant],
        className
      )}
    >
      {showIndicator && (
        <span className={cn("w-1.5 h-1.5 inline-block shrink-0", indicatorStyles[variant])} />
      )}
      <span className="break-words max-w-full">{children}</span>
    </span>
  );
}

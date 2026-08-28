import React from "react";
import { cn } from "@/lib/utils";

interface NumberBadgeProps {
  number: string | number;
  prefix?: string;
  className?: string;
  world?: "carbon" | "bone";
}

export default function NumberBadge({
  number,
  prefix,
  className = "",
  world = "carbon",
}: NumberBadgeProps) {
  const formattedNumber = typeof number === "number" ? String(number).padStart(2, "0") : number;

  const textColor = world === "carbon" ? "text-accent-metal" : "text-accent-mineral";
  const borderColor = world === "carbon" ? "border-carbon-border" : "border-bone-border";

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-1.5 font-tech text-[11px] sm:text-xs tracking-wider uppercase border px-2 py-0.5 sm:px-2.5 sm:py-1 shrink-0 max-w-full",
        textColor,
        borderColor,
        className
      )}
    >
      {prefix && <span className="opacity-70">{prefix} /</span>}
      <span className="font-bold tracking-wider">{formattedNumber}</span>
    </div>
  );
}

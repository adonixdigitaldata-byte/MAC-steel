import React from "react";
import { cn } from "@/lib/utils";

/**
 * Reusable Industrial Manufacturing Skeleton System
 * Avoids generic circular spinners in favor of technical CAD / wireframe skeletons.
 */

export function ManufacturingHeroSkeleton() {
  return (
    <div className="absolute inset-0 bg-carbon flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden animate-pulse">
      {/* Top HUD Skeleton */}
      <div className="flex justify-between items-center opacity-40 font-tech text-[10px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-copper animate-ping" />
          <span className="text-accent-metal">LOADING FABRICATION SEQUENCE...</span>
        </div>
        <div className="h-3 w-28 bg-carbon-border" />
      </div>

      {/* Center 3D Wireframe Scaffold */}
      <div className="my-auto max-w-lg space-y-4 opacity-50">
        <div className="h-8 sm:h-12 w-3/4 bg-carbon-border/80" />
        <div className="h-8 sm:h-12 w-1/2 bg-carbon-border/60" />
        <div className="h-4 w-5/6 bg-carbon-border/40" />
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-32 bg-carbon-border/60" />
          <div className="h-10 w-32 bg-carbon-border/40" />
        </div>
      </div>

      {/* Bottom Technical Grid */}
      <div className="border-t border-carbon-border/30 pt-3 flex justify-between text-[9px] font-tech text-accent-metal/40">
        <span>SYS: INDUSTRIAL 3D CAD ENGINE</span>
        <span>LATENCY: ZERO CALIBRATION</span>
      </div>
    </div>
  );
}

export function ProductCardSkeleton({ world = "bone" }: { world?: "carbon" | "bone" }) {
  const isBone = world === "bone";
  return (
    <div
      className={cn(
        "border p-4 space-y-3 animate-pulse",
        isBone ? "bg-bone-surface border-bone-border" : "bg-carbon-surface border-carbon-border"
      )}
    >
      {/* Media Box */}
      <div className={cn("aspect-video w-full", isBone ? "bg-bone-muted/40" : "bg-carbon")} />
      {/* Title & Meta */}
      <div className="space-y-2 pt-2">
        <div className={cn("h-3 w-24", isBone ? "bg-bone-border" : "bg-carbon-border")} />
        <div className={cn("h-5 w-4/5", isBone ? "bg-bone-border/80" : "bg-carbon-border/80")} />
        <div className={cn("h-3 w-full", isBone ? "bg-bone-border/40" : "bg-carbon-border/40")} />
      </div>
      {/* Footer */}
      <div className={cn("border-t pt-2.5 flex justify-between", isBone ? "border-bone-border/40" : "border-carbon-border/40")}>
        <div className={cn("h-4 w-20", isBone ? "bg-bone-border/60" : "bg-carbon-border/60")} />
        <div className={cn("h-6 w-24", isBone ? "bg-bone-border" : "bg-carbon-border")} />
      </div>
    </div>
  );
}

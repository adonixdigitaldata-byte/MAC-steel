"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotion } from "./MotionProvider";

interface TechnicalDividerProps {
  world?: "carbon" | "bone";
  documentId?: string;
  label?: string;
  className?: string;
  showDot?: boolean;
}

export default function TechnicalDivider({
  world = "carbon",
  documentId,
  label,
  className = "",
  showDot = true,
}: TechnicalDividerProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion } = useMotion();

  const isBone = world === "bone";

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            if (containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    const currentElem = containerRef.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full py-8 sm:py-12 select-none overflow-hidden", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          {/* Animated Line Growth */}
          <div
            className={cn(
              "h-px flex-1 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left",
              isBone ? "bg-bone-border" : "bg-carbon-border",
              !prefersReducedMotion && (isRevealed ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0")
            )}
          />

          {/* Copper Dot Fade & Pulse */}
          {showDot && (
            <div
              className={cn(
                "w-2 h-2 rounded-full mx-4 shrink-0 transition-all duration-700 ease-out",
                isBone ? "bg-accent-copper" : "bg-accent-copper shadow-sm shadow-accent-copper/40",
                !prefersReducedMotion && (isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-50")
              )}
            />
          )}

          {/* Secondary Line Growth */}
          <div
            className={cn(
              "h-px flex-1 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] origin-right",
              isBone ? "bg-bone-border" : "bg-carbon-border",
              !prefersReducedMotion && (isRevealed ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0")
            )}
          />

          {/* Document ID / Label Appearance */}
          {(documentId || label) && (
            <div
              className={cn(
                "ms-4 shrink-0 font-tech text-[9px] sm:text-[10px] tracking-widest uppercase transition-all duration-700 delay-300",
                isBone ? "text-accent-mineral" : "text-accent-metal/60",
                !prefersReducedMotion && (isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
              )}
            >
              {label && <span className="me-2 text-accent-copper font-bold">{label}</span>}
              {documentId && (
                <span className="border border-current/30 px-1.5 py-0.5 bg-carbon/10">
                  {documentId}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotion } from "./MotionProvider";

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
  backgroundImage?: string;
  overlayStyle?: "default" | "warm" | "dramatic" | "technical";
  className?: string;
  /** Speed multiplier (6-10% range, e.g. 0.08) */
  speed?: number;
}

export default function ParallaxBackground({
  children,
  backgroundImage,
  overlayStyle = "default",
  className = "",
  speed = 0.08,
}: ParallaxBackgroundProps) {
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion } = useMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Calculate relative offset when element is within view
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
              const scrollDiff = -rect.top * speed;
              setOffsetY(scrollDiff);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, prefersReducedMotion]);

  const getOverlayGradient = () => {
    switch (overlayStyle) {
      case "warm":
        return "bg-gradient-to-b from-[#141210]/95 via-[#181512]/85 to-[#0e0f12]";
      case "dramatic":
        return "bg-gradient-to-b from-[#0c0d10]/95 via-[#121418]/80 to-[#0e0f12]";
      case "technical":
        return "bg-gradient-to-b from-[#111317]/95 via-[#161920]/85 to-[#0e0f12]";
      default:
        return "bg-gradient-to-b from-[#121316]/95 via-[#181a1f]/85 to-[#0e0f12]";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 pointer-events-none overflow-hidden select-none", className)}
    >
      {/* Background Image / Primary Layer with 6-10% Parallax Displacement */}
      {backgroundImage && (
        <div
          className="absolute -inset-10 bg-cover bg-center opacity-25 mix-blend-luminosity will-change-transform"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            transform: prefersReducedMotion ? "none" : `translate3d(0, ${offsetY}px, 0)`,
          }}
        />
      )}

      {/* Grid Pattern Overlay with Slower Parallax (half speed) */}
      <div
        className="absolute -inset-10 opacity-[0.07] will-change-transform"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          transform: prefersReducedMotion ? "none" : `translate3d(0, ${offsetY * 0.5}px, 0)`,
        }}
      />

      {/* Ambient Light Accent Glow */}
      <div
        className={cn(
          "absolute -top-32 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-1000",
          overlayStyle === "warm"
            ? "bg-amber-600/30"
            : overlayStyle === "dramatic"
            ? "bg-blue-600/20"
            : "bg-accent-copper/25"
        )}
      />

      {/* Multi-layered Carbon Vignette & Scrim */}
      <div className={cn("absolute inset-0", getOverlayGradient())} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90 pointer-events-none" />

      {children}
    </div>
  );
}

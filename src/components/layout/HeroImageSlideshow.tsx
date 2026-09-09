"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroImageSlideshowProps {
  images: string[];
  interval?: number;
  overlayMode?: "none" | "light" | "default";
  className?: string;
}

export default function HeroImageSlideshow({
  images,
  interval = 5000,
  overlayMode = "default",
  className = "",
}: HeroImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden select-none z-0", className)}>
      {images.map((imgSrc, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={imgSrc + idx}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100 scale-105" : "opacity-0 scale-100 pointer-events-none"
            )}
            style={{
              transitionProperty: "opacity, transform",
              transitionDuration: "1200ms, 7000ms",
              transitionTimingFunction: "ease-in-out, ease-out",
            }}
          >
            <Image
              src={imgSrc}
              alt={`Industrial facility slide ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        );
      })}

      {/* When overlayMode is 'none', remove the dark overlay completely */}
      {overlayMode !== "none" && (
        <>
          <div
            className={cn(
              "absolute inset-0 z-[1]",
              overlayMode === "light"
                ? "bg-gradient-to-r from-black/50 via-black/25 to-black/40"
                : "bg-gradient-to-r from-black/60 via-black/35 to-black/50"
            )}
          />
          <div
            className={cn(
              "absolute inset-0 z-[1]",
              overlayMode === "light"
                ? "bg-gradient-to-t from-[#0e0f12]/80 via-transparent to-black/30"
                : "bg-gradient-to-t from-[#0e0f12]/90 via-transparent to-black/40"
            )}
          />
          <div
            className={cn(
              "absolute inset-0 z-[1]",
              overlayMode === "light"
                ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/40"
                : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/15 to-black/60"
            )}
          />
        </>
      )}

      {/* Subtle Grid Pattern Overlay for technical engineering feel */}
      <div
        className="absolute inset-0 opacity-[0.04] z-[2]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMotion } from "./MotionProvider";

interface RevealImageProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  className?: string;
  priority?: boolean;
  overlayOpacity?: number;
}

export default function RevealImage({
  src,
  alt,
  aspectRatio = "video",
  className = "",
  priority = false,
  overlayOpacity = 0.35,
}: RevealImageProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion } = useMotion();

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
  };

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
      className={cn(
        "relative overflow-hidden bg-carbon-surface border border-carbon-border select-none group",
        aspectClasses[aspectRatio],
        className
      )}
    >
      {/* Underlying Image with 1.04 -> 1.00 settle */}
      <div
        className={cn(
          "absolute inset-0 transition-transform duration-1000 ease-out",
          !prefersReducedMotion && (isRevealed ? "scale-100" : "scale-105")
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      {/* Mask-based Curtain Overlay (reveals from bottom-up or fades smoothly) */}
      <div
        className={cn(
          "absolute inset-0 bg-[#0e0f12] pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isRevealed ? "opacity-0 scale-y-0 origin-top" : "opacity-90 scale-y-100 origin-bottom"
        )}
      />

      {/* Subtle Contrast Settle Scrim & Industrial Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0e0f12]/80 via-transparent to-[#0e0f12]/30 pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}

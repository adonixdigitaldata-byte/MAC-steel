"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotion } from "./MotionProvider";

interface FadeRevealProps {
  children: React.ReactNode;
  /** Delay in milliseconds */
  delay?: number;
  /** Custom CSS classes */
  className?: string;
  /** Y displacement in pixels (default: 32) */
  y?: number;
  /** Duration in ms (default: 700) */
  duration?: number;
  /** Threshold for triggering (0 to 1, default 0.15) */
  threshold?: number;
}

export default function FadeReveal({
  children,
  delay = 0,
  className = "",
  y = 32,
  duration = 700,
  threshold = 0.15,
}: FadeRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion } = useMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentElem = domRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [threshold, prefersReducedMotion]);

  const style: React.CSSProperties = prefersReducedMotion
    ? {}
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : `translateY(${y}px)`,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? "auto" : "opacity, transform",
      };

  return (
    <div
      ref={domRef}
      style={style}
      className={cn("w-full", className)}
    >
      {children}
    </div>
  );
}

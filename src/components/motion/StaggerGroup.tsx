"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotion } from "./MotionProvider";

interface StaggerGroupProps {
  children: React.ReactNode;
  /** Stagger interval in milliseconds (default: 80ms) */
  staggerDelay?: number;
  /** Base delay before the first child starts (default: 0ms) */
  baseDelay?: number;
  /** CSS class applied to wrapper */
  className?: string;
}

export default function StaggerGroup({
  children,
  staggerDelay = 80,
  baseDelay = 0,
  className = "",
}: StaggerGroupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion } = useMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Immediate check if element is already in or near viewport
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        setIsVisible(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "100px 0px 100px 0px",
      }
    );

    const currentElem = containerRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [prefersReducedMotion]);

  const childArray = React.Children.toArray(children);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {childArray.map((child, index) => {
        const itemDelay = baseDelay + index * staggerDelay;
        const style: React.CSSProperties = prefersReducedMotion
          ? {}
          : {
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0px)" : "translateY(24px)",
              transitionProperty: "opacity, transform",
              transitionDuration: "600ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: `${itemDelay}ms`,
              willChange: isVisible ? "auto" : "opacity, transform",
            };

        return (
          <div key={index} style={style} className="w-full">
            {child}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Wraps the app in Lenis smooth-scrolling.
 * This does NOT hijack scroll position math (getBoundingClientRect() still
 * reflects real scroll), it just interpolates how the browser gets there —
 * so wheel/trackpad input feels like momentum instead of discrete jumps.
 *
 * Usage: wrap your root layout's {children} with this component, e.g. in
 * src/app/[locale]/layout.tsx:
 *
 *   <SmoothScroll>{children}</SmoothScroll>
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced-motion preference — skip smoothing entirely.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

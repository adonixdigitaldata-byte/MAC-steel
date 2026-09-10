"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Locale } from "@/config/locales";
import Button from "@/components/ui/Button";

import { ManufacturingHeroSkeleton } from "@/components/ui/IndustrialSkeleton";

const HeroCanvas = dynamic(() => import("@/components/3d/HeroCanvas"), {
  ssr: false,
  loading: () => <ManufacturingHeroSkeleton />,
});

interface HeroSectionProps {
  locale: Locale;
}

const COPY = {
  eyebrow: {
    en: "PRECISION STEEL SYSTEMS",
    ar: "أنظمة الصلب الدقيقة",
  },
  title: {
    en: "ENGINEERED\nFOR THE LOAD.",
    ar: "مصممة لتحمّل\nالأحمال.",
  },
  sub: {
    en: "High-precision metal components and structural steel assemblies built for heavy industrial environments.",
    ar: "مكونات معدنية عالية الدقة وهياكل فولاذية مبنية للتطبيقات الصناعية الثقيلة.",
  },
  cta1: { en: "EXPLORE PRODUCTS", ar: "استكشاف المنتجات" },
  cta2: { en: "TECHNICAL INQUIRY", ar: "طلب استشارة هندسية" },
  spec: { en: "ISO 9001  ·  TOLERANCE ±0.05 MM  ·  SYS-316L", ar: "ISO 9001  ·  تفاوت ±0.05 مم  ·  SYS-316L" },
  scroll: { en: "SCROLL TO EXPLORE ↓", ar: "مرر للاستكشاف ↓" },
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const isRtl = locale === "ar";
  const wrapRef     = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const textRef     = useRef<HTMLDivElement>(null);
  const hintRef     = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);

    let raf: number;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const wrap = wrapRef.current;
      if (!wrap) return;

      const rect     = wrap.getBoundingClientRect();
      const total    = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = total > 0 ? clamp01(scrolled / total) : 0;
      progressRef.current = progress;

      // Fade text out smoothly in second half of scroll
      if (textRef.current) {
        const op = progress < 0.42 ? 1 : Math.max(0, 1 - (progress - 0.42) / 0.22);
        textRef.current.style.opacity = String(op);
        textRef.current.style.transform = `translateY(${(1 - op) * 20}px)`;
      }

      // Scroll hint fades immediately
      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.12));
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative bg-carbon" style={{ height: "200vh" }}>
      <section className="sticky top-0 h-[100svh] bg-carbon text-bone overflow-hidden border-b border-carbon-border">

        {/* ── 3D Canvas — full bleed background ── */}
        <div className="absolute inset-0 z-0 opacity-90">
          <HeroCanvas progressRef={progressRef} />
        </div>

        {/* ── Soft cinematic scrim (Desktop: directional horizontal gradient, Mobile: top-weighted to protect text while leaving 3D model crisp & clear) ── */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(14,15,17,0.85) 0%, rgba(14,15,17,0.65) 32%, rgba(14,15,17,0.15) 50%, rgba(14,15,17,0.0) 100%)",
          }}
        />

        {/* Bottom subtle bleed matching manufacturing background */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 z-[1] pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(14,15,17,0.92) 0%, transparent 100%)",
          }}
        />

        {/* ── HTC-3.3 Periodic Scan Sweep Line ── */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden opacity-30">
          <div
            className="w-full h-px bg-gradient-to-r from-transparent via-accent-copper/40 to-transparent animate-scan"
            style={{
              animation: "scanSweep 7.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            }}
          />
        </div>

        {/* ── Foreground UI Layer ── */}
        <div className="relative z-10 h-full flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-[72px] sm:pt-24 pb-4 sm:pb-6 pointer-events-none box-border">

          {/* Upper Section: Narrative Copy & CTAs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 w-full min-h-0 pt-0">
            
            {/* Hero Text Content (Strictly top half on mobile, 46% width on desktop) */}
            <div
              ref={textRef}
              className={`pointer-events-auto w-full max-w-full lg:max-w-[46%] transition-all duration-1000 delay-300 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* Eyebrow badge */}
              <div className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-2 sm:mb-3 font-tech text-[10px] sm:text-xs text-accent-copper font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-accent-copper inline-block" />
                <span>{isRtl ? COPY.eyebrow.ar : COPY.eyebrow.en}</span>
              </div>

              {/* Title */}
              <h1
                className={`font-display text-bone uppercase leading-[0.92] tracking-tight drop-shadow-lg mb-5 ${
                  isRtl ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-arabic" : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                }`}
                style={{ whiteSpace: "pre-line" }}
              >
                {isRtl ? COPY.title.ar : COPY.title.en}
              </h1>

              {/* Description - 20px below Title */}
              <p className="text-accent-metal text-xs sm:text-sm leading-relaxed max-w-sm mb-6">
                {isRtl ? COPY.sub.ar : COPY.sub.en}
              </p>

              {/* CTAs - 24px below Description */}
              <div className="flex flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
                <Button href={`/${locale}/products`} locale={locale} variant="primary" world="carbon" className="text-xs px-4 py-3 sm:px-6 sm:py-3.5 font-bold flex-1 sm:flex-initial text-center justify-center">
                  {isRtl ? COPY.cta1.ar : COPY.cta1.en}
                </Button>
                <Button href={`/${locale}/contact`} locale={locale} variant="outline" world="carbon" className="text-xs px-4 py-3 sm:px-6 sm:py-3.5 font-bold flex-1 sm:flex-initial text-center justify-center">
                  {isRtl ? COPY.cta2.ar : COPY.cta2.en}
                </Button>
              </div>
            </div>

          </div>

          {/* Bottom Technical HUD & Scroll Indicator */}
          <div
            className={`flex items-center justify-between border-t border-carbon-border/40 pt-3 sm:pt-4 pointer-events-auto transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div className="font-tech text-[9px] sm:text-[10px] text-accent-metal/60 uppercase tracking-wider sm:tracking-widest truncate max-w-[62%] sm:max-w-[65%] font-medium">
              {isRtl ? COPY.spec.ar : COPY.spec.en}
            </div>
            <div
              ref={hintRef}
              className="font-tech text-[9px] sm:text-[10px] text-accent-copper uppercase tracking-wider sm:tracking-widest transition-opacity shrink-0 font-bold"
            >
              {isRtl ? COPY.scroll.ar : COPY.scroll.en}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


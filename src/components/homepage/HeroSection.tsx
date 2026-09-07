"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Locale } from "@/config/locales";
import Button from "@/components/ui/Button";

const HeroCanvas = dynamic(() => import("@/components/3d/HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-carbon flex items-center justify-center">
      <span className="font-tech text-[10px] tracking-widest text-accent-metal uppercase">
        INITIALIZING SCENE...
      </span>
    </div>
  ),
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
  const hudRef      = useRef<HTMLDivElement>(null);
  const hintRef     = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords]   = useState({ x: "001.300", y: "000.480", z: "000.000" });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);

    let raf: number;
    let tick = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      tick++;
      const wrap = wrapRef.current;
      if (!wrap) return;

      const rect     = wrap.getBoundingClientRect();
      const total    = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = total > 0 ? clamp01(scrolled / total) : 0;
      progressRef.current = progress;

      // Update real-time HUD CAD coordinates tied to camera breathing
      if (tick % 4 === 0) {
        const cx = (1.300 + Math.sin(tick * 0.02) * 0.012).toFixed(3);
        const cy = (0.480 + Math.cos(tick * 0.018) * 0.014).toFixed(3);
        const cz = (progress * 1.150).toFixed(3);
        setCoords({
          x: cx.padStart(7, "0"),
          y: cy.padStart(7, "0"),
          z: cz.padStart(7, "0"),
        });
      }

      // Fade text out smoothly in second half of scroll
      if (textRef.current) {
        const op = progress < 0.42 ? 1 : Math.max(0, 1 - (progress - 0.42) / 0.22);
        textRef.current.style.opacity = String(op);
        textRef.current.style.transform = `translateY(${(1 - op) * 20}px)`;
      }

      // HUD elements fade out as transition into Manufacturing completes
      if (hudRef.current) {
        const hudOp = progress < 0.75 ? 1 : Math.max(0, 1 - (progress - 0.75) / 0.15);
        hudRef.current.style.opacity = String(hudOp);
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

        {/* ── Soft cinematic scrim ── */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(14,15,17,0.78) 0%, rgba(14,15,17,0.48) 40%, rgba(14,15,17,0.14) 66%, rgba(14,15,17,0.0) 100%)",
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

        {/* ── Foreground HUD & Narrative Content ── */}
        <div className="relative z-10 h-full flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 sm:pt-20 pb-6 pointer-events-none">

          {/* Top technical bar with Live Status & System Metadata */}
          <div
            className={`flex items-center justify-between border-b border-carbon-border/40 pb-3 sm:pb-4 pointer-events-auto transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-copper opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-copper" />
              </span>
              <span className="font-tech text-[10px] tracking-widest text-accent-copper uppercase font-bold">
                {isRtl ? COPY.eyebrow.ar : COPY.eyebrow.en}
              </span>
              <span className="hidden sm:inline-block font-tech text-[9px] text-accent-metal/40 uppercase">
                | LIVE SPEC 2026.4
              </span>
            </div>

            <div className="flex items-center gap-4 font-tech text-[10px] tracking-widest text-accent-metal/60 uppercase">
              <span className="hidden md:inline-block">SYS-316L</span>
              <span className="hidden sm:inline-block">ISO 9001</span>
              <span className="text-accent-copper">±0.05 MM</span>
            </div>
          </div>

          {/* Center Area: Left H1 Narrative + Right HUD Floating Card */}
          <div className="my-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8 w-full min-h-0">
            
            {/* Hero Text Content */}
            <div
              ref={textRef}
              className={`pointer-events-auto max-w-full lg:max-w-[46%] transition-all duration-1000 delay-500 ease-out pt-24 sm:pt-32 lg:pt-0 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <h1
                className={`font-display text-bone uppercase leading-[0.92] tracking-tight drop-shadow-lg mb-4 sm:mb-6 ${
                  isRtl ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-arabic" : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                }`}
                style={{ whiteSpace: "pre-line" }}
              >
                {isRtl ? COPY.title.ar : COPY.title.en}
              </h1>
              <p className="text-accent-metal text-xs sm:text-sm leading-relaxed max-w-sm mb-6 sm:mb-8">
                {isRtl ? COPY.sub.ar : COPY.sub.en}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button href={`/${locale}/products`} locale={locale} variant="primary" world="carbon">
                  {isRtl ? COPY.cta1.ar : COPY.cta1.en}
                </Button>
                <Button href={`/${locale}/contact`} locale={locale} variant="outline" world="carbon">
                  {isRtl ? COPY.cta2.ar : COPY.cta2.en}
                </Button>
              </div>
            </div>

            {/* HTC-3.3 Engineering HUD Floating Card (Desktop Right Side / Mobile Compact) */}
            <div
              ref={hudRef}
              className={`pointer-events-auto transition-all duration-1000 delay-700 self-end lg:self-center w-full sm:w-auto ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="border border-carbon-border bg-carbon/80 backdrop-blur-sm p-3.5 sm:p-5 w-full sm:w-64 font-tech text-xs space-y-3 relative group select-none">
                
                {/* HUD Corner Measurement Brackets */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent-copper/70" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent-copper/70" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent-copper/70" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent-copper/70" />

                {/* Card Header & Identification */}
                <div className="flex items-center justify-between border-b border-carbon-border/60 pb-2">
                  <span className="text-[9px] text-accent-copper font-bold tracking-widest uppercase">
                    SPEC // CTK-HX-316
                  </span>
                  <span className="text-[9px] text-accent-metal/50">CAD ACTIVE</span>
                </div>

                {/* Technical Metric Attributes */}
                <div className="space-y-1.5 text-[10px] text-accent-metal">
                  <div className="flex justify-between">
                    <span className="text-accent-metal/60">MATERIAL:</span>
                    <span className="text-bone font-semibold">HOT ROLLED STEEL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-metal/60">FINISH:</span>
                    <span className="text-bone font-semibold">GALVANIZED HD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-metal/60">TOLERANCE:</span>
                    <span className="text-accent-copper font-bold">±0.05 MM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-metal/60">MASS:</span>
                    <span className="text-bone font-semibold">18.4 KG</span>
                  </div>
                </div>

                {/* Live Real-Time CAD Coordinates */}
                <div className="pt-2 border-t border-carbon-border/60 flex items-center justify-between text-[9px] text-accent-metal/60 font-mono">
                  <span>X: {coords.x}</span>
                  <span>Y: {coords.y}</span>
                  <span className="text-accent-copper">Z: {coords.z}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom technical footer bar */}
          <div
            className={`flex items-center justify-between border-t border-carbon-border/40 pt-3 sm:pt-4 pointer-events-auto transition-all duration-700 delay-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div className="font-tech text-[10px] text-accent-metal/50 uppercase tracking-widest">
              {isRtl ? COPY.spec.ar : COPY.spec.en}
            </div>
            <div
              ref={hintRef}
              className="font-tech text-[10px] text-accent-metal uppercase tracking-widest transition-opacity"
            >
              {isRtl ? COPY.scroll.ar : COPY.scroll.en}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


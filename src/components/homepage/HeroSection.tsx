"use client";

import React, { useEffect, useRef } from "react";
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
  const wrapRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);            // 0 → 1, read by HeroCanvas
  const textRef    = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const hintRef    = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    // Cinematic entrance delay synchronization
    const timer = setTimeout(() => setMounted(true), 150);

    let raf: number;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const wrap = wrapRef.current;
      if (!wrap) return;

      const rect    = wrap.getBoundingClientRect();
      const total   = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = total > 0 ? clamp01(scrolled / total) : 0;
      progressRef.current = progress;

      // Fade text out in bottom half of scroll
      if (textRef.current) {
        const op = progress < 0.45 ? 1 : Math.max(0, 1 - (progress - 0.45) / 0.2);
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
    /* 200vh gives the camera enough room to do its push-in without rushing */
    <div ref={wrapRef} className="relative bg-carbon" style={{ height: "200vh" }}>
      <section className="sticky top-0 h-[100svh] bg-carbon text-bone overflow-hidden border-b border-carbon-border">

        {/* ── 3D Canvas — full bleed background ── */}
        <div className="absolute inset-0 z-0 opacity-90">
          <HeroCanvas progressRef={progressRef} />
        </div>

        {/* ── Soft cinematic scrim — gives text high contrast while letting the 3D studio floor & lighting glow through ── */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(14,15,17,0.76) 0%, rgba(14,15,17,0.48) 38%, rgba(14,15,17,0.12) 64%, rgba(14,15,17,0.0) 100%)",
          }}
        />
        {/* Bottom subtle bleed */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 z-[1] pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(14,15,17,0.85) 0%, transparent 100%)",
          }}
        />

        {/* ── Foreground content ── */}
        <div className="relative z-10 h-full flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 sm:pt-20 pb-6 pointer-events-none">

          {/* Top bar */}
          <div
            className={`flex items-center justify-between border-b border-carbon-border/40 pb-3 sm:pb-4 pointer-events-auto transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            <span className="font-tech text-[10px] tracking-widest text-accent-copper uppercase">
              {isRtl ? COPY.eyebrow.ar : COPY.eyebrow.en}
            </span>
            <span className="hidden sm:block font-tech text-[10px] tracking-widest text-accent-metal/60 uppercase">
              {isRtl ? COPY.spec.ar : COPY.spec.en}
            </span>
          </div>

          {/* Hero text — left-aligned, max 44% width on desktop so it stays clear of the 3D object */}
          <div
            ref={textRef}
            className={`pointer-events-auto mt-auto mb-auto md:max-w-[44%] transition-all duration-1000 delay-500 ease-out ${
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

          {/* Bottom bar */}
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

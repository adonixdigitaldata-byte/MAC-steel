"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Locale } from "@/config/locales";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import Button from "@/components/ui/Button";
import { DisplayXL, BodyText } from "@/components/ui/Typography";

// Dynamically import WebGL HeroCanvas with ssr: false for client WebGL rendering
const HeroCanvas = dynamic(() => import("@/components/3d/HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-carbon flex items-center justify-center">
      <div className="font-tech text-xs text-accent-metal tracking-widest uppercase">
        INITIALIZING WEBGL SCENE...
      </div>
    </div>
  ),
});

interface HeroSectionProps {
  locale: Locale;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const isRtl = locale === "ar";

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen bg-carbon text-bone flex flex-col justify-between overflow-hidden border-b border-carbon-border">
      {/* Background 3D WebGL Scene Canvas - Placed in background atmosphere */}
      <div className="absolute inset-0 z-0 opacity-75 sm:opacity-85 pointer-events-none">
        <HeroCanvas />
      </div>

      {/* Foreground Mobile-First Art-Directed Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full pt-6 sm:pt-20 pb-8 flex-1 flex flex-col justify-between pointer-events-none">
        {/* Top Technical Annotation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pointer-events-auto border-b border-carbon-border/40 pb-3 sm:pb-4">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <NumberBadge number="01" world="carbon" />
            <TechnicalLabel variant="copper">
              {isRtl ? "أنظمة المواد / الهياكل الصلبة" : "MATERIAL SYSTEMS / STRUCTURE"}
            </TechnicalLabel>
          </div>
          <div className="hidden sm:block font-tech text-[10px] tracking-widest text-accent-metal uppercase">
            CAD-REF: SYS-316L / REVISED 2026
          </div>
        </div>

        {/* Center Asymmetric Headline Statement - Dominant Editorial Prominence */}
        <div className="my-auto py-8 sm:py-16 max-w-4xl pointer-events-auto">
          <DisplayXL className="mb-4 sm:mb-6 text-bone text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display uppercase tracking-tight leading-[0.95] drop-shadow-lg">
            {isRtl ? "مصممة للربط المتين." : "ENGINEERED TO CONNECT."}
          </DisplayXL>

          <BodyText className="max-w-xl text-accent-metal text-xs sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed">
            {isRtl
              ? "مكونات معدنية عالية الدقة وأنظمة هيكلية صلبة تم تصنيعها للتطبيقات الصناعية والبنية التحتية الحرجة."
              : "High-precision metal components, structural steel assemblies, and infrastructure systems built for heavy industrial environments."}
          </BodyText>

          {/* Mobile Vertical Button Stacking / Desktop Horizontal */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Button href={`/${locale}/products`} locale={locale} variant="primary" world="carbon" className="w-full sm:w-auto">
              {isRtl ? "استكشاف المنتجات" : "EXPLORE PRODUCTS"}
            </Button>
            <Button href={`/${locale}/contact`} locale={locale} variant="outline" world="carbon" className="w-full sm:w-auto">
              {isRtl ? "طلب استشارة هندسية" : "TECHNICAL INQUIRY"}
            </Button>
          </div>
        </div>

        {/* Bottom Technical Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto border-t border-carbon-border/40 pt-3 sm:pt-4 font-tech text-[10px] text-accent-metal uppercase">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span>SPECIFICATION: ISO 9001</span>
            <span className="hidden xs:inline">·</span>
            <span className="hidden xs:inline">TOLERANCE: ±0.05 MM</span>
          </div>
          <div>
            <span>SCROLL TO DISCOVER ↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}

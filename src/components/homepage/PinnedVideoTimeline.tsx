"use client";

import React, { useRef, useState, useEffect } from "react";
import { Locale } from "@/config/locales";
import Button from "@/components/ui/Button";

interface PinnedVideoTimelineProps {
  locale: Locale;
}

const CHAPTERS = [
  {
    id: 1,
    eyebrow: {
      en: "PRECISION STEEL SYSTEMS",
      ar: "أنظمة الصلب الدقيقة",
    },
    title: {
      en: "ENGINEERED\nFOR THE LOAD.",
      ar: "مصممة لتحمّل\nالأحمال.",
    },
    body: {
      en: "High-precision metal components and structural steel assemblies built for heavy industrial environments.",
      ar: "مكونات معدنية عالية الدقة وهياكل فولاذية مبنية للتطبيقات الصناعية الثقيلة.",
    },
    hasButtons: true,
  },
  {
    id: 2,
    eyebrow: {
      en: "MATERIAL / STOCK",
      ar: "المواد / المخزون",
    },
    title: {
      en: "RAW STEEL.\nCERTIFIED.",
      ar: "صلب خام.\nمعتمد.",
    },
    body: {
      en: "Mill-certified flat bar, angle, and rod stock—every batch traceable to the heat number.",
      ar: "مخزون القضبان المسطحة والزوايا والقضبان المعتمد من المصنع — كل دفعة قابلة للتتبع حتى رقم الصهر.",
    },
    hasButtons: false,
  },
  {
    id: 3,
    eyebrow: {
      en: "MACHINING / TOLERANCE",
      ar: "التصنيع / الدقة",
    },
    title: {
      en: "CUT TO\n±0.05 MM.",
      ar: "قطع بدقة\n±0.05 مم.",
    },
    body: {
      en: "Every bar is machined against the drawing before becoming a finished component.",
      ar: "يتم تشغيل كل قضيب وفق المخطط الهندسي قبل أن يصبح جزءاً نهائياً.",
    },
    hasButtons: false,
  },
  {
    id: 4,
    eyebrow: {
      en: "FABRICATION / FORM",
      ar: "التصنيع / التشكيل",
    },
    title: {
      en: "FORMED FOR\nTHE LOAD.",
      ar: "مشكّلة لتحمل\nالأحمال.",
    },
    body: {
      en: "Steel transforms into angle frames, threaded rods, and anchors.",
      ar: "يتحول الفولاذ إلى إطارات زوايا وقضبان ملولبة ومرابط رسو متينة.",
    },
    hasButtons: false,
  },
  {
    id: 5,
    eyebrow: {
      en: "FINISHING / COATING",
      ar: "التشطيب / الطلاء",
    },
    title: {
      en: "FINISHED\nTO SPEC.",
      ar: "تشطيب حسب\nالمواصفات.",
    },
    body: {
      en: "Hot-dip galvanizing or epoxy coating based on real site conditions.",
      ar: "جلفنة بالغمس الساخن أو طلاء بالإيبوكسي وفق ظروف الموقع الفعلية.",
    },
    hasButtons: false,
  },
  {
    id: 6,
    eyebrow: {
      en: "ASSEMBLY / SITE",
      ar: "التجميع / الموقع",
    },
    title: {
      en: "BUILT INTO THE\nSTRUCTURE.",
      ar: "مدمجة في\nالهيكل.",
    },
    body: {
      en: "Every component becomes part of a much larger engineering catalogue.",
      ar: "يصبح كل مكون جزءاً لا يتجزأ من كتالوج هندسي شامل ومتكامل.",
    },
    hasButtons: false,
  },
];

const BUTTON_COPY = {
  cta1: { en: "EXPLORE PRODUCTS", ar: "استكشاف المنتجات" },
  cta2: { en: "TECHNICAL INQUIRY", ar: "طلب استشارة هندسية" },
  spec: { en: "ISO 9001  ·  TOLERANCE ±0.05 MM  ·  SYS-316L", ar: "ISO 9001  ·  تفاوت ±0.05 مم  ·  SYS-316L" },
  scroll: { en: "SCROLL TO EXPLORE ↓", ar: "مرر للاستكشاف ↓" },
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export default function PinnedVideoTimeline({ locale }: PinnedVideoTimelineProps) {
  const isRtl = locale === "ar";
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railFillRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(handleScroll);
      const wrap = wrapperRef.current;
      if (!wrap) return;

      const rect = wrap.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = totalScrollable > 0 ? clamp01(scrolled / totalScrollable) : 0;
      const numChapters = CHAPTERS.length; // 6

      // Update vertical progress rail
      if (railFillRef.current) {
        railFillRef.current.style.height = `${progress * 100}%`;
      }

      // Map progress across the 6 chapters (0 -> 5)
      const mappedPos = progress * (numChapters - 1);
      const currentChapterIdx = Math.min(numChapters - 1, Math.round(mappedPos));
      setActiveIdx((prev) => (prev === currentChapterIdx ? prev : currentChapterIdx));

      // Continuous interpolation for all 6 absolutely positioned chapter cards
      // Outgoing: y 0 -> -48px, opacity 1 -> 0, scale 1 -> 0.97
      // Incoming: y 56px -> 0, opacity 0 -> 1, scale 0.97 -> 1
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        const diff = mappedPos - i;
        let op = 0;
        let translateY = 56;
        let scale = 0.97;

        if (Math.abs(diff) < 0.85) {
          const factor = Math.max(0, 1 - Math.abs(diff) / 0.85);
          // Smooth ease curve
          const eased = factor * factor * (3 - 2 * factor);
          op = eased;

          if (diff >= 0) {
            // Outgoing upward
            const exitProgress = diff / 0.85;
            translateY = -48 * exitProgress;
            scale = 1 - 0.03 * exitProgress;
          } else {
            // Incoming from below
            const enterProgress = 1 - Math.abs(diff) / 0.85;
            translateY = 56 * (1 - enterProgress);
            scale = 0.97 + 0.03 * enterProgress;
          }
        } else {
          op = 0;
          translateY = diff > 0 ? -48 : 56;
          scale = 0.97;
        }

        card.style.opacity = String(op);
        card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        card.style.pointerEvents = op > 0.5 ? "auto" : "none";
      });

      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.12));
      }
    };

    rafId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="block md:hidden bg-black w-full max-w-full"
      style={{ height: "600vh", position: "relative" }}
    >
      {/* Pinned 100svh Sticky Stage */}
      <div
        className="w-full max-w-full bg-black text-bone flex flex-col justify-between select-none box-border"
        style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden" }}
      >
        
        {/* ONE Full-bleed background video that never unmounts and never changes src */}
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-center transform-gpu"
            poster="/hero-factory-1.jpg"
          >
            <source src="/mobilevideo.mp4" type="video/mp4" />
          </video>
        </div>

        {/* High-contrast gradient scrim overlays */}
        <div
          className="absolute inset-x-0 top-0 h-[40%] z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,11,13,0.96) 0%, rgba(10,11,13,0.70) 50%, rgba(10,11,13,0.0) 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(10,11,13,0.98) 0%, rgba(10,11,13,0.88) 44%, rgba(10,11,13,0.48) 70%, rgba(10,11,13,0.0) 100%)",
          }}
        />

        {/* Floating UI Layer Over Sticky Video */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between px-6 pt-[78px] pb-6 pointer-events-none box-border max-w-full">
          
          {/* Top Status Bar & Chapter Progress HUD */}
          <div className="w-full flex items-center justify-between pointer-events-auto">
            <div className="inline-flex items-center gap-1.5 font-tech text-[9px] text-accent-copper bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-sm border border-carbon-border/60 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold tracking-wider uppercase">
                {isRtl ? "مصنع جدة الميداني" : "JEDDAH PLANT LIVE"}
              </span>
            </div>

            {/* Editorial Chapter Indicator Strip */}
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-sm border border-carbon-border/60 shadow-sm">
              <div className="relative w-10 h-1 bg-carbon-border/80 rounded-full overflow-hidden">
                <div
                  ref={railFillRef}
                  className="absolute top-0 left-0 bottom-0 bg-accent-copper transition-all duration-75"
                  style={{ width: "0%" }}
                />
              </div>
              <span className="font-tech text-[9px] text-accent-copper font-bold tracking-widest">
                0{activeIdx + 1} / 0{CHAPTERS.length}
              </span>
            </div>
          </div>

          {/* Central Absolutely Positioned Story Chapters */}
          <div className="relative w-full my-auto min-h-[320px] flex items-center max-w-[92%] mx-auto">
            {CHAPTERS.map((chapter, idx) => (
              <div
                key={chapter.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center pointer-events-none transform-gpu will-change-transform"
                style={{
                  opacity: idx === 0 ? 1 : 0,
                  transform: idx === 0 ? "translate3d(0, 0px, 0) scale(1)" : "translate3d(0, 56px, 0) scale(0.97)",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Eyebrow */}
                <div className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-2.5 font-tech text-[10px] text-accent-copper font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 bg-accent-copper inline-block shrink-0" />
                  <span>{isRtl ? chapter.eyebrow.ar : chapter.eyebrow.en}</span>
                </div>

                {/* Headline */}
                <h1
                  className={`font-display text-bone uppercase leading-[0.94] tracking-tight drop-shadow-md mb-3.5 ${
                    isRtl ? "text-3xl font-arabic" : "text-3xl xs:text-4xl"
                  }`}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {isRtl ? chapter.title.ar : chapter.title.en}
                </h1>

                {/* Body */}
                <p className="text-accent-metal text-xs sm:text-sm leading-relaxed max-w-sm mb-6 font-body drop-shadow">
                  {isRtl ? chapter.body.ar : chapter.body.en}
                </p>

                {/* Story 1 CTAs ONLY */}
                {chapter.hasButtons && (
                  <div className="flex flex-row gap-2.5 w-full pointer-events-auto">
                    <Button
                      href={`/${locale}/products`}
                      locale={locale}
                      variant="primary"
                      world="carbon"
                      className="text-xs px-4 py-3 font-bold flex-1 text-center justify-center min-h-[44px]"
                    >
                      {isRtl ? BUTTON_COPY.cta1.ar : BUTTON_COPY.cta1.en}
                    </Button>
                    <Button
                      href={`/${locale}/contact`}
                      locale={locale}
                      variant="outline"
                      world="carbon"
                      className="text-xs px-4 py-3 font-bold flex-1 text-center justify-center min-h-[44px] bg-black/40 backdrop-blur-sm"
                    >
                      {isRtl ? BUTTON_COPY.cta2.ar : BUTTON_COPY.cta2.en}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom HUD & Scroll Indicator */}
          <div className="flex items-center justify-between border-t border-carbon-border/60 pt-3.5 pointer-events-auto">
            <div className="font-tech text-[9px] text-accent-metal/70 uppercase tracking-wider truncate max-w-[60%] font-medium">
              {isRtl ? BUTTON_COPY.spec.ar : BUTTON_COPY.spec.en}
            </div>
            <div
              ref={hintRef}
              className="font-tech text-[9px] text-accent-copper uppercase tracking-wider transition-opacity shrink-0 font-bold flex items-center gap-1"
            >
              <span>{isRtl ? BUTTON_COPY.scroll.ar : BUTTON_COPY.scroll.en}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

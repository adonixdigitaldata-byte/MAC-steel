"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Locale } from "@/config/locales";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import Button from "@/components/ui/Button";
import { DisplayXL, DisplayL, BodyText } from "@/components/ui/Typography";

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

/* ------------------------------------------------------------
   Five real manufacturing stages — mirrors ACT_COUNT in
   MaterialJourneyScene.tsx. Keep both in sync if stages change.
   ------------------------------------------------------------ */
const STAGES = [
  {
    n: "01",
    eyebrow: { en: "MATERIAL SYSTEMS / STRUCTURE", ar: "أنظمة المواد / الهياكل الصلبة" },
    title: { en: "ENGINEERED TO CONNECT.", ar: "مصممة للربط المتين." },
    body: {
      en: "High-precision metal components, structural steel assemblies, and infrastructure systems built for heavy industrial environments.",
      ar: "مكونات معدنية عالية الدقة وأنظمة هيكلية صلبة تم تصنيعها للتطبيقات الصناعية والبنية التحتية الحرجة.",
    },
    showCta: true,
  },
  {
    n: "02",
    eyebrow: { en: "MACHINING / TOLERANCE", ar: "التصنيع / الدقة" },
    title: { en: "CUT TO ±0.05MM.", ar: "قطع بدقة ±0.05 مم." },
    body: {
      en: "Every bar is sawn and machined against the drawing before it becomes anything else — tolerance checked, not assumed.",
      ar: "يتم قطع وتشغيل كل قضيب وفق المخطط قبل تشكيله — يتم التحقق من الدقة وليس افتراضها.",
    },
    showCta: false,
  },
  {
    n: "03",
    eyebrow: { en: "FABRICATION / FORM", ar: "التصنيع / التشكيل" },
    title: { en: "FORMED FOR THE LOAD.", ar: "مشكّلة لتحمل الأحمال." },
    body: {
      en: "The same certified stock becomes an angle frame, a threaded rod, or an anchor — shaped for the connection it will carry.",
      ar: "يتحول نفس الخام المعتمد إلى إطار زاوية أو قضيب ملولب أو مرساة — وفق الاتصال الذي سيحمله.",
    },
    showCta: false,
  },
  {
    n: "04",
    eyebrow: { en: "FINISHING / COATING", ar: "التشطيب / الطلاء" },
    title: { en: "FINISHED TO SPEC.", ar: "تشطيب حسب المواصفات." },
    body: {
      en: "Hot-dip galvanizing or epoxy coating, selected for the site conditions the part actually has to survive.",
      ar: "طلاء بالجلفنة الساخنة أو الإيبوكسي، يتم اختياره وفق ظروف الموقع التي يجب أن يتحملها الجزء.",
    },
    showCta: false,
  },
  {
    n: "05",
    eyebrow: { en: "ASSEMBLY / SITE", ar: "التجميع / الموقع" },
    title: { en: "BUILT INTO THE STRUCTURE.", ar: "مدمجة في الهيكل." },
    body: {
      en: "Every component locks into the assembly it was engineered for — one part of a much larger catalogue.",
      ar: "يتم تركيب كل مكون في التجميع الذي صُمم من أجله — جزء من كتالوج أوسع بكثير.",
    },
    showCta: false,
  },
];
const ACT_COUNT = STAGES.length;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const isRtl = locale === "ar";
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railFillRef = useRef<HTMLDivElement>(null);
  const railDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const raw = total > 0 ? scrolled / total : 0;
      const progress = clamp01(raw) * ACT_COUNT;
      progressRef.current = progress;

      const idx = Math.min(ACT_COUNT - 1, Math.floor(progress));
      setActiveIdx((prev) => (prev === idx ? prev : idx));

      textRefs.current.forEach((el, i) => {
        if (!el) return;
        let op: number;
        if (i === 0) {
          const fadeStart = 1.0;
          const fadeEnd = 1.55;
          op =
            progress <= fadeStart
              ? 1
              : Math.max(
                  0,
                  1 - (progress - fadeStart) / (fadeEnd - fadeStart)
                );
        } else if (i === ACT_COUNT - 1) {
          const fadeStart = ACT_COUNT - 1 - 0.55;
          op =
            progress >= ACT_COUNT - 1
              ? 1
              : Math.max(
                  0,
                  1 - Math.abs(progress - (ACT_COUNT - 0.5)) / 0.55
                );
        } else {
          const d = Math.abs(progress - (i + 0.5));
          op = Math.max(0, 1 - d / 0.55);
        }
        el.style.opacity = String(op);
        el.style.transform = `translateY(${(1 - op) * 18}px)`;
        el.style.pointerEvents = op > 0.6 ? "auto" : "none";
      });

      if (railFillRef.current) railFillRef.current.style.height = `${(progress / ACT_COUNT) * 100}%`;
      railDotRefs.current.forEach((d, i) => d?.classList.toggle("opacity-100", i <= idx));
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.2));
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = STAGES[activeIdx];

  return (
    <div ref={wrapRef} className="relative bg-carbon" style={{ height: `${ACT_COUNT * 130}vh` }}>
      <section className="sticky top-0 h-[100svh] bg-carbon text-bone flex flex-col justify-between overflow-hidden border-b border-carbon-border">
        {/* Background 3D scene — pinned, driven entirely by scroll progress */}
        <div className="absolute inset-0 z-0 opacity-80 sm:opacity-90 pointer-events-none">
          <HeroCanvas progressRef={progressRef} />
        </div>



        {/* Process rail — signature element, pinned for the whole journey */}
        <div className="hidden md:flex absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 z-[3] items-stretch gap-3 h-56">
          <div className="relative w-px bg-carbon-border">
            <div ref={railFillRef} className="absolute top-0 left-0 w-full bg-accent-copper transition-[height] duration-100" style={{ height: "0%" }} />
          </div>
          <div className="flex flex-col justify-between">
            {STAGES.map((s, i) => (
              <div key={s.n} className="flex items-center gap-2.5">
                <span
                  ref={(el) => { railDotRefs.current[i] = el; }}
                  className="w-1.5 h-1.5 rounded-full bg-carbon-border opacity-40 transition-opacity duration-300"
                />
                <span className={`font-tech text-[10px] tracking-widest transition-colors duration-300 ${i === activeIdx ? "text-bone" : "text-accent-metal/50"}`}>
                  {s.n}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Foreground content */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full pt-6 sm:pt-20 pb-8 flex-1 flex flex-col justify-between pointer-events-none">
          {/* Top technical bar — reflects current stage */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pointer-events-auto border-b border-carbon-border/40 pb-3 sm:pb-4">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <NumberBadge number={active.n} world="carbon" />
              <TechnicalLabel variant="copper">{isRtl ? active.eyebrow.ar : active.eyebrow.en}</TechnicalLabel>
            </div>
            <div className="hidden sm:block font-tech text-[10px] tracking-widest text-accent-metal uppercase">
              CAD-REF: SYS-316L / REVISED 2026
            </div>
          </div>

          {/* Act text — anchored to the same left safe-zone the whole way through */}
          <div className="my-auto py-8 sm:py-16 relative min-h-[260px] sm:min-h-[320px]">
            {STAGES.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => { textRefs.current[i] = el; }}
                className="absolute inset-0 max-w-lg sm:max-w-xl pointer-events-none opacity-0"
              >
                {i === 0 ? (
                  <DisplayXL className="mb-3 sm:mb-5 text-bone text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight leading-[0.95] drop-shadow-lg">
                    {isRtl ? s.title.ar : s.title.en}
                  </DisplayXL>
                ) : (
                  <DisplayL className="mb-3 sm:mb-4 text-bone text-2xl xs:text-3xl sm:text-4xl font-display uppercase tracking-tight leading-[0.98] drop-shadow-lg">
                    {isRtl ? s.title.ar : s.title.en}
                  </DisplayL>
                )}
                <BodyText className="max-w-sm text-accent-metal text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6">
                  {isRtl ? s.body.ar : s.body.en}
                </BodyText>
                {s.showCta && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pointer-events-auto">
                    <Button href={`/${locale}/products`} locale={locale} variant="primary" world="carbon" className="w-full sm:w-auto">
                      {isRtl ? "استكشاف المنتجات" : "EXPLORE PRODUCTS"}
                    </Button>
                    <Button href={`/${locale}/contact`} locale={locale} variant="outline" world="carbon" className="w-full sm:w-auto">
                      {isRtl ? "طلب استشارة هندسية" : "TECHNICAL INQUIRY"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom technical bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto border-t border-carbon-border/40 pt-3 sm:pt-4 font-tech text-[10px] text-accent-metal uppercase">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <span>SPECIFICATION: ISO 9001</span>
              <span className="hidden xs:inline">·</span>
              <span className="hidden xs:inline">TOLERANCE: ±0.05 MM</span>
            </div>
            <div ref={hintRef} className="transition-opacity duration-300">
              <span>SCROLL TO DISCOVER ↓</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

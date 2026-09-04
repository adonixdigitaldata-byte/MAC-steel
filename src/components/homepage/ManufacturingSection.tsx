"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, BrightnessContrast } from "@react-three/postprocessing";
import * as THREE from "three";
import { Locale } from "@/config/locales";
import { ACT_COUNT } from "@/components/3d/ManufacturingScene";

/* -----------------------------------------------------------------------
   ManufacturingSection — the 5-stage scroll-driven manufacturing journey.
   Full-bleed 3D canvas background (so text shares the 3D studio background
   seamlessly), rail on the left, stage cards with continuous smooth
   cross-fade (zero overlapping text), and high-end industrial finish.
   ----------------------------------------------------------------------- */

const ManufacturingScene = dynamic(
  () => import("@/components/3d/ManufacturingScene"),
  { ssr: false, loading: () => null }
);

interface ManufacturingSectionProps {
  locale: Locale;
}

const STAGES = [
  {
    n: "01",
    eyebrow: { en: "MATERIAL / STOCK",     ar: "المواد / المخزون" },
    title:   { en: "RAW STEEL.\nCERTIFIED.", ar: "صلب خام.\nمعتمد." },
    body: {
      en: "Mill-certified flat bar, angle, and rod stock — every batch traceable to the heat number before it enters the line.",
      ar: "مخزون القضبان المسطحة والزوايا والقضبان المعتمد من المصنع — كل دفعة قابلة للتتبع حتى رقم الصهر قبل دخولها الخط.",
    },
  },
  {
    n: "02",
    eyebrow: { en: "MACHINING / TOLERANCE", ar: "التصنيع / الدقة" },
    title:   { en: "CUT TO\n±0.05 MM.",     ar: "قطع بدقة\n±0.05 مم." },
    body: {
      en: "Every bar is sawn and machined against the drawing before it becomes anything else — tolerance checked, not assumed.",
      ar: "يتم قطع وتشغيل كل قضيب وفق المخطط قبل تشكيله — يتم التحقق من الدقة وليس افتراضها.",
    },
  },
  {
    n: "03",
    eyebrow: { en: "FABRICATION / FORM",    ar: "التصنيع / التشكيل" },
    title:   { en: "FORMED FOR\nTHE LOAD.", ar: "مشكّلة لتحمل\nالأحمال." },
    body: {
      en: "The same certified stock becomes an angle frame, a threaded rod, or an anchor — shaped for the connection it will carry.",
      ar: "يتحول نفس الخام المعتمد إلى إطار زاوية أو قضيب ملولب أو مرساة — وفق الاتصال الذي سيحمله.",
    },
  },
  {
    n: "04",
    eyebrow: { en: "FINISHING / COATING",   ar: "التشطيب / الطلاء" },
    title:   { en: "FINISHED\nTO SPEC.",    ar: "تشطيب حسب\nالمواصفات." },
    body: {
      en: "Hot-dip galvanizing or epoxy coating, selected for the site conditions the part actually has to survive.",
      ar: "طلاء بالجلفنة الساخنة أو الإيبوكسي، يتم اختياره وفق ظروف الموقع التي يجب أن يتحملها الجزء.",
    },
  },
  {
    n: "05",
    eyebrow: { en: "ASSEMBLY / SITE",        ar: "التجميع / الموقع" },
    title:   { en: "BUILT INTO THE\nSTRUCTURE.", ar: "مدمجة في\nالهيكل." },
    body: {
      en: "Every component locks into the assembly it was engineered for — one part of a much larger catalogue.",
      ar: "يتم تركيب كل مكون في التجميع الذي صُمم من أجله — جزء من كتالوج أوسع بكثير.",
    },
  },
];

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

// Isolated R3F Canvas component
function MfgCanvas({
  progressRef,
  isMobile,
  reducedMotion,
}: {
  progressRef: React.MutableRefObject<number>;
  isMobile: boolean;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{ position: [2.0, 1.3, 5.6], fov: isMobile ? 46 : 36, near: 0.5, far: 35 }}
      gl={{
        antialias: !isMobile,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      shadows={!isMobile}
      className="w-full h-full"
    >
      <color attach="background" args={["#0e0f11"]} />
      <React.Suspense fallback={null}>
        <ManufacturingScene
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
        {!reducedMotion && !isMobile && (
          <EffectComposer multisampling={4} enableNormalPass={false}>
            {/* Raised luminanceThreshold so metal doesn't blow out into white */}
            <Bloom luminanceThreshold={0.72} luminanceSmoothing={0.3} intensity={0.55} mipmapBlur />
            <BrightnessContrast brightness={0} contrast={0.05} />
            <Vignette eskil={false} offset={0.25} darkness={0.45} />
          </EffectComposer>
        )}
      </React.Suspense>
    </Canvas>
  );
}

export default function ManufacturingSection({ locale }: ManufacturingSectionProps) {
  const isRtl = locale === "ar";

  const wrapRef     = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const railFillRef = useRef<HTMLDivElement>(null);
  const railDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIdx,     setActiveIdx]     = useState(0);
  const [isMobile,      setIsMobile]      = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted,       setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMq);

    return () => {
      window.removeEventListener("resize", checkMobile);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const wrap = wrapRef.current;
      if (!wrap) return;

      const rect     = wrap.getBoundingClientRect();
      const total    = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const raw      = total > 0 ? clamp01(scrolled / total) : 0;
      const progress = raw * ACT_COUNT;
      progressRef.current = progress;

      const idx = Math.min(ACT_COUNT - 1, Math.floor(progress));
      setActiveIdx((prev) => prev === idx ? prev : idx);

      // Rail progress fill
      if (railFillRef.current) {
        railFillRef.current.style.height = `${(progress / ACT_COUNT) * 100}%`;
      }
      railDotRefs.current.forEach((d, i) => {
        if (!d) return;
        d.classList.toggle("opacity-100", i <= idx);
        d.classList.toggle("bg-accent-copper", i <= idx);
        d.classList.toggle("bg-carbon-border", i > idx);
      });

      // Continuous, butter-smooth crossfade for each stage card
      // Guaranteed zero text collisions
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        let op = 0;
        if (i === 0) {
          op = progress <= 0.85 ? 1 : Math.max(0, 1 - (progress - 0.85) / 0.45);
        } else if (i === ACT_COUNT - 1) {
          op = progress >= ACT_COUNT - 1 ? 1 : Math.max(0, 1 - (ACT_COUNT - 0.55 - progress) / 0.45);
        } else {
          const d = Math.abs(progress - (i + 0.5));
          op = Math.max(0, 1 - d / 0.50);
        }
        el.style.opacity = String(op);
        el.style.transform = `translateY(${(1 - op) * 14}px)`;
        el.style.pointerEvents = op > 0.5 ? "auto" : "none";
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrapRef} className="relative bg-carbon" style={{ height: `${ACT_COUNT * 120}vh` }}>
      <section className="sticky top-0 h-[100svh] bg-[#0e0f11] text-bone overflow-hidden border-b border-carbon-border">

        {/* ── Full bleed 3D canvas background — text sits directly over the 3D scene ── */}
        <div className="absolute inset-0 z-0">
          {mounted && (
            <MfgCanvas
              progressRef={progressRef}
              isMobile={isMobile}
              reducedMotion={reducedMotion}
            />
          )}
        </div>

        {/* ── Soft cinematic scrim — lets 3D background glow through while ensuring crisp text contrast ── */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(14,15,17,0.72) 0%, rgba(14,15,17,0.40) 38%, rgba(14,15,17,0.08) 64%, rgba(14,15,17,0.0) 100%)",
          }}
        />
        {/* Top and bottom subtle vignettes */}
        <div
          className="absolute top-0 left-0 right-0 h-20 z-[1] pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(14,15,17,0.8) 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-20 z-[1] pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(14,15,17,0.85) 0%, transparent 100%)",
          }}
        />

        {/* ── Foreground content overlay ── */}
        <div className="relative z-10 h-full flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 sm:pt-16 pb-6 pointer-events-none">

          {/* Top technical bar */}
          <div className="flex items-center justify-between border-b border-carbon-border/40 pb-3 sm:pb-4 pointer-events-auto">
            <span className="font-tech text-[10px] tracking-widest text-accent-copper uppercase">
              {isRtl ? "رحلة التصنيع / نظام المواد" : "MANUFACTURING JOURNEY / MATERIAL SYSTEMS"}
            </span>
            <span className="font-tech text-[10px] tracking-widest text-accent-metal/50 uppercase hidden sm:block">
              {isRtl ? "5 مراحل إنتاجية" : "5 PRODUCTION STAGES"}
            </span>
          </div>

          {/* ── Middle: Rail + Stage Cards (physically separated with generous margins) ── */}
          <div className="my-auto flex items-center w-full">

            {/* Side rail — strictly locked to left, isolated from cards */}
            <div className="hidden md:flex flex-col items-center mr-8 lg:mr-12 rtl:mr-0 rtl:ml-8 lg:rtl:ml-12 h-64 justify-between relative pointer-events-auto">
              <div className="relative w-px h-full bg-carbon-border">
                <div
                  ref={railFillRef}
                  className="absolute top-0 left-0 w-full bg-accent-copper transition-all duration-75"
                  style={{ height: "0%" }}
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none -left-2.5 rtl:-left-auto rtl:-right-2.5">
                {STAGES.map((s, i) => (
                  <div key={s.n} className="flex items-center gap-2.5">
                    <span
                      ref={(el) => { railDotRefs.current[i] = el; }}
                      className="w-1.5 h-1.5 rounded-full bg-carbon-border opacity-40 transition-all duration-300"
                    />
                    <span className={`font-tech text-[10px] tracking-widest transition-colors duration-300 ${i === activeIdx ? "text-bone font-bold" : "text-accent-metal/40"}`}>
                      {s.n}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage cards container — explicit height and max-width so text never spills or overlaps */}
            <div className="relative flex-1 max-w-lg min-h-[260px] sm:min-h-[300px] flex items-center">
              {STAGES.map((s, i) => (
                <div
                  key={s.n}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="absolute inset-0 flex flex-col justify-center pointer-events-none"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    transform: i === 0 ? "translateY(0)" : "translateY(14px)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3 pointer-events-auto">
                    <span className="font-tech text-[9px] tracking-widest text-accent-copper uppercase border border-accent-copper/35 px-2.5 py-0.5 rounded-sm">
                      {isRtl ? s.eyebrow.ar : s.eyebrow.en}
                    </span>
                  </div>
                  <h2
                    className={`font-display text-bone uppercase leading-[0.92] tracking-tight mb-4 drop-shadow-md ${
                      isRtl
                        ? "text-3xl sm:text-4xl md:text-5xl font-arabic"
                        : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {isRtl ? s.title.ar : s.title.en}
                  </h2>
                  <p className="text-accent-metal text-xs sm:text-sm leading-relaxed max-w-sm">
                    {isRtl ? s.body.ar : s.body.en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom technical bar */}
          <div className="flex items-center justify-between border-t border-carbon-border/40 pt-3 sm:pt-4 pointer-events-auto font-tech text-[10px] text-accent-metal/50 uppercase tracking-widest">
            <span>
              {isRtl ? "المعيار: ISO 9001 · التفاوت: ±0.05 مم" : "SPEC: ISO 9001  ·  TOLERANCE: ±0.05 MM"}
            </span>
            <span className="text-accent-copper font-bold">
              {STAGES[activeIdx]?.n} / {String(ACT_COUNT).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

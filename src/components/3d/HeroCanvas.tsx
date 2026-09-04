"use client";

import React, { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  BrightnessContrast,
} from "@react-three/postprocessing";
import * as THREE from "three";
import HeroScene from "./HeroScene";

/* -----------------------------------------------------------------------
   HeroCanvas — Master Phase 2 & 3 Implementation.
   - 840px portrait mobile/tablet breakpoint for dedicated composition.
   - Offscreen RAF Pause (IntersectionObserver) to eliminate idle GPU load.
   - Mobile-optimized DPR and conditional post-processing.
   ----------------------------------------------------------------------- */

interface HeroCanvasProps {
  progressRef: React.MutableRefObject<number>;
}

export default function HeroCanvas({ progressRef }: HeroCanvasProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Accessibility check
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    // Phase 3 Breakpoint: 840px (clean portrait tablet & mobile boundary)
    const checkViewport = () => setIsMobile(window.innerWidth < 840);
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });

    // Phase 3 Performance: Offscreen Intersection Observer (pause rendering when scrolled away)
    const el = containerRef.current;
    if (el && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { root: null, rootMargin: "100px", threshold: 0 }
      );
      observer.observe(el);
      return () => {
        observer.disconnect();
        mq.removeEventListener("change", onChange);
        window.removeEventListener("resize", checkViewport);
      };
    }

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 select-none pointer-events-none">
      <Canvas
        frameloop={isVisible ? "always" : "never"}
        dpr={[1, isMobile ? 1.25 : 2]}
        camera={{
          position: [1.2, 1.41, 7.51],
          fov: isMobile ? 42 : 35,
          near: 0.5,
          far: 40,
        }}
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
          <HeroScene
            progressRef={progressRef}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
          />

          {/* Post-processing — desktop only with refined non-clipping bloom */}
          {!reducedMotion && !isMobile && (
            <EffectComposer multisampling={4} enableNormalPass={false}>
              <Bloom
                luminanceThreshold={0.72}
                luminanceSmoothing={0.25}
                intensity={0.35}
                mipmapBlur
              />
              <BrightnessContrast brightness={0} contrast={0.04} />
              <Vignette eskil={false} offset={0.28} darkness={0.42} />
            </EffectComposer>
          )}
        </React.Suspense>
      </Canvas>
    </div>
  );
}


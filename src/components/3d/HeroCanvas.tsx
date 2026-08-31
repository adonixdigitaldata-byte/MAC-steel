"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import MaterialJourneyScene from "./MaterialJourneyScene";

interface HeroCanvasProps {
  progressRef: React.MutableRefObject<number>;
}

export default function HeroCanvas({ progressRef }: HeroCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    if (motionQuery.addEventListener) motionQuery.addEventListener("change", handleMotionChange);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      if (motionQuery.removeEventListener) motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-carbon flex items-center justify-center">
        <div className="font-tech text-xs text-accent-metal tracking-widest uppercase">
          INITIALIZING WEBGL SCENE...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative select-none pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, isMobile ? 0.4 : 0.6, isMobile ? 8.5 : 7.2], fov: isMobile ? 42 : 36 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        shadows
        className="w-full h-full"
      >
        <MaterialJourneyScene progressRef={progressRef} reducedMotion={reducedMotion} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}

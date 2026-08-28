"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import SteelStructure from "./SteelStructure";
import SceneLighting from "./SceneLighting";
import SceneCamera from "./SceneCamera";

export default function HeroCanvas() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", handleMotionChange);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", handleMotionChange);
      }
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
        camera={{ position: [0, isMobile ? 0.2 : 0, isMobile ? 6.2 : 5.2], fov: isMobile ? 48 : 45 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <SceneLighting />
        <SceneCamera reducedMotion={reducedMotion} isMobile={isMobile} />
        <SteelStructure reducedMotion={reducedMotion} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}

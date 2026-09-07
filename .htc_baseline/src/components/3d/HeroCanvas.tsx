"use client";

import React, { useEffect, useState } from "react";
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
   HeroCanvas — wraps the R3F canvas for the cinematic hero reveal.

   Layout strategy (replacing camera.setViewOffset):
   - On desktop the canvas div spans the full viewport (absolute inset-0)
     but the 3D object in HeroScene is translated to PIVOT_X = +0.6 in
     world-space, which naturally shifts it right-of-center.
   - Text lives in HeroSection.tsx in a normal DOM layer on the left.
   - This avoids the aggressive frustum crop that setViewOffset caused.
   ----------------------------------------------------------------------- */

interface HeroCanvasProps {
  progressRef: React.MutableRefObject<number>;
}

export default function HeroCanvas({ progressRef }: HeroCanvasProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className="absolute inset-0 select-none pointer-events-none">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{
          position: [1.2, 1.41, 7.51],
          fov: isMobile ? 44 : 35,
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

          {/* Post-processing — desktop only for performance */}
          {!reducedMotion && !isMobile && (
            <EffectComposer multisampling={4} enableNormalPass={false}>
              <Bloom
                luminanceThreshold={0.65}
                luminanceSmoothing={0.3}
                intensity={0.6}
                mipmapBlur
              />
              <BrightnessContrast brightness={0} contrast={0.06} />
              <Vignette eskil={false} offset={0.25} darkness={0.45} />
            </EffectComposer>
          )}
        </React.Suspense>
      </Canvas>
    </div>
  );
}

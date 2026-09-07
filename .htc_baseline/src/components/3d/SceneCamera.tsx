"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SceneCameraProps {
  reducedMotion?: boolean;
  isMobile?: boolean;
}

export default function SceneCamera({ reducedMotion = false, isMobile = false }: SceneCameraProps) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetPos = useRef(new THREE.Vector3());

  // Mouse move parallax listener
  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reducedMotion]);

  // Smooth lerp camera loop
  useFrame(() => {
    // Camera base distance
    const baseZ = isMobile ? 6.5 : 5.2;
    const baseY = isMobile ? 0.3 : 0.0;

    if (reducedMotion) {
      camera.position.set(0, baseY, baseZ);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Heavy, controlled inertia parallax
    targetPos.current.set(
      mouseRef.current.x * 0.4,
      baseY + mouseRef.current.y * 0.3,
      baseZ
    );

    camera.position.lerp(targetPos.current, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

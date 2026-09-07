"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SteelStructureProps {
  reducedMotion?: boolean;
  isMobile?: boolean;
}

export default function SteelStructure({ reducedMotion = false, isMobile = false }: SteelStructureProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Controlled physical rotation loop (slowed on mobile)
  useFrame((_, delta) => {
    if (!reducedMotion && groupRef.current) {
      const speed = isMobile ? 0.04 : 0.08;
      groupRef.current.rotation.y += delta * speed;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * (isMobile ? 0.03 : 0.05);
    }
  });

  // Dark industrial steel material definition with crisp edge highlights
  const steelMaterialProps = {
    color: "#242422",
    metalness: 0.85,
    roughness: 0.38,
    clearcoat: 0.08,
    clearcoatRoughness: 0.4,
  };

  const copperAccentMaterialProps = {
    color: "#875E48",
    metalness: 0.75,
    roughness: 0.32,
  };

  // Position lower in lower/middle visual field on mobile to avoid text collision
  const positionY = isMobile ? -0.8 : 0;
  const scale = isMobile ? 0.78 : 1;

  return (
    <group ref={groupRef} position={[0, positionY, 0]} scale={[scale, scale, scale]}>
      {/* Primary Vertical I-Beam Column A */}
      <mesh position={[-1.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 3.8, 0.3]} />
        <meshStandardMaterial {...steelMaterialProps} />
      </mesh>

      {/* Primary Vertical I-Beam Column B */}
      <mesh position={[1.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 3.8, 0.3]} />
        <meshStandardMaterial {...steelMaterialProps} />
      </mesh>

      {/* Horizontal Heavy Cross Beam */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.35, 0.35]} />
        <meshStandardMaterial {...steelMaterialProps} />
      </mesh>

      {/* Lower Secondary Support Rail */}
      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.25, 0.25]} />
        <meshStandardMaterial {...steelMaterialProps} />
      </mesh>

      {/* Diagonal Structural Bracing A */}
      <mesh position={[-0.6, 0, -0.2]} rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.15, 0.15]} />
        <meshStandardMaterial {...steelMaterialProps} />
      </mesh>

      {/* Diagonal Structural Bracing B */}
      <mesh position={[0.6, 0, 0.2]} rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.15, 0.15]} />
        <meshStandardMaterial {...steelMaterialProps} />
      </mesh>

      {/* Precision Joint Plates (Oxidized Copper Accents) */}
      <mesh position={[-1.2, 1.2, 0.18]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial {...copperAccentMaterialProps} />
      </mesh>

      <mesh position={[1.2, 1.2, 0.18]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial {...copperAccentMaterialProps} />
      </mesh>

      <mesh position={[-1.2, -1.2, 0.18]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial {...copperAccentMaterialProps} />
      </mesh>

      <mesh position={[1.2, -1.2, 0.18]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial {...copperAccentMaterialProps} />
      </mesh>

      {/* Center Machined Cylinder Node */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
        <meshStandardMaterial {...steelMaterialProps} />
      </mesh>

      {/* Concentric Inner Steel Ring */}
      <mesh position={[0, 0, 0.25]} castShadow>
        <torusGeometry args={[0.85, 0.06, 16, 64]} />
        <meshStandardMaterial {...copperAccentMaterialProps} />
      </mesh>
    </group>
  );
}

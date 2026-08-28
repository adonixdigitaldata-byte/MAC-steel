"use client";

import React from "react";

export default function SceneLighting() {
  return (
    <>
      {/* Dark Ambient Industrial Fill */}
      <ambientLight intensity={0.5} color="#1E1E1C" />

      {/* Main Overhead Directional Key Light (Reveals Steel Surfaces) */}
      <directionalLight
        position={[12, 18, 12]}
        intensity={1.8}
        color="#E7E2D8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Side Edge Highlight Light */}
      <directionalLight
        position={[-12, 8, 10]}
        intensity={1.2}
        color="#96938B"
      />

      {/* Warm Copper Rim Accent Light */}
      <pointLight
        position={[-10, -8, -8]}
        intensity={1.4}
        color="#875E48"
        distance={25}
      />
    </>
  );
}

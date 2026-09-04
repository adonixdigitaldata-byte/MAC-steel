"use client";

import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* -----------------------------------------------------------------------
   Hero Scene — Final Visual Refinement Pass.
   - Priority 01: Physical heavy graphite steel (anti-glossy, high surface density).
   - Priority 02: Controlled studio key highlight (reveals geometry without washout).
   - Priority 03: Grounded visual mass & weighted contact shadow.
   - Priority 04: Controlled 23° azimuth exposing side planes & chamfer depth.
   - Priority 05: Restrained MAC copper accent (#875E48) for engineering detail.
   - Priority 06: Smooth continuous scroll inspection curve.
   - Priority 07: Organic forge warmth transition into Manufacturing.
   ----------------------------------------------------------------------- */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function springTowards(
  current: THREE.Vector3,
  velocity: THREE.Vector3,
  target: THREE.Vector3,
  smoothTime: number,
  dt: number
) {
  const omega = 2 / Math.max(smoothTime, 0.0001);
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const cx = current.x - target.x;
  const cy = current.y - target.y;
  const cz = current.z - target.z;
  const tx = (velocity.x + omega * cx) * dt;
  const ty = (velocity.y + omega * cy) * dt;
  const tz = (velocity.z + omega * cz) * dt;
  velocity.x = (velocity.x - omega * tx) * exp;
  velocity.y = (velocity.y - omega * ty) * exp;
  velocity.z = (velocity.z - omega * tz) * exp;
  current.x = target.x + (cx + tx) * exp;
  current.y = target.y + (cy + ty) * exp;
  current.z = target.z + (cz + tz) * exp;
}

/** Compute the camera world position from spherical camera parameters. */
function computeCamPos(az: number, pol: number, dist: number, pivotX: number, pivotY: number) {
  return new THREE.Vector3(
    pivotX + dist * Math.sin(az) * Math.cos(pol),
    pivotY + dist * Math.sin(pol),
    dist * Math.cos(az) * Math.cos(pol)
  );
}

interface Props {
  progressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  isMobile: boolean;
}

// Camera arc: Controlled 23° azimuth exposing true structural depth and thickness
// Desktop: 0.40 rad (~22.9°), elevation 0.17 rad (~9.7°), distance 5.85 -> 4.70 units
const CAM_START = { az: 0.40, pol: 0.17, dist: 5.85 };
const CAM_END   = { az: 0.50, pol: 0.19, dist: 4.70 };

export default function HeroScene({ progressRef, reducedMotion, isMobile }: Props) {
  const { camera } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) camera.clearViewOffset();
    return () => {
      if (camera instanceof THREE.PerspectiveCamera) camera.clearViewOffset();
    };
  }, [camera]);

  // Object pivot coordinates: Desktop = right half (1.30), Mobile = centered top (0.00, Y: +0.42)
  const pivotX = isMobile ? 0.0 : 1.30;
  const lookPivotX = isMobile ? 0.0 : 0.45;
  const lookY = isMobile ? 0.52 : 0.46;

  // Initial camera target at mount
  const INIT_POS = computeCamPos(
    CAM_START.az,
    CAM_START.pol,
    CAM_START.dist * (isMobile ? 1.22 : 1.0),
    lookPivotX,
    lookY
  );

  // Initialise spring tracking refs
  const camPos     = useRef(INIT_POS.clone());
  const camVel     = useRef(new THREE.Vector3());
  const camLook    = useRef(new THREE.Vector3(lookPivotX, lookY, 0));
  const camLookVel = useRef(new THREE.Vector3());
  const mouseRef   = useRef({ x: 0, y: 0 });
  const clockRef   = useRef(0);
  const billetRef  = useRef<THREE.Group>(null!);

  // Object-space gimbal pointer interpolation
  const gimbalYaw   = useRef(0);
  const gimbalPitch = useRef(0);

  // Lighting refs for cinematic entrance reveal & transition
  const keyLightRef   = useRef<THREE.DirectionalLight>(null!);
  const rimLightRef   = useRef<THREE.DirectionalLight>(null!);
  const accentLightRef = useRef<THREE.PointLight>(null!);
  const hemiLightRef   = useRef<THREE.HemisphereLight>(null!);

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const onMove = (e: PointerEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, isMobile]);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05);
    clockRef.current += dt;
    const elapsed = clockRef.current;
    const p = Math.max(0, Math.min(1, progressRef.current));

    // ── Priority 02: Refined Cinematic Entrance Choreography (2.6s total) ──
    // Non-clipping, controlled studio highlight reveal
    let entranceT = reducedMotion ? 1 : Math.min(1, elapsed / 2.6);
    const rimProgress    = reducedMotion ? 1 : easeOutCubic(Math.min(1, Math.max(0, (elapsed - 0.1) / 1.0)));
    const keyProgress    = reducedMotion ? 1 : easeOutCubic(Math.min(1, Math.max(0, (elapsed - 0.35) / 1.3)));
    const accentProgress = reducedMotion ? 1 : easeOutCubic(Math.min(1, Math.max(0, (elapsed - 0.7) / 1.2)));
    const hemiProgress   = reducedMotion ? 1 : easeOutCubic(Math.min(1, elapsed / 1.4));

    // ── Priority 07: Natural Manufacturing Transition (80% -> 100% scroll) ──
    const transitionFactor = Math.max(0, (p - 0.80) / 0.20);

    // Calibrated studio lighting levels — prevents white blowout, preserves graphite tone
    if (rimLightRef.current) {
      rimLightRef.current.intensity = lerp(0.04, 0.85, rimProgress) * (1 - transitionFactor * 0.25);
    }
    if (keyLightRef.current) {
      // Key light calibrated to 1.45 max intensity to maintain material graphite texture
      keyLightRef.current.intensity = lerp(0.0, 1.45, keyProgress) * (1 - transitionFactor * 0.20);
      const sweepX = pivotX + lerp(2.2, 3.4, keyProgress) + p * 0.45;
      keyLightRef.current.position.set(sweepX, 7.5, 4.0);
    }
    if (accentLightRef.current) {
      // Restrained copper bounce: 0.45 resting, gently warming to 0.75 near manufacturing
      accentLightRef.current.intensity = lerp(0.0, 0.45 + transitionFactor * 0.30, accentProgress);
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.intensity = lerp(0.12, 0.42, hemiProgress);
    }

    // ── Priority 06: Smooth Continuous Scroll Inspection Curve ──
    let scrollRotY = 0;
    let scrollRotX = 0;
    let scrollRotZ = 0;
    let scrollYOffset = 0;

    if (!reducedMotion) {
      // Smooth continuous easing from 0 to 33 degrees across full scroll
      const smoothP = p * p * (3 - 2 * p); // smoothstep
      scrollRotY = smoothP * 0.58;         // 0 -> ~33.2°
      scrollRotX = -Math.sin(p * Math.PI) * 0.08; // subtle forward inspection dip
      scrollRotZ = smoothP * 0.035;

      if (p > 0.75) {
        const transP = (p - 0.75) / 0.25;
        scrollYOffset = -transP * transP * 0.35; // Downward transition glide
      }
    }

    // ── Camera Coordinates ──
    const az   = lerp(CAM_START.az,   CAM_END.az,   p);
    const pol  = lerp(CAM_START.pol,  CAM_END.pol,  p);
    const dist = lerp(CAM_START.dist, CAM_END.dist, p) * (isMobile ? 1.22 : 1.0);

    const targetPos  = computeCamPos(az, pol, dist, lookPivotX, lookY);
    const targetLook = new THREE.Vector3(lookPivotX, lookY + scrollYOffset * 0.4, 0);

    if (reducedMotion) {
      camPos.current.copy(targetPos);
      camLook.current.copy(targetLook);
    } else {
      springTowards(camPos.current, camVel.current, targetPos, isMobile ? 0.25 : 0.38, dt);
      springTowards(camLook.current, camLookVel.current, targetLook, isMobile ? 0.18 : 0.28, dt);
    }
    camera.position.copy(camPos.current);
    camera.lookAt(camLook.current);

    // ── Object-Space Weighted Gimbal Pointer Interaction ──
    if (!reducedMotion && !isMobile) {
      const targetGimbalYaw   = mouseRef.current.x * 0.032;  // ±1.83° yaw
      const targetGimbalPitch = -mouseRef.current.y * 0.020; // ±1.15° pitch
      gimbalYaw.current   = lerp(gimbalYaw.current,   targetGimbalYaw,   0.05);
      gimbalPitch.current = lerp(gimbalPitch.current, targetGimbalPitch, 0.05);
    }

    // ── Priority 03: Grounded Physical Mass & Mechanical Idle ──
    if (billetRef.current && !reducedMotion) {
      const settleRotY = (1 - entranceT) * -0.04;
      
      // Extremely restrained mechanical breathing (±1.2cm, 7.2s period)
      const idleFloat = Math.sin(clockRef.current * 0.52) * 0.012;
      const idleRotY  = Math.sin(clockRef.current * 0.18) * 0.010;
      const idleRotZ  = Math.cos(clockRef.current * 0.14) * 0.004;

      const baseY = isMobile ? 0.42 : 0.48;
      billetRef.current.position.set(pivotX, baseY + idleFloat + scrollYOffset, 0);
      billetRef.current.rotation.set(
        scrollRotX + gimbalPitch.current,
        settleRotY + scrollRotY + idleRotY + gimbalYaw.current,
        scrollRotZ + idleRotZ
      );

      // Mobile scale
      if (isMobile) {
        billetRef.current.scale.set(0.80, 0.80, 0.80);
      } else {
        billetRef.current.scale.set(1.0, 1.0, 1.0);
      }
    }
  });

  return (
    <>
      {/* Atmosphere — seamless with #0e0f11 studio base */}
      <fog attach="fog" args={["#0e0f11", 10, 28]} />

      {/* 3-point studio lighting with refined non-clipping intensities */}
      <hemisphereLight ref={hemiLightRef} args={["#2b2f36", "#0a0b0d", 0.42]} />

      {/* Key Light — warm directional source, revealing structural chamfers */}
      <directionalLight
        ref={keyLightRef}
        position={[pivotX + 3.4, 7.5, 4.0]}
        intensity={1.45}
        color="#f0ebe2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      
      {/* Rim Light — cool industrial metallic contour separation */}
      <directionalLight
        ref={rimLightRef}
        position={[pivotX - 5.0, 2.6, -3.0]}
        intensity={0.85}
        color="#68849c"
      />
      
      {/* Accent Light — Restrained MAC Copper (#875E48) studio bounce */}
      <pointLight
        ref={accentLightRef}
        position={[pivotX + 1.8, 1.5, 2.2]}
        intensity={0.45}
        color="#875e48"
        distance={7.5}
        decay={2}
      />

      {/* Environment — studio preset for anisotropic metallic reflections */}
      <Environment preset="studio" resolution={isMobile ? 64 : 256} background={false} />

      {/* Seamless infinite dark studio floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0e0f11" roughness={0.90} metalness={0.04} />
      </mesh>

      {/* Priority 03: Ground contact shadow anchored firmly under component */}
      <ContactShadows
        position={[pivotX, 0.002, 0]}
        opacity={0.88}
        scale={8.2}
        blur={1.8}
        far={2.8}
        resolution={isMobile ? 128 : 256}
        color="#000000"
      />

      {/* ── 3D Hero Steel Object Assembly ── */}
      <group ref={billetRef} position={[pivotX, isMobile ? 0.42 : 0.48, 0]}>

        {/* Priority 01: Heavy Forged Billet Main Body — Graphite Machined Steel */}
        <RoundedBox args={[2.8, 0.6, 0.6]} radius={0.04} smoothness={5} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#181a1f"
            roughness={0.38}
            metalness={0.92}
            clearcoat={0.18}
            clearcoatRoughness={0.28}
            envMapIntensity={0.95}
            reflectivity={0.82}
          />
        </RoundedBox>

        {/* Precision Machined Slot Channel — Deep Internal Cavity */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.62, 0.19, 0.62]} />
          <meshPhysicalMaterial
            color="#0d0f11"
            roughness={0.65}
            metalness={0.82}
            clearcoat={0.05}
            envMapIntensity={0.5}
          />
        </mesh>

        {/* End Collars — Precision Machined Steel with controlled chamfer highlight */}
        {[-1.36, 1.36].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.055, 0.67, 0.67]} />
            <meshPhysicalMaterial
              color="#25282d"
              roughness={0.25}
              metalness={0.94}
              clearcoat={0.35}
              clearcoatRoughness={0.18}
              envMapIntensity={1.15}
            />
          </mesh>
        ))}

        {/* Threaded Core Rod — Darkened Precision Tool Steel */}
        <mesh position={[1.72, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.76, 24]} />
          <meshPhysicalMaterial
            color="#22252a"
            roughness={0.30}
            metalness={0.90}
            clearcoat={0.22}
            clearcoatRoughness={0.22}
            envMapIntensity={0.95}
          />
        </mesh>

        {/* Precision Thread Rings — Smooth High-Density Geometry */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[1.38 + i * 0.048, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.059, 0.009, 24, 24]} />
            <meshPhysicalMaterial
              color="#282b31"
              roughness={0.28}
              metalness={0.88}
              clearcoat={0.20}
              envMapIntensity={1.05}
            />
          </mesh>
        ))}

        {/* Priority 05 & 03: Primary Hex Nut — Mechanically Flush Anodized Copper (#875E48) */}
        <mesh position={[1.82, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.095, 0.095, 0.075, 6]} />
          <meshPhysicalMaterial
            color="#875e48"
            roughness={0.35}
            metalness={0.82}
            clearcoat={0.25}
            clearcoatRoughness={0.24}
            envMapIntensity={1.05}
          />
        </mesh>

        {/* Secondary Locking Jam Nut — Mechanically Mated Tool Steel Fastener */}
        <mesh position={[1.90, 0, 0]} rotation={[0, Math.PI / 6, Math.PI / 2]}>
          <cylinderGeometry args={[0.095, 0.095, 0.075, 6]} />
          <meshPhysicalMaterial
            color="#1f2227"
            roughness={0.32}
            metalness={0.90}
            clearcoat={0.22}
            clearcoatRoughness={0.26}
            envMapIntensity={0.95}
          />
        </mesh>
      </group>
    </>
  );
}



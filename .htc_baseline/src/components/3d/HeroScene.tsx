"use client";

import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* -----------------------------------------------------------------------
   Hero Scene — single brushed-steel billet reveal.
   Object lives at PIVOT_X = 2.2 (right of centre) so the left text
   safe zone is completely clear. Camera is pre-positioned to exactly
   match the scroll=0 target so there is zero pop on mount.
   ----------------------------------------------------------------------- */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
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
function computeCamPos(az: number, pol: number, dist: number, pivotX: number) {
  return new THREE.Vector3(
    pivotX + dist * Math.sin(az) * Math.cos(pol),
    dist * Math.sin(pol) + 0.5,
    dist * Math.cos(az) * Math.cos(pol)
  );
}

interface Props {
  progressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  isMobile: boolean;
}

// Object pivot — placed on the right half so it never overlaps the left text zone.
const PIVOT_X = 1.35;
const LOOK_Y  = 0.52;

// Camera arc: smooth cinematic push-in (≤14° azimuth, ≤10° polar lift)
const CAM_START = { az: 0.10, pol: 0.12, dist: 7.6 };
const CAM_END   = { az: -0.04, pol: 0.18, dist: 5.8 };

// Initial camera target at scroll = 0
const INIT_POS = computeCamPos(CAM_START.az, CAM_START.pol, CAM_START.dist, 0.45);

export default function HeroScene({ progressRef, reducedMotion, isMobile }: Props) {
  const { camera } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) camera.clearViewOffset();
    return () => {
      if (camera instanceof THREE.PerspectiveCamera) camera.clearViewOffset();
    };
  }, [camera]);

  // Initialise spring at the exact scroll=0 target
  const camPos     = useRef(INIT_POS.clone());
  const camVel     = useRef(new THREE.Vector3());
  const camLook    = useRef(new THREE.Vector3(0.45, LOOK_Y, 0));
  const camLookVel = useRef(new THREE.Vector3());
  const mouseRef   = useRef({ x: 0, y: 0 });
  const clockRef   = useRef(0);
  const billetRef  = useRef<THREE.Group>(null!);

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
    const p = Math.max(0, Math.min(1, progressRef.current));

    const az   = lerp(CAM_START.az,   CAM_END.az,   p);
    const pol  = lerp(CAM_START.pol,  CAM_END.pol,  p);
    const dist = lerp(CAM_START.dist, CAM_END.dist, p) * (isMobile ? 1.15 : 1);

    // Look target centers between the overall scene composition
    const lookPivotX = isMobile ? 0 : 0.45;
    const mx = reducedMotion || isMobile ? 0 : mouseRef.current.x * 0.08;
    const my = reducedMotion || isMobile ? 0 : -mouseRef.current.y * 0.05;

    const targetPos  = computeCamPos(az, pol, dist, lookPivotX);
    targetPos.x += mx;
    targetPos.y += my;
    const targetLook = new THREE.Vector3(lookPivotX + mx * 0.2, LOOK_Y + my * 0.2, 0);

    if (reducedMotion) {
      camPos.current.copy(targetPos);
      camLook.current.copy(targetLook);
    } else {
      springTowards(camPos.current, camVel.current, targetPos, isMobile ? 0.25 : 0.42, dt);
      springTowards(camLook.current, camLookVel.current, targetLook, isMobile ? 0.18 : 0.30, dt);
    }
    camera.position.copy(camPos.current);
    camera.lookAt(camLook.current);

    // Idle float
    if (billetRef.current && !reducedMotion) {
      billetRef.current.position.y = 0.52 + Math.sin(clockRef.current * 0.55) * 0.03;
      billetRef.current.rotation.y = Math.sin(clockRef.current * 0.18) * 0.025;
    }
  });

  return (
    <>
      {/* Atmosphere — matches #0e0f11 perfectly */}
      <fog attach="fog" args={["#0e0f11", 12, 32]} />

      {/* 3-point studio lighting */}
      <hemisphereLight args={["#2b2f36", "#0a0b0d", 0.65]} />

      {/* Key — warm, focused on the hero product */}
      <directionalLight
        position={[PIVOT_X + 3.5, 9, 5]}
        intensity={1.75}
        color="#f4efe8"
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
      {/* Rim — cool industrial metallic separation */}
      <directionalLight position={[PIVOT_X - 6, 2.5, -4]} intensity={0.7} color="#728fa8" />
      {/* Warm ambient studio glow */}
      <pointLight position={[PIVOT_X + 2, 2.2, 3]} intensity={0.5} color="#d49b5c" distance={10} decay={2} />

      {/* Environment — studio preset for clean reflections */}
      <Environment preset="studio" resolution={isMobile ? 64 : 256} background={false} />

      {/* Seamless infinite studio floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0e0f11" roughness={0.88} metalness={0.05} />
      </mesh>

      {/* Contact shadow */}
      <ContactShadows
        position={[PIVOT_X, 0.002, 0]}
        opacity={0.75}
        scale={9}
        blur={2.4}
        far={3.5}
        resolution={isMobile ? 128 : 256}
        color="#000000"
      />

      {/* ── Hero object ── */}
      <group ref={billetRef} position={[PIVOT_X, 0.55, 0]}>

        {/* Main body */}
        <RoundedBox args={[2.8, 0.6, 0.6]} radius={0.04} smoothness={5} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#b2b6ba"
            roughness={0.16}
            metalness={0.92}
            clearcoat={0.7}
            clearcoatRoughness={0.1}
            envMapIntensity={1.8}
            reflectivity={0.95}
          />
        </RoundedBox>

        {/* Machined slot channel */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.62, 0.19, 0.62]} />
          <meshPhysicalMaterial
            color="#1a1c1e"
            roughness={0.6}
            metalness={0.7}
            clearcoat={0.15}
            envMapIntensity={0.9}
          />
        </mesh>

        {/* End collars — bright polished */}
        {[-1.36, 1.36].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.055, 0.67, 0.67]} />
            <meshPhysicalMaterial
              color="#d0d2d4"
              roughness={0.06}
              metalness={0.98}
              clearcoat={0.9}
              clearcoatRoughness={0.04}
              envMapIntensity={2.2}
            />
          </mesh>
        ))}

        {/* Threaded rod */}
        <mesh position={[1.72, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.76, 22]} />
          <meshPhysicalMaterial
            color="#b8bbbe"
            roughness={0.22}
            metalness={0.88}
            clearcoat={0.5}
            clearcoatRoughness={0.18}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Thread rings */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[1.38 + i * 0.048, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.059, 0.009, 8, 22]} />
            <meshStandardMaterial color="#a5a8ab" roughness={0.3} metalness={0.82} envMapIntensity={1.6} />
          </mesh>
        ))}

        {/* Hex nut */}
        <mesh position={[2.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 6]} />
          <meshPhysicalMaterial
            color="#949698"
            roughness={0.28}
            metalness={0.86}
            clearcoat={0.55}
            clearcoatRoughness={0.22}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* Second nut — adds assembly context */}
        <mesh position={[2.16, 0, 0]} rotation={[0, Math.PI / 6, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 6]} />
          <meshPhysicalMaterial
            color="#888b8d"
            roughness={0.3}
            metalness={0.84}
            clearcoat={0.5}
            envMapIntensity={1.3}
          />
        </mesh>
      </group>
    </>
  );
}

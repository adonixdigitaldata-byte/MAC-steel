"use client";

import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* -----------------------------------------------------------------------
   Hero Scene — HTC-3.2 Exploded Mechanical Assembly.
   - Preserves HTC-3.1 Cinematic Reveal (Light Sweep, Settle, Idle Realism).
   - Introduces Scroll-Driven Exploded Inspection:
     * 0% – 15%: Intact assembly, orientation inspection.
     * 15% – 35%: Threaded core rod smoothly slides outward along X.
     * 35% – 55%: Thread rings follow with preserved spacing & micro-stagger.
     * 55% – 75%: Hex nut unscrews with rotational pitch + jam nut follows.
     * 75% – 100%: Heavy mechanical retraction & locking before Manufacturing.
   ----------------------------------------------------------------------- */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
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

  // Object pivot coordinates: Desktop = right half (1.30), Mobile = centered (0.00, Y: -0.55 initially)
  const pivotX = isMobile ? 0.0 : 1.30;
  const lookPivotX = isMobile ? 0.0 : 0.45;
  const lookY = isMobile ? -0.32 : 0.46;

  // On mobile, use higher angle elevation (0.28 rad / ~16°) and 0.48 azimuth for prominent 3D perspective
  const camStartAz = isMobile ? 0.48 : CAM_START.az;
  const camStartPol = isMobile ? 0.28 : CAM_START.pol;

  // Initial camera target at mount
  const INIT_POS = computeCamPos(
    camStartAz,
    camStartPol,
    (CAM_START.dist + (reducedMotion ? 0 : 0.40)) * (isMobile ? 1.05 : 1.0),
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
  const envGroupRef = useRef<THREE.Group>(null!);

  // Individual mesh refs for HTC-3.2 Exploded Assembly
  const rodRef       = useRef<THREE.Mesh>(null!);
  const threadRefs   = useRef<(THREE.Mesh | null)[]>([]);
  const hexNutRef    = useRef<THREE.Mesh>(null!);
  const jamNutRef    = useRef<THREE.Mesh>(null!);

  // Object-space gimbal pointer interpolation
  const gimbalYaw   = useRef(0);
  const gimbalPitch = useRef(0);

  // Lighting refs for cinematic entrance reveal & transition
  const keyLightRef    = useRef<THREE.DirectionalLight>(null!);
  const rimLightRef    = useRef<THREE.DirectionalLight>(null!);
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

    // ── HTC-3.1 Phase A: Light Sweep Reveal (0.0s – 1.1s) ──
    const sweepProgress  = reducedMotion ? 1 : easeInOutCubic(Math.min(1, Math.max(0, elapsed / 1.10)));
    const sweepIntensity = reducedMotion ? 1 : easeOutCubic(Math.min(1, Math.max(0, elapsed / 0.85)));
    const rimProgress    = reducedMotion ? 1 : easeOutCubic(Math.min(1, Math.max(0, (elapsed - 0.05) / 0.85)));
    const accentProgress = reducedMotion ? 1 : easeOutCubic(Math.min(1, Math.max(0, (elapsed - 0.75) / 0.85)));
    const hemiProgress   = reducedMotion ? 1 : easeOutCubic(Math.min(1, Math.max(0, elapsed / 1.20)));

    // ── HTC-3.1 Phase B: Mechanical Settle & Scale (1.1s – 2.0s) ──
    const settleProgress = reducedMotion ? 1 : easeOutCubic(Math.min(1, Math.max(0, (elapsed - 1.10) / 0.90)));
    const entranceDolly  = reducedMotion ? 1 : easeOutExpo(Math.min(1, Math.max(0, elapsed / 1.80)));

    // ── HTC-3.1 Phase C: Premium Idle Realism ──
    if (envGroupRef.current && !reducedMotion) {
      envGroupRef.current.rotation.y = clockRef.current * 0.025;
    }
    const shimmer = reducedMotion ? 1 : 1 + Math.sin(clockRef.current * 0.95) * 0.018;

    // ── Manufacturing Transition Factor (80% -> 100% scroll) ──
    const transitionFactor = Math.max(0, (p - 0.80) / 0.20);

    // Apply lighting states with boosted vibrant industrial illumination
    if (rimLightRef.current) {
      rimLightRef.current.intensity = lerp(0.15, 1.45, rimProgress) * shimmer * (1 - transitionFactor * 0.25);
    }
    if (keyLightRef.current) {
      const sweepX = pivotX + lerp(-3.2, 3.4, sweepProgress) + p * 0.45;
      const keyInt = lerp(0.2, 2.35, sweepIntensity) * shimmer * (1 - transitionFactor * 0.20);
      keyLightRef.current.intensity = keyInt;
      keyLightRef.current.position.set(sweepX, 7.5, 4.0);
    }
    if (accentLightRef.current) {
      accentLightRef.current.intensity = lerp(0.1, 0.85 + transitionFactor * 0.30, accentProgress);
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.intensity = lerp(0.25, 0.75, hemiProgress);
    }

    // ── HTC-3.2 Exploded Mechanical Assembly Timeline Calculations ──
    // Phase 1 (0–15%): Intact assembly (rodOffset = 0, rings = 0, nuts = 0).
    // Phase 2 (15–35%): Rod slides outward along local X (+0.34 units).
    // Phase 3 (35–55%): Thread rings expand outwards with progressive stagger (+0.28 units max).
    // Phase 4 (55–75%): Hex nut translates +0.46 units with unscrewing rotation, jam nut translates +0.58 units.
    // Phase 5 (75–100%): Controlled mechanical return & lock (all offsets smoothly -> 0 before transition).

    let rodOffset = 0;
    let hexNutOffset = 0;
    let hexNutSpin = 0;
    let jamNutOffset = 0;
    let jamNutSpin = 0;
    const ringOffsets: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

    if (!reducedMotion) {
      // 1. Threaded Rod Curve (15% -> 35% extension, 75% -> 92% retraction)
      if (p >= 0.15 && p < 0.75) {
        const extendT = smoothstep((p - 0.15) / 0.20); // 15% -> 35%
        rodOffset = extendT * 0.34;
      } else if (p >= 0.75) {
        const returnT = smoothstep((p - 0.75) / 0.18); // 75% -> 93%
        rodOffset = lerp(0.34, 0, returnT);
      }

      // 2. Thread Rings Curve (35% -> 55% extension, 75% -> 90% retraction)
      const ringBaseExtend = p >= 0.35 && p < 0.75
        ? smoothstep((p - 0.35) / 0.20)
        : p >= 0.75
        ? lerp(1, 0, smoothstep((p - 0.75) / 0.16))
        : 0;

      for (let i = 0; i < 8; i++) {
        // Micro-stagger per ring based on distance along core rod
        const stagger = (i / 7) * 0.05;
        const localT = Math.max(0, Math.min(1, ringBaseExtend - stagger * (1 - ringBaseExtend)));
        ringOffsets[i] = rodOffset * 0.45 + localT * (0.08 + i * 0.022);
      }

      // 3. Hex Nut Curve (55% -> 72% extension & rotation, 75% -> 88% retraction)
      if (p >= 0.52 && p < 0.75) {
        const nutExtend = smoothstep((p - 0.52) / 0.20);
        hexNutOffset = rodOffset + nutExtend * 0.38;
        hexNutSpin = nutExtend * Math.PI * 2.5; // ~450° of unscrewing rotation
      } else if (p >= 0.75) {
        const nutReturn = smoothstep((p - 0.75) / 0.14);
        hexNutOffset = lerp(0.34 + 0.38, 0, nutReturn);
        hexNutSpin = lerp(Math.PI * 2.5, 0, nutReturn);
      }

      // 4. Locking Jam Nut Curve (57% -> 75% extension & rotation, 75% -> 86% retraction)
      if (p >= 0.56 && p < 0.75) {
        const jamExtend = smoothstep((p - 0.56) / 0.18);
        jamNutOffset = rodOffset + jamExtend * 0.48;
        jamNutSpin = jamExtend * Math.PI * 3.0; // ~540° of unscrewing rotation
      } else if (p >= 0.75) {
        const jamReturn = smoothstep((p - 0.75) / 0.12);
        jamNutOffset = lerp(0.34 + 0.48, 0, jamReturn);
        jamNutSpin = lerp(Math.PI * 3.0, 0, jamReturn);
      }
    }

    // Apply Exploded Assembly Local Transforms
    if (rodRef.current) {
      rodRef.current.position.set(1.72 + rodOffset, 0, 0);
    }
    threadRefs.current.forEach((ringMesh, i) => {
      if (ringMesh) {
        ringMesh.position.set(1.38 + i * 0.048 + ringOffsets[i], 0, 0);
      }
    });
    if (hexNutRef.current) {
      hexNutRef.current.position.set(1.82 + hexNutOffset, 0, 0);
      hexNutRef.current.rotation.set(0, hexNutSpin, Math.PI / 2);
    }
    if (jamNutRef.current) {
      jamNutRef.current.position.set(1.90 + jamNutOffset, 0, 0);
      jamNutRef.current.rotation.set(0, Math.PI / 6 + jamNutSpin, Math.PI / 2);
    }

    // ── Smooth Continuous Scroll Inspection Curve & HTC-3.4 Seamless Handoff ──
    let scrollRotY = 0;
    let scrollRotX = 0;
    let scrollRotZ = 0;
    let scrollYOffset = 0;
    let transitionElongation = 1.0;

    if (!reducedMotion) {
      const smoothP = p * p * (3 - 2 * p); // smoothstep
      scrollRotY = smoothP * 0.58;         // 0 -> ~33.2°
      scrollRotX = -Math.sin(p * Math.PI) * 0.08; // subtle forward inspection dip
      scrollRotZ = smoothP * 0.035;

      // 82%–90%: Forward commitment and alignment with ManufacturingScene initial vector
      if (p >= 0.82) {
        const commitP = smoothstep((p - 0.82) / 0.18);
        scrollYOffset = -commitP * commitP * 0.42; // Downward glide aligned with manufacturing stage 01
      }

      // 90%–100%: Billet smoothly elongates along X to match Stage 01 raw stock billet profile
      if (p >= 0.90) {
        const elongP = smoothstep((p - 0.90) / 0.10);
        transitionElongation = lerp(1.0, 1.08, elongP);
      }
    }

    // ── Camera Coordinates (Cinematic Dolly Entrance + Matching Handoff Velocity) ──
    const initialDollyOffset = (1 - entranceDolly) * 0.40;
    // At p=1.0, azimuth (0.50 -> 0.22 in MFG) and elevation match continuous transition momentum
    const az   = lerp(camStartAz,   CAM_END.az,   p);
    const pol  = lerp(camStartPol,  CAM_END.pol,  p);
    const dist = (lerp(CAM_START.dist, CAM_END.dist, p) + initialDollyOffset) * (isMobile ? 1.05 : 1.0);

    // On mobile, camera look target rises to center the billet during scroll
    const mobileLookY = isMobile
      ? lerp(-0.32, 0.08, p < 0.55 ? p / 0.55 : 1.0) + scrollYOffset * 0.5
      : lookY + scrollYOffset * 0.4;

    const targetPos  = computeCamPos(az, pol, dist, lookPivotX, mobileLookY);
    const targetLook = new THREE.Vector3(lookPivotX, mobileLookY, 0);

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

    // ── Billet Assembly Positioning & Mechanical Settle ──
    if (billetRef.current) {
      if (!reducedMotion) {
        // Mobile: 0.65 base scale sitting neatly under CTAs, rises & scales to 0.82 during scroll
        let mobileScale = 0.65;
        let mobileY = -0.52;

        if (isMobile) {
          if (p < 0.20) {
            mobileScale = 0.65;
            mobileY = -0.52;
          } else if (p < 0.55) {
            const riseProgress = (p - 0.20) / 0.35;
            mobileScale = lerp(0.65, 0.82, easeOutCubic(riseProgress));
            mobileY = lerp(-0.52, -0.10, easeOutCubic(riseProgress));
          } else {
            const handoffProgress = (p - 0.55) / 0.45;
            mobileScale = lerp(0.82, 0.72, handoffProgress);
            mobileY = lerp(-0.10, -0.65, easeInOutCubic(handoffProgress));
          }
        }

        const baseTargetScale = isMobile
          ? mobileScale
          : lerp(0.96, 1.0, settleProgress);

        const currentScale = baseTargetScale;
        const lockPitch = (1 - settleProgress) * -0.028;
        const lockYaw   = (1 - settleProgress) * -0.035;
        const lockY     = (1 - settleProgress) * 0.025;

        // Phase C continuous mechanical breathing (±1.2cm, 7.2s period)
        const idleFloat = Math.sin(clockRef.current * 0.52) * 0.012;
        const idleRotY  = Math.sin(clockRef.current * 0.18) * 0.010;
        const idleRotZ  = Math.cos(clockRef.current * 0.14) * 0.004;

        const baseY = isMobile ? mobileY : 0.48;
        billetRef.current.position.set(pivotX, baseY + lockY + idleFloat + scrollYOffset, 0);
        billetRef.current.rotation.set(
          lockPitch + scrollRotX + gimbalPitch.current,
          lockYaw + scrollRotY + idleRotY + gimbalYaw.current,
          scrollRotZ + idleRotZ
        );
        billetRef.current.scale.set(
          currentScale * transitionElongation,
          currentScale,
          currentScale
        );
      } else {
        const baseScale = isMobile ? 0.58 : 1.0;
        billetRef.current.scale.set(baseScale, baseScale, baseScale);
        billetRef.current.position.set(pivotX, isMobile ? -0.68 : 0.48, 0);
      }
    }
  });

  return (
    <>
      {/* Atmosphere — seamless with #0e0f11 studio base */}
      <fog attach="fog" args={["#0e0f11", 12, 32]} />

      {/* 3-point studio lighting with dynamic sweep and rich ambient illumination */}
      <hemisphereLight ref={hemiLightRef} args={["#4a505b", "#14161a", 0.45]} />

      {/* Key Light — warm directional primary source */}
      <directionalLight
        ref={keyLightRef}
        position={[pivotX - 3.2, 7.5, 4.0]}
        intensity={2.2}
        color="#faf7f2"
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
        position={[pivotX - 5.0, 3.6, -3.0]}
        intensity={1.4}
        color="#94b4cf"
      />

      {/* Front Soft Fill Light */}
      <directionalLight
        position={[pivotX + 2.0, 4.0, 6.0]}
        intensity={1.1}
        color="#e8ecf0"
      />
      
      {/* Accent Light — Restrained MAC Copper (#c47c43) studio bounce */}
      <pointLight
        ref={accentLightRef}
        position={[pivotX + 2.0, 2.2, 2.5]}
        intensity={0.8}
        color="#c47c43"
        distance={9.0}
        decay={2}
      />

      {/* Environment — Rich 360-degree procedural studio reflection rig (fully offline) */}
      <group ref={envGroupRef}>
        <Environment background={false}>
          {/* Top Key Softbox */}
          <mesh position={[0, 12, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[30, 20, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Front Soft Fill Softbox */}
          <mesh position={[0, 4, 14]} rotation={[0, Math.PI, 0]} scale={[25, 15, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#e8eff5" />
          </mesh>
          {/* Left Cool Metal Rim Strip */}
          <mesh position={[-12, 2, -6]} rotation={[0, Math.PI / 3, 0]} scale={[12, 22, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#88aed4" />
          </mesh>
          {/* Right Warm Copper Bounce Strip */}
          <mesh position={[12, 4, 4]} rotation={[0, -Math.PI / 3, 0]} scale={[14, 18, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#d48a52" />
          </mesh>
          {/* Back Edge Horizon Reflector */}
          <mesh position={[0, -2, -14]} scale={[30, 10, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#a0b4c8" />
          </mesh>
        </Environment>
      </group>

      {/* Seamless infinite dark studio floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0e0f11" roughness={0.85} metalness={0.06} />
      </mesh>

      {/* Ground contact shadow anchored firmly under component */}
      <ContactShadows
        position={[pivotX, 0.002, 0]}
        opacity={0.82}
        scale={8.2}
        blur={1.8}
        far={2.8}
        resolution={isMobile ? 128 : 256}
        color="#000000"
      />

      {/* ── 3D Hero Steel Object Assembly ── */}
      <group ref={billetRef} position={[pivotX, isMobile ? 0.42 : 0.48, 0]}>

        {/* Heavy Forged Billet Main Body — Graphite Machined Steel */}
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

        {/* Threaded Core Rod — Independently Animated along Local X (15%–35% / 75%–100%) */}
        <mesh ref={rodRef} position={[1.72, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
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

        {/* Precision Thread Rings — Independently Animated with Stagger (35%–55% / 75%–100%) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            ref={(el) => { threadRefs.current[i] = el; }}
            position={[1.38 + i * 0.048, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          >
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

        {/* Primary Hex Nut — Independently Animated Unscrew & Translation (52%–75% / 75%–100%) */}
        <mesh ref={hexNutRef} position={[1.82, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
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

        {/* Secondary Locking Jam Nut — Independently Animated Unscrew & Follow (56%–75% / 75%–100%) */}
        <mesh ref={jamNutRef} position={[1.90, 0, 0]} rotation={[0, Math.PI / 6, Math.PI / 2]}>
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





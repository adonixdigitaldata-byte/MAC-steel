"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* -----------------------------------------------------------------------
   ManufacturingScene — the 5-stage scroll-driven manufacturing journey.
   Full cut → form → coat → install sequence preserved with premium
   industrial materials, balanced studio lighting, and zero bloom washout.
   Object sits at PIVOT_X = 1.2 on the right half so left text is clear.
   ----------------------------------------------------------------------- */

export const ACT_COUNT = 5;

// Camera keyframes orbiting around the manufacturing focal area
const CAMERA_KEYFRAMES = [
  { az: 0.22, pol: 0.16, dist: 5.6, lookY: 0.42 },
  { az: 0.42, pol: 0.24, dist: 4.8, lookY: 0.48 },
  { az: 0.12, pol: 0.22, dist: 5.2, lookY: 0.50 },
  { az: -0.18, pol: 0.32, dist: 5.0, lookY: 0.52 },
  { az: 0.22, pol: 0.22, dist: 6.2, lookY: 0.65 },
];

const PIVOT_X = 1.2;

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
function smoothstep(t: number) { return t * t * (3 - 2 * t); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function springTowards(
  current: THREE.Vector3, velocity: THREE.Vector3,
  target: THREE.Vector3, smoothTime: number, dt: number
) {
  const omega = 2 / Math.max(smoothTime, 0.0001);
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const cx = current.x - target.x, cy = current.y - target.y, cz = current.z - target.z;
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

interface Props {
  progressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  isMobile: boolean;
}

export default function ManufacturingScene({ progressRef, reducedMotion, isMobile }: Props) {
  const { camera } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) camera.clearViewOffset();
    return () => {
      if (camera instanceof THREE.PerspectiveCamera) camera.clearViewOffset();
    };
  }, [camera]);

  // Lights
  const keyRef  = useRef<THREE.DirectionalLight>(null!);
  const rimRef  = useRef<THREE.DirectionalLight>(null!);
  const hemiRef = useRef<THREE.HemisphereLight>(null!);

  // Geometry refs
  const billetRef        = useRef<THREE.Mesh>(null!);
  const machinedRef      = useRef<THREE.Mesh>(null!);
  const machinedEdgesRef = useRef<THREE.LineSegments>(null!);
  const bladeRef         = useRef<THREE.Mesh>(null!);
  const angleRef         = useRef<THREE.Mesh>(null!);
  const angleEdgesRef    = useRef<THREE.LineSegments>(null!);
  const rodRef           = useRef<THREE.Mesh>(null!);
  const threadRefs       = useRef<(THREE.Mesh | null)[]>([]);
  const tankRef          = useRef<THREE.Mesh>(null!);
  const frameRef         = useRef<THREE.Group>(null!);
  const trayRef          = useRef<THREE.Group>(null!);
  const sparkRefs        = useRef<(THREE.Mesh | null)[]>([]);
  const sparkLightRef    = useRef<THREE.PointLight>(null!);

  // Camera spring
  const camPos     = useRef(new THREE.Vector3(PIVOT_X + 1.2, 1.3, 5.6));
  const camVel     = useRef(new THREE.Vector3());
  const camLook    = useRef(new THREE.Vector3(PIVOT_X * 0.5, 0.42, 0));
  const camLookVel = useRef(new THREE.Vector3());

  const colors = useMemo(() => ({
    machinedA: new THREE.Color("#c0c4c8"),
    galv:      new THREE.Color("#9ea4a8"),
    epoxy:     new THREE.Color("#d48828"),
  }), []);

  const angleShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.lineTo(0.5, 0); s.lineTo(0.5, 0.12);
    s.lineTo(0.12, 0.12); s.lineTo(0.12, 0.5); s.lineTo(0, 0.5); s.lineTo(0, 0);
    return s;
  }, []);

  const angleGeomArgs = useMemo(() => [
    angleShape,
    { depth: 1.8, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.014, bevelSegments: 3, curveSegments: 12 },
  ] as const, [angleShape]);

  const homes = useMemo(() => ({
    billet:       new THREE.Vector3(PIVOT_X, 0.6, 0),
    machined:     new THREE.Vector3(PIVOT_X, 0.6, 0),
    angleFormed:  new THREE.Vector3(PIVOT_X - 0.7, 0.55, 0.45),
    rodFormed:    new THREE.Vector3(PIVOT_X + 0.7, 0.55, -0.45),
    angleInstall: new THREE.Vector3(PIVOT_X - 0.45, 0.55, 0),
    rodInstall:   new THREE.Vector3(PIVOT_X + 0.45, 0.55, 0),
    blade:        new THREE.Vector3(PIVOT_X, 0.9, 0),
  }), []);

  const sparkSeeds = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      angle: (i / 24) * Math.PI * 2 + Math.random() * 0.4,
      speed: 0.7 + Math.random() * 0.6,
      drop:  0.5 + Math.random() * 0.6,
    })), []);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05);
    const progress = progressRef.current;
    const idx  = Math.min(ACT_COUNT - 1, Math.floor(progress));
    const t    = clamp01(progress - idx);
    const ease = smoothstep(t);

    const cutT     = idx === 0 ? ease : idx > 0 ? 1 : 0;
    const formT    = idx < 1 ? 0 : idx === 1 ? ease : idx > 1 ? 1 : 0;
    const coatT    = idx < 2 ? 0 : idx === 2 ? ease : idx > 2 ? 1 : 0;
    const installT = idx < 3 ? 0 : idx === 3 ? ease : idx > 3 ? 1 : 0;

    // stock → cut
    if (billetRef.current) {
      (billetRef.current.material as THREE.MeshStandardMaterial).opacity = 1 - cutT;
      billetRef.current.visible = cutT < 0.98;
    }
    const machinedVis = clamp01(cutT) * (1 - formT);
    if (machinedRef.current) {
      (machinedRef.current.material as THREE.MeshStandardMaterial).opacity = machinedVis;
      machinedRef.current.visible = machinedVis > 0.01;
    }
    if (machinedEdgesRef.current) {
      (machinedEdgesRef.current.material as THREE.LineBasicMaterial).opacity = machinedVis * 0.25;
      machinedEdgesRef.current.visible = machinedVis > 0.01;
    }

    // blade + sparks
    let cutMomentT = 0;
    if (idx === 0) cutMomentT = Math.sin(Math.PI * t);
    const isCutting = idx === 0 && t > 0.38 && t < 0.72 && !reducedMotion;
    if (bladeRef.current) {
      (bladeRef.current.material as THREE.MeshStandardMaterial).opacity = cutMomentT * 0.85;
      bladeRef.current.position.x = homes.blade.x - 0.55 + t * 1.1;
    }
    if (sparkLightRef.current) {
      sparkLightRef.current.intensity = isCutting ? 1.5 * Math.sin(Math.PI * ((t - 0.38) / 0.34)) : 0;
      sparkLightRef.current.position.set(homes.blade.x - 0.55 + t * 1.1, 0.9, 0);
    }
    sparkRefs.current.forEach((s, i) => {
      if (!s) return;
      const seed = sparkSeeds[i];
      const local = isCutting ? clamp01((t - 0.38) / 0.34) : 0;
      s.visible = isCutting;
      if (isCutting) {
        const dist = local * seed.speed;
        s.position.set(
          homes.blade.x - 0.55 + t * 1.1 + Math.cos(seed.angle) * dist * 0.4,
          0.9 + Math.sin(seed.angle) * dist * 0.3 - local * local * seed.drop,
          Math.sin(seed.angle) * dist * 0.4
        );
        (s.material as THREE.MeshStandardMaterial).opacity = 1 - local;
      }
    });

    // form
    const formPos = smoothstep(formT);
    if (angleRef.current) {
      angleRef.current.position.lerpVectors(homes.machined, homes.angleFormed, formPos);
      (angleRef.current.material as THREE.MeshStandardMaterial).opacity = formT;
      angleRef.current.visible = formT > 0.01;
    }
    if (angleEdgesRef.current) {
      angleEdgesRef.current.position.copy(angleRef.current?.position ?? homes.angleFormed);
      (angleEdgesRef.current.material as THREE.LineBasicMaterial).opacity = formT * 0.25;
      angleEdgesRef.current.visible = formT > 0.01;
    }
    if (rodRef.current) {
      rodRef.current.position.lerpVectors(homes.machined, homes.rodFormed, formPos);
      (rodRef.current.material as THREE.MeshStandardMaterial).opacity = formT;
      rodRef.current.visible = formT > 0.01;
    }
    threadRefs.current.forEach((th, i) => {
      if (!th) return;
      const home = homes.rodFormed.clone().add(new THREE.Vector3(-0.72 + i * 0.16, 0, 0));
      th.position.lerpVectors(homes.machined, home, formPos);
      (th.material as THREE.MeshStandardMaterial).opacity = formT;
      th.visible = formT > 0.01;
    });

    // coat
    let tankRise = 0;
    if (idx === 2 && !reducedMotion) tankRise = Math.sin(Math.PI * t);
    if (tankRef.current) {
      tankRef.current.scale.y = Math.max(0.001, tankRise * 18);
      tankRef.current.position.y = 0.12 + tankRise * 0.35;
      (tankRef.current.material as THREE.MeshStandardMaterial).opacity = tankRise * 0.32;
    }
    if (angleRef.current) {
      const mat = angleRef.current.material as THREE.MeshPhysicalMaterial;
      mat.color.lerpColors(colors.machinedA, colors.galv, coatT);
      mat.roughness = lerp(0.25, 0.42, coatT);
      mat.metalness = lerp(0.9, 0.72, coatT);
      mat.clearcoat = lerp(0.4, 0.2, coatT);
    }
    if (rodRef.current) {
      const mat = rodRef.current.material as THREE.MeshPhysicalMaterial;
      mat.color.lerpColors(colors.machinedA, colors.epoxy, coatT);
      mat.roughness = lerp(0.24, 0.2, coatT);
      mat.metalness = lerp(0.88, 0.15, coatT);
      mat.clearcoat = lerp(0.4, 0.65, coatT);
    }
    threadRefs.current.forEach((th) => {
      if (!th) return;
      (th.material as THREE.MeshStandardMaterial).color.lerpColors(colors.machinedA, colors.epoxy, coatT);
    });

    // install
    if (frameRef.current) {
      frameRef.current.visible = installT > 0.01;
      frameRef.current.traverse((o) => {
        if ((o as THREE.Mesh).isMesh)
          ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = installT;
      });
    }
    if (angleRef.current) angleRef.current.position.lerp(homes.angleInstall, installT * 0.05);
    if (rodRef.current) rodRef.current.position.lerp(homes.rodInstall, installT * 0.05);
    if (trayRef.current) {
      trayRef.current.visible = installT > 0.01;
      trayRef.current.children.forEach((c) => {
        const m = c as THREE.Mesh;
        (m.material as THREE.MeshStandardMaterial).opacity = installT * 0.9;
        m.scale.setScalar(lerp(0.7, 1, installT));
      });
    }

    // Camera
    const camA = CAMERA_KEYFRAMES[idx];
    const camB = CAMERA_KEYFRAMES[Math.min(idx + 1, ACT_COUNT - 1)];
    const az   = lerp(camA.az, camB.az, ease);
    const pol  = lerp(camA.pol, camB.pol, ease);
    const dist = lerp(camA.dist, camB.dist, ease) * (isMobile ? 1.15 : 1);
    const lookY = lerp(camA.lookY, camB.lookY, ease);

    // Camera focuses on the right half where the manufacturing happens
    const lookPivotX = isMobile ? 0 : PIVOT_X * 0.55;
    const targetPos  = new THREE.Vector3(
      lookPivotX + dist * Math.sin(az) * Math.cos(pol),
      dist * Math.sin(pol) + 0.5,
      dist * Math.cos(az) * Math.cos(pol)
    );
    const targetLook = new THREE.Vector3(lookPivotX, lookY, 0);

    if (reducedMotion) {
      camPos.current.copy(targetPos);
      camLook.current.copy(targetLook);
    } else {
      springTowards(camPos.current, camVel.current, targetPos, 0.32, dt);
      springTowards(camLook.current, camLookVel.current, targetLook, 0.22, dt);
    }
    camera.position.copy(camPos.current);
    camera.lookAt(camLook.current);

    if (keyRef.current) {
      const warm = idx === 1 || idx === 3;
      keyRef.current.color.setHex(warm ? 0xf2ece4 : 0xeae8e4);
      keyRef.current.intensity = warm ? 1.6 : 1.45;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#0e0f11", 10, 30]} />
      <hemisphereLight ref={hemiRef} args={["#2b2f36", "#0a0b0d", 0.6]} />
      <directionalLight
        ref={keyRef}
        position={[PIVOT_X + 4, 9, 5]}
        intensity={1.5}
        color="#f2ede6"
        castShadow
        shadow-mapSize={[isMobile ? 512 : 1024, isMobile ? 512 : 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight ref={rimRef} position={[PIVOT_X - 6, 3, -4]} intensity={0.65} color="#68829c" />
      {/* Soft warm copper accent */}
      <pointLight position={[PIVOT_X + 1.5, 1.8, 2.5]} intensity={0.45} color="#c47c43" distance={8} decay={2} />
      <pointLight ref={sparkLightRef} color="#ffaa44" intensity={0} distance={3} />

      <Environment preset="studio" resolution={isMobile ? 64 : 256} background={false} />

      {/* Seamless infinite studio floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0e0f11" roughness={0.9} metalness={0.05} />
      </mesh>

      <ContactShadows
        position={[PIVOT_X, 0.001, 0]}
        opacity={0.6}
        scale={9}
        blur={2.4}
        far={3.8}
        resolution={isMobile ? 128 : 256}
        color="#000000"
      />

      {/* ── Stock billet — rich cold steel grey ── */}
      <RoundedBox ref={billetRef} args={[2.6, 0.55, 0.55]} radius={0.035} smoothness={4}
        position={[PIVOT_X, 0.6, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#7a8086" roughness={0.36} metalness={0.82}
          clearcoat={0.25} clearcoatRoughness={0.25} envMapIntensity={1.3} transparent />
      </RoundedBox>

      {/* ── Machined bar — milled steel with polished finish ── */}
      <RoundedBox ref={machinedRef} args={[2.3, 0.42, 0.42]} radius={0.03} smoothness={4}
        position={[PIVOT_X, 0.6, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#bcc0c4" roughness={0.2} metalness={0.9}
          clearcoat={0.5} clearcoatRoughness={0.12} envMapIntensity={1.6} transparent />
      </RoundedBox>
      <lineSegments ref={machinedEdgesRef} position={homes.machined}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.3, 0.42, 0.42)]} />
        <lineBasicMaterial color="#b5713c" transparent opacity={0} />
      </lineSegments>

      {/* ── Blade + cutting sparks ── */}
      <mesh ref={bladeRef} position={homes.blade} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.012, 32]} />
        <meshPhysicalMaterial color="#d4d8da" metalness={0.95} roughness={0.12} clearcoat={0.5} transparent opacity={0} />
      </mesh>
      {sparkSeeds.map((_, i) => (
        <mesh key={i} ref={(el) => { sparkRefs.current[i] = el; }} visible={false}>
          <boxGeometry args={[0.02, 0.02, 0.06]} />
          <meshStandardMaterial color="#f0a552" emissive="#f0a552" emissiveIntensity={1.8} transparent opacity={0} />
        </mesh>
      ))}

      {/* ── Angle profile ── */}
      <mesh ref={angleRef} rotation={[0, Math.PI / 2, 0]} position={homes.angleFormed}
        castShadow receiveShadow visible={false}>
        <extrudeGeometry args={angleGeomArgs as any} />
        <meshPhysicalMaterial color="#bcc0c4" roughness={0.24} metalness={0.88}
          clearcoat={0.45} clearcoatRoughness={0.15} envMapIntensity={1.5} transparent />
      </mesh>
      <lineSegments ref={angleEdgesRef} rotation={[0, Math.PI / 2, 0]} position={homes.angleFormed} visible={false}>
        <edgesGeometry args={[new THREE.ExtrudeGeometry(angleShape, { depth: 1.8, bevelEnabled: false })]} />
        <lineBasicMaterial color="#b5713c" transparent opacity={0} />
      </lineSegments>

      {/* ── Threaded rod ── */}
      <mesh ref={rodRef} rotation={[0, 0, Math.PI / 2]} position={homes.rodFormed}
        castShadow receiveShadow visible={false}>
        <cylinderGeometry args={[0.09, 0.09, 1.9, 24]} />
        <meshPhysicalMaterial color="#bcc0c4" roughness={0.24} metalness={0.88}
          clearcoat={0.45} clearcoatRoughness={0.15} envMapIntensity={1.5} transparent />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} ref={(el) => { threadRefs.current[i] = el; }}
          rotation={[0, Math.PI / 2, 0]}
          position={homes.rodFormed.clone().add(new THREE.Vector3(-0.72 + i * 0.16, 0, 0))}
          visible={false}>
          <torusGeometry args={[0.1, 0.012, 8, 16]} />
          <meshStandardMaterial color="#aab0b4" roughness={0.35} metalness={0.7} envMapIntensity={1.3} transparent />
        </mesh>
      ))}

      {/* ── Coat tank ── */}
      <mesh ref={tankRef} position={[PIVOT_X, 0.12, 0]}>
        <boxGeometry args={[3.2, 0.01, 2.2]} />
        <meshStandardMaterial color="#b5713c" roughness={0.2} metalness={0.1} transparent opacity={0} />
      </mesh>

      {/* ── Install frame ── */}
      <group ref={frameRef} position={[PIVOT_X, 0, 0]} visible={false}>
        {[[-1, -0.6], [1, -0.6], [-1, 0.6], [1, 0.6]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.55, z]} castShadow>
            <boxGeometry args={[0.09, 1.1, 0.09]} />
            <meshStandardMaterial color="#222426" roughness={0.5} metalness={0.65} envMapIntensity={1.2} transparent />
          </mesh>
        ))}
        {[0.15, 1.05].map((y) =>
          [-0.6, 0.6].map((z, zi) => (
            <mesh key={`${y}-${zi}`} position={[0, y, z]}>
              <boxGeometry args={[2.1, 0.07, 0.07]} />
              <meshStandardMaterial color="#222426" roughness={0.5} metalness={0.65} envMapIntensity={1.2} transparent />
            </mesh>
          ))
        )}
      </group>

      {/* ── Install tray ── */}
      <group ref={trayRef} position={[PIVOT_X + 2.1, 0, 0.2]} visible={false}>
        <mesh position={[0, 0.11, 0]} castShadow>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color="#9aa0a3" roughness={0.45} metalness={0.6} envMapIntensity={1.2} transparent opacity={0} />
        </mesh>
        <mesh position={[0.4, 0.11, 0.1]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.24, 16]} />
          <meshStandardMaterial color="#d48828" roughness={0.25} metalness={0.15} envMapIntensity={1.3} transparent opacity={0} />
        </mesh>
        <mesh position={[-0.35, 0.1, 0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.12, 0.03, 12, 24]} />
          <meshStandardMaterial color="#9aa0a3" roughness={0.45} metalness={0.6} envMapIntensity={1.2} transparent opacity={0} />
        </mesh>
        <mesh position={[0.1, 0.16, -0.3]} castShadow>
          <boxGeometry args={[0.5, 0.03, 0.35]} />
          <meshStandardMaterial color="#6b6e70" roughness={0.55} metalness={0.4} envMapIntensity={1.1} transparent opacity={0} />
        </mesh>
      </group>
    </>
  );
}

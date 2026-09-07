"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------
   5 acts: stock -> cut -> form -> coat -> install
   Kept in sync with HeroSection.tsx's PROCESS_STAGES array —
   only the numeric progress (0..5) crosses that boundary.
   ------------------------------------------------------------ */
export const ACT_COUNT = 5;

// Camera distances pulled in ~10-12% vs v1 for more presence in frame.
const CAMERA_KEYFRAMES = [
  { az: 0.38, pol: 0.22, dist: 5.7, lookY: 0.35 },
  { az: 0.78, pol: 0.36, dist: 4.6, lookY: 0.46 },
  { az: 0.22, pol: 0.30, dist: 5.5, lookY: 0.52 },
  { az: -0.32, pol: 0.48, dist: 5.1, lookY: 0.55 },
  { az: 0.36, pol: 0.30, dist: 7.2, lookY: 0.78 },
];
const LIGHT_KEYFRAMES = [
  { fog: "#101112", key: "#d9dbdc", keyI: 1.35, rim: "#6b7785", rimI: 0.55, hemiI: 0.5 },
  { fog: "#101112", key: "#f1ece2", keyI: 1.5, rim: "#c47c43", rimI: 0.68, hemiI: 0.48 },
  { fog: "#131413", key: "#f1ece2", keyI: 1.4, rim: "#6b7785", rimI: 0.58, hemiI: 0.46 },
  { fog: "#16120c", key: "#d69463", keyI: 1.5, rim: "#c47c43", rimI: 0.72, hemiI: 0.48 },
  { fog: "#101112", key: "#f1ece2", keyI: 1.4, rim: "#c47c43", rimI: 0.58, hemiI: 0.5 },
];

const PIVOT_X = 0;
// Fixed base opacities for the HUD rings, indexed to match render order below —
// avoids reading back an already-scaled value each frame (which would drift).
const HUD_BASE_OPACITY = [0.25, 0.15];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Critically-damped spring toward a target — same algorithm as Unity's
 * SmoothDamp / Game Programming Gems "Semi-Implicit Euler" smoothing.
 * Frame-rate independent, no overshoot, has real momentum (unlike a plain
 * exponential lerp which just looks like it does).
 */
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

interface Props {
  progressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  isMobile: boolean;
}

export default function MaterialJourneyScene({ progressRef, reducedMotion, isMobile }: Props) {
  const { camera, size } = useThree();
  const fogRef = useRef<THREE.Fog>(null!);

  useEffect(() => {
    return () => {
      if (camera instanceof THREE.PerspectiveCamera) camera.clearViewOffset();
    };
  }, [camera]);

  const keyRef = useRef<THREE.DirectionalLight>(null!);
  const rimRef = useRef<THREE.DirectionalLight>(null!);
  const hemiRef = useRef<THREE.HemisphereLight>(null!);
  const accentRef = useRef<THREE.PointLight>(null!);

  const billetRef = useRef<THREE.Mesh>(null!);
  const machinedRef = useRef<THREE.Mesh>(null!);
  const machinedEdgesRef = useRef<THREE.LineSegments>(null!);
  const bladeRef = useRef<THREE.Mesh>(null!);
  const angleRef = useRef<THREE.Mesh>(null!);
  const angleEdgesRef = useRef<THREE.LineSegments>(null!);
  const rodRef = useRef<THREE.Mesh>(null!);
  const threadRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tankRef = useRef<THREE.Mesh>(null!);
  const frameRef = useRef<THREE.Group>(null!);
  const trayRef = useRef<THREE.Group>(null!);
  const sparkRefs = useRef<(THREE.Mesh | null)[]>([]);
  const assemblyRef = useRef<THREE.Group>(null!);
  const hudRef = useRef<THREE.Group>(null!);

  const sparkLightRef = useRef<THREE.PointLight>(null!);

  // --- camera spring + mouse parallax state --------------------------------
  const camPosRef = useRef(new THREE.Vector3(0, 0.6, 7.2));
  const camVelRef = useRef(new THREE.Vector3());
  const camLookRef = useRef(new THREE.Vector3(PIVOT_X, 0.4, 0));
  const camLookVelRef = useRef(new THREE.Vector3());
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const handleMove = (e: PointerEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    // Window, not canvas — the canvas wrapper is pointer-events:none so page
    // content stays clickable, meaning R3F's own pointer state never updates.
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reducedMotion, isMobile]);
  // --------------------------------------------------------------------------

  const colors = useMemo(
    () => ({
      machinedA: new THREE.Color("#b9bcbe"),
      galv: new THREE.Color("#9aa0a3"),
      epoxy: new THREE.Color("#d6a032"),
      fogA: new THREE.Color(),
      fogB: new THREE.Color(),
      keyA: new THREE.Color(),
      keyB: new THREE.Color(),
      rimA: new THREE.Color(),
      rimB: new THREE.Color(),
    }),
    []
  );

  const angleShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.lineTo(0.5, 0); s.lineTo(0.5, 0.12);
    s.lineTo(0.12, 0.12); s.lineTo(0.12, 0.5); s.lineTo(0, 0.5); s.lineTo(0, 0);
    return s;
  }, []);

  // Bevelled extrusion — chamfered edges instead of razor-sharp CG edges.
  const angleGeomArgs = useMemo(
    () => [
      angleShape,
      { depth: 1.8, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.014, bevelSegments: 3, curveSegments: 12 },
    ] as const,
    [angleShape]
  );

  const homes = useMemo(
    () => ({
      billet: new THREE.Vector3(PIVOT_X, 0.6, 0),
      machined: new THREE.Vector3(PIVOT_X, 0.6, 0),
      angleFormed: new THREE.Vector3(PIVOT_X - 0.7, 0.55, 0.5),
      rodFormed: new THREE.Vector3(PIVOT_X + 0.7, 0.55, -0.5),
      angleInstall: new THREE.Vector3(PIVOT_X - 0.45, 0.55, 0),
      rodInstall: new THREE.Vector3(PIVOT_X + 0.45, 0.55, 0),
      blade: new THREE.Vector3(PIVOT_X, 0.9, 0),
    }),
    []
  );

  const sparkSeeds = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        angle: (i / 24) * Math.PI * 2 + Math.random() * 0.4,
        speed: 0.8 + Math.random() * 0.7,
        drop: 0.6 + Math.random() * 0.8,
      })),
    []
  );

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05); // clamp to avoid spring blow-ups on tab-refocus
    const progress = progressRef.current;
    const idx = Math.min(ACT_COUNT - 1, Math.floor(progress));
    const t = clamp01(progress - idx);
    const ease = smoothstep(t);

    const cutT = idx === 0 ? ease : idx > 0 ? 1 : 0;
    const formT = idx < 1 ? 0 : idx === 1 ? ease : idx > 1 ? 1 : 0;
    const coatT = idx < 2 ? 0 : idx === 2 ? ease : idx > 2 ? 1 : 0;
    const installT = idx < 3 ? 0 : idx === 3 ? ease : idx > 3 ? 1 : 0;

    // --- stock -> cut crossfade
    if (billetRef.current) {
      const mat = billetRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 1 - cutT;
      billetRef.current.visible = cutT < 0.98;
    }
    const machinedVis = clamp01(cutT) * (1 - formT);
    if (machinedRef.current) {
      const mat = machinedRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = machinedVis;
      machinedRef.current.visible = machinedVis > 0.01;
    }
    if (machinedEdgesRef.current) {
      const mat = machinedEdgesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = machinedVis * 0.35;
      machinedEdgesRef.current.visible = machinedVis > 0.01;
    }

    // --- cut moment: restrained blade pass + brief spark burst
    let cutMomentT = 0;
    if (idx === 0) cutMomentT = Math.sin(Math.PI * t);
    const isCuttingActive = idx === 0 && t > 0.38 && t < 0.72 && !reducedMotion;
    if (bladeRef.current) {
      const mat = bladeRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = cutMomentT * 0.85;
      bladeRef.current.position.x = homes.blade.x - 0.55 + t * 1.1;
    }
    if (sparkLightRef.current) {
      sparkLightRef.current.intensity = isCuttingActive ? 2.0 * Math.sin(Math.PI * ((t - 0.38) / 0.34)) : 0;
      sparkLightRef.current.position.set(homes.blade.x - 0.55 + t * 1.1, 0.9, 0);
    }
    sparkRefs.current.forEach((s, i) => {
      if (!s) return;
      const seed = sparkSeeds[i];
      const local = isCuttingActive ? clamp01((t - 0.38) / 0.34) : 0;
      s.visible = isCuttingActive;
      if (isCuttingActive) {
        const dist = local * seed.speed;
        s.position.set(
          homes.blade.x - 0.55 + t * 1.1 + Math.cos(seed.angle) * dist * 0.4,
          0.9 + Math.sin(seed.angle) * dist * 0.3 - local * local * seed.drop,
          Math.sin(seed.angle) * dist * 0.4
        );
        (s.material as THREE.MeshStandardMaterial).opacity = 1 - local;
      }
    });

    // --- form: machined bar becomes an angle profile + a threaded rod
    const formPos = smoothstep(formT);
    if (angleRef.current) {
      angleRef.current.position.lerpVectors(homes.machined, homes.angleFormed, formPos);
      const mat = angleRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = formT;
      angleRef.current.visible = formT > 0.01;
    }
    if (angleEdgesRef.current) {
      angleEdgesRef.current.position.copy(angleRef.current?.position ?? homes.angleFormed);
      (angleEdgesRef.current.material as THREE.LineBasicMaterial).opacity = formT * 0.35;
      angleEdgesRef.current.visible = formT > 0.01;
    }
    if (rodRef.current) {
      rodRef.current.position.lerpVectors(homes.machined, homes.rodFormed, formPos);
      const mat = rodRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = formT;
      rodRef.current.visible = formT > 0.01;
    }
    threadRefs.current.forEach((th, i) => {
      if (!th) return;
      const home = homes.rodFormed.clone().add(new THREE.Vector3(-0.72 + i * 0.16, 0, 0));
      th.position.lerpVectors(homes.machined, home, formPos);
      const mat = th.material as THREE.MeshStandardMaterial;
      mat.opacity = formT;
      th.visible = formT > 0.01;
    });

    // --- coat: dip tank rises once, materials settle into final finishes
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
      mat.roughness = lerp(0.38, 0.48, coatT);
      mat.metalness = lerp(0.7, 0.58, coatT);
      mat.clearcoat = lerp(0.5, 0.25, coatT);
    }
    if (rodRef.current) {
      const mat = rodRef.current.material as THREE.MeshPhysicalMaterial;
      mat.color.lerpColors(colors.machinedA, colors.epoxy, coatT);
      mat.roughness = lerp(0.38, 0.22, coatT);
      mat.metalness = lerp(0.7, 0.06, coatT);
      mat.clearcoat = lerp(0.5, 0.75, coatT);
    }
    threadRefs.current.forEach((th) => {
      if (!th) return;
      (th.material as THREE.MeshStandardMaterial).color.lerpColors(colors.machinedA, colors.epoxy, coatT);
    });

    // --- install: pieces settle onto the frame
    if (frameRef.current) {
      frameRef.current.visible = installT > 0.01;
      frameRef.current.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = installT;
        }
      });
    }
    if (angleRef.current) angleRef.current.position.lerp(homes.angleInstall, installT * 0.05);
    if (rodRef.current) rodRef.current.position.lerp(homes.rodInstall, installT * 0.05);
    if (trayRef.current) {
      trayRef.current.visible = installT > 0.01;
      trayRef.current.children.forEach((c) => {
        const mesh = c as THREE.Mesh;
        (mesh.material as THREE.MeshStandardMaterial).opacity = installT * 0.9;
        mesh.scale.setScalar(lerp(0.7, 1, installT));
      });
    }

    // --- camera + light keyframes -------------------------------------
    const camA = CAMERA_KEYFRAMES[idx];
    const camB = CAMERA_KEYFRAMES[Math.min(idx + 1, ACT_COUNT - 1)];
    const az = lerp(camA.az, camB.az, ease);
    const pol = lerp(camA.pol, camB.pol, ease);
    const dist = lerp(camA.dist, camB.dist, ease) * (isMobile ? 1.18 : 1);
    const lookY = lerp(camA.lookY, camB.lookY, ease);

    const targetPos = new THREE.Vector3(
      PIVOT_X + dist * Math.sin(az) * Math.cos(pol),
      dist * Math.sin(pol) + 0.6,
      dist * Math.cos(az) * Math.cos(pol)
    );

    // Subtle cursor parallax layered on top of the scroll target.
    const parallaxX = reducedMotion || isMobile ? 0 : mouseRef.current.x * 0.3;
    const parallaxY = reducedMotion || isMobile ? 0 : -mouseRef.current.y * 0.15;
    targetPos.x += parallaxX;
    targetPos.y += parallaxY;
    const targetLook = new THREE.Vector3(PIVOT_X + parallaxX * 0.4, lookY, 0);

    if (reducedMotion) {
      camPosRef.current.copy(targetPos);
      camLookRef.current.copy(targetLook);
    } else {
      // Position lags slightly more than the look-target — a small
      // cinematography trick that reads as "operator-driven camera"
      // rather than "object parented to a rail."
      springTowards(camPosRef.current, camVelRef.current, targetPos, isMobile ? 0.22 : 0.3, dt);
      springTowards(camLookRef.current, camLookVelRef.current, targetLook, isMobile ? 0.16 : 0.22, dt);
    }

    camera.position.copy(camPosRef.current);
    camera.lookAt(camLookRef.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      // Asymmetric frustum shift so the object sits right-of-center, clearing
      // the left safe-zone for text. Pulled in from 1.55 -> 1.28: the old
      // value cropped too aggressively and shrank the object's presence.
      const shiftFactor = isMobile ? 1 : 1.28;
      camera.setViewOffset(size.width * shiftFactor, size.height, 0, 0, size.width, size.height);
      camera.updateProjectionMatrix();
    }
    // ---------------------------------------------------------------------

    const lgA = LIGHT_KEYFRAMES[idx];
    const lgB = LIGHT_KEYFRAMES[Math.min(idx + 1, ACT_COUNT - 1)];
    if (fogRef.current) {
      colors.fogA.set(lgA.fog); colors.fogB.set(lgB.fog);
      fogRef.current.color.lerpColors(colors.fogA, colors.fogB, ease);
    }
    if (keyRef.current) {
      colors.keyA.set(lgA.key); colors.keyB.set(lgB.key);
      keyRef.current.color.lerpColors(colors.keyA, colors.keyB, ease);
      keyRef.current.intensity = lerp(lgA.keyI, lgB.keyI, ease);
    }
    if (rimRef.current) {
      colors.rimA.set(lgA.rim); colors.rimB.set(lgB.rim);
      rimRef.current.color.lerpColors(colors.rimA, colors.rimB, ease);
      rimRef.current.intensity = lerp(lgA.rimI, lgB.rimI, ease);
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = lerp(lgA.hemiI, lgB.hemiI, ease);
    }
    if (accentRef.current) {
      // Warm accent light near the assembly — ties the HUD/rim palette
      // together and gives the metal a second highlight to catch.
      accentRef.current.intensity = lerp(0.55, 0.85, coatT) * (reducedMotion ? 1 : 1);
      accentRef.current.color.copy(rimRef.current?.color ?? new THREE.Color("#c47c43"));
    }

    // --- HUD rings: slow rotation + brightness tied to key light, so the
    // flat CAD overlay feels like part of the same lit scene, not a sticker.
    if (hudRef.current) {
      hudRef.current.rotation.z += dt * 0.035;
      const glow = lerp(0.6, 1, clamp01((keyRef.current?.intensity ?? 1.2) / 1.5));
      hudRef.current.children.forEach((c, i) => {
        const mesh = c as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = HUD_BASE_OPACITY[i] * glow;
      });
    }
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={["#0d0e0f", 9, 24]} />
      <hemisphereLight ref={hemiRef} args={["#ece7db", "#0d0e0f", 0.5]} />
      <directionalLight
        ref={keyRef}
        position={[5.5 + PIVOT_X, 8.5, 4.5]}
        intensity={1.35}
        color="#d9dbdc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight ref={rimRef} position={[-5 + PIVOT_X, 3.5, -4]} intensity={0.55} color="#57616b" />
      <pointLight ref={accentRef} position={[PIVOT_X + 1, 1.2, 1.5]} intensity={0.6} color="#c47c43" distance={5} decay={2} />
      <pointLight ref={sparkLightRef} color="#ffaa44" intensity={0} distance={3} />

      {/* Environment reflections — restored to "warehouse" */}
      <Environment preset="warehouse" resolution={isMobile ? 128 : 256} background={false} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PIVOT_X, 0, 0]} receiveShadow>
        <circleGeometry args={[14, 48]} />
        <meshStandardMaterial color="#121314" roughness={1} transparent opacity={0.5} />
      </mesh>
      <gridHelper args={[14, 28, "#2a2c2e", "#18191a"]} position={[PIVOT_X, 0.001, 0]} />

      <ContactShadows
        position={[PIVOT_X, 0.002, 0]}
        opacity={0.55}
        scale={12}
        blur={2.2}
        far={4}
        resolution={isMobile ? 256 : 512}
        color="#000000"
      />

      {/* CAD Blueprint Concentric Rings HUD — now rotates slowly and breathes
          with the key light instead of sitting static under the scene. */}
      <group ref={hudRef} position={[PIVOT_X, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.8, 2.82, 64]} />
          <meshBasicMaterial color="#875E48" transparent opacity={0.25} />
        </mesh>
        <mesh>
          <ringGeometry args={[4.5, 4.52, 64]} />
          <meshBasicMaterial color="#96938B" transparent opacity={0.15} />
        </mesh>
      </group>

      {/* Traveling Manufacturing Assembly Group */}
      <group ref={assemblyRef} position={[0, 0, 0]}>
        {/* stock — chamfered edges via RoundedBox instead of raw BoxGeometry */}
        <RoundedBox ref={billetRef} args={[2.6, 0.55, 0.55]} radius={0.035} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial color="#4c4e50" roughness={0.5} metalness={0.72} clearcoat={0.15} clearcoatRoughness={0.4} envMapIntensity={1.1} transparent />
        </RoundedBox>

        {/* machined */}
        <RoundedBox ref={machinedRef} args={[2.3, 0.42, 0.42]} radius={0.03} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial color="#c2c5c8" roughness={0.2} metalness={0.9} clearcoat={0.5} clearcoatRoughness={0.15} envMapIntensity={1.4} transparent />
        </RoundedBox>
        <lineSegments ref={machinedEdgesRef} position={homes.machined}>
          <edgesGeometry args={[new THREE.BoxGeometry(2.3, 0.42, 0.42)]} />
          <lineBasicMaterial color="#b5713c" transparent opacity={0} />
        </lineSegments>

        {/* restrained cut pass + sparks */}
        <mesh ref={bladeRef} position={homes.blade} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.012, 32]} />
          <meshPhysicalMaterial color="#d6d8d9" metalness={0.95} roughness={0.1} clearcoat={0.6} transparent opacity={0} />
        </mesh>
        {sparkSeeds.map((_, i) => (
          <mesh key={i} ref={(el) => { sparkRefs.current[i] = el; }} visible={false}>
            <boxGeometry args={[0.02, 0.02, 0.06]} />
            <meshStandardMaterial color="#e8a45c" emissive="#e8a45c" emissiveIntensity={1.6} transparent opacity={0} />
          </mesh>
        ))}

        {/* formed — bevelled extrusion (angleGeomArgs has bevelEnabled: true) */}
        <mesh ref={angleRef} rotation={[0, Math.PI / 2, 0]} position={homes.angleFormed} castShadow receiveShadow visible={false}>
          <extrudeGeometry args={angleGeomArgs as any} />
          <meshPhysicalMaterial color="#c2c5c8" roughness={0.22} metalness={0.88} clearcoat={0.5} clearcoatRoughness={0.15} envMapIntensity={1.4} transparent />
        </mesh>
        <lineSegments ref={angleEdgesRef} rotation={[0, Math.PI / 2, 0]} position={homes.angleFormed} visible={false}>
          <edgesGeometry args={[new THREE.ExtrudeGeometry(angleShape, { depth: 1.8, bevelEnabled: false })]} />
          <lineBasicMaterial color="#b5713c" transparent opacity={0} />
        </lineSegments>
        <mesh ref={rodRef} rotation={[0, 0, Math.PI / 2]} position={homes.rodFormed} castShadow receiveShadow visible={false}>
          <cylinderGeometry args={[0.09, 0.09, 1.9, 24]} />
          <meshPhysicalMaterial color="#c2c5c8" roughness={0.22} metalness={0.88} clearcoat={0.5} clearcoatRoughness={0.15} envMapIntensity={1.4} transparent />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={i}
            ref={(el) => { threadRefs.current[i] = el; }}
            rotation={[0, Math.PI / 2, 0]}
            position={homes.rodFormed.clone().add(new THREE.Vector3(-0.72 + i * 0.16, 0, 0))}
            visible={false}
          >
            <torusGeometry args={[0.1, 0.012, 8, 16]} />
            <meshStandardMaterial color="#b9bcbe" roughness={0.4} metalness={0.65} envMapIntensity={1.2} transparent />
          </mesh>
        ))}
      </group>

      {/* coat */}
      <mesh ref={tankRef} position={[PIVOT_X, 0.12, 0]}>
        <boxGeometry args={[3.2, 0.01, 2.2]} />
        <meshStandardMaterial color="#b5713c" roughness={0.15} metalness={0.1} transparent opacity={0} />
      </mesh>

      {/* install: frame */}
      <group ref={frameRef} position={[PIVOT_X, 0, 0]} visible={false}>
        {[[-1, -0.6], [1, -0.6], [-1, 0.6], [1, 0.6]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.55, z]} castShadow>
            <boxGeometry args={[0.09, 1.1, 0.09]} />
            <meshStandardMaterial color="#2a2b2c" roughness={0.55} metalness={0.65} envMapIntensity={1.1} transparent />
          </mesh>
        ))}
        {[0.15, 1.05].map((y) =>
          [-0.6, 0.6].map((z, zi) => (
            <mesh key={`${y}-${zi}`} position={[0, y, z]}>
              <boxGeometry args={[2.1, 0.07, 0.07]} />
              <meshStandardMaterial color="#2a2b2c" roughness={0.55} metalness={0.65} envMapIntensity={1.1} transparent />
            </mesh>
          ))
        )}
      </group>

      {/* install: grounded tray of finished parts */}
      <group ref={trayRef} position={[PIVOT_X + 2.1, 0, 0.2]} visible={false}>
        <mesh position={[0, 0.11, 0]} castShadow>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color="#9aa0a3" roughness={0.45} metalness={0.6} envMapIntensity={1.2} transparent opacity={0} />
        </mesh>
        <mesh position={[0.4, 0.11, 0.1]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.24, 16]} />
          <meshStandardMaterial color="#d6a032" roughness={0.28} metalness={0.1} envMapIntensity={1.2} transparent opacity={0} />
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

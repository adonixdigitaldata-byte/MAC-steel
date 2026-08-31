"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------
   5 acts: stock -> cut -> form -> coat -> install
   Kept in sync with HeroSection.tsx's PROCESS_STAGES array —
   only the numeric progress (0..5) crosses that boundary.
   ------------------------------------------------------------ */
export const ACT_COUNT = 5;

const CAMERA_KEYFRAMES = [
  { az: 0.5, pol: 0.26, dist: 7.2, lookY: 0.35 },
  { az: 0.82, pol: 0.34, dist: 6.2, lookY: 0.45 },
  { az: 0.18, pol: 0.3, dist: 6.8, lookY: 0.55 },
  { az: -0.22, pol: 0.4, dist: 5.9, lookY: 0.62 },
  { az: 0.34, pol: 0.32, dist: 8.6, lookY: 0.8 },
];
const LIGHT_KEYFRAMES = [
  { fog: "#101112", key: "#d9dbdc", keyI: 1.15, rim: "#6b7785", rimI: 0.45, hemiI: 0.52 },
  { fog: "#101112", key: "#f1ece2", keyI: 1.25, rim: "#c47c43", rimI: 0.55, hemiI: 0.50 },
  { fog: "#131413", key: "#f1ece2", keyI: 1.20, rim: "#6b7785", rimI: 0.48, hemiI: 0.48 },
  { fog: "#16120c", key: "#d69463", keyI: 1.25, rim: "#c47c43", rimI: 0.58, hemiI: 0.50 },
  { fog: "#101112", key: "#f1ece2", keyI: 1.20, rim: "#c47c43", rimI: 0.48, hemiI: 0.52 },
];



// Object travels naturally through the frame. Text readability is
// handled entirely by the scrim layer, not by displacing the object.
const PIVOT_X = 0;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
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
      Array.from({ length: 10 }, (_, i) => ({
        angle: (i / 10) * Math.PI * 2 + Math.random() * 0.3,
        speed: 0.6 + Math.random() * 0.5,
        drop: 0.5 + Math.random() * 0.6,
      })),
    []
  );

  useFrame(() => {
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
      mat.opacity = machinedVis * 0.4;
      machinedEdgesRef.current.visible = machinedVis > 0.01;
    }

    // --- cut moment: restrained blade pass + brief spark burst (no big glow plane)
    let cutMomentT = 0;
    if (idx === 0) cutMomentT = Math.sin(Math.PI * t);
    if (bladeRef.current) {
      const mat = bladeRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = cutMomentT * 0.85;
      bladeRef.current.position.x = homes.blade.x - 0.55 + t * 1.1;
    }
    sparkRefs.current.forEach((s, i) => {
      if (!s) return;
      const seed = sparkSeeds[i];
      const active = idx === 0 && t > 0.38 && t < 0.72 && !reducedMotion;
      const local = active ? clamp01((t - 0.38) / 0.34) : 0;
      s.visible = active;
      if (active) {
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
      (angleEdgesRef.current.material as THREE.LineBasicMaterial).opacity = formT * 0.4;
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
      const mat = angleRef.current.material as THREE.MeshStandardMaterial;
      mat.color.lerpColors(colors.machinedA, colors.galv, coatT);
      mat.roughness = lerp(0.42, 0.5, coatT);
      mat.metalness = lerp(0.65, 0.55, coatT);
    }
    if (rodRef.current) {
      const mat = rodRef.current.material as THREE.MeshStandardMaterial;
      mat.color.lerpColors(colors.machinedA, colors.epoxy, coatT);
      mat.roughness = lerp(0.42, 0.28, coatT);
      mat.metalness = lerp(0.65, 0.08, coatT);
    }
    threadRefs.current.forEach((th) => {
      if (!th) return;
      (th.material as THREE.MeshStandardMaterial).color.lerpColors(colors.machinedA, colors.epoxy, coatT);
    });

    // --- install: pieces settle onto the frame, a grounded tray of finished
    // parts fades in (static — no orbiting cliché), camera pulls back
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

    // --- camera + light keyframes
    const camA = CAMERA_KEYFRAMES[idx];
    const camB = CAMERA_KEYFRAMES[Math.min(idx + 1, ACT_COUNT - 1)];
    const az = lerp(camA.az, camB.az, ease);
    const pol = lerp(camA.pol, camB.pol, ease);
    const dist = lerp(camA.dist, camB.dist, ease) * (isMobile ? 1.18 : 1);
    const lookY = lerp(camA.lookY, camB.lookY, ease);

    camera.position.set(
      PIVOT_X + dist * Math.sin(az) * Math.cos(pol),
      dist * Math.sin(pol) + 0.6,
      dist * Math.cos(az) * Math.cos(pol)
    );
    camera.lookAt(PIVOT_X, lookY, 0);

    if (camera instanceof THREE.PerspectiveCamera) {
      const shiftFactor = isMobile ? 1 : 1.55;
      camera.setViewOffset(size.width * shiftFactor, size.height, 0, 0, size.width, size.height);
      camera.updateProjectionMatrix();
    }



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
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={["#0d0e0f", 9, 24]} />
      <hemisphereLight ref={hemiRef} args={["#ece7db", "#0d0e0f", 0.5]} />
      <directionalLight ref={keyRef} position={[5 + PIVOT_X, 8, 4]} intensity={1.05} color="#d9dbdc" castShadow />
      <directionalLight ref={rimRef} position={[-5 + PIVOT_X, 3, -4]} intensity={0.35} color="#57616b" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PIVOT_X, 0, 0]} receiveShadow>
        <circleGeometry args={[14, 48]} />
        <meshStandardMaterial color="#121314" roughness={1} transparent opacity={0.5} />
      </mesh>
      <gridHelper args={[14, 28, "#2a2c2e", "#18191a"]} position={[PIVOT_X, 0.001, 0]} />

      {/* Traveling Manufacturing Assembly Group */}
      <group ref={assemblyRef} position={[0, 0, 0]}>
        {/* stock */}
        <mesh ref={billetRef} position={homes.billet} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.55, 0.55]} />
          <meshStandardMaterial color="#54524d" roughness={0.95} metalness={0.25} transparent />
        </mesh>

        {/* machined */}
        <mesh ref={machinedRef} position={homes.machined} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.42, 0.42]} />
          <meshStandardMaterial color="#b9bcbe" roughness={0.42} metalness={0.65} transparent />
        </mesh>
        <lineSegments ref={machinedEdgesRef} position={homes.machined}>
          <edgesGeometry args={[new THREE.BoxGeometry(2.3, 0.42, 0.42)]} />
          <lineBasicMaterial color="#b5713c" transparent opacity={0} />
        </lineSegments>

        {/* restrained cut pass + sparks (replaces a big emissive glow plane) */}
        <mesh ref={bladeRef} position={homes.blade} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.012, 24]} />
          <meshStandardMaterial color="#d6d8d9" metalness={0.9} roughness={0.15} transparent opacity={0} />
        </mesh>
        {sparkSeeds.map((_, i) => (
          <mesh key={i} ref={(el) => { sparkRefs.current[i] = el; }} visible={false}>
            <boxGeometry args={[0.02, 0.02, 0.06]} />
            <meshStandardMaterial color="#e8a45c" emissive="#e8a45c" emissiveIntensity={1.4} transparent opacity={0} />
          </mesh>
        ))}

        {/* formed */}
        <mesh ref={angleRef} rotation={[0, Math.PI / 2, 0]} position={homes.angleFormed} castShadow receiveShadow visible={false}>
          <extrudeGeometry args={[angleShape, { depth: 1.8, bevelEnabled: false }]} />
          <meshStandardMaterial color="#b9bcbe" roughness={0.42} metalness={0.65} transparent />
        </mesh>
        <lineSegments ref={angleEdgesRef} rotation={[0, Math.PI / 2, 0]} position={homes.angleFormed} visible={false}>
          <edgesGeometry args={[new THREE.ExtrudeGeometry(angleShape, { depth: 1.8, bevelEnabled: false })]} />
          <lineBasicMaterial color="#b5713c" transparent opacity={0} />
        </lineSegments>
        <mesh ref={rodRef} rotation={[0, 0, Math.PI / 2]} position={homes.rodFormed} castShadow receiveShadow visible={false}>
          <cylinderGeometry args={[0.09, 0.09, 1.9, 16]} />
          <meshStandardMaterial color="#b9bcbe" roughness={0.42} metalness={0.65} transparent />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={i}
            ref={(el) => { threadRefs.current[i] = el; }}
            rotation={[0, Math.PI / 2, 0]}
            position={homes.rodFormed.clone().add(new THREE.Vector3(-0.72 + i * 0.16, 0, 0))}
            visible={false}
          >
            <torusGeometry args={[0.1, 0.012, 6, 12]} />
            <meshStandardMaterial color="#b9bcbe" roughness={0.42} metalness={0.65} transparent />
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
            <meshStandardMaterial color="#2a2b2c" roughness={0.6} metalness={0.6} transparent />
          </mesh>
        ))}
        {[0.15, 1.05].map((y) =>
          [-0.6, 0.6].map((z, zi) => (
            <mesh key={`${y}-${zi}`} position={[0, y, z]}>
              <boxGeometry args={[2.1, 0.07, 0.07]} />
              <meshStandardMaterial color="#2a2b2c" roughness={0.6} metalness={0.6} transparent />
            </mesh>
          ))
        )}
      </group>

      {/* install: grounded tray of finished parts — static, not orbiting */}
      <group ref={trayRef} position={[PIVOT_X + 2.1, 0, 0.2]} visible={false}>
        <mesh position={[0, 0.11, 0]} castShadow>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color="#9aa0a3" roughness={0.5} metalness={0.55} transparent opacity={0} />
        </mesh>
        <mesh position={[0.4, 0.11, 0.1]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.24, 12]} />
          <meshStandardMaterial color="#d6a032" roughness={0.3} metalness={0.1} transparent opacity={0} />
        </mesh>
        <mesh position={[-0.35, 0.1, 0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.12, 0.03, 8, 16]} />
          <meshStandardMaterial color="#9aa0a3" roughness={0.5} metalness={0.55} transparent opacity={0} />
        </mesh>
        <mesh position={[0.1, 0.16, -0.3]} castShadow>
          <boxGeometry args={[0.5, 0.03, 0.35]} />
          <meshStandardMaterial color="#6b6e70" roughness={0.6} metalness={0.4} transparent opacity={0} />
        </mesh>
      </group>
    </>
  );
}

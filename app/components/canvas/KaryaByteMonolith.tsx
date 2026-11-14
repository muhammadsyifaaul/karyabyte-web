"use client";

/**
 * KaryaByteMonolith — Phase 2 + Phase 3
 * ─────────────────────────────────────────────────────────────────────────────
 * Procedural 3D "K" emblem: 3 separate addressable mesh parts.
 *
 *  Part A — Left Vertical Pillar   (System Architecture)
 *  Part B — Upper-Right Blade      (UI/UX Craft)
 *  Part C — Lower-Right Blade      (Agile Delivery)
 *
 * Phase 3 additions:
 *  • Exposes groupRef, partARef, partBRef, partCRef via forwardRef-style
 *    callback so the scroll hook can read/write positions directly.
 *  • scroll targets are stored in scrollTarget ref; useFrame lerps toward them.
 *
 * Guardrails (AGENTS.md § 5):
 *  • NEVER mutate React state inside useFrame
 *  • Dispose geometries / materials on unmount
 */

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../../store/useSceneStore";

/* ─── Bevel configs ─────────────────────────────────────────────────────────*/
const BEVEL_D = { bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 5 };
const BEVEL_M = { bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 2 };

function buildExtruded(shape: THREE.Shape, depth: number, mob: boolean) {
  return new THREE.ExtrudeGeometry(shape, { depth, ...(mob ? BEVEL_M : BEVEL_D) });
}

/* ─── Shapes ────────────────────────────────────────────────────────────────*/
function buildPillarShape(): THREE.Shape {
  const w = 0.38, h = 2.0, r = 0.09;
  const s = new THREE.Shape();
  s.moveTo(-w/2+r, -h/2);
  s.lineTo(w/2-r,  -h/2);  s.quadraticCurveTo(w/2,  -h/2, w/2,  -h/2+r);
  s.lineTo(w/2,    h/2-r); s.quadraticCurveTo(w/2,   h/2,  w/2-r, h/2);
  s.lineTo(-w/2+r, h/2);   s.quadraticCurveTo(-w/2,  h/2,  -w/2,  h/2-r);
  s.lineTo(-w/2,  -h/2+r); s.quadraticCurveTo(-w/2, -h/2, -w/2+r, -h/2);
  return s;
}
function buildUpperBladeShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0.1);
  s.bezierCurveTo(0.3, 0.6,  0.9, 0.7,  1.35,  0.9);
  s.bezierCurveTo(0.95, 0.55, 0.45, 0.3, 0.12, -0.18);
  s.closePath(); return s;
}
function buildLowerBladeShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, -0.1);
  s.bezierCurveTo(0.3, -0.6,  0.9, -0.7,  1.35, -0.9);
  s.bezierCurveTo(0.95, -0.55, 0.45, -0.3, 0.12,  0.18);
  s.closePath(); return s;
}

/* ─── Materials ─────────────────────────────────────────────────────────────
   Design Mode: Smoked-obsidian / gunmetal with crisp white rim highlights.
   The base colour is a very dark near-black (#1c1c20) with high metalness so
   the studio lighting carves out bright specular edges — this keeps the white
   Hero typography 100% readable above the canvas.
*/
function makeDesignMat(color: THREE.ColorRepresentation): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.92,
    roughness: 0.12,       // near-mirror for crisp rim highlights
    reflectivity: 1.0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.6,
  });
}
function makeBlueprintMat(color: THREE.ColorRepresentation): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.72 });
}

/* ─── Types for external access ─────────────────────────────────────────────*/
export interface MonolithRefs {
  group: React.RefObject<THREE.Group>;
  partA: React.RefObject<THREE.Mesh>;
  partB: React.RefObject<THREE.Mesh>;
  partC: React.RefObject<THREE.Mesh>;
}

/* ─── Scroll target structure written by the scroll hook ────────────────────*/
export interface ScrollTargets {
  groupX: number; groupY: number; groupZ: number;
  groupRotX: number; groupRotY: number; groupRotZ: number;
  groupScale: number;
  aX: number; aY: number; aZ: number;
  bX: number; bY: number; bZ: number;
  cX: number; cY: number; cZ: number;
}

const DEFAULT_TARGETS: ScrollTargets = {
  groupX: 0, groupY: 0, groupZ: 0,
  groupRotX: 0, groupRotY: 0, groupRotZ: 0,
  groupScale: 1,
  aX: 0, aY: 0, aZ: 0,
  bX: 0, bY: 0, bZ: 0,
  cX: 0, cY: 0, cZ: 0,
};

/* Shared refs exposed to scroll hook — initialised as module-level objects,
   populated by the component via useEffect once it mounts.                  */
export const monolithScrollTargets = { current: { ...DEFAULT_TARGETS } };
export const monolithRefs: MonolithRefs = {
  group: { current: null } as unknown as React.RefObject<THREE.Group>,
  partA: { current: null } as unknown as React.RefObject<THREE.Mesh>,
  partB: { current: null } as unknown as React.RefObject<THREE.Mesh>,
  partC: { current: null } as unknown as React.RefObject<THREE.Mesh>,
};

/* ═══════════════════════════════════════════════════════════════════════════*/
export default function KaryaByteMonolith() {
  const { size } = useThree();
  const isMobile = size.width < 768;

  /* Assign to shared refs so scroll hook can target them */
  const groupRef = useRef<THREE.Group>(null!);
  const partARef = useRef<THREE.Mesh>(null!);
  const partBRef = useRef<THREE.Mesh>(null!);
  const partCRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    monolithRefs.group = groupRef as React.RefObject<THREE.Group>;
    monolithRefs.partA = partARef as React.RefObject<THREE.Mesh>;
    monolithRefs.partB = partBRef as React.RefObject<THREE.Mesh>;
    monolithRefs.partC = partCRef as React.RefObject<THREE.Mesh>;
  }, []);

  /* Idle float + pointer parallax (no React state) */
  const pointerRef    = useRef({ x: 0, y: 0 });
  const lerpedPointer = useRef({ x: 0, y: 0 });
  const clockRef      = useRef(0);

  /* Material refs */
  const dMats = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const bMats = useRef<THREE.MeshBasicMaterial[]>([]);

  /* Mode ref — read by store subscription, never from React state in useFrame */
  const modeRef = useRef(useSceneStore.getState().mode);

  useEffect(() => {
    return useSceneStore.subscribe((s) => {
      modeRef.current = s.mode;
      swapMats(s.mode);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Build geometry once */
  const { geoA, geoB, geoC } = useMemo(() => {
    const depth = isMobile ? 0.18 : 0.26;
    return {
      geoA: buildExtruded(buildPillarShape(),      depth,         isMobile),
      geoB: buildExtruded(buildUpperBladeShape(),  depth * 0.85,  isMobile),
      geoC: buildExtruded(buildLowerBladeShape(),  depth * 0.85,  isMobile),
    };
  }, [isMobile]);

  /* Build materials once
     Gunmetal: #1a1a1e — dark enough that white text reads at 100% contrast.
     Slight dark-purple undertone gives depth without competing with the UI. */
  useMemo(() => {
    dMats.current = [
      makeDesignMat(0x1a1a1e), // pillar — near-black obsidian
      makeDesignMat(0x212128), // upper blade — slightly lighter gunmetal
      makeDesignMat(0x212128), // lower blade
    ];
    bMats.current = [
      makeBlueprintMat(0x60a5fa),
      makeBlueprintMat(0x818cf8),
      makeBlueprintMat(0x818cf8),
    ];
  }, []);

  function swapMats(mode: "design" | "blueprint") {
    if (!partARef.current) return;
    partARef.current.material = mode === "design" ? dMats.current[0] : bMats.current[0];
    partBRef.current.material = mode === "design" ? dMats.current[1] : bMats.current[1];
    partCRef.current.material = mode === "design" ? dMats.current[2] : bMats.current[2];
  }

  /* Pointer listener */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* Dispose */
  useEffect(() => {
    return () => {
      geoA.dispose(); geoB.dispose(); geoC.dispose();
      dMats.current.forEach(m => m.dispose());
      bMats.current.forEach(m => m.dispose());
    };
  }, [geoA, geoB, geoC]);

  /* ══════════════════════════════════════════════════════════════════════════
     useFrame — ZERO React state mutations.
     Priority order:
       1. Accumulate clock
       2. Lerp pointer
       3. Apply scroll targets (from GSAP hook) via lerp
       4. Add idle breathing on top of scroll base
       5. Blueprint opacity pulse
  ══════════════════════════════════════════════════════════════════════════ */
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    clockRef.current += delta;
    const t = clockRef.current;
    const tgt = monolithScrollTargets.current;

    /* Lerp pointer */
    lerpedPointer.current.x += (pointerRef.current.x - lerpedPointer.current.x) * 0.055;
    lerpedPointer.current.y += (pointerRef.current.y - lerpedPointer.current.y) * 0.055;

    const L = 0.06; // group lerp speed toward scroll targets

    /* Group position → scroll target + idle float on Y */
    const idleY = Math.sin(t * 0.6) * 0.06;
    groupRef.current.position.x += (tgt.groupX - groupRef.current.position.x) * L;
    groupRef.current.position.y += (tgt.groupY + idleY - groupRef.current.position.y) * L;
    groupRef.current.position.z += (tgt.groupZ - groupRef.current.position.z) * L;

    /* Group rotation → scroll target + pointer parallax */
    const targetRotX = tgt.groupRotX + lerpedPointer.current.y * 0.10;
    const targetRotY = tgt.groupRotY + lerpedPointer.current.x * 0.18 + Math.sin(t * 0.25) * 0.002;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * L;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * L;
    groupRef.current.rotation.z += (tgt.groupRotZ - groupRef.current.rotation.z) * L;

    /* Group scale */
    const sc = tgt.groupScale;
    groupRef.current.scale.x += (sc - groupRef.current.scale.x) * L;
    groupRef.current.scale.y += (sc - groupRef.current.scale.y) * L;
    groupRef.current.scale.z += (sc - groupRef.current.scale.z) * L;

    /* Individual part positions (explosion / reassembly) */
    if (partARef.current) {
      const baseAx = isMobile ? -0.3 : -0.42;
      partARef.current.position.x += (baseAx + tgt.aX - partARef.current.position.x) * L;
      partARef.current.position.y += (tgt.aY - partARef.current.position.y) * L;
      partARef.current.position.z += (tgt.aZ - partARef.current.position.z) * L;
    }
    if (partBRef.current) {
      const baseBx = isMobile ? 0.08 : 0.11;
      partBRef.current.position.x += (baseBx + tgt.bX - partBRef.current.position.x) * L;
      partBRef.current.position.y += (0.08 + tgt.bY - partBRef.current.position.y) * L;
      partBRef.current.position.z += (tgt.bZ - partBRef.current.position.z) * L;
    }
    if (partCRef.current) {
      const baseCx = isMobile ? 0.08 : 0.11;
      partCRef.current.position.x += (baseCx + tgt.cX - partCRef.current.position.x) * L;
      partCRef.current.position.y += (-0.08 + tgt.cY - partCRef.current.position.y) * L;
      partCRef.current.position.z += (tgt.cZ - partCRef.current.position.z) * L;
    }

    /* Blueprint opacity pulse */
    if (modeRef.current === "blueprint") {
      (bMats.current[0] as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(t * 2.2)       * 0.25;
      (bMats.current[1] as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(t * 2.2 + 1.0) * 0.25;
      (bMats.current[2] as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(t * 2.2 + 2.0) * 0.25;
    }
  });

  const pillarX = isMobile ? -0.3 : -0.42;
  const bladeX  = isMobile ?  0.08 :  0.11;

  return (
    <group ref={groupRef}>
      <mesh ref={partARef} geometry={geoA} material={dMats.current[0]}
        position={[pillarX, 0, 0]} castShadow receiveShadow />
      <mesh ref={partBRef} geometry={geoB} material={dMats.current[1]}
        position={[bladeX, 0.08, 0]} castShadow />
      <mesh ref={partCRef} geometry={geoC} material={dMats.current[2]}
        position={[bladeX, -0.08, 0]} castShadow />
    </group>
  );
}

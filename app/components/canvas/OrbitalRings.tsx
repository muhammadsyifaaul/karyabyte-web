"use client";

/**
 * OrbitalRings
 * Two ultra-thin concentric telemetry rings around the K emblem.
 *
 * Section behaviour (read from monolithScrollTargets / store):
 *   hero      → tight, nearly flat, slow spin
 *   duo       → tilt + expand symmetrically
 *   pipeline  → full tilt, widest expansion, faster spin
 *   works     → shrink and fade to background
 *   contact   → lock to flat, slow reassembly spin
 *
 * Guardrails: zero React state in useFrame, geometry disposed on unmount.
 */

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../../store/useSceneStore";

/* Ring geometry factory */
function makeRing(innerR: number, outerR: number): THREE.RingGeometry {
  return new THREE.RingGeometry(innerR, outerR, 96);
}

/* Section → ring target params */
type RingTarget = {
  tiltX: number; tiltZ: number;
  scaleA: number; scaleB: number;
  opacityA: number; opacityB: number;
  spinSpeed: number;
};

const SECTION_TARGETS: Record<string, RingTarget> = {
  hero:     { tiltX: 0.18, tiltZ: 0.05, scaleA: 1.00, scaleB: 1.35, opacityA: 0.18, opacityB: 0.10, spinSpeed: 0.004 },
  duo:      { tiltX: 0.70, tiltZ: 0.20, scaleA: 1.30, scaleB: 1.80, opacityA: 0.28, opacityB: 0.16, spinSpeed: 0.009 },
  pipeline: { tiltX: 1.10, tiltZ: 0.30, scaleA: 1.55, scaleB: 2.10, opacityA: 0.32, opacityB: 0.20, spinSpeed: 0.016 },
  works:    { tiltX: 0.30, tiltZ: 0.08, scaleA: 0.70, scaleB: 0.95, opacityA: 0.08, opacityB: 0.05, spinSpeed: 0.003 },
  contact:  { tiltX: 0.05, tiltZ: 0.00, scaleA: 1.10, scaleB: 1.48, opacityA: 0.22, opacityB: 0.12, spinSpeed: 0.005 },
  other:    { tiltX: 0.18, tiltZ: 0.05, scaleA: 1.00, scaleB: 1.35, opacityA: 0.18, opacityB: 0.10, spinSpeed: 0.004 },
};

export default function OrbitalRings() {
  const groupRef = useRef<THREE.Group>(null!);
  const ringARef = useRef<THREE.Mesh>(null!);
  const ringBRef = useRef<THREE.Mesh>(null!);
  const clockRef = useRef(0);

  /* Live targets lerped in useFrame */
  const live = useRef<RingTarget>({ ...SECTION_TARGETS.hero });

  /* Read scroll section from store into ref */
  const sectionRef = useRef(useSceneStore.getState().scrollSection);
  useEffect(() => {
    return useSceneStore.subscribe((s) => {
      sectionRef.current = s.scrollSection;
    });
  }, []);

  /* Geometry */
  const { geoA, geoB } = useMemo(() => ({
    geoA: makeRing(1.65, 1.68),
    geoB: makeRing(2.15, 2.18),
  }), []);

  /* Materials */
  const matA = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xe4e4e7, side: THREE.DoubleSide, transparent: true, opacity: 0.18, depthWrite: false,
  }), []);
  const matB = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xa1a1aa, side: THREE.DoubleSide, transparent: true, opacity: 0.10, depthWrite: false,
  }), []);

  /* Dispose */
  useEffect(() => {
    return () => {
      geoA.dispose(); geoB.dispose(); matA.dispose(); matB.dispose();
    };
  }, [geoA, geoB, matA, matB]);

  /* ════════════════════════════════════════════════════════════
     useFrame — zero React state mutations
  ════════════════════════════════════════════════════════════ */
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    clockRef.current += delta;
    const t = clockRef.current;

    /* Get target for current section */
    const tgt = SECTION_TARGETS[sectionRef.current] ?? SECTION_TARGETS.other;
    const L   = 0.04; // lerp speed

    /* Lerp live values toward target */
    live.current.tiltX    += (tgt.tiltX    - live.current.tiltX)    * L;
    live.current.tiltZ    += (tgt.tiltZ    - live.current.tiltZ)    * L;
    live.current.scaleA   += (tgt.scaleA   - live.current.scaleA)   * L;
    live.current.scaleB   += (tgt.scaleB   - live.current.scaleB)   * L;
    live.current.opacityA += (tgt.opacityA - live.current.opacityA) * L;
    live.current.opacityB += (tgt.opacityB - live.current.opacityB) * L;
    live.current.spinSpeed += (tgt.spinSpeed - live.current.spinSpeed) * L;

    /* Apply to group */
    groupRef.current.rotation.y  = t * live.current.spinSpeed;
    groupRef.current.rotation.x  = live.current.tiltX;
    groupRef.current.rotation.z  = live.current.tiltZ + Math.sin(t * 0.3) * 0.02;

    /* Apply scale + opacity to individual rings */
    if (ringARef.current) {
      ringARef.current.scale.setScalar(live.current.scaleA);
      (ringARef.current.material as THREE.MeshBasicMaterial).opacity = live.current.opacityA;
    }
    if (ringBRef.current) {
      ringBRef.current.scale.setScalar(live.current.scaleB);
      (ringBRef.current.material as THREE.MeshBasicMaterial).opacity = live.current.opacityB;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={ringARef} geometry={geoA} material={matA} />
      <mesh ref={ringBRef} geometry={geoB} material={matB} />
    </group>
  );
}

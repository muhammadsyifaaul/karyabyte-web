"use client";

/**
 * ParticleField
 * ~120 monochrome coordinate particles floating in 3D depth.
 * Drift gently with pointer movement (lerped), accelerate with scroll velocity.
 *
 * Guardrails:
 *  • Zero React state inside useFrame
 *  • BufferGeometry + Points disposed on unmount
 *  • Mobile: half particle count, reduced drift
 */

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT_DESKTOP = 120;
const PARTICLE_COUNT_MOBILE  = 60;

export default function ParticleField() {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const count    = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

  /* Pointer + scroll velocity — read without React state */
  const pointerRef   = useRef({ x: 0, y: 0 });
  const lerpedPtr    = useRef({ x: 0, y: 0 });
  const scrollVelRef = useRef(0);
  const lastScrollY  = useRef(0);
  const clockRef     = useRef(0);

  const pointsRef = useRef<THREE.Points>(null!);
  const geoRef    = useRef<THREE.BufferGeometry>(null!);

  /* ── Geometry: random positions spread across a wide volume ── */
  const { positions, phases } = useMemo(() => {
    const pos   = new Float32Array(count * 3);
    const ph    = new Float32Array(count);      // per-particle phase offset
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14;  // x: -7..7
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;  // y: -5..5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;   // z: -4..4
      ph[i]           = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, [count]);

  /* Base positions (snapshot at mount for relative drift) */
  const basePositions = useMemo(() => new Float32Array(positions), [positions]);

  /* ── Material ── */
  const material = useMemo(() => new THREE.PointsMaterial({
    color: 0xffffff,
    size: isMobile ? 0.025 : 0.018,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  }), [isMobile]);

  /* ── Pointer listener ── */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => {
      const dy = window.scrollY - lastScrollY.current;
      scrollVelRef.current = dy * 0.003;
      lastScrollY.current  = window.scrollY;
    };
    window.addEventListener("pointermove", onMove,  { passive: true });
    window.addEventListener("scroll",      onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll",      onScroll);
    };
  }, []);

  /* ── Dispose on unmount ── */
  useEffect(() => {
    return () => {
      geoRef.current?.dispose();
      material.dispose();
    };
  }, [material]);

  /* ════════════════════════════════════════════════════════════════
     useFrame — zero React state mutations
  ════════════════════════════════════════════════════════════════ */
  useFrame((_, delta) => {
    if (!pointsRef.current || !geoRef.current) return;

    clockRef.current += delta;
    const t = clockRef.current;

    /* Lerp pointer */
    lerpedPtr.current.x += (pointerRef.current.x - lerpedPtr.current.x) * 0.03;
    lerpedPtr.current.y += (pointerRef.current.y - lerpedPtr.current.y) * 0.03;

    /* Decay scroll velocity */
    scrollVelRef.current *= 0.88;

    const pos  = geoRef.current.attributes.position as THREE.BufferAttribute;
    const pArr = pos.array as Float32Array;
    const driftScale = isMobile ? 0.3 : 0.55;

    for (let i = 0; i < count; i++) {
      const ph  = phases[i];
      const bx  = basePositions[i * 3 + 0];
      const by  = basePositions[i * 3 + 1];
      const bz  = basePositions[i * 3 + 2];
      const spd = 0.18 + (i % 7) * 0.03;

      /* Gentle sine drift */
      const dx = Math.sin(t * spd + ph)         * driftScale;
      const dy = Math.cos(t * spd * 0.7 + ph)   * driftScale * 0.6;
      const dz = Math.sin(t * spd * 0.5 + ph)   * driftScale * 0.4;

      /* Pointer influence */
      const px = lerpedPtr.current.x * (1.5 + (i % 3) * 0.4);
      const py = lerpedPtr.current.y * (1.0 + (i % 5) * 0.2);

      /* Scroll velocity kick on Y */
      const sv = scrollVelRef.current * (0.8 + (i % 4) * 0.3);

      pArr[i * 3 + 0] = bx + dx + px * 0.3;
      pArr[i * 3 + 1] = by + dy + py * 0.3 + sv;
      pArr[i * 3 + 2] = bz + dz;
    }
    pos.needsUpdate = true;

    /* Slow global drift of the whole field */
    pointsRef.current.rotation.y = t * 0.008;
    pointsRef.current.rotation.x = Math.sin(t * 0.004) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}

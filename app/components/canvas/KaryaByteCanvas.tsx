"use client";

/**
 * KaryaByteCanvas
 * When `fixed` prop is true: mounts as `fixed inset-0 w-screen h-screen z-0`
 * so the 3D scene persists behind every section while the user scrolls.
 * When false (legacy): `absolute inset-0` for inline use.
 */

import { Suspense, useState, useEffect, useCallback } from "react";
import { Canvas, type RootState } from "@react-three/fiber";
import { Environment, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import KaryaByteMonolith from "./KaryaByteMonolith";
import SceneLighting from "./SceneLighting";
import ScrollChoreographer from "./ScrollChoreographer";
import ParticleField from "./ParticleField";
import OrbitalRings from "./OrbitalRings";

function WebGLFallback({ fixed }: { fixed: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={fixed ? "fixed inset-0 pointer-events-none z-0" : "absolute inset-0 pointer-events-none"}
      style={{
        background:
          "radial-gradient(ellipse 60% 60% at 50% 45%, rgba(228,228,231,0.07) 0%, transparent 70%)",
      }}
    />
  );
}

interface Props {
  /** Mount as fixed full-screen layer behind all content */
  fixed?: boolean;
}

export default function KaryaByteCanvas({ fixed = false }: Props) {
  const [webglOk, setWebglOk] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const c = document.createElement("canvas");
      const ctx = c.getContext("webgl2") ?? c.getContext("webgl");
      if (!ctx) setWebglOk(false);
    } catch {
      setWebglOk(false);
    }
  }, [mounted]);

  const handleCreated = useCallback(({ gl }: RootState) => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.1;
  }, []);

  if (!mounted) return null;
  if (!webglOk) return <WebGLFallback fixed={fixed} />;

  const positionClass = fixed
    ? "fixed inset-0 w-screen h-screen pointer-events-none z-0"
    : "absolute inset-0 pointer-events-none";

  return (
    <div className={positionClass} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        onCreated={handleCreated}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <SceneLighting />
          <Environment preset="studio" />
          <ParticleField />
          <OrbitalRings />
          <KaryaByteMonolith />
        </Suspense>
      </Canvas>
      {/* ScrollChoreographer lives outside R3F but inside the canvas wrapper
          so it mounts after the page sections are in the DOM */}
      <ScrollChoreographer />
    </div>
  );
}

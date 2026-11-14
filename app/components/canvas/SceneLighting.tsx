"use client";

/**
 * SceneLighting — Phase 2 + Phase 3
 *
 * Design Mode:
 *   Three-point studio rig tuned for gunmetal/obsidian material.
 *   • Key light (upper-left warm): carves the K silhouette
 *   • Fill (lower-right cool):     soft secondary shadow
 *   • Rim backlight (behind, top): creates the crisp white edge highlights
 *     that separate the dark K from the dark background
 *   • Point accent (right):        extra specular pop on the blade tips
 *
 * Blueprint Mode:
 *   Cool sparse overhead — wireframe feel.
 *
 * All intensity transitions are lerped inside useFrame — no React state.
 */

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../../store/useSceneStore";

export default function SceneLighting() {
  const keyRef   = useRef<THREE.DirectionalLight>(null!);
  const fillRef  = useRef<THREE.DirectionalLight>(null!);
  const rimRef   = useRef<THREE.DirectionalLight>(null!);
  const rimRef2  = useRef<THREE.DirectionalLight>(null!);
  const ambRef   = useRef<THREE.AmbientLight>(null!);
  const pointRef = useRef<THREE.PointLight>(null!);

  const tgt = useRef({ key: 3.5, fill: 1.1, rim: 3.2, rim2: 2.4, amb: 0.15, point: 1.8 });
  const modeRef = useRef(useSceneStore.getState().mode);

  useEffect(() => {
    const unsub = useSceneStore.subscribe((s) => {
      modeRef.current = s.mode;
      if (s.mode === "design") {
        tgt.current = { key: 3.5, fill: 1.1, rim: 3.2, rim2: 2.4, amb: 0.15, point: 1.8 };
      } else {
        tgt.current = { key: 0.3, fill: 0.1, rim: 0.2, rim2: 0.1, amb: 1.1, point: 0.1 };
      }
    });
    return unsub;
  }, []);

  useFrame(() => {
    if (!keyRef.current) return;
    const spd = 0.04;
    keyRef.current.intensity   += (tgt.current.key   - keyRef.current.intensity)   * spd;
    fillRef.current.intensity  += (tgt.current.fill  - fillRef.current.intensity)  * spd;
    rimRef.current.intensity   += (tgt.current.rim   - rimRef.current.intensity)   * spd;
    rimRef2.current.intensity  += (tgt.current.rim2  - rimRef2.current.intensity)  * spd;
    ambRef.current.intensity   += (tgt.current.amb   - ambRef.current.intensity)   * spd;
    pointRef.current.intensity += (tgt.current.point - pointRef.current.intensity) * spd;

    if (modeRef.current === "blueprint") {
      ambRef.current.color.lerp(new THREE.Color(0x1a3a6e), 0.04);
    } else {
      ambRef.current.color.lerp(new THREE.Color(0x08080f), 0.04);
    }
  });

  return (
    <>
      {/* Key — upper-left, warm white, main illumination */}
      <directionalLight ref={keyRef} position={[-3.5, 4.5, 3]} intensity={3.5}
        color={0xfff8f0} castShadow
        shadow-mapSize={[1024, 1024]} shadow-camera-near={0.5} shadow-camera-far={20} />

      {/* Fill — lower right, cool blue-white */}
      <directionalLight ref={fillRef} position={[3, -2, 2]} intensity={1.1} color={0xc8d8f8} />

      {/* Rim 1 — directly behind and above: white edge separation on top */}
      <directionalLight ref={rimRef} position={[0.5, 3, -5]} intensity={3.2} color={0xffffff} />

      {/* Rim 2 — behind and to the right: edge highlight on blade tips */}
      <directionalLight ref={rimRef2} position={[2.5, -1, -4]} intensity={2.4} color={0xe8e8ff} />

      {/* Point accent — right side, adds specular pop to blade edges */}
      <pointLight ref={pointRef} position={[2, 0.5, 2]} intensity={1.8}
        color={0xffffff} distance={8} decay={2} />

      {/* Ambient — very dim so the rims read as pure edge highlights */}
      <ambientLight ref={ambRef} intensity={0.15} color={0x08080f} />
    </>
  );
}

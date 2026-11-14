"use client";

/**
 * useScrollChoreography — Phase 4 upgrade
 * ─────────────────────────────────────────────────────────────────────────────
 * 6 distinct scroll states mapped to DOM section IDs.
 * All writes go to monolithScrollTargets.current — a plain mutable object.
 * Zero React state mutations on scroll.
 * Full gsap.context() cleanup on unmount.
 */

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { monolithScrollTargets } from "../components/canvas/KaryaByteMonolith";
import { useSceneStore } from "../store/useSceneStore";

gsap.registerPlugin(ScrollTrigger);

type Targets = typeof monolithScrollTargets.current;

function to(tgt: Partial<Targets>, dur = 1.2, ease = "power3.out") {
  gsap.to(monolithScrollTargets.current, { duration: dur, ease, ...tgt });
}

export function useScrollChoreography() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {

      /* ── 01. HERO ───────────────────────────────────────────────────────
         Unified monolith right of centre (x:1.5), breathing toward viewer.
         Parts assembled at their natural offsets.                          */
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        onEnter: () => {
          useSceneStore.getState().setScrollSection("hero");
          to({ groupX:1.5, groupY:0, groupZ:0.4,
               groupRotX:0, groupRotY:-0.2, groupRotZ:0,
               groupScale:1,
               aX:0, aY:0, aZ:0, bX:0, bY:0, bZ:0, cX:0, cY:0, cZ:0 });
        },
        onEnterBack: () => {
          useSceneStore.getState().setScrollSection("hero");
          to({ groupX:1.5, groupY:0, groupZ:0.4,
               groupRotX:0, groupRotY:-0.2, groupRotZ:0,
               groupScale:1,
               aX:0, aY:0, aZ:0, bX:0, bY:0, bZ:0, cX:0, cY:0, cZ:0 }, 1.0);
        },
      });

      /* ── 02. DUO (Founders) ─────────────────────────────────────────────
         Symmetric explosion:
         - Part A (pillar) → left toward Muhammad Syifaaul's card
         - Parts B+C (blades) → right toward Ardana's card                 */
      ScrollTrigger.create({
        trigger: "#duo",
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          useSceneStore.getState().setScrollSection("duo");
          to({ groupX:0, groupY:0.15, groupZ:0,
               groupRotX:0.1, groupRotY:0.35, groupRotZ:0,
               groupScale:0.9,
               aX:-1.4, aY:0,    aZ:0.9,
               bX: 0.8, bY:0.6,  bZ:0.9,
               cX: 0.8, cY:-0.6, cZ:0.9 }, 1.4, "power3.inOut");
        },
        onEnterBack: () => {
          useSceneStore.getState().setScrollSection("duo");
          to({ groupX:0, groupY:0.15, groupZ:0,
               groupRotX:0.1, groupRotY:0.35, groupRotZ:0,
               groupScale:0.9,
               aX:-1.4, aY:0,    aZ:0.9,
               bX: 0.8, bY:0.6,  bZ:0.9,
               cX: 0.8, cY:-0.6, cZ:0.9 }, 1.0);
        },
      });

      /* ── 03. SERVICES (re-aligns into angled isometric right-side prism) ─*/
      ScrollTrigger.create({
        trigger: "#services",
        start: "top 65%",
        end: "bottom 35%",
        onEnter: () => {
          useSceneStore.getState().setScrollSection("duo");
          to({ groupX:1.8, groupY:0, groupZ:0,
               groupRotX:0.4, groupRotY:0.7, groupRotZ:0.15,
               groupScale:0.82,
               aX:0, aY:0, aZ:0, bX:0, bY:0, bZ:0, cX:0, cY:0, cZ:0 }, 1.2, "power2.inOut");
        },
        onEnterBack: () => {
          useSceneStore.getState().setScrollSection("duo");
          to({ groupX:1.8, groupY:0, groupZ:0,
               groupRotX:0.4, groupRotY:0.7, groupRotZ:0.15,
               groupScale:0.82,
               aX:0, aY:0, aZ:0, bX:0, bY:0, bZ:0, cX:0, cY:0, cZ:0 }, 1.0);
        },
      });

      /* ── 04. PIPELINE — 360° orbital scrubbed across 4 phases ──────────── */
      ScrollTrigger.create({
        trigger: "#pipeline",
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          useSceneStore.getState().setScrollSection("pipeline");
          to({ groupX:0.4, groupY:0.2, groupZ:0,
               groupRotX:0.6, groupRotY:0.9, groupRotZ:0.1,
               groupScale:0.78,
               aX:0, aY:0, aZ:0, bX:0, bY:0, bZ:0, cX:0, cY:0, cZ:0 }, 1.3, "power3.inOut");
        },
        onEnterBack: () => {
          useSceneStore.getState().setScrollSection("pipeline");
          to({ groupX:0.4, groupY:0.2, groupZ:0,
               groupRotX:0.6, groupRotY:0.9, groupRotZ:0.1,
               groupScale:0.78,
               aX:0, aY:0, aZ:0, bX:0, bY:0, bZ:0, cX:0, cY:0, cZ:0 }, 1.0);
        },
        // Full 360° orbit scrubbed by scroll progress (0 → 2π)
        onUpdate: (self) => {
          monolithScrollTargets.current.groupRotY = 0.9 + self.progress * Math.PI * 2;
        },
      });

      /* ── 05. WORKS — upper-right parallax layer, stays visible ─────────── */
      ScrollTrigger.create({
        trigger: "#works",
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          useSceneStore.getState().setScrollSection("works");
          to({ groupX:2.2, groupY:0.6, groupZ:-1.2,
               groupRotX:0.2, groupRotY:-0.5, groupRotZ:0,
               groupScale:0.75,
               aX:0, aY:0, aZ:0, bX:0, bY:0, bZ:0, cX:0, cY:0, cZ:0 }, 1.1, "power2.inOut");
        },
        onEnterBack: () => {
          useSceneStore.getState().setScrollSection("works");
          to({ groupX:2.2, groupY:0.6, groupZ:-1.2,
               groupRotX:0.2, groupRotY:-0.5, groupRotZ:0,
               groupScale:0.75,
               aX:0, aY:0, aZ:0, bX:0, bY:0, bZ:0, cX:0, cY:0, cZ:0 }, 1.0);
        },
      });

      /* ── 06. CONTACT — reassemble, slow spin, behind studio details card ─*/
      ScrollTrigger.create({
        trigger: "#contact",
        start: "top 65%",
        end: "bottom bottom",
        onEnter: () => {
          useSceneStore.getState().setScrollSection("contact");
          to({ groupX:1.2, groupY:0, groupZ:0,
               groupRotX:0, groupRotY:0.1, groupRotZ:0,
               groupScale:1.05,
               aX:0, aY:0, aZ:0, bX:0, bY:0, bZ:0, cX:0, cY:0, cZ:0 }, 1.6, "power4.out");
        },
        onEnterBack: () => {
          useSceneStore.getState().setScrollSection("contact");
          to({ groupX:1.2, groupY:0, groupZ:0,
               groupRotX:0, groupRotY:0.1, groupRotZ:0,
               groupScale:1.05,
               aX:0, aY:0, aZ:0, bX:0, bY:0, bZ:0, cX:0, cY:0, cZ:0 }, 1.2, "power3.out");
        },
      });

    });

    return () => ctx.revert();
  }, []);
}

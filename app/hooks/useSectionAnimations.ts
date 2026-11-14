"use client";

/**
 * useSectionAnimations
 * ─────────────────────────────────────────────────────────────────────────────
 * GSAP scroll-triggered entrance + micro-interaction animations for:
 *   • Works cards: staggered reveal on scroll & filter change, 3D tilt on hover
 *   • Estimator pills: pulse the 3D K on selection via monolithScrollTargets
 *
 * Full gsap.context() cleanup on unmount.
 */

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { monolithScrollTargets } from "../components/canvas/KaryaByteMonolith";

gsap.registerPlugin(ScrollTrigger);

/* ── Works section: staggered card reveal + hover tilt ── */
export function useWorksAnimations(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* Header slide-up */
      gsap.from("[data-anim='works-header']", {
        scrollTrigger: { trigger: "[data-anim='works-header']", start: "top 80%", once: true },
        y: 32, opacity: 0, duration: 0.7, ease: "power3.out",
      });

      /* Cards stagger */
      gsap.from("[data-anim='works-card']", {
        scrollTrigger: { trigger: "[data-anim='works-card']", start: "top 82%", once: true },
        y: 48, opacity: 0, stagger: 0.14, duration: 0.75, ease: "power3.out",
      });

      /* 3D perspective tilt on hover — pure CSS-var approach via GSAP */
      document.querySelectorAll<HTMLElement>("[data-anim='works-card']").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const cx   = rect.left + rect.width  / 2;
          const cy   = rect.top  + rect.height / 2;
          const rx   = ((e.clientY - cy) / (rect.height / 2)) * -6; // degrees
          const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  6;
          gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.25, ease: "power2.out",
            transformPerspective: 900, transformOrigin: "50% 50%" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out" });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);
}

/* ── Estimator: pulse K emblem on pill selection ── */
export function useEstimatorPulse() {
  /* Exported as a plain function so Estimator can call it on each selection */
  return function pulseK() {
    const tgt = monolithScrollTargets.current;
    /* Brief rotY snap then return */
    const startY = tgt.groupRotY;
    gsap.to(tgt, {
      groupRotY: startY + 0.45,
      groupScale: 1.08,
      duration: 0.22,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(tgt, {
          groupRotY: startY,
          groupScale: 1.05,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        });
      },
    });
  };
}

/* ── Pipeline: animated progress connector ── */
export function usePipelineAnimations(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-anim='pipeline-header']", {
        scrollTrigger: { trigger: "[data-anim='pipeline-header']", start: "top 80%", once: true },
        y: 32, opacity: 0, duration: 0.7, ease: "power3.out",
      });
      /* Phase nodes sequential pop-in */
      gsap.from("[data-anim='phase-node']", {
        scrollTrigger: { trigger: "[data-anim='phase-node']", start: "top 82%", once: true },
        scale: 0.5, opacity: 0, stagger: 0.15, duration: 0.5, ease: "back.out(1.7)",
      });
      /* Connector line draw */
      gsap.from("[data-anim='connector-line']", {
        scrollTrigger: { trigger: "[data-anim='connector-line']", start: "top 82%", once: true },
        scaleX: 0, opacity: 0, duration: 0.9, ease: "power3.out", transformOrigin: "left",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [sectionRef]);
}

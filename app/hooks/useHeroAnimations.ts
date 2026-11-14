"use client";

/**
 * useHeroAnimations
 * ─────────────────────────────────────────────────────────────────────────────
 * GSAP staggered entrance for every Hero element + count-up on the 4 metrics.
 * Full gsap.context() cleanup on unmount.
 *
 * Usage: call inside Hero component, pass a ref to the section element.
 */

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useHeroAnimations(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

      /* ── Staggered entrance ─────────────────────────────────────────────
         Elements must carry data-hero="badge|h1-line|subline|cta|metrics"   */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero='badge']",   { y: 20, opacity: 0, duration: 0.6 })
        .from("[data-hero='h1-line']", { y: 36, opacity: 0, stagger: 0.12, duration: 0.7 }, "-=0.3")
        .from("[data-hero='subline']", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
        .from("[data-hero='cta']",     { y: 16, opacity: 0, stagger: 0.1,  duration: 0.5 }, "-=0.3")
        .from("[data-hero='divider']", { scaleX: 0, opacity: 0, duration: 0.6, transformOrigin: "left" }, "-=0.2");

      /* ── Metric count-up ────────────────────────────────────────────────
         Each [data-metric] element has data-target="12", data-suffix="+" etc. */
      document.querySelectorAll<HTMLElement>("[data-metric]").forEach((el) => {
        const target   = parseFloat(el.dataset.target  ?? "0");
        const suffix   = el.dataset.suffix  ?? "";
        const prefix   = el.dataset.prefix  ?? "";
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        const obj      = { val: 0 };

        gsap.to(obj, {
          val: target, duration: 1.6, ease: "power2.out",
          delay: 0.8,
          onUpdate: () => {
            el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
          },
        });
      });

      /* ── Metrics strip slide-up ── */
      tl.from("[data-hero='metrics-strip']", { y: 24, opacity: 0, duration: 0.6 }, "-=0.6");

    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);
}

"use client";

/**
 * LenisProvider
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps the app in Lenis smooth scroll and syncs it with GSAP's ticker so
 * ScrollTrigger scrubs stay frame-perfect.
 *
 * Teardown: lenis.destroy() + gsap.ticker.remove() called in useEffect cleanup.
 */

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;

    /* Sync Lenis raf with GSAP ticker — this is the canonical integration */
    function onRaf(time: number) {
      lenis.raf(time * 1000); // GSAP time is in seconds, Lenis wants ms
    }
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    /* Let ScrollTrigger know the scroll position on each Lenis scroll event */
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

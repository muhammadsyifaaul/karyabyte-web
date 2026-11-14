"use client";

import { useRef } from "react";
import { metrics, studio } from "../data/studio";
import BlueprintOverlay from "../components/ui/BlueprintOverlay";
import { useHeroAnimations } from "../hooks/useHeroAnimations";

/**
 * Hero — above-the-fold layout (100vh desktop target)
 *
 * Revised vertical budget at 1024px viewport (navbar = 64px fixed):
 *   112px  pt-28 top padding  (navbar 64 + 48 breathing room)
 *   38px   badge + mb-6
 *   ~175px headline (3 lines clamp 2.4–5rem)
 *   20px   mb-5
 *   ~65px  subline (2 lines 1.1rem, lineHeight 1.6)
 *   32px   mb-8
 *   40px   CTA row
 *   32px   mt-8 spacer (between CTAs and metrics)
 *   ────────────────
 *   ~514px above metrics
 *   pb-4   bottom of main block
 *   1px    divider + mb-6
 *   ~88px  metrics strip (clamp 1.5rem numbers + labels)
 *   ~44px  scroll indicator + pb-5
 *   ────────────────
 *   Total ≈ 980px  ✓ fits inside 1024px with ~44px margin
 *
 * Mobile (< 640px): pt-24 keeps badge below the nav on smaller screens.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroAnimations(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen min-h-[640px] flex flex-col justify-center items-center text-center overflow-hidden"
      aria-label="Hero — KaryaByte"
    >
      <BlueprintOverlay />

      {/* ── Main content ── */}
      <div className="kb-container relative z-10 w-full pt-28 sm:pt-32 pb-4 flex-1 flex flex-col justify-start">
        {/* Dark vignette — text legibility over 3D canvas */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 110% at 50% 50%, rgba(5,5,5,0.80) 0%, rgba(5,5,5,0.4) 55%, transparent 100%)",
          }}
        />

        {/* Studio badge */}
        <div className="mb-6 flex justify-center relative" data-hero="badge">
          <span className="kb-badge">
            <span className="w-1 h-1 rounded-full bg-[#E4E4E7]" />
            {studio.positioning}&nbsp;·&nbsp;Indonesia
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold text-white mb-5 relative"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 5rem)",
            lineHeight: 1.07,
            letterSpacing: "-0.03em",
          }}
        >
          <span className="block" data-hero="h1-line">Enterprise Architecture.</span>
          <span className="block kb-gradient-text" data-hero="h1-line">Craft-Level Design.</span>
          <span className="block" data-hero="h1-line">Two-Principal Agility.</span>
        </h1>

        {/* Sub-headline */}
        <p
          data-hero="subline"
          className="font-body text-[#A1A1AA] mb-8 max-w-xl mx-auto relative"
          style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)", lineHeight: 1.6 }}
        >
          KaryaByte pairs enterprise-grade system engineering with craft-level
          design execution — two principals,{" "}
          <span className="text-[#E4E4E7]/90">zero agency overhead.</span>
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center relative">
          <a
            data-hero="cta"
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#050505] text-sm font-semibold font-display tracking-tight hover:bg-[#E4E4E7] transition-colors duration-200"
          >
            Start a Project
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            data-hero="cta"
            href="#works"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 text-[#A1A1AA] text-sm font-body hover:text-white hover:border-white/20 transition-colors duration-200"
          >
            View Our Work
          </a>
        </div>

        {/* Explicit spacer — keeps metrics strip close without flex-grow pushing it down */}
        <div className="mt-8 flex-1" aria-hidden="true" />
      </div>

      {/* ── Metrics strip ── */}
      <div
        data-hero="metrics-strip"
        className="kb-container relative z-10 w-full pb-6"
      >
        <div data-hero="divider" className="kb-divider mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`text-center px-3 ${
                i < metrics.length - 1 ? "md:border-r border-white/[0.06]" : ""
              }`}
            >
              <div
                className="font-display font-bold text-white mb-0.5"
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                <span
                  data-metric
                  data-target={m.target}
                  data-suffix={
                    m.unit.trim() === "%"
                      ? "%"
                      : m.unit.includes("+") || m.value.includes("+")
                      ? "+"
                      : ""
                  }
                  data-prefix=""
                >
                  {m.value}
                </span>
                {m.unit && !m.unit.includes("%") && !m.unit.includes("+") && (
                  <span className="text-[#A1A1AA] text-base font-normal ml-1">
                    {m.unit.replace(" Principals", "")}
                  </span>
                )}
              </div>
              <div className="font-mono text-[#A1A1AA] text-[10px] tracking-widest uppercase leading-tight">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 pb-5">
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        <span className="font-mono text-[#A1A1AA]/40 text-[9px] tracking-[0.2em] uppercase">
          Scroll
        </span>
      </div>
    </section>
  );
}

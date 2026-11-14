"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { deliveryPipeline } from "../data/services";
import { usePipelineAnimations } from "../hooks/useSectionAnimations";

const ownerLabel: Record<string, string> = {
  systems: "SYS.ENG",
  design: "DSN.PM",
  both: "BOTH",
};
const ownerColor: Record<string, string> = {
  systems: "#E4E4E7",
  design: "#A1A1AA",
  both: "#c8c8d0",
};

export default function Pipeline() {
  const [activePhase, setActivePhase] = useState(0);
  const phase = deliveryPipeline[activePhase];
  const sectionRef = useRef<HTMLElement>(null);
  usePipelineAnimations(sectionRef);

  return (
    <section ref={sectionRef} id="pipeline" className="kb-section" aria-label="Delivery Pipeline">
      <div className="kb-container">

        {/* ── Header ── */}
        <div className="mb-16 md:mb-20 max-w-3xl" data-anim="pipeline-header">
          <div className="kb-badge mb-5">DELIVERY PIPELINE</div>
          <h2 className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            From First Brief
            <br />
            <span className="kb-gradient-text">to Live in Production.</span>
          </h2>
          <p className="font-body text-[#A1A1AA]"
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.125rem)", lineHeight: 1.7 }}>
            Our process eliminates handoff-induced context loss. Engineering and
            design operate in one closed loop across every phase.
          </p>
        </div>

        {/* ── Phase selector (desktop horizontal tabs) ── */}
        <div className="hidden md:grid grid-cols-4 gap-0 mb-10 relative">
          {/* connector line */}
          <div data-anim="connector-line" aria-hidden="true" className="absolute top-7 left-[12.5%] right-[12.5%] h-px"
            style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.08))" }} />

          {deliveryPipeline.map((p, i) => (
            <button
              key={p.number}
              data-anim="phase-node"
              onClick={() => setActivePhase(i)}
              className={clsx(
                "relative flex flex-col items-center px-4 text-center group transition-all duration-300 cursor-pointer",
              )}
              aria-pressed={activePhase === i}
            >
              {/* Phase node */}
              <div className={clsx(
                "relative z-10 mb-4 w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300",
                activePhase === i
                  ? "border-white/40 bg-white/10 shadow-[0_0_24px_rgba(228,228,231,0.15)]"
                  : "border-white/10 bg-[#0c0c0e]/80 group-hover:border-white/20"
              )}>
                <span className={clsx(
                  "font-mono text-xs transition-colors",
                  activePhase === i ? "text-white" : "text-[#A1A1AA] group-hover:text-white"
                )}>{p.number}</span>
              </div>
              {/* Active glow dot */}
              {activePhase === i && (
                <span className="absolute top-6 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/60 animate-pulse-slow" />
              )}
              <span className={clsx(
                "kb-badge mb-2 text-[9px] transition-all",
                activePhase === i ? "border-white/20 text-white" : ""
              )} style={{ color: activePhase === i ? ownerColor[p.owner] : undefined }}>
                {ownerLabel[p.owner]}
              </span>
              <h3 className={clsx(
                "font-display font-semibold text-sm leading-snug transition-colors",
                activePhase === i ? "text-white" : "text-[#A1A1AA] group-hover:text-white"
              )} style={{ letterSpacing: "-0.01em" }}>{p.title}</h3>
            </button>
          ))}
        </div>

        {/* ── Active phase detail card (desktop) ── */}
        <div className="hidden md:block mb-16">
          <div className="kb-card p-8 lg:p-10 relative overflow-hidden transition-all duration-500">
            {/* Accent line colored by owner */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${ownerColor[phase.owner]}40, transparent)` }} />

            <div className="grid md:grid-cols-[1fr_280px] gap-8 lg:gap-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[#A1A1AA]/40 text-xs">Phase {phase.number}</span>
                  <span className="kb-badge text-[9px]" style={{ color: ownerColor[phase.owner] }}>
                    {ownerLabel[phase.owner]}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white mb-3"
                  style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", letterSpacing: "-0.025em" }}>
                  {phase.title}
                </h3>
                <p className="font-body text-[#A1A1AA] leading-relaxed">{phase.description}</p>
              </div>
              <div>
                <div className="font-mono text-[#A1A1AA]/40 text-[10px] tracking-widest uppercase mb-4">
                  Deliverables
                </div>
                <ul className="space-y-3">
                  {phase.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm font-body text-[#A1A1AA]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: ownerColor[phase.owner] }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Phase navigation arrows */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/[0.06]">
              <button onClick={() => setActivePhase(i => Math.max(0, i - 1))}
                disabled={activePhase === 0}
                className="px-4 py-2 rounded-full border border-white/10 text-xs font-mono text-[#A1A1AA] hover:text-white hover:border-white/20 disabled:opacity-30 transition-all">
                ← Previous
              </button>
              <div className="flex gap-1.5">
                {deliveryPipeline.map((_, i) => (
                  <button key={i} onClick={() => setActivePhase(i)}
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      activePhase === i ? "bg-white scale-125" : "bg-white/20 hover:bg-white/40"
                    )} />
                ))}
              </div>
              <button onClick={() => setActivePhase(i => Math.min(deliveryPipeline.length - 1, i + 1))}
                disabled={activePhase === deliveryPipeline.length - 1}
                className="px-4 py-2 rounded-full border border-white/10 text-xs font-mono text-[#A1A1AA] hover:text-white hover:border-white/20 disabled:opacity-30 transition-all">
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile vertical timeline ── */}
        <div className="md:hidden flex flex-col gap-0 mb-16">
          {deliveryPipeline.map((p, i) => (
            <button key={p.number} onClick={() => setActivePhase(i)}
              className="flex gap-5 relative text-left w-full">
              <div className="flex flex-col items-center flex-shrink-0 w-10">
                <div className={clsx(
                  "w-10 h-10 rounded-full border flex items-center justify-center z-10 transition-all",
                  activePhase === i ? "border-white/40 bg-white/10" : "border-white/10 bg-[#0c0c0e]/80"
                )}>
                  <span className="font-mono text-xs text-[#A1A1AA]">{p.number}</span>
                </div>
                {i < deliveryPipeline.length - 1 && (
                  <div className="w-px flex-1 mt-1 mb-1 bg-white/[0.06]" style={{ minHeight: "40px" }} />
                )}
              </div>
              <div className={clsx("pb-8 flex-1 min-w-0 transition-opacity", activePhase === i ? "opacity-100" : "opacity-60")}>
                <span className="kb-badge text-[9px] mb-2 inline-flex">{ownerLabel[p.owner]}</span>
                <h3 className="font-display font-semibold text-white mb-2 leading-snug">{p.title}</h3>
                {activePhase === i && (
                  <>
                    <p className="font-body text-[#A1A1AA] text-sm leading-relaxed mb-3">{p.description}</p>
                    <ul className="space-y-1.5">
                      {p.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-xs font-body text-[#A1A1AA]">
                          <span className="mt-1 w-1 h-1 rounded-full bg-[#A1A1AA]/40 flex-shrink-0" />{d}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
